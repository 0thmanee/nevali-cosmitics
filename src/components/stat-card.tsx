import type React from "react";

export type StatCardVariant = "neutral" | "green" | "amber" | "red";

const STYLES: Record<
	StatCardVariant,
	{
		accent: string;
		label: string;
		value: string;
		iconBg: string;
		iconColor: string;
		bg: string;
	}
> = {
	neutral: {
		accent: "var(--color-ink)",
		bg: "bg-white",
		label: "text-text-muted",
		value: "text-text-dark",
		iconBg: "bg-cream",
		iconColor: "var(--color-ink)",
	},
	green: {
		accent: "var(--color-ink)",
		bg: "bg-white",
		label: "text-text-muted",
		value: "text-text-dark",
		iconBg: "bg-cream",
		iconColor: "var(--color-ink)",
	},
	amber: {
		accent: "var(--color-text-muted)",
		bg: "bg-white",
		label: "text-text-muted",
		value: "text-text-muted",
		iconBg: "bg-cream",
		iconColor: "var(--color-text-muted)",
	},
	red: {
		accent: "var(--color-danger-dark)",
		bg: "bg-white",
		label: "text-text-muted",
		value: "text-[var(--color-danger-dark)]",
		iconBg: "bg-cream",
		iconColor: "var(--color-danger-dark)",
	},
};

export const STAT_ICON_COLOR: Record<StatCardVariant, string> = {
	neutral: "var(--color-ink)",
	green: "var(--color-ink)",
	amber: "var(--color-text-muted)",
	red: "var(--color-danger-dark)",
};

type Props = {
	label: string;
	value: string | number;
	icon: React.ReactNode;
	variant?: StatCardVariant;
	subline?: string;
	className?: string;
};

export function StatCard({
	label,
	value,
	icon,
	variant = "neutral",
	subline,
	className = "",
}: Props) {
	const s = STYLES[variant];
	return (
		<div
			className={`relative flex items-stretch overflow-hidden border border-cream-dark ${s.bg} ${className}`}
		>
			{/* Left accent bar */}
			<div className="w-1 shrink-0" style={{ background: s.accent }} />

			<div className="flex flex-1 items-center justify-between gap-4 px-5 py-5">
				<div className="flex min-w-0 flex-col gap-1">
					<span
						className={`font-bold font-sans text-xs uppercase tracking-[0.12em] ${s.label}`}
					>
						{label}
					</span>
					<span
						className={`font-bold font-sans leading-none ${s.value}`}
						style={{ fontSize: "2.25rem" }}
					>
						{value}
					</span>
					{subline && (
						<p className="mt-1 max-w-[180px] font-sans text-text-muted/80 text-xs leading-snug">
							{subline}
						</p>
					)}
				</div>

				<div
					className={`flex h-11 w-11 shrink-0 items-center justify-center ${s.iconBg}`}
				>
					{icon}
				</div>
			</div>
		</div>
	);
}
