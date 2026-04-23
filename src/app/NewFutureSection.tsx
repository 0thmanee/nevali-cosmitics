import Image from "next/image";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import { COSMETICS_MARKETING } from "~/lib/cosmetics-image-placeholders";

export default function NewFutureSection() {
  return (
    <section id="mission" className="w-full bg-paper py-16 lg:py-28">
      <AnimateOnScroll className="mx-auto flex max-w-7xl flex-col items-start gap-10 px-6 lg:flex-row lg:gap-16" direction="up">
        {/* Left: text */}
        <div className="w-full lg:flex-1 flex flex-col gap-5">
          <h2
            className="font-display font-bold uppercase leading-none text-text-dark"
            style={{ fontSize: "clamp(32px, 5vw, 44px)", letterSpacing: "-0.01em" }}
          >
            Moroccan beauty,<br />made traceable<br />and modern
          </h2>
          <p className="font-sans text-sm leading-relaxed text-text-muted max-w-sm">
            We spotlight independent labs and cooperatives that formulate with local botanicals—argan, rose,
            ghassoul, and beyond—while giving shoppers a calm, certified path from discovery to delivery.
          </p>
          <div className="mt-1">
            <a
              href="/training"
            className="inline-block rounded-sm border border-primary bg-primary px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white"
            >
              Read More
            </a>
          </div>
        </div>

        {/* Right: 2-photo grid */}
        <div className="w-full lg:flex-1 grid grid-cols-2 gap-3">
          {/* Photo 1 — skincare flatlay */}
          <div className="rounded-sm overflow-hidden relative h-48 sm:h-64 lg:h-[340px]">
            <Image
              src={COSMETICS_MARKETING.flatlay}
              alt="Luxury skincare jars and droppers on marble"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, color-mix(in srgb, var(--color-primary-darker) 32%, transparent) 0%, color-mix(in srgb, var(--color-primary-darker) 8%, transparent) 60%, transparent 100%)" }} />
          </div>

          {/* Photo 2 — spa / facial care */}
          <div className="rounded-sm overflow-hidden relative h-48 sm:h-64 lg:h-[340px]">
            <Image
              src={COSMETICS_MARKETING.creams}
              alt="Natural creams and botanical skincare textures"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, color-mix(in srgb, var(--color-primary-darker) 32%, transparent) 0%, color-mix(in srgb, var(--color-primary-darker) 8%, transparent) 60%, transparent 100%)" }} />
          </div>
        </div>
      </AnimateOnScroll>
    </section>
  );
}
