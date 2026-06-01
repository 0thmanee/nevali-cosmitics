import type { Metadata } from "next";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import { env } from "~/env";
import { interpolate } from "~/lib/i18n/interpolate";
import { getTranslator } from "~/lib/i18n/server";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslator();
	return {
		title: t("termsPage.metaTitle"),
		description: t("termsPage.metaDescription"),
	};
}

export default async function TermsPage() {
	const t = await getTranslator();

	return (
		<main className="flex min-h-screen w-full flex-col bg-cream">
			<Navbar />
			<div className="pt-[56px]" />
			<section className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-12">
				<AnimateOnScroll className="flex flex-col gap-4" direction="up">
					<h1 className="font-bold font-display text-2xl text-text-dark uppercase tracking-wide">
						{t("contact.termsTitle")}
					</h1>
					{env.LEGAL_POLICY_EFFECTIVE_DATE ? (
						<p className="mb-1 font-sans text-text-muted text-xs leading-relaxed">
							{interpolate(t("contact.termsOptional"), {
								date: env.LEGAL_POLICY_EFFECTIVE_DATE,
							})}
						</p>
					) : null}
					<p className="font-sans text-sm text-text-muted leading-relaxed">
						{t("contact.termsIntroLead")}{" "}
						<strong>{t("contact.termsIntroStrong")}</strong>{" "}
						{t("contact.termsIntroTrail")}
					</p>
					<div className="flex flex-col gap-3 font-sans text-sm text-text-muted leading-relaxed">
						<div>
							<h2 className="mb-1 font-semibold text-text-dark">
								{t("contact.termsAccountsTitle")}
							</h2>
							<p>{t("contact.termsAccountsBody")}</p>
						</div>
						<div>
							<h2 className="mb-1 font-semibold text-text-dark">
								{SHOW_MULTI_PRODUCER_EXPERIENCE
									? t("contact.termsConductTitleMulti")
									: t("contact.termsConductTitleSingle")}
							</h2>
							<p>
								{SHOW_MULTI_PRODUCER_EXPERIENCE
									? t("contact.termsConductBodyMulti")
									: t("contact.termsConductBodySingle")}
							</p>
						</div>
						<div>
							<h2 className="mb-1 font-semibold text-text-dark">
								{t("contact.termsContentTitle")}
							</h2>
							<p>{t("contact.termsContentBody")}</p>
						</div>
						<div>
							<h2 className="mb-1 font-semibold text-text-dark">
								{t("contact.termsDisclaimerTitle")}
							</h2>
							<p>{t("contact.termsDisclaimerBody")}</p>
						</div>
					</div>
				</AnimateOnScroll>
			</section>
			<Footer />
		</main>
	);
}
