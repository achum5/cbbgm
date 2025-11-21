import { finances } from "../index.ts";
import { isSport, PHASE } from "../../../common/index.ts";
import { facilitiesEffectMood } from "../../../common/budgetLevels.ts";
import type { MoodComponents, Player } from "../../../common/types.ts";
import { idb } from "../../db/index.ts";
import { g, helpers, local } from "../../util/index.ts";

const getMinFractionDiff = async (pid: number, tid: number) => {
	if (!isSport("basketball")) {
		return 0;
	}

	if (!local.minFractionDiffs) {
		const season = g.get("season");
		const playersAll = await idb.cache.players.getAll();

		const players = [];
		for (const p of playersAll) {
			let stats;
			for (let i = p.stats.length - 1; i >= 0; i--) {
				if (p.stats[i].season === season && !p.stats[i].playoffs) {
					stats = p.stats[i];
				} else if (p.stats[i] < season) {
					break;
				}
			}

			if (stats) {
				if (stats.minAvailable !== undefined && stats.minAvailable > 500) {
					players.push({
						pid: p.pid,
						tid: stats.tid,
						value: p.valueNoPot,

						// Fraction of available minutes that this player played
						fraction: stats.min / stats.minAvailable,
					});
				}
			}
		}

		players.sort((a, b) => b.value - a.value);

		local.minFractionDiffs = {};

		if (players.length < 100) {
			return 0;
		}

		// Logistic regression would be better than binning to find expected value, but no good library
		const BIN_SIZE = 20;
		const numBins = Math.ceil(players.length / BIN_SIZE);
		for (let i = 0; i < numBins; i++) {
			const binPlayers = players.slice(i * BIN_SIZE, (i + 1) * BIN_SIZE);
			let average = 0;
			for (const p of binPlayers) {
				average += p.fraction;
			}
			average /= binPlayers.length;
			for (const p of binPlayers) {
				local.minFractionDiffs[p.pid] = {
					tid: p.tid,
					diff: p.fraction - average,
				};
			}
		}
	}

	const p = local.minFractionDiffs[pid];
	if (!p || p.tid !== tid) {
		return 0;
	}

	return p.diff;
};

