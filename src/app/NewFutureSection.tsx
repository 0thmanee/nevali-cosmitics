import Image from "next/image";

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
            A New Future<br />for Moroccan<br />Craftsmanship
          </h2>
          <p className="font-sans text-sm leading-relaxed text-text-muted max-w-sm">
            We bring Moroccan artisans to the world. Through an ethical and structured marketplace, we ensure fair trade,
            premium quality, and long-term sustainability — from local workshops to international customers.
          </p>
          <div className="mt-1">
            <a
              href="/training"
              className="inline-block font-display font-semibold uppercase text-sm tracking-[0.15em] px-5 py-2.5 text-white"
              style={{ background: "#1A0500" }}
            >
              Read More
            </a>
          </div>
        </div>

        {/* Right: 2-photo grid */}
        <div className="w-full lg:flex-1 grid grid-cols-2 gap-3">
          {/* Photo 1 — building with clothes */}
          <div className="rounded-sm overflow-hidden relative h-48 sm:h-64 lg:h-[340px]">
            <Image
              src="https://images.unsplash.com/photo-1669542873085-c46ebc6f1014?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0"
              alt="Moroccan medina building with traditional textiles"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,5,0,0.55) 0%, rgba(26,5,0,0.15) 60%, transparent 100%)" }} />
          </div>

          {/* Photo 2 — Moroccan scene */}
          <div className="rounded-sm overflow-hidden relative h-48 sm:h-64 lg:h-[340px]">
            <Image
              src="https://images.unsplash.com/photo-1530021853947-7d73da7acb70?q=80&w=800&auto=format&fit=crop"
              alt="Moroccan craftsmanship scene"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,5,0,0.55) 0%, rgba(26,5,0,0.15) 60%, transparent 100%)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
