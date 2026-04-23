import Image from "next/image";
import { COSMETICS_MARKETING } from "~/lib/cosmetics-image-placeholders";

export default function NewFutureSection() {
  return (
    <section id="mission" className="w-full bg-white py-16 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
        {/* Left: text */}
        <div className="w-full lg:flex-1 flex flex-col gap-5">
          <h2
            className="font-display font-bold uppercase leading-[1.0] text-text-dark"
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
              className="inline-block font-display font-semibold uppercase text-sm tracking-[0.15em] px-5 py-2.5 text-white"
              style={{ background: "#000000" }}
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
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)" }} />
          </div>

          {/* Photo 2 — spa / facial care */}
          <div className="rounded-sm overflow-hidden relative h-48 sm:h-64 lg:h-[340px]">
            <Image
              src={COSMETICS_MARKETING.creams}
              alt="Natural creams and botanical skincare textures"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
