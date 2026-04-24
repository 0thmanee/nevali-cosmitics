import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import { listPublicPartners } from "~/app/api/partners/public-actions";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import PartnersClient from "~/app/partners/PartnersClient";
import { getTranslator } from "~/lib/i18n/server";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import { interpolate } from "~/lib/i18n/interpolate";

export const metadata = {
	title: SHOW_MULTI_PRODUCER_EXPERIENCE ? "Moroccan beauty brands — nevali" : `${NEVALI_HOUSE_BRAND.legalName} — our studio | nevali`,
	description: SHOW_MULTI_PRODUCER_EXPERIENCE
		? "Meet the verified Moroccan cosmetics makers behind nevali—bio-minded formulas, transparent sourcing, and stories rooted in terroir."
		: `Meet the team behind ${NEVALI_HOUSE_BRAND.legalName} Moroccan cosmetics—bio-minded formulas, transparent sourcing, and stories from our studio.`,
};

export default async function ArtisansDirectoryPage() {
	const t = await getTranslator();
	const partners = await listPublicPartners();

	return (
		<main className="flex min-h-screen w-full flex-col bg-cream pt-[56px]">
			<Navbar />

			<section className="bg-primary">
				<div className="max-w-7xl mx-auto px-6">
					{/* Breadcrumb */}
					<AnimateOnScroll className="py-4 flex items-center gap-2 font-sans text-xs tracking-[0.08em] uppercase text-white/40 border-b border-white/10" direction="down">
						<span>{t("nav.home")}</span>
						<span>/</span>
						<span className="text-white/70">
							{SHOW_MULTI_PRODUCER_EXPERIENCE ? t("nav.brands") : t("artisansPage.studio")}
						</span>
					</AnimateOnScroll>

					<div className="py-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
						<AnimateOnScroll direction="up">
						<div>
							<p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary mb-5">
								{SHOW_MULTI_PRODUCER_EXPERIENCE
									? t("artisansPage.heroEyebrowMulti")
									: interpolate(t("artisansPage.heroEyebrowSingle"), { brand: NEVALI_HOUSE_BRAND.legalName })}
							</p>
							<h1
								className="font-serif font-bold uppercase text-white leading-none"
								style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
							>
								{SHOW_MULTI_PRODUCER_EXPERIENCE ? (
									<>
										{t("artisansPage.heroTitleMultiLine1")}
										<br />
										{t("artisansPage.heroTitleMultiLine2")}
										<br />
										{t("artisansPage.heroTitleMultiLine3")}
									</>
								) : (
									<>
										{t("artisansPage.heroTitleSingleLine1")}
										<br />
										{t("artisansPage.heroTitleSingleLine2")}
										<br />
										{t("artisansPage.heroTitleSingleLine3")}
									</>
								)}
							</h1>
						</div>
						</AnimateOnScroll>

						<AnimateOnScroll className="md:max-w-xs shrink-0 flex flex-col gap-6" delay={150} direction="up">
							<p className="font-sans text-white/60 leading-relaxed text-sm">
								{SHOW_MULTI_PRODUCER_EXPERIENCE ? (
									<>{t("artisansPage.heroBodyMulti")}</>
								) : (
									<>{interpolate(t("artisansPage.heroBodySingle"), { brand: NEVALI_HOUSE_BRAND.legalName })}</>
								)}
							</p>
							<div className="flex gap-8">
								{[
									{ value: "12", label: t("artisansPage.statRegions") },
									{ value: "96%", label: t("artisansPage.statAuditPass") },
									{ value: "3", label: t("artisansPage.statStandards") },
								].map((s) => (
									<div key={s.label} className="flex flex-col gap-0.5">
										<span className="font-serif font-bold text-secondary" style={{ fontSize: "clamp(22px, 2.5vw, 32px)" }}>{s.value}</span>
										<span className="font-sans text-[10px] uppercase tracking-widest text-white/40">{s.label}</span>
									</div>
								))}
							</div>
						</AnimateOnScroll>
					</div>
				</div>
			</section>

			<PartnersClient partners={partners} />

			<Footer />
		</main>
	);
}
