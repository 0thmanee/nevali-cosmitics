"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { usePartner, useUpdatePartner, useDeletePartner, useApproveUser } from "../../hooks/use-partners";
import { DeleteConfirmModal } from "./delete-confirm-modal";
import type { UpdatePartnerInput } from "~/app/api/partners/schemas/partners.schema";

const fieldStyle = {
  background: "#ffffff",
  border: "1px solid #d8d0c4",
};

const cardStyle = { background: "white", border: "1px solid #d8d0c4" };

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(d));
}

type ProfileRow = { label: string; value: string | null | undefined };

function ProfileSection({ title, rows }: { title: string; rows: ProfileRow[] }) {
  return (
    <div className="rounded-sm overflow-hidden" style={cardStyle}>
      <div className="px-5 py-4 border-b" style={{ borderColor: "#d8d0c4" }}>
        <h3 className="font-serif font-bold text-[15px] text-[#000000]">{title}</h3>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rows.map(({ label, value }) => (
          <div key={label}>
            <p className="font-sans text-[10px] font-bold tracking-[0.12em] text-[#727272] uppercase mb-0.5">
              {label}
            </p>
            <p className="font-sans text-sm text-[#000000]">{value ?? "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PartnerDetailView() {
  const params = useParams();
  const router = useRouter();
  const userId = typeof params.userId === "string" ? params.userId : null;

  const { data: partner, isLoading, isError, error } = usePartner(userId);
  const updateMutation = useUpdatePartner();
  const deleteMutation = useDeletePartner();
  const approveMutation = useApproveUser();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"enabled" | "disabled">("enabled");

  useEffect(() => {
    if (partner) {
      setName(partner.name);
      setEmail(partner.email);
      setStatus(partner.status === "enabled" ? "enabled" : "disabled");
    }
  }, [partner]);

  if (!userId) {
    return (
      <div className="p-4 lg:p-6">
        <p className="font-sans text-sm text-[#727272]">Invalid artisan.</p>
        <Link href="/admin/users" className="mt-2 inline-block font-sans text-sm text-[#000000] underline">
          ← Back to artisans
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="rounded-sm overflow-hidden px-5 py-12 text-center" style={cardStyle}>
          <p className="font-sans text-sm text-[#727272]">Loading artisan…</p>
        </div>
      </div>
    );
  }

  if (isError || !partner) {
    return (
      <div className="p-4 lg:p-6">
        <div className="rounded-sm overflow-hidden px-5 py-6" style={cardStyle}>
          <p className="font-sans text-sm text-red-600">
            {error instanceof Error ? error.message : "Artisan not found."}
          </p>
          <Link href="/admin/users" className="mt-3 inline-block font-sans text-sm text-[#000000] underline">
            ← Back to artisans
          </Link>
        </div>
      </div>
    );
  }

  const profile = partner.profile;
  const profileRows: ProfileRow[] = profile
    ? [
        { label: "First name", value: profile.firstName },
        { label: "Last name", value: profile.lastName },
        { label: "Phone", value: profile.phone },
        { label: "Entity type", value: profile.entityType },
        { label: "Entity name", value: profile.entityName },
        { label: "Registration number", value: profile.registrationNumber ?? undefined },
        { label: "Region", value: profile.region },
        { label: "City", value: profile.city },
        { label: "Year established", value: profile.yearEstablished ?? undefined },
        { label: "Website", value: profile.website ?? undefined },
        {
          label: "Categories",
          value: Array.isArray(profile.categories)
            ? (profile.categories as string[]).join(", ")
            : undefined,
        },
        { label: "Annual capacity", value: profile.annualCapacity ?? undefined },
        { label: "Export experience", value: profile.exportExperience ?? undefined },
      ]
    : [];

  function handleSaveAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!partner) return;
    const payload: UpdatePartnerInput = { name, email, status };
    updateMutation.mutate({ userId: partner.id, data: payload });
  }

  function handleConfirmDelete(id: string) {
    deleteMutation.mutate(id, {
      onSuccess: () => router.push("/admin/users"),
    });
    setShowDeleteConfirm(false);
  }

  const deleteUserForModal = {
    id: partner.id,
    name: partner.name,
    email: partner.email,
    status: partner.status,
    profileCompleted: partner.profileCompleted,
    createdAt: partner.createdAt,
    profile: partner.profile ? { entityName: partner.profile.entityName, region: partner.profile.region ?? null } : null,
  };

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/users"
          className="font-sans text-sm text-[#727272] hover:text-[#000000] transition-colors"
        >
          ← Back to artisans
        </Link>
        <div className="flex items-center gap-2">
          {partner.status === "disabled" && (
            <button
              type="button"
              onClick={() => approveMutation.mutate(partner.id)}
              disabled={approveMutation.isPending}
              className="font-sans text-[12px] font-semibold rounded-sm px-4 py-2 transition-colors disabled:opacity-60"
              style={{ background: "#000000", color: "white", border: "1px solid #000000" }}
            >
              {approveMutation.isPending ? "Activating…" : "Activate account"}
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="font-sans text-[12px] font-medium rounded-sm px-4 py-2 transition-colors"
            style={{
              background: "rgba(248,113,113,0.08)",
              color: "#dc2626",
              border: "1px solid rgba(248,113,113,0.3)",
            }}
          >
            Delete partner
          </button>
        </div>
      </div>

      {/* Account (editable) */}
      <div className="rounded-sm overflow-hidden" style={cardStyle}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "#d8d0c4" }}>
          <h2 className="font-serif font-bold text-[15px] text-[#000000]">Account</h2>
          <p className="font-sans text-[11px] text-[#727272] mt-0.5">
            Edit name, email, or access status. Joined {formatDate(partner.createdAt)}
            {partner.profileCompleted && " · Profile completed"}
          </p>
        </div>
        <form onSubmit={handleSaveAccount} className="p-5 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[10px] font-bold tracking-[0.12em] text-[#727272] uppercase">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="font-sans text-sm text-[#000000] rounded-sm px-3.5 py-2.5 w-full"
                style={fieldStyle}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[10px] font-bold tracking-[0.12em] text-[#727272] uppercase">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="font-sans text-sm text-[#000000] rounded-sm px-3.5 py-2.5 w-full"
                style={fieldStyle}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 max-w-xs">
            <label className="font-sans text-[10px] font-bold tracking-[0.12em] text-[#727272] uppercase">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "enabled" | "disabled")}
              className="font-sans text-sm text-[#000000] rounded-sm px-3.5 py-2.5 w-full"
              style={fieldStyle}
            >
              <option value="enabled">Enabled (can access producer)</option>
              <option value="disabled">Disabled (pending)</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="font-sans text-sm font-semibold rounded-sm px-4 py-2.5 w-fit transition-colors disabled:opacity-60"
            style={{ background: "#000000", color: "white", border: "1px solid #000000" }}
          >
            {updateMutation.isPending ? "Saving…" : "Save account"}
          </button>
        </form>
      </div>

      {/* Profile (read-only) */}
      {profile ? (
        <ProfileSection title="Profile (onboarding)" rows={profileRows} />
      ) : (
        <div className="rounded-sm overflow-hidden px-5 py-6" style={cardStyle}>
          <h3 className="font-serif font-bold text-[15px] text-[#000000]">Profile</h3>
          <p className="font-sans text-sm text-[#727272] mt-1">No profile data yet.</p>
        </div>
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal
          user={deleteUserForModal}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleConfirmDelete}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
