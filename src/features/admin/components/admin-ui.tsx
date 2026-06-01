/**
 * Shared admin UI primitives — keeps all pages visually consistent.
 * All components are flat/angular (no border-radius) matching the nevali design system.
 */
import type React from "react";

// ─── Status badge color maps ──────────────────────────────────────────────────
// Amber = positive/approved, to match platform palette (no green)

export const STATUS_COLORS = {
	APPROVED: {
		bg: "color-mix(in srgb, var(--color-text-muted) 10%, transparent)",
		color: "var(--color-text-muted)",
		label: "Approved",
	},
	PENDING: {
		bg: "color-mix(in srgb, var(--color-text-muted) 6%, transparent)",
		color: "var(--color-text-muted)",
		label: "Pending",
	},
	REJECTED: {
		bg: "color-mix(in srgb, var(--color-danger-dark) 10%, transparent)",
		color: "var(--color-danger-dark)",
		label: "Rejected",
	},
	RESOLVED: {
		bg: "color-mix(in srgb, var(--color-text-muted) 10%, transparent)",
		color: "var(--color-text-muted)",
		label: "Resolved",
	},
	OPEN: {
		bg: "color-mix(in srgb, var(--color-danger-dark) 10%, transparent)",
		color: "var(--color-danger-dark)",
		label: "Open",
	},
	IN_REVIEW: {
		bg: "color-mix(in srgb, var(--color-text-muted) 6%, transparent)",
		color: "var(--color-text-muted)",
		label: "In Review",
	},
	ACTIVE: {
		bg: "color-mix(in srgb, var(--color-text-muted) 10%, transparent)",
		color: "var(--color-text-muted)",
		label: "Active",
	},
	DRAFT: {
		bg: "color-mix(in srgb, var(--color-ink) 6%, transparent)",
		color: "var(--color-text-muted)",
		label: "Draft",
	},
	PUBLISHED: {
		bg: "color-mix(in srgb, var(--color-text-muted) 10%, transparent)",
		color: "var(--color-text-muted)",
		label: "Published",
	},
} as const;

export type StatusKey = keyof typeof STATUS_COLORS;

export function StatusBadge({ status }: { status: string }) {
	const s = STATUS_COLORS[status as StatusKey] ?? STATUS_COLORS.PENDING;
	return (
		<span
			className="inline-block px-2.5 py-0.5 font-sans font-semibold text-xs uppercase tracking-wide"
			style={{ background: s.bg, color: s.color }}
		>
			{s.label}
		</span>
	);
}

// ─── Filter tab button ────────────────────────────────────────────────────────

export function FilterTab({
	label,
	count,
	active,
	onClick,
}: {
	label: string;
	count?: number;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			className={`flex cursor-pointer items-center gap-1.5 px-4 py-1.5 font-medium font-sans text-sm transition-colors ${
				active
					? "bg-primary text-white"
					: "border border-cream-dark bg-white text-text-muted hover:border-primary/30"
			}`}
			onClick={onClick}
			type="button"
		>
			{label}
			{count !== undefined && (
				<span
					className={`px-1.5 py-px font-bold font-sans text-xs ${
						active
							? "bg-white/20 text-white"
							: "bg-black/[0.07] text-text-muted"
					}`}
				>
					{count}
				</span>
			)}
		</button>
	);
}

// ─── Action buttons ───────────────────────────────────────────────────────────

export function BtnPrimary({
	children,
	onClick,
	disabled,
	className = "",
}: {
	children: React.ReactNode;
	onClick?: () => void;
	disabled?: boolean;
	className?: string;
}) {
	return (
		<button
			className={`shrink-0 cursor-pointer bg-primary px-3 py-1.5 font-sans font-semibold text-white text-xs transition-opacity hover:opacity-90 disabled:opacity-50 ${className}`}
			disabled={disabled}
			onClick={onClick}
			type="button"
		>
			{children}
		</button>
	);
}

export function BtnSecondary({
	children,
	onClick,
	href,
	className = "",
}: {
	children: React.ReactNode;
	onClick?: () => void;
	href?: string;
	className?: string;
}) {
	if (href) {
		return (
			<a
				className={`shrink-0 border border-cream-dark bg-white px-3 py-1.5 font-medium font-sans text-text-dark text-xs no-underline transition-colors hover:border-primary/30 ${className}`}
				href={href}
			>
				{children}
			</a>
		);
	}
	return (
		<button
			className={`shrink-0 cursor-pointer border border-cream-dark bg-white px-3 py-1.5 font-medium font-sans text-text-dark text-xs transition-colors hover:border-primary/30 ${className}`}
			onClick={onClick}
			type="button"
		>
			{children}
		</button>
	);
}

