import { PLAYER, isSport } from "../../../common/index.ts";
import { idb } from "../../db/index.ts";
import { g } from "../../util/index.ts";

/**
 * One-time migration function to convert all players from old contract system
 * to new scholarship system for college basketball.
 *
 * Run this from the browser console with: await bbgm.debug.migrateToScholarships()
 */
const migrateToScholarships = async () => {
	if (!isSport("basketball")) {
		console.log("Migration only applies to basketball leagues");
		return;
	}

	console.log("Starting migration to scholarship system...");

	// Get all non-retired players
	const players = await idb.cache.players.indexGetAll("playersByTid", [
		PLAYER.FREE_AGENT,
		Infinity,
	]);

	let migratedCount = 0;
	const season = g.get("season");

	for (const p of players) {
		// Skip if already migrated (has scholarship.status)
		if (p.scholarship?.status) {
			continue;
		}

		// Skip retired players
		if (p.tid === PLAYER.RETIRED) {
			continue;
		}

		// Calculate years remaining from college class
		let yearsRemaining = 4; // Default to freshman
		if (p.collegeClass) {
			if (p.collegeClass === "Fr") {
				yearsRemaining = 4;
			} else if (p.collegeClass === "So") {
				yearsRemaining = 3;
			} else if (p.collegeClass === "Jr") {
				yearsRemaining = 2;
			} else if (p.collegeClass === "Sr") {
				yearsRemaining = 1;
			}
		}

		// Determine scholarship status (players on teams get scholarships, free agents are walk-ons)
		const status = p.tid >= 0 ? "scholarship" : "walk-on";

		// Create new scholarship object
		p.scholarship = {
			status,
			yearsRemaining,
			originalClass: season - (4 - yearsRemaining),
			amount: 0,
			exp: season + yearsRemaining,
		};

		// Update contract to point to scholarship
		p.contract = p.scholarship;

		await idb.cache.players.put(p);
		migratedCount++;
	}

	console.log(`Migration complete! Migrated ${migratedCount} players to scholarship system.`);
	console.log("Refresh the page to see the changes.");

	return {
		success: true,
		migratedCount,
		totalPlayers: players.length,
	};
};

export default migrateToScholarships;
