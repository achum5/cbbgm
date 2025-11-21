import { idb } from "../../db/index.ts";
import { g, helpers } from "../../util/index.ts";
import type { Conditions, PhaseReturn } from "../../../common/types.ts";

/**
 * Handles the "After Trade Deadline" phase - a brief phase before playoffs
 * In the original pro basketball game, this was when trades were locked but playoffs hadn't started yet
 * For college basketball, this can serve as a transition phase before the NCAA tournament
 */
const newPhaseAfterTradeDeadline = async (
	conditions: Conditions,
): Promise<PhaseReturn> => {
	await idb.cache.negotiations.clear();

	return {
		redirect: {
			url: helpers.leagueUrl(["playoffs"]),
			text: "View playoffs",
		},
	};
};

export default newPhaseAfterTradeDeadline;
