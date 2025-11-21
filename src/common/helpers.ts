// This should never be directly imported. Instead, ui/util/helpers and ui/worker/helpers should be used.

import clone from "just-clone";
import type {
	TeamBasic,
	Phase,
	PlayerContract,
	GameAttributesLeague,
	RelativeType,
} from "./types.ts";
import getTeamInfos from "./getTeamInfos.ts";
import isSport from "./isSport.ts";
import { PHASE } from "./constants.ts";
import { orderBy } from "./utils.ts";

const getPopRanks = (
	teamSeasons: {
		// If these are teamSeason objects, disabled teams won't even have one. If these are some other kind of team object, disabled teams might be there.
		disabled?: boolean;
		pop?: number;
		tid: number;
	}[],
): number[] => {
	const teamsFiltered = teamSeasons.filter((t) => !t.disabled);

	const teamsSorted = orderBy(teamsFiltered, "pop", "desc");

	return teamSeasons.map((t) => {
		// Find the starting and ending ranks of all teams tied with the current team (if no tie, then startRank and endRank will be the same)
		let startRank;
		let endRank;
		for (const [i, t2] of teamsSorted.entries()) {
			if (t2.pop === t.pop || t2.tid === t.tid) {
				if (startRank === undefined) {
					startRank = i + 1;
				}
				endRank = i + 1;
			}
		}

		if (startRank === undefined || endRank === undefined) {
			// For disabled teams
			return teamsFiltered.length + 1;
		}

		return (startRank + endRank) / 2;
	});
};

function addPopRank<
	T extends { disabled?: boolean; pop?: number; tid: number },
>(teams: T[]): (T & { popRank: number })[] {
	const popRanks = getPopRanks(teams);

	return teams.map((t, i) => ({
		...t,
		popRank: popRanks[i]!,
	}));
}

const gameScore = (
	arg: Record<
		| "pts"
		| "fg"
		| "fga"
		| "fta"
		| "ft"
		| "orb"
		| "drb"
		| "stl"
		| "ast"
		| "blk"
		| "pf"
		| "tov",
		number
	>,
): number => {
	return (
		arg.pts +
		0.4 * arg.fg -
		0.7 * arg.fga -
		0.4 * (arg.fta - arg.ft) +
		0.7 * arg.orb +
		0.3 * arg.drb +
		arg.stl +
		0.7 * arg.ast +
		0.7 * arg.blk -
		0.4 * arg.pf -
		arg.tov
	);
};

