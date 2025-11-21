import { idb } from "../db/index.ts";
import { g, helpers } from "../util/index.ts";
import type {
	UpdateEvents,
	ViewInput,
} from "../../common/types.ts";

type SeriesTeam = {
	abbrev: string;
	cid: number;
	imgURL?: string;
	imgURLSmall?: string;
	pts?: number;
	sPts?: number;
	region: string;
	regularSeason: {
		won: number;
		lost: number;
		tied?: number;
		otl?: number;
	};
	seed: number;
	tid: number;
	winp: number;
	won?: number;
};

const updateConferenceTournaments = async (
	inputs: ViewInput<"conferenceTournaments">,
	updateEvents: UpdateEvents,
	state: any,
): Promise<
	| {
			confNames: { text: string; key: number }[];
			finalMatchups: boolean;
			matchups: {
				matchup: [number, number];
				rowspan: number;
			}[][];
			numGamesPlayoffSeries: number[];
			numGamesToWinSeries: number[];
			season: number;
			series: {
				home: SeriesTeam;
				away?: SeriesTeam;
			}[][];
			selectedCid: number;
			userTid: number;
	  }
	| undefined
> => {
	if (
		updateEvents.includes("firstRun") ||
		updateEvents.includes("gameSim") ||
		inputs.season !== state.season ||
		inputs.cid !== state.cid
	) {
		const conferenceTournaments = await idb.cache.conferenceTournaments.get(
			inputs.season,
		);

		if (!conferenceTournaments) {
			return undefined;
		}

		// Find tournament for selected conference
		const selectedCid = inputs.cid ?? g.get("confs", inputs.season)[0]!.cid;
		const tournament = conferenceTournaments.tournaments.find(
			(t) => t.cid === selectedCid,
		);

		if (!tournament) {
			return undefined;
		}

		const series = tournament.series;
		const finalMatchups = true; // Conference tournaments are always final once created

		await helpers.augmentSeries(series, inputs.season);

		// Because augmentSeries mutates series, this is for TypeScript
		const series2 = series as {
			home: SeriesTeam;
			away?: SeriesTeam;
		}[][];

		// Formatting for the table in playoffs.html - same logic as playoffs
		const matchups: {
			rowspan: number;
			matchup: [number, number];
		}[][] = [];

		for (let i = 0; i < 2 ** (series.length - 2); i++) {
			matchups[i] = [];
		}

		// Fill in with each round. Good lord, this is confusing, due to having to assemble it for an HTML table with rowspans.
		for (let i = 0; i < series.length; i++) {
			let numGamesInSide = 2 ** (series.length - i - 2);

			if (numGamesInSide < 1) {
				numGamesInSide = 1;
			}

			const rowspan = 2 ** i;

			for (let j = 0; j < numGamesInSide; j++) {
				matchups[j * rowspan]!.splice(i, 0, {
					rowspan,
					matchup: [i, j],
				});

				if (series.length !== i + 1) {
					matchups[j * rowspan]!.splice(i, 0, {
						rowspan,
						matchup: [i, numGamesInSide + j],
					});
				}
			}
		}

		const confNames = g
			.get("confs", inputs.season)
			.map((conf) => ({ text: conf.name, key: conf.cid }));

		// Conference tournaments are always single-elimination (1 game per series)
		const numGamesPlayoffSeries = series.map(() => 1);

		return {
			confNames,
			finalMatchups,
			matchups,
			numGamesPlayoffSeries,
			numGamesToWinSeries: numGamesPlayoffSeries.map(
				helpers.numGamesToWinSeries,
			),
			season: inputs.season,
			series: series2,
			selectedCid,
			userTid: g.get("userTid"),
		};
	}
};

export default updateConferenceTournaments;
