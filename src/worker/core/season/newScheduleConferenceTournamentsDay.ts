import setSchedule from "./setSchedule.ts";
import { idb } from "../../db/index.ts";
import { g, helpers } from "../../util/index.ts";
import type { PlayoffSeriesTeam } from "../../../common/types.ts";

// Play 2 home (true) then 2 away (false) and repeat, but ensure that the better team always gets the last game.
const betterSeedHome = (numGamesPlayoffSeries: number, gameNum: number) => {
	// For series lengths like 3, 7, 11, 15, etc., special case last 3 games to ensure the home team always gets the last game
	const needsSpecialEnding = (numGamesPlayoffSeries + 1) % 4 === 0;

	if (needsSpecialEnding) {
		// Special case for last 3 games
		if (gameNum >= numGamesPlayoffSeries - 3) {
			return (
				gameNum === numGamesPlayoffSeries - 3 ||
				gameNum === numGamesPlayoffSeries - 1
			);
		}
	}

	const num = Math.floor(gameNum / 2);
	return num % 2 === 0;
};

const seriesIsNotOver = (
	home: PlayoffSeriesTeam,
	away: PlayoffSeriesTeam | undefined,
	numGamesToWin: number,
): away is PlayoffSeriesTeam =>
	!!(away && home.won < numGamesToWin && away.won < numGamesToWin);

/**
 * Create a single day's schedule for in-progress conference tournaments.
 * Handles all 31 conferences simultaneously.
 *
 * @return {Promise.boolean} Resolves to true if all tournaments are over. Otherwise, false.
 */
const newScheduleConferenceTournamentsDay = async (): Promise<boolean> => {
	const conferenceTournaments = await idb.cache.conferenceTournaments.get(
		g.get("season"),
	);

	if (!conferenceTournaments) {
		throw new Error("No conference tournaments");
	}

	const allGamesToday: [number, number][] = [];
	let allTournamentsComplete = true;

	// Loop through all 31 conferences
	for (const tournament of conferenceTournaments.tournaments) {
		if (tournament.complete) {
			continue; // Skip completed tournaments
		}

		const { currentRound, series } = tournament;

		if (series.length === 0 || currentRound >= series.length) {
			// This conference's tournament is over
			tournament.complete = true;
			continue;
		}

		const tids: [number, number][] = [];
		const numGamesToWin = helpers.numGamesToWinSeries(
			g.get("numGamesPlayoffSeries", "current")[currentRound] ?? 1,
		);

		let minGamesPlayedThisRound = Infinity;
		for (const { away, home } of series[currentRound]!) {
			if (seriesIsNotOver(home, away, numGamesToWin)) {
				const numGames = home.won + away.won;
				if (numGames < minGamesPlayedThisRound) {
					minGamesPlayedThisRound = numGames;
				}
			}
		}

		// Try to schedule games if there are active series
		for (const { away, home } of series[currentRound]!) {
			if (seriesIsNotOver(home, away, numGamesToWin)) {
				const numGames = home.won + away.won;

				// Because live game sim is an individual game now, not a whole day, need to check if some series are ahead of others and therefore should not get a game today.
				if (numGames > minGamesPlayedThisRound) {
					continue;
				}

				// Make sure to set home/away teams correctly! Home for the lower seed is 1st, 2nd, 5th, and 7th games.
				if (
					betterSeedHome(
						g.get("numGamesPlayoffSeries", "current")[currentRound]!,
						numGames,
					)
				) {
					tids.push([home.tid, away.tid]);
				} else {
					tids.push([away.tid, home.tid]);
				}
			}
		}

		// If series are still in progress, add games to schedule
		if (tids.length > 0) {
			allGamesToday.push(...tids);
			allTournamentsComplete = false;
		} else {
			// This conference's round is done, advance to next round
			const teamsWon: PlayoffSeriesTeam[] = [];
			for (const { home, away } of series[currentRound]!) {
				let teamWon;
				if (home.won >= numGamesToWin || !away) {
					teamWon = helpers.deepCopy(home);
				} else {
					teamWon = helpers.deepCopy(away);
				}
				teamsWon.push(teamWon);
			}

			// If this was the final round, mark tournament complete and record champion
			if (currentRound === series.length - 1) {
				tournament.complete = true;
				tournament.champion = teamsWon[0]!.tid;
			} else {
				// Set matchups for next round
				for (let i = 0; i < teamsWon.length; i += 2) {
					const team1 = teamsWon[i]!;
					const team2 = teamsWon[i + 1]!;

					const firstTeamHome = team1.seed < team2.seed;

					const matchup = firstTeamHome
						? {
								home: team1,
								away: team2,
							}
						: {
								home: team2,
								away: team1,
							};
					matchup.home.pts = undefined;
					matchup.away.pts = undefined;
					matchup.home.sPts = undefined;
					matchup.away.sPts = undefined;
					matchup.home.won = 0;
					matchup.away.won = 0;
					series[currentRound + 1]![i / 2] = matchup;
				}

				tournament.currentRound += 1;
				allTournamentsComplete = false;
			}
		}
	}

	// Save updated tournaments
	await idb.cache.conferenceTournaments.put(conferenceTournaments);

	// Schedule all games from all conferences for today
	if (allGamesToday.length > 0) {
		await setSchedule(allGamesToday);
		return false; // Not done yet
	}

	// All conferences done!
	if (allTournamentsComplete) {
		return true; // Conference tournaments are over!
	}

	// Some conferences finished early, keep going
	return newScheduleConferenceTournamentsDay();
};

export default newScheduleConferenceTournamentsDay;