const getTeamsDefault = (): TeamBasic[] => {
	let teams: TeamBasic[];
	if (isSport("baseball")) {
		teams = getTeamInfos([
			{
				tid: 0,
				cid: 1,
				did: 3,
				abbrev: "ATL",
			},
			{
				tid: 1,
				cid: 0,
				did: 0,
				abbrev: "BAL",
			},
			{
				tid: 2,
				cid: 1,
				did: 3,
				abbrev: "BKN",
			},
			{
				tid: 3,
				cid: 0,
				did: 0,
				abbrev: "BOS",
			},
			{
				tid: 4,
				cid: 1,
				did: 4,
				abbrev: "CHI",
			},
			{
				tid: 5,
				cid: 0,
				did: 1,
				abbrev: "CHW",
			},
			{
				tid: 6,
				cid: 1,
				did: 4,
				abbrev: "CIN",
			},
			{
				tid: 7,
				cid: 0,
				did: 1,
				abbrev: "CLE",
			},
			{
				tid: 8,
				cid: 0,
				did: 2,
				abbrev: "DAL",
			},
			{
				tid: 9,
				cid: 1,
				did: 5,
				abbrev: "DEN",
			},
			{
				tid: 10,
				cid: 0,
				did: 1,
				abbrev: "DET",
			},
			{
				tid: 11,
				cid: 0,
				did: 2,
				abbrev: "HOU",
			},
			{
				tid: 12,
				cid: 0,
				did: 1,
				abbrev: "KC",
			},
			{
				tid: 13,
				cid: 0,
				did: 2,
				abbrev: "LAE",
			},
			{
				tid: 14,
				cid: 1,
				did: 5,
				abbrev: "LAL",
			},
			{
				tid: 15,
				cid: 1,
				did: 3,
				abbrev: "MIA",
			},
			{
				tid: 16,
				cid: 1,
				did: 4,
				abbrev: "MIL",
			},
			{
				tid: 17,
				cid: 0,
				did: 1,
				abbrev: "MIN",
			},
			{
				tid: 18,
				cid: 0,
				did: 0,
				abbrev: "NYC",
			},
			{
				tid: 19,
				cid: 0,
				did: 2,
				abbrev: "OAK",
			},
			{
				tid: 20,
				cid: 1,
				did: 3,
				abbrev: "PHI",
			},
			{
				tid: 21,
				cid: 1,
				did: 5,
				abbrev: "PHO",
			},
			{
				tid: 22,
				cid: 1,
				did: 4,
				abbrev: "PIT",
			},
			{
				tid: 23,
				cid: 1,
				did: 5,
				abbrev: "SD",
			},
			{
				tid: 24,
				cid: 0,
				did: 2,
				abbrev: "SEA",
			},
			{
				tid: 25,
				cid: 1,
				did: 5,
				abbrev: "SF",
			},
			{
				tid: 26,
				cid: 1,
				did: 4,
				abbrev: "STL",
			},
			{
				tid: 27,
				cid: 0,
				did: 0,
				abbrev: "TOR",
			},
			{
				tid: 28,
				cid: 0,
				did: 0,
				abbrev: "TPA",
			},
			{
				tid: 29,
				cid: 1,
				did: 3,
				abbrev: "WAS",
			},
		]);
	} else if (isSport("basketball")) {
		teams = getTeamInfos([
			// ACC (Atlantic Coast Conference) - 15 teams
			{ tid: 0, cid: 0, did: 0, abbrev: "DUR" }, // Duke
			{ tid: 1, cid: 0, did: 0, abbrev: "NCI" }, // North Carolina
			{ tid: 2, cid: 0, did: 0, abbrev: "RAL" }, // NC State
			{ tid: 3, cid: 0, did: 0, abbrev: "CHA" }, // Virginia
			{ tid: 4, cid: 0, did: 0, abbrev: "BLA" }, // Virginia Tech
			{ tid: 5, cid: 0, did: 0, abbrev: "CHE" }, // Boston College
			{ tid: 6, cid: 0, did: 0, abbrev: "SYR" }, // Syracuse
			{ tid: 7, cid: 0, did: 0, abbrev: "PAT" }, // Pittsburgh
			{ tid: 8, cid: 0, did: 0, abbrev: "LOU" }, // Louisville
			{ tid: 9, cid: 0, did: 0, abbrev: "CLE" }, // Clemson
			{ tid: 10, cid: 0, did: 0, abbrev: "TAL" }, // Florida State
			{ tid: 11, cid: 0, did: 0, abbrev: "COR" }, // Miami
			{ tid: 12, cid: 0, did: 0, abbrev: "WIN" }, // Wake Forest
			{ tid: 13, cid: 0, did: 0, abbrev: "ATL" }, // Georgia Tech
			{ tid: 14, cid: 0, did: 0, abbrev: "SBE" }, // Notre Dame
			// Big Ten Conference - 18 teams
			{ tid: 15, cid: 1, did: 1, abbrev: "BLO" }, // Indiana
			{ tid: 16, cid: 1, did: 1, abbrev: "WLA" }, // Purdue
			{ tid: 17, cid: 1, did: 1, abbrev: "ANN" }, // Michigan
			{ tid: 18, cid: 1, did: 1, abbrev: "ELA" }, // Michigan State
			{ tid: 19, cid: 1, did: 1, abbrev: "COL" }, // Ohio State
			{ tid: 20, cid: 1, did: 1, abbrev: "MAD" }, // Wisconsin
			{ tid: 21, cid: 1, did: 1, abbrev: "ICI" }, // Iowa
			{ tid: 22, cid: 1, did: 1, abbrev: "ILA" }, // Illinois
			{ tid: 23, cid: 1, did: 1, abbrev: "MIN" }, // Minnesota
			{ tid: 24, cid: 1, did: 1, abbrev: "CPA" }, // Maryland
			{ tid: 25, cid: 1, did: 1, abbrev: "PIS" }, // Rutgers
			{ tid: 26, cid: 1, did: 1, abbrev: "SCO" }, // Penn State
			{ tid: 27, cid: 1, did: 1, abbrev: "EVA" }, // Northwestern
			{ tid: 28, cid: 1, did: 1, abbrev: "LIN" }, // Nebraska
			{ tid: 29, cid: 1, did: 1, abbrev: "WES" }, // UCLA
			{ tid: 30, cid: 1, did: 1, abbrev: "LAN" }, // USC
			{ tid: 31, cid: 1, did: 1, abbrev: "EUG" }, // Oregon
			{ tid: 32, cid: 1, did: 1, abbrev: "SEA" }, // Washington
			// Big 12 Conference - 14 teams (Texas & Oklahoma moved to SEC)
			{ tid: 33, cid: 2, did: 2, abbrev: "LAW" }, // Kansas
			{ tid: 34, cid: 2, did: 2, abbrev: "MAN" }, // Kansas State
			{ tid: 35, cid: 2, did: 2, abbrev: "AME" }, // Iowa State
			{ tid: 36, cid: 2, did: 2, abbrev: "WAC" }, // Baylor
			{ tid: 37, cid: 2, did: 2, abbrev: "LUB" }, // Texas Tech
			{ tid: 38, cid: 2, did: 2, abbrev: "FWO" }, // TCU
			{ tid: 39, cid: 2, did: 2, abbrev: "STI" }, // Oklahoma State
			{ tid: 40, cid: 2, did: 2, abbrev: "MOR" }, // West Virginia
			{ tid: 41, cid: 2, did: 2, abbrev: "CIN" }, // Cincinnati
			{ tid: 42, cid: 2, did: 2, abbrev: "PRO" }, // BYU
			{ tid: 43, cid: 2, did: 2, abbrev: "HOU" }, // Houston
			{ tid: 44, cid: 2, did: 2, abbrev: "ORL" }, // UCF
			{ tid: 45, cid: 2, did: 2, abbrev: "TEM" }, // Arizona State
			{ tid: 46, cid: 2, did: 2, abbrev: "TUC" }, // Arizona
			// SEC (Southeastern Conference) - 17 teams (added Memphis)
			{ tid: 47, cid: 3, did: 3, abbrev: "LEX" }, // Kentucky
			{ tid: 48, cid: 3, did: 3, abbrev: "GAI" }, // Florida
			{ tid: 49, cid: 3, did: 3, abbrev: "KNO" }, // Tennessee
			{ tid: 50, cid: 3, did: 3, abbrev: "AUB" }, // Auburn
			{ tid: 51, cid: 3, did: 3, abbrev: "TUS" }, // Alabama
			{ tid: 52, cid: 3, did: 3, abbrev: "CST" }, // Texas A&M
			{ tid: 53, cid: 3, did: 3, abbrev: "SCL" }, // South Carolina
			{ tid: 54, cid: 3, did: 3, abbrev: "ATH" }, // Georgia
			{ tid: 55, cid: 3, did: 3, abbrev: "LAO" }, // LSU
			{ tid: 56, cid: 3, did: 3, abbrev: "OXF" }, // Ole Miss
			{ tid: 57, cid: 3, did: 3, abbrev: "STA" }, // Mississippi State
			{ tid: 58, cid: 3, did: 3, abbrev: "FAY" }, // Arkansas
			{ tid: 59, cid: 3, did: 3, abbrev: "COM" }, // Missouri
			{ tid: 60, cid: 3, did: 3, abbrev: "NAS" }, // Vanderbilt
			{ tid: 61, cid: 3, did: 3, abbrev: "AUS" }, // Texas (moved from Big 12)
			{ tid: 62, cid: 3, did: 3, abbrev: "NOR" }, // Oklahoma (moved from Big 12)
			// Big East Conference - 12 teams (added Gonzaga)
			{ tid: 63, cid: 4, did: 4, abbrev: "STO" }, // UConn
			{ tid: 64, cid: 4, did: 4, abbrev: "RIO" }, // Providence
			{ tid: 65, cid: 4, did: 4, abbrev: "MIL" }, // Marquette
			{ tid: 66, cid: 4, did: 4, abbrev: "IND" }, // Butler
			{ tid: 67, cid: 4, did: 4, abbrev: "QUE" }, // St. John's
			{ tid: 68, cid: 4, did: 4, abbrev: "DCS" }, // Georgetown
			{ tid: 69, cid: 4, did: 4, abbrev: "NEW" }, // Seton Hall
			{ tid: 70, cid: 4, did: 4, abbrev: "VIL" }, // Villanova
			{ tid: 71, cid: 4, did: 4, abbrev: "OMA" }, // Creighton
			{ tid: 72, cid: 4, did: 4, abbrev: "OHN" }, // Xavier
			{ tid: 73, cid: 4, did: 4, abbrev: "ILI" }, // DePaul
			{ tid: 74, cid: 4, did: 4, abbrev: "SPO" }, // Gonzaga (moved from WCC to Big East)
			{ tid: 75, cid: 3, did: 3, abbrev: "MEM" }, // Memphis (moved from AAC to SEC)
			// Atlantic 10 Conference - 14 teams
			{ tid: 76, cid: 5, did: 5, abbrev: "DAV" }, // Davidson
			{ tid: 77, cid: 5, did: 5, abbrev: "DAY" }, // Dayton
			{ tid: 78, cid: 5, did: 5, abbrev: "DUQ" }, // Duquesne
			{ tid: 79, cid: 5, did: 5, abbrev: "BRO" }, // Fordham
			{ tid: 80, cid: 5, did: 5, abbrev: "FAI" }, // George Mason
			{ tid: 81, cid: 5, did: 5, abbrev: "GWU" }, // George Washington
			{ tid: 82, cid: 5, did: 5, abbrev: "PHI" }, // La Salle
			{ tid: 83, cid: 5, did: 5, abbrev: "LOY" }, // Loyola Chicago
			{ tid: 84, cid: 5, did: 5, abbrev: "KIN" }, // Rhode Island
			{ tid: 85, cid: 5, did: 5, abbrev: "RIC" }, // Richmond
			{ tid: 86, cid: 5, did: 5, abbrev: "OLE" }, // St. Bonaventure
			{ tid: 87, cid: 5, did: 5, abbrev: "PAI" }, // Saint Joseph's
			{ tid: 88, cid: 5, did: 5, abbrev: "SLO" }, // Saint Louis
			{ tid: 89, cid: 5, did: 5, abbrev: "VAC" }, // VCU
			// America East Conference - 9 teams
			{ tid: 90, cid: 6, did: 6, abbrev: "NYB" }, // Albany
			{ tid: 91, cid: 6, did: 6, abbrev: "BIN" }, // Binghamton
			{ tid: 92, cid: 6, did: 6, abbrev: "SMI" }, // Bryant
			{ tid: 93, cid: 6, did: 6, abbrev: "ORO" }, // Maine
			{ tid: 94, cid: 6, did: 6, abbrev: "BA3" }, // UMBC
			{ tid: 95, cid: 6, did: 6, abbrev: "LOW" }, // UMass Lowell
			{ tid: 96, cid: 6, did: 6, abbrev: "NHR" }, // New Hampshire
			{ tid: 97, cid: 6, did: 6, abbrev: "NE2" }, // NJIT
			{ tid: 98, cid: 6, did: 6, abbrev: "BUR" }, // Vermont
			// American Athletic Conference - 12 teams (Memphis already in SEC)
			{ tid: 99, cid: 7, did: 7, abbrev: "NCA" }, // Charlotte
			{ tid: 100, cid: 7, did: 7, abbrev: "GRE" }, // East Carolina
			{ tid: 101, cid: 7, did: 7, abbrev: "BRA" }, // Florida Atlantic
			{ tid: 102, cid: 7, did: 7, abbrev: "DEN" }, // North Texas
			{ tid: 103, cid: 7, did: 7, abbrev: "TXU" }, // Rice
			{ tid: 104, cid: 7, did: 7, abbrev: "TAM" }, // South Florida
			{ tid: 105, cid: 7, did: 7, abbrev: "PH2" }, // Temple
			{ tid: 106, cid: 7, did: 7, abbrev: "BIR" }, // UAB
			{ tid: 107, cid: 7, did: 7, abbrev: "SAN" }, // UTSA
			{ tid: 108, cid: 7, did: 7, abbrev: "LAR" }, // Tulane
			{ tid: 109, cid: 7, did: 7, abbrev: "TUL" }, // Tulsa
			{ tid: 110, cid: 7, did: 7, abbrev: "WIC" }, // Wichita State
			// ASUN Conference - 12 teams
			{ tid: 111, cid: 8, did: 8, abbrev: "CLA" }, // Austin Peay
			{ tid: 112, cid: 8, did: 8, abbrev: "SCN" }, // Central Arkansas
			{ tid: 113, cid: 8, did: 8, abbrev: "FMY" }, // Florida Gulf Coast
			{ tid: 114, cid: 8, did: 8, abbrev: "JAC" }, // Jacksonville
			{ tid: 115, cid: 8, did: 8, abbrev: "NA3" }, // Lipscomb
			{ tid: 116, cid: 8, did: 8, abbrev: "FLO" }, // North Alabama
			{ tid: 117, cid: 8, did: 8, abbrev: "JA2" }, // North Florida
			{ tid: 118, cid: 8, did: 8, abbrev: "DEL" }, // Stetson
			{ tid: 119, cid: 8, did: 8, abbrev: "GAR" }, // West Georgia
			{ tid: 120, cid: 8, did: 8, abbrev: "BEL" }, // Bellarmine
			{ tid: 121, cid: 8, did: 8, abbrev: "EKU" }, // Eastern Kentucky
			{ tid: 122, cid: 8, did: 8, abbrev: "QUC" }, // Queens Charlotte
			// Big Sky Conference - 10 teams
			{ tid: 123, cid: 9, did: 9, abbrev: "CHE" }, // Eastern Washington
			{ tid: 124, cid: 9, did: 9, abbrev: "MOS" }, // Idaho
			{ tid: 125, cid: 9, did: 9, abbrev: "POC" }, // Idaho State
			{ tid: 126, cid: 9, did: 9, abbrev: "MIS" }, // Montana
			{ tid: 127, cid: 9, did: 9, abbrev: "BOZ" }, // Montana State
			{ tid: 128, cid: 9, did: 9, abbrev: "FLA" }, // Northern Arizona
			{ tid: 129, cid: 9, did: 9, abbrev: "COE" }, // Northern Colorado
			{ tid: 130, cid: 9, did: 9, abbrev: "POR" }, // Portland State
			{ tid: 131, cid: 9, did: 9, abbrev: "SAC" }, // Sacramento State
			{ tid: 132, cid: 9, did: 9, abbrev: "OGD" }, // Weber State
			// Big West Conference - 11 teams
			{ tid: 133, cid: 10, did: 10, abbrev: "SL2" }, // Cal Poly
			{ tid: 134, cid: 10, did: 10, abbrev: "BAK" }, // CSU Bakersfield
			{ tid: 135, cid: 10, did: 10, abbrev: "FUL" }, // Cal State Fullerton
			{ tid: 136, cid: 10, did: 10, abbrev: "NO4" }, // Cal State Northridge
			{ tid: 137, cid: 10, did: 10, abbrev: "HON" }, // Hawaii
			{ tid: 138, cid: 10, did: 10, abbrev: "LBE" }, // Long Beach State
			{ tid: 139, cid: 10, did: 10, abbrev: "CAV" }, // UC Davis
			{ tid: 140, cid: 10, did: 10, abbrev: "IRV" }, // UC Irvine
			{ tid: 141, cid: 10, did: 10, abbrev: "RIV" }, // UC Riverside
			{ tid: 142, cid: 10, did: 10, abbrev: "SDI" }, // UC San Diego
			{ tid: 143, cid: 10, did: 10, abbrev: "SBA" }, // UC Santa Barbara
			// Colonial Athletic Association (CAA) - 13 teams
			{ tid: 144, cid: 11, did: 11, abbrev: "BCR" }, // Campbell
			{ tid: 145, cid: 11, did: 11, abbrev: "SCA" }, // Charleston
			{ tid: 146, cid: 11, did: 11, abbrev: "DRE" }, // Drexel
			{ tid: 147, cid: 11, did: 11, abbrev: "ELO" }, // Elon
			{ tid: 148, cid: 11, did: 11, abbrev: "HAM" }, // Hampton
			{ tid: 149, cid: 11, did: 11, abbrev: "HEM" }, // Hofstra
			{ tid: 150, cid: 11, did: 11, abbrev: "WLB" }, // Monmouth
			{ tid: 151, cid: 11, did: 11, abbrev: "NCE" }, // North Carolina A&T
			{ tid: 152, cid: 11, did: 11, abbrev: "BOS" }, // Northeastern
			{ tid: 153, cid: 11, did: 11, abbrev: "SBR" }, // Stony Brook
			{ tid: 154, cid: 11, did: 11, abbrev: "TOW" }, // Towson
			{ tid: 155, cid: 11, did: 11, abbrev: "WIL" }, // UNC Wilmington
			{ tid: 156, cid: 11, did: 11, abbrev: "WI2" }, // William & Mary
			// Conference USA - 12 teams
			{ tid: 157, cid: 12, did: 12, abbrev: "DEW" }, // Delaware
			{ tid: 158, cid: 12, did: 12, abbrev: "MIA" }, // FIU
			{ tid: 159, cid: 12, did: 12, abbrev: "JAC" }, // Jacksonville State
			{ tid: 160, cid: 12, did: 12, abbrev: "KEN" }, // Kennesaw State
			{ tid: 161, cid: 12, did: 12, abbrev: "LYN" }, // Liberty
			{ tid: 162, cid: 12, did: 12, abbrev: "RUS" }, // Louisiana Tech
			{ tid: 163, cid: 12, did: 12, abbrev: "TNR" }, // Middle Tennessee
			{ tid: 164, cid: 12, did: 12, abbrev: "SPR" }, // Missouri State
			{ tid: 165, cid: 12, did: 12, abbrev: "LCR" }, // New Mexico State
			{ tid: 166, cid: 12, did: 12, abbrev: "HUN" }, // Sam Houston State
			{ tid: 167, cid: 12, did: 12, abbrev: "EPA" }, // UTEP
			{ tid: 168, cid: 12, did: 12, abbrev: "BGR" }, // Western Kentucky

			// Horizon League - 11 teams
			{ tid: 169, cid: 13, did: 13, abbrev: "OHE" }, // Cleveland State
			{ tid: 170, cid: 13, did: 13, abbrev: "DET" }, // Detroit Mercy
			{ tid: 171, cid: 13, did: 13, abbrev: "IND" }, // IU Indianapolis
			{ tid: 172, cid: 13, did: 13, abbrev: "MIL" }, // Milwaukee
			{ tid: 173, cid: 13, did: 13, abbrev: "HHE" }, // Northern Kentucky
			{ tid: 174, cid: 13, did: 13, abbrev: "ROC" }, // Oakland
			{ tid: 175, cid: 13, did: 13, abbrev: "FWA" }, // Purdue Fort Wayne
			{ tid: 176, cid: 13, did: 13, abbrev: "MTO" }, // Robert Morris
			{ tid: 177, cid: 13, did: 13, abbrev: "GBA" }, // Green Bay
			{ tid: 178, cid: 13, did: 13, abbrev: "DAY" }, // Wright State
			{ tid: 179, cid: 13, did: 13, abbrev: "YOU" }, // Youngstown State

			// Ivy League - 8 teams
			{ tid: 180, cid: 14, did: 14, abbrev: "RIO" }, // Brown
			{ tid: 181, cid: 14, did: 14, abbrev: "NYO" }, // Columbia
			{ tid: 182, cid: 14, did: 14, abbrev: "ITH" }, // Cornell
			{ tid: 183, cid: 14, did: 14, abbrev: "HAN" }, // Dartmouth
			{ tid: 184, cid: 14, did: 14, abbrev: "CAM" }, // Harvard
			{ tid: 185, cid: 14, did: 14, abbrev: "PHI" }, // Penn
			{ tid: 186, cid: 14, did: 14, abbrev: "PRI" }, // Princeton
			{ tid: 187, cid: 14, did: 14, abbrev: "NHA" }, // Yale

			// MAAC - 13 teams
			{ tid: 188, cid: 15, did: 15, abbrev: "BUF" }, // Canisius
			{ tid: 189, cid: 15, did: 15, abbrev: "CTI" }, // Fairfield
			{ tid: 190, cid: 15, did: 15, abbrev: "NRO" }, // Iona
			{ tid: 191, cid: 15, did: 15, abbrev: "BRO" }, // Manhattan
			{ tid: 192, cid: 15, did: 15, abbrev: "POU" }, // Marist
			{ tid: 193, cid: 15, did: 15, abbrev: "NAN" }, // Merrimack
			{ tid: 194, cid: 15, did: 15, abbrev: "EMM" }, // Mount St. Mary's
			{ tid: 195, cid: 15, did: 15, abbrev: "LEW" }, // Niagara
			{ tid: 196, cid: 15, did: 15, abbrev: "CTM" }, // Quinnipiac
			{ tid: 197, cid: 15, did: 15, abbrev: "NJW" }, // Rider
			{ tid: 198, cid: 15, did: 15, abbrev: "FA2" }, // Sacred Heart
			{ tid: 199, cid: 15, did: 15, abbrev: "JCI" }, // Saint Peter's
			{ tid: 200, cid: 15, did: 15, abbrev: "NYU" }, // Siena

			// MAC - 13 teams
			{ tid: 201, cid: 16, did: 16, abbrev: "AKR" }, // Akron
			{ tid: 202, cid: 16, did: 16, abbrev: "MUN" }, // Ball State
			{ tid: 203, cid: 16, did: 16, abbrev: "BGR" }, // Bowling Green
			{ tid: 204, cid: 16, did: 16, abbrev: "BUF" }, // Buffalo
			{ tid: 205, cid: 16, did: 16, abbrev: "MPL" }, // Central Michigan
			{ tid: 206, cid: 16, did: 16, abbrev: "YPS" }, // Eastern Michigan
			{ tid: 207, cid: 16, did: 16, abbrev: "KE2" }, // Kent State
			{ tid: 208, cid: 16, did: 16, abbrev: "AMH" }, // UMass
			{ tid: 209, cid: 16, did: 16, abbrev: "OXF" }, // Miami (OH)
			{ tid: 210, cid: 16, did: 16, abbrev: "DEK" }, // Northern Illinois
			{ tid: 211, cid: 16, did: 16, abbrev: "ATH" }, // Ohio
			{ tid: 212, cid: 16, did: 16, abbrev: "TOL" }, // Toledo
			{ tid: 213, cid: 16, did: 16, abbrev: "KAL" }, // Western Michigan

			// MEAC - 8 teams
			{ tid: 214, cid: 17, did: 17, abbrev: "BAL" }, // Coppin State
			{ tid: 215, cid: 17, did: 17, abbrev: "DOV" }, // Delaware State
			{ tid: 216, cid: 17, did: 17, abbrev: "WA2" }, // Howard
			{ tid: 217, cid: 17, did: 17, abbrev: "PAN" }, // UMES
			{ tid: 218, cid: 17, did: 17, abbrev: "MDL" }, // Morgan State
			{ tid: 219, cid: 17, did: 17, abbrev: "VAR" }, // Norfolk State
			{ tid: 220, cid: 17, did: 17, abbrev: "DUR" }, // North Carolina Central
			{ tid: 221, cid: 17, did: 17, abbrev: "ORA" }, // SC State

			// Missouri Valley - 11 teams
			{ tid: 222, cid: 18, did: 18, abbrev: "NAS" }, // Belmont
			{ tid: 223, cid: 18, did: 18, abbrev: "PEO" }, // Bradley
			{ tid: 224, cid: 18, did: 18, abbrev: "DMO" }, // Drake
			{ tid: 225, cid: 18, did: 18, abbrev: "INA" }, // Evansville
			{ tid: 226, cid: 18, did: 18, abbrev: "ILR" }, // Illinois State
			{ tid: 227, cid: 18, did: 18, abbrev: "THA" }, // Indiana State
			{ tid: 228, cid: 18, did: 18, abbrev: "MUR" }, // Murray State
			{ tid: 229, cid: 18, did: 18, abbrev: "CFA" }, // Northern Iowa
			{ tid: 230, cid: 18, did: 18, abbrev: "CA2" }, // Southern Illinois
			{ tid: 231, cid: 18, did: 18, abbrev: "ILI" }, // UIC
			{ tid: 232, cid: 18, did: 18, abbrev: "VAL" }, // Valparaiso

			// Mountain West - 13 teams
			{ tid: 233, cid: 19, did: 19, abbrev: "CSP" }, // Air Force
			{ tid: 234, cid: 19, did: 19, abbrev: "BOI" }, // Boise State
			{ tid: 235, cid: 19, did: 19, abbrev: "FCO" }, // Colorado State
			{ tid: 236, cid: 19, did: 19, abbrev: "FRE" }, // Fresno State
			{ tid: 237, cid: 19, did: 19, abbrev: "REN" }, // Nevada
			{ tid: 238, cid: 19, did: 19, abbrev: "ALB" }, // New Mexico
			{ tid: 239, cid: 19, did: 19, abbrev: "CAI" }, // San Diego State
			{ tid: 240, cid: 19, did: 19, abbrev: "SJO" }, // San Jose State
			{ tid: 241, cid: 19, did: 19, abbrev: "LVE" }, // UNLV
			{ tid: 242, cid: 19, did: 19, abbrev: "LOG" }, // Utah State
			{ tid: 243, cid: 19, did: 19, abbrev: "WYR" }, // Wyoming
			{ tid: 244, cid: 19, did: 19, abbrev: "PHO" }, // Grand Canyon

			// NEC - 10 teams
			{ tid: 245, cid: 20, did: 20, abbrev: "NBR" }, // Central Connecticut
			{ tid: 246, cid: 20, did: 20, abbrev: "CH3" }, // Chicago State
			{ tid: 247, cid: 20, did: 20, abbrev: "TEA" }, // Fairleigh Dickinson
			{ tid: 248, cid: 20, did: 20, abbrev: "SYR" }, // Le Moyne
			{ tid: 249, cid: 20, did: 20, abbrev: "BR3" }, // LIU
			{ tid: 250, cid: 20, did: 20, abbrev: "ERI" }, // Mercyhurst
			{ tid: 251, cid: 20, did: 20, abbrev: "WHA" }, // New Haven
			{ tid: 252, cid: 20, did: 20, abbrev: "LOR" }, // Saint Francis
			{ tid: 253, cid: 20, did: 20, abbrev: "EAS" }, // Stonehill
			{ tid: 254, cid: 20, did: 20, abbrev: "SIS" }, // Wagner

			// Ohio Valley - 11 teams
			{ tid: 255, cid: 21, did: 21, abbrev: "SCA" }, // Eastern Illinois
			{ tid: 256, cid: 21, did: 21, abbrev: "SCH" }, // Lindenwood
			{ tid: 257, cid: 21, did: 21, abbrev: "LRO" }, // Little Rock
			{ tid: 258, cid: 21, did: 21, abbrev: "KYR" }, // Morehead State
			{ tid: 259, cid: 21, did: 21, abbrev: "CGI" }, // Southeast Missouri
			{ tid: 260, cid: 21, did: 21, abbrev: "EDW" }, // SIU Edwardsville
			{ tid: 261, cid: 21, did: 21, abbrev: "EV2" }, // Southern Indiana
			{ tid: 262, cid: 21, did: 21, abbrev: "MAR" }, // UT Martin
			{ tid: 263, cid: 21, did: 21, abbrev: "TNS" }, // Tennessee State
			{ tid: 264, cid: 21, did: 21, abbrev: "COO" }, // Tennessee Tech
			{ tid: 265, cid: 21, did: 21, abbrev: "MAC" }, // Western Illinois

			// Patriot League - 10 teams
			{ tid: 266, cid: 22, did: 22, abbrev: "WA3" }, // American
			{ tid: 267, cid: 22, did: 22, abbrev: "WPO" }, // Army
			{ tid: 268, cid: 22, did: 22, abbrev: "BOS" }, // Boston University
			{ tid: 269, cid: 22, did: 22, abbrev: "PAW" }, // Bucknell
			{ tid: 270, cid: 22, did: 22, abbrev: "NYM" }, // Colgate
			{ tid: 271, cid: 22, did: 22, abbrev: "WOR" }, // Holy Cross
			{ tid: 272, cid: 22, did: 22, abbrev: "PAS" }, // Lafayette
			{ tid: 273, cid: 22, did: 22, abbrev: "BET" }, // Lehigh
			{ tid: 274, cid: 22, did: 22, abbrev: "BA2" }, // Loyola Maryland
			{ tid: 275, cid: 22, did: 22, abbrev: "ANN" }, // Navy

			// Southern - 10 teams
			{ tid: 276, cid: 23, did: 23, abbrev: "TNA" }, // Chattanooga
			{ tid: 277, cid: 23, did: 23, abbrev: "CH5" }, // Citadel
			{ tid: 278, cid: 23, did: 23, abbrev: "TNI" }, // ETSU
			{ tid: 279, cid: 23, did: 23, abbrev: "GRE" }, // Furman
			{ tid: 280, cid: 23, did: 23, abbrev: "GAC" }, // Mercer
			{ tid: 281, cid: 23, did: 23, abbrev: "BIR" }, // Samford
			{ tid: 282, cid: 23, did: 23, abbrev: "GR2" }, // UNCG
			{ tid: 283, cid: 23, did: 23, abbrev: "LEX" }, // VMI
			{ tid: 284, cid: 23, did: 23, abbrev: "CUL" }, // Western Carolina
			{ tid: 285, cid: 23, did: 23, abbrev: "SPA" }, // Wofford

			// Southland - 12 teams
			{ tid: 286, cid: 24, did: 24, abbrev: "COM" }, // East Texas A&M
			{ tid: 287, cid: 24, did: 24, abbrev: "HOU" }, // Houston Christian
			{ tid: 288, cid: 24, did: 24, abbrev: "SAN" }, // Incarnate Word
			{ tid: 289, cid: 24, did: 24, abbrev: "BEA" }, // Lamar
			{ tid: 290, cid: 24, did: 24, abbrev: "LCH" }, // McNeese
			{ tid: 291, cid: 24, did: 24, abbrev: "LAR" }, // New Orleans
			{ tid: 292, cid: 24, did: 24, abbrev: "THI" }, // Nicholls
			{ tid: 293, cid: 24, did: 24, abbrev: "NAT" }, // Northwestern State
			{ tid: 294, cid: 24, did: 24, abbrev: "LAM" }, // Southeastern Louisiana
			{ tid: 295, cid: 24, did: 24, abbrev: "NAC" }, // Stephen F. Austin
			{ tid: 296, cid: 24, did: 24, abbrev: "CCH" }, // Texas A&M-Corpus Christi
			{ tid: 297, cid: 24, did: 24, abbrev: "EDI" }, // UTRGV

			// The Summit - 9 teams
			{ tid: 298, cid: 25, did: 25, abbrev: "CON" }, // Denver
			{ tid: 299, cid: 25, did: 25, abbrev: "KCI" }, // Kansas City
			{ tid: 300, cid: 25, did: 25, abbrev: "GFO" }, // North Dakota
			{ tid: 301, cid: 25, did: 25, abbrev: "FAR" }, // NDSU
			{ tid: 302, cid: 25, did: 25, abbrev: "OMA" }, // Omaha
			{ tid: 303, cid: 25, did: 25, abbrev: "TUL" }, // Oral Roberts
			{ tid: 304, cid: 25, did: 25, abbrev: "MNA" }, // St. Thomas
			{ tid: 305, cid: 25, did: 25, abbrev: "VER" }, // South Dakota
			{ tid: 306, cid: 25, did: 25, abbrev: "SDO" }, // South Dakota State

			// Sun Belt - 14 teams
			{ tid: 307, cid: 26, did: 26, abbrev: "BOO" }, // Appalachian State
			{ tid: 308, cid: 26, did: 26, abbrev: "JON" }, // Arkansas State
			{ tid: 309, cid: 26, did: 26, abbrev: "SCN" }, // Coastal Carolina
			{ tid: 310, cid: 26, did: 26, abbrev: "GAA" }, // Georgia Southern
			{ tid: 311, cid: 26, did: 26, abbrev: "ATL" }, // Georgia State
			{ tid: 312, cid: 26, did: 26, abbrev: "HAR" }, // James Madison
			{ tid: 313, cid: 26, did: 26, abbrev: "LAF" }, // Louisiana
			{ tid: 314, cid: 26, did: 26, abbrev: "MO2" }, // Louisiana-Monroe
			{ tid: 315, cid: 26, did: 26, abbrev: "WVN" }, // Marshall
			{ tid: 316, cid: 26, did: 26, abbrev: "NO3" }, // Old Dominion
			{ tid: 317, cid: 26, did: 26, abbrev: "MOB" }, // South Alabama
			{ tid: 318, cid: 26, did: 26, abbrev: "HAT" }, // Southern Miss
			{ tid: 319, cid: 26, did: 26, abbrev: "SMA" }, // Texas State
			{ tid: 320, cid: 26, did: 26, abbrev: "TRO" }, // Troy

			// SWAC - 12 teams
			{ tid: 321, cid: 27, did: 27, abbrev: "ALN" }, // Alabama A&M
			{ tid: 322, cid: 27, did: 27, abbrev: "MON" }, // Alabama State
			{ tid: 323, cid: 27, did: 27, abbrev: "MSR" }, // Alcorn State
			{ tid: 324, cid: 27, did: 27, abbrev: "PBL" }, // Arkansas-Pine Bluff
			{ tid: 325, cid: 27, did: 27, abbrev: "DBE" }, // Bethune-Cookman
			{ tid: 326, cid: 27, did: 27, abbrev: "FLL" }, // Florida A&M
			{ tid: 327, cid: 27, did: 27, abbrev: "GRA" }, // Grambling State
			{ tid: 328, cid: 27, did: 27, abbrev: "MSC" }, // Jackson State
			{ tid: 329, cid: 27, did: 27, abbrev: "IBE" }, // Mississippi Valley State
			{ tid: 330, cid: 27, did: 27, abbrev: "PVI" }, // Prairie View A&M
			{ tid: 331, cid: 27, did: 27, abbrev: "BR4" }, // Southern
			{ tid: 332, cid: 27, did: 27, abbrev: "HO3" }, // Texas Southern

			// WAC - 7 teams
			{ tid: 333, cid: 28, did: 28, abbrev: "ABI" }, // Abilene Christian
			{ tid: 334, cid: 28, did: 28, abbrev: "RIV" }, // California Baptist
			{ tid: 335, cid: 28, did: 28, abbrev: "CCI" }, // Southern Utah
			{ tid: 336, cid: 28, did: 28, abbrev: "STE" }, // Tarleton State
			{ tid: 337, cid: 28, did: 28, abbrev: "SGE" }, // Utah Tech
			{ tid: 338, cid: 28, did: 28, abbrev: "ORE" }, // Utah Valley
			{ tid: 339, cid: 28, did: 28, abbrev: "ARL" }, // UT Arlington

			// West Coast - 13 teams
			{ tid: 340, cid: 29, did: 29, abbrev: "SPO" }, // Gonzaga
			{ tid: 341, cid: 29, did: 29, abbrev: "CAN" }, // Loyola Marymount
			{ tid: 342, cid: 29, did: 29, abbrev: "COR" }, // Oregon State
			{ tid: 343, cid: 29, did: 29, abbrev: "CAO" }, // Pacific
			{ tid: 344, cid: 29, did: 29, abbrev: "MAL" }, // Pepperdine
			{ tid: 345, cid: 29, did: 29, abbrev: "ORR" }, // Portland
			{ tid: 346, cid: 29, did: 29, abbrev: "CAR" }, // Saint Mary's
			{ tid: 347, cid: 29, did: 29, abbrev: "SDI" }, // San Diego
			{ tid: 348, cid: 29, did: 29, abbrev: "SFR" }, // San Francisco
			{ tid: 349, cid: 29, did: 29, abbrev: "CAL" }, // Santa Clara
			{ tid: 350, cid: 29, did: 29, abbrev: "SEA" }, // Seattle
			{ tid: 351, cid: 29, did: 29, abbrev: "PUL" }, // Washington State

			// Big South - 9 teams
			{ tid: 352, cid: 30, did: 30, abbrev: "CH6" }, // Charleston Southern
			{ tid: 353, cid: 30, did: 30, abbrev: "BSP" }, // Gardner-Webb
			{ tid: 354, cid: 30, did: 30, abbrev: "HPO" }, // High Point
			{ tid: 355, cid: 30, did: 30, abbrev: "FA3" }, // Longwood
			{ tid: 356, cid: 30, did: 30, abbrev: "CLI" }, // Presbyterian
			{ tid: 357, cid: 30, did: 30, abbrev: "RAD" }, // Radford
			{ tid: 358, cid: 30, did: 30, abbrev: "ASH" }, // UNC Asheville
			{ tid: 359, cid: 30, did: 30, abbrev: "SP2" }, // USC Upstate
			{ tid: 360, cid: 30, did: 30, abbrev: "RHI" }, // Winthrop

			// Additional ACC teams
			{ tid: 361, cid: 0, did: 0, abbrev: "MAI" }, // Boston College
			{ tid: 362, cid: 0, did: 0, abbrev: "BER" }, // Cal
			{ tid: 363, cid: 0, did: 0, abbrev: "DAL" }, // SMU

			// Additional SEC team
			{ tid: 364, cid: 3, did: 3, abbrev: "TUS" }, // Alabama
		]);
	} else if (isSport("hockey")) {
		teams = getTeamInfos([
			{
				tid: 0,
				cid: 0,
				did: 1,
				abbrev: "BKN",
			},
			{
				tid: 1,
				cid: 0,
				did: 0,
				abbrev: "BOS",
			},
			{
				tid: 2,
				cid: 0,
				did: 0,
				abbrev: "BUF",
			},
			{
				tid: 3,
				cid: 1,
				did: 3,
				abbrev: "CGY",
			},
			{
				tid: 4,
				cid: 1,
				did: 2,
				abbrev: "CHI",
			},
			{
				tid: 5,
				cid: 0,
				did: 1,
				abbrev: "CLB",
			},
			{
				tid: 6,
				cid: 1,
				did: 2,
				abbrev: "DAL",
			},
			{
				tid: 7,
				cid: 1,
				did: 2,
				abbrev: "DEN",
			},
			{
				tid: 8,
				cid: 0,
				did: 0,
				abbrev: "DET",
			},
			{
				tid: 9,
				cid: 1,
				did: 3,
				abbrev: "EDM",
			},
			{
				tid: 10,
				cid: 1,
				did: 3,
				abbrev: "LAL",
			},
			{
				tid: 11,
				cid: 1,
				did: 3,
				abbrev: "LAE",
			},
			{
				tid: 12,
				cid: 1,
				did: 3,
				abbrev: "LV",
			},
			{
				tid: 13,
				cid: 0,
				did: 0,
				abbrev: "MIA",
			},
			{
				tid: 14,
				cid: 1,
				did: 2,
				abbrev: "MIN",
			},
			{
				tid: 15,
				cid: 0,
				did: 0,
				abbrev: "MON",
			},
			{
				tid: 16,
				cid: 0,
				did: 1,
				abbrev: "NJ",
			},
			{
				tid: 17,
				cid: 1,
				did: 2,
				abbrev: "NSH",
			},
			{
				tid: 18,
				cid: 0,
				did: 1,
				abbrev: "NYC",
			},
			{
				tid: 19,
				cid: 0,
				did: 0,
				abbrev: "OTT",
			},
			{
				tid: 20,
				cid: 0,
				did: 1,
				abbrev: "PHI",
			},
			{
				tid: 21,
				cid: 0,
				did: 1,
				abbrev: "PIT",
			},
			{
				tid: 22,
				cid: 0,
				did: 1,
				abbrev: "RAL",
			},
			{
				tid: 23,
				cid: 1,
				did: 3,
				abbrev: "SJ",
			},
			{
				tid: 24,
				cid: 1,
				did: 3,
				abbrev: "SEA",
			},
			{
				tid: 25,
				cid: 1,
				did: 2,
				abbrev: "STL",
			},
			{
				tid: 26,
				cid: 0,
				did: 0,
				abbrev: "TPA",
			},
			{
				tid: 27,
				cid: 0,
				did: 0,
				abbrev: "TOR",
			},
			{
				tid: 28,
				cid: 1,
				did: 2,
				abbrev: "UTA",
			},
			{
				tid: 29,
				cid: 1,
				did: 3,
				abbrev: "VAN",
			},
			{
				tid: 30,
				cid: 0,
				did: 1,
				abbrev: "WAS",
			},
			{
				tid: 31,
				cid: 1,
				did: 2,
				abbrev: "WPG",
			},
		]);
	} else {
		teams = getTeamInfos([
			{
				tid: 0,
				cid: 0,
				did: 0,
				abbrev: "BOS",
			},
			{
				tid: 1,
				cid: 0,
				did: 0,
				abbrev: "BKN",
			},
			{
				tid: 2,
				cid: 0,
				did: 0,
				abbrev: "BUF",
			},
			{
				tid: 3,
				cid: 0,
				did: 0,
				abbrev: "MIA",
			},

			{
				tid: 4,
				cid: 0,
				did: 1,
				abbrev: "BAL",
			},
			{
				tid: 5,
				cid: 0,
				did: 1,
				abbrev: "CIN",
			},
			{
				tid: 6,
				cid: 0,
				did: 1,
				abbrev: "CLE",
			},
			{
				tid: 7,
				cid: 0,
				did: 1,
				abbrev: "PIT",
			},

			{
				tid: 8,
				cid: 0,
				did: 2,
				abbrev: "HOU",
			},
			{
				tid: 9,
				cid: 0,
				did: 2,
				abbrev: "IND",
			},
			{
				tid: 10,
				cid: 0,
				did: 2,
				abbrev: "JAX",
			},
			{
				tid: 11,
				cid: 0,
				did: 2,
				abbrev: "NSH",
			},

			{
				tid: 12,
				cid: 0,
				did: 3,
				abbrev: "DEN",
			},
			{
				tid: 13,
				cid: 0,
				did: 3,
				abbrev: "KC",
			},
			{
				tid: 14,
				cid: 0,
				did: 3,
				abbrev: "LAE",
			},
			{
				tid: 15,
				cid: 0,
				did: 3,
				abbrev: "LV",
			},

			{
				tid: 16,
				cid: 1,
				did: 4,
				abbrev: "DAL",
			},
			{
				tid: 17,
				cid: 1,
				did: 4,
				abbrev: "NYC",
			},
			{
				tid: 18,
				cid: 1,
				did: 4,
				abbrev: "PHI",
			},
			{
				tid: 19,
				cid: 1,
				did: 4,
				abbrev: "WAS",
			},

			{
				tid: 20,
				cid: 1,
				did: 5,
				abbrev: "CHI",
			},
			{
				tid: 21,
				cid: 1,
				did: 5,
				abbrev: "DET",
			},
			{
				tid: 22,
				cid: 1,
				did: 5,
				abbrev: "MIL",
			},
			{
				tid: 23,
				cid: 1,
				did: 5,
				abbrev: "MIN",
			},

			{
				tid: 24,
				cid: 1,
				did: 6,
				abbrev: "ATL",
			},
			{
				tid: 25,
				cid: 1,
				did: 6,
				abbrev: "CHA",
			},
			{
				tid: 26,
				cid: 1,
				did: 6,
				abbrev: "NOL",
			},
			{
				tid: 27,
				cid: 1,
				did: 6,
				abbrev: "TPA",
			},

			{
				tid: 28,
				cid: 1,
				did: 7,
				abbrev: "LA",
			},
			{
				tid: 29,
				cid: 1,
				did: 7,
				abbrev: "PHO",
			},
			{
				tid: 30,
				cid: 1,
				did: 7,
				abbrev: "SEA",
			},
			{
				tid: 31,
				cid: 1,
				did: 7,
				abbrev: "SF",
			},
		]);
	}

	return teams;
};

