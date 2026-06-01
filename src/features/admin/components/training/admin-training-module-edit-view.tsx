"use client";

import Link from "next/link";
import type React from "react";
import { useEffect, useRef, useState } from "react";
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
	useAdminTrainingProgram,
	useRemoveTrainingProgramMedia,
	useUpdateTrainingModule,
} from "../../hooks/use-admin-training";

const ALLOWED_MIMES = new Set<string>(TRAINING_PROGRAM_MEDIA_MIMES);
const cardStyle = {
	background: "white",
	border: "1px solid var(--color-cream-dark)",
} as const;

function mediaTypeFromMime(mime: string): "VIDEO" | "PDF" | "IMAGE" {
	if (mime.startsWith("video/")) return "VIDEO";
	if (mime === "application/pdf") return "PDF";
	return "IMAGE";
}

type Props = { programId: string; moduleId: string };

export function AdminTrainingModuleEditView({ programId, moduleId }: Props) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [mediaTitle, setMediaTitle] = useState("");
	const [formError, setFormError] = useState<string | null>(null);
	const [mediaError, setMediaError] = useState<string | null>(null);

	const { data: programData, isLoading: programLoading } =
		useAdminTrainingProgram(programId);
	const updateModuleMutation = useUpdateTrainingModule(programId);
	const addMediaMutation = useAddTrainingProgramMedia(programId);
	const removeMediaMutation = useRemoveTrainingProgramMedia(programId);

	const program = programData?.program;
	const module = programData?.modules?.find((m) => m.id === moduleId) as
		| TrainingModuleRow
		| undefined;
	const moduleMedia: TrainingProgramMediaRow[] = module
		? (programData?.media ?? []).filter((m) => m.moduleId === moduleId)
		: [];

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [sortOrder, setSortOrder] = useState("");

	useEffect(() => {
		if (!module) return;
		setTitle(module.title);
		setDescription(module.description ?? "");
		setSortOrder(module.sortOrder != null ? String(module.sortOrder) : "");
	}, [module?.id, module?.title, module?.description, module?.sortOrder]);

	const handleSaveModule = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormError(null);
		if (!title.trim()) {
			setFormError("Title is required.");
			return;
		}
		try {
			const sortOrderNum =
				sortOrder === "" ? undefined : parseInt(sortOrder, 10);
			await updateModuleMutation.mutateAsync({
				moduleId,
				data: {
					title: title.trim(),
					description: description.trim() || null,
					...(sortOrderNum !== undefined &&
						!Number.isNaN(sortOrderNum) && { sortOrder: sortOrderNum }),
				},
			});
		} catch (err) {
			setFormError(
				err instanceof Error ? err.message : "Failed to save module.",
			);
		}
	};

	const handleMediaFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		e.target.value = "";
		setMediaError(null);
		if (!file || !module) return;
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
				moduleId: module.id,
				fileUrl: url,
				mediaType: mediaTypeFromMime(file.type),
				title: mediaTitle.trim() || null,
			});
			setMediaTitle("");
		} catch (err) {
			setMediaError(err instanceof Error ? err.message : "Upload failed.");
		}
	};

	if (programLoading || !program) {
		return (
			<div className="flex items-center justify-center p-4 py-20 lg:p-6">
				<p className="font-sans text-sm text-text-muted">
					{programLoading ? "Loading…" : "Program not found."}
				</p>
			</div>
		);
	}

	if (!module) {
		return (
			<div className="flex flex-col gap-4 p-4 lg:p-6">
				<p className="font-sans text-[var(--color-danger)] text-sm">
					Module not found.
				</p>
				<Link
					className="w-fit font-medium font-sans text-sm text-text-dark underline"
					href={`/admin/training/${programId}`}
				>
					← Back to program
				</Link>
			</div>
		);
	}

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
				<Link
					className="truncate font-sans text-text-muted transition-colors hover:text-text-dark"
					href={`/admin/training/${programId}`}
				>
					{program.name}
				</Link>
				<span className="font-sans text-text-muted/60">/</span>
				<span className="truncate font-medium font-sans text-text-dark">
					{module.title}
				</span>
			</nav>

			{/* Module form */}
			<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
				<div className="border-cream-dark border-b px-6 py-4">
					<h2 className="font-bold font-serif text-[15px] text-text-dark">
						Edit module
					</h2>
					<p className="mt-0.5 font-sans text-[11px] text-text-muted">
						Update title, description, and order. Add or remove documents below.
					</p>
				</div>
				<form className="flex flex-col gap-4 p-6" onSubmit={handleSaveModule}>
					{formError && (
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
								{formError}
							</p>
						</div>
					)}
					<div>
						<label className="mb-1.5 block font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
							Title *
						</label>
						<input
							className="w-full rounded-sm border border-cream-dark bg-[var(--color-paper)] px-3.5 py-2.5 font-sans text-sm"
							maxLength={200}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="e.g. Introduction to export documentation"
							type="text"
							value={title}
						/>
					</div>
					<div>
						<label className="mb-1.5 block font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
							Description
						</label>
						<textarea
							className="min-h-[100px] w-full rounded-sm border border-cream-dark bg-[var(--color-paper)] px-3.5 py-2.5 font-sans text-sm"
							maxLength={2000}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="What this module covers"
							value={description}
						/>
					</div>
					<div>
						<label className="mb-1.5 block font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
							Sort order
						</label>
						<input
							className="w-full max-w-[120px] rounded-sm border border-cream-dark bg-[var(--color-paper)] px-3.5 py-2.5 font-sans text-sm"
							min={0}
							onChange={(e) => setSortOrder(e.target.value)}
							placeholder="0"
							type="number"
							value={sortOrder}
						/>
					</div>
					<div className="flex flex-wrap items-center gap-3 pt-2">
						<button
							className="rounded-sm px-6 py-2.5 font-sans font-semibold text-sm transition-colors disabled:opacity-60"
							disabled={updateModuleMutation.isPending}
							style={{ background: "var(--color-ink)", color: "white" }}
							type="submit"
						>
							{updateModuleMutation.isPending ? "Saving…" : "Save module"}
						</button>
						<Link
							className="font-medium font-sans text-sm text-text-muted transition-colors hover:text-text-dark"
							href={`/admin/training/${programId}`}
						>
							Cancel
						</Link>
					</div>
				</form>
			</div>

			{/* Documents for this module */}
			<div className="overflow-hidden rounded-sm shadow-sm" style={cardStyle}>
				<div className="border-cream-dark border-b px-6 py-4">
					<h2 className="font-bold font-serif text-[15px] text-text-dark">
						Documents & media
					</h2>
					<p className="mt-0.5 font-sans text-[11px] text-text-muted">
						Add videos, PDFs, or images to this module. Partners will see them
						when they take the module.
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
								className="w-48 rounded-sm border border-cream-dark bg-[var(--color-paper)] px-3 py-2 font-sans text-sm"
								onChange={(e) => setMediaTitle(e.target.value)}
								placeholder="e.g. Intro video"
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
					{moduleMedia.length === 0 ? (
						<p className="font-sans text-sm text-text-muted">
							No documents yet. Upload a video, PDF, or image above.
						</p>
					) : (
						<ul className="flex flex-col gap-2">
							{moduleMedia.map((m) => (
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
					)}
				</div>
			</div>

			<Link
				className="inline-block w-fit rounded-sm px-4 py-2 font-sans font-semibold text-sm transition-colors"
				href={`/admin/training/${programId}`}
				style={{ background: "var(--color-ink)", color: "white" }}
			>
				← Back to program
			</Link>
		</div>
	);
}
