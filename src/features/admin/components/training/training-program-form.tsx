"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TRAINING_LEVELS,
  TRAINING_PROGRAM_STATUSES,
  DEFAULT_TRAINING_PROVIDER,
  getTrainingLevelLabel,
} from "~/app/api/training/schemas/training.schema";
import type {
  TrainingProgramRow,
  CreateTrainingProgramInput,
  UpdateTrainingProgramInput,
} from "~/app/api/training/schemas/training.schema";

type Props = {
  program: TrainingProgramRow | null;
  onSubmit: (data: CreateTrainingProgramInput | UpdateTrainingProgramInput) => Promise<unknown>;
  isPending: boolean;
  /** If provided, called with submit result; return URL to redirect to (e.g. after create). */
  onSuccessRedirect?: (result: unknown) => string | void;
};

export function TrainingProgramForm({ program, onSubmit, isPending, onSuccessRedirect }: Props) {
  const [name, setName] = useState(program?.name ?? "");
  const [description, setDescription] = useState(program?.description ?? "");
  const [provider, setProvider] = useState(program?.provider ?? DEFAULT_TRAINING_PROVIDER);
  const [category, setCategory] = useState(program?.category ?? "");
  const [durationLabel, setDurationLabel] = useState(program?.durationLabel ?? "");
  const [level, setLevel] = useState<(typeof TRAINING_LEVELS)[number]>(
    (program?.level as (typeof TRAINING_LEVELS)[number]) ?? TRAINING_LEVELS[0]
  );
  const [status, setStatus] = useState<(typeof TRAINING_PROGRAM_STATUSES)[number]>(
    (program?.status as (typeof TRAINING_PROGRAM_STATUSES)[number]) ?? TRAINING_PROGRAM_STATUSES[0]
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
    <form onSubmit={handleSubmit} className="rounded-2xl overflow-hidden shadow-sm" style={{ background: "white", border: "1px solid #d8d0c4" }}>
      <div className="px-6 py-4 border-b border-[#d8d0c4]">
        <h2 className="font-serif font-bold text-[15px] text-[#000000]">{program ? "Edit program" : "New program"}</h2>
      </div>
      <div className="p-6 flex flex-col gap-4">
        {error && (
          <div className="rounded-xl px-4 py-3" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
            <p className="font-sans text-sm text-[#f87171]">{error}</p>
          </div>
        )}
        <div>
          <label className="font-sans text-[10px] font-bold tracking-[0.12em] text-[#727272] uppercase block mb-1.5">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="font-sans text-sm w-full rounded-xl px-3.5 py-2.5 border border-[#d8d0c4] bg-[#ffffff]"
            placeholder="e.g. Export Documentation Mastery"
            maxLength={200}
          />
        </div>
        <div>
          <label className="font-sans text-[10px] font-bold tracking-[0.12em] text-[#727272] uppercase block mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="font-sans text-sm w-full rounded-xl px-3.5 py-2.5 border border-[#d8d0c4] bg-[#ffffff] min-h-[80px]"
            placeholder="Short description of the program"
            maxLength={2000}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-sans text-[10px] font-bold tracking-[0.12em] text-[#727272] uppercase block mb-1.5">Provider</label>
            <input
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="font-sans text-sm w-full rounded-xl px-3.5 py-2.5 border border-[#d8d0c4] bg-[#ffffff]"
              maxLength={100}
            />
          </div>
          <div>
            <label className="font-sans text-[10px] font-bold tracking-[0.12em] text-[#727272] uppercase block mb-1.5">Category *</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="font-sans text-sm w-full rounded-xl px-3.5 py-2.5 border border-[#d8d0c4] bg-[#ffffff]"
              placeholder="e.g. Export & Trade"
              maxLength={100}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-sans text-[10px] font-bold tracking-[0.12em] text-[#727272] uppercase block mb-1.5">Duration label</label>
            <input
              type="text"
              value={durationLabel}
              onChange={(e) => setDurationLabel(e.target.value)}
              className="font-sans text-sm w-full rounded-xl px-3.5 py-2.5 border border-[#d8d0c4] bg-[#ffffff]"
              placeholder="e.g. 10 modules · ~6 hours"
              maxLength={100}
            />
          </div>
          <div>
            <label className="font-sans text-[10px] font-bold tracking-[0.12em] text-[#727272] uppercase block mb-1.5">Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as (typeof TRAINING_LEVELS)[number])}
              className="font-sans text-sm w-full rounded-xl px-3.5 py-2.5 border border-[#d8d0c4] bg-[#ffffff]"
            >
              {TRAINING_LEVELS.map((l) => (
                <option key={l} value={l}>{getTrainingLevelLabel(l)}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="font-sans text-[10px] font-bold tracking-[0.12em] text-[#727272] uppercase block mb-1.5">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as (typeof TRAINING_PROGRAM_STATUSES)[number])}
            className="font-sans text-sm w-full rounded-xl px-3.5 py-2.5 border border-[#d8d0c4] bg-[#ffffff]"
          >
            {TRAINING_PROGRAM_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="font-sans text-sm font-semibold rounded-xl px-6 py-2.5 transition-colors disabled:opacity-60"
            style={{ background: "#000000", color: "white" }}
          >
            {isPending ? "Saving…" : program ? "Save changes" : "Create program"}
          </button>
          <Link href="/admin/training" className="font-sans text-sm font-medium text-[#727272] hover:text-[#000000] transition-colors">
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
