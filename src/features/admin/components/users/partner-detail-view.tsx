"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import type { UpdatePartnerInput } from "~/app/api/partners/schemas/partners.schema";
import {
	useApproveUser,
	useDeletePartner,
	usePartner,
	useUpdatePartner,
} from "../../hooks/use-partners";
import { DeleteConfirmModal } from "./delete-confirm-modal";

const fieldStyle = {
	background: "var(--color-paper)",
	border: "1px solid var(--color-cream-dark)",
};

const cardStyle = {
	background: "white",
	border: "1px solid var(--color-cream-dark)",
};

function formatDate(d: Date) {
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(d));
}

type ProfileRow = { label: string; value: string | null | undefined };

function ProfileSection({
	title,
	rows,
}: {
	title: string;
	rows: ProfileRow[];
}) {
	return (
		<div className="overflow-hidden rounded-sm" style={cardStyle}>
			<div
				className="border-b px-5 py-4"
				style={{ borderColor: "var(--color-cream-dark)" }}
			>
				<h3 className="font-bold font-serif text-[15px] text-text-dark">
					{title}
				</h3>
			</div>
			<div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
				{rows.map(({ label, value }) => (
					<div key={label}>
						<p className="mb-0.5 font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
							{label}
						</p>
						<p className="font-sans text-sm text-text-dark">{value ?? "—"}</p>
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
				<p className="font-sans text-sm text-text-muted">Invalid artisan.</p>
				<Link
					className="mt-2 inline-block font-sans text-sm text-text-dark underline"
					href="/admin/users"
				>
					← Back to artisans
				</Link>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="p-4 lg:p-6">
				<div
					className="overflow-hidden rounded-sm px-5 py-12 text-center"
					style={cardStyle}
				>
					<p className="font-sans text-sm text-text-muted">Loading artisan…</p>
				</div>
			</div>
		);
	}

	if (isError || !partner) {
		return (
			<div className="p-4 lg:p-6">
				<div className="overflow-hidden rounded-sm px-5 py-6" style={cardStyle}>
					<p className="font-sans text-red-600 text-sm">
						{error instanceof Error ? error.message : "Artisan not found."}
					</p>
					<Link
						className="mt-3 inline-block font-sans text-sm text-text-dark underline"
						href="/admin/users"
					>
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
				{
					label: "Registration number",
					value: profile.registrationNumber ?? undefined,
				},
				{ label: "Region", value: profile.region },
				{ label: "City", value: profile.city },
				{
					label: "Year established",
					value: profile.yearEstablished ?? undefined,
				},
				{ label: "Website", value: profile.website ?? undefined },
				{
					label: "Categories",
					value: Array.isArray(profile.categories)
						? (profile.categories as string[]).join(", ")
						: undefined,
				},
				{
					label: "Annual capacity",
					value: profile.annualCapacity ?? undefined,
				},
				{
					label: "Export experience",
					value: profile.exportExperience ?? undefined,
				},
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
		profile: partner.profile
			? {
					entityName: partner.profile.entityName,
					region: partner.profile.region ?? null,
				}
			: null,
	};

	return (
		<div className="flex flex-col gap-6 p-4 lg:p-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<Link
					className="font-sans text-sm text-text-muted transition-colors hover:text-text-dark"
					href="/admin/users"
				>
					← Back to artisans
				</Link>
				<div className="flex items-center gap-2">
					{partner.status === "disabled" && (
						<button
							className="rounded-sm px-4 py-2 font-sans font-semibold text-[12px] transition-colors disabled:opacity-60"
							disabled={approveMutation.isPending}
							onClick={() => approveMutation.mutate(partner.id)}
							style={{
								background: "var(--color-ink)",
								color: "white",
								border: "1px solid var(--color-ink)",
							}}
							type="button"
						>
							{approveMutation.isPending ? "Activating…" : "Activate account"}
						</button>
					)}
					<button
						className="rounded-sm px-4 py-2 font-medium font-sans text-[12px] transition-colors"
						onClick={() => setShowDeleteConfirm(true)}
						style={{
							background:
								"color-mix(in srgb, var(--color-danger) 8%, transparent)",
							color: "var(--color-danger-dark)",
							border:
								"1px solid color-mix(in srgb, var(--color-danger) 30%, transparent)",
						}}
						type="button"
					>
						Delete partner
					</button>
				</div>
			</div>

			{/* Account (editable) */}
			<div className="overflow-hidden rounded-sm" style={cardStyle}>
				<div
					className="border-b px-5 py-4"
					style={{ borderColor: "var(--color-cream-dark)" }}
				>
					<h2 className="font-bold font-serif text-[15px] text-text-dark">
						Account
					</h2>
					<p className="mt-0.5 font-sans text-[11px] text-text-muted">
						Edit name, email, or access status. Joined{" "}
						{formatDate(partner.createdAt)}
						{partner.profileCompleted && " · Profile completed"}
					</p>
				</div>
				<form className="flex flex-col gap-4 p-5" onSubmit={handleSaveAccount}>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="flex flex-col gap-1.5">
							<label className="font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
								Name
							</label>
							<input
								className="w-full rounded-sm px-3.5 py-2.5 font-sans text-sm text-text-dark"
								onChange={(e) => setName(e.target.value)}
								required
								style={fieldStyle}
								type="text"
								value={name}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<label className="font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
								Email
							</label>
							<input
								className="w-full rounded-sm px-3.5 py-2.5 font-sans text-sm text-text-dark"
								onChange={(e) => setEmail(e.target.value)}
								required
								style={fieldStyle}
								type="email"
								value={email}
							/>
						</div>
					</div>
					<div className="flex max-w-xs flex-col gap-1.5">
						<label className="font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.12em]">
							Status
						</label>
						<select
							className="w-full rounded-sm px-3.5 py-2.5 font-sans text-sm text-text-dark"
							onChange={(e) =>
								setStatus(e.target.value as "enabled" | "disabled")
							}
							style={fieldStyle}
							value={status}
						>
							<option value="enabled">Enabled (can access producer)</option>
							<option value="disabled">Disabled (pending)</option>
						</select>
					</div>
					<button
						className="w-fit rounded-sm px-4 py-2.5 font-sans font-semibold text-sm transition-colors disabled:opacity-60"
						disabled={updateMutation.isPending}
						style={{
							background: "var(--color-ink)",
							color: "white",
							border: "1px solid var(--color-ink)",
						}}
						type="submit"
					>
						{updateMutation.isPending ? "Saving…" : "Save account"}
					</button>
				</form>
			</div>

			{/* Profile (read-only) */}
			{profile ? (
				<ProfileSection rows={profileRows} title="Profile (onboarding)" />
			) : (
				<div className="overflow-hidden rounded-sm px-5 py-6" style={cardStyle}>
					<h3 className="font-bold font-serif text-[15px] text-text-dark">
						Profile
					</h3>
					<p className="mt-1 font-sans text-sm text-text-muted">
						No profile data yet.
					</p>
				</div>
			)}

			{showDeleteConfirm && (
				<DeleteConfirmModal
					isDeleting={deleteMutation.isPending}
					onClose={() => setShowDeleteConfirm(false)}
					onConfirm={handleConfirmDelete}
					user={deleteUserForModal}
				/>
			)}
		</div>
	);
}
