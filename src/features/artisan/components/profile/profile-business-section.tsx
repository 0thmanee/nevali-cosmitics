import React from "react";

const fieldStyle = {
	background: "var(--color-paper)",
	border: "1px solid var(--color-cream-dark)",
};

type Props = {
	entityName: string;
	registrationNumber: string | null;
	region: string;
	city: string;
	yearEstablished: string | null;
	categories: string[];
	annualCapacity: string | null;
};

export function ProfileBusinessSection({
	entityName,
	registrationNumber,
	region,
	city,
	yearEstablished,
	categories,
	annualCapacity,
}: Props) {
	const primaryProducts = categories.length > 0 ? categories.join(", ") : "—";

	const fields = [
		{ label: "Entity Name", value: entityName },
		{ label: "Registration No.", value: registrationNumber ?? "—" },
		{ label: "Region", value: region },
		{ label: "City", value: city },
		{ label: "Year Established", value: yearEstablished ?? "—" },
		{ label: "Primary Products", value: primaryProducts },
		{ label: "Annual Capacity", value: annualCapacity ?? "—" },
	];

	return (
		<div
			className="overflow-hidden rounded-sm"
			style={{
				background: "white",
				border: "1px solid var(--color-cream-dark)",
			}}
		>
			<div
				className="border-b px-5 py-4"
				style={{ borderColor: "var(--color-cream-dark)" }}
			>
				<h3 className="font-bold font-serif text-[15px] text-text-dark">
					Business Information
				</h3>
				<p className="mt-0.5 font-sans text-[11px] text-text-muted">
					Your cooperative and legal details
				</p>
			</div>
			<div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
				{fields.map((field) => (
					<div className="flex flex-col gap-1.5" key={field.label}>
						<label className="font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
							{field.label}
						</label>
						<div
							className="rounded-sm px-3.5 py-2.5 font-sans text-sm text-text-dark"
							style={fieldStyle}
						>
							{field.value}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
