"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { reportError } from "~/lib/report-error";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const { t } = useI18n();

	useEffect(() => {
		reportError(error);
	}, [error]);

	return (
		<div
			className="flex min-h-screen flex-col"
			style={{ background: "var(--color-paper)" }}
		>
			<div
				className="flex items-center justify-between px-8 py-5"
				style={{ borderBottom: "1px solid var(--color-cream-dark)" }}
			>
				<Link
					className="font-bold font-display text-[16px] text-text-dark uppercase tracking-wide"
					href="/"
				>
					nevali
				</Link>
			</div>

			<div className="flex flex-1 items-center justify-center px-6 py-16">
				<div className="max-w-md text-center">
					<h1 className="font-bold font-display text-[clamp(28px,5vw,40px)] text-text-dark">
						{t("errorPage.title")}
					</h1>
					<p className="mt-4 font-sans text-[15px] text-text-muted leading-relaxed">
						{t("errorPage.description")}
					</p>
					<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
						<button
							className="rounded-full px-5 py-3 font-sans font-semibold text-[13px] text-white uppercase tracking-wide"
							onClick={() => reset()}
							style={{ background: "var(--color-ink)" }}
							type="button"
						>
							{t("errorPage.retry")}
						</button>
						<Link
							className="rounded-full px-5 py-3 font-sans font-semibold text-[13px] uppercase tracking-wide"
							href="/"
							style={{
								color: "var(--color-ink)",
								border: "1px solid var(--color-cream-dark)",
							}}
						>
							{t("errorPage.home")}
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
