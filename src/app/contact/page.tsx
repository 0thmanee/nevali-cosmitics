import type { Metadata } from "next";
import Link from "next/link";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import { env } from "~/env";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import { getTranslator } from "~/lib/i18n/server";
import { ContactForm } from "./contact-form";

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

  return (
    <main className="flex min-h-screen w-full flex-col bg-cream">
      <Navbar />
      <div className="pt-[56px]" />

      <section className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-6 py-16">
        <AnimateOnScroll className="flex w-full flex-col gap-8" direction="up" scale>
          <div className="flex flex-col gap-3">
            <span className="font-bold font-sans text-[10px] text-text-muted uppercase tracking-[0.2em]">{t("contact.kicker")}</span>
            <h1 className="font-bold font-display text-3xl text-text-dark uppercase tracking-wide md:text-4xl">{t("contact.title")}</h1>
            <p className="font-sans text-[15px] text-text-muted leading-relaxed">
              {SHOW_MULTI_PRODUCER_EXPERIENCE ? t("contact.introMulti") : t("contact.introSingle", { brand })}
            </p>
          </div>

          <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <ContactForm contactEmail={contactEmail} />
            <div className="rounded-sm border border-cream-dark bg-white p-6">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-text-muted">
                {t("contact.directEmailLabel")}
              </p>
              <a className="mt-2 block break-all font-sans text-sm text-forest-light hover:underline" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
              <p className="mt-3 font-sans text-xs text-text-muted">
                {env.CONTACT_PUBLIC_EMAIL ? t("contact.envHintConfigured") : t("contact.envHintDefault")}
              </p>
              <div className="mt-5 border-t border-cream-dark pt-4">
                <Link className="block font-sans text-xs text-text-muted hover:text-text-dark hover:underline" href="/privacy">
                  {t("footer.privacyPolicy")}
                </Link>
                <Link className="mt-2 block font-sans text-xs text-text-muted hover:text-text-dark hover:underline" href="/terms">
                  {t("footer.termsOfService")}
                </Link>
              </div>
            </div>
          </div>

          <Link className="w-fit font-sans text-sm text-text-muted transition-colors hover:text-text-dark" href="/">
            {t("contact.backHome")}
          </Link>
        </AnimateOnScroll>
      </section>

      <Footer />
    </main>
  );
}
