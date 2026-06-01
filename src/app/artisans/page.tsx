import { listPublicPartners } from "~/app/api/partners/public-actions";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import PartnersClient from "~/app/partners/PartnersClient";
import { interpolate } from "~/lib/i18n/interpolate";
import { getTranslator } from "~/lib/i18n/server";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";

export const metadata = {
	title: SHOW_MULTI_PRODUCER_EXPERIENCE
		? "Moroccan beauty brands — nevali"
		: `${NEVALI_HOUSE_BRAND.legalName} — our studio | nevali`,
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
				<div className="mx-auto max-w-7xl px-6">
					{/* Breadcrumb */}
					<AnimateOnScroll
						className="flex items-center gap-2 border-white/10 border-b py-4 font-sans text-white/40 text-xs uppercase tracking-[0.08em]"
						direction="down"
					>
						<span>{t("nav.home")}</span>
						<span>/</span>
						<span className="text-white/70">
							{SHOW_MULTI_PRODUCER_EXPERIENCE
								? t("nav.brands")
								: t("artisansPage.studio")}
						</span>
					</AnimateOnScroll>

					<div className="flex flex-col justify-between gap-10 py-20 md:flex-row md:items-end">
						<AnimateOnScroll direction="up">
							<div>
								<p className="mb-5 font-sans text-secondary text-xs uppercase tracking-[0.2em]">
									{SHOW_MULTI_PRODUCER_EXPERIENCE
										? t("artisansPage.heroEyebrowMulti")
										: interpolate(t("artisansPage.heroEyebrowSingle"), {
												brand: NEVALI_HOUSE_BRAND.legalName,
											})}
								</p>
								<h1
									className="font-bold font-serif text-white uppercase leading-none"
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

						<AnimateOnScroll
							className="flex shrink-0 flex-col gap-6 md:max-w-xs"
							delay={150}
							direction="up"
						>
							<p className="font-sans text-sm text-white/60 leading-relaxed">
								{SHOW_MULTI_PRODUCER_EXPERIENCE ? (
									<>{t("artisansPage.heroBodyMulti")}</>
								) : (
									<>
										{interpolate(t("artisansPage.heroBodySingle"), {
											brand: NEVALI_HOUSE_BRAND.legalName,
										})}
									</>
								)}
							</p>
							<div className="flex gap-8">
								{[
									{ value: "12", label: t("artisansPage.statRegions") },
									{ value: "96%", label: t("artisansPage.statAuditPass") },
									{ value: "3", label: t("artisansPage.statStandards") },
								].map((s) => (
									<div className="flex flex-col gap-0.5" key={s.label}>
										<span
											className="font-bold font-serif text-secondary"
											style={{ fontSize: "clamp(22px, 2.5vw, 32px)" }}
										>
											{s.value}
										</span>
										<span className="font-sans text-[10px] text-white/40 uppercase tracking-widest">
											{s.label}
										</span>
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
