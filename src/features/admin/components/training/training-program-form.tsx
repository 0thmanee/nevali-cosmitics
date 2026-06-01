"use client";

import Link from "next/link";
import type React from "react";
import { useState } from "react";
import type {
	CreateTrainingProgramInput,
	TrainingProgramRow,
	UpdateTrainingProgramInput,
} from "~/app/api/training/schemas/training.schema";
import {
	DEFAULT_TRAINING_PROVIDER,
	getTrainingLevelLabel,
	TRAINING_LEVELS,
	TRAINING_PROGRAM_STATUSES,
} from "~/app/api/training/schemas/training.schema";

type Props = {
	program: TrainingProgramRow | null;
	onSubmit: (
		data: CreateTrainingProgramInput | UpdateTrainingProgramInput,
	) => Promise<unknown>;
	isPending: boolean;
	/** If provided, called with submit result; return URL to redirect to (e.g. after create). */
	onSuccessRedirect?: (result: unknown) => string | void;
};

export function TrainingProgramForm({
	program,
	onSubmit,
	isPending,
	onSuccessRedirect,
}: Props) {
	const [name, setName] = useState(program?.name ?? "");
	const [description, setDescription] = useState(program?.description ?? "");
	const [provider, setProvider] = useState(
		program?.provider ?? DEFAULT_TRAINING_PROVIDER,
	);
	const [category, setCategory] = useState(program?.category ?? "");
	const [durationLabel, setDurationLabel] = useState(
		program?.durationLabel ?? "",
	);
	const [level, setLevel] = useState<(typeof TRAINING_LEVELS)[number]>(
		(program?.level as (typeof TRAINING_LEVELS)[number]) ?? TRAINING_LEVELS[0],
	);
	const [status, setStatus] = useState<
		(typeof TRAINING_PROGRAM_STATUSES)[number]
	>(
		(program?.status as (typeof TRAINING_PROGRAM_STATUSES)[number]) ??
			TRAINING_PROGRAM_STATUSES[0],
	);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		if (!name.trim()) {
			setError("Name is required.");
			return;
		}
		if (!category.trim()) {
			setError("Category is required.");
			return;
		}
		try {
			const result = await onSubmit({
				name: name.trim(),
				description: description.trim() || null,
				provider: provider.trim() || undefined,
				category: category.trim(),
				durationLabel: durationLabel.trim() || null,
				level,
				status,
			});
			const redirectUrl = onSuccessRedirect?.(result);
			if (redirectUrl) window.location.href = redirectUrl;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to save.");
		}
	};

	return (
		<form
			className="overflow-hidden rounded-sm shadow-sm"
			onSubmit={handleSubmit}
			style={{
				background: "white",
				border: "1px solid var(--color-cream-dark)",
			}}
		>
			<div className="border-cream-dark border-b px-6 py-4">
				<h2 className="font-bold font-serif text-[15px] text-text-dark">
					{program ? "Edit program" : "New program"}
				</h2>
			</div>
			<div className="flex flex-col gap-4 p-6">
				{error && (
					<div
						className="rounded-sm px-4 py-3"
						style={{
							background:
								"color-mix(in srgb, var(--color-danger) 8%, transparent)",
							border:
								"1px solid color-mix(in srgb, var(--color-danger) 20%, transparent)",
						}}
					>
						<p className="font-sans text-[var(--color-danger)] text-sm">
							{error}
						</p>
					</div>
				)}
				<div>
					<label className="mb-1.5 block font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
						Name *
					</label>
					<input
						className="w-full rounded-sm border border-cream-dark bg-[var(--color-paper)] px-3.5 py-2.5 font-sans text-sm"
						maxLength={200}
						onChange={(e) => setName(e.target.value)}
						placeholder="e.g. Export Documentation Mastery"
						type="text"
						value={name}
					/>
				</div>
				<div>
					<label className="mb-1.5 block font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
						Description
					</label>
					<textarea
						className="min-h-[80px] w-full rounded-sm border border-cream-dark bg-[var(--color-paper)] px-3.5 py-2.5 font-sans text-sm"
						maxLength={2000}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Short description of the program"
						value={description}
					/>
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label className="mb-1.5 block font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
							Provider
						</label>
						<input
							className="w-full rounded-sm border border-cream-dark bg-[var(--color-paper)] px-3.5 py-2.5 font-sans text-sm"
							maxLength={100}
							onChange={(e) => setProvider(e.target.value)}
							type="text"
							value={provider}
						/>
					</div>
					<div>
						<label className="mb-1.5 block font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
							Category *
						</label>
						<input
							className="w-full rounded-sm border border-cream-dark bg-[var(--color-paper)] px-3.5 py-2.5 font-sans text-sm"
							maxLength={100}
							onChange={(e) => setCategory(e.target.value)}
							placeholder="e.g. Export & Trade"
							type="text"
							value={category}
						/>
					</div>
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label className="mb-1.5 block font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
							Duration label
						</label>
						<input
							className="w-full rounded-sm border border-cream-dark bg-[var(--color-paper)] px-3.5 py-2.5 font-sans text-sm"
							maxLength={100}
							onChange={(e) => setDurationLabel(e.target.value)}
							placeholder="e.g. 10 modules · ~6 hours"
							type="text"
							value={durationLabel}
						/>
					</div>
					<div>
						<label className="mb-1.5 block font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
							Level
						</label>
						<select
							className="w-full rounded-sm border border-cream-dark bg-[var(--color-paper)] px-3.5 py-2.5 font-sans text-sm"
							onChange={(e) =>
								setLevel(e.target.value as (typeof TRAINING_LEVELS)[number])
							}
							value={level}
						>
							{TRAINING_LEVELS.map((l) => (
								<option key={l} value={l}>
									{getTrainingLevelLabel(l)}
								</option>
							))}
						</select>
					</div>
				</div>
				<div>
					<label className="mb-1.5 block font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
						Status
					</label>
					<select
						className="w-full rounded-sm border border-cream-dark bg-[var(--color-paper)] px-3.5 py-2.5 font-sans text-sm"
						onChange={(e) =>
							setStatus(
								e.target.value as (typeof TRAINING_PROGRAM_STATUSES)[number],
							)
						}
						value={status}
					>
						{TRAINING_PROGRAM_STATUSES.map((s) => (
							<option key={s} value={s}>
								{s}
							</option>
						))}
					</select>
				</div>
				<div className="flex flex-wrap items-center gap-3 pt-2">
					<button
						className="rounded-sm px-6 py-2.5 font-sans font-semibold text-sm transition-colors disabled:opacity-60"
						disabled={isPending}
						style={{ background: "var(--color-ink)", color: "white" }}
						type="submit"
					>
						{isPending
							? "Saving…"
							: program
								? "Save changes"
								: "Create program"}
					</button>
					<Link
						className="font-medium font-sans text-sm text-text-muted transition-colors hover:text-text-dark"
						href="/admin/training"
					>
						Cancel
					</Link>
				</div>
			</div>
		</form>
	);
}
