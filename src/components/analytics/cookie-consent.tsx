"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useI18n } from "~/components/i18n/i18n-provider";

const STORAGE_KEY = "nevali_cookie_consent";
type ConsentState = "accepted" | "declined" | null;

function readConsent(): ConsentState {
	if (typeof window === "undefined") return null;
	const v = window.localStorage.getItem(STORAGE_KEY);
	return v === "accepted" || v === "declined" ? v : null;
}

/**
 * GDPR-style cookie banner that gates Google Analytics. Analytics scripts only load
 * after the visitor accepts. No-ops (and never shows the banner) when no GA id is set.
 */
export function CookieConsent() {
	const { t } = useI18n();
	const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
	const [consent, setConsent] = useState<ConsentState>(null);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		setConsent(readConsent());
		setReady(true);
	}, []);

	// Nothing to gate without a GA id: never show the banner, never load scripts.
	if (!gaId) return null;

	function decide(next: "accepted" | "declined") {
		window.localStorage.setItem(STORAGE_KEY, next);
		setConsent(next);
	}

	return (
		<>
			{consent === "accepted" && (
				<>
					<Script
						src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
						strategy="afterInteractive"
					/>
					<Script id="ga-init" strategy="afterInteractive">
						{`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { anonymize_ip: true });`}
					</Script>
				</>
			)}

			{ready && consent === null && (
				<div
					aria-label="Cookie consent"
					className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4"
					role="dialog"
				>
					<div
						className="mx-auto flex max-w-3xl flex-col gap-3 rounded-lg p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between"
						style={{
							background: "var(--color-paper)",
							border: "1px solid var(--color-cream-dark)",
						}}
					>
						<p className="font-sans text-[13px] text-text-muted leading-relaxed">
							{t("cookieConsent.message")}{" "}
							<Link className="underline" href="/privacy">
								{t("cookieConsent.learnMore")}
							</Link>
						</p>
						<div className="flex shrink-0 items-center gap-2">
							<button
								className="rounded-full px-4 py-2 font-sans font-semibold text-[12px] uppercase tracking-wide"
								onClick={() => decide("declined")}
								style={{
									color: "var(--color-ink)",
									border: "1px solid var(--color-cream-dark)",
								}}
								type="button"
							>
								{t("cookieConsent.decline")}
							</button>
							<button
								className="rounded-full px-4 py-2 font-sans font-semibold text-[12px] text-white uppercase tracking-wide"
								onClick={() => decide("accepted")}
								style={{ background: "var(--color-ink)" }}
								type="button"
							>
								{t("cookieConsent.accept")}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
