import Link from "next/link";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import { PLATFORM_OWNED_ORG_SLUG, SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import { getTranslator } from "~/lib/i18n/server";

type FooterItem = { label: string; href: string };

function buildFooterSections(t: Awaited<ReturnType<typeof getTranslator>>): { heading: string; items: FooterItem[] }[] {
  const platform: FooterItem[] = SHOW_MULTI_PRODUCER_EXPERIENCE
    ? [
        { label: t("footer.linkOurBrands"), href: "/artisans" },
        { label: t("footer.linkShopCosmetics"), href: "/products" },
        { label: t("footer.linkSellOnNevali"), href: "/auth/register" },
      ]
    : [
        { label: NEVALI_HOUSE_BRAND.navBrandLabel, href: `/artisans/${PLATFORM_OWNED_ORG_SLUG}` },
        { label: t("footer.linkShopCosmetics"), href: "/products" },
      ];

  const resources: FooterItem[] = SHOW_MULTI_PRODUCER_EXPERIENCE
    ? [
        { label: t("footer.linkTraining"), href: "/training" },
        { label: t("footer.linkQualityStandards"), href: "/products" },
        { label: t("footer.linkPartnerProgram"), href: "/auth/register" },
      ]
    : [
        { label: t("footer.linkTraining"), href: "/training" },
        { label: t("footer.linkQualityStandards"), href: "/products" },
      ];

  return [
    { heading: t("footer.columnPlatform"), items: platform },
    {
      heading: t("footer.columnCompany"),
      items: [
        { label: t("footer.linkAbout"), href: "/#about" },
        { label: t("footer.linkMission"), href: "/#mission" },
        { label: t("footer.linkContact"), href: "/contact" },
      ],
    },
    { heading: t("footer.columnResources"), items: resources },
  ];
}

export default async function Footer() {
  const t = await getTranslator();
  const sections = buildFooterSections(t);
  const SOCIAL = [
    { label: t("footer.socialInstagram"), href: "https://www.instagram.com", icon: "IG" },
    { label: t("footer.socialLinkedIn"), href: "https://www.linkedin.com", icon: "LI" },
    { label: t("footer.socialFacebook"), href: "https://www.facebook.com", icon: "FB" },
  ];

  return (
    <footer className="border-t border-cream-dark bg-paper">
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-16">
        <AnimateOnScroll className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4" direction="up">
          <div className="flex flex-col gap-5">
            <Link className="flex flex-col gap-1" href="/">
              <span
                className="font-bold font-display uppercase leading-none"
                style={{
                  fontSize: "22px",
                  letterSpacing: "0.08em",
                  color: "var(--color-primary-darker)",
                }}
              >
                {t("footer.brandWordmark")}
              </span>
              <span
                className="font-sans text-xs uppercase tracking-[0.2em]"
                style={{ color: "var(--color-primary-dark)" }}
              >
                {SHOW_MULTI_PRODUCER_EXPERIENCE ? t("footer.taglineMulti") : NEVALI_HOUSE_BRAND.lineUnderLogo}
              </span>
            </Link>
            <p className="max-w-[220px] font-sans text-xs leading-relaxed text-text-muted" style={{ maxWidth: "220px" }}>
              {SHOW_MULTI_PRODUCER_EXPERIENCE ? t("footer.blurbMulti") : NEVALI_HOUSE_BRAND.footerBlurb}
            </p>
            <div className="mt-1 flex items-center gap-3">
              {SOCIAL.map((s) => (
                <a
                  aria-label={s.label}
                  className="border border-primary/35 bg-white px-2 py-1 font-bold font-sans text-xs text-primary-dark uppercase tracking-wider transition-colors duration-200 hover:border-primary hover:text-primary-darker"
                  href={s.href}
                  key={s.label}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {sections.map((col) => (
            <div className="flex flex-col gap-4" key={col.heading}>
              <span
                className="font-sans font-semibold text-xs uppercase tracking-[0.2em]"
                style={{ color: "var(--color-primary-dark)" }}
              >
                {col.heading}
              </span>
              <ul className="flex flex-col gap-2.5">
                {col.items.map((item) => {
                  const external = item.href.startsWith("http");
                  return (
                    <li key={item.label}>
                      {external ? (
                        <a
                          className="font-sans text-sm text-text-muted transition-colors duration-200 hover:text-primary-darker"
                          href={item.href}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          className="font-sans text-sm text-text-muted transition-colors duration-200 hover:text-primary-darker"
                          href={item.href}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </AnimateOnScroll>
      </div>

      <AnimateOnScroll
        className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 border-t border-cream-dark px-6 py-4 sm:flex-row sm:items-center"
        delay={80}
        direction="up"
      >
        <span className="font-sans text-xs text-text-muted">{t("footer.copyright")}</span>
        <div className="flex items-center gap-4">
          <Link
            className="font-sans text-xs text-text-muted transition-colors duration-200 hover:text-primary-darker"
            href="/contact#privacy"
          >
            {t("footer.privacyPolicy")}
          </Link>
          <Link
            className="font-sans text-xs text-text-muted transition-colors duration-200 hover:text-primary-darker"
            href="/contact#terms"
          >
            {t("footer.termsOfService")}
          </Link>
        </div>
      </AnimateOnScroll>
    </footer>
  );
}
