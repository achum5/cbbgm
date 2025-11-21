import {
	PlayoffMatchup,
	ResponsiveTableWrapper,
} from "../components/index.tsx";
import useTitleBar from "../hooks/useTitleBar.tsx";
import type { View } from "../../common/types.ts";
import { helpers } from "../util/index.ts";

const ConferenceTournaments = ({
	confNames,
	finalMatchups,
	matchups,
	numGamesPlayoffSeries,
	numGamesToWinSeries,
	season,
	series,
	selectedCid,
	userTid,
}: View<"conferenceTournaments">) => {
	useTitleBar({
		title: "Conference Tournaments",
		jumpTo: true,
		jumpToSeason: season,
		dropdownView: "conference_tournaments",
		dropdownFields: {
			seasons: season,
		},
	});

	// Find the highest round that has actual matchups (not all -1)
	let maxActiveRound = -1;
	for (let i = series.length - 1; i >= 0; i--) {
		const round = series[i]!;
		const hasActiveMatchup = round.some(
			(matchup) =>
				matchup.home.tid !== -1 || (matchup.away && matchup.away.tid !== -1),
		);
		if (hasActiveMatchup) {
			maxActiveRound = i;
			break;
		}
	}

	// Use all rounds up to and including the highest active round
	const numRounds = maxActiveRound + 1;
	const activeSeries = series.slice(0, numRounds);

	const numGamesPlayoffSeriesReflected: (number | undefined)[] = [
		...numGamesPlayoffSeries.slice(0, numRounds),
		...[...numGamesPlayoffSeries.slice(0, numRounds)].reverse().slice(1),
	];
	for (const [i, row] of activeSeries.entries()) {
		if (row.length === 0) {
			numGamesPlayoffSeriesReflected[i] = undefined;
			numGamesPlayoffSeriesReflected[
				numGamesPlayoffSeriesReflected.length - 1 - i
			] = undefined;
		}
	}

	// Filter matchups to only show rounds that have been determined
	const activeMatchups = matchups.map((row) =>
		row.filter((m) => m.matchup[0] < numRounds),
	).filter((row) => row.length > 0);

	if (numRounds === 0) {
		return finalMatchups ? (
			<p>There was no conference tournament this season.</p>
		) : (
			<p>
				The conference tournament has not started yet. Check back after the
				regular season ends.
			</p>
		);
	}

	const maxWidth = 210 * (2 * numRounds - 1);

	const tdStyle = { width: `${100 / (numRounds * 2 - 1)}%` };

	// Hide "Best of X" footer if it's the same number of games every series (which it always is for conference tournaments - single elimination)
	const showFooter = numGamesPlayoffSeries.some(
		(numGames) => numGames !== numGamesPlayoffSeries[0],
	);

	return (
		<>
			{confNames.length > 1 && (
				<div className="mb-3">
					<div className="btn-group" role="group">
						{confNames.map((conf) => (
							<a
								key={conf.key}
								href={helpers.leagueUrl([
									"conference_tournaments",
									season,
									conf.key,
								])}
								className={`btn btn-sm ${
									conf.key === selectedCid
										? "btn-primary"
										: "btn-light-bordered"
								}`}
							>
								{conf.text}
							</a>
						))}
					</div>
				</div>
			)}
			<div style={{ maxWidth }}>
			{!finalMatchups ? (
				<p>
					This is what the conference tournament bracket would be if the season
					ended right now.
				</p>
			) : null}

			<ResponsiveTableWrapper className={showFooter ? "mb-1" : "mb-3"}>
				<table className="table-sm w-100">
					<tbody>
						{activeMatchups.map((row, i) => (
							<tr key={i}>
								{row.map((m, j) => {
									return (
										<td key={j} rowSpan={m.rowspan} style={tdStyle}>
											<PlayoffMatchup
												numGamesToWinSeries={numGamesToWinSeries[m.matchup[0]]}
												season={season}
												series={activeSeries[m.matchup[0]]![m.matchup[1]]}
												userTid={userTid}
											/>
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
					{showFooter ? (
						<tfoot>
							<tr className="text-center text-body-secondary">
								{numGamesPlayoffSeriesReflected.map((numGames, i) => {
									let text = null;
									if (numGames !== undefined) {
										text = `Best of ${numGames}`;
									}

									return <td key={i}>{text}</td>;
								})}
							</tr>
						</tfoot>
					) : null}
				</table>
			</ResponsiveTableWrapper>
			</div>
		</>
	);
};

export default ConferenceTournaments;
