"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { uploadMedia } from "~/lib/media";
import {
  TRAINING_PROGRAM_MEDIA_ACCEPT,
  TRAINING_PROGRAM_MEDIA_MIMES,
} from "~/app/api/media/schemas/media.schema";
import type { TrainingProgramMediaRow, TrainingModuleRow } from "~/app/api/training/schemas/training.schema";
import {
  useAdminTrainingProgram,
  useCreateTrainingModule,
  useAddTrainingProgramMedia,
  useRemoveTrainingProgramMedia,
} from "../../hooks/use-admin-training";

const ALLOWED_MIMES = new Set<string>(TRAINING_PROGRAM_MEDIA_MIMES);
const cardStyle = { background: "white", border: "1px solid #d8d0c4" } as const;

function mediaTypeFromMime(mime: string): "VIDEO" | "PDF" | "IMAGE" {
  if (mime.startsWith("video/")) return "VIDEO";
  if (mime === "application/pdf") return "PDF";
  return "IMAGE";
}

type Props = { programId: string };

export function AdminTrainingModuleNewView({ programId }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [createdModule, setCreatedModule] = useState<TrainingModuleRow | null>(null);
  const [mediaTitle, setMediaTitle] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const { data: programData, isLoading: programLoading } = useAdminTrainingProgram(programId);
  const createModuleMutation = useCreateTrainingModule();
  const addMediaMutation = useAddTrainingProgramMedia(programId);
  const removeMediaMutation = useRemoveTrainingProgramMedia(programId);

  const program = programData?.program;
  const moduleMedia: TrainingProgramMediaRow[] = createdModule
    ? (programData?.media ?? []).filter((m) => m.moduleId === createdModule.id)
    : [];

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!title.trim()) {
      setFormError("Title is required.");
      return;
    }
    try {
      const result = await createModuleMutation.mutateAsync({
        programId,
        title: title.trim(),
        description: description.trim() || null,
        sortOrder: sortOrder === "" ? undefined : parseInt(sortOrder, 10),
      });
      setCreatedModule(result as TrainingModuleRow);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create module.");
    }
  };

  const handleMediaFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    setMediaError(null);
    if (!file || !createdModule) return;
    if (!ALLOWED_MIMES.has(file.type)) {
      setMediaError("Allowed: video (mp4, webm), PDF, or images (JPEG, PNG, WebP).");
      return;
    }
    try {
      const { url } = await uploadMedia(file, "trainingProgramMedia");
      await addMediaMutation.mutateAsync({
        programId,
        moduleId: createdModule.id,
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
      <div className="p-4 lg:p-6 flex items-center justify-center py-20">
        <p className="font-sans text-sm text-[#727272]">{programLoading ? "Loading…" : "Program not found."}</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-6">
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/admin/training" className="font-sans text-[#727272] hover:text-[#000000] transition-colors">
          Training
        </Link>
        <span className="font-sans text-[#727272]/60">/</span>
        <Link href={`/admin/training/${programId}`} className="font-sans text-[#727272] hover:text-[#000000] transition-colors truncate">
          {program.name}
        </Link>
        <span className="font-sans text-[#727272]/60">/</span>
        <span className="font-sans font-medium text-[#000000]">New module</span>
      </nav>

      {/* Module form — show until module is created */}
      {!createdModule ? (
        <div className="rounded-sm overflow-hidden shadow-sm" style={cardStyle}>
          <div className="px-6 py-4 border-b border-[#d8d0c4]">
            <h2 className="font-serif font-bold text-[15px] text-[#000000]">New module</h2>
            <p className="font-sans text-[11px] text-[#727272] mt-0.5">
              Add a module to this program. You can add documents (video, PDF, images) after creating it.
            </p>
          </div>
          <form onSubmit={handleCreateModule} className="p-6 flex flex-col gap-4">
            {formError && (
              <div className="rounded-sm px-4 py-3" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
                <p className="font-sans text-sm text-[#f87171]">{formError}</p>
              </div>
            )}
            <div>
              <label className="font-sans text-[10px] font-bold tracking-[0.12em] text-[#727272] uppercase block mb-1.5">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Introduction to export documentation"
                className="font-sans text-sm w-full rounded-sm px-3.5 py-2.5 border border-[#d8d0c4] bg-[#ffffff]"
                maxLength={200}
              />
            </div>
            <div>
              <label className="font-sans text-[10px] font-bold tracking-[0.12em] text-[#727272] uppercase block mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What this module covers"
                className="font-sans text-sm w-full rounded-sm px-3.5 py-2.5 border border-[#d8d0c4] bg-[#ffffff] min-h-[100px]"
                maxLength={2000}
              />
            </div>
            <div>
              <label className="font-sans text-[10px] font-bold tracking-[0.12em] text-[#727272] uppercase block mb-1.5">Sort order</label>
              <input
                type="number"
                min={0}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                placeholder="0"
                className="font-sans text-sm w-full rounded-sm px-3.5 py-2.5 border border-[#d8d0c4] bg-[#ffffff] max-w-[120px]"
              />
              <p className="font-sans text-[11px] text-[#727272] mt-1">Leave empty to add at the end.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={createModuleMutation.isPending}
                className="font-sans text-sm font-semibold rounded-sm px-6 py-2.5 transition-colors disabled:opacity-60"
                style={{ background: "#000000", color: "white" }}
              >
                {createModuleMutation.isPending ? "Creating…" : "Create module"}
              </button>
              <Link href={`/admin/training/${programId}`} className="font-sans text-sm font-medium text-[#727272] hover:text-[#000000] transition-colors">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* Module created — show summary + documents */}
          <div className="rounded-sm overflow-hidden shadow-sm" style={cardStyle}>
            <div className="px-6 py-4 border-b border-[#d8d0c4] flex items-center justify-between gap-3">
              <div>
                <h2 className="font-serif font-bold text-[15px] text-[#000000]">{createdModule.title}</h2>
                {createdModule.description && (
                  <p className="font-sans text-[12px] text-[#727272] mt-1">{createdModule.description}</p>
                )}
              </div>
              <span className="font-sans text-[11px] font-semibold text-[#727272]">Module created</span>
            </div>
          </div>

          {/* Documents for this module */}
          <div className="rounded-sm overflow-hidden shadow-sm" style={cardStyle}>
            <div className="px-6 py-4 border-b border-[#d8d0c4]">
              <h2 className="font-serif font-bold text-[15px] text-[#000000]">Documents & media</h2>
              <p className="font-sans text-[11px] text-[#727272] mt-0.5">
                Add videos, PDFs, or images to this module. Partners will see them when they take the module.
              </p>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept={TRAINING_PROGRAM_MEDIA_ACCEPT}
                onChange={handleMediaFile}
                className="hidden"
              />
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="font-sans text-[10px] font-bold tracking-[0.12em] text-[#727272] uppercase block mb-1.5">Title (optional)</label>
                  <input
                    type="text"
                    value={mediaTitle}
                    onChange={(e) => setMediaTitle(e.target.value)}
                    placeholder="e.g. Intro video"
                    className="font-sans text-sm rounded-sm px-3 py-2 border border-[#d8d0c4] w-48 bg-[#ffffff]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={addMediaMutation.isPending}
                  className="font-sans text-[12px] font-semibold rounded-sm px-4 py-2 disabled:opacity-60"
                  style={{ background: "#000000", color: "white" }}
                >
                  {addMediaMutation.isPending ? "Uploading…" : "Upload file"}
                </button>
              </div>
              {mediaError && <p className="font-sans text-sm text-[#f87171]">{mediaError}</p>}
              {moduleMedia.length === 0 ? (
                <p className="font-sans text-sm text-[#727272]">No documents yet. Upload a video, PDF, or image above.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {moduleMedia.map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-3 rounded-sm px-4 py-3" style={{ background: "#ffffff", border: "1px solid #d8d0c4" }}>
                      <div className="min-w-0">
                        <span className="font-sans text-[10px] font-bold tracking-wide text-[#727272] uppercase">{m.mediaType}</span>
                        {m.title && <span className="font-sans text-sm text-[#000000] ml-2">{m.title}</span>}
                        <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" className="block font-sans text-[12px] text-[#000000] hover:underline truncate mt-0.5">{m.fileUrl}</a>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMediaMutation.mutate(m.id)}
                        disabled={removeMediaMutation.isPending}
                        className="font-sans text-[12px] font-medium text-[#f87171] hover:underline disabled:opacity-60 shrink-0"
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
            href={`/admin/training/${programId}`}
            className="font-sans text-sm font-semibold rounded-sm px-4 py-2 w-fit transition-colors inline-block"
            style={{ background: "#000000", color: "white" }}
          >
            ← Back to program
          </Link>
        </>
      )}
    </div>
  );
}