/**
 * Clones an object.
 *
 * Taken from http://stackoverflow.com/a/3284324/786644
 */
const deepCopy = <T>(obj: T): T => {
	// Can't use old deepCopy function because Chrome 128 had a weird bug where sometimes [{}] would get cloned to {0: {}} - this appeared when creating a league in ZGMB
	// Can't use structuredClone because Jest handles it annoyingly enough (deepStrictEqual doesn't work) that it's not worth it
	// rfdc does weird stuff to arrays with properties on them, which happens accidentally sometimes, like [{RATINGS}] with a .season on it winds up adding an empty ratings row to the end
	// @ts-expect-error https://github.com/angus-c/just/pull/582
	return clone(obj);
};

/**
 * Create a URL for a page within a league.
 *
 * @param {Array.<string|number>} components Array of components for the URL after the league ID, which will be combined with / in between.
 * @return {string} URL
 */
const leagueUrlBase = (
	lid: number,
	components: (number | string | undefined)[],
) => {
	let url = `/l/${lid}`;

	for (let i = 0; i < components.length; i++) {
		if (components[i] !== undefined) {
			url += `/${components[i]}`;
		}
	}

	return url;
};

const formatCurrencyBase = (
	currencyFormat: GameAttributesLeague["currencyFormat"],
	amount: number,
	initialUnits: "M" | "" = "",
	precision: number = 2,
) => {
	const baseExponent = initialUnits === "M" ? 6 : 0; // Input unit is in millions

	const sign = amount < 0 ? "-" : "";
	let abs = Math.abs(amount);

	if (abs === 0) {
		return `${currencyFormat[0]}0${currencyFormat[2]}`;
	}

	let append = "";

	// Keep in sync with getSortVal
	if (abs >= 1000) {
		const currencySuffixes = ["", "k", "M", "B", "T", "Q"];

		const exponent = Math.floor(Math.log10(abs));
		const suffixIndex = Math.floor((exponent + baseExponent) / 3);
		if (currencySuffixes[suffixIndex] !== undefined) {
			append = currencySuffixes[suffixIndex];
			abs /= 1000 ** (suffixIndex - baseExponent / 3);
		} else {
			// Scientific notation
			append = `e${exponent + baseExponent}`;
			abs /= 10 ** exponent;
		}
	} else if (abs < 1 && initialUnits === "M") {
		abs *= 1000;
		append = "k";
		precision = 0;
	} else {
		// No scaling needed!
		append = initialUnits;
	}

	let numberString = abs.toFixed(precision);

	// Remove last digits if 0
	if (append !== "") {
		for (let i = 0; i < precision; i++) {
			if (numberString.at(-1) === "0") {
				numberString = numberString.slice(0, -1);
			}
		}
		if (numberString.at(-1) === ".") {
			numberString = numberString.slice(0, -1);
		}
	}

	if (currencyFormat[1] === ",") {
		numberString = numberString.replace(".", ",");
	}

	return `${sign}${currencyFormat[0]}${numberString}${append}${currencyFormat[2]}`;
};

