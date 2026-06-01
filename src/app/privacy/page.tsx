import type { Metadata } from "next";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import { env } from "~/env";
import { interpolate } from "~/lib/i18n/interpolate";
import { getTranslator } from "~/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslator();
	return {
		title: t("privacyPage.metaTitle"),
		description: t("privacyPage.metaDescription"),
	};
}

export default async function PrivacyPage() {
	const t = await getTranslator();

	return (
		<main className="flex min-h-screen w-full flex-col bg-cream">
			<Navbar />
			<div className="pt-[56px]" />
			<section className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-12">
				<AnimateOnScroll className="flex flex-col gap-4" direction="up">
					<h1 className="font-bold font-display text-2xl text-text-dark uppercase tracking-wide">
						{t("contact.privacyTitle")}
					</h1>
					{env.LEGAL_POLICY_EFFECTIVE_DATE ? (
						<p className="mb-1 font-sans text-text-muted text-xs leading-relaxed">
							{interpolate(t("contact.privacyOptionalLabel"), {
								date: env.LEGAL_POLICY_EFFECTIVE_DATE,
							})}
						</p>
					) : null}
					<p className="font-sans text-sm text-text-muted leading-relaxed">
						{t("contact.privacyLead")}{" "}
						<strong>{t("contact.privacyStrong")}</strong>{" "}
						{t("contact.privacyTrail")}
					</p>
					<div className="flex flex-col gap-3 font-sans text-sm text-text-muted leading-relaxed">
						<div>
							<h2 className="mb-1 font-semibold text-text-dark">
								{t("contact.privacyCollectTitle")}
							</h2>
							<p>{t("contact.privacyCollectBody")}</p>
						</div>
						<div>
							<h2 className="mb-1 font-semibold text-text-dark">
								{t("contact.privacyWhyTitle")}
							</h2>
							<p>{t("contact.privacyWhyBody")}</p>
						</div>
						<div>
							<h2 className="mb-1 font-semibold text-text-dark">
								{t("contact.privacySharingTitle")}
							</h2>
							<p>{t("contact.privacySharingBody")}</p>
						</div>
						<div>
							<h2 className="mb-1 font-semibold text-text-dark">
								{t("contact.privacyRetentionTitle")}
							</h2>
							<p>{t("contact.privacyRetentionBody")}</p>
						</div>
					</div>
				</AnimateOnScroll>
			</section>
			<Footer />
		</main>
	);
}
