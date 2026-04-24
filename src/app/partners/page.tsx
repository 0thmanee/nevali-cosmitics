import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "~/app/Navbar";
import Footer from "~/app/Footer";
import { listPublicPartners } from "~/app/api/partners/public-actions";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import { getMessages } from "~/lib/i18n/load-messages";
import { getLocale, getTranslator } from "~/lib/i18n/server";
import PartnersClient from "./PartnersClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return {
    title: t("partnersPage.metaTitle"),
    description: t("partnersPage.metaDescription"),
  };
}

export default async function PartnersPage() {
  const t = await getTranslator();
  const messages = getMessages(await getLocale());
  const partners = await listPublicPartners();
  const partnerCount = partners.length;
  const stats = messages.partnersPage.stats;

  return (
    <main className="flex flex-col w-full min-h-screen pt-[56px]">
      <Navbar />

      {/* ── Hero ── */}
      <section className="bg-primary">
        <div className="max-w-7xl mx-auto px-6">

          {/* Breadcrumb */}
          <AnimateOnScroll className="py-4 flex items-center gap-2 font-sans text-xs tracking-[0.08em] uppercase text-white/40 border-b border-white/10" direction="down">
            <Link href="/" className="hover:text-white/70 transition-colors">
              {t("partnersPage.breadcrumbHome")}
            </Link>
            <span>/</span>
            <span className="text-white/70">{t("partnersPage.breadcrumbPartners")}</span>
          </AnimateOnScroll>

          {/* Headline row */}
          <div className="py-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <AnimateOnScroll direction="up" delay={0}>
              <p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary mb-5">
                {partnerCount > 0
                  ? t("partnersPage.eyebrowVerifiedCount", { count: partnerCount })
                  : t("partnersPage.eyebrowCertified")}
              </p>
              <h1
                className="font-serif font-bold uppercase text-white leading-[1.0]"
                style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
              >
                {t("partnersPage.titleLine1")}
                <br />
                {t("partnersPage.titleLine2")}
                <br />
                {t("partnersPage.titleLine3")}
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll direction="up" delay={150} className="md:max-w-xs shrink-0">
              <p className="font-sans text-white/60 leading-relaxed text-sm mb-8">{t("partnersPage.intro")}</p>
              {/* Stats row */}
              <div className="grid grid-cols-3 divide-x divide-white/10 border border-white/10">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center gap-1 py-4 px-3">
                    <span className="font-serif font-bold text-secondary text-2xl leading-none">{stat.value}</span>
                    <span className="font-sans text-xs tracking-[0.15em] uppercase text-white/40 mt-1">{stat.label}</span>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>

        </div>
      </section>

      {/* ── Directory ── */}
      <PartnersClient partners={partners} />

      <Footer />
    </main>
  );
}
