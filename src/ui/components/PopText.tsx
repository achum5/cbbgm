const PopText = ({
	className,
	numActiveTeams,
	teams,
	tid,
}: {
	className?: string;
	numActiveTeams: number;
	teams: {
		tid: number;
		pop?: number;
		popRank: number;
		prestigeBase?: number;
	}[];
	tid: number | undefined;
}) => {
	if (tid === undefined) {
		return null;
	}

	if (tid >= 0) {
		const t = teams.find((t2) => t2.tid === tid);
		if (t) {
			// For basketball, use prestige instead of population
			const usePrestige = t.prestigeBase !== undefined;

			if (usePrestige) {
				// Calculate prestige rank (sort by prestigeBase descending)
				const teamsSorted = [...teams].sort((a, b) => (b.prestigeBase || 0) - (a.prestigeBase || 0));
				const prestigeRank = teamsSorted.findIndex((t2) => t2.tid === t.tid) + 1;

				return (
					<span className={className}>
						School Prestige: {t.prestigeBase} (#{prestigeRank})<br />
					</span>
				);
			} else {
				// Original population display for non-basketball sports
				let size;
				if (t.popRank <= Math.ceil((3 / 30) * numActiveTeams)) {
					size = "very large";
				} else if (t.popRank <= Math.ceil((8 / 30) * numActiveTeams)) {
					size = "large";
				} else if (t.popRank <= Math.ceil((16 / 30) * numActiveTeams)) {
					size = "normal";
				} else if (t.popRank <= Math.ceil((24 / 30) * numActiveTeams)) {
					size = "small";
				} else {
					size = "very small";
				}

				return (
					<span className={className}>
						Population:{" "}
						{t.pop !== undefined ? `${t.pop.toFixed(1)} million ` : ""}(#
						{t.popRank}, {size})<br />
					</span>
				);
			}
		}
	}

	return <span className={className}>Population: ?</span>;
};

export default PopText;