// Make components -2 to 2, then scale with traits to -5 to 5
const moodComponents = async (
	p: Player,
	tid: number,
): Promise<MoodComponents> => {
	const season = g.get("season");
	const phase = g.get("phase");

	const teamSeasons = await idb.cache.teamSeasons.indexGetAll(
		"teamSeasonsByTidSeason",
		[
			[tid, season - 2],
			[tid, season],
		],
	);
	const currentTeamSeason = teamSeasons.find((ts) => ts.season === season);

	const teams = helpers.addPopRank(await idb.cache.teams.getAll());
	const t = teams.find((t) => t.tid === tid);
	if (!t) {
		throw new Error(`tid ${tid} not found`);
	}

	const components: MoodComponents = {
		prestige: 0,
		facilities: 0,
		teamPerformance: 0,
		tournament: 0,
		homeProximity: 0,
		playingTime: 0,
		difficulty: 0,
		relatives: 0,
	};

	if (p.customMoodItems) {
		for (const row of p.customMoodItems) {
			if (row.tid === undefined || row.tid === tid) {
				if (!components.custom) {
					components.custom = [];
				}

				components.custom.push({
					amount: row.amount,
					text: row.text,
				});
			}
		}
	}

	{
		// PRESTIGE: -2 to 2, based on school prestige (0-100 scale, dynamic)
		// Falls back to prestigeBase (historical baseline) if prestige not yet set
		const prestige = t.prestige ?? t.prestigeBase ?? 70;
		// Convert 0-100 to -2 to 2 scale (70 is average = 0)
		components.prestige = ((prestige - 70) / 30) * 2;
		components.prestige = helpers.bound(components.prestige, -2, 2);
	}

	{
		// FACILITIES: -2 to 2, based on facilities level
		const facilitiesLevel = await finances.getLevelLastThree("facilities", {
			t,
			teamSeasons,
		});
		components.facilities = facilitiesEffectMood(facilitiesLevel);
	}

	{
		// TEAM PERFORMANCE: -2 means no playoffs and 25% winning percentage. +2 means championship and 60% winning percentage, or 75% winning percentage
		if (currentTeamSeason) {
			const projectedRecord = {
				won: currentTeamSeason.won,
				lost: currentTeamSeason.lost,
				tied: currentTeamSeason.tied,
				otl: currentTeamSeason.otl,
			};

			// If a custom league file starts after the regular season, don't assume all teams have 0 winning percentage
			const leagueFileFromAfterSeason =
				g.get("phase") >= PHASE.PLAYOFFS &&
				projectedRecord.won === 0 &&
				projectedRecord.lost === 0 &&
				projectedRecord.tied === 0 &&
				projectedRecord.otl === 0;
			if (!leagueFileFromAfterSeason) {
				let wonTitle = false;

				// If season ongoing, project record and playoff success based on last year
				if (phase < PHASE.PLAYOFFS) {
					const previousSeason = teamSeasons.find(
						(ts) => ts.season === season - 1,
					);
					const previousRecord = {
						won: previousSeason ? previousSeason.won : 0,
						lost: previousSeason ? previousSeason.lost : 0,
						tied: previousSeason ? previousSeason.tied : 1,
						otl: previousSeason ? previousSeason.otl : 0,
					};

					const fractionComplete =
						(projectedRecord.won +
							projectedRecord.lost +
							projectedRecord.tied +
							projectedRecord.otl) /
						g.get("numGames");

					const currentGames =
						projectedRecord.won +
						projectedRecord.lost +
						projectedRecord.tied +
						projectedRecord.otl;
					const previousGames =
						previousRecord.won +
						previousRecord.lost +
						previousRecord.tied +
						previousRecord.otl;

					const remainingGames = helpers.bound(
						g.get("numGames") - currentGames,
						0,
						Infinity,
					);

					for (const key of ["won", "lost", "tied", "otl"] as const) {
						const currentFraction =
							currentGames > 0 ? projectedRecord[key] / currentGames : 0;
						const previousFraction =
							previousGames > 0 ? previousRecord[key] / previousGames : 0;

						projectedRecord[key] +=
							(currentFraction * fractionComplete +
								previousFraction * (1 - fractionComplete)) *
							remainingGames;
					}

					if (previousSeason) {
						wonTitle =
							previousSeason.playoffRoundsWon >=
							g.get("numGamesPlayoffSeries", season - 1).length;
					}
				} else {
					wonTitle =
						currentTeamSeason.playoffRoundsWon >=
						g.get("numGamesPlayoffSeries", "current").length;
				}

				let winp = helpers.calcWinp(projectedRecord);
				if (wonTitle) {
					// If won title, equivalent to extra 15%, so 60% winp and title maxes it out
					winp += 0.15;
				}

				if (isSport("hockey")) {
					// 40% to 60% -> -2 to 2
					components.teamPerformance = -2 + ((winp - 0.4) * 4) / 0.2;
				} else {
					// 25% to 75% -> -2 to 2
					components.teamPerformance = -2 + ((winp - 0.25) * 4) / 0.5;
				}

				// Negative matters more
				if (isSport("basketball") && components.teamPerformance < 0) {
					components.teamPerformance *= 2;
				}

				// Set upper bound, in case went over due to playoff bonus
				components.teamPerformance = helpers.bound(
					components.teamPerformance,
					-Infinity,
					2,
				);
			}
		}
	}

	{
		// TOURNAMENT: -2 to 2, based on tournament success (conference + NCAA)
		if (currentTeamSeason) {
			const roundsWon = currentTeamSeason.playoffRoundsWon || 0;
			const maxRounds = g.get("numGamesPlayoffSeries", "current").length;

			// Check if this is a new league or before the first tournament
			const previousSeason = teamSeasons.find((ts) => ts.season === season - 1);
			const isBeforeFirstTournament =
				phase < PHASE.PLAYOFFS && // Haven't reached playoffs yet
				!previousSeason; // No previous season data

			if (isBeforeFirstTournament) {
				// New league - no tournament history yet, so neutral
				components.tournament = 0;
			} else if (roundsWon === 0) {
				// Actually didn't make tournament (or lost in conference tournament)
				components.tournament = -2;
			} else if (roundsWon >= maxRounds) {
				// Won championship!
				components.tournament = 2;
			} else {
				// Lost somewhere in tournament - linear scale from -1 to 1.5
				components.tournament = -1 + (roundsWon / maxRounds) * 3;
			}
		}
	}

	{
		// HOME PROXIMITY: -2 to 2, based on distance from hometown
		// Extract state from player's born.loc (format: "California, USA")
		const bornLoc = p.born.loc || "";
		const bornState = bornLoc.split(",")[0]?.trim() || "";

		// Map full state name to abbreviation
		const stateAbbreviations: Record<string, string> = {
			Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA",
			Colorado: "CO", Connecticut: "CT", Delaware: "DE", "District of Columbia": "DC",
			Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL",
			Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA",
			Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI", Minnesota: "MN",
			Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV",
			"New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
			"North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK",
			Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC",
			"South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT",
			Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY",
		};

		const bornStateAbbr = stateAbbreviations[bornState] || "";
		const teamState = t.state || "";

		if (bornStateAbbr && teamState) {
			if (bornStateAbbr === teamState) {
				// Playing in home state = big bonus
				components.homeProximity = 2;
			} else {
				// Not in home state = penalty (players want to be close to home)
				components.homeProximity = -1;
			}
		} else {
			// International player or unknown state = neutral
			components.homeProximity = 0;
		}
	}

	

	{
		// PLAYING TIME
		const diff = await getMinFractionDiff(p.pid, tid);
		components.playingTime = diff * 10;
	}

	{
		// Relatives
		if (p.relatives.length > 0) {
			const relativePids = new Set(p.relatives.map((relative) => relative.pid));
			const players = await idb.cache.players.indexGetAll("playersByTid", tid);
			const teamPids = new Set(players.map((p) => p.pid));
			const relativesOnTeam = teamPids.intersection(relativePids);
			components.relatives = 2 * relativesOnTeam.size;
		}
	}

	// Apply difficulty modulation
	const difficulty = g.get("difficulty");
	if (g.get("userTids").includes(tid)) {
		if (difficulty !== 0) {
			for (const key of helpers.keys(components)) {
				if (key === "custom") {
					continue;
				}

				// Higher difficulty should result in lower mood, but we don't want to swap signs because that'd make for weird output (like complaining about team success when you won the title... but it's okay to just have it at 0 and say nothing)
				if (difficulty > 0) {
					if (components[key] > 0) {
						components[key] /= 1 + difficulty;
					} else {
						components[key] *= 1 + difficulty;
					}
				} else {
					if (components[key] > 0) {
						components[key] *= 1 - difficulty;
					} else {
						components[key] /= 1 - difficulty;
					}
				}
			}
		}
	} else {
		// At default difficulty, make players more likely to refuse. Decrease this, and players will be more likely to enter free agency
		const amount = 0.5 - helpers.bound(difficulty / 2, -0.25, 0.25);
		for (const key of helpers.keys(components)) {
			if (key === "custom") {
				continue;
			}

			if (amount > 0) {
				if (components[key] > 0) {
					components[key] /= 1 + amount;
				} else {
					components[key] *= 1 + amount;
				}
			} else {
				if (components[key] > 0) {
					components[key] *= 1 - amount;
				} else {
					components[key] /= 1 - amount;
				}
			}
		}
	}

	// Bound all components - they don't all have the same bounds!
	components.prestige = helpers.bound(components.prestige, -2, 2);
	components.facilities = helpers.bound(components.facilities, -2, 2);
	components.teamPerformance = helpers.bound(
		components.teamPerformance,
		-Infinity,
		2,
	);
	components.tournament = helpers.bound(components.tournament, -2, 2);
	components.homeProximity = helpers.bound(components.homeProximity, -2, 2);
	
	components.playingTime = helpers.bound(components.playingTime, -Infinity, 2);

	// Apply traits modulation
	if (g.get("playerMoodTraits")) {
		if (p.moodTraits.includes("P")) {
			// Prestige trait: cares about school reputation and facilities
			components.prestige *= 2.5;
			components.facilities *= 2.0;
			components.homeProximity *= 0.5; // Less concerned about hometown
		}
		if (p.moodTraits.includes("T")) {
			// Playing Time trait: cares ONLY about minutes
			components.playingTime *= 3.0; // Very strong emphasis
			components.prestige *= 0.5;
			components.tournament *= 0.5;
		}
		if (p.moodTraits.includes("H")) {
			// Hometown trait: wants to play close to home
			components.homeProximity *= 3.0; // Very strong emphasis
			components.prestige *= 0.5; // Less concerned about school reputation
			components.tournament *= 0.5;
		}
		if (p.moodTraits.includes("W")) {
			// Winning trait: cares about team success and tournaments
			components.teamPerformance *= 2.5;
			components.tournament *= 2.5;
			components.playingTime *= 0.5; // Less concerned about minutes
		}
	}

	return components;
};

export default moodComponents;
