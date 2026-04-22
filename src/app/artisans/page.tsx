import { listPublicPartners } from "~/app/api/partners/public-actions";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import PartnersClient from "~/app/partners/PartnersClient";

export const metadata = {
	title: "Artisans — CraftHouse",
	description:
		"Browse verified Moroccan artisans and cooperatives on CraftHouse — certified profiles, traceable crafts, and export-ready partners.",
};

export default async function ArtisansDirectoryPage() {
	const partners = await listPublicPartners();

	return (
		<main className="flex min-h-screen w-full flex-col bg-cream pt-[56px]">
			<Navbar />

			<section className="bg-primary">
				<div className="max-w-7xl mx-auto px-6">
					{/* Breadcrumb */}
					<div className="py-4 flex items-center gap-2 font-sans text-xs tracking-[0.08em] uppercase text-white/40 border-b border-white/10">
						<span>Home</span>
						<span>/</span>
						<span className="text-white/70">Artisans</span>
					</div>

					<div className="py-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
						<div>
							<p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary mb-5">
								Verified artisans — Moroccan crafts
							</p>
							<h1
								className="font-serif font-bold uppercase text-white leading-[1.0]"
								style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
							>
								The people<br />behind every<br />verified product
							</h1>
						</div>

						<div className="md:max-w-xs shrink-0 flex flex-col gap-6">
							<p className="font-sans text-white/60 leading-relaxed text-sm">
								Explore our network of certified Moroccan cooperatives and artisans — each rigorously audited for quality, traceability, and export compliance.
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
						</div>
					</div>
				</div>
			</section>

			<PartnersClient partners={partners} />

			<Footer />
		</main>
	);
}
