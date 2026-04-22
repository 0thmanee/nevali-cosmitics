"use client";

import React from "react";
import Link from "next/link";
import { getTrainingLevelLabel } from "~/app/api/training/schemas/training.schema";
import type { TrainingProgramDetailRow, TrainingProgramMediaRow } from "~/app/api/training/schemas/training.schema";
import { useTrainingProgram, useEnrollInProgram, useUpdateEnrollmentProgress } from "~/features/artisan/hooks/use-training";

const levelStyle: Record<string, { bg: string; color: string; border: string }> = {
  BEGINNER: { bg: "rgba(96,165,250,0.12)", color: "#60A5FA", border: "1px solid rgba(96,165,250,0.25)" },
  INTERMEDIATE: { bg: "rgba(201,145,61,0.12)", color: "#C8963C", border: "1px solid rgba(201,145,61,0.25)" },
  ADVANCED: { bg: "rgba(167,139,250,0.12)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.25)" },
};

function MediaBlock({ media }: { media: TrainingProgramMediaRow }) {
  const title = media.title || (media.mediaType === "VIDEO" ? "Video" : media.mediaType === "PDF" ? "Document" : "Image");

  if (media.mediaType === "VIDEO") {
    return (
      <div className="rounded-xl overflow-hidden bg-black">
        <video
          src={media.fileUrl}
          controls
          className="w-full max-h-[400px]"
          preload="metadata"
        />
        {title && <p className="font-sans text-[12px] text-white/80 px-3 py-2">{title}</p>}
      </div>
    );
  }
  if (media.mediaType === "PDF") {
    return (
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #f0e8dc" }}>
        <iframe src={media.fileUrl} title={title} className="w-full h-[400px]" />
        <a href={media.fileUrl} target="_blank" rel="noopener noreferrer" className="block font-sans text-[12px] font-medium text-[#7b2d1e] hover:underline px-3 py-2">
          Open PDF: {title}
        </a>
      </div>
    );
  }
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #f0e8dc" }}>
      <a href={media.fileUrl} target="_blank" rel="noopener noreferrer" className="block">
        <img src={media.fileUrl} alt={title} className="w-full max-h-[400px] object-contain bg-[#F5F0E8]" />
      </a>
      {title && <p className="font-sans text-[12px] text-[#7a4d38] px-3 py-2">{title}</p>}
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
      <div className="p-4 lg:p-6 flex items-center justify-center py-20">
        <p className="font-sans text-sm text-[#7a4d38]">{isLoading ? "Loading…" : "Program not found."}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 lg:p-6">
        <p className="font-sans text-sm text-[#f87171]">Failed to load program.</p>
        <Link href="/artisan/training" className="mt-2 inline-block font-sans text-sm font-medium text-[#2a0f05] underline">← Back to Training</Link>
      </div>
    );
  }

  const enrollment = program.enrollment;
  const modulesCompleted = enrollment?.modulesCompleted ?? 0;
  const programMedia = program.media.filter((m) => !m.moduleId);
  const cardStyle = { background: "white", border: "1px solid #f0e8dc" } as const;

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-6">
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/artisan/training" className="font-sans text-[#7a4d38] hover:text-[#2a0f05] transition-colors">Training</Link>
        <span className="font-sans text-[#7a4d38]/60">/</span>
        <span className="font-sans font-medium text-[#2a0f05] truncate">{program.name}</span>
      </nav>

      <div className="rounded-2xl overflow-hidden shadow-sm" style={cardStyle}>
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="font-serif font-bold text-[22px] text-[#2a0f05] leading-tight">{program.name}</h1>
            <p className="font-sans text-[13px] text-[#7a4d38] mt-1">{program.provider} · {program.category}</p>
            <p className="font-sans text-[12px] text-[#7a4d38]/80 mt-1">{program.durationLabel ?? ""}</p>
            <span className="font-sans text-[10px] font-bold tracking-wide rounded-full px-2.5 py-0.5 uppercase mt-2 inline-block" style={levelStyle[program.level] ?? levelStyle.INTERMEDIATE}>{getTrainingLevelLabel(program.level)}</span>
          </div>
          {!enrollment && (
            <button
              type="button"
              onClick={() => enrollMutation.mutate(programId)}
              disabled={enrollMutation.isPending}
              className="font-sans text-sm font-semibold rounded-xl px-4 py-2 transition-colors disabled:opacity-60 shrink-0"
              style={{ background: "#1a0500", color: "white" }}
            >
              {enrollMutation.isPending ? "Enrolling…" : "Enroll"}
            </button>
          )}
        </div>
        {program.description && (
          <div className="px-6 pb-5">
            <p className="font-sans text-[13px] text-[#7a4d38] leading-relaxed">{program.description}</p>
          </div>
        )}
        {enrollment && (
          <div className="px-6 pb-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-sans text-[11px] text-[#7a4d38]">{modulesCompleted} of {program.modules.length} modules completed</span>
              <span className="font-sans text-[11px] font-semibold text-[#2a0f05]">{enrollment.progress}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "#FAF5EE" }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${enrollment.progress}%`, background: "#2a0f05" }} />
            </div>
          </div>
        )}
      </div>

      {programMedia.length > 0 && (
        <div className="rounded-2xl overflow-hidden shadow-sm" style={cardStyle}>
          <div className="px-6 py-4 border-b border-[#f0e8dc]">
            <h2 className="font-serif font-bold text-[15px] text-[#2a0f05]">Program materials</h2>
          </div>
          <div className="p-6 flex flex-col gap-4">
            {programMedia.map((m) => (
              <MediaBlock key={m.id} media={m} />
            ))}
          </div>
        </div>
      )}

      {program.modules.length > 0 && (
        <div className="rounded-2xl overflow-hidden shadow-sm" style={cardStyle}>
          <div className="px-6 py-4 border-b border-[#f0e8dc]">
            <h2 className="font-serif font-bold text-[15px] text-[#2a0f05]">Modules</h2>
          </div>
          <div className="divide-y divide-[#f0e8dc]">
            {program.modules.map((module, index) => {
              const moduleMedia = program.media.filter((m) => m.moduleId === module.id);
              const isComplete = enrollment ? modulesCompleted > index : false;
              const isNext = enrollment && modulesCompleted === index;

              return (
                <div key={module.id} className="px-6 py-5 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif font-bold text-[15px] text-[#2a0f05]">Module {index + 1}: {module.title}</h3>
                      {module.description && <p className="font-sans text-[12px] text-[#7a4d38] mt-1">{module.description}</p>}
                    </div>
                    <div className="shrink-0">
                      {isComplete && (
                        <span className="font-sans text-[11px] font-semibold text-[#C8963C] flex items-center gap-1.5">
                          <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="#C8963C" strokeWidth="1.2" /><path d="M3.5 6l1.8 1.8 3.2-3.6" stroke="#C8963C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          Complete
                        </span>
                      )}
                      {isNext && enrollment && (
                        <button
                          type="button"
                          onClick={() => updateProgressMutation.mutate({ enrollmentId: enrollment.id, modulesCompleted: index + 1 })}
                          disabled={updateProgressMutation.isPending}
                          className="font-sans text-[12px] font-semibold rounded-xl px-4 py-2 transition-colors disabled:opacity-60"
                          style={{ background: "#1a0500", color: "white" }}
                        >
                          {updateProgressMutation.isPending ? "Saving…" : "Mark complete"}
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

      <Link href="/artisan/training" className="font-sans text-sm font-medium text-[#7a4d38] hover:text-[#2a0f05] transition-colors w-fit">
        ← Back to Training
      </Link>
    </div>
  );
}
