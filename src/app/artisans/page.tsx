import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import { listPublicPartners } from "~/app/api/partners/public-actions";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import PartnersClient from "~/app/partners/PartnersClient";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";

export const metadata = {
	title: SHOW_MULTI_PRODUCER_EXPERIENCE ? "Moroccan beauty brands — nevali" : `${NEVALI_HOUSE_BRAND.legalName} — our studio | nevali`,
	description: SHOW_MULTI_PRODUCER_EXPERIENCE
		? "Meet the verified Moroccan cosmetics makers behind nevali—bio-minded formulas, transparent sourcing, and stories rooted in terroir."
		: `Meet the team behind ${NEVALI_HOUSE_BRAND.legalName} Moroccan cosmetics—bio-minded formulas, transparent sourcing, and stories from our studio.`,
};

export default async function ArtisansDirectoryPage() {
	const partners = await listPublicPartners();

	return (
		<main className="flex min-h-screen w-full flex-col bg-cream pt-[56px]">
			<Navbar />

			<section className="bg-primary">
				<div className="max-w-7xl mx-auto px-6">
					{/* Breadcrumb */}
					<AnimateOnScroll className="py-4 flex items-center gap-2 font-sans text-xs tracking-[0.08em] uppercase text-white/40 border-b border-white/10" direction="down">
						<span>Home</span>
						<span>/</span>
						<span className="text-white/70">{SHOW_MULTI_PRODUCER_EXPERIENCE ? "Brands" : "Studio"}</span>
					</AnimateOnScroll>

					<div className="py-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
						<AnimateOnScroll direction="up">
						<div>
							<p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary mb-5">
								{SHOW_MULTI_PRODUCER_EXPERIENCE
									? "Verified Moroccan cosmetics makers"
									: `${NEVALI_HOUSE_BRAND.legalName} Moroccan cosmetics studio`}
							</p>
							<h1
								className="font-serif font-bold uppercase text-white leading-[1.0]"
								style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
							>
								{SHOW_MULTI_PRODUCER_EXPERIENCE ? (
									<>
										The makers
										<br />
										behind every
										<br />
										bio-minded SKU
									</>
								) : (
									<>
										Our studio,
										<br />
										your traceable
										<br />
										beauty line
									</>
								)}
							</h1>
						</div>
						</AnimateOnScroll>

						<AnimateOnScroll className="md:max-w-xs shrink-0 flex flex-col gap-6" delay={150} direction="up">
							<p className="font-sans text-white/60 leading-relaxed text-sm">
								{SHOW_MULTI_PRODUCER_EXPERIENCE ? (
									<>
										Independent labs, cooperatives, and founder-led houses—each reviewed for formulation integrity,
										documentation, and the ability to ship beautiful Moroccan cosmetics with confidence.
									</>
								) : (
									<>
										Formulation, compliance, and fulfilment stay under one roof at {NEVALI_HOUSE_BRAND.legalName} so every
										SKU ships with clarity, documentation you can read, and rituals you can trust.
									</>
								)}
							</p>
							<div className="flex gap-8">
								{[
									{ value: "12", label: "Regions" },
									{ value: "96%", label: "Audit pass" },
									{ value: "3", label: "Standards" },
								].map((s) => (
									<div key={s.label} className="flex flex-col gap-0.5">
										<span className="font-serif font-bold text-secondary" style={{ fontSize: "clamp(22px, 2.5vw, 32px)" }}>{s.value}</span>
										<span className="font-sans text-[10px] uppercase tracking-widest text-white/40">{s.label}</span>
									</div>
								))}
							</div>
						</AnimateOnScroll>
					</div>
				</div>
			</section>

			<PartnersClient partners={partners} />

			<Footer />
		</main>
	);
}
