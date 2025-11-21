import type { CompositeWeights, Conf, Div, NonEmptyArray } from "./types.ts";
import type { RatingKey } from "./types.basketball.ts";

const COMPOSITE_WEIGHTS: CompositeWeights<RatingKey> = {
	pace: {
		ratings: ["spd", "jmp", "dnk", "tp", "drb", "pss"],
	},
	usage: {
		ratings: ["ins", "dnk", "fg", "tp", "spd", "hgt", "drb", "oiq"],
		weights: [1.5, 1, 1, 1, 0.5, 0.5, 0.5, 0.5],
		skill: {
			label: "V",
			cutoff: 0.61,
		},
	},
	dribbling: {
		ratings: ["drb", "spd"],
		weights: [1, 1],
		skill: {
			label: "B",
			cutoff: 0.68,
		},
	},
	passing: {
		ratings: ["drb", "pss", "oiq"],
		weights: [0.4, 1, 0.5],
		skill: {
			label: "Ps",
			cutoff: 0.63,
		},
	},
	turnovers: {
		ratings: [50, "ins", "pss", "oiq"],
		weights: [0.5, 1, 1, -1],
	},
	shootingAtRim: {
		ratings: ["hgt", "stre", "dnk", "oiq"],
		weights: [2, 0.3, 0.3, 0.2],
	},
	shootingLowPost: {
		ratings: ["hgt", "stre", "spd", "ins", "oiq"],
		weights: [1, 0.6, 0.2, 1, 0.4],
		skill: {
			label: "Po",
			cutoff: 0.61,
		},
	},
	shootingMidRange: {
		ratings: ["oiq", "fg", "stre"],
		weights: [-0.5, 1, 0.2],
	},
	shootingThreePointer: {
		ratings: ["oiq", "tp"],
		weights: [0.1, 1],
		skill: {
			label: "3",
			cutoff: 0.59,
		},
	},
	shootingFT: {
		ratings: ["ft"],
	},
	rebounding: {
		ratings: ["hgt", "stre", "jmp", "reb", "oiq", "diq"],
		weights: [2, 0.1, 0.1, 2, 0.5, 0.5],
		skill: {
			label: "R",
			cutoff: 0.61,
		},
	},
	stealing: {
		ratings: [50, "spd", "diq"],
		weights: [1, 1, 2],
	},
	blocking: {
		ratings: ["hgt", "jmp", "diq"],
		weights: [2.5, 1.5, 0.5],
	},
	fouling: {
		ratings: [50, "hgt", "diq", "spd"],
		weights: [3, 1, -1, -1],
	},
	drawingFouls: {
		ratings: ["hgt", "spd", "drb", "dnk", "oiq"],
		weights: [1, 1, 1, 1, 1],
	},
	defense: {
		ratings: ["hgt", "stre", "spd", "jmp", "diq"],
		weights: [1, 1, 1, 0.5, 2],
	},
	defenseInterior: {
		ratings: ["hgt", "stre", "spd", "jmp", "diq"],
		weights: [2.5, 1, 0.5, 0.5, 2],
		skill: {
			label: "Di",
			cutoff: 0.57,
		},
	},
	defensePerimeter: {
		ratings: ["hgt", "stre", "spd", "jmp", "diq"],
		weights: [0.5, 0.5, 2, 0.5, 1],
		skill: {
			label: "Dp",
			cutoff: 0.61,
		},
	},
	endurance: {
		ratings: [50, "endu"],
		weights: [1, 1],
	},
	athleticism: {
		ratings: ["stre", "spd", "jmp", "hgt"],
		weights: [1, 1, 1, 0.75],
		skill: {
			label: "A",
			cutoff: 0.63,
		},
	},
	jumpBall: {
		ratings: ["hgt", "jmp"],
		weights: [1, 0.25],
	},
};

const PLAYER_GAME_STATS = {
	all: {
		name: "All",
		stats: [
			"gs",
			"min",
			"fg",
			"fga",
			"fgp",
			"tp",
			"tpa",
			"tpp",
			"ft",
			"fta",
			"ftp",
			"orb",
			"drb",
			"trb",
			"ast",
			"tov",
			"stl",
			"blk",
			"ba",
			"pf",
			"pts",
			"pm",
			"gmsc",
		],
		sortBy: ["min"],
	},
};

