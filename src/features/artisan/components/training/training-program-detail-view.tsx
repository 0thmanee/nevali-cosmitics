"use client";

import Link from "next/link";
import React from "react";
import type {
	TrainingProgramDetailRow,
	TrainingProgramMediaRow,
} from "~/app/api/training/schemas/training.schema";
import { getTrainingLevelLabel } from "~/app/api/training/schemas/training.schema";
import {
	useEnrollInProgram,
	useTrainingProgram,
	useUpdateEnrollmentProgress,
} from "~/features/artisan/hooks/use-training";

const levelStyle: Record<
	string,
	{ bg: string; color: string; border: string }
> = {
	BEGINNER: {
		bg: "color-mix(in srgb, var(--color-info) 12%, transparent)",
		color: "var(--color-info)",
		border: "1px solid color-mix(in srgb, var(--color-info) 25%, transparent)",
	},
	INTERMEDIATE: {
		bg: "color-mix(in srgb, var(--color-gold) 12%, transparent)",
		color: "var(--color-text-muted)",
		border: "1px solid color-mix(in srgb, var(--color-gold) 25%, transparent)",
	},
	ADVANCED: {
		bg: "color-mix(in srgb, var(--color-primary-light) 12%, transparent)",
		color: "var(--color-primary-light)",
		border:
			"1px solid color-mix(in srgb, var(--color-primary-light) 25%, transparent)",
	},
};

function MediaBlock({ media }: { media: TrainingProgramMediaRow }) {
	const title =
		media.title ||
		(media.mediaType === "VIDEO"
			? "Video"
			: media.mediaType === "PDF"
				? "Document"
				: "Image");

	if (media.mediaType === "VIDEO") {
		return (
			<div className="overflow-hidden rounded-sm bg-black">
				<video
					className="max-h-[400px] w-full"
					controls
					preload="metadata"
					src={media.fileUrl}
				/>
				{title && (
					<p className="px-3 py-2 font-sans text-[12px] text-white/80">
						{title}
					</p>
				)}
			</div>
		);
	}
	if (media.mediaType === "PDF") {
		return (
			<div
				className="overflow-hidden rounded-sm"
				style={{ border: "1px solid var(--color-cream-dark)" }}
			>
				<iframe
					className="h-[400px] w-full"
					src={media.fileUrl}
					title={title}
				/>
				<a
					className="block px-3 py-2 font-medium font-sans text-[12px] text-text-dark hover:underline"
					href={media.fileUrl}
					rel="noopener noreferrer"
					target="_blank"
				>
					Open PDF: {title}
				</a>
			</div>
		);
	}
	return (
		<div
			className="overflow-hidden rounded-sm"
			style={{ border: "1px solid var(--color-cream-dark)" }}
		>
			<a
				className="block"
				href={media.fileUrl}
				rel="noopener noreferrer"
				target="_blank"
			>
				<img
					alt={title}
					className="max-h-[400px] w-full bg-[var(--color-paper)] object-contain"
					src={media.fileUrl}
				/>
			</a>
			{title && (
				<p className="px-3 py-2 font-sans text-[12px] text-text-muted">
					{title}
				</p>
			)}
		</div>
	);
}

type Props = { programId: string };

