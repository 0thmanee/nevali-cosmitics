import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import { getFeaturedHomeHeroProductRepo } from "~/app/api/products/repo/products.repo";
import type { ProductPaymentOptionValue } from "~/app/api/products/schemas/products.schema";
import { COSMETICS_MARKETING, productPlaceholderImageUrl } from "~/lib/cosmetics-image-placeholders";
import { formatPriceMad } from "~/lib/format-price";
import type { AppLocale } from "~/lib/i18n/config";
import { createJsonTranslator } from "~/lib/i18n/create-translator";
import { getMessages } from "~/lib/i18n/load-messages";
import { getLocale, getTranslator } from "~/lib/i18n/server";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";

function teaser(text: string | null, max = 200): string {
  const t = text?.trim() ?? "";
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

function ingredientsTeaser(raw: string | null, max = 118): string | null {
  const s = raw?.trim();
  if (!s) return null;
  const bits = s
    .split(/[,;]/)
    .map((b) => b.trim())
    .filter(Boolean)
    .slice(0, 5);
  const joined = bits.join(" · ");
  if (joined.length <= max) return joined;
  return `${joined.slice(0, max - 1).trim()}…`;
}

export default async function HeroSection() {
  const locale = await getLocale();
  const messages = getMessages(locale);
  const t = await getTranslator();
  const tj = createJsonTranslator(messages);
  const categoryLabels = tj<Record<string, string>>("hero.cosmeticsCategories");

  function cosmeticsCategoryLabel(code: string | null): string | null {
    if (!code) return null;
    return (
      categoryLabels[code] ??
      code
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())
    );
  }

  function paymentChips(option: ProductPaymentOptionValue | null): string[] {
    if (!option) return [];
    if (option === "BOTH") return [t("hero.paymentCard"), t("hero.paymentCod")];
    if (option === "CARD") return [t("hero.paymentCard")];
    return [t("hero.paymentCod")];
  }

  const featured = await getFeaturedHomeHeroProductRepo();

  if (featured) {
    const imageSrc = featured.imageUrl ?? productPlaceholderImageUrl(`${featured.id}:hero`, 1200);
    const sub = teaser(featured.description);
    const typedCategory = cosmeticsCategoryLabel(featured.cosmeticsCategory);
    const ingredientLine = ingredientsTeaser(featured.ingredients);
    const pay = paymentChips(featured.paymentOption);
    const moreVariants = Math.max(0, featured.variantCount - featured.variantsPreview.length);

    const categoryEyebrow =
      typedCategory && typedCategory.toLowerCase() !== featured.category.trim().toLowerCase()
        ? `${featured.category} · ${typedCategory}`
        : featured.category;
    const eyebrowParts = [
      t("hero.featuredEyebrow"),
      categoryEyebrow,
      SHOW_MULTI_PRODUCER_EXPERIENCE ? t("hero.partnerEyebrow") : null,
    ].filter(Boolean) as string[];

    return (
      <section className="w-full border-b border-stone-200 bg-paper text-text-dark">
        <div className="grid w-full lg:grid-cols-2">
          <AnimateOnScroll
            className="relative min-h-[min(50vh,480px)] w-full overflow-hidden lg:min-h-[min(88vh,960px)]"
            delay={0}
            direction="right"
          >
            <Image
              src={imageSrc}
              alt={featured.name}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </AnimateOnScroll>

          <AnimateOnScroll
            className="flex flex-col justify-center border-t border-stone-200 px-6 py-14 sm:px-10 lg:border-s lg:border-t-0 lg:py-20 lg:ps-14 lg:pe-12"
            delay={60}
            direction="left"
          >
            <div className="mx-auto w-full max-w-lg lg:mx-0 lg:max-w-xl">
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-text-muted">
                {eyebrowParts.join(" · ")}
              </p>
              {SHOW_MULTI_PRODUCER_EXPERIENCE ? (
                <Link
                  href={`/artisans/${featured.organizationSlug}`}
                  className="mt-3 inline-flex w-fit font-sans text-sm text-text-dark underline-offset-[5px] transition-opacity hover:opacity-70"
                >
                  {featured.organizationName}
                </Link>
              ) : (
                <p className="mt-3 font-sans text-sm text-text-dark">{featured.organizationName}</p>
              )}
              <h1
                className="mt-5 font-serif font-semibold leading-[1.08] tracking-tight text-text-dark"
                style={{ fontSize: "clamp(1.65rem, 3.2vw, 2.6rem)" }}
              >
                {featured.name}
              </h1>

              {featured.variantsPreview.length > 0 ? (
                <div className="mt-10 divide-y divide-stone-200 border-y border-stone-200">
                  {featured.variantsPreview.map((v, i) => (
                    <div key={`${featured.id}-hero-var-${i}`} className="flex items-start justify-between gap-8 py-4">
                      <div className="min-w-0">
                        <p className="font-sans text-sm leading-snug text-text-dark">{v.name}</p>
                        <p className="mt-1 font-sans text-xs uppercase tracking-[0.14em] text-text-muted">{v.unit}</p>
                        {!v.inStock ? (
                          <p className="mt-1 font-sans text-xs text-text-muted">{t("hero.unavailable")}</p>
                        ) : null}
                      </div>
                      <p className="shrink-0 font-serif text-base font-medium tabular-nums text-text-dark">
                        {formatPriceMad(v.priceMad, locale as AppLocale)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
              {moreVariants > 0 ? (
                <p className="mt-3 font-sans text-xs text-text-muted">
                  {moreVariants === 1
                    ? t("hero.variantMoreOne", { count: String(moreVariants) })
                    : t("hero.variantMoreMany", { count: String(moreVariants) })}
                </p>
              ) : null}

              {pay.length > 0 ? (
                <p className="mt-8 font-sans text-xs uppercase tracking-[0.14em] text-text-muted">{pay.join(" · ")}</p>
              ) : null}

              {sub ? (
                <p className="mt-8 max-w-lg font-sans text-[15px] leading-[1.65] text-text-muted">{sub}</p>
              ) : null}
              {featured.capacity?.trim() ? (
                <p className="mt-4 font-sans text-sm text-text-muted">{featured.capacity}</p>
              ) : null}
              {ingredientLine ? (
                <p className="mt-4 max-w-lg font-sans text-sm leading-relaxed text-text-muted">{ingredientLine}</p>
              ) : null}

              <p className="mt-10 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-text-muted">
                {t("hero.fromPrice")}{" "}
                <span className="font-serif text-2xl font-semibold normal-case tracking-normal text-text-dark sm:text-3xl">
                  {formatPriceMad(featured.fromPriceMad, locale as AppLocale)}
                </span>
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  href={`/products/${featured.id}`}
                  className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-text-dark underline underline-offset-[6px] transition-opacity hover:opacity-70"
                >
                  {t("hero.viewProduct")}
                </Link>
                <Link
                  href="/products"
                  className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-text-muted transition-opacity hover:opacity-70"
                >
                  {t("hero.allProducts")}
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    );
  }

  return (
    <section className="flex w-full flex-col bg-linear-to-b from-paper to-cream-dark/30">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pb-12 pt-12 sm:flex-row sm:items-end sm:justify-between md:pb-16 md:pt-16">
        <AnimateOnScroll className="flex max-w-xl flex-col gap-5" delay={0} direction="up">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-primary/70">{t("hero.fallbackKicker")}</p>
          <h1
            className="font-serif font-semibold leading-[1.08] tracking-tight text-text-dark"
            style={{ fontSize: "clamp(34px, 5.5vw, 58px)" }}
          >
            {t("hero.fallbackTitleLine1")}
            <br />
            {t("hero.fallbackTitleLine2")}
          </h1>
          <p className="font-sans text-base leading-relaxed text-text-muted">
            {SHOW_MULTI_PRODUCER_EXPERIENCE ? t("hero.fallbackBodyMulti") : t("hero.fallbackBodySingle")}
          </p>
        </AnimateOnScroll>
        <AnimateOnScroll className="shrink-0" delay={120} direction="left">
          {SHOW_MULTI_PRODUCER_EXPERIENCE ? (
            <Link
              href="/auth/register"
              className="inline-block whitespace-nowrap rounded-sm border border-primary bg-primary px-5 py-3 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90"
            >
              {t("hero.listYourBrand")}
            </Link>
          ) : (
            <Link
              href="/products"
              className="inline-block whitespace-nowrap rounded-sm border border-primary bg-primary px-5 py-3 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90"
            >
              {t("hero.shopTheCollection")}
            </Link>
          )}
        </AnimateOnScroll>
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 pb-14">
        <AnimateOnScroll
          className="relative aspect-16/10 w-full overflow-hidden rounded-sm bg-cream-dark/45 sm:aspect-21/9"
          delay={80}
          direction="up"
          scale
        >
          <Image
            src={COSMETICS_MARKETING.hero}
            alt={t("hero.heroImageAlt")}
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
          <div
            className="absolute inset-0 bg-linear-to-t from-primary-darker/25 via-primary/5 to-transparent"
            aria-hidden
          />
        </AnimateOnScroll>
      </div>
    </section>
  );
}
