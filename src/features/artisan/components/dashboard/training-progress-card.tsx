"use client";

import Link from "next/link";
import React from "react";
import { useTrainingPrograms } from "~/features/artisan/hooks/use-training";
import { getTrainingProgramDisplayStatus } from "~/features/artisan/utils/training";

const LEVEL_COLORS: Record<string, string> = {
	BEGINNER: "var(--color-info)",
	INTERMEDIATE: "var(--color-text-muted)",
	ADVANCED: "var(--color-primary-light)",
};

export function TrainingProgressCard() {
	const { data: programs = [], isLoading } = useTrainingPrograms();

	const inProgress = programs.filter(
		(p) => getTrainingProgramDisplayStatus(p) === "IN_PROGRESS",
	);

	if (isLoading) {
		return (
			<div
				className="overflow-hidden rounded-sm"
				style={{
					background: "white",
					border: "1px solid var(--color-cream-dark)",
				}}
			>
				<div
					className="border-b px-5 py-3.5"
					style={{ borderColor: "var(--color-cream-dark)" }}
				>
					<h2 className="font-bold font-serif text-[15px] text-text-dark">
						Training Progress
					</h2>
					<p className="mt-0.5 font-sans text-[12px] text-text-muted">
						Loading…
					</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className="overflow-hidden rounded-sm"
			style={{
				background: "white",
				border: "1px solid var(--color-cream-dark)",
			}}
		>
			<div
				className="flex items-center justify-between border-b px-5 py-3.5"
				style={{ borderColor: "var(--color-cream-dark)" }}
			>
				<div>
					<h2 className="font-bold font-serif text-[15px] text-text-dark">
						Training Progress
					</h2>
					<p className="mt-0.5 font-sans text-[12px] text-text-muted">
						{inProgress.length === 0
							? "No programs in progress"
							: `${inProgress.length} program${inProgress.length !== 1 ? "s" : ""} in progress`}
					</p>
				</div>
				{programs.length > 0 && (
					<Link
						className="font-sans font-semibold text-[12px] text-text-dark hover:underline"
						href="/artisan/training"
					>
						View all
					</Link>
				)}
			</div>
			{inProgress.length === 0 ? (
				<div className="px-5 py-4">
					<p className="font-sans text-[12px] text-text-muted">
						Enroll in a program from the Training page to see your progress
						here.
					</p>
					<Link
						className="mt-2 inline-block font-sans font-semibold text-[12px] text-text-dark hover:underline"
						href="/artisan/training"
					>
						Go to Training →
					</Link>
				</div>
			) : (
				inProgress.slice(0, 3).map((p) => {
					const color = LEVEL_COLORS[p.level] ?? "var(--color-text-muted)";
					return (
						<Link
							className="block px-5 py-3 transition-colors hover:bg-[var(--color-paper)]"
							href={`/artisan/training/${p.id}`}
							key={p.id}
							style={{ borderTop: "1px solid var(--color-cream-dark)" }}
						>
							<div className="mb-2 flex items-center justify-between">
								<p className="font-sans font-semibold text-sm text-text-dark leading-tight">
									{p.name}
								</p>
								<span className="font-sans text-[11px] text-text-muted">
									{p.enrollment?.progress ?? 0}%
								</span>
							</div>
							<div
								className="h-1.5 w-full overflow-hidden rounded-full"
								style={{ background: "var(--color-paper)" }}
							>
								<div
									className="h-full rounded-full"
									style={{
										width: `${p.enrollment?.progress ?? 0}%`,
										background: color,
									}}
								/>
							</div>
							<p className="mt-1.5 font-sans text-[11px] text-text-muted">
								{p.enrollment?.modulesCompleted ?? 0}/{p.modulesCount} modules ·{" "}
								{p.provider}
							</p>
						</Link>
					);
				})
			)}
		</div>
	);
}