export function BtnDanger({
	children,
	onClick,
	disabled,
	className = "",
}: {
	children: React.ReactNode;
	onClick?: () => void;
	disabled?: boolean;
	className?: string;
}) {
	return (
		<button
			className={`shrink-0 cursor-pointer border border-red-200 bg-red-50 px-3 py-1.5 font-sans font-semibold text-red-700 text-xs transition-colors hover:bg-red-100 disabled:opacity-50 ${className}`}
			disabled={disabled}
			onClick={onClick}
			type="button"
		>
			{children}
		</button>
	);
}

// ─── Table container ──────────────────────────────────────────────────────────

export function AdminTable({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`overflow-hidden border border-cream-dark bg-white ${className}`}
		>
			{children}
		</div>
	);
}

export function AdminTableToolbar({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-wrap items-center justify-between gap-3 border-cream-dark border-b bg-white px-5 py-3.5">
			{children}
		</div>
	);
}

export function AdminTableHead({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex items-center border-cream-dark border-b bg-cream px-5 py-2.5">
			{children}
		</div>
	);
}

export function AdminTableHeadCell({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`font-bold font-sans text-text-muted text-xs uppercase tracking-[0.1em] ${className}`}
		>
			{children}
		</div>
	);
}

export function AdminTableRow({
	children,
	onClick,
	className = "",
}: {
	children: React.ReactNode;
	onClick?: () => void;
	className?: string;
}) {
	return (
		<div
			className={`flex items-center border-cream-dark border-b px-5 py-3 transition-colors last:border-0 ${
				onClick ? "cursor-pointer hover:bg-cream/60" : ""
			} ${className}`}
			onClick={onClick}
			onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
			role={onClick ? "button" : undefined}
			tabIndex={onClick ? 0 : undefined}
		>
			{children}
		</div>
	);
}

export function AdminTableEmpty({ message }: { message: string }) {
	return (
		<div className="py-14 text-center font-sans text-sm text-text-muted">
			{message}
		</div>
	);
}

// ─── Page wrapper (consistent p-6 + stat card row) ───────────────────────────

export function AdminPageWrapper({ children }: { children: React.ReactNode }) {
	return <div className="flex flex-col gap-5 p-6">{children}</div>;
}

export function AdminStatRow({ children }: { children: React.ReactNode }) {
	return (
		<div className="grid grid-cols-2 gap-4 xl:grid-cols-4">{children}</div>
	);
}

// ─── Skeleton primitives ──────────────────────────────────────────────────────

export function Skel({
	className = "",
	style,
}: {
	className?: string;
	style?: React.CSSProperties;
}) {
	return (
		<div className={`animate-pulse bg-cream-dark ${className}`} style={style} />
	);
}

export function AdminTableSkeleton({
	rows = 7,
	cols = 5,
}: {
	rows?: number;
	cols?: number;
}) {
	return (
		<AdminTable>
			{/* Toolbar */}
			<AdminTableToolbar>
				<div className="flex gap-1">
					{[80, 72, 80, 72].map((w, i) => (
						<Skel className="h-7" key={i} style={{ width: w }} />
					))}
				</div>
				<Skel className="h-3 w-20" />
			</AdminTableToolbar>

			{/* Head */}
			<AdminTableHead>
				{Array.from({ length: cols }).map((_, i) => (
					<Skel className="h-2 flex-1" key={i} />
				))}
			</AdminTableHead>

			{/* Rows */}
			{Array.from({ length: rows }).map((_, i) => (
				<div
					className="flex items-center gap-4 border-cream-dark border-b px-5 py-3.5 last:border-0"
					key={i}
				>
					<Skel className="h-4 w-4 shrink-0" />
					<div className="flex flex-[2.8] items-center gap-3">
						<Skel className="h-11 w-11 shrink-0" />
						<div className="flex flex-col gap-1.5">
							<Skel className="h-3 w-28" />
							<Skel className="h-2 w-16" />
						</div>
					</div>
					{Array.from({ length: cols - 2 }).map((_, j) => (
						<Skel className="h-3 flex-1" key={j} />
					))}
				</div>
			))}
		</AdminTable>
	);
}