/**
 * Bound a number so that it can't exceed min and max values.
 *
 * @memberOf util.helpers
 * @param {number} x Input number.
 * @param {number} min Minimum bounding variable.
 * @param {number} max Maximum bounding variable.
 * @return {number} Bounded number.
 */
function bound(x: number, min: number, max: number): number {
	if (x < min) {
		return min;
	}

	if (x > max) {
		return max;
	}

	return x;
}

function ordinal(x?: number | null): string {
	if (x === undefined || x === null) {
		return "";
	}

	let suffix;

	if (x % 100 >= 11 && x % 100 <= 13) {
		suffix = "th";
	} else if (x % 10 === 1) {
		suffix = "st";
	} else if (x % 10 === 2) {
		suffix = "nd";
	} else if (x % 10 === 3) {
		suffix = "rd";
	} else {
		suffix = "th";
	}

	return x.toString() + suffix;
}

// On iOS in some locales, the inputMode="decimal" keyboard contians a , as the decimal separator rather than .
const localeParseFloat = (string: string) => {
	return Number.parseFloat(
		typeof string === "string" ? string.replaceAll(",", ".") : string,
	);
};

// Format a number as an integer with commas in the thousands places.
const numberWithCommas = (
	x: number | string,
	maximumFractionDigits: number = 10,
): string => {
	const y = typeof x === "string" ? localeParseFloat(x) : x;

	return y.toLocaleString("en-US", { maximumFractionDigits });
};

