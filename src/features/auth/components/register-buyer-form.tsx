"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { postRegisterKind } from "~/app/api/auth/register-kind-actions";
import { signUp } from "~/lib/auth-client";
import { AuthLayout, AuthInput, AuthField } from "~/features/auth";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";

export function RegisterBuyerForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 8 &&
    password === confirmPassword &&
    agreeTerms;
  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <AuthLayout
      title="Create a buyer account"
      subtitle={
        SHOW_MULTI_PRODUCER_EXPERIENCE ? (
          <>Browse artisans and request quotes.</>
        ) : (
          <>Browse nevali, save lists, and track orders when you sign in with the same email as checkout.</>
        )
      }
      showLoginLink
      contentClassName="max-w-md"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <AuthField label="Full Name">
            <AuthInput
              placeholder="Your name"
              value={name}
              onChange={(v) => setName(v)}
            />
          </AuthField>
          <AuthField label="Email Address">
            <AuthInput
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(v) => setEmail(v)}
            />
          </AuthField>
          <AuthField label="Password">
            <AuthInput
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(v) => setPassword(v)}
            />
          </AuthField>
          <AuthField
            label="Confirm Password"
            error={passwordMismatch ? "Passwords do not match" : undefined}
          >
            <AuthInput
              type="password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(v) => setConfirmPassword(v)}
            />
          </AuthField>
          <label className="flex items-start gap-3 cursor-pointer">
            <div
              className="w-5 h-5 rounded-sm flex items-center justify-center shrink-0 mt-0.5 transition-colors"
              style={
                agreeTerms
                  ? { background: "#000000", border: "1px solid #000000" }
                  : {
                      background: "#fff",
                      border: "1px solid #d0c4b0",
                    }
              }
              onClick={() => setAgreeTerms(!agreeTerms)}
              onKeyDown={(e) => e.key === "Enter" && setAgreeTerms(!agreeTerms)}
              role="button"
              tabIndex={0}
              aria-checked={agreeTerms}
            >
              {agreeTerms && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 5l2 2 4-4" />
                </svg>
              )}
            </div>
            <span className="font-sans text-[13px] text-text-muted leading-relaxed">
              I agree to the nevali Terms of Service and Privacy Policy{" "}
              <span style={{ color: "#000000" }}>*</span>
            </span>
          </label>
        </div>

        {submitError && (
          <div
            className="rounded-sm px-4 py-3 font-sans text-sm text-[#f87171]"
            style={{
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.25)",
            }}
          >
            {submitError}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <button
            type="button"
            disabled={!canSubmit || submitting}
            onClick={async () => {
              if (!canSubmit || submitting) return;
              setSubmitError(null);
              setSubmitting(true);
              const res = await signUp.email({
                name: name.trim() || email,
                email: email.trim(),
                password,
              });
              setSubmitting(false);
              if (res.error) {
                setSubmitError(
                  res.error.message ?? "Registration failed. Try again."
                );
                return;
              }
              const tag = await postRegisterKind("buyer");
              if (tag.error) {
                setSubmitError(tag.error);
                return;
              }
              router.push("/buyer");
              router.refresh();
            }}
            className="font-sans font-semibold text-sm rounded-sm px-8 py-3.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed w-full"
            style={
              canSubmit && !submitting
                ? { background: "#000000", color: "#fff" }
                : {
                    background: "rgba(0,0,0,0.12)",
                    color: "rgba(0,0,0,0.35)",
                    cursor: "not-allowed",
                  }
            }
          >
            {submitting ? "Creating account…" : "Create buyer account"}
          </button>
          {SHOW_MULTI_PRODUCER_EXPERIENCE ? (
            <Link
              href="/auth/register"
              className="font-sans text-sm text-text-muted/80 hover:text-text-muted transition-colors text-center"
            >
              Artisan or producer? Register as a partner instead
            </Link>
          ) : null}
          <Link
            href="/auth/login"
            className="font-sans text-sm text-text-muted/60 hover:text-text-muted transition-colors text-center"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>

      <p className="font-sans text-[11px] text-text-muted/50 mt-6 text-center">
        Your data is handled in accordance with Moroccan Law 09-08 on personal
        data protection.
      </p>
    </AuthLayout>
  );
}
