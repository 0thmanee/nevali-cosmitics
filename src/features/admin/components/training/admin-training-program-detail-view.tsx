"use client";

import Link from "next/link";
import type React from "react";
import { useRef, useState } from "react";
import {
	TRAINING_PROGRAM_MEDIA_ACCEPT,
	TRAINING_PROGRAM_MEDIA_MIMES,
} from "~/app/api/media/schemas/media.schema";
import type {
	TrainingModuleRow,
	TrainingProgramMediaRow,
} from "~/app/api/training/schemas/training.schema";
import { uploadMedia } from "~/lib/media";
import {
	useAddTrainingProgramMedia,
	useAdminOrganizations,
	useAdminTrainingProgram,
	useAssignProgramToOrganization,
	useDeleteTrainingModule,
	useRemoveTrainingProgramMedia,
	useUpdateTrainingProgram,
} from "../../hooks/use-admin-training";
import { TrainingProgramForm } from "./training-program-form";

const ALLOWED_MIMES = new Set<string>(TRAINING_PROGRAM_MEDIA_MIMES);

function mediaTypeFromMime(mime: string): "VIDEO" | "PDF" | "IMAGE" {
	if (mime.startsWith("video/")) return "VIDEO";
	if (mime === "application/pdf") return "PDF";
	return "IMAGE";
}

const cardStyle = {
	background: "white",
	border: "1px solid var(--color-cream-dark)",
} as const;

type Props = { programId: string };

