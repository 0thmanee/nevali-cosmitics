import Link from "next/link";
import React from "react";
import type { PublicProducerProfile } from "~/app/api/profile/schemas/profile.schema";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";

type Props = {
	producer: PublicProducerProfile;
};

export function PublicProducerPage({ producer }: Props) {
	const categories = producer.categories ?? [];
	const hasStory =
		producer.publicTagline?.trim() ||
		producer.businessDescription?.trim() ||
		producer.exportMarkets?.trim() ||
		producer.valuesHighlight?.trim();

	return (
		<div
			className="flex min-h-screen flex-col"
			style={{ background: "var(--color-paper)" }}
		>
			<header
				className="shrink-0 border-b"
				style={{
					background: "var(--color-paper)",
					borderColor: "var(--color-cream-dark)",
				}}
			>
				<div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
					<Link
						className="font-bold font-display text-[15px] text-text-dark uppercase tracking-wide"
						href="/"
					>
						nevali
					</Link>
					<Link
						className="font-sans text-sm text-text-muted transition-colors hover:text-text-dark"
						href="/auth/login"
					>
						Artisan login
					</Link>
				</div>
			</header>

			<main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
				<div
					className="overflow-hidden rounded-sm border"
					style={{
						background: "var(--color-paper)",
						borderColor: "var(--color-cream-dark)",
					}}
				>
					<div
						className="h-24 sm:h-28"
						style={{
							background:
								"linear-gradient(in oklab 90deg, oklab(14% 0.045 0.025) 0%, oklab(24% 0.07 0.038) 50%, oklab(36% 0.09 0.048) 100%)",
						}}
					/>
					<div className="-mt-12 px-6 pb-8 sm:px-8">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
							<div
								className="h-24 w-24 shrink-0 overflow-hidden rounded-sm border-4 border-white shadow-sm sm:h-28 sm:w-28"
								style={{ background: "var(--color-paper)" }}
							>
								{producer.profileImage ? (
									<img
										alt=""
										className="h-full w-full object-cover"
										src={producer.profileImage}
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center font-bold font-display text-2xl text-text-muted">
										{producer.entityName.slice(0, 2).toUpperCase()}
									</div>
								)}
							</div>
							<div className="min-w-0 flex-1 pt-2 sm:pt-0 sm:pb-1">
								<div className="flex flex-wrap items-center gap-2">
									<h1 className="font-bold font-display text-2xl text-text-dark uppercase leading-tight sm:text-3xl">
										{producer.entityName}
									</h1>
									<span
										className="rounded-full px-2.5 py-1 font-bold font-sans text-[9px] uppercase tracking-wider"
										style={{
											background:
												"color-mix(in srgb, var(--color-ink) 85%, transparent)",
											color: "var(--color-text-muted)",
											border:
												"1px solid color-mix(in srgb, var(--color-gold) 30%, transparent)",
										}}
									>
										Verified artisan
									</span>
								</div>
								<p className="mt-1 font-sans text-sm text-text-muted">
									{producer.entityType} · {producer.city}, {producer.region},
									Morocco
								</p>
								{producer.publicTagline?.trim() && (
									<p className="mt-3 font-medium font-sans text-base text-text-dark leading-snug">
										{producer.publicTagline}
									</p>
								)}
							</div>
						</div>

						<div className="mt-8 flex flex-wrap gap-2">
							{categories.map((c) => (
								<span
									className="rounded-full px-3 py-1 font-sans font-semibold text-[11px]"
									key={c}
									style={{
										background: "var(--color-cream-dark)",
										color: "var(--color-text-dark)",
										border:
											"1px solid color-mix(in srgb, var(--color-cream-dark) 70%, var(--color-paper))",
									}}
								>
									{c}
								</span>
							))}
						</div>

						{producer.yearEstablished?.trim() && (
							<p className="mt-6 font-sans text-sm text-text-muted">
								<span className="font-semibold text-text-dark">
									Established:
								</span>{" "}
								{producer.yearEstablished}
							</p>
						)}

						{producer.exportExperience?.trim() && (
							<p className="mt-2 font-sans text-sm text-text-muted">
								<span className="font-semibold text-text-dark">
									Export experience:
								</span>{" "}
								{producer.exportExperience}
							</p>
						)}

						{producer.annualCapacity?.trim() && (
							<p className="mt-2 font-sans text-sm text-text-muted">
								<span className="font-semibold text-text-dark">Capacity:</span>{" "}
								{producer.annualCapacity}
							</p>
						)}

						{producer.website?.trim() && (
							<p className="mt-2 font-sans text-sm">
								<span className="font-semibold text-text-dark">Website:</span>{" "}
								<a
									className="text-text-dark underline hover:no-underline"
									href={
										producer.website.startsWith("http")
											? producer.website
											: `https://${producer.website}`
									}
									rel="noopener noreferrer"
									target="_blank"
								>
									{producer.website}
								</a>
							</p>
						)}

						{hasStory && (
							<div
								className="mt-8 border-t pt-8"
								style={{ borderColor: "var(--color-cream-dark)" }}
							>
								{producer.businessDescription?.trim() && (
									<div className="mb-6">
										<h2 className="mb-2 font-bold font-display text-lg text-text-dark uppercase">
											About
										</h2>
										<p className="whitespace-pre-wrap font-sans text-[15px] text-text-dark leading-relaxed">
											{producer.businessDescription}
										</p>
									</div>
								)}
								{producer.exportMarkets?.trim() && (
									<div className="mb-6">
										<h2 className="mb-2 font-bold font-display text-lg text-text-dark uppercase">
											Export markets
										</h2>
										<p className="font-sans text-[15px] text-text-muted">
											{producer.exportMarkets}
										</p>
									</div>
								)}
								{producer.valuesHighlight?.trim() && (
									<div>
										<h2 className="mb-2 font-bold font-display text-lg text-text-dark uppercase">
											Values & practices
										</h2>
										<p className="font-sans text-[15px] text-text-muted">
											{producer.valuesHighlight}
										</p>
									</div>
								)}
							</div>
						)}

						<div
							className="mt-10 rounded-sm p-5"
							style={{
								background: "var(--color-cream-dark)",
								border:
									"1px solid color-mix(in srgb, var(--color-cream-dark) 70%, var(--color-paper))",
							}}
						>
							<p className="font-sans text-sm text-text-dark leading-relaxed">
								Interested in this brand’s line? Browse nevali for Moroccan
								cosmetics with transparent checkout—or open a buyer account for
								saved lists.
							</p>
							<div className="mt-4 flex flex-wrap gap-3">
								<Link
									className="rounded-sm px-5 py-2.5 font-sans font-semibold text-sm text-white transition-colors hover:opacity-90"
									href={
										SHOW_MULTI_PRODUCER_EXPERIENCE
											? "/auth/register"
											: "/auth/register-buyer"
									}
									style={{ background: "var(--color-ink)" }}
								>
									{SHOW_MULTI_PRODUCER_EXPERIENCE
										? "Get started"
										: "Create buyer account"}
								</Link>
								<Link
									className="rounded-sm px-5 py-2.5 font-sans font-semibold text-sm transition-colors"
									href="/"
									style={{
										background: "var(--color-paper)",
										color: "var(--color-text-dark)",
										border: "1px solid var(--color-cream-dark)",
									}}
								>
									Browse platform
								</Link>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
