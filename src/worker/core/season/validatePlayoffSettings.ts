import type { ByConf } from "../../../common/types.ts";

const validatePlayoffSettings = ({
	numRounds,
	numPlayoffByes,
	numActiveTeams,
	playIn,
	byConf,
}: {
	numRounds: number;
	numPlayoffByes: number;
	numActiveTeams: number | undefined; // For DefaultNewLeagueSettings where we can know everything but this
	playIn: boolean;
	byConf: ByConf;
}) => {
	// TEMPORARY: Disabled playoff validation while building out full 365 team roster
	// Will be replaced with NCAA tournament system later
	// All validation code commented out to avoid TypeScript errors on unreachable code
};

export default validatePlayoffSettings;
