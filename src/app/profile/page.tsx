import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "~/app/api/auth/actions";
import { prisma } from "~/lib/db";
import { formatPriceMad } from "~/lib/format-price";
import type { ReviewRating } from "@prisma/client";
import { getLocale, getTranslator } from "~/lib/i18n/server";
import type { AppLocale } from "~/lib/i18n/config";
import { interpolate } from "~/lib/i18n/interpolate";

const RATING_VALUE: Record<ReviewRating, number> = {
	ONE: 1,
	TWO: 2,
	THREE: 3,
	FOUR: 4,
	FIVE: 5,
};

function paymentLabel(method: string, t: (key: string) => string): string {
	return method === "COD" ? t("profilePage.paymentCod") : method;
}

function statusLabel(status: string, t: (key: string) => string): string {
	if (status === "CONFIRMED") return t("profilePage.statusConfirmed");
	if (status === "PENDING_PAYMENT") return t("profilePage.statusPendingPayment");
	if (status === "CANCELLED") return t("profilePage.statusCancelled");
	if (status === "PENDING") return t("profilePage.statusPending");
	return status.replace(/_/g, " ");
}

export default async function ProfilePage() {
	const session = await getSession();
	if (!session?.user) {
		redirect("/auth/login?callbackUrl=" + encodeURIComponent("/profile"));
	}

	const userId = session.user.id;
	const email = (session.user.email ?? "").trim().toLowerCase();
	const t = await getTranslator();
	const locale = await getLocale();

	const [orders, reviews] = await Promise.all([
		prisma.shopOrder.findMany({
			where: {
				OR: [{ buyerUserId: userId }, { buyerUserId: null, buyerEmail: email }],
			},
			orderBy: { createdAt: "desc" },
			take: 20,
			include: {
				lines: {
					select: { productName: true, quantity: true, unitPrice: true },
					orderBy: { id: "asc" },
				},
			},
		}),
		prisma.productReview.findMany({
			where: {
				OR: [{ buyerEmail: email }, { buyerName: session.user.name ?? "" }],
			},
			orderBy: { createdAt: "desc" },
			take: 20,
			include: { product: { select: { id: true, name: true } } },
		}),
	]);

	return (
		<div className="mx-auto w-full max-w-5xl space-y-8 px-4 pb-12 pt-24 sm:px-6">
			<header className="space-y-1">
				<h1 className="font-serif text-3xl text-text-dark">{t("profilePage.title")}</h1>
				<p className="font-sans text-sm text-text-muted">{t("profilePage.subtitle")}</p>
			</header>

			<section className="space-y-4">
				<div className="flex items-baseline justify-between gap-3">
					<h2 className="font-serif text-xl text-text-dark">{t("profilePage.ordersTitle")}</h2>
					<Link className="font-sans text-sm text-primary hover:underline" href="/products">
						{t("profilePage.browseProducts")}
					</Link>
				</div>
				{orders.length === 0 ? (
					<div className="rounded-sm border border-cream-dark bg-white p-5 font-sans text-sm text-text-muted">
						{t("profilePage.noOrders")}
					</div>
				) : (
					<ul className="space-y-3">
						{orders.map((o) => {
							let total = 0;
							for (const l of o.lines) {
								const up = Number(l.unitPrice);
								total += (Number.isFinite(up) ? up : 0) * l.quantity;
							}
							return (
								<li key={o.id} className="rounded-sm border border-cream-dark bg-white p-4">
									<div className="flex flex-wrap items-baseline justify-between gap-2">
										<p className="font-sans text-sm font-semibold text-text-dark">
											{interpolate(t("profilePage.orderPrefix"), { id: o.id.slice(0, 8) })}
										</p>
										<p className="font-sans text-xs text-text-muted">
											{new Date(o.createdAt).toLocaleString(undefined, {
												dateStyle: "medium",
												timeStyle: "short",
											})}
										</p>
									</div>
									<div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-text-muted">
										<span>{statusLabel(o.status, t)}</span>
										<span>{paymentLabel(o.paymentMethod, t)}</span>
										<span>{formatPriceMad(total.toFixed(2), locale as AppLocale)}</span>
									</div>
									{o.lines.length > 0 ? (
										<p className="mt-2 font-sans text-xs text-stone-500">
											{o.lines.slice(0, 3).map((l) => l.productName).join(" · ")}
										</p>
									) : null}
								</li>
							);
						})}
					</ul>
				)}
			</section>

			<section className="space-y-4">
				<h2 className="font-serif text-xl text-text-dark">{t("profilePage.reviewsTitle")}</h2>
				{reviews.length === 0 ? (
					<div className="rounded-sm border border-cream-dark bg-white p-5 font-sans text-sm text-text-muted">
						{t("profilePage.reviewsEmpty")}
					</div>
				) : (
					<ul className="space-y-3">
						{reviews.map((r) => (
							<li key={r.id} className="rounded-sm border border-cream-dark bg-white p-4">
								<div className="flex flex-wrap items-baseline justify-between gap-2">
									<p className="font-sans text-sm font-semibold text-text-dark">{r.title}</p>
									<p className="font-sans text-xs text-text-muted">
										{"★".repeat(RATING_VALUE[r.rating])}
									</p>
								</div>
								<p className="mt-1 font-sans text-xs text-stone-500">
									{r.product
										? interpolate(t("profilePage.reviewsOnProduct"), { name: r.product.name })
										: t("profilePage.reviewsProductUnavailable")}
								</p>
								{r.body ? (
									<p className="mt-2 font-sans text-sm text-text-dark/90 leading-relaxed">{r.body}</p>
								) : null}
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
}

