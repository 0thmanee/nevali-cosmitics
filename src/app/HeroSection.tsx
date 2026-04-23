import Image from "next/image";
import Link from "next/link";
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
      <section className="relative w-full overflow-hidden bg-[#0a0a0a] text-white">
        <div className="mx-auto grid min-h-[min(88vh,900px)] w-full max-w-[1600px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div className="flex flex-col justify-center border-cream-dark/15 px-6 py-14 sm:px-10 sm:py-20 lg:border-r lg:py-24 lg:pl-14 lg:pr-10">
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-white/40">
              Featured
            </p>
            <p className="mt-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
              {featured.category}
            </p>
            <h1
              className="mt-4 font-serif font-semibold leading-[1.05] tracking-tight"
              style={{ fontSize: "clamp(2rem, 4.2vw, 3.35rem)" }}
            >
              {featured.name}
            </h1>
            {sub ? (
              <p className="mt-5 max-w-xl font-sans text-[15px] leading-relaxed text-white/55 line-clamp-4">
                {sub}
              </p>
            ) : null}
            {featured.capacity?.trim() ? (
              <p className="mt-3 font-sans text-sm text-white/40">{featured.capacity}</p>
            ) : null}
            <p className="mt-8 font-serif text-2xl font-semibold text-white">
              From {formatPriceMad(featured.fromPriceMad)}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href={`/products/${featured.id}`}
                className="inline-flex items-center justify-center border border-white bg-white px-7 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-black transition-opacity hover:opacity-90"
              >
                View product
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center border border-white/25 px-7 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-white/90 transition-colors hover:border-white/50 hover:bg-white/5"
              >
                Full catalog
              </Link>
            </div>
          </div>

          <div className="relative min-h-[320px] bg-[#ede6dc] lg:min-h-0">
            <Image
              src={imageSrc}
              alt=""
              fill
              className="object-contain object-center p-6 sm:p-10 lg:p-14"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent lg:bg-gradient-to-l"
              aria-hidden
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex w-full flex-col bg-[#0a0a0a]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pb-12 pt-12 sm:flex-row sm:items-end sm:justify-between md:pb-16 md:pt-16">
        <div className="flex max-w-xl flex-col gap-5">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-white/40">
            NEVALI
          </p>
          <h1
            className="font-serif font-semibold leading-[1.08] tracking-tight text-white"
            style={{ fontSize: "clamp(34px, 5.5vw, 58px)" }}
          >
            Moroccan heritage,
            <br />
            refined for today
          </h1>
          <p className="font-sans text-base leading-relaxed text-white/60">
            Premium skincare rooted in Morocco&apos;s natural wealth—transparent labels, ethical sourcing, and
            safety-first formulation. Discover the collection when you are ready.
          </p>
        </div>
        <div className="shrink-0">
          {SHOW_MULTI_PRODUCER_EXPERIENCE ? (
            <Link
              href="/auth/register"
              className="inline-block whitespace-nowrap border border-white/90 bg-white px-5 py-3 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-90"
            >
              List your brand
            </Link>
          ) : (
            <Link
              href="/products"
              className="inline-block whitespace-nowrap border border-white/90 bg-white px-5 py-3 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-90"
            >
              Shop the collection
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 pb-14">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-[#1a1a1a] sm:aspect-[21/9]">
          <Image
            src={COSMETICS_MARKETING.hero}
            alt="Moroccan skincare and serum bottles in a minimal beauty still life"
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" aria-hidden />
        </div>
      </div>
    </section>
  );
}
