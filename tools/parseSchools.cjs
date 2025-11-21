const fs = require("fs");
const path = require("path");

// Read the raw data
const rawData = fs.readFileSync(path.join(__dirname, "schoolsRawData.txt"), "utf-8");
const lines = rawData.trim().split("\n");

// Conference mapping for easier reference
const conferenceMap = {
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

const schools = [];

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

console.log(`Parsed ${schools.length} schools`);

// Write to JSON for manual editing
fs.writeFileSync(
	path.join(__dirname, "schoolsData.json"),
	JSON.stringify(schools, null, 2),
	"utf-8"
);

console.log("\nWrote to schoolsData.json");
console.log("\nNext steps:");
console.log("1. Add city/region names");
console.log("2. Add state codes");
console.log("3. Add school colors (hex codes)");
console.log("4. Add prestige ratings");
