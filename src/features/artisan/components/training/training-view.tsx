"use client";

import { BookOpen, GraduationCap, Library } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { getTrainingLevelLabel } from "~/app/api/training/schemas/training.schema";
import { useI18n } from "~/components/i18n/i18n-provider";
import { STAT_ICON_COLOR, StatCard } from "~/components/stat-card";
import {
	useEnrollInProgram,
	useTrainingPrograms,
} from "~/features/artisan/hooks/use-training";
import { getTrainingProgramDisplayStatus } from "~/features/artisan/utils/training";

const TABS = ["All", "In Progress", "Available", "Completed"] as const;
type Tab = (typeof TABS)[number];

const LEVEL_COLORS: Record<string, string> = {
	BEGINNER: "var(--color-info)",
	INTERMEDIATE: "var(--color-text-muted)",
	ADVANCED: "var(--color-primary-light)",
};

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

export function TrainingView() {
	const { t } = useI18n();
	const [activeTab, setActiveTab] = useState<Tab>("All");
	const [expanded, setExpanded] = useState<string | null>(null);

	const tabLabels: Record<Tab, string> = {
		All: t("producerProfileCert.tabAll"),
		"In Progress": t("producerProfileCert.tabInProgress"),
		Available: t("producerProfileCert.tabAvailable"),
		Completed: t("producerProfileCert.tabCompleted"),
	};

	const router = useRouter();
	const { data: programs = [], isLoading, isError } = useTrainingPrograms();
	const enrollMutation = useEnrollInProgram();

	const filtered = programs.filter((p) => {
		if (activeTab === "All") return true;
		const status = getTrainingProgramDisplayStatus(p);
		if (activeTab === "In Progress") return status === "IN_PROGRESS";
		if (activeTab === "Available") return status === "AVAILABLE";
		return status === "COMPLETED";
	});

	const counts = {
		All: programs.length,
		"In Progress": programs.filter(
			(p) => getTrainingProgramDisplayStatus(p) === "IN_PROGRESS",
		).length,
		Available: programs.filter(
			(p) => getTrainingProgramDisplayStatus(p) === "AVAILABLE",
		).length,
		Completed: programs.filter(
			(p) => getTrainingProgramDisplayStatus(p) === "COMPLETED",
		).length,
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-20">
				<p className="font-sans text-sm text-text-muted">
					{t("producerProfileCert.loadingPrograms")}
				</p>
			</div>
		);
	}

	if (isError) {
		return (
			<div>
				<p className="font-sans text-[var(--color-danger)] text-sm">
					{t("producerProfileCert.failedLoadPrograms")}
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="grid grid-cols-3 gap-3">
				<StatCard
					icon={<BookOpen color={STAT_ICON_COLOR.amber} size={20} />}
					label={t("producerProfileCert.tabInProgress")}
					value={counts["In Progress"]}
					variant="amber"
				/>
				<StatCard
					icon={<Library color={STAT_ICON_COLOR.neutral} size={20} />}
					label={t("producerProfileCert.tabAvailable")}
					value={counts["Available"]}
					variant="neutral"
				/>
				<StatCard
					icon={<GraduationCap color={STAT_ICON_COLOR.green} size={20} />}
					label={t("producerProfileCert.tabCompleted")}
					value={counts["Completed"]}
					variant="green"
				/>
			</div>
			<div className="flex items-center gap-1">
				{TABS.map((tab) => (
					<button
						className="rounded-sm px-4 py-1.5 font-sans font-semibold text-[12px] transition-colors"
						key={tab}
						onClick={() => {
							setActiveTab(tab);
							setExpanded(null);
						}}
						style={
							activeTab === tab
								? { background: "var(--color-ink)", color: "white" }
								: {
										background: "white",
										color: "var(--color-text-muted)",
										border: "1px solid var(--color-cream-dark)",
									}
						}
						type="button"
					>
						{tabLabels[tab]}
						<span
							className="ml-1.5 rounded-full px-1.5 py-0.5 font-bold text-[10px]"
							style={
								activeTab === tab
									? {
											background:
												"color-mix(in srgb, var(--color-paper) 15%, transparent)",
											color:
												"color-mix(in srgb, var(--color-paper) 80%, transparent)",
										}
									: {
											background:
												"color-mix(in srgb, var(--color-ink) 8%, transparent)",
											color: "var(--color-text-muted)",
										}
							}
						>
							{counts[tab]}
						</span>
					</button>
				))}
			</div>
			<div className="flex flex-col gap-3">
				{filtered.length === 0 ? (
					<div
						className="rounded-sm px-5 py-8 text-center"
						style={{
							background: "white",
							border: "1px solid var(--color-cream-dark)",
						}}
					>
						<p className="font-sans text-sm text-text-muted">
							{programs.length === 0
								? t("producerProfileCert.noProgramsYet")
								: t("producerProfileCert.noProgramsInTab")}
						</p>
					</div>
				) : (
					filtered.map((program) => {
						const status = getTrainingProgramDisplayStatus(program);
						const color =
							LEVEL_COLORS[program.level] ?? "var(--color-text-muted)";
						const isExpanded = expanded === program.id;
						const modulesCompleted = program.enrollment?.modulesCompleted ?? 0;
						const totalModules = program.modulesCount;
						const progress = program.enrollment?.progress ?? 0;

						return (
							<div
								className="overflow-hidden rounded-sm transition-all"
								key={program.id}
								style={{
									background: "white",
									border: "1px solid var(--color-cream-dark)",
								}}
							>
								<div className="flex items-start gap-4 px-5 py-4">
									<div
										className="w-1 shrink-0 self-stretch rounded-full"
										style={{ background: color, minHeight: 40 }}
									/>
									<div className="min-w-0 flex-1">
										<div className="flex items-start justify-between gap-3">
											<div className="min-w-0">
												<div className="mb-1 flex flex-wrap items-center gap-2">
													<h3 className="font-bold font-serif text-[15px] text-text-dark leading-tight">
														{program.name}
													</h3>
													<span
														className="shrink-0 rounded-full px-2.5 py-0.5 font-bold font-sans text-[10px] uppercase tracking-wide"
														style={
															levelStyle[program.level] ??
															levelStyle.INTERMEDIATE
														}
													>
														{getTrainingLevelLabel(program.level)}
													</span>
												</div>
												<p className="font-sans text-[12px] text-text-muted">
													{program.provider} · {program.category}
													{program.durationLabel
														? ` · ${program.durationLabel}`
														: ""}
												</p>
											</div>
											<div className="flex shrink-0 items-center gap-2">
												{status === "IN_PROGRESS" && (
													<Link
														className="inline-block rounded-sm px-4 py-2 font-sans font-semibold text-[12px] transition-colors"
														href={`/artisan/training/${program.id}`}
														style={{
															background: "var(--color-ink)",
															color: "white",
														}}
													>
														{t("producerProfileCert.continue")} →
													</Link>
												)}
												{status === "AVAILABLE" && (
													<button
														className="rounded-sm px-4 py-2 font-sans font-semibold text-[12px] transition-colors disabled:opacity-60"
														disabled={enrollMutation.isPending}
														onClick={() =>
															enrollMutation.mutate(program.id, {
																onSuccess: () =>
																	router.push(
																		`/artisan/training/${program.id}`,
																	),
															})
														}
														style={{
															background: "var(--color-paper)",
															color: "var(--color-ink)",
															border: "1px solid var(--color-cream-dark)",
														}}
														type="button"
													>
														{enrollMutation.isPending
															? t("producerProfileCert.starting")
															: t("producerProfileCert.start")}
													</button>
												)}
												{status === "COMPLETED" && (
													<span
														className="inline-block rounded-sm px-4 py-2 font-sans font-semibold text-[12px]"
														style={{
															background:
																"color-mix(in srgb, var(--color-gold) 10%, transparent)",
															color: "var(--color-text-muted)",
															border:
																"1px solid color-mix(in srgb, var(--color-gold) 20%, transparent)",
														}}
													>
														{t("producerProfileCert.completed")}
													</span>
												)}
												<button
													className="flex h-8 w-8 items-center justify-center rounded-sm transition-colors"
													onClick={() =>
														setExpanded(isExpanded ? null : program.id)
													}
													style={{
														background: "var(--color-paper)",
														border: "1px solid var(--color-cream-dark)",
													}}
													type="button"
												>
													<svg
														fill="none"
														height="12"
														style={{
															transform: isExpanded ? "rotate(180deg)" : "none",
															transition: "transform 0.2s",
														}}
														viewBox="0 0 12 12"
														width="12"
													>
														<path
															d="M2 4l4 4 4-4"
															stroke="var(--color-text-muted)"
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="1.4"
														/>
													</svg>
												</button>
											</div>
										</div>
										{status === "IN_PROGRESS" && (
											<div className="mt-3">
												<div className="mb-1.5 flex items-center justify-between">
													<span className="font-sans text-[11px] text-text-muted">
														{t("producerProfileCert.modulesCompleted", {
															completed: modulesCompleted,
															total: totalModules,
														})}
													</span>
													<span
														className="font-sans font-semibold text-[11px]"
														style={{ color }}
													>
														{progress}%
													</span>
												</div>
												<div
													className="h-1.5 overflow-hidden rounded-full"
													style={{ background: "var(--color-paper)" }}
												>
													<div
														className="h-full rounded-full transition-all"
														style={{ width: `${progress}%`, background: color }}
													/>
												</div>
												<p className="mt-1.5 font-sans text-[11px] text-text-muted">
													{t("producerProfileCert.upNext")}{" "}
													<Link
														className="font-semibold text-text-dark hover:underline"
														href={`/artisan/training/${program.id}`}
													>
														{t("producerProfileCert.openProgram")}
													</Link>
												</p>
											</div>
										)}
										{status === "COMPLETED" && (
											<div className="mt-2 flex items-center gap-1.5">
												<svg
													fill="none"
													height="12"
													viewBox="0 0 12 12"
													width="12"
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
												<span className="font-sans font-semibold text-[11px] text-text-muted">
													{t("producerProfileCert.completedAllModules", {
														total: totalModules,
													})}
												</span>
											</div>
										)}
									</div>
								</div>
								{isExpanded && (
									<div
										className="border-t px-5 pb-5"
										style={{ borderColor: "var(--color-cream-dark)" }}
									>
										<div className="flex flex-col gap-3 pt-4">
											{program.description && (
												<p className="font-sans text-[13px] text-text-muted leading-relaxed">
													{program.description}
												</p>
											)}
											<div className="flex flex-wrap gap-2">
												{[
													{
														label: t("producerProfileCert.detailCategory"),
														value: program.category,
													},
													{
														label: t("producerProfileCert.detailDuration"),
														value: program.durationLabel ?? "—",
													},
													{
														label: t("producerProfileCert.detailLevel"),
														value: getTrainingLevelLabel(program.level),
													},
													{
														label: t("producerProfileCert.detailProvider"),
														value: program.provider,
													},
												].map((d) => (
													<div
														className="rounded-sm px-3 py-2"
														key={d.label}
														style={{
															background: "var(--color-paper)",
															border: "1px solid var(--color-cream-dark)",
														}}
													>
														<p className="font-bold font-sans text-[9px] text-text-muted uppercase tracking-wider">
															{d.label}
														</p>
														<p className="mt-0.5 font-sans font-semibold text-[12px] text-text-dark">
															{d.value}
														</p>
													</div>
												))}
											</div>
											{status === "AVAILABLE" && (
												<button
													className="w-fit rounded-sm px-4 py-2 font-sans font-semibold text-[12px] transition-colors disabled:opacity-60"
													disabled={enrollMutation.isPending}
													onClick={() =>
														enrollMutation.mutate(program.id, {
															onSuccess: () =>
																router.push(`/artisan/training/${program.id}`),
														})
													}
													style={{
														background: "var(--color-ink)",
														color: "white",
													}}
													type="button"
												>
													{enrollMutation.isPending
														? t("producerProfileCert.starting")
														: t("producerProfileCert.enrollAndStart")}
												</button>
											)}
										</div>
									</div>
								)}
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}
