import Link from "next/link";
import React from "react";
import type { PublicProducerProfile } from "~/app/api/profile/schemas/profile.schema";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import { NEVALI_HOUSE_BRAND } from "~/lib/nevali-brand-copy";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";

type Props = {
	producer: PublicProducerProfile;
};

export function PublicArtisanPage({ producer }: Props) {
	const categories = producer.categories ?? [];

	const initial = producer.entityName.slice(0, 2).toUpperCase();

	return (
		<div className="flex min-h-screen flex-col bg-cream">
			<Navbar />

			{/* Hero banner */}
			<section className="bg-forest-dark pt-[56px]">
				<div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-14 sm:flex-row sm:items-end">
					{/* Avatar */}
					<div
						className="h-20 w-20 shrink-0 overflow-hidden border-2 border-white/20 sm:h-24 sm:w-24"
						style={{ background: "var(--color-ink)" }}
					>
						{producer.profileImage ? (
							<img
								alt=""
								className="h-full w-full object-cover"
								src={producer.profileImage}
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center font-bold font-display text-2xl text-secondary">
								{initial}
							</div>
						)}
					</div>

					{/* Identity */}
					<div className="flex flex-1 flex-col gap-3">
						<div className="flex flex-wrap items-center gap-3">
							<span
								className="border px-2.5 py-1 font-body font-bold text-[10px] uppercase tracking-[0.2em]"
								style={{
									borderColor:
										"color-mix(in srgb, var(--color-text-muted) 50%, transparent)",
									color: "var(--color-text-muted)",
								}}
							>
								{SHOW_MULTI_PRODUCER_EXPERIENCE
									? "Verified artisan"
									: NEVALI_HOUSE_BRAND.publicProfileBadge}
							</span>
							{producer.entityType && (
								<span className="font-body text-[11px] text-white/40 uppercase tracking-widest">
									{producer.entityType}
								</span>
							)}
						</div>
						<h1
							className="font-bold font-display text-white uppercase leading-[1.0]"
							style={{ fontSize: "clamp(28px, 4vw, 52px)" }}
						>
							{producer.entityName}
						</h1>
						<p className="font-body text-sm text-white/50">
							{producer.city}, {producer.region}, Morocco
							{producer.yearEstablished?.trim()
								? ` · Est. ${producer.yearEstablished}`
								: ""}
						</p>
					</div>

					{/* Back link — directory hidden while single-house-brand mode */}
					<Link
						className="flex shrink-0 items-center gap-1.5 font-body text-sm text-white/40 transition-colors hover:text-white/70"
						href={SHOW_MULTI_PRODUCER_EXPERIENCE ? "/artisans" : "/products"}
					>
						{SHOW_MULTI_PRODUCER_EXPERIENCE ? "← All artisans" : "← Shop"}
					</Link>
				</div>

				{/* Terracotta accent line at bottom */}
				<div
					className="h-0.5 w-full"
					style={{
						background:
							"linear-gradient(90deg, var(--color-ink) 0%, color-mix(in srgb, var(--color-ink) 70%, var(--color-text-muted)) 50%, var(--color-text-muted) 100%)",
					}}
				/>
			</section>

			{/* Main content */}
			<main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
					{/* Left: story + details */}
					<div className="flex flex-col gap-8 lg:col-span-2">
						{/* Tagline */}
						{producer.publicTagline?.trim() && (
							<p
								className="font-bold font-display text-primary uppercase leading-snug"
								style={{ fontSize: "clamp(18px, 2vw, 26px)" }}
							>
								{producer.publicTagline}
							</p>
						)}

						{/* Categories */}
						{categories.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{categories.map((c) => (
									<span
										className="border border-cream-dark bg-white px-3 py-1 font-body font-medium text-[11px] text-text-dark/80 uppercase tracking-wide"
										key={c}
									>
										{c}
									</span>
								))}
							</div>
						)}

						{/* About */}
						{producer.businessDescription?.trim() && (
							<div className="flex flex-col gap-3">
								<h2
									className="font-bold font-display text-text-dark uppercase"
									style={{ fontSize: 13, letterSpacing: "0.15em" }}
								>
									About
								</h2>
								<div className="h-px bg-cream-dark" />
								<p className="whitespace-pre-wrap font-body text-[15px] text-text-dark/80 leading-relaxed">
									{producer.businessDescription}
								</p>
							</div>
						)}

						{/* Export markets */}
						{producer.exportMarkets?.trim() && (
							<div className="flex flex-col gap-3">
								<h2
									className="font-bold font-display text-text-dark uppercase"
									style={{ fontSize: 13, letterSpacing: "0.15em" }}
								>
									Export Markets
								</h2>
								<div className="h-px bg-cream-dark" />
								<p className="font-body text-[15px] text-text-muted leading-relaxed">
									{producer.exportMarkets}
								</p>
							</div>
						)}

						{/* Values & practices */}
						{producer.valuesHighlight?.trim() && (
							<div className="flex flex-col gap-3">
								<h2
									className="font-bold font-display text-text-dark uppercase"
									style={{ fontSize: 13, letterSpacing: "0.15em" }}
								>
									Values & Practices
								</h2>
								<div className="h-px bg-cream-dark" />
								<p className="font-body text-[15px] text-text-muted leading-relaxed">
									{producer.valuesHighlight}
								</p>
							</div>
						)}
					</div>

					{/* Right sidebar */}
					<div className="flex flex-col gap-6">
						{/* Meta details card */}
						<div className="border border-cream-dark bg-white">
							<div
								className="border-cream-dark border-b px-5 py-3 font-bold font-display text-text-dark uppercase"
								style={{ fontSize: 11, letterSpacing: "0.15em" }}
							>
								Details
							</div>
							<div className="flex flex-col divide-y divide-cream-dark">
								{[
									{ label: "Type", value: producer.entityType },
									{ label: "Region", value: producer.region },
									{ label: "City", value: producer.city },
									{ label: "Established", value: producer.yearEstablished },
									{ label: "Export exp.", value: producer.exportExperience },
									{ label: "Annual capacity", value: producer.annualCapacity },
								]
									.filter((r) => r.value?.trim())
									.map((row) => (
										<div
											className="flex items-start gap-3 px-5 py-3"
											key={row.label}
										>
											<span className="w-28 shrink-0 font-body text-[11px] text-text-muted uppercase tracking-wider">
												{row.label}
											</span>
											<span className="font-body text-[13px] text-text-dark">
												{row.value}
											</span>
										</div>
									))}
								{producer.website?.trim() && (
									<div className="flex items-start gap-3 px-5 py-3">
										<span className="w-28 shrink-0 font-body text-[11px] text-text-muted uppercase tracking-wider">
											Website
										</span>
										<a
											className="break-all font-body text-[13px] text-primary hover:underline"
											href={
												producer.website.startsWith("http")
													? producer.website
													: `https://${producer.website}`
											}
											rel="noopener noreferrer"
											target="_blank"
										>
											{producer.website
												.replace(/^https?:\/\//, "")
												.replace(/\/$/, "")}
										</a>
									</div>
								)}
							</div>
						</div>

						{/* CTA card */}
						<div className="border border-cream-dark bg-white">
							<div
								className="h-1 w-full"
								style={{
									background:
										"linear-gradient(90deg, var(--color-ink) 0%, var(--color-text-muted) 100%)",
								}}
							/>
							<div className="flex flex-col gap-4 p-5">
								<p className="font-body text-sm text-text-dark/80 leading-relaxed">
									Interested in this brand’s cosmetics? Shop on nevali—guest
									checkout—or create a buyer account for lists and alerts.
								</p>
								{SHOW_MULTI_PRODUCER_EXPERIENCE ? (
									<Link
										className="inline-flex w-full items-center justify-center gap-2 bg-primary px-4 py-3 font-bold font-display text-sm text-white uppercase tracking-[0.1em] transition-opacity hover:opacity-90"
										href="/auth/register"
									>
										Get started →
									</Link>
								) : (
									<Link
										className="inline-flex w-full items-center justify-center gap-2 bg-primary px-4 py-3 font-bold font-display text-sm text-white uppercase tracking-[0.1em] transition-opacity hover:opacity-90"
										href="/auth/register-buyer"
									>
										Create buyer account →
									</Link>
								)}
								<Link
									className="inline-flex w-full items-center justify-center border border-cream-dark bg-cream px-4 py-2.5 font-body text-sm text-text-dark transition-colors hover:border-primary/30"
									href={
										SHOW_MULTI_PRODUCER_EXPERIENCE ? "/artisans" : "/products"
									}
								>
									{SHOW_MULTI_PRODUCER_EXPERIENCE
										? "Browse all artisans"
										: "Browse products"}
								</Link>
							</div>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
