import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "~/app/api/auth/actions";
import Footer from "~/app/Footer";
import Navbar from "~/app/Navbar";
import { getTranslator } from "~/lib/i18n/server";
import { CheckoutPageClient } from "./checkout-page-client";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslator();
	return {
		title: t("checkoutPage.metaTitle"),
		description: t("checkoutPage.metaDescription"),
	};
}

export default async function CartCheckoutPage({
	searchParams,
}: {
	searchParams: Promise<{ cancelled?: string }>;
}) {
	const { cancelled } = await searchParams;
	const session = await getSession();
	const u = session?.user;
	const role = (u as { role?: string } | undefined)?.role;
	const prefillName = role === "buyer" && u?.name?.trim() ? u.name.trim() : "";
	const prefillEmail =
		role === "buyer" && u?.email?.trim() ? u.email.trim() : "";
	const t = await getTranslator();

	return (
		<main className="flex min-h-screen flex-col bg-cream">
			<Navbar />
			<section className="flex-1 px-4 pt-[72px] pb-16">
				<div className="mx-auto w-full max-w-7xl">
					<nav className="mb-6 font-sans text-sm text-stone-500">
						<Link className="hover:text-text-dark" href="/">
							{t("checkoutPage.breadcrumbHome")}
						</Link>
						<span className="mx-2">/</span>
						<Link className="hover:text-text-dark" href="/cart">
							{t("checkoutPage.breadcrumbCart")}
						</Link>
						<span className="mx-2">/</span>
						<span className="font-medium text-text-dark">
							{t("checkoutPage.breadcrumbCheckout")}
						</span>
					</nav>
					<h1 className="mb-2 font-bold font-serif text-3xl text-text-dark">
						{t("checkoutPage.title")}
					</h1>
					<p className="mb-3 max-w-2xl font-sans text-sm text-stone-600">
						{t("checkoutPage.intro")}
					</p>
					<p className="mb-8 max-w-2xl rounded-sm border border-cream-dark bg-white px-4 py-3 font-sans text-sm text-stone-600">
						<span className="font-semibold text-text-dark">
							{t("checkoutPage.guestNoteBold")}
						</span>{" "}
						{t("checkoutPage.guestNoteRest")}
					</p>
					<CheckoutPageClient
						cancelled={cancelled === "1" || cancelled === "true"}
						initialEmail={prefillEmail}
						initialName={prefillName}
					/>
				</div>
			</section>
			<Footer />
		</main>
	);
}