const PLAYER_SUMMARY = {
	summary: {
		name: "Summary",
		stats: [
			"gp",
			"min",
			"pts",
			"trb",
			"ast",
			"fgp",
			"tpp",
			"ftp",
			"tsp",
			"per",
			"ws",
		],
	},
};

const PLAYER_STATS_TABLES = {
	regular: {
		name: "Per Game",
		stats: [
			"gp",
			"gs",
			"min",
			"fg",
			"fga",
			"fgp",
			"tp",
			"tpa",
			"tpp",
			"2p",
			"2pa",
			"2pp",
			"efg",
			"ft",
			"fta",
			"ftp",
			"orb",
			"drb",
			"trb",
			"ast",
			"tov",
			"stl",
			"blk",
			"ba",
			"pf",
			"pts",
		],
	},
	shotLocations: {
		name: "Shot Locations and Feats",
		stats: [
			"gp",
			"gs",
			"min",
			"fgAtRim",
			"fgaAtRim",
			"fgpAtRim",
			"fgLowPost",
			"fgaLowPost",
			"fgpLowPost",
			"fgMidRange",
			"fgaMidRange",
			"fgpMidRange",
			"tp",
			"tpa",
			"tpp",
			"dd",
			"td",
			"qd",
			"fxf",
		],
		superCols: [
			{
				title: "",
				colspan: 7,
			},
			{
				title: "At Rim",
				colspan: 3,
			},
			{
				title: "Low Post",
				colspan: 3,
			},
			{
				title: "Mid-Range",
				colspan: 3,
			},
			{
				title: "3PT",
				desc: "Three-Pointers",
				colspan: 3,
			},
			{
				title: "Feats",
				desc: "Statistical Feats",
				colspan: 4,
			},
		],
	},
	advanced: {
		name: "Advanced",
		stats: [
			"gp",
			"gs",
			"min",
			"per",
			"ewa",
			"tsp",
			"tpar",
			"ftr",
			"orbp",
			"drbp",
			"trbp",
			"astp",
			"stlp",
			"blkp",
			"tovp",
			"usgp",
			//"pm",
			"pm100",
			"onOff100",
			"ortg",
			"drtg",
			"ows",
			"dws",
			"ws",
			"ws48",
			"obpm",
			"dbpm",
			"bpm",
			"vorp",
		],
	},
	gameHighs: {
		name: "Game Highs",
		stats: [
			"gp",
			"minMax",
			"fgMax",
			"fgaMax",
			"tpMax",
			"tpaMax",
			"2pMax",
			"2paMax",
			"ftMax",
			"ftaMax",
			"orbMax",
			"drbMax",
			"trbMax",
			"astMax",
			"tovMax",
			"stlMax",
			"blkMax",
			"baMax",
			"pfMax",
			"ptsMax",
			"pmMax",
			"gmscMax",
		],
	},
};

