"use client";

import React, { useState } from "react";

const faqs = [
	{
		q: "What is nevali?",
		a: "nevali is Morocco’s curated cosmetics marketplace: bio-minded, original formulas from independent Moroccan brands—sold online with guest checkout, clear ingredients, and certifications you can trust.",
	},
	{
		q: "How do brands get listed?",
		a: "Partners register, submit company and product documentation, and go through admin review. Listings cover INCI-style ingredients, imagery, variants, and payment options (card and/or cash on delivery). Approved products appear in the public catalog.",
	},
	{
		q: "What kinds of products can I find?",
		a: "Skincare, haircare, body and hammam rituals, botanical oils (including argan), fragrances, and accessories—focused on Moroccan origin and responsible formulation rather than generic white-label imports.",
	},
	{
		q: "Do I need an account to buy?",
		a: "No. You can browse, add to cart, and check out as a guest. Creating a free buyer account is optional if you want saved lists, alerts, and order history when your email matches checkout.",
	},
	{
		q: "How can I verify a product or brand?",
		a: "Each listing shows the brand behind the SKU. Partners can upload certifications (separate from product approval) and admins verify documents. Product pages highlight ingredients and origin so you know what you are applying.",
	},
	{
		q: "What are the fees?",
		a: "Browsing is free. Commercial terms for partners (subscriptions or success fees) are agreed in onboarding. Buyers pay product and shipping prices shown at checkout—no hidden RFQ layer.",
	},
];

export default function FAQSection() {
	const [open, setOpen] = useState(0);

	return (
		<section className="py-16 lg:py-24" style={{ background: "#ffffff" }}>
			<div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-4 sm:px-6 lg:gap-16 lg:px-12">
				<div className="flex flex-col items-center gap-5 text-center">
					<div className="flex items-center gap-3">
						<div className="h-px w-10 bg-secondary/40" />
						<svg width="18" height="18" viewBox="0 0 22 22" fill="none">
							<path
								d="M11 2l2 6h6l-5 3.6 1.8 6L11 14l-4.8 3.6 1.8-6L3 8h6L11 2z"
								stroke="#727272"
								strokeWidth="1.8"
								strokeLinejoin="round"
							/>
						</svg>
						<span className="font-sans text-sm font-semibold tracking-[0.18em] text-secondary uppercase">
							Frequently Asked Questions
						</span>
						<svg width="18" height="18" viewBox="0 0 22 22" fill="none">
							<path
								d="M11 2l2 6h6l-5 3.6 1.8 6L11 14l-4.8 3.6 1.8-6L3 8h6L11 2z"
								stroke="#727272"
								strokeWidth="1.8"
								strokeLinejoin="round"
							/>
						</svg>
						<div className="h-px w-10 bg-secondary/40" />
					</div>

					<h2 className="font-serif font-bold text-4xl text-text-dark leading-tight md:text-5xl">
						Everything you need
						<br />
						to know
					</h2>

					<p className="max-w-[480px] font-sans text-lg text-text-muted leading-relaxed">
						For shoppers discovering Moroccan beauty, and for brands joining the nevali
						marketplace.
					</p>
				</div>

				<div className="mx-auto flex w-full max-w-[820px] flex-col">
					{faqs.map((faq, i) => (
						<div className="border-cream-dark border-b" key={faq.q}>
							<button
								className="flex w-full items-center justify-between gap-6 py-7 text-left"
								onClick={() => setOpen(open === i ? -1 : i)}
								type="button"
							>
								<span className="font-sans font-semibold text-lg text-text-dark leading-snug">
									{faq.q}
								</span>
								<div
									className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border"
									style={{ borderColor: "#d4c4a0" }}
								>
									<span
										className="text-base text-secondary leading-none"
										style={{ marginTop: -1 }}
									>
										{open === i ? "−" : "+"}
									</span>
								</div>
							</button>
							{open === i ? (
								<p className="max-w-[720px] pb-7 font-sans text-base text-text-muted leading-relaxed">
									{faq.a}
								</p>
							) : null}
						</div>
					))}

					<div
						className="mt-8 flex flex-col gap-4 rounded-2xl px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8"
						style={{ background: "#ffffff", border: "1px solid #d8d0c4" }}
					>
						<div>
							<p className="mb-0.5 font-sans font-semibold text-base text-text-dark">
								Still have questions?
							</p>
							<p className="font-sans text-sm text-text-muted">
								Our team typically responds within one business day.
							</p>
						</div>
						<button
							className="flex shrink-0 items-center gap-2 rounded-xl px-6 py-3 font-sans font-semibold text-sm text-white transition-colors"
							style={{ background: "#000000" }}
							type="button"
						>
							Contact Support
							<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
								<path
									d="M2 7h10M8 3l4 4-4 4"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.5"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
