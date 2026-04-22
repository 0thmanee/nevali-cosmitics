"use client";

import React from "react";
import Link from "next/link";
import { useTrainingPrograms } from "~/features/artisan/hooks/use-training";
import { getTrainingProgramDisplayStatus } from "~/features/artisan/utils/training";

const LEVEL_COLORS: Record<string, string> = {
  BEGINNER: "#60A5FA",
  INTERMEDIATE: "#C8963C",
  ADVANCED: "#a78bfa",
};

export function TrainingProgressCard() {
  const { data: programs = [], isLoading } = useTrainingPrograms();

  const inProgress = programs.filter((p) => getTrainingProgramDisplayStatus(p) === "IN_PROGRESS");

  if (isLoading) {
    return (
      <div className="rounded-xl overflow-hidden" style={{ background: "white", border: "1px solid #f0e8dc" }}>
        <div className="px-5 py-3.5 border-b" style={{ borderColor: "#f0e8dc" }}>
          <h2 className="font-serif font-bold text-[15px] text-[#2a0f05]">Training Progress</h2>
          <p className="font-sans text-[12px] text-[#7a4d38] mt-0.5">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "white", border: "1px solid #f0e8dc" }}>
      <div className="px-5 py-3.5 border-b flex items-center justify-between" style={{ borderColor: "#f0e8dc" }}>
        <div>
          <h2 className="font-serif font-bold text-[15px] text-[#2a0f05]">Training Progress</h2>
          <p className="font-sans text-[12px] text-[#7a4d38] mt-0.5">
            {inProgress.length === 0
              ? "No programs in progress"
              : `${inProgress.length} program${inProgress.length !== 1 ? "s" : ""} in progress`}
          </p>
        </div>
        {programs.length > 0 && (
          <Link
            href="/artisan/training"
            className="font-sans text-[12px] font-semibold text-[#2a0f05] hover:underline"
          >
            View all
          </Link>
        )}
      </div>
      {inProgress.length === 0 ? (
        <div className="px-5 py-4">
          <p className="font-sans text-[12px] text-[#7a4d38]">
            Enroll in a program from the Training page to see your progress here.
          </p>
          <Link
            href="/artisan/training"
            className="mt-2 inline-block font-sans text-[12px] font-semibold text-[#7b2d1e] hover:underline"
          >
            Go to Training →
          </Link>
        </div>
      ) : (
        inProgress.slice(0, 3).map((p) => {
          const color = LEVEL_COLORS[p.level] ?? "#C8963C";
          return (
            <Link
              key={p.id}
              href={`/artisan/training/${p.id}`}
              className="block px-5 py-3 hover:bg-[#FAFAF7] transition-colors"
              style={{ borderTop: "1px solid #f0e8dc" }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-sans font-semibold text-sm text-[#2a0f05] leading-tight">{p.name}</p>
                <span className="font-sans text-[11px] text-[#7a4d38]">{p.enrollment?.progress ?? 0}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden w-full" style={{ background: "#FAF5EE" }}>
                <div className="h-full rounded-full" style={{ width: `${p.enrollment?.progress ?? 0}%`, background: color }} />
              </div>
              <p className="font-sans text-[11px] text-[#7a4d38] mt-1.5">
                {p.enrollment?.modulesCompleted ?? 0}/{p.modulesCount} modules · {p.provider}
              </p>
            </Link>
          );
        })
      )}
    </div>
  );
}
