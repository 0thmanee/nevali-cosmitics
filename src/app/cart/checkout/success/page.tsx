import type { Metadata } from "next";
import Link from "next/link";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import { getTranslator } from "~/lib/i18n/server";
import { CheckoutSuccessStripeSync } from "./checkout-success-stripe-sync";
import { CheckoutSuccessSummary } from "./checkout-success-summary";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslator();
	return {
		title: t("checkoutSuccess.metaTitle"),
		description: t("checkoutSuccess.metaDescription"),
	};
}

export default async function CartCheckoutSuccessPage({
	searchParams,
}: {
	searchParams: Promise<{ orderId?: string; session_id?: string }>;
}) {
	const { orderId, session_id: sessionId } = await searchParams;
	const t = await getTranslator();

	return (
		<main className="flex min-h-screen flex-col bg-cream">
			<Navbar />
			<section className="flex flex-1 flex-col items-center justify-center px-4 pt-[88px] pb-16">
				<div className="flex w-full max-w-lg flex-col items-center gap-6 pb-8 text-center">
					<div
						aria-hidden
						className="flex h-16 w-16 items-center justify-center rounded-full text-white"
						style={{ background: "var(--color-ink)" }}
					>
						<svg fill="none" height="28" viewBox="0 0 24 24" width="28">
							<path
								d="M5 12l5 5L20 7"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
							/>
						</svg>
					</div>
					<h1 className="font-bold font-serif text-3xl text-text-dark">
						{t("checkoutSuccess.title")}
					</h1>
					<p className="font-sans text-stone-600 leading-relaxed">
						{t("checkoutSuccess.body")}
					</p>
					{orderId ? (
						<p className="font-sans text-sm text-text-dark">
							{t("checkoutSuccess.referenceLabel")}{" "}
							<span className="break-all font-medium font-mono">{orderId}</span>
						</p>
					) : null}
					<p className="max-w-md font-sans text-stone-500 text-xs">
						{t("checkoutSuccess.guestNote")}
					</p>
					<CheckoutSuccessStripeSync orderId={orderId} sessionId={sessionId} />
					<CheckoutSuccessSummary orderId={orderId} />
					<div className="mt-4 flex flex-col gap-3 sm:flex-row">
						<Link
							className="rounded-sm bg-ink px-6 py-3 text-center font-sans font-semibold text-sm text-white transition-opacity hover:opacity-90"
							href="/products"
						>
							{t("checkoutSuccess.continueShopping")}
						</Link>
						<Link
							className="rounded-sm border border-cream-dark bg-white px-6 py-3 text-center font-sans font-semibold text-sm text-text-dark transition-colors hover:bg-cream"
							href="/"
						>
							{t("checkoutSuccess.home")}
						</Link>
					</div>
				</div>
			</section>
			<Footer />
		</main>
	);
}
