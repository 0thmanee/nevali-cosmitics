import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import { COSMETICS_MARKETING, productPlaceholderImageUrl } from "~/lib/cosmetics-image-placeholders";
import { formatPriceMad } from "~/lib/format-price";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import { getFeaturedHomeHeroProductRepo } from "~/app/api/products/repo/products.repo";

function teaser(text: string | null, max = 200): string {
  const t = text?.trim() ?? "";
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

export default async function HeroSection() {
  const featured = await getFeaturedHomeHeroProductRepo();

  if (featured) {
    const imageSrc =
      featured.imageUrl ?? productPlaceholderImageUrl(`${featured.id}:hero`, 1200);
    const sub = teaser(featured.description);

    return (
      <section className="relative w-full overflow-hidden bg-linear-to-br from-cream via-paper to-cream-dark/30 text-text-dark">
        <div className="mx-auto grid min-h-[min(88vh,900px)] w-full max-w-[1600px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <AnimateOnScroll className="flex flex-col justify-center border-cream-dark px-6 py-14 sm:px-10 sm:py-20 lg:border-r lg:py-24 lg:pl-14 lg:pr-10" delay={0} direction="right">
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-primary/70">
              Featured
            </p>
            <p className="mt-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {featured.category}
            </p>
            <h1
              className="mt-4 font-serif font-semibold leading-[1.05] tracking-tight"
              style={{ fontSize: "clamp(2rem, 4.2vw, 3.35rem)" }}
            >
              {featured.name}
            </h1>
            {sub ? (
              <p className="mt-5 max-w-xl font-sans text-[15px] leading-relaxed text-text-muted line-clamp-4">
                {sub}
              </p>
            ) : null}
            {featured.capacity?.trim() ? (
              <p className="mt-3 font-sans text-sm text-text-muted">{featured.capacity}</p>
            ) : null}
            <p className="mt-8 font-serif text-2xl font-semibold text-primary-dark">
              From {formatPriceMad(featured.fromPriceMad)}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href={`/products/${featured.id}`}
                className="inline-flex items-center justify-center rounded-sm border border-primary bg-primary px-7 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90"
              >
                View product
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-sm border border-primary/40 bg-white/70 px-7 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark transition-colors hover:border-primary/70 hover:bg-white"
              >
                Full catalog
              </Link>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll className="relative min-h-[320px] bg-cream-dark/35 lg:min-h-0" delay={100} direction="left">
            <Image
              src={imageSrc}
              alt=""
              fill
              className="object-contain object-center p-6 sm:p-10 lg:p-14"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-primary/10 via-transparent to-transparent lg:bg-linear-to-l"
              aria-hidden
            />
          </AnimateOnScroll>
        </div>
      </section>
    );
  }

  return (
    <section className="flex w-full flex-col bg-linear-to-b from-paper to-cream-dark/30">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pb-12 pt-12 sm:flex-row sm:items-end sm:justify-between md:pb-16 md:pt-16">
        <AnimateOnScroll className="flex max-w-xl flex-col gap-5" delay={0} direction="up">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-primary/70">
            NEVALI
          </p>
          <h1
            className="font-serif font-semibold leading-[1.08] tracking-tight text-text-dark"
            style={{ fontSize: "clamp(34px, 5.5vw, 58px)" }}
          >
            Moroccan beauty,
            <br />
            softly reimagined
          </h1>
          <p className="font-sans text-base leading-relaxed text-text-muted">
            A calm marketplace for high-quality Moroccan cosmetics with transparent labels, ethical
            sourcing, and a gentle shopping experience designed for modern women.
          </p>
        </AnimateOnScroll>
        <AnimateOnScroll className="shrink-0" delay={120} direction="left">
          {SHOW_MULTI_PRODUCER_EXPERIENCE ? (
            <Link
              href="/auth/register"
              className="inline-block whitespace-nowrap rounded-sm border border-primary bg-primary px-5 py-3 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90"
            >
              List your brand
            </Link>
          ) : (
            <Link
              href="/products"
              className="inline-block whitespace-nowrap rounded-sm border border-primary bg-primary px-5 py-3 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90"
            >
              Shop the collection
            </Link>
          )}
        </AnimateOnScroll>
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 pb-14">
        <AnimateOnScroll className="relative aspect-16/10 w-full overflow-hidden rounded-sm bg-cream-dark/45 sm:aspect-21/9" delay={80} direction="up" scale>
          <Image
            src={COSMETICS_MARKETING.hero}
            alt="Moroccan skincare and serum bottles in a minimal beauty still life"
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
          <div className="absolute inset-0 bg-linear-to-t from-primary-darker/25 via-primary/5 to-transparent" aria-hidden />
        </AnimateOnScroll>
      </div>
    </section>
  );
}
