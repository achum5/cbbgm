import clsx from "clsx";
import type { PlayerContract } from "../../common/types.ts";
import { helpers, useLocal, useLocalPartial } from "../util/index.ts";

type ContractPlayer = {
	draft: {
		year: number;
	};
	contract: PlayerContract;
};

const useJustDrafted = (p: ContractPlayer) => {
	const { phase, season } = useLocalPartial(["phase", "season"]);

	return helpers.justDrafted(p, phase as any, season);
};

const NON_GUARANTEED_CONTRACT_TEXT =
	"Contracts for drafted players are not guaranteed until the regular season. If you release a drafted player before then, you pay nothing.";

export const ContractAmount = ({
	p,
	override,
}: {
	p: ContractPlayer;
	override?: number;
}) => {
	const justDrafted = useJustDrafted(p);

	// Check if this is a scholarship player (status field exists, or amount is 0)
	const isScholarshipSystem = p.contract.status !== undefined || p.contract.amount === 0;

	if (isScholarshipSystem && p.contract.yearsRemaining !== undefined) {
		// For scholarship system, just show years remaining
		const years = p.contract.yearsRemaining;
		return (
			<span
				className={years === 1 ? "fw-bold" : undefined}
				title={years === 1 ? "Final year of eligibility" : undefined}
			>
				{years} {years === 1 ? "yr" : "yrs"}
			</span>
		);
	}

	return (
		<span
			className={justDrafted ? "fst-italic" : undefined}
			title={justDrafted ? NON_GUARANTEED_CONTRACT_TEXT : undefined}
		>
			{helpers.formatCurrency(override ?? p.contract.amount, "M")}
		</span>
	);
};

export const wrappedContractAmount = (p: ContractPlayer, override?: number) => {
	const isScholarshipSystem = p.contract.status !== undefined || p.contract.amount === 0;

	if (isScholarshipSystem && p.contract.yearsRemaining !== undefined) {
		const years = p.contract.yearsRemaining;
		const formatted = `${years} ${years === 1 ? "yr" : "yrs"}`;
		return {
			value: <ContractAmount p={p} override={override} />,
			sortValue: years,
			searchValue: formatted,
		};
	}

	const formatted = helpers.formatCurrency(override ?? p.contract.amount, "M");
	return {
		value: <ContractAmount p={p} override={override} />,
		sortValue: p.contract.amount,
		searchValue: formatted,
	};
};

export const ContractExp = ({
	p,
	override,
}: {
	p: ContractPlayer;
	override?: number;
}) => {
	const justDrafted = useJustDrafted(p);

	const season = useLocal((state) => state.season);
	const expiring = season === p.contract.exp;

	// Check if this is a scholarship player
	const isScholarshipSystem = p.contract.status !== undefined || p.contract.amount === 0;

	if (isScholarshipSystem && p.contract.yearsRemaining !== undefined) {
		const years = p.contract.yearsRemaining;
		return (
			<span
				className={years === 1 ? "fw-bold" : undefined}
				title={years === 1 ? "Final year of eligibility" : undefined}
			>
				{years} {years === 1 ? "yr" : "yrs"}
			</span>
		);
	}

	return (
		<span
			className={clsx({
				"fst-italic": justDrafted,
				"fw-bold": expiring,
			})}
			title={
				justDrafted
					? NON_GUARANTEED_CONTRACT_TEXT
					: expiring
						? "Expiring contract"
						: undefined
			}
		>
			{override ?? p.contract.exp}
		</span>
	);
};

export const wrappedContractExp = (p: ContractPlayer, override?: number) => {
	const isScholarshipSystem = p.contract.status !== undefined || p.contract.amount === 0;

	if (isScholarshipSystem && p.contract.yearsRemaining !== undefined) {
		const years = p.contract.yearsRemaining;
		const formatted = `${years} ${years === 1 ? "yr" : "yrs"}`;
		return {
			value: <ContractExp p={p} override={override} />,
			sortValue: years,
			searchValue: formatted,
		};
	}

	const formatted = override ?? p.contract.exp;
	return {
		value: <ContractExp p={p} override={override} />,
		sortValue: formatted,
		searchValue: formatted,
	};
};

export const Contract = ({ p }: { p: ContractPlayer }) => {
	const justDrafted = useJustDrafted(p);
	const isScholarshipSystem = p.contract.status !== undefined || p.contract.amount === 0;

	// For scholarship system, just show years remaining (no "thru" or separator)
	if (isScholarshipSystem && p.contract.yearsRemaining !== undefined) {
		return <ContractAmount p={p} />;
	}

	return (
		<>
			<ContractAmount p={p} />
			<span
				className={justDrafted ? "fst-italic" : undefined}
				title={justDrafted ? NON_GUARANTEED_CONTRACT_TEXT : undefined}
			>
				{" "}
				thru{" "}
			</span>
			<ContractExp p={p} />
		</>
	);
};

export const wrappedContract = (p: ContractPlayer) => {
	const isScholarshipSystem = p.contract.status !== undefined || p.contract.amount === 0;

	if (isScholarshipSystem && p.contract.yearsRemaining !== undefined) {
		const years = p.contract.yearsRemaining;
		const formatted = `${years} ${years === 1 ? "yr" : "yrs"}`;

		return {
			value: <Contract p={p} />,
			sortValue: years,
			searchValue: formatted,
		};
	}

	const formattedAmount = helpers.formatCurrency(p.contract.amount, "M");
	const formatted = `${formattedAmount} thru ${p.contract.exp}`;

	return {
		value: <Contract p={p} />,
		sortValue: p.contract.amount,
		searchValue: formatted,
	};
};
