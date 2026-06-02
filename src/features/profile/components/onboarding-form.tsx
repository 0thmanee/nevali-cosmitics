"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import {
	COSMETICS_CATEGORY_SUGGESTIONS,
	completeOnboardingAndGetRedirect,
	ENTITY_TYPES,
	EXPORT_EXPERIENCE_OPTIONS,
	INITIAL_ONBOARDING_FORM,
	MOROCCAN_REGIONS,
	ONBOARDING_STEPS,
	type OnboardingFormData,
	upsertProfile,
} from "~/features/profile";

const set =
	(key: keyof OnboardingFormData) =>
	(value: string | boolean | string[]) =>
	(prev: OnboardingFormData) => ({ ...prev, [key]: value });

/* ── Design tokens ── */
const labelCls =
	"font-sans text-[10px] font-bold tracking-[0.16em] text-text-muted uppercase";
const inputCls =
	"font-sans text-[14px] text-text-dark bg-transparent border-0 border-b border-[color-mix(in srgb, var(--color-cream-dark) 75%, var(--color-paper))] rounded-none px-0 py-2 outline-none w-full transition-colors placeholder:text-[var(--color-muted-light)] focus:border-[var(--color-ink)]";

function Field({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1">
			<label className={labelCls}>{label}</label>
			{children}
		</div>
	);
}

function Checkbox({
	checked,
	onToggle,
}: {
	checked: boolean;
	onToggle: () => void;
}) {
	return (
		<div
			aria-checked={checked}
			className="mt-0.5 flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center transition-colors"
			onClick={onToggle}
			onKeyDown={(e) => e.key === "Enter" && onToggle()}
			role="checkbox"
			style={
				checked
					? {
							background: "var(--color-ink)",
							border: "1.5px solid var(--color-ink)",
							borderRadius: "2px",
						}
					: {
							background: "var(--color-paper)",
							border:
								"1.5px solid color-mix(in srgb, var(--color-cream-dark) 75%, var(--color-paper))",
							borderRadius: "2px",
						}
			}
			tabIndex={0}
		>
			{checked && (
				<svg
					fill="none"
					height="8"
					stroke="white"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="1.5"
					viewBox="0 0 10 10"
					width="8"
				>
					<path d="M2 5l2 2 4-4" />
				</svg>
			)}
		</div>
	);
}

