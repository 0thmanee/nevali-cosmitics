"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "~/lib/auth-client";
import { AuthLayout, AuthInput, AuthField } from "~/features/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/artisan";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn.email(
      { email, password, callbackURL: callbackUrl },
      {
        onError: (ctx) => {
          setError(ctx.error?.message ?? "Invalid email or password.");
        },
      }
    );
    setLoading(false);
    if (res.error) return;
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle={
        <>
          Welcome
          <br />
          <span className="italic" style={{ color: "#C87020" }}>back</span>
        </>
      }
      showRegisterLink
    >
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif font-bold text-[28px] text-text-dark leading-tight">
            Sign in to your account
          </h1>
          <p className="font-sans text-text-muted text-sm mt-1">
            Enter your credentials to access the Artisan Portal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div
              className="rounded-xl px-4 py-3 font-sans text-sm text-[#f87171] space-y-2"
              style={{
                background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.25)",
              }}
            >
              <p>{error}</p>
            </div>
          )}
          <AuthField label="Email Address">
            <AuthInput
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
              required
              autoComplete="email"
            />
          </AuthField>
          <AuthField label="Password">
            <AuthInput
              type="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
              required
              autoComplete="current-password"
            />
          </AuthField>
          <button
            type="submit"
            disabled={loading}
            className="font-sans font-semibold text-sm text-white rounded px-8 py-3.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed w-full"
            style={{ background: "#7B1F0A" }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="font-sans text-[11px] text-center">
          <Link href="/" className="text-text-muted/60 hover:text-text-muted">
            ← Back to homepage
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
