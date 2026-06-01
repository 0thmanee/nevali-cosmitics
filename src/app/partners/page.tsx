import type { Metadata } from "next";
import Link from "next/link";
import { listPublicPartners } from "~/app/api/partners/public-actions";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import { getMessages } from "~/lib/i18n/load-messages";
import { getLocale, getTranslator } from "~/lib/i18n/server";
import PartnersClient from "./PartnersClient";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslator();
	return {
		title: t("partnersPage.metaTitle"),
		description: t("partnersPage.metaDescription"),
	};
}

export default async function PartnersPage() {
	const t = await getTranslator();
	const messages = getMessages(await getLocale());
	const partners = await listPublicPartners();
	const partnerCount = partners.length;
	const stats = messages.partnersPage.stats;

	return (
		<main className="flex min-h-screen w-full flex-col pt-[56px]">
			<Navbar />

			{/* ── Hero ── */}
			<section className="bg-primary">
				<div className="mx-auto max-w-7xl px-6">
					{/* Breadcrumb */}
					<AnimateOnScroll
						className="flex items-center gap-2 border-white/10 border-b py-4 font-sans text-white/40 text-xs uppercase tracking-[0.08em]"
						direction="down"
					>
						<Link className="transition-colors hover:text-white/70" href="/">
							{t("partnersPage.breadcrumbHome")}
						</Link>
						<span>/</span>
						<span className="text-white/70">
							{t("partnersPage.breadcrumbPartners")}
						</span>
					</AnimateOnScroll>

					{/* Headline row */}
					<div className="flex flex-col justify-between gap-10 py-20 md:flex-row md:items-end">
						<AnimateOnScroll delay={0} direction="up">
							<p className="mb-5 font-sans text-secondary text-xs uppercase tracking-[0.2em]">
								{partnerCount > 0
									? t("partnersPage.eyebrowVerifiedCount", {
											count: partnerCount,
										})
									: t("partnersPage.eyebrowCertified")}
							</p>
							<h1
								className="font-bold font-serif text-white uppercase leading-[1.0]"
								style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
							>
								{t("partnersPage.titleLine1")}
								<br />
								{t("partnersPage.titleLine2")}
								<br />
								{t("partnersPage.titleLine3")}
							</h1>
						</AnimateOnScroll>

						<AnimateOnScroll
							className="shrink-0 md:max-w-xs"
							delay={150}
							direction="up"
						>
							<p className="mb-8 font-sans text-sm text-white/60 leading-relaxed">
								{t("partnersPage.intro")}
							</p>
							{/* Stats row */}
							<div className="grid grid-cols-3 divide-x divide-white/10 border border-white/10">
								{stats.map((stat) => (
									<div
										className="flex flex-col items-center gap-1 px-3 py-4"
										key={stat.label}
									>
										<span className="font-bold font-serif text-2xl text-secondary leading-none">
											{stat.value}
										</span>
										<span className="mt-1 font-sans text-white/40 text-xs uppercase tracking-[0.15em]">
											{stat.label}
										</span>
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
