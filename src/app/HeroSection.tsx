import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="w-full flex flex-col"
      style={{ background: "linear-gradient(to bottom, #7B1F0A 50%, #ffffff 50%)" }}
    >
      {/* Top: text + CTA */}
      <div className="max-w-7xl mx-auto w-full px-6 pt-10 pb-10 md:pb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div className="flex flex-col gap-4">
          <h1
            className="font-serif font-bold uppercase text-white leading-[1.05]"
            style={{ fontSize: "clamp(36px, 6vw, 72px)", letterSpacing: "-0.01em" }}
          >
            From Artisan<br />Hands to Markets
          </h1>
          <p className="font-sans text-white/70 leading-relaxed max-w-sm text-base">
            Connecting Morocco's master craftspeople with global markets where centuries of tradition meet modern commerce.
          </p>
        </div>
        <div className="shrink-0">
          <Link
            href="/auth/register"
            className="inline-block font-sans font-semibold uppercase text-white text-sm tracking-[0.15em] px-5 py-3 whitespace-nowrap"
            style={{ background: "#C87020" }}
          >
            Become Artisan
          </Link>
        </div>
      </div>

      {/* Bottom: image inside container on desktop, flex-1 on mobile to fill remaining height */}
      <div className="flex-1 flex flex-col w-full md:max-w-7xl md:mx-auto md:px-6 pb-0 md:pb-12">
        <div className="relative flex-1 w-full md:flex-none md:h-[50vw] md:max-h-[460px] min-h-[200px]">
          <Image
            src="https://images.unsplash.com/photo-1609597876248-e5f7c84f0295?q=80&w=2371&auto=format&fit=crop"
            alt="Moroccan medina — Fez tannery"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      </div>
    </section>
  );
}