const TEAM_STATS_TABLES = {
	team: {
		name: "Team",
		stats: [
			"fg",
			"fga",
			"fgp",
			"tp",
			"tpa",
			"tpp",
			"2p",
			"2pa",
			"2pp",
			"ft",
			"fta",
			"ftp",
			"orb",
			"drb",
			"trb",
			"ast",
			"tov",
			"stl",
			"blk",
			"pf",
			"pts",
			"mov",
		],
	},
	opponent: {
		name: "Opponent",
		stats: [
			"oppFg",
			"oppFga",
			"oppFgp",
			"oppTp",
			"oppTpa",
			"oppTpp",
			"opp2p",
			"opp2pa",
			"opp2pp",
			"oppFt",
			"oppFta",
			"oppFtp",
			"oppOrb",
			"oppDrb",
			"oppTrb",
			"oppAst",
			"oppTov",
			"oppStl",
			"oppBlk",
			"oppPf",
			"oppPts",
			"oppMov",
		],
	},
	teamShotLocations: {
		name: "Shot Locations and Feats",
		stats: [
			"fgAtRim",
			"fgaAtRim",
			"fgpAtRim",
			"fgLowPost",
			"fgaLowPost",
			"fgpLowPost",
			"fgMidRange",
			"fgaMidRange",
			"fgpMidRange",
			"tp",
			"tpa",
			"tpp",
			"dd",
			"td",
			"qd",
			"fxf",
		],
		superCols: [
			{
				title: "",
				colspan: 4,
			},
			{
				title: "At Rim",
				colspan: 3,
			},
			{
				title: "Low Post",
				colspan: 3,
			},
			{
				title: "Mid-Range",
				colspan: 3,
			},
			{
				title: "3PT",
				desc: "Three-Pointers",
				colspan: 3,
			},
			{
				title: "Feats",
				desc: "Statistical Feats",
				colspan: 4,
			},
		],
	},
	opponentShotLocations: {
		name: "Opponent Shot Locations and Feats",
		stats: [
			"oppFgAtRim",
			"oppFgaAtRim",
			"oppFgpAtRim",
			"oppFgLowPost",
			"oppFgaLowPost",
			"oppFgpLowPost",
			"oppFgMidRange",
			"oppFgaMidRange",
			"oppFgpMidRange",
			"oppTp",
			"oppTpa",
			"oppTpp",
			"oppDd",
			"oppTd",
			"oppQd",
			"oppFxf",
		],
		superCols: [
			{
				title: "",
				colspan: 4,
			},
			{
				title: "At Rim",
				colspan: 3,
			},
			{
				title: "Low Post",
				colspan: 3,
			},
			{
				title: "Mid-Range",
				colspan: 3,
			},
			{
				title: "3PT",
				desc: "Three-Pointers",
				colspan: 3,
			},
			{
				title: "Feats",
				desc: "Statistical Feats",
				colspan: 4,
			},
		],
	},
	advanced: {
		name: "Advanced",
		stats: [
			"pw",
			"pl",
			"ortg",
			"drtg",
			"nrtg",
			"pace",
			"tpar",
			"ftr",
			"tsp",
			"efg",
			"tovp",
			"orbp",
			"ftpFga",
			"oppEfg",
			"oppTovp",
			"drbp",
			"oppFtpFga",
		],
		superCols: [
			{
				title: "",
				colspan: 13,
			},
			{
				title: "Offensive Four Factors",
				colspan: 4,
			},
			{
				title: "Defensive Four Factors",
				colspan: 4,
			},
		],
	},
};

const POSITIONS = ["PG", "G", "SG", "GF", "SF", "F", "PF", "FC", "C"];

const POSITION_COUNTS = {};

const RATINGS: RatingKey[] = [
	"hgt",
	"stre",
	"spd",
	"jmp",
	"endu",
	"ins",
	"dnk",
	"ft",
	"fg",
	"tp",
	"oiq",
	"diq",
	"drb",
	"pss",
	"reb",
];

const SIMPLE_AWARDS = [
	"mvp",
	"roy",
	"smoy",
	"dpoy",
	"mip",
	"finalsMvp",
] as const;

const AWARD_NAMES = {
	mvp: "Most Valuable Player",
	roy: "Rookie of the Year",
	smoy: "Sixth Man of the Year",
	dpoy: "Defensive Player of the Year",
	mip: "Most Improved Player",
	finalsMvp: "Finals MVP",
	sfmvp: "Semifinals MVP",
	allLeague: "All-League",
	allDefensive: "All-Defensive",
	allRookie: "All-Rookie Team",
} as const;

