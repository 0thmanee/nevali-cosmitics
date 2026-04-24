import type { Metadata } from "next";
import Link from "next/link";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import { env } from "~/env";
import { interpolate } from "~/lib/i18n/interpolate";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import { getTranslator } from "~/lib/i18n/server";

const DEFAULT_CONTACT_EMAIL = "hello@nevali-cosmetics.ma";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  const brand = NEVALI_HOUSE_BRAND.legalName;
  return {
    title: t("contact.metaTitle"),
    description: SHOW_MULTI_PRODUCER_EXPERIENCE ? t("contact.metaDescMulti") : t("contact.metaDescSingle", { brand }),
  };
}

export default async function ContactPage() {
  const t = await getTranslator();
  const brand = NEVALI_HOUSE_BRAND.legalName;
  const contactEmail = env.CONTACT_PUBLIC_EMAIL ?? DEFAULT_CONTACT_EMAIL;
  const mailto = `mailto:${contactEmail}`;

  return (
    <main className="flex min-h-screen w-full flex-col bg-cream">
      <Navbar />
      <div className="pt-[56px]" />

      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-16">
        <AnimateOnScroll className="flex flex-col gap-8" direction="up" scale>
          <div className="flex flex-col gap-3">
            <span className="font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.2em]">{t("contact.kicker")}</span>
            <h1 className="font-bold font-display text-3xl text-text-dark uppercase tracking-wide md:text-4xl">{t("contact.title")}</h1>
            <p className="font-sans text-[15px] text-text-muted leading-relaxed">
              {SHOW_MULTI_PRODUCER_EXPERIENCE ? t("contact.introMulti") : t("contact.introSingle", { brand })}
            </p>
          </div>

          <div className="flex flex-col gap-6 rounded-sm border border-cream-dark bg-white p-8">
            <div>
              <h2 className="mb-1 font-sans font-semibold text-sm text-text-dark">
                {SHOW_MULTI_PRODUCER_EXPERIENCE ? t("contact.cardSupportTitleMulti") : t("contact.cardSupportTitleSingle")}
              </h2>
              <p className="mb-2 font-sans text-sm text-text-muted">
                {SHOW_MULTI_PRODUCER_EXPERIENCE ? t("contact.cardSupportBodyMulti") : t("contact.cardSupportBodySingle")}
              </p>
              <Link
                className="font-medium font-sans text-forest-light text-sm hover:underline"
                href="/auth/login?callbackUrl=%2Fartisan%2Fsupport"
              >
                {t("contact.cardSupportLink")}
              </Link>
            </div>

            <div className="h-px bg-cream-dark" />

            <div>
              <h2 className="mb-1 font-sans font-semibold text-sm text-text-dark">{t("contact.cardGeneralTitle")}</h2>
              <a className="font-medium font-sans text-forest-light text-sm hover:underline" href={mailto}>
                {contactEmail}
              </a>
              <p className="mt-2 font-sans text-text-muted text-xs">
                {env.CONTACT_PUBLIC_EMAIL ? t("contact.envHintConfigured") : t("contact.envHintDefault")}
              </p>
            </div>
          </div>

          <Link className="w-fit font-sans text-sm text-text-muted transition-colors hover:text-text-dark" href="/">
            {t("contact.backHome")}
          </Link>
        </AnimateOnScroll>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-cream-dark px-6 py-12" id="privacy">
        <AnimateOnScroll className="flex flex-col gap-4" delay={40} direction="up">
          <h2 className="font-bold font-display text-lg text-text-dark uppercase tracking-wide">{t("contact.privacyTitle")}</h2>
          {env.LEGAL_POLICY_EFFECTIVE_DATE ? (
            <p className="mb-1 font-sans text-text-muted text-xs leading-relaxed">
              {interpolate(t("contact.privacyOptionalLabel"), { date: env.LEGAL_POLICY_EFFECTIVE_DATE })}
            </p>
          ) : null}
          <p className="font-sans text-sm text-text-muted leading-relaxed">
            {t("contact.privacyLead")} <strong>{t("contact.privacyStrong")}</strong> {t("contact.privacyTrail")}
          </p>
          <div className="flex flex-col gap-3 font-sans text-sm text-text-muted leading-relaxed">
            <div>
              <h3 className="mb-1 font-semibold text-text-dark">{t("contact.privacyCollectTitle")}</h3>
              <p>{t("contact.privacyCollectBody")}</p>
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-text-dark">{t("contact.privacyWhyTitle")}</h3>
              <p>{t("contact.privacyWhyBody")}</p>
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-text-dark">{t("contact.privacySharingTitle")}</h3>
              <p>{t("contact.privacySharingBody")}</p>
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-text-dark">{t("contact.privacyRetentionTitle")}</h3>
              <p>{t("contact.privacyRetentionBody")}</p>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-4 px-6 pb-20" id="terms">
        <AnimateOnScroll className="flex flex-col gap-4" delay={40} direction="up">
          <h2 className="font-bold font-display text-lg text-text-dark uppercase tracking-wide">{t("contact.termsTitle")}</h2>
          {env.LEGAL_POLICY_EFFECTIVE_DATE ? (
            <p className="mb-1 font-sans text-text-muted text-xs leading-relaxed">
              {interpolate(t("contact.termsOptional"), { date: env.LEGAL_POLICY_EFFECTIVE_DATE })}
            </p>
          ) : null}
          <p className="font-sans text-sm text-text-muted leading-relaxed">
            {t("contact.termsIntroLead")} <strong>{t("contact.termsIntroStrong")}</strong> {t("contact.termsIntroTrail")}
          </p>
          <div className="flex flex-col gap-3 font-sans text-sm text-text-muted leading-relaxed">
            <div>
              <h3 className="mb-1 font-semibold text-text-dark">{t("contact.termsAccountsTitle")}</h3>
              <p>{t("contact.termsAccountsBody")}</p>
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-text-dark">
                {SHOW_MULTI_PRODUCER_EXPERIENCE ? t("contact.termsConductTitleMulti") : t("contact.termsConductTitleSingle")}
              </h3>
              <p>
                {SHOW_MULTI_PRODUCER_EXPERIENCE ? t("contact.termsConductBodyMulti") : t("contact.termsConductBodySingle")}
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-text-dark">{t("contact.termsContentTitle")}</h3>
              <p>{t("contact.termsContentBody")}</p>
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-text-dark">{t("contact.termsDisclaimerTitle")}</h3>
              <p>{t("contact.termsDisclaimerBody")}</p>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      <Footer />
    </main>
  );
}
