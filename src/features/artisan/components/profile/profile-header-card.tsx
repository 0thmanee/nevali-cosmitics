"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Avatar } from "~/components/avatar";
import { useUploadProfileImage } from "~/features/media";

type Props = {
  displayName: string;
  entityName: string;
  entityType: string;
  region: string;
  memberSince: string;
  profileImage?: string | null;
  /** Shown under entity line when set (public headline). */
  publicTagline?: string | null;
};

export function ProfileHeaderCard({
  displayName,
  entityName,
  entityType,
  region,
  memberSince,
  profileImage,
  publicTagline,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const uploadMutation = useUploadProfileImage();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    uploadMutation.mutate(file, {
      onSuccess: () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
      onError: (err) => {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      },
    });
  };

  const openFilePicker = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  const uploading = uploadMutation.isPending;
  const displayError = error ?? (uploadMutation.isError && uploadMutation.error instanceof Error ? uploadMutation.error.message : null);

  return (
    <div className="rounded-sm overflow-hidden" style={{ background: "white", border: "1px solid #d8d0c4" }}>
      <div
        className="h-20"
        style={{
          background: "linear-gradient(in oklab 90deg, oklab(14% 0.045 0.025) 0%, oklab(24% 0.07 0.038) 50%, oklab(36% 0.09 0.048) 100%)",
        }}
      />
      <div className="px-6 pb-6">
        <div className="flex items-end justify-between" style={{ marginTop: -28 }}>
          <div className="flex flex-col items-start gap-1">
            <Avatar
              displayName={displayName}
              imageUrl={profileImage}
              size="lg"
              variant="header"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoChange}
              disabled={uploading}
            />
            <button
              type="button"
              onClick={openFilePicker}
              disabled={uploading}
              className="font-sans text-[11px] font-medium text-[#727272] hover:text-[#000000] transition-colors disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Change photo"}
            </button>
            {displayError && (
              <p className="font-sans text-xs text-red-600 max-w-[200px]" role="alert">
                {displayError}
              </p>
            )}
          </div>
          <Link
            href="/artisan/profile/edit"
            className="font-sans text-sm font-medium rounded-sm px-4 py-2 transition-colors inline-block"
            style={{ background: "#ffffff", color: "#000000", border: "1px solid #d8d0c4" }}
          >
            Edit Profile
          </Link>
        </div>
        <div className="mt-3 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold uppercase text-[20px] text-[#000000] leading-tight">{displayName}</h2>
            <span
              className="font-sans text-[9px] font-bold tracking-wider rounded-full px-2.5 py-1 uppercase"
              style={{ background: "rgba(0,0,0,0.85)", color: "#727272", border: "1px solid rgba(200,150,60,0.3)" }}
            >
              Certified
            </span>
          </div>
          <p className="font-sans text-sm text-[#727272]">{entityType} · {entityName}</p>
          {publicTagline?.trim() && (
            <p className="font-sans text-sm text-[#000000] font-medium mt-2 leading-snug max-w-xl">{publicTagline}</p>
          )}
          <div className="flex items-center gap-4 mt-1 flex-wrap">
            <span className="font-sans text-[12px] text-[#727272] flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1C4.1 1 2.5 2.6 2.5 4.5c0 2.8 3.5 6.5 3.5 6.5s3.5-3.7 3.5-6.5C9.5 2.6 7.9 1 6 1z" stroke="#727272" strokeWidth="1.1" />
                <circle cx="6" cy="4.5" r="1.2" stroke="#727272" strokeWidth="1.1" />
              </svg>
              {region} Region, Morocco
            </span>
            <span className="font-sans text-[12px] text-[#727272] flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="2" width="10" height="8" rx="1.5" stroke="#727272" strokeWidth="1.1" />
                <path d="M1 4.5h10" stroke="#727272" strokeWidth="1.1" />
                <path d="M4 1v2M8 1v2" stroke="#727272" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
              Member since {memberSince}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