export function TrainingProgramDetailView({ programId }: Props) {
	const { data: program, isLoading, isError } = useTrainingProgram(programId);
	const enrollMutation = useEnrollInProgram();
	const updateProgressMutation = useUpdateEnrollmentProgress();

	if (isLoading || !program) {
		return (
			<div className="flex items-center justify-center p-4 py-20 lg:p-6">
				<p className="font-sans text-sm text-text-muted">
					{isLoading ? "Loading…" : "Program not found."}
				</p>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="p-4 lg:p-6">
				<p className="font-sans text-[var(--color-danger)] text-sm">
					Failed to load program.
				</p>
				<Link
					className="mt-2 inline-block font-medium font-sans text-sm text-text-dark underline"
					href="/artisan/training"
				>
					← Back to Training
				</Link>
			</div>
		);
	}

	const enrollment = program.enrollment;
	const modulesCompleted = enrollment?.modulesCompleted ?? 0;
	const programMedia = program.media.filter((m) => !m.moduleId);
	const cardStyle = {
		background: "white",
		border: "1px solid var(--color-cream-dark)",
	} as const;

	return (
		<div className="flex flex-col gap-6 p-4 lg:p-6">
			<nav className="flex items-center gap-2 text-sm">
				<Link
					className="font-sans text-text-muted transition-colors hover:text-text-dark"
					href="/artisan/training"
				>
					Training
				</Link>
				<span className="font-sans text-text-muted/60">/</span>
				<span className="truncate font-medium font-sans text-text-dark">
					{program.name}
				</span>
			</nav>

			<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
				<div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h1 className="font-bold font-serif text-[22px] text-text-dark leading-tight">
							{program.name}
						</h1>
						<p className="mt-1 font-sans text-[13px] text-text-muted">
							{program.provider} · {program.category}
						</p>
						<p className="mt-1 font-sans text-[12px] text-text-muted/80">
							{program.durationLabel ?? ""}
						</p>
						<span
							className="mt-2 inline-block rounded-full px-2.5 py-0.5 font-bold font-sans text-[10px] uppercase tracking-wide"
							style={levelStyle[program.level] ?? levelStyle.INTERMEDIATE}
						>
							{getTrainingLevelLabel(program.level)}
						</span>
					</div>
					{!enrollment && (
						<button
							className="shrink-0 rounded-sm px-4 py-2 font-sans font-semibold text-sm transition-colors disabled:opacity-60"
							disabled={enrollMutation.isPending}
							onClick={() => enrollMutation.mutate(programId)}
							style={{ background: "var(--color-ink)", color: "white" }}
							type="button"
						>
							{enrollMutation.isPending ? "Enrolling…" : "Enroll"}
						</button>
					)}
				</div>
				{program.description && (
					<div className="px-6 pb-5">
						<p className="font-sans text-[13px] text-text-muted leading-relaxed">
							{program.description}
						</p>
					</div>
				)}
				{enrollment && (
					<div className="px-6 pb-5">
						<div className="mb-1.5 flex items-center justify-between">
							<span className="font-sans text-[11px] text-text-muted">
								{modulesCompleted} of {program.modules.length} modules completed
							</span>
							<span className="font-sans font-semibold text-[11px] text-text-dark">
								{enrollment.progress}%
							</span>
						</div>
						<div
							className="h-2 overflow-hidden rounded-full"
							style={{ background: "var(--color-paper)" }}
						>
							<div
								className="h-full rounded-full transition-all"
								style={{
									width: `${enrollment.progress}%`,
									background: "var(--color-ink)",
								}}
							/>
						</div>
					</div>
				)}
			</div>

			{programMedia.length > 0 && (
				<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
					<div className="border-cream-dark border-b px-6 py-4">
						<h2 className="font-bold font-serif text-[15px] text-text-dark">
							Program materials
						</h2>
					</div>
					<div className="flex flex-col gap-4 p-6">
						{programMedia.map((m) => (
							<MediaBlock key={m.id} media={m} />
						))}
					</div>
				</div>
			)}

			{program.modules.length > 0 && (
				<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
					<div className="border-cream-dark border-b px-6 py-4">
						<h2 className="font-bold font-serif text-[15px] text-text-dark">
							Modules
						</h2>
					</div>
					<div className="divide-y divide-[var(--color-cream-dark)]">
						{program.modules.map((module, index) => {
							const moduleMedia = program.media.filter(
								(m) => m.moduleId === module.id,
							);
							const isComplete = enrollment ? modulesCompleted > index : false;
							const isNext = enrollment && modulesCompleted === index;

							return (
								<div className="flex flex-col gap-4 px-6 py-5" key={module.id}>
									<div className="flex items-start justify-between gap-3">
										<div>
											<h3 className="font-bold font-serif text-[15px] text-text-dark">
												Module {index + 1}: {module.title}
											</h3>
											{module.description && (
												<p className="mt-1 font-sans text-[12px] text-text-muted">
													{module.description}
												</p>
											)}
										</div>
										<div className="shrink-0">
											{isComplete && (
												<span className="flex items-center gap-1.5 font-sans font-semibold text-[11px] text-text-muted">
													<svg
														fill="none"
														height="14"
														viewBox="0 0 12 12"
														width="14"
													>
														<circle
															cx="6"
															cy="6"
															r="5"
															stroke="var(--color-text-muted)"
															strokeWidth="1.2"
														/>
														<path
															d="M3.5 6l1.8 1.8 3.2-3.6"
															stroke="var(--color-text-muted)"
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="1.2"
														/>
													</svg>
													Complete
												</span>
											)}
											{isNext && enrollment && (
												<button
													className="rounded-sm px-4 py-2 font-sans font-semibold text-[12px] transition-colors disabled:opacity-60"
													disabled={updateProgressMutation.isPending}
													onClick={() =>
														updateProgressMutation.mutate({
															enrollmentId: enrollment.id,
															modulesCompleted: index + 1,
														})
													}
													style={{
														background: "var(--color-ink)",
														color: "white",
													}}
													type="button"
												>
													{updateProgressMutation.isPending
														? "Saving…"
														: "Mark complete"}
												</button>
											)}
										</div>
									</div>
									{moduleMedia.length > 0 && (
										<div className="flex flex-col gap-3">
											{moduleMedia.map((m) => (
												<MediaBlock key={m.id} media={m} />
											))}
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			)}

			<Link
				className="w-fit font-medium font-sans text-sm text-text-muted transition-colors hover:text-text-dark"
				href="/artisan/training"
			>
				← Back to Training
			</Link>
		</div>
	);
}
