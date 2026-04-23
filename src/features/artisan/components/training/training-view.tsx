"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Library, GraduationCap } from "lucide-react";
import { StatCard, STAT_ICON_COLOR } from "~/components/stat-card";
import { getTrainingLevelLabel } from "~/app/api/training/schemas/training.schema";
import { useTrainingPrograms, useEnrollInProgram } from "~/features/artisan/hooks/use-training";
import { getTrainingProgramDisplayStatus } from "~/features/artisan/utils/training";

const TABS = ["All", "In Progress", "Available", "Completed"] as const;
type Tab = (typeof TABS)[number];

const LEVEL_COLORS: Record<string, string> = {
  BEGINNER: "var(--color-info)",
  INTERMEDIATE: "var(--color-text-muted)",
  ADVANCED: "var(--color-primary-light)",
};

const levelStyle: Record<string, { bg: string; color: string; border: string }> = {
  BEGINNER: { bg: "color-mix(in srgb, var(--color-info) 12%, transparent)", color: "var(--color-info)", border: "1px solid color-mix(in srgb, var(--color-info) 25%, transparent)" },
  INTERMEDIATE: { bg: "color-mix(in srgb, var(--color-gold) 12%, transparent)", color: "var(--color-text-muted)", border: "1px solid color-mix(in srgb, var(--color-gold) 25%, transparent)" },
  ADVANCED: { bg: "color-mix(in srgb, var(--color-primary-light) 12%, transparent)", color: "var(--color-primary-light)", border: "1px solid color-mix(in srgb, var(--color-primary-light) 25%, transparent)" },
};

