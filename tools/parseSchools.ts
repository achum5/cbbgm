import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the raw data
const rawData = readFileSync(join(__dirname, "schoolsRawData.txt"), "utf-8");
const lines = rawData.trim().split("\n");

// Conference mapping for easier reference
const conferenceMap: Record<string, string> = {
	"A-10": "Atlantic 10",
	"ACC": "ACC",
	"America East": "America East",
	"American": "American",
	"ASUN": "ASUN",
	"Big 12": "Big 12",
	"Big East": "Big East",
	"Big Sky": "Big Sky",
	"Big South": "Big South",
	"Big Ten": "Big Ten",
	"Big West": "Big West",
	"CAA": "Colonial",
	"Conference USA": "Conference USA",
	"Horizon League": "Horizon",
	"Ivy League": "Ivy League",
	"MAAC": "MAAC",
	"MAC": "MAC",
	"MEAC": "MEAC",
	"Missouri Valley": "Missouri Valley",
	"Mountain West": "Mountain West",
	"MW": "Mountain West", // Grand Canyon
	"NEC": "NEC",
	"Ohio Valley": "Ohio Valley",
	"Patriot League": "Patriot",
	"SEC": "SEC",
	"Southern": "Southern",
	"Southland": "Southland",
	"The Summit": "Summit",
	"Sun Belt": "Sun Belt",
	"SWAC": "SWAC",
	"WAC": "WAC",
	"West Coast": "West Coast",
};

interface SchoolData {
	fullName: string;
	variantName: string; // City + Mascot (what we'll use in game)
	mascot: string;
	city: string;
	state: string; // 2-letter code
	conference: string;
	colors: string[]; // Hex codes
	prestigeBase: number; // 0-100
}

const schools: SchoolData[] = [];

// Parse each line
for (const line of lines) {
	// Split by multiple spaces/tabs to separate school from conference
	const parts = line.split(/\s{2,}|\t+/);
	if (parts.length < 2) continue;

	const fullName = parts[0].trim();
	const conference = parts[1].trim();

	// Extract mascot (last word before conference)
	const words = fullName.split(" ");
	const mascot = words[words.length - 1];

	console.log(`Processing: ${fullName} - ${mascot} - ${conference}`);

	schools.push({
		fullName,
		variantName: "", // TODO: Fill in
		mascot,
		city: "", // TODO: Fill in
		state: "", // TODO: Fill in
		conference: conferenceMap[conference] || conference,
		colors: [], // TODO: Fill in
		prestigeBase: 50, // TODO: Fill in based on basketball history
	});
}

console.log(`\nParsed ${schools.length} schools`);

// Write to JSON for manual editing
writeFileSync(
	join(__dirname, "schoolsData.json"),
	JSON.stringify(schools, null, 2),
	"utf-8"
);

console.log("\nWrote to schoolsData.json - now we can add cities, states, colors, and prestige");
