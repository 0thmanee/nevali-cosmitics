"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useRef, useState } from "react";
import type {
	ProfileEditProfile,
	ProfileViewUser,
} from "~/app/api/profile/schemas/profile.schema";
import { Avatar } from "~/components/avatar";
import { useI18n } from "~/components/i18n/i18n-provider";
import { useUploadProfileImage } from "~/features/media";
import {
	COSMETICS_CATEGORY_SUGGESTIONS,
	ENTITY_TYPES,
	EXPORT_EXPERIENCE_OPTIONS,
	MOROCCAN_REGIONS,
	type OnboardingFormData,
	upsertProfile,
} from "~/features/profile";
import {
	cardHeaderBorder,
	cardStyle,
	fieldStyle,
	inputClassName,
	labelClassName,
} from "./profile-edit-styles";
import { ProfileHeaderCard } from "./profile-header-card";
import { ProfileSideCards } from "./profile-side-cards";

type Props = {
	user: ProfileViewUser;
	profile: ProfileEditProfile;
	memberSince: string;
	partnerId: string;
};

export function ProfileEditView({
	user,
	profile,
	memberSince,
	partnerId,
}: Props) {
	const router = useRouter();
	const { t } = useI18n();
	const [form, setForm] = useState<OnboardingFormData>({
		firstName: profile.firstName,
		lastName: profile.lastName,
		phone: profile.phone,
		entityType: profile.entityType,
		entityName: profile.entityName,
		registrationNumber: profile.registrationNumber ?? "",
		region: profile.region,
		city: profile.city,
		yearEstablished: profile.yearEstablished ?? "",
		website: profile.website ?? "",
		categories: profile.categories.length > 0 ? profile.categories : [],
		annualCapacity: profile.annualCapacity ?? "",
		exportExperience: profile.exportExperience ?? "",
		publicTagline: profile.publicTagline ?? "",
		businessDescription: profile.businessDescription ?? "",
		exportMarkets: profile.exportMarkets ?? "",
		valuesHighlight: profile.valuesHighlight ?? "",
		agreeTerms: profile.agreeTerms,
		agreeMarketing: profile.agreeMarketing,
	});
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const photoInputRef = useRef<HTMLInputElement>(null);
	const [photoError, setPhotoError] = useState<string | null>(null);
	const uploadProfileImageMutation = useUploadProfileImage();

	const set =
		(key: keyof OnboardingFormData) => (value: string | boolean | string[]) =>
			setForm((prev) => ({ ...prev, [key]: value }));

	const [categoryInput, setCategoryInput] = useState("");

	const addCategory = (raw: string) => {
		const value = raw.trim();
		if (!value) return;
		setForm((f) =>
			f.categories.includes(value)
				? f
				: { ...f, categories: [...f.categories, value] },
		);
		setCategoryInput("");
	};

	const removeCategory = (cat: string) => {
		setForm((f) => ({
			...f,
			categories: f.categories.filter((c) => c !== cat),
		}));
	};

	const displayName = `${form.firstName} ${form.lastName}`.trim() || user.name;

	function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		setPhotoError(null);
		uploadProfileImageMutation.mutate(file, {
			onSuccess: () => {
				if (photoInputRef.current) photoInputRef.current.value = "";
			},
			onError: (err) => {
				setPhotoError(
					err instanceof Error
						? err.message
						: t("producerProfileCert.errorGeneric"),
				);
			},
		});
	}

	const openPhotoPicker = () => {
		setPhotoError(null);
		photoInputRef.current?.click();
	};

	const photoUploading = uploadProfileImageMutation.isPending;
	const photoDisplayError =
		photoError ??
		(uploadProfileImageMutation.isError &&
		uploadProfileImageMutation.error instanceof Error
			? uploadProfileImageMutation.error.message
			: null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (submitting) return;
		if (
			!form.firstName ||
			!form.lastName ||
			!form.phone ||
			!form.entityType ||
			!form.entityName ||
			!form.region ||
			!form.city
		) {
			setError(t("producerProfileCert.errorRequiredFields"));
			return;
		}
		if (form.categories.length === 0) {
			setError(t("producerProfileCert.errorSelectCategory"));
			return;
		}
		if (!form.agreeTerms) {
			setError(t("producerProfileCert.errorAgreeTerms"));
			return;
		}
		setError(null);
		setSubmitting(true);
		try {
			await upsertProfile(form);
			router.push("/artisan/profile");
			router.refresh();
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: t("producerProfileCert.errorGenericRetry"),
			);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<Link
					className="font-sans text-sm text-text-muted transition-colors hover:text-text-dark"
					href="/artisan/profile"
				>
					← {t("producerProfileCert.backToProfile")}
				</Link>
			</div>

			<ProfileHeaderCard
				displayName={displayName}
				entityName={form.entityName}
				entityType={form.entityType}
				memberSince={memberSince}
				profileImage={profile.profileImage}
				publicTagline={form.publicTagline}
				region={form.region}
			/>

			<form className="contents" onSubmit={handleSubmit}>
				<div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
					<div className="flex flex-col gap-4">
						{/* Personal Information */}
						<div className="overflow-hidden rounded-sm" style={cardStyle}>
							<div className="border-b px-5 py-4" style={cardHeaderBorder}>
								<h3 className="font-bold font-serif text-[15px] text-text-dark">
									{t("producerProfileCert.personalInfoTitle")}
								</h3>
								<p className="mt-0.5 font-sans text-[11px] text-text-muted">
									{t("producerProfileCert.personalInfoSubtitle")}
								</p>
							</div>
							<div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
								<div className="flex flex-wrap items-end gap-4 sm:col-span-2">
									<div className="flex flex-col gap-1.5">
										<span className={labelClassName}>
											{t("producerProfileCert.profilePicture")}
										</span>
										<div className="flex items-center gap-4">
											<Avatar
												displayName={displayName}
												imageUrl={profile.profileImage}
												size="lg"
												variant="header"
											/>
											<div className="flex flex-col gap-1">
												<input
													accept="image/jpeg,image/png,image/webp"
													className="hidden"
													disabled={photoUploading}
													onChange={handlePhotoChange}
													ref={photoInputRef}
													type="file"
												/>
												<button
													className="w-fit rounded-sm px-4 py-2 font-medium font-sans text-sm transition-colors disabled:opacity-50"
													disabled={photoUploading}
													onClick={openPhotoPicker}
													style={{
														background: "var(--color-paper)",
														color: "var(--color-ink)",
														border: "1px solid var(--color-cream-dark)",
													}}
													type="button"
												>
													{photoUploading
														? t("producerProfileCert.uploading")
														: t("producerProfileCert.changePhoto")}
												</button>
												{photoDisplayError && (
													<p
														className="max-w-xs font-sans text-red-600 text-xs"
														role="alert"
													>
														{photoDisplayError}
													</p>
												)}
											</div>
										</div>
									</div>
								</div>
								<div>
									<label className={labelClassName} htmlFor="firstName">
										{t("producerProfileCert.firstName")}
									</label>
									<input
										className={inputClassName}
										id="firstName"
										onChange={(e) => set("firstName")(e.target.value)}
										placeholder="Rida"
										style={fieldStyle}
										type="text"
										value={form.firstName}
									/>
								</div>
								<div>
									<label className={labelClassName} htmlFor="lastName">
										{t("producerProfileCert.lastName")}
									</label>
									<input
										className={inputClassName}
										id="lastName"
										onChange={(e) => set("lastName")(e.target.value)}
										placeholder="Elmazary"
										style={fieldStyle}
										type="text"
										value={form.lastName}
									/>
								</div>
								<div>
									<label className={labelClassName}>
										{t("producerProfileCert.emailAddress")}
									</label>
									<div
										className="rounded-sm px-3.5 py-2.5 font-sans text-sm text-text-dark"
										style={fieldStyle}
									>
										{user.email}
									</div>
								</div>
								<div>
									<label className={labelClassName} htmlFor="phone">
										{t("producerProfileCert.phoneNumber")}
									</label>
									<input
										className={inputClassName}
										id="phone"
										onChange={(e) => set("phone")(e.target.value)}
										placeholder="+212 6XX XXX XXX"
										style={fieldStyle}
										type="tel"
										value={form.phone}
									/>
								</div>
							</div>
						</div>

						{/* Business Information */}
						<div className="overflow-hidden rounded-sm" style={cardStyle}>
							<div className="border-b px-5 py-4" style={cardHeaderBorder}>
								<h3 className="font-bold font-serif text-[15px] text-text-dark">
									{t("producerProfileCert.businessInfoTitle")}
								</h3>
								<p className="mt-0.5 font-sans text-[11px] text-text-muted">
									{t("producerProfileCert.businessInfoSubtitle")}
								</p>
							</div>
							<div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
								<div>
									<label className={labelClassName} htmlFor="entityType">
										{t("producerProfileCert.entityType")}
									</label>
									<input
										className={inputClassName}
										id="entityType"
										list="entity-type-suggestions"
										onChange={(e) => set("entityType")(e.target.value)}
										placeholder={t("producerProfileCert.selectEntityType")}
										style={fieldStyle}
										type="text"
										value={form.entityType}
									/>
									<datalist id="entity-type-suggestions">
										{ENTITY_TYPES.map((opt) => (
											<option key={opt} value={opt} />
										))}
									</datalist>
								</div>
								<div>
									<label className={labelClassName} htmlFor="entityName">
										{t("producerProfileCert.entityName")}
									</label>
									<input
										className={inputClassName}
										id="entityName"
										onChange={(e) => set("entityName")(e.target.value)}
										placeholder="Laboratoire Al Atlas"
										style={fieldStyle}
										type="text"
										value={form.entityName}
									/>
								</div>
								<div>
									<label
										className={labelClassName}
										htmlFor="registrationNumber"
									>
										{t("producerProfileCert.registrationNumber")}
									</label>
									<input
										className={inputClassName}
										id="registrationNumber"
										onChange={(e) => set("registrationNumber")(e.target.value)}
										placeholder="RC-XXXX-MA-XXXXX"
										style={fieldStyle}
										type="text"
										value={form.registrationNumber}
									/>
								</div>
								<div>
									<label className={labelClassName} htmlFor="region">
										{t("producerProfileCert.region")}
									</label>
									<input
										className={inputClassName}
										id="region"
										list="region-suggestions"
										onChange={(e) => set("region")(e.target.value)}
										placeholder={t("producerProfileCert.selectRegion")}
										style={fieldStyle}
										type="text"
										value={form.region}
									/>
									<datalist id="region-suggestions">
										{MOROCCAN_REGIONS.map((r) => (
											<option key={r} value={r} />
										))}
									</datalist>
								</div>
								<div>
									<label className={labelClassName} htmlFor="city">
										{t("producerProfileCert.city")}
									</label>
									<input
										className={inputClassName}
										id="city"
										onChange={(e) => set("city")(e.target.value)}
										placeholder="Taliouine"
										style={fieldStyle}
										type="text"
										value={form.city}
									/>
								</div>
								<div>
									<label className={labelClassName} htmlFor="yearEstablished">
										{t("producerProfileCert.yearEstablished")}
									</label>
									<input
										className={inputClassName}
										id="yearEstablished"
										onChange={(e) => set("yearEstablished")(e.target.value)}
										placeholder="2018"
										style={fieldStyle}
										type="text"
										value={form.yearEstablished}
									/>
								</div>
								<div className="sm:col-span-2">
									<label className={labelClassName} htmlFor="website">
										{t("producerProfileCert.website")}
									</label>
									<input
										className={inputClassName}
										id="website"
										onChange={(e) => set("website")(e.target.value)}
										placeholder="www.example.ma"
										style={fieldStyle}
										type="url"
										value={form.website}
									/>
								</div>
								<div className="sm:col-span-2">
									<p className={labelClassName}>
										{t("producerProfileCert.primaryProducts")}
									</p>
									<p className="mb-2 font-sans text-[11px] text-text-muted">
										{t("producerProfileCert.primaryProductsHint")}
									</p>
									{form.categories.length > 0 && (
										<div className="mb-2 flex flex-wrap gap-2">
											{form.categories.map((cat) => (
												<span
													className="inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 font-sans font-semibold text-[12px]"
													key={cat}
													style={{
														background: "var(--color-ink)",
														color: "var(--color-paper)",
													}}
												>
													{cat}
													<button
														aria-label={t("producerProfileCert.remove")}
														className="leading-none opacity-70 hover:opacity-100"
														onClick={() => removeCategory(cat)}
														type="button"
													>
														×
													</button>
												</span>
											))}
										</div>
									)}
									<div className="flex gap-2">
										<input
											className={inputClassName}
											list="cosmetics-category-suggestions"
											onChange={(e) => setCategoryInput(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													addCategory(categoryInput);
												}
											}}
											placeholder={t(
												"producerProfileCert.addCategoryPlaceholder",
											)}
											style={fieldStyle}
											type="text"
											value={categoryInput}
										/>
										<button
											className="shrink-0 rounded-sm px-4 py-2 font-sans font-semibold text-[12px] text-white"
											onClick={() => addCategory(categoryInput)}
											style={{ background: "var(--color-ink)" }}
											type="button"
										>
											{t("producerProfileCert.add")}
										</button>
									</div>
									<datalist id="cosmetics-category-suggestions">
										{COSMETICS_CATEGORY_SUGGESTIONS.map((c) => (
											<option key={c} value={c} />
										))}
									</datalist>
								</div>
								<div>
									<label className={labelClassName} htmlFor="annualCapacity">
										{t("producerProfileCert.annualCapacity")}
									</label>
									<input
										className={inputClassName}
										id="annualCapacity"
										onChange={(e) => set("annualCapacity")(e.target.value)}
										style={fieldStyle}
										type="text"
										value={form.annualCapacity}
									/>
								</div>
								<div>
									<label className={labelClassName} htmlFor="exportExperience">
										{t("producerProfileCert.exportExperience")}
									</label>
									<input
										className={inputClassName}
										id="exportExperience"
										list="export-experience-suggestions"
										onChange={(e) => set("exportExperience")(e.target.value)}
										placeholder={t("producerProfileCert.select")}
										style={fieldStyle}
										type="text"
										value={form.exportExperience}
									/>
									<datalist id="export-experience-suggestions">
										{EXPORT_EXPERIENCE_OPTIONS.map((o) => (
											<option key={o} value={o} />
										))}
									</datalist>
								</div>
							</div>
						</div>

						<div className="overflow-hidden rounded-sm" style={cardStyle}>
							<div className="border-b px-5 py-4" style={cardHeaderBorder}>
								<h3 className="font-bold font-serif text-[15px] text-text-dark">
									{t("producerProfileCert.publicProfileTitle")}
								</h3>
								<p className="mt-0.5 font-sans text-[11px] text-text-muted">
									{t("producerProfileCert.publicProfileSubtitle")}
								</p>
							</div>
							<div className="flex flex-col gap-4 p-5">
								<div>
									<label className={labelClassName} htmlFor="publicTagline">
										{t("producerProfileCert.headline")}
									</label>
									<input
										className={inputClassName}
										id="publicTagline"
										maxLength={200}
										onChange={(e) => set("publicTagline")(e.target.value)}
										placeholder={t("producerProfileCert.headlinePlaceholder")}
										style={fieldStyle}
										type="text"
										value={form.publicTagline}
									/>
								</div>
								<div>
									<label
										className={labelClassName}
										htmlFor="businessDescription"
									>
										{t("producerProfileCert.aboutBusiness")}
									</label>
									<textarea
										className={`${inputClassName} min-h-[120px] resize-y`}
										id="businessDescription"
										maxLength={8000}
										onChange={(e) => set("businessDescription")(e.target.value)}
										placeholder={t(
											"producerProfileCert.aboutBusinessPlaceholder",
										)}
										rows={6}
										style={fieldStyle}
										value={form.businessDescription}
									/>
								</div>
								<div>
									<label className={labelClassName} htmlFor="exportMarkets">
										{t("producerProfileCert.targetExportMarkets")}
									</label>
									<input
										className={inputClassName}
										id="exportMarkets"
										maxLength={500}
										onChange={(e) => set("exportMarkets")(e.target.value)}
										placeholder={t(
											"producerProfileCert.exportMarketsPlaceholder",
										)}
										style={fieldStyle}
										type="text"
										value={form.exportMarkets}
									/>
								</div>
								<div>
									<label className={labelClassName} htmlFor="valuesHighlight">
										{t("producerProfileCert.valuesPractices")}
									</label>
									<input
										className={inputClassName}
										id="valuesHighlight"
										maxLength={600}
										onChange={(e) => set("valuesHighlight")(e.target.value)}
										placeholder={t(
											"producerProfileCert.valuesPracticesPlaceholder",
										)}
										style={fieldStyle}
										type="text"
										value={form.valuesHighlight}
									/>
								</div>
							</div>
						</div>

						{error && (
							<div
								className="rounded-sm px-4 py-3 font-sans text-red-600 text-sm"
								style={{
									background:
										"color-mix(in srgb, var(--color-danger) 10%, transparent)",
									border:
										"1px solid color-mix(in srgb, var(--color-danger) 25%, transparent)",
								}}
							>
								{error}
							</div>
						)}

						<button
							className="w-fit rounded-sm px-8 py-3 font-sans font-semibold text-sm transition-colors disabled:opacity-60"
							disabled={submitting}
							style={{
								background: "var(--color-ink)",
								color: "var(--color-paper)",
								border: "1px solid var(--color-ink)",
							}}
							type="submit"
						>
							{submitting
								? t("producerProfileCert.saving")
								: t("producerProfileCert.saveChanges")}
						</button>
					</div>

					<ProfileSideCards partnerId={partnerId} partnerSince={memberSince} />
				</div>
			</form>
		</div>
	);
}