export function TrainingView() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [expanded, setExpanded] = useState<string | null>(null);

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
    "In Progress": programs.filter((p) => getTrainingProgramDisplayStatus(p) === "IN_PROGRESS").length,
    Available: programs.filter((p) => getTrainingProgramDisplayStatus(p) === "AVAILABLE").length,
    Completed: programs.filter((p) => getTrainingProgramDisplayStatus(p) === "COMPLETED").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="font-sans text-sm text-text-muted">Loading programs…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <p className="font-sans text-sm text-[var(--color-danger)]">Failed to load training programs.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="In Progress" value={counts["In Progress"]} icon={<BookOpen size={20} color={STAT_ICON_COLOR.amber} />} variant="amber" />
        <StatCard label="Available" value={counts["Available"]} icon={<Library size={20} color={STAT_ICON_COLOR.neutral} />} variant="neutral" />
        <StatCard label="Completed" value={counts["Completed"]} icon={<GraduationCap size={20} color={STAT_ICON_COLOR.green} />} variant="green" />
      </div>
      <div className="flex items-center gap-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => { setActiveTab(tab); setExpanded(null); }}
            className="font-sans text-[12px] font-semibold rounded-sm px-4 py-1.5 transition-colors"
            style={activeTab === tab ? { background: "var(--color-ink)", color: "white" } : { background: "white", color: "var(--color-text-muted)", border: "1px solid var(--color-cream-dark)" }}
          >
            {tab}
            <span
              className="ml-1.5 text-[10px] font-bold rounded-full px-1.5 py-0.5"
              style={activeTab === tab ? { background: "color-mix(in srgb, var(--color-paper) 15%, transparent)", color: "color-mix(in srgb, var(--color-paper) 80%, transparent)" } : { background: "color-mix(in srgb, var(--color-ink) 8%, transparent)", color: "var(--color-text-muted)" }}
            >
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="rounded-sm px-5 py-8 text-center" style={{ background: "white", border: "1px solid var(--color-cream-dark)" }}>
            <p className="font-sans text-sm text-text-muted">
              {programs.length === 0
                ? "No training programs available yet. The admin will publish programs and assign them to your organization."
                : `No programs in this tab.`}
            </p>
          </div>
        ) : (
          filtered.map((program) => {
            const status = getTrainingProgramDisplayStatus(program);
            const color = LEVEL_COLORS[program.level] ?? "var(--color-text-muted)";
            const isExpanded = expanded === program.id;
            const modulesCompleted = program.enrollment?.modulesCompleted ?? 0;
            const totalModules = program.modulesCount;
            const progress = program.enrollment?.progress ?? 0;

            return (
              <div key={program.id} className="rounded-sm overflow-hidden transition-all" style={{ background: "white", border: "1px solid var(--color-cream-dark)" }}>
                <div className="px-5 py-4 flex items-start gap-4">
                  <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: color, minHeight: 40 }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-serif font-bold text-[15px] text-text-dark leading-tight">{program.name}</h3>
                          <span className="font-sans text-[10px] font-bold tracking-wide rounded-full px-2.5 py-0.5 uppercase shrink-0" style={levelStyle[program.level] ?? levelStyle.INTERMEDIATE}>{getTrainingLevelLabel(program.level)}</span>
                        </div>
                        <p className="font-sans text-[12px] text-text-muted">{program.provider} · {program.category}{program.durationLabel ? ` · ${program.durationLabel}` : ""}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {status === "IN_PROGRESS" && (
                          <Link href={`/artisan/training/${program.id}`} className="font-sans text-[12px] font-semibold rounded-sm px-4 py-2 transition-colors inline-block" style={{ background: "var(--color-ink)", color: "white" }}>Continue →</Link>
                        )}
                        {status === "AVAILABLE" && (
                          <button
                            type="button"
                            onClick={() =>
                              enrollMutation.mutate(program.id, {
                                onSuccess: () => router.push(`/artisan/training/${program.id}`),
                              })
                            }
                            disabled={enrollMutation.isPending}
                            className="font-sans text-[12px] font-semibold rounded-sm px-4 py-2 transition-colors disabled:opacity-60"
                            style={{ background: "var(--color-paper)", color: "var(--color-ink)", border: "1px solid var(--color-cream-dark)" }}
                          >
                            {enrollMutation.isPending ? "Starting…" : "Start"}
                          </button>
                        )}
                        {status === "COMPLETED" && (
                          <span className="font-sans text-[12px] font-semibold rounded-sm px-4 py-2 inline-block" style={{ background: "color-mix(in srgb, var(--color-gold) 10%, transparent)", color: "var(--color-text-muted)", border: "1px solid color-mix(in srgb, var(--color-gold) 20%, transparent)" }}>Completed</span>
                        )}
                        <button type="button" onClick={() => setExpanded(isExpanded ? null : program.id)} className="w-8 h-8 rounded-sm flex items-center justify-center transition-colors" style={{ background: "var(--color-paper)", border: "1px solid var(--color-cream-dark)" }}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                            <path d="M2 4l4 4 4-4" stroke="var(--color-text-muted)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {status === "IN_PROGRESS" && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-sans text-[11px] text-text-muted">{modulesCompleted} of {totalModules} modules completed</span>
                          <span className="font-sans text-[11px] font-semibold" style={{ color }}>{progress}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-paper)" }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: color }} />
                        </div>
                        <p className="font-sans text-[11px] text-text-muted mt-1.5">
                          Up next: <Link href={`/artisan/training/${program.id}`} className="font-semibold text-text-dark hover:underline">Open program</Link>
                        </p>
                      </div>
                    )}
                    {status === "COMPLETED" && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <circle cx="6" cy="6" r="5" stroke="var(--color-text-muted)" strokeWidth="1.2" />
                          <path d="M3.5 6l1.8 1.8 3.2-3.6" stroke="var(--color-text-muted)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="font-sans text-[11px] font-semibold text-text-muted">Completed · All {totalModules} modules</span>
                      </div>
                    )}
                  </div>
                </div>
                {isExpanded && (
                  <div className="px-5 pb-5 border-t" style={{ borderColor: "var(--color-cream-dark)" }}>
                    <div className="pt-4 flex flex-col gap-3">
                      {program.description && <p className="font-sans text-[13px] text-text-muted leading-relaxed">{program.description}</p>}
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: "Category", value: program.category },
                          { label: "Duration", value: program.durationLabel ?? "—" },
                          { label: "Level", value: getTrainingLevelLabel(program.level) },
                          { label: "Provider", value: program.provider },
                        ].map((d) => (
                          <div key={d.label} className="rounded-sm px-3 py-2" style={{ background: "var(--color-paper)", border: "1px solid var(--color-cream-dark)" }}>
                            <p className="font-sans text-[9px] font-bold tracking-wider text-text-muted uppercase">{d.label}</p>
                            <p className="font-sans text-[12px] font-semibold text-text-dark mt-0.5">{d.value}</p>
                          </div>
                        ))}
                      </div>
                      {status === "AVAILABLE" && (
                        <button
                          type="button"
                          onClick={() =>
                            enrollMutation.mutate(program.id, {
                              onSuccess: () => router.push(`/artisan/training/${program.id}`),
                            })
                          }
                          disabled={enrollMutation.isPending}
                          className="font-sans text-[12px] font-semibold rounded-sm px-4 py-2 w-fit transition-colors disabled:opacity-60"
                          style={{ background: "var(--color-ink)", color: "white" }}
                        >
                          {enrollMutation.isPending ? "Starting…" : "Enroll and start"}
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
