import Image from "next/image";
import Link from "next/link";
import { COSMETICS_MARKETING } from "~/lib/cosmetics-image-placeholders";

export default function HeroSection() {
  return (
    <section
      className="flex w-full flex-col"
      style={{
        background: "linear-gradient(to bottom, #000000 48%, #ede6dc 48%)",
      }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 pb-10 pt-10 sm:flex-row sm:items-end sm:justify-between md:pb-16">
        <div className="flex flex-col gap-4">
          <h1
            className="font-serif font-semibold leading-[1.08] tracking-tight text-white"
            style={{ fontSize: "clamp(34px, 5.5vw, 64px)" }}
          >
            Moroccan heritage,
            <br />
            refined for today
          </h1>
          <p className="max-w-md font-sans text-base leading-relaxed text-white/65">
            NEVALI is premium skincare rooted in Morocco&apos;s natural wealth—100% natural and
            organic where it matters, ethically sourced, and held to the highest safety standards.
            Transparency from cooperative to bottle, in a calm, minimal aesthetic.
          </p>
        </div>
        <div className="shrink-0">
          <Link
            href="/auth/register"
            className="inline-block whitespace-nowrap border border-white/90 bg-white px-5 py-3 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-90"
          >
            List your brand
          </Link>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col pb-0 md:mx-auto md:max-w-7xl md:px-6 md:pb-12">
        <div className="relative min-h-[200px] w-full flex-1 md:h-[50vw] md:max-h-[460px] md:flex-none">
          <Image
            src={COSMETICS_MARKETING.hero}
            alt="Moroccan skincare and serum bottles in a minimal beauty still life"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>
      </div>
    </section>
  );
}
