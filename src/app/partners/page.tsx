import Link from "next/link";
import Navbar from "~/app/Navbar";
import Footer from "~/app/Footer";
import { listPublicPartners } from "~/app/api/partners/public-actions";
import PartnersClient from "./PartnersClient";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";

export const metadata = {
  title: "Partners — nevali",
  description:
    "Explore our network of certified Moroccan cooperatives and producers — each rigorously audited for quality, traceability, and export compliance.",
};

export default async function PartnersPage() {
  const partners = await listPublicPartners();
  const partnerCount = partners.length;

  return (
    <main className="flex flex-col w-full min-h-screen pt-[56px]">
      <Navbar />

      {/* ── Hero ── */}
      <section className="bg-primary">
        <div className="max-w-7xl mx-auto px-6">

          {/* Breadcrumb */}
          <div className="py-4 flex items-center gap-2 font-sans text-xs tracking-[0.08em] uppercase text-white/40 border-b border-white/10">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/70">Partners</span>
          </div>

          {/* Headline row */}
          <div className="py-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <AnimateOnScroll direction="up" delay={0}>
              <p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary mb-5">
                {partnerCount > 0 ? `${partnerCount} Verified` : "Certified"} — Moroccan Artisans
              </p>
              <h1
                className="font-serif font-bold uppercase text-white leading-[1.0]"
                style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
              >
                The people<br />behind every<br />verified product
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll direction="up" delay={150} className="md:max-w-xs shrink-0">
              <p className="font-sans text-white/60 leading-relaxed text-sm mb-8">
                Explore our network of certified Moroccan cooperatives and artisans — each rigorously audited for quality, traceability, and export compliance.
              </p>
              {/* Stats row */}
              <div className="grid grid-cols-3 divide-x divide-white/10 border border-white/10">
                {[
                  { value: "12", label: "Regions" },
                  { value: "96%", label: "Audit Pass" },
                  { value: "3", label: "Standards" },
                ].map((stat) => (
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