export function OnboardingForm({
	initialData,
	mode = "onboarding",
}: {
	initialData?: Partial<OnboardingFormData>;
	mode?: "onboarding" | "edit";
}) {
	const { t } = useI18n();
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [form, setForm] = useState<OnboardingFormData>({
		...INITIAL_ONBOARDING_FORM,
		...initialData,
	});
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const isEdit = mode === "edit";

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

	const canNext = () => {
		if (step === 1)
			return Boolean(
				form.firstName &&
					form.lastName &&
					form.phone &&
					form.entityType &&
					form.entityName &&
					form.region,
			);
		if (step === 2) return form.categories.length > 0;
		if (step === 3) return form.agreeTerms;
		return false;
	};

	async function handleSubmit() {
		if (!canNext() || submitting) return;
		setSubmitError(null);
		setSubmitting(true);
		try {
			if (isEdit) {
				await upsertProfile(form);
				router.push("/artisan/profile");
				router.refresh();
			} else {
				const { redirectTo } = await completeOnboardingAndGetRedirect(form);
				router.push(redirectTo);
				router.refresh();
			}
		} catch (e) {
			setSubmitError(
				e instanceof Error ? e.message : t("onboardingForm.errorGeneric"),
			);
		} finally {
			setSubmitting(false);
		}
	}

	const totalSteps = ONBOARDING_STEPS.length;

	const stepMeta = [
		{
			heading: t("onboardingForm.step1Heading"),
			sub: t("onboardingForm.step1Sub"),
		},
		{
			heading: t("onboardingForm.step2Heading"),
			sub: t("onboardingForm.step2Sub"),
		},
		{
			heading: t("onboardingForm.step3Heading"),
			sub: t("onboardingForm.step3Sub"),
		},
	];

	/* ── Form panels ── */
	const step1Fields = (
		<div className="flex flex-col gap-4">
			<div className="grid grid-cols-2 gap-5">
				<Field label={t("onboardingForm.firstName")}>
					<input
						className={inputCls}
						onChange={(e) => setForm(set("firstName")(e.target.value))}
						placeholder={t("onboardingForm.firstNamePlaceholder")}
						value={form.firstName}
					/>
				</Field>
				<Field label={t("onboardingForm.lastName")}>
					<input
						className={inputCls}
						onChange={(e) => setForm(set("lastName")(e.target.value))}
						placeholder={t("onboardingForm.lastNamePlaceholder")}
						value={form.lastName}
					/>
				</Field>
			</div>
			<Field label={t("onboardingForm.phone")}>
				<input
					className={inputCls}
					onChange={(e) => setForm(set("phone")(e.target.value))}
					placeholder={t("onboardingForm.phonePlaceholder")}
					type="tel"
					value={form.phone}
				/>
			</Field>
			<div className="grid grid-cols-2 gap-5">
				<Field label={t("onboardingForm.entityType")}>
					<input
						className={inputCls}
						list="ob-entity-type"
						onChange={(e) => setForm(set("entityType")(e.target.value))}
						placeholder={t("onboardingForm.selectType")}
						type="text"
						value={form.entityType}
					/>
					<datalist id="ob-entity-type">
						{ENTITY_TYPES.map((opt) => (
							<option key={opt} value={opt} />
						))}
					</datalist>
				</Field>
				<Field label={t("onboardingForm.entityName")}>
					<input
						className={inputCls}
						onChange={(e) => setForm(set("entityName")(e.target.value))}
						placeholder={t("onboardingForm.entityNamePlaceholder")}
						value={form.entityName}
					/>
				</Field>
			</div>
			<Field label={t("onboardingForm.registrationNumber")}>
				<input
					className={inputCls}
					onChange={(e) => setForm(set("registrationNumber")(e.target.value))}
					placeholder={t("onboardingForm.registrationNumberPlaceholder")}
					value={form.registrationNumber}
				/>
			</Field>
			<div className="grid grid-cols-2 gap-5">
				<Field label={t("onboardingForm.region")}>
					<input
						className={inputCls}
						list="ob-region"
						onChange={(e) => setForm(set("region")(e.target.value))}
						placeholder={t("onboardingForm.selectRegion")}
						type="text"
						value={form.region}
					/>
					<datalist id="ob-region">
						{MOROCCAN_REGIONS.map((r) => (
							<option key={r} value={r} />
						))}
					</datalist>
				</Field>
				<Field label={t("onboardingForm.city")}>
					<input
						className={inputCls}
						onChange={(e) => setForm(set("city")(e.target.value))}
						placeholder={t("onboardingForm.cityPlaceholder")}
						value={form.city}
					/>
				</Field>
			</div>
			<div className="grid grid-cols-2 gap-5">
				<Field label={t("onboardingForm.yearEstablished")}>
					<input
						className={inputCls}
						onChange={(e) => setForm(set("yearEstablished")(e.target.value))}
						placeholder={t("onboardingForm.yearEstablishedPlaceholder")}
						value={form.yearEstablished}
					/>
				</Field>
				<Field label={t("onboardingForm.websiteOptional")}>
					<input
						className={inputCls}
						onChange={(e) => setForm(set("website")(e.target.value))}
						placeholder={t("onboardingForm.websitePlaceholder")}
						value={form.website}
					/>
				</Field>
			</div>
		</div>
	);

	const step2Fields = (
		<div className="flex flex-col gap-5">
			<div>
				<p className={labelCls + "mb-3"}>
					{t("onboardingForm.productCategories")}
				</p>
				{form.categories.length > 0 && (
					<div className="mb-2 flex flex-wrap gap-2">
						{form.categories.map((cat) => (
							<span
								className="inline-flex items-center gap-1.5 px-3 py-1.5 font-medium font-sans text-[11px]"
								key={cat}
								style={{
									background: "var(--color-ink)",
									color: "var(--color-paper)",
									borderRadius: "2px",
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
						className={inputCls}
						list="ob-categories"
						onChange={(e) => setCategoryInput(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								addCategory(categoryInput);
							}
						}}
						placeholder={t("producerProfileCert.addCategoryPlaceholder")}
						type="text"
						value={categoryInput}
					/>
					<button
						className="shrink-0 px-4 py-1.5 font-medium font-sans text-[11px] text-white"
						onClick={() => addCategory(categoryInput)}
						style={{ background: "var(--color-ink)", borderRadius: "2px" }}
						type="button"
					>
						{t("producerProfileCert.add")}
					</button>
				</div>
				<datalist id="ob-categories">
					{COSMETICS_CATEGORY_SUGGESTIONS.map((c) => (
						<option key={c} value={c} />
					))}
				</datalist>
				{form.categories.length === 0 && (
					<p className="mt-2 font-sans text-[11px] text-text-muted/50">
						{t("onboardingForm.selectAtLeastOne")}
					</p>
				)}
			</div>
			<Field label={t("onboardingForm.annualCapacity")}>
				<input
					className={inputCls}
					onChange={(e) => setForm(set("annualCapacity")(e.target.value))}
					placeholder={t("onboardingForm.annualCapacityPlaceholder")}
					value={form.annualCapacity}
				/>
			</Field>
			<Field label={t("onboardingForm.exportExperience")}>
				<input
					className={inputCls}
					list="ob-export-experience"
					onChange={(e) => setForm(set("exportExperience")(e.target.value))}
					placeholder={t("onboardingForm.selectExperienceLevel")}
					type="text"
					value={form.exportExperience}
				/>
				<datalist id="ob-export-experience">
					{EXPORT_EXPERIENCE_OPTIONS.map((o) => (
						<option key={o} value={o} />
					))}
				</datalist>
			</Field>
		</div>
	);

	const step3Fields = (
		<div className="flex flex-col gap-4">
			{/* Business card */}
			<div
				className="overflow-hidden rounded-sm"
				style={{ border: "1px solid var(--color-cream-dark)" }}
			>
				<div
					className="flex items-center justify-between border-cream-dark border-b px-4 py-2.5"
					style={{
						background:
							"color-mix(in srgb, var(--color-cream-dark) 55%, var(--color-paper))",
					}}
				>
					<span className={labelCls}>Brand &amp; studio</span>
					<button
						className="font-sans text-[11px] hover:underline"
						onClick={() => setStep(1)}
						style={{ color: "var(--color-ink)" }}
						type="button"
					>
						{t("onboardingForm.edit")}
					</button>
				</div>
				<div
					className="grid grid-cols-2 gap-3 px-4 py-3"
					style={{ background: "var(--color-cream)" }}
				>
					{[
						{
							label: t("onboardingForm.summaryName"),
							value: `${form.firstName} ${form.lastName}`.trim(),
						},
						{
							label: t("onboardingForm.summaryEntity"),
							value: form.entityName,
						},
						{ label: t("onboardingForm.summaryType"), value: form.entityType },
						{ label: t("onboardingForm.summaryRegion"), value: form.region },
						{ label: t("onboardingForm.summaryPhone"), value: form.phone },
					].map((r) => (
						<div key={r.label}>
							<p className="font-sans text-[10px] text-text-muted uppercase tracking-wider">
								{r.label}
							</p>
							<p className="mt-0.5 font-sans text-sm text-text-dark">
								{r.value || t("common.dash")}
							</p>
						</div>
					))}
				</div>
			</div>

			{/* Categories card */}
			<div
				className="overflow-hidden rounded-sm"
				style={{ border: "1px solid var(--color-cream-dark)" }}
			>
				<div
					className="flex items-center justify-between border-cream-dark border-b px-4 py-2.5"
					style={{
						background:
							"color-mix(in srgb, var(--color-cream-dark) 55%, var(--color-paper))",
					}}
				>
					<span className={labelCls}>{t("onboardingForm.categories")}</span>
					<button
						className="font-sans text-[11px] hover:underline"
						onClick={() => setStep(2)}
						style={{ color: "var(--color-ink)" }}
						type="button"
					>
						{t("onboardingForm.edit")}
					</button>
				</div>
				<div
					className="flex flex-wrap gap-1.5 px-4 py-3"
					style={{ background: "var(--color-cream)" }}
				>
					{form.categories.map((c) => (
						<span
							className="px-2.5 py-0.5 font-medium font-sans text-[11px]"
							key={c}
							style={{
								background:
									"color-mix(in srgb, var(--color-ink) 8%, transparent)",
								color: "var(--color-ink)",
								border:
									"1px solid color-mix(in srgb, var(--color-ink) 15%, transparent)",
								borderRadius: "2px",
							}}
						>
							{c}
						</span>
					))}
				</div>
			</div>

			{/* Agreements */}
			<div className="flex flex-col gap-3 pt-1">
				<label className="flex cursor-pointer items-start gap-2.5">
					<Checkbox
						checked={form.agreeTerms}
						onToggle={() => setForm(set("agreeTerms")(!form.agreeTerms))}
					/>
					<span className="font-sans text-[12px] text-text-muted leading-relaxed">
						{t("onboardingForm.agreeTerms")}{" "}
						<span style={{ color: "var(--color-ink)" }}>*</span>
					</span>
				</label>
				<label className="flex cursor-pointer items-start gap-2.5">
					<Checkbox
						checked={form.agreeMarketing}
						onToggle={() =>
							setForm(set("agreeMarketing")(!form.agreeMarketing))
						}
					/>
					<span className="font-sans text-[12px] text-text-muted leading-relaxed">
						{t("onboardingForm.agreeMarketing")}
					</span>
				</label>
			</div>

			{submitError && (
				<div
					className="rounded-sm px-4 py-3 font-sans text-sm"
					style={{
						background:
							"color-mix(in srgb, var(--color-danger-dark) 8%, transparent)",
						border:
							"1px solid color-mix(in srgb, var(--color-danger-dark) 20%, transparent)",
						color: "var(--color-danger-dark)",
					}}
				>
					{submitError}
				</div>
			)}
		</div>
	);

	const stepFields = [step1Fields, step2Fields, step3Fields][step - 1];

	/* ── Edit mode ── */
	if (isEdit) {
		return (
			<div className="p-4 lg:p-6">
				<div className="mx-auto max-w-xl">
					<Link
						className="font-sans text-sm text-text-muted transition-colors hover:text-text-dark"
						href="/artisan/profile"
					>
						{t("onboardingForm.backToProfile")}
					</Link>
					<h1 className="mt-3 mb-1 font-bold font-serif text-[28px] text-text-dark leading-tight">
						{t("onboardingForm.editProfileTitle")}
					</h1>
					<p className="mb-8 font-sans text-sm text-text-muted">
						{t("onboardingForm.editProfileSubtitle")}
					</p>
					<div className="mb-8 flex gap-0 border-cream-dark border-b">
						{ONBOARDING_STEPS.map((s) => (
							<button
								className="px-5 py-3 font-sans font-semibold text-[11px] uppercase tracking-wider transition-colors"
								key={s.number}
								onClick={() => setStep(s.number)}
								style={{
									color:
										step === s.number
											? "var(--color-ink)"
											: "var(--color-text-muted)",
									borderBottom:
										step === s.number
											? "2px solid var(--color-ink)"
											: "2px solid transparent",
									marginBottom: "-1px",
								}}
								type="button"
							>
								{s.label}
							</button>
						))}
					</div>
					{stepFields}
					<div className="mt-8 flex items-center justify-between">
						{step > 1 ? (
							<button
								className="font-sans text-sm text-text-muted hover:text-text-dark"
								onClick={() => setStep(step - 1)}
								type="button"
							>
								{t("onboardingForm.back")}
							</button>
						) : (
							<span />
						)}
						{step < totalSteps ? (
							<button
								className="rounded-sm px-7 py-2.5 font-sans font-semibold text-sm disabled:cursor-not-allowed"
								disabled={!canNext()}
								onClick={() => canNext() && setStep(step + 1)}
								style={
									canNext()
										? {
												background: "var(--color-ink)",
												color: "var(--color-paper)",
											}
										: {
												background:
													"color-mix(in srgb, var(--color-ink) 12%, transparent)",
												color:
													"color-mix(in srgb, var(--color-ink) 35%, transparent)",
											}
								}
								type="button"
							>
								{t("onboardingForm.continue")}
							</button>
						) : (
							<button
								className="rounded-sm px-7 py-2.5 font-sans font-semibold text-sm disabled:cursor-not-allowed"
								disabled={!canNext() || submitting}
								onClick={handleSubmit}
								style={
									canNext() && !submitting
										? {
												background: "var(--color-ink)",
												color: "var(--color-paper)",
											}
										: {
												background:
													"color-mix(in srgb, var(--color-ink) 12%, transparent)",
												color:
													"color-mix(in srgb, var(--color-ink) 35%, transparent)",
											}
								}
								type="button"
							>
								{submitting
									? t("onboardingForm.saving")
									: t("onboardingForm.saveChanges")}
							</button>
						)}
					</div>
				</div>
			</div>
		);
	}

	/* ── Onboarding: full-page, no-scroll, two-panel ── */
	return (
		<div
			className="flex h-screen flex-col overflow-hidden"
			style={{ background: "var(--color-paper)" }}
		>
			{/* Top bar */}
			<div
				className="flex shrink-0 items-center justify-between px-8 py-4"
				style={{ borderBottom: "1px solid var(--color-cream-dark)" }}
			>
				<Link
					className="font-bold font-display text-[16px] text-text-dark uppercase tracking-wide"
					href="/"
				>
					nevali
				</Link>
				<div className="flex items-center gap-3">
					{ONBOARDING_STEPS.map((s, i) => (
						<React.Fragment key={s.number}>
							<div className="flex items-center gap-2">
								<div
									className="shrink-0 rounded-full transition-all duration-300"
									style={{
										width: step === s.number ? "7px" : "5px",
										height: step === s.number ? "7px" : "5px",
										background:
											step >= s.number
												? "var(--color-ink)"
												: "color-mix(in srgb, var(--color-cream-dark) 75%, var(--color-paper))",
									}}
								/>
								<span
									className="hidden font-sans text-[10px] uppercase tracking-widest sm:block"
									style={{
										color:
											step === s.number
												? "var(--color-ink)"
												: "var(--color-text-muted)",
										fontWeight: step === s.number ? 700 : 400,
									}}
								>
									{s.label}
								</span>
							</div>
							{i < ONBOARDING_STEPS.length - 1 && (
								<div
									className="hidden h-px w-6 sm:block"
									style={{ background: "var(--color-cream-dark)" }}
								/>
							)}
						</React.Fragment>
					))}
				</div>
			</div>

			{/* Progress bar */}
			<div
				className="h-px w-full shrink-0"
				style={{ background: "var(--color-cream-dark)" }}
			>
				<div
					className="h-full transition-all duration-500"
					style={{
						width: `${(step / totalSteps) * 100}%`,
						background: "var(--color-ink)",
					}}
				/>
			</div>

			{/* Two-panel content */}
			<div className="flex flex-1 overflow-hidden">
				{/* Left: step context */}
				<div
					className="flex w-64 shrink-0 flex-col justify-center px-10 py-8"
					style={{ borderRight: "1px solid var(--color-cream-dark)" }}
				>
					<span
						className="mb-3 font-bold font-sans text-[10px] uppercase tracking-[0.2em]"
						style={{ color: "var(--color-text-muted)" }}
					>
						{t("onboardingForm.stepOf", { step, total: totalSteps })}
					</span>
					<h1 className="mb-3 font-bold font-serif text-[32px] text-text-dark leading-[1.05]">
						{stepMeta[step - 1]!.heading}
					</h1>
					<p className="font-sans text-[13px] text-text-muted leading-relaxed">
						{stepMeta[step - 1]!.sub}
					</p>

					{/* Step dots */}
					<div className="mt-10 flex flex-col gap-2">
						{ONBOARDING_STEPS.map((s) => (
							<div className="flex items-center gap-2.5" key={s.number}>
								<div
									className="h-1.5 w-1.5 shrink-0 rounded-full transition-all"
									style={{
										background:
											step >= s.number
												? "var(--color-ink)"
												: "color-mix(in srgb, var(--color-cream-dark) 75%, var(--color-paper))",
									}}
								/>
								<span
									className="font-sans text-[11px] uppercase tracking-wider"
									style={{
										color:
											step === s.number
												? "var(--color-ink)"
												: "var(--color-muted-light)",
										fontWeight: step === s.number ? 700 : 400,
									}}
								>
									{s.label}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Right: form */}
				<div className="flex flex-1 flex-col justify-center overflow-y-auto px-12 py-8">
					<div className="mx-auto w-full max-w-lg">{stepFields}</div>
				</div>
			</div>

			{/* Bottom nav */}
			<div
				className="flex shrink-0 items-center justify-between px-8 py-4"
				style={{
					borderTop: "1px solid var(--color-cream-dark)",
					background: "var(--color-paper)",
				}}
			>
				{step > 1 ? (
					<button
						className="font-sans text-sm text-text-muted transition-colors hover:text-text-dark"
						onClick={() => setStep(step - 1)}
						type="button"
					>
						{t("onboardingForm.back")}
					</button>
				) : (
					<Link
						className="font-sans text-sm text-text-muted transition-colors hover:text-text-dark"
						href="/"
					>
						{t("onboardingForm.backHome")}
					</Link>
				)}

				{step < totalSteps ? (
					<button
						className="rounded-sm px-8 py-2.5 font-sans font-semibold text-sm transition-all disabled:cursor-not-allowed"
						disabled={!canNext()}
						onClick={() => canNext() && setStep(step + 1)}
						style={
							canNext()
								? {
										background: "var(--color-ink)",
										color: "var(--color-paper)",
									}
								: {
										background:
											"color-mix(in srgb, var(--color-ink) 12%, transparent)",
										color:
											"color-mix(in srgb, var(--color-ink) 35%, transparent)",
									}
						}
						type="button"
					>
						{t("onboardingForm.continue")}
					</button>
				) : (
					<button
						className="rounded-sm px-8 py-2.5 font-sans font-semibold text-sm transition-all disabled:cursor-not-allowed"
						disabled={!canNext() || submitting}
						onClick={handleSubmit}
						style={
							canNext() && !submitting
								? {
										background: "var(--color-ink)",
										color: "var(--color-paper)",
									}
								: {
										background:
											"color-mix(in srgb, var(--color-ink) 12%, transparent)",
										color:
											"color-mix(in srgb, var(--color-ink) 35%, transparent)",
									}
						}
						type="button"
					>
						{submitting
							? t("onboardingForm.saving")
							: t("onboardingForm.completeProfile")}
					</button>
				)}
			</div>
		</div>
	);
}