export function AdminTrainingProgramDetailView({ programId }: Props) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [mediaTitle, setMediaTitle] = useState("");
	const [assignOrgId, setAssignOrgId] = useState("");
	const [mediaError, setMediaError] = useState<string | null>(null);

	const { data, isLoading, isError } = useAdminTrainingProgram(programId);
	const updateProgramMutation = useUpdateTrainingProgram(programId);
	const deleteModuleMutation = useDeleteTrainingModule(programId);
	const addMediaMutation = useAddTrainingProgramMedia(programId);
	const removeMediaMutation = useRemoveTrainingProgramMedia(programId);
	const assignMutation = useAssignProgramToOrganization(programId);
	const { data: organizations = [] } = useAdminOrganizations();

	const handleMediaFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		e.target.value = "";
		setMediaError(null);
		if (!file) return;
		if (!ALLOWED_MIMES.has(file.type)) {
			setMediaError(
				"Allowed: video (mp4, webm), PDF, or images (JPEG, PNG, WebP).",
			);
			return;
		}
		try {
			const { url } = await uploadMedia(file, "trainingProgramMedia");
			await addMediaMutation.mutateAsync({
				programId,
				moduleId: null,
				fileUrl: url,
				mediaType: mediaTypeFromMime(file.type),
				title: mediaTitle.trim() || null,
			});
			setMediaTitle("");
		} catch (err) {
			setMediaError(err instanceof Error ? err.message : "Upload failed.");
		}
	};

	if (isLoading || !data) {
		return (
			<div className="flex items-center justify-center p-4 py-20 lg:p-6">
				<p className="font-sans text-sm text-text-muted">
					{isLoading ? "Loading…" : "Program not found."}
				</p>
			</div>
		);
	}

	const { program, modules, media } = data;

	return (
		<div className="flex flex-col gap-6 p-4 lg:p-6">
			<nav className="flex items-center gap-2 text-sm">
				<Link
					className="font-sans text-text-muted transition-colors hover:text-text-dark"
					href="/admin/training"
				>
					Training
				</Link>
				<span className="font-sans text-text-muted/60">/</span>
				<span className="truncate font-medium font-sans text-text-dark">
					{program.name}
				</span>
			</nav>

			<TrainingProgramForm
				isPending={updateProgramMutation.isPending}
				onSubmit={(d) => updateProgramMutation.mutateAsync(d)}
				program={program}
			/>

			{/* Modules */}
			<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
				<div className="flex flex-wrap items-center justify-between gap-3 border-cream-dark border-b px-6 py-4">
					<h2 className="font-bold font-serif text-[15px] text-text-dark">
						Modules
					</h2>
					<Link
						className="inline-block rounded-sm px-4 py-2 font-sans font-semibold text-[12px] transition-colors"
						href={`/admin/training/${programId}/modules/new`}
						style={{ background: "var(--color-ink)", color: "white" }}
					>
						Add module
					</Link>
				</div>
				<div className="p-6">
					{modules.length === 0 ? (
						<p className="font-sans text-sm text-text-muted">
							No modules yet. Add a module to define sections and attach
							documents.
						</p>
					) : (
						<ul className="flex flex-col gap-2">
							{(modules as TrainingModuleRow[]).map((mod, i) => (
								<li
									className="group flex items-center justify-between gap-3 rounded-sm px-4 py-3"
									key={mod.id}
									style={{
										background: "var(--color-paper)",
										border: "1px solid var(--color-cream-dark)",
									}}
								>
									<Link
										className="min-w-0 flex-1 truncate font-sans font-semibold text-sm text-text-dark hover:text-text-dark hover:underline"
										href={`/admin/training/${programId}/modules/${mod.id}`}
									>
										{i + 1}. {mod.title}
									</Link>
									<button
										className="shrink-0 font-medium font-sans text-[12px] text-[var(--color-danger)] hover:underline disabled:opacity-60"
										disabled={deleteModuleMutation.isPending}
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											deleteModuleMutation.mutate(mod.id);
										}}
										type="button"
									>
										Remove
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>

			{/* Program-level documents only; module docs are uploaded from each module page */}
			<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
				<div className="border-cream-dark border-b px-6 py-4">
					<h2 className="font-bold font-serif text-[15px] text-text-dark">
						Program-level documents
					</h2>
					<p className="mt-0.5 font-sans text-[11px] text-text-muted">
						Upload videos, PDFs, or images for the whole program. To add
						documents to a specific module, open that module via Add module or
						the module page.
					</p>
				</div>
				<div className="flex flex-col gap-4 p-6">
					<input
						accept={TRAINING_PROGRAM_MEDIA_ACCEPT}
						className="hidden"
						onChange={handleMediaFile}
						ref={fileInputRef}
						type="file"
					/>
					<div className="flex flex-wrap items-end gap-3">
						<div>
							<label className="mb-1.5 block font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
								Title (optional)
							</label>
							<input
								className="w-40 rounded-sm border border-cream-dark bg-[var(--color-paper)] px-3 py-2 font-sans text-sm"
								onChange={(e) => setMediaTitle(e.target.value)}
								placeholder="e.g. Program intro"
								type="text"
								value={mediaTitle}
							/>
						</div>
						<button
							className="rounded-sm px-4 py-2 font-sans font-semibold text-[12px] disabled:opacity-60"
							disabled={addMediaMutation.isPending}
							onClick={() => fileInputRef.current?.click()}
							style={{ background: "var(--color-ink)", color: "white" }}
							type="button"
						>
							{addMediaMutation.isPending ? "Uploading…" : "Upload file"}
						</button>
					</div>
					{mediaError && (
						<p className="font-sans text-[var(--color-danger)] text-sm">
							{mediaError}
						</p>
					)}
					{(() => {
						const programMedia = (media as TrainingProgramMediaRow[]).filter(
							(m) => !m.moduleId,
						);
						return programMedia.length === 0 ? (
							<p className="font-sans text-sm text-text-muted">
								No program-level documents yet. Upload a video, PDF, or image
								above.
							</p>
						) : (
							<ul className="flex flex-col gap-2">
								{programMedia.map((m) => (
									<li
										className="flex items-center justify-between gap-3 rounded-sm px-4 py-3"
										key={m.id}
										style={{
											background: "var(--color-paper)",
											border: "1px solid var(--color-cream-dark)",
										}}
									>
										<div className="min-w-0">
											<span className="font-bold font-sans text-[10px] text-text-muted uppercase tracking-wide">
												{m.mediaType}
											</span>
											{m.title && (
												<span className="ml-2 font-sans text-sm text-text-dark">
													{m.title}
												</span>
											)}
											<a
												className="mt-0.5 block truncate font-sans text-[12px] text-text-dark hover:underline"
												href={m.fileUrl}
												rel="noopener noreferrer"
												target="_blank"
											>
												{m.fileUrl}
											</a>
										</div>
										<button
											className="shrink-0 font-medium font-sans text-[12px] text-[var(--color-danger)] hover:underline disabled:opacity-60"
											disabled={removeMediaMutation.isPending}
											onClick={() => removeMediaMutation.mutate(m.id)}
											type="button"
										>
											Remove
										</button>
									</li>
								))}
							</ul>
						);
					})()}
				</div>
			</div>

			{/* Assign to organization */}
			<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
				<div className="border-cream-dark border-b px-6 py-4">
					<h2 className="font-bold font-serif text-[15px] text-text-dark">
						Assign to partner
					</h2>
					<p className="mt-0.5 font-sans text-[11px] text-text-muted">
						Assign this program to an organization. They will see it in their
						Training page.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-3 p-6">
					<select
						className="min-w-[200px] rounded-sm border border-cream-dark bg-[var(--color-paper)] px-3 py-2 font-sans text-sm"
						onChange={(e) => setAssignOrgId(e.target.value)}
						value={assignOrgId}
					>
						<option value="">Select organization</option>
						{organizations.map((org) => (
							<option key={org.id} value={org.id}>
								{org.name}
							</option>
						))}
					</select>
					<button
						className="rounded-sm px-4 py-2 font-sans font-semibold text-[12px] disabled:opacity-60"
						disabled={!assignOrgId || assignMutation.isPending}
						onClick={() => {
							if (assignOrgId) {
								assignMutation.mutate(
									{ organizationId: assignOrgId, programId },
									{ onSuccess: () => setAssignOrgId("") },
								);
							}
						}}
						style={{ background: "var(--color-ink)", color: "white" }}
						type="button"
					>
						{assignMutation.isPending ? "Assigning…" : "Assign"}
					</button>
				</div>
			</div>

			<Link
				className="w-fit font-medium font-sans text-sm text-text-muted transition-colors hover:text-text-dark"
				href="/admin/training"
			>
				← Back to Training
			</Link>
		</div>
	);
}
