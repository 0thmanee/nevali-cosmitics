"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ONBOARDING_STEPS,
  MOROCCAN_REGIONS,
  PRODUCT_CATEGORIES,
  ENTITY_TYPES,
  EXPORT_EXPERIENCE_OPTIONS,
  INITIAL_ONBOARDING_FORM,
  completeOnboardingAndGetRedirect,
  upsertProfile,
  type OnboardingFormData,
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
const selectCls = inputCls + " appearance-none cursor-pointer";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function Checkbox({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <div
      className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-colors"
      style={
        checked
          ? { background: "var(--color-ink)", border: "1.5px solid var(--color-ink)", borderRadius: "2px" }
          : { background: "var(--color-paper)", border: "1.5px solid color-mix(in srgb, var(--color-cream-dark) 75%, var(--color-paper))", borderRadius: "2px" }
      }
      onClick={onToggle}
      onKeyDown={(e) => e.key === "Enter" && onToggle()}
      role="checkbox"
      tabIndex={0}
      aria-checked={checked}
    >
      {checked && (
        <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<OnboardingFormData>({
    ...INITIAL_ONBOARDING_FORM,
    ...initialData,
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isEdit = mode === "edit";

  const toggleCategory = (cat: string) => {
    setForm((f) =>
      f.categories.includes(cat)
        ? { ...f, categories: f.categories.filter((c) => c !== cat) }
        : { ...f, categories: [...f.categories, cat] }
    );
  };

  const canNext = () => {
    if (step === 1)
      return Boolean(
        form.firstName && form.lastName && form.phone &&
        form.entityType && form.entityName && form.region
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
      setSubmitError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const totalSteps = ONBOARDING_STEPS.length;

  const stepMeta = [
    {
      heading: "Your brand & studio",
      sub: "Legal and location details for your lab, atelier, or cooperative.",
    },
    {
      heading: "Your product focus",
      sub: "Select the categories you formulate or produce. Add SKUs and imagery after approval.",
    },
    {
      heading: "Review & submit",
      sub: "Confirm your details before joining the platform.",
    },
  ];

  /* ── Form panels ── */
  const step1Fields = (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-5">
        <Field label="First Name">
          <input className={inputCls} placeholder="Rida" value={form.firstName}
            onChange={(e) => setForm(set("firstName")(e.target.value))} />
        </Field>
        <Field label="Last Name">
          <input className={inputCls} placeholder="Elmazary" value={form.lastName}
            onChange={(e) => setForm(set("lastName")(e.target.value))} />
        </Field>
      </div>
      <Field label="Phone Number">
        <input type="tel" className={inputCls} placeholder="+212 6XX XXX XXX"
          value={form.phone} onChange={(e) => setForm(set("phone")(e.target.value))} />
      </Field>
      <div className="grid grid-cols-2 gap-5">
        <Field label="Entity Type">
          <select className={selectCls} value={form.entityType}
            onChange={(e) => setForm(set("entityType")(e.target.value))}>
            <option value="">Select type</option>
            {ENTITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Entity Name">
          <input className={inputCls} placeholder="Maison NEVALI Skincare" value={form.entityName}
            onChange={(e) => setForm(set("entityName")(e.target.value))} />
        </Field>
      </div>
      <Field label="Registration Number (RC / ICE)">
        <input className={inputCls} placeholder="RC-XXXX-MA-XXXXX"
          value={form.registrationNumber}
          onChange={(e) => setForm(set("registrationNumber")(e.target.value))} />
      </Field>
      <div className="grid grid-cols-2 gap-5">
        <Field label="Region">
          <select className={selectCls} value={form.region}
            onChange={(e) => setForm(set("region")(e.target.value))}>
            <option value="">Select region</option>
            {MOROCCAN_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="City">
          <input className={inputCls} placeholder="Taliouine" value={form.city}
            onChange={(e) => setForm(set("city")(e.target.value))} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <Field label="Year Established">
          <input className={inputCls} placeholder="2018" value={form.yearEstablished}
            onChange={(e) => setForm(set("yearEstablished")(e.target.value))} />
        </Field>
        <Field label="Website (optional)">
          <input className={inputCls} placeholder="www.example.ma" value={form.website}
            onChange={(e) => setForm(set("website")(e.target.value))} />
        </Field>
      </div>
    </div>
  );

  const step2Fields = (
    <div className="flex flex-col gap-5">
      <div>
        <p className={labelCls + " mb-3"}>Product categories</p>
        <div className="flex flex-wrap gap-2">
          {PRODUCT_CATEGORIES.map((cat) => {
            const selected = form.categories.includes(cat.label);
            return (
              <button key={cat.label} type="button" onClick={() => toggleCategory(cat.label)}
                className="font-sans text-[11px] font-medium px-3 py-1.5 transition-all"
                style={
                  selected
                    ? { background: "var(--color-ink)", color: "var(--color-paper)", border: "1.5px solid var(--color-ink)", borderRadius: "2px" }
                    : { background: "transparent", color: "var(--color-text-muted)", border: "1.5px solid color-mix(in srgb, var(--color-cream-dark) 75%, var(--color-paper))", borderRadius: "2px" }
                }>
                {selected && "✓ "}{cat.label}
              </button>
            );
          })}
        </div>
        {form.categories.length === 0 && (
          <p className="font-sans text-[11px] text-text-muted/50 mt-2">Select at least one to continue.</p>
        )}
      </div>
      <Field label="Estimated Annual Capacity">
        <input className={inputCls} placeholder="e.g. 50k units / year"
          value={form.annualCapacity} onChange={(e) => setForm(set("annualCapacity")(e.target.value))} />
      </Field>
      <Field label="Export Experience">
        <select className={selectCls} value={form.exportExperience}
          onChange={(e) => setForm(set("exportExperience")(e.target.value))}>
          <option value="">Select experience level</option>
          {EXPORT_EXPERIENCE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </Field>
    </div>
  );

  const step3Fields = (
    <div className="flex flex-col gap-4">
      {/* Business card */}
      <div className="rounded-sm overflow-hidden" style={{ border: "1px solid var(--color-cream-dark)" }}>
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-cream-dark)]" style={{ background: "color-mix(in srgb, var(--color-cream-dark) 55%, var(--color-paper))" }}>
          <span className={labelCls}>Brand &amp; studio</span>
          <button type="button" onClick={() => setStep(1)}
            className="font-sans text-[11px] hover:underline" style={{ color: "var(--color-ink)" }}>
            Edit
          </button>
        </div>
        <div className="px-4 py-3 grid grid-cols-2 gap-3" style={{ background: "var(--color-cream)" }}>
          {[
            { label: "Name", value: `${form.firstName} ${form.lastName}`.trim() },
            { label: "Entity", value: form.entityName },
            { label: "Type", value: form.entityType },
            { label: "Region", value: form.region },
            { label: "Phone", value: form.phone },
          ].map((r) => (
            <div key={r.label}>
              <p className="font-sans text-[10px] text-text-muted uppercase tracking-wider">{r.label}</p>
              <p className="font-sans text-sm text-text-dark mt-0.5">{r.value || "—"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories card */}
      <div className="rounded-sm overflow-hidden" style={{ border: "1px solid var(--color-cream-dark)" }}>
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-cream-dark)]" style={{ background: "color-mix(in srgb, var(--color-cream-dark) 55%, var(--color-paper))" }}>
          <span className={labelCls}>Categories</span>
          <button type="button" onClick={() => setStep(2)}
            className="font-sans text-[11px] hover:underline" style={{ color: "var(--color-ink)" }}>
            Edit
          </button>
        </div>
        <div className="px-4 py-3 flex flex-wrap gap-1.5" style={{ background: "var(--color-cream)" }}>
          {form.categories.map((c) => (
            <span key={c} className="font-sans text-[11px] font-medium px-2.5 py-0.5"
              style={{ background: "color-mix(in srgb, var(--color-ink) 8%, transparent)", color: "var(--color-ink)", border: "1px solid color-mix(in srgb, var(--color-ink) 15%, transparent)", borderRadius: "2px" }}>
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Agreements */}
      <div className="flex flex-col gap-3 pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <Checkbox checked={form.agreeTerms} onToggle={() => setForm(set("agreeTerms")(!form.agreeTerms))} />
          <span className="font-sans text-[12px] text-text-muted leading-relaxed">
            I agree to the nevali Terms of Service and Privacy Policy{" "}
            <span style={{ color: "var(--color-ink)" }}>*</span>
          </span>
        </label>
        <label className="flex items-start gap-2.5 cursor-pointer">
          <Checkbox checked={form.agreeMarketing} onToggle={() => setForm(set("agreeMarketing")(!form.agreeMarketing))} />
          <span className="font-sans text-[12px] text-text-muted leading-relaxed">
            I&apos;d like to receive updates about new features and export opportunities
          </span>
        </label>
      </div>

      {submitError && (
        <div className="px-4 py-3 font-sans text-sm rounded-sm"
          style={{ background: "color-mix(in srgb, var(--color-danger-dark) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--color-danger-dark) 20%, transparent)", color: "var(--color-danger-dark)" }}>
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
        <div className="max-w-xl mx-auto">
          <Link href="/artisan/profile" className="font-sans text-sm text-text-muted hover:text-text-dark transition-colors">
            ← Back to profile
          </Link>
          <h1 className="font-serif font-bold text-[28px] text-text-dark leading-tight mt-3 mb-1">Edit profile</h1>
          <p className="font-sans text-text-muted text-sm mb-8">Update your brand profile and contact details.</p>
          <div className="flex gap-0 mb-8 border-b border-[var(--color-cream-dark)]">
            {ONBOARDING_STEPS.map((s) => (
              <button key={s.number} type="button" onClick={() => setStep(s.number)}
                className="font-sans text-[11px] font-semibold uppercase tracking-wider px-5 py-3 transition-colors"
                style={{
                  color: step === s.number ? "var(--color-ink)" : "var(--color-text-muted)",
                  borderBottom: step === s.number ? "2px solid var(--color-ink)" : "2px solid transparent",
                  marginBottom: "-1px",
                }}>
                {s.label}
              </button>
            ))}
          </div>
          {stepFields}
          <div className="flex items-center justify-between mt-8">
            {step > 1
              ? <button type="button" onClick={() => setStep(step - 1)} className="font-sans text-sm text-text-muted hover:text-text-dark">← Back</button>
              : <span />}
            {step < totalSteps
              ? <button type="button" onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()}
                  className="font-sans font-semibold text-sm px-7 py-2.5 rounded-sm disabled:cursor-not-allowed"
                  style={canNext() ? { background: "var(--color-ink)", color: "var(--color-paper)" } : { background: "color-mix(in srgb, var(--color-ink) 12%, transparent)", color: "color-mix(in srgb, var(--color-ink) 35%, transparent)" }}>
                  Continue →
                </button>
              : <button type="button" disabled={!canNext() || submitting} onClick={handleSubmit}
                  className="font-sans font-semibold text-sm px-7 py-2.5 rounded-sm disabled:cursor-not-allowed"
                  style={canNext() && !submitting ? { background: "var(--color-ink)", color: "var(--color-paper)" } : { background: "color-mix(in srgb, var(--color-ink) 12%, transparent)", color: "color-mix(in srgb, var(--color-ink) 35%, transparent)" }}>
                  {submitting ? "Saving…" : "Save changes"}
                </button>}
          </div>
        </div>
      </div>
    );
  }

  /* ── Onboarding: full-page, no-scroll, two-panel ── */
  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "var(--color-paper)" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 shrink-0" style={{ borderBottom: "1px solid var(--color-cream-dark)" }}>
        <Link href="/" className="font-display font-bold uppercase text-[16px] tracking-wide text-text-dark">
          nevali
        </Link>
        <div className="flex items-center gap-3">
          {ONBOARDING_STEPS.map((s, i) => (
            <React.Fragment key={s.number}>
              <div className="flex items-center gap-2">
                <div className="rounded-full transition-all duration-300 shrink-0"
                  style={{
                    width: step === s.number ? "7px" : "5px",
                    height: step === s.number ? "7px" : "5px",
                    background: step >= s.number ? "var(--color-ink)" : "color-mix(in srgb, var(--color-cream-dark) 75%, var(--color-paper))",
                  }} />
                <span className="font-sans text-[10px] uppercase tracking-widest hidden sm:block"
                  style={{ color: step === s.number ? "var(--color-ink)" : "var(--color-text-muted)", fontWeight: step === s.number ? 700 : 400 }}>
                  {s.label}
                </span>
              </div>
              {i < ONBOARDING_STEPS.length - 1 && (
                <div className="hidden sm:block w-6 h-px" style={{ background: "var(--color-cream-dark)" }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-px w-full shrink-0" style={{ background: "var(--color-cream-dark)" }}>
        <div className="h-full transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%`, background: "var(--color-ink)" }} />
      </div>

      {/* Two-panel content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: step context */}
        <div className="w-64 shrink-0 flex flex-col justify-center px-10 py-8" style={{ borderRight: "1px solid var(--color-cream-dark)" }}>
          <span className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "var(--color-text-muted)" }}>
            Step {step} of {totalSteps}
          </span>
          <h1 className="font-serif font-bold text-[32px] text-text-dark leading-[1.05] mb-3">
            {stepMeta[step - 1]!.heading}
          </h1>
          <p className="font-sans text-[13px] text-text-muted leading-relaxed">
            {stepMeta[step - 1]!.sub}
          </p>

          {/* Step dots */}
          <div className="flex flex-col gap-2 mt-10">
            {ONBOARDING_STEPS.map((s) => (
              <div key={s.number} className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full shrink-0 transition-all"
                  style={{ background: step >= s.number ? "var(--color-ink)" : "color-mix(in srgb, var(--color-cream-dark) 75%, var(--color-paper))" }} />
                <span className="font-sans text-[11px] uppercase tracking-wider"
                  style={{ color: step === s.number ? "var(--color-ink)" : "var(--color-muted-light)", fontWeight: step === s.number ? 700 : 400 }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div className="flex-1 flex flex-col justify-center px-12 py-8 overflow-y-auto">
          <div className="max-w-lg w-full mx-auto">
            {stepFields}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="shrink-0 flex items-center justify-between px-8 py-4" style={{ borderTop: "1px solid var(--color-cream-dark)", background: "var(--color-paper)" }}>
        {step > 1
          ? <button type="button" onClick={() => setStep(step - 1)}
              className="font-sans text-sm text-text-muted hover:text-text-dark transition-colors">
              ← Back
            </button>
          : <Link href="/" className="font-sans text-sm text-text-muted hover:text-text-dark transition-colors">
              ← Homepage
            </Link>}

        {step < totalSteps
          ? <button type="button" onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()}
              className="font-sans font-semibold text-sm px-8 py-2.5 rounded-sm transition-all disabled:cursor-not-allowed"
              style={canNext() ? { background: "var(--color-ink)", color: "var(--color-paper)" } : { background: "color-mix(in srgb, var(--color-ink) 12%, transparent)", color: "color-mix(in srgb, var(--color-ink) 35%, transparent)" }}>
              Continue →
            </button>
          : <button type="button" disabled={!canNext() || submitting} onClick={handleSubmit}
              className="font-sans font-semibold text-sm px-8 py-2.5 rounded-sm transition-all disabled:cursor-not-allowed"
              style={canNext() && !submitting ? { background: "var(--color-ink)", color: "var(--color-paper)" } : { background: "color-mix(in srgb, var(--color-ink) 12%, transparent)", color: "color-mix(in srgb, var(--color-ink) 35%, transparent)" }}>
              {submitting ? "Saving…" : "Complete profile"}
            </button>}
      </div>
    </div>
  );
}