const roundWinp = (winp: number): string => {
	let output = winp.toFixed(3);

	if (output[0] === "0") {
		// Delete leading 0
		output = output.slice(1);
	} else if (output === "1.000") {
		// 1.000 => 1.00, but for higher numbers leave 3 decimal places, like for OPS
		output = "1.00";
	}

	return output;
};

const upperCaseFirstLetter = <T extends string>(string: T) => {
	return `${string.charAt(0).toUpperCase()}${string.slice(1)}` as Capitalize<T>;
};

// https://medium.com/@_achou/dont-give-up-and-use-suppressimplicitanyindexerrors-ca6b208b9365
const keys = <O extends object>(obj: O): Array<keyof O> => {
	return Object.keys(obj) as Array<keyof O>;
};

const states = [
	"AL",
	"AK",
	"AZ",
	"AR",
	"CA",
	"CO",
	"CT",
	"DC",
	"DE",
	"FL",
	"GA",
	"HI",
	"ID",
	"IL",
	"IN",
	"IA",
	"KS",
	"KY",
	"LA",
	"ME",
	"MD",
	"MA",
	"MI",
	"MN",
	"MS",
	"MO",
	"MT",
	"NE",
	"NV",
	"NH",
	"NJ",
	"NM",
	"NY",
	"NC",
	"ND",
	"OH",
	"OK",
	"OR",
	"PA",
	"RI",
	"SC",
	"SD",
	"TN",
	"TX",
	"UT",
	"VT",
	"VA",
	"WA",
	"WV",
	"WI",
	"WY",
	"Alabama",
	"Alaska",
	"Arizona",
	"Arkansas",
	"California",
	"Colorado",
	"Connecticut",
	"Delaware",
	"Florida",
	"Georgia",
	"Hawaii",
	"Idaho",
	"Illinois",
	"Indiana",
	"Iowa",
	"Kansas",
	"Kentucky",
	"Louisiana",
	"Maine",
	"Maryland",
	"Massachusetts",
	"Michigan",
	"Minnesota",
	"Mississippi",
	"Missouri",
	"Montana",
	"Nebraska",
	"Nevada",
	"New Hampshire",
	"New Jersey",
	"New Mexico",
	"New York",
	"North Carolina",
	"North Dakota",
	"Ohio",
	"Oklahoma",
	"Oregon",
	"Pennsylvania",
	"Rhode Island",
	"South Carolina",
	"South Dakota",
	"Tennessee",
	"Texas",
	"Utah",
	"Vermont",
	"Virginia",
	"Washington",
	"West Virginia",
	"Wisconsin",
	"Wyoming",
	"District of Columbia",
];

