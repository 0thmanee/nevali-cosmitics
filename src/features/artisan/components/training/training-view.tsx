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
  BEGINNER: "#60A5FA",
  INTERMEDIATE: "#727272",
  ADVANCED: "#a78bfa",
};

const levelStyle: Record<string, { bg: string; color: string; border: string }> = {
  BEGINNER: { bg: "rgba(96,165,250,0.12)", color: "#60A5FA", border: "1px solid rgba(96,165,250,0.25)" },
  INTERMEDIATE: { bg: "rgba(201,145,61,0.12)", color: "#727272", border: "1px solid rgba(201,145,61,0.25)" },
  ADVANCED: { bg: "rgba(167,139,250,0.12)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.25)" },
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
        <p className="font-sans text-sm text-[#727272]">Loading programs…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <p className="font-sans text-sm text-[#f87171]">Failed to load training programs.</p>
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
            className="font-sans text-[12px] font-semibold rounded-xl px-4 py-1.5 transition-colors"
            style={activeTab === tab ? { background: "#000000", color: "white" } : { background: "white", color: "#727272", border: "1px solid #d8d0c4" }}
          >
            {tab}
            <span
              className="ml-1.5 text-[10px] font-bold rounded-full px-1.5 py-0.5"
              style={activeTab === tab ? { background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)" } : { background: "rgba(0,0,0,0.08)", color: "#727272" }}
            >
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl px-5 py-8 text-center" style={{ background: "white", border: "1px solid #d8d0c4" }}>
            <p className="font-sans text-sm text-[#727272]">
              {programs.length === 0
                ? "No training programs available yet. The admin will publish programs and assign them to your organization."
                : `No programs in this tab.`}
            </p>
          </div>
        ) : (
          filtered.map((program) => {
            const status = getTrainingProgramDisplayStatus(program);
            const color = LEVEL_COLORS[program.level] ?? "#727272";
            const isExpanded = expanded === program.id;
            const modulesCompleted = program.enrollment?.modulesCompleted ?? 0;
            const totalModules = program.modulesCount;
            const progress = program.enrollment?.progress ?? 0;

            return (
              <div key={program.id} className="rounded-xl overflow-hidden transition-all" style={{ background: "white", border: "1px solid #d8d0c4" }}>
                <div className="px-5 py-4 flex items-start gap-4">
                  <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: color, minHeight: 40 }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-serif font-bold text-[15px] text-[#000000] leading-tight">{program.name}</h3>
                          <span className="font-sans text-[10px] font-bold tracking-wide rounded-full px-2.5 py-0.5 uppercase shrink-0" style={levelStyle[program.level] ?? levelStyle.INTERMEDIATE}>{getTrainingLevelLabel(program.level)}</span>
                        </div>
                        <p className="font-sans text-[12px] text-[#727272]">{program.provider} · {program.category}{program.durationLabel ? ` · ${program.durationLabel}` : ""}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {status === "IN_PROGRESS" && (
                          <Link href={`/artisan/training/${program.id}`} className="font-sans text-[12px] font-semibold rounded-xl px-4 py-2 transition-colors inline-block" style={{ background: "#000000", color: "white" }}>Continue →</Link>
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
                            className="font-sans text-[12px] font-semibold rounded-xl px-4 py-2 transition-colors disabled:opacity-60"
                            style={{ background: "#ffffff", color: "#000000", border: "1px solid #d8d0c4" }}
                          >
                            {enrollMutation.isPending ? "Starting…" : "Start"}
                          </button>
                        )}
                        {status === "COMPLETED" && (
                          <span className="font-sans text-[12px] font-semibold rounded-xl px-4 py-2 inline-block" style={{ background: "rgba(200,150,60,0.1)", color: "#727272", border: "1px solid rgba(200,150,60,0.2)" }}>Completed</span>
                        )}
                        <button type="button" onClick={() => setExpanded(isExpanded ? null : program.id)} className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors" style={{ background: "#ffffff", border: "1px solid #d8d0c4" }}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                            <path d="M2 4l4 4 4-4" stroke="#727272" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {status === "IN_PROGRESS" && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-sans text-[11px] text-[#727272]">{modulesCompleted} of {totalModules} modules completed</span>
                          <span className="font-sans text-[11px] font-semibold" style={{ color }}>{progress}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#ffffff" }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: color }} />
                        </div>
                        <p className="font-sans text-[11px] text-[#727272] mt-1.5">
                          Up next: <Link href={`/artisan/training/${program.id}`} className="font-semibold text-[#000000] hover:underline">Open program</Link>
                        </p>
                      </div>
                    )}
                    {status === "COMPLETED" && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <circle cx="6" cy="6" r="5" stroke="#727272" strokeWidth="1.2" />
                          <path d="M3.5 6l1.8 1.8 3.2-3.6" stroke="#727272" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="font-sans text-[11px] font-semibold text-[#727272]">Completed · All {totalModules} modules</span>
                      </div>
                    )}
                  </div>
                </div>
                {isExpanded && (
                  <div className="px-5 pb-5 border-t" style={{ borderColor: "#d8d0c4" }}>
                    <div className="pt-4 flex flex-col gap-3">
                      {program.description && <p className="font-sans text-[13px] text-[#727272] leading-relaxed">{program.description}</p>}
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: "Category", value: program.category },
                          { label: "Duration", value: program.durationLabel ?? "—" },
                          { label: "Level", value: getTrainingLevelLabel(program.level) },
                          { label: "Provider", value: program.provider },
                        ].map((d) => (
                          <div key={d.label} className="rounded-xl px-3 py-2" style={{ background: "#ffffff", border: "1px solid #d8d0c4" }}>
                            <p className="font-sans text-[9px] font-bold tracking-wider text-[#727272] uppercase">{d.label}</p>
                            <p className="font-sans text-[12px] font-semibold text-[#000000] mt-0.5">{d.value}</p>
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
                          className="font-sans text-[12px] font-semibold rounded-xl px-4 py-2 w-fit transition-colors disabled:opacity-60"
                          style={{ background: "#000000", color: "white" }}
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
