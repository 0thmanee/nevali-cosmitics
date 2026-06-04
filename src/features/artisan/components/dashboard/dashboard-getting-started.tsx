"use client";

import Link from "next/link";
import { useI18n } from "~/components/i18n/i18n-provider";
import { useArticles } from "../../hooks/use-articles";
import { useProducts } from "../../hooks/use-products";

type Step = {
	done: boolean;
	label: string;
	cta: string;
	href: string;
};

/** First-run checklist for new producers. Hidden once every step is complete. */
export function DashboardGettingStarted() {
	const { t } = useI18n();
	const { data: products = [], isLoading: loadingProducts } = useProducts();
	const { data: articles = [], isLoading: loadingArticles } = useArticles();

	// Avoid flashing the card before data loads.
	if (loadingProducts || loadingArticles) return null;

	const steps: Step[] = [
		{
			done: products.length > 0,
			label: t("producerDashboard.gsAddProduct"),
			cta: t("producerDashboard.gsAddProductCta"),
			href: "/artisan/products/new",
		},
		{
			done: articles.length > 0,
			label: t("producerDashboard.gsWriteArticle"),
			cta: t("producerDashboard.gsWriteArticleCta"),
			href: "/artisan/articles/new",
		},
	];

	if (steps.every((s) => s.done)) return null;

	return (
		<div
			className="overflow-hidden rounded-xl"
			style={{
				background:
					"linear-gradient(135deg, color-mix(in srgb, var(--color-primary-light) 30%, white), white)",
				border: "1px solid var(--color-cream-dark)",
			}}
		>
			<div className="px-5 py-4">
				<h2 className="font-bold font-serif text-[16px] text-text-dark">
					{t("producerDashboard.gsTitle")}
				</h2>
				<p className="mt-0.5 font-sans text-[12px] text-text-muted">
					{t("producerDashboard.gsSubtitle")}
				</p>
			</div>
			<ul className="flex flex-col">
				{steps.map((step) => (
					<li
						className="flex items-center justify-between gap-3 border-cream-dark border-t px-5 py-3"
						key={step.href}
					>
						<div className="flex min-w-0 items-center gap-3">
							<span
								aria-hidden
								className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px]"
								style={
									step.done
										? { background: "var(--color-success)", color: "white" }
										: {
												border: "1.5px solid var(--color-cream-dark)",
												color: "var(--color-text-muted)",
											}
								}
							>
								{step.done ? "✓" : ""}
							</span>
							<span
								className={`truncate font-sans text-sm ${
									step.done
										? "text-text-muted line-through"
										: "font-semibold text-text-dark"
								}`}
							>
								{step.label}
							</span>
						</div>
						{step.done ? (
							<span className="shrink-0 font-sans text-[11px] text-text-muted">
								{t("producerDashboard.gsDone")}
							</span>
						) : (
							<Link
								className="shrink-0 rounded-sm px-3 py-1.5 font-sans font-semibold text-[12px] text-white transition-opacity hover:opacity-90"
								href={step.href}
								style={{ background: "var(--color-ink)" }}
							>
								{step.cta}
							</Link>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}