const provinces = [
	"Ontario",
	"Quebec",
	"Nova Scotia",
	"New Brunswick",
	"Manitoba",
	"British Columbia",
	"Prince Edward Island",
	"Saskatchewan",
	"Alberta",
	"Newfoundland and Labrador",
];

const isAmerican = (loc: string) => {
	if (loc.endsWith("USA")) {
		return true;
	}

	const parts = loc.split(", ");
	const state = parts.at(-1);

	if (state === "Georgia" || state === undefined) {
		return false;
	}

	return states.includes(state);
};

const isCanadian = (loc: string) => {
	if (loc.endsWith("Canada")) {
		return true;
	}

	const parts = loc.split(", ");
	const province = parts.at(-1);

	if (province === undefined) {
		return false;
	}

	return provinces.includes(province);
};

const getCountry = (bornLoc?: string) => {
	let name = bornLoc && bornLoc !== "" ? bornLoc : "None";

	if (isAmerican(name)) {
		name = "USA";
	} else if (isCanadian(name)) {
		name = "Canada";
	} else {
		// Find part after last comma/colon
		for (const delimiter of [", ", ": "]) {
			const parts = name.split(delimiter);
			const nameTemp = parts.at(-1);
			if (nameTemp !== undefined) {
				name = nameTemp;
			}
		}
	}

	return name;
};