const DEFAULT_CONFS: NonEmptyArray<Conf> = [
	{
		cid: 0,
		name: "Atlantic Coast",
	},
	{
		cid: 1,
		name: "Great Lakes",
	},
	{
		cid: 2,
		name: "Central Plains",
	},
	{
		cid: 3,
		name: "Southeastern",
	},
	{
		cid: 4,
		name: "Eastern Athletic",
	},
	{
		cid: 5,
		name: "Atlantic League",
	},
	{
		cid: 6,
		name: "Northeast",
	},
	{
		cid: 7,
		name: "American",
	},
	{
		cid: 8,
		name: "Atlantic Sun",
	},
	{
		cid: 9,
		name: "Mountain Sky",
	},
	{
		cid: 10,
		name: "Western",
	},
	{
		cid: 11,
		name: "Colonial",
	},
	{
		cid: 12,
		name: "United States",
	},
	{
		cid: 13,
		name: "Horizon",
	},
	{
		cid: 14,
		name: "Ivy",
	},
	{
		cid: 15,
		name: "Metro Atlantic",
	},
	{
		cid: 16,
		name: "Mid-American",
	},
	{
		cid: 17,
		name: "Mid-Eastern",
	},
	{
		cid: 18,
		name: "Mississippi Valley",
	},
	{
		cid: 19,
		name: "Rocky Mountain",
	},
	{
		cid: 20,
		name: "New England",
	},
	{
		cid: 21,
		name: "Ohio River",
	},
	{
		cid: 22,
		name: "Patriot",
	},
	{
		cid: 23,
		name: "Southern",
	},
	{
		cid: 24,
		name: "Southland",
	},
	{
		cid: 25,
		name: "Summit",
	},
	{
		cid: 26,
		name: "Sun Belt",
	},
	{
		cid: 27,
		name: "Southwestern",
	},
	{
		cid: 28,
		name: "Western Athletic",
	},
	{
		cid: 29,
		name: "Pacific Coast",
	},
	{
		cid: 30,
		name: "South Atlantic",
	},
];

const DEFAULT_DIVS: NonEmptyArray<Div> = [
	{
		did: 0,
		cid: 0,
		name: "Atlantic Coast",
	},
	{
		did: 1,
		cid: 1,
		name: "Great Lakes",
	},
	{
		did: 2,
		cid: 2,
		name: "Central Plains",
	},
	{
		did: 3,
		cid: 3,
		name: "Southeastern",
	},
	{
		did: 4,
		cid: 4,
		name: "Eastern Athletic",
	},
	{
		did: 5,
		cid: 5,
		name: "Atlantic League",
	},
	{
		did: 6,
		cid: 6,
		name: "Northeast",
	},
	{
		did: 7,
		cid: 7,
		name: "American",
	},
	{
		did: 8,
		cid: 8,
		name: "Atlantic Sun",
	},
	{
		did: 9,
		cid: 9,
		name: "Mountain Sky",
	},
	{
		did: 10,
		cid: 10,
		name: "Western",
	},
	{
		did: 11,
		cid: 11,
		name: "Colonial",
	},
	{
		did: 12,
		cid: 12,
		name: "United States",
	},
	{
		did: 13,
		cid: 13,
		name: "Horizon",
	},
	{
		did: 14,
		cid: 14,
		name: "Ivy",
	},
	{
		did: 15,
		cid: 15,
		name: "Metro Atlantic",
	},
	{
		did: 16,
		cid: 16,
		name: "Mid-American",
	},
	{
		did: 17,
		cid: 17,
		name: "Mid-Eastern",
	},
	{
		did: 18,
		cid: 18,
		name: "Mississippi Valley",
	},
	{
		did: 19,
		cid: 19,
		name: "Rocky Mountain",
	},
	{
		did: 20,
		cid: 20,
		name: "New England",
	},
	{
		did: 21,
		cid: 21,
		name: "Ohio River",
	},
	{
		did: 22,
		cid: 22,
		name: "Patriot",
	},
	{
		did: 23,
		cid: 23,
		name: "Southern",
	},
	{
		did: 24,
		cid: 24,
		name: "Southland",
	},
	{
		did: 25,
		cid: 25,
		name: "Summit",
	},
	{
		did: 26,
		cid: 26,
		name: "Sun Belt",
	},
	{
		did: 27,
		cid: 27,
		name: "Southwestern",
	},
	{
		did: 28,
		cid: 28,
		name: "Western Athletic",
	},
	{
		did: 29,
		cid: 29,
		name: "Pacific Coast",
	},
	{
		did: 30,
		cid: 30,
		name: "South Atlantic",
	},
];

const DEFAULT_STADIUM_CAPACITY = 16000; // College basketball arenas are typically smaller than NBA arenas

export {
	AWARD_NAMES,
	DEFAULT_CONFS,
	DEFAULT_DIVS,
	COMPOSITE_WEIGHTS,
	PLAYER_GAME_STATS,
	PLAYER_STATS_TABLES,
	PLAYER_SUMMARY,
	POSITION_COUNTS,
	POSITIONS,
	RATINGS,
	SIMPLE_AWARDS,
	TEAM_STATS_TABLES,
	DEFAULT_STADIUM_CAPACITY,
};
