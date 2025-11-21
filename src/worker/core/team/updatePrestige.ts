import { g, helpers } from "../../util/index.ts";
import { idb } from "../../db/index.ts";
import type { Team, TeamSeason } from "../../../common/types.ts";

/**
 * Calculate prestige change for a team based on season performance
 *
 * Prestige is affected by:
 * - Tournament success (biggest factor)
 * - Regular season performance
 * - Conference championships
 * - Long-term decay toward prestigeBase (historical baseline)
 */
const updatePrestige = async (t: Team, teamSeason: TeamSeason) => {
	// Get current prestige (or initialize from prestigeBase)
	const prestigeBase = t.prestigeBase ?? 70;
	const currentPrestige = t.prestige ?? prestigeBase;

	let prestigeChange = 0;

	// TOURNAMENT SUCCESS (biggest factor)
	const playoffRoundsWon = teamSeason.playoffRoundsWon;
	const maxRounds = g.get("numGamesPlayoffSeries", teamSeason.season).length;

	if (playoffRoundsWon >= maxRounds) {
		// Won championship!
		prestigeChange += 8;
	} else if (playoffRoundsWon >= maxRounds - 1) {
		// Championship game (lost)
		prestigeChange += 5;
	} else if (playoffRoundsWon >= maxRounds - 2) {
		// Final Four / semifinals
		prestigeChange += 3;
	} else if (playoffRoundsWon >= maxRounds - 3) {
		// Sweet 16 / quarterfinals
		prestigeChange += 2;
	} else if (playoffRoundsWon > 0) {
		// Made tournament, lost early
		prestigeChange += 0.5;
	} else if (playoffRoundsWon === -1) {
		// Missed tournament entirely
		prestigeChange -= 2;
	}

	// REGULAR SEASON PERFORMANCE
	const gamesPlayed = teamSeason.won + teamSeason.lost + teamSeason.tied + teamSeason.otl;
	const winp = helpers.calcWinp(teamSeason);

	if (gamesPlayed > 0) {
		if (winp >= 0.75) {
			// Elite season (25-9 or better in 34 games)
			prestigeChange += 2;
		} else if (winp >= 0.65) {
			// Very good season (22-12 or better)
			prestigeChange += 1;
		} else if (winp >= 0.50) {
			// Average season
			prestigeChange += 0;
		} else if (winp >= 0.35) {
			// Below average
			prestigeChange -= 0.5;
		} else {
			// Terrible season (<12 wins in 34 games)
			prestigeChange -= 1.5;
		}
	}

	// CONFERENCE PERFORMANCE
	const confGames = teamSeason.wonConf + teamSeason.lostConf + teamSeason.tiedConf + teamSeason.otlConf;
	if (confGames > 0) {
		const confWinp = (teamSeason.wonConf + teamSeason.tiedConf / 2) / confGames;
		if (confWinp >= 0.80) {
			// Dominated conference
			prestigeChange += 1;
		}
	}

	// DECAY TOWARD BASELINE
	// Over many years, prestige should trend back toward historical baseline
	// This prevents permanent changes and maintains some historical hierarchy
	const decayRate = 0.05; // 5% per year
	const decayAmount = (prestigeBase - currentPrestige) * decayRate;
	prestigeChange += decayAmount;

	// Calculate new prestige
	let newPrestige = currentPrestige + prestigeChange;

	// Bound to 0-100
	newPrestige = helpers.bound(newPrestige, 0, 100);

	// Round to 1 decimal place
	newPrestige = Math.round(newPrestige * 10) / 10;

	// Update team prestige
	await idb.cache.teams.put({
		...t,
		prestige: newPrestige,
	});

	// Store prestige in teamSeason for historical tracking
	teamSeason.prestige = newPrestige;

	return newPrestige;
};

export default updatePrestige;