const getJerseyNumber = (
	p: {
		jerseyNumber?: string;
		stats: any[];
	},
	type: "mostCommon" | "current" = "current",
): string | undefined => {
	if (type === "current") {
		// jerseyNumber at root of the file is the player's real current jersey number. Could be undefined if not set yet (draft prospect, or just signed and hasn't played yet)
		if (p.jerseyNumber !== undefined) {
			return p.jerseyNumber;
		}

		// This used to be the primary source of truth, but is now just historical data. Use it for players from before p.jerseyNumber was mandatory
		if (p.stats.length > 0) {
			return p.stats.at(-1).jerseyNumber;
		}

		// None found? Return undefind. This happens for players who have never been on a team during the season
		return;
	}

	// Find most common from career
	const numSeasonsByJerseyNumber: Record<string, number> = {};
	let max = 0;
	for (const { jerseyNumber } of p.stats) {
		if (jerseyNumber === undefined) {
			continue;
		}
		if (numSeasonsByJerseyNumber[jerseyNumber] === undefined) {
			numSeasonsByJerseyNumber[jerseyNumber] = 1;
		} else {
			numSeasonsByJerseyNumber[jerseyNumber] += 1;
		}

		if (numSeasonsByJerseyNumber[jerseyNumber] > max) {
			max = numSeasonsByJerseyNumber[jerseyNumber];
		}
	}

	const entries = Object.entries(numSeasonsByJerseyNumber).reverse();
	const entry = entries.find((entry) => entry[1] === max);
	if (entry) {
		return entry[0];
	}

	return undefined;
};

