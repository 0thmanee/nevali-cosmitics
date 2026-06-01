import React from "react";

const stats = [
	{ label: "CERTIFIED PARTNERS", value: "240+" },
	{ label: "LISTED PRODUCTS", value: "1,800+" },
	{ label: "EXPORT MARKETS", value: "34" },
	{ label: "TRANSACTIONS PROCESSED", value: "€4.2M", gold: true },
];

export default function StatsBar() {
	return (
		<section className="border-cream-dark border-b bg-white">
			<div className="mx-auto w-full max-w-7xl px-4 py-8">
				<div className="grid grid-cols-2 gap-6 md:flex md:items-center md:justify-between md:gap-0">
					{stats.map((stat, i) => (
						<div className="flex items-center gap-8 md:gap-16" key={stat.label}>
							<div className="flex flex-col gap-1.5">
								<span
									className={`font-bold font-serif text-[28px] leading-none md:text-[32px] ${
										stat.gold ? "text-secondary" : "text-text-dark"
									}`}
								>
									{stat.value}
								</span>
								<span className="font-sans text-text-muted text-xs uppercase tracking-widest md:text-xs">
									{stat.label}
								</span>
							</div>
							{i < stats.length - 1 && (
								<div className="hidden h-10 w-px bg-cream-dark md:block" />
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
