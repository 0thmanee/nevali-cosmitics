"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { uploadMedia } from "~/lib/media";
import {
  TRAINING_PROGRAM_MEDIA_ACCEPT,
  TRAINING_PROGRAM_MEDIA_MIMES,
} from "~/app/api/media/schemas/media.schema";
import type { TrainingProgramMediaRow, TrainingModuleRow } from "~/app/api/training/schemas/training.schema";
import { TrainingProgramForm } from "./training-program-form";
import {
  useAdminTrainingProgram,
  useUpdateTrainingProgram,
  useDeleteTrainingModule,
  useAddTrainingProgramMedia,
  useRemoveTrainingProgramMedia,
  useAssignProgramToOrganization,
  useAdminOrganizations,
} from "../../hooks/use-admin-training";

const ALLOWED_MIMES = new Set<string>(TRAINING_PROGRAM_MEDIA_MIMES);

function mediaTypeFromMime(mime: string): "VIDEO" | "PDF" | "IMAGE" {
  if (mime.startsWith("video/")) return "VIDEO";
  if (mime === "application/pdf") return "PDF";
  return "IMAGE";
}

const cardStyle = { background: "white", border: "1px solid #d8d0c4" } as const;

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
      setMediaError("Allowed: video (mp4, webm), PDF, or images (JPEG, PNG, WebP).");
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
      <div className="p-4 lg:p-6 flex items-center justify-center py-20">
        <p className="font-sans text-sm text-[#727272]">{isLoading ? "Loading…" : "Program not found."}</p>
      </div>
    );
  }

  const { program, modules, media } = data;

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-6">
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/admin/training" className="font-sans text-[#727272] hover:text-[#000000] transition-colors">
          Training
        </Link>
        <span className="font-sans text-[#727272]/60">/</span>
        <span className="font-sans font-medium text-[#000000] truncate">{program.name}</span>
      </nav>

      <TrainingProgramForm
        program={program}
        onSubmit={(d) => updateProgramMutation.mutateAsync(d)}
        isPending={updateProgramMutation.isPending}
      />

      {/* Modules */}
      <div className="rounded-sm overflow-hidden shadow-sm" style={cardStyle}>
        <div className="px-6 py-4 border-b border-[#d8d0c4] flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif font-bold text-[15px] text-[#000000]">Modules</h2>
          <Link
            href={`/admin/training/${programId}/modules/new`}
            className="font-sans text-[12px] font-semibold rounded-sm px-4 py-2 transition-colors inline-block"
            style={{ background: "#000000", color: "white" }}
          >
            Add module
          </Link>
        </div>
        <div className="p-6">
          {modules.length === 0 ? (
            <p className="font-sans text-sm text-[#727272]">No modules yet. Add a module to define sections and attach documents.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {(modules as TrainingModuleRow[]).map((mod, i) => (
                <li
                  key={mod.id}
                  className="flex items-center justify-between gap-3 rounded-sm px-4 py-3 group"
                  style={{ background: "#ffffff", border: "1px solid #d8d0c4" }}
                >
                  <Link
                    href={`/admin/training/${programId}/modules/${mod.id}`}
                    className="flex-1 min-w-0 font-sans text-sm font-semibold text-[#000000] hover:text-[#000000] hover:underline truncate"
                  >
                    {i + 1}. {mod.title}
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deleteModuleMutation.mutate(mod.id);
                    }}
                    disabled={deleteModuleMutation.isPending}
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

      {/* Program-level documents only; module docs are uploaded from each module page */}
      <div className="rounded-sm overflow-hidden shadow-sm" style={cardStyle}>
        <div className="px-6 py-4 border-b border-[#d8d0c4]">
          <h2 className="font-serif font-bold text-[15px] text-[#000000]">Program-level documents</h2>
          <p className="font-sans text-[11px] text-[#727272] mt-0.5">
            Upload videos, PDFs, or images for the whole program. To add documents to a specific module, open that module via Add module or the module page.
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
                placeholder="e.g. Program intro"
                className="font-sans text-sm rounded-sm px-3 py-2 border border-[#d8d0c4] w-40 bg-[#ffffff]"
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
          {(() => {
            const programMedia = (media as TrainingProgramMediaRow[]).filter((m) => !m.moduleId);
            return programMedia.length === 0 ? (
              <p className="font-sans text-sm text-[#727272]">No program-level documents yet. Upload a video, PDF, or image above.</p>
            ) : (
            <ul className="flex flex-col gap-2">
              {programMedia.map((m) => (
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
            );
          })()}
        </div>
      </div>

      {/* Assign to organization */}
      <div className="rounded-sm overflow-hidden shadow-sm" style={cardStyle}>
        <div className="px-6 py-4 border-b border-[#d8d0c4]">
          <h2 className="font-serif font-bold text-[15px] text-[#000000]">Assign to partner</h2>
          <p className="font-sans text-[11px] text-[#727272] mt-0.5">Assign this program to an organization. They will see it in their Training page.</p>
        </div>
        <div className="p-6 flex flex-wrap items-center gap-3">
          <select
            value={assignOrgId}
            onChange={(e) => setAssignOrgId(e.target.value)}
            className="font-sans text-sm rounded-sm px-3 py-2 border border-[#d8d0c4] bg-[#ffffff] min-w-[200px]"
          >
            <option value="">Select organization</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              if (assignOrgId) {
                assignMutation.mutate({ organizationId: assignOrgId, programId }, { onSuccess: () => setAssignOrgId("") });
              }
            }}
            disabled={!assignOrgId || assignMutation.isPending}
            className="font-sans text-[12px] font-semibold rounded-sm px-4 py-2 disabled:opacity-60"
            style={{ background: "#000000", color: "white" }}
          >
            {assignMutation.isPending ? "Assigning…" : "Assign"}
          </button>
        </div>
      </div>

      <Link href="/admin/training" className="font-sans text-sm font-medium text-[#727272] hover:text-[#000000] transition-colors w-fit">
        ← Back to Training
      </Link>
    </div>
  );
}
