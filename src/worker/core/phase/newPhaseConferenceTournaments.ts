import { season } from "../index.ts";
import { idb } from "../../db/index.ts";
import { g, helpers, logEvent, orderTeams } from "../../util/index.ts";
import type {
	Conditions,
	PhaseReturn,
	ConferenceTournament,
	PlayoffSeriesTeam,
} from "../../../common/types.ts";
import { groupBy } from "../../../common/utils.ts";

const genTeam = (
	t: { tid: number; seasonAttrs: { cid: number } },
	seed: number,
): PlayoffSeriesTeam => {
	return {
		tid: t.tid,
		cid: t.seasonAttrs.cid,
		seed,
		won: 0,
	};
};

// Generate single-elimination bracket for a conference
const makeConferenceTournamentBracket = (
	teams: any[],
	numTournamentTeams: number,
) => {
	// Determine number of rounds (e.g., 8 teams = 3 rounds)
	const numRounds = Math.ceil(Math.log2(numTournamentTeams));

	// Create matchups for first round
	const seeds: [number, number][] = [];
	for (let i = 0; i < numTournamentTeams / 2; i++) {
		seeds.push([i, numTournamentTeams - 1 - i]);
	}

	const firstRound = seeds.map((matchup) => {
		const home = genTeam(teams[matchup[0]]!, matchup[0] + 1);
		const away = genTeam(teams[matchup[1]]!, matchup[1] + 1);

		return {
			home,
			away,
		};
	});

	// Create empty rounds for subsequent rounds
	const series: {
		home: PlayoffSeriesTeam;
		away?: PlayoffSeriesTeam;
		gids?: number[];
	}[][] = [firstRound];

	for (let i = 1; i < numRounds; i++) {
		const numMatchups = Math.pow(2, numRounds - i - 1);
		series.push(
			Array(numMatchups).fill({
				home: { tid: -1, cid: -1, seed: -1, won: 0 },
				away: undefined,
			}),
		);
	}

	return series;
};

const newPhaseConferenceTournaments = async (
	conditions: Conditions,
): Promise<PhaseReturn> => {
	// Get all teams with their season stats
	const teams = await idb.getCopies.teamsPlus(
		{
			attrs: ["tid"],
			seasonAttrs: [
				"cid",
				"did",
				"won",
				"lost",
				"tied",
				"otl",
				"winp",
				"pts",
				"wonDiv",
				"lostDiv",
				"tiedDiv",
				"otlDiv",
				"wonConf",
				"lostConf",
				"tiedConf",
				"otlConf",
			],
			stats: ["pts", "oppPts", "gp"],
			season: g.get("season"),
			showNoStats: true,
		},
		"noCopyCache",
	);

	// Group teams by conference
	const teamsByConf = groupBy(teams, (t) => t.seasonAttrs.cid);

	const tournaments: ConferenceTournament[] = [];

	// Generate tournament for each conference
	for (const conf of g.get("confs", "current")) {
		const teamsInConf = teamsByConf[conf.cid];

		if (!teamsInConf || teamsInConf.length === 0) {
			continue;
		}

		// Sort teams by conference record
		const sortedTeams = await orderTeams(teamsInConf, teams);

		// Determine tournament size (8 teams for most conferences, adjust based on conference size)
		let numTournamentTeams = 8;
		if (sortedTeams.length < 8) {
			// If conference has fewer than 8 teams, use power of 2
			numTournamentTeams = sortedTeams.length >= 4 ? 4 : 2;
		}

		// Take top teams for tournament
		const tournamentTeams = sortedTeams.slice(0, numTournamentTeams);

		// Generate bracket
		const series = makeConferenceTournamentBracket(
			tournamentTeams,
			numTournamentTeams,
		);

		// Log teams making tournament
		for (let i = 0; i < tournamentTeams.length; i++) {
			const t = tournamentTeams[i]!;
			logEvent(
				{
					type: "playoffs",
					text: `The <a href="${helpers.leagueUrl([
						"roster",
						`${g.get("teamInfoCache")[t.tid]?.abbrev}_${t.tid}`,
						g.get("season"),
					])}">${
						g.get("teamInfoCache")[t.tid]?.name
					}</a> made the <a href="${helpers.leagueUrl([
						"conference_tournaments",
						g.get("season"),
					])}">${conf.name} tournament</a> as the #${i + 1} seed.`,
					showNotification: t.tid === g.get("userTid"),
					tids: [t.tid],
					score: 0,
				},
				conditions,
			);
		}

		tournaments.push({
			cid: conf.cid,
			currentRound: 0,
			complete: false,
			series,
		});
	}

	// Save all tournaments to database
	await idb.cache.conferenceTournaments.put({
		season: g.get("season"),
		tournaments,
	});

	// Start scheduling the first day of tournaments
	await season.newScheduleConferenceTournamentsDay();

	return {
		redirect: {
			url: helpers.leagueUrl(["conference_tournaments"]),
			text: "View conference tournaments",
		},
		updateEvents: ["gameSim"],
	};
};

export default newPhaseConferenceTournaments;