// Based on the currnet number of active teams, the number of draft rounds, and the number of expansion teams, what is the minimum valid number for the max number of players that can be taken per team?
const getExpansionDraftMinimumPlayersPerActiveTeam = (
	numExpansionTeams: number,
	numDraftRounds: number,
	numActiveTeams: number,
) => {
	return Math.ceil(
		(Math.max(1, numExpansionTeams) * numDraftRounds) / numActiveTeams,
	);
};

const ratio = (
	numerator: number,
	denominator: number,
	allowInfinity?: boolean,
) => {
	if (denominator > 0) {
		return numerator / denominator;
	}

	if (allowInfinity && numerator !== 0) {
		return numerator / denominator;
	}

	return 0;
};

const percentage = (
	numerator: number | undefined,
	denominator: number | undefined,
) => {
	// Handle missing historical basketball stats
	if (numerator === undefined || denominator === undefined) {
		return undefined;
	}

	return 100 * ratio(numerator, denominator);
};

const formatRecord = ({
	won,
	lost,
	tied,
	otl,
}: {
	won: number;
	lost: number;
	tied?: number;
	otl?: number;
}) => {
	let record = `${won}-${lost}`;
	if (typeof otl === "number" && !Number.isNaN(otl) && otl > 0) {
		record += `-${otl}`;
	}
	if (typeof tied === "number" && !Number.isNaN(tied) && tied > 0) {
		record += `-${tied}`;
	}

	return record;
};

const overtimeText = (
	numOvertimes: number | undefined,
	numPeriods: number | undefined,
) => {
	let overtimes = "";

	if (numOvertimes !== undefined && numOvertimes > 0) {
		if (isSport("baseball")) {
			overtimes = `${(numPeriods ?? 0) + numOvertimes}`;
		} else {
			if (numOvertimes === 1) {
				overtimes = "OT";
			} else if (numOvertimes > 1) {
				overtimes = `${numOvertimes}OT`;
			}
		}
	}

	return overtimes;
};

const sum = (values: (number | undefined)[]) => {
	let total = 0;
	for (const value of values) {
		if (value !== undefined) {
			total += value;
		}
	}
	return total;
};

// If a player was just drafted and the regular season hasn't started, then he can be released without paying anything
const justDrafted = (
	p: {
		draft: {
			year: number;
		};
		contract: PlayerContract;
	},
	phase: Phase,
	season: number,
) => {
	return (
		!!p.contract.rookie &&
		((p.draft.year === season && phase >= PHASE.DRAFT) ||
			(p.draft.year === season - 1 &&
				phase < PHASE.REGULAR_SEASON &&
				phase >= 0))
	);
};

const getRelativeType = (
	gender: GameAttributesLeague["gender"],
	type: RelativeType | "grandfather" | "uncle" | "grandson" | "nephew",
) => {
	const isMale = gender === "male";

	switch (type) {
		case "brother":
			return isMale ? "Brother" : "Sister";
		case "son":
			return isMale ? "Son" : "Daughter";
		case "father":
			return isMale ? "Father" : "Mother";
		case "grandfather":
			return isMale ? "Grandfather" : "Grandmother";
		case "grandson":
			return isMale ? "Grandson" : "Granddaughter";
		case "nephew":
			return isMale ? "Nephew" : "Niece";
		case "uncle":
		default:
			return isMale ? "Uncle" : "Aunt";
	}
};

const pronoun = (
	gender: GameAttributesLeague["gender"],
	pronoun: "he" | "He" | "him" | "Him" | "his" | "His" | "himself" | "Himself",
) => {
	if (gender === "female") {
		switch (pronoun) {
			case "he":
				return "she";
			case "He":
				return "She";
			case "him":
				return "her";
			case "Him":
				return "Her";
			case "his":
				return "her";
			case "His":
				return "her";
			case "himself":
				return "herself";
			case "Himself":
				return "Herself";
			default:
				return "???";
		}
	}

	return pronoun;
};

const getRecordNumericValue = (record: string | null) => {
	if (record === null) {
		return -Infinity;
	}

	let [won = 0, lost = 0, otl, tied] = record
		.split("-")
		.map((num) => Number.parseInt(num));

	// Technically, if only one of "tied" or "otl" is present, we can't distinguish. Assume it's tied, in that case.
	if (typeof otl === "number" && typeof tied !== "number") {
		tied = otl;
		otl = 0;
	}

	if (typeof otl !== "number") {
		otl = 0;
	}
	if (typeof tied !== "number") {
		tied = 0;
	}

	if (won + lost + otl + tied > 0) {
		// Sort by wins, winp
		return won + (won + 0.5 * tied) / (won + lost + otl + tied);
	}

	return 0;
};

const plural = (text: string, amount: number, textPluralOverride?: string) => {
	if (amount === 1) {
		return text;
	}

	return textPluralOverride ?? `${text}s`;
};

export default {
	addPopRank,
	getPopRanks,
	gameScore,
	getCountry,
	getExpansionDraftMinimumPlayersPerActiveTeam,
	getJerseyNumber,
	getTeamsDefault,
	deepCopy,
	formatCurrencyBase,
	isAmerican,
	bound,
	leagueUrlBase,
	numberWithCommas,
	ordinal,
	plural,
	roundWinp,
	upperCaseFirstLetter,
	keys,
	ratio,
	percentage,
	formatRecord,
	overtimeText,
	sum,
	justDrafted,
	getRelativeType,
	pronoun,
	getRecordNumericValue,
	localeParseFloat,
};
