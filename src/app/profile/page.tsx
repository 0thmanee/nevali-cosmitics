import type { ReviewRating } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "~/app/api/auth/actions";
import { prisma } from "~/lib/db";
import { formatPriceMad } from "~/lib/format-price";
import type { AppLocale } from "~/lib/i18n/config";
import { interpolate } from "~/lib/i18n/interpolate";
import { getLocale, getTranslator } from "~/lib/i18n/server";

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
	if (status === "PENDING_PAYMENT")
		return t("profilePage.statusPendingPayment");
	if (status === "CANCELLED") return t("profilePage.statusCancelled");
	if (status === "PENDING") return t("profilePage.statusPending");
	if (status === "NEW") return t("profilePage.statusNew");
	if (status === "SHIPPED") return t("profilePage.statusShipped");
	if (status === "CANCELED") return t("profilePage.statusCanceled");
	if (status === "RETURNED") return t("profilePage.statusReturned");
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
		<div className="mx-auto w-full max-w-5xl space-y-8 px-4 pt-24 pb-12 sm:px-6">
			<header className="space-y-1">
				<h1 className="font-serif text-3xl text-text-dark">
					{t("profilePage.title")}
				</h1>
				<p className="font-sans text-sm text-text-muted">
					{t("profilePage.subtitle")}
				</p>
			</header>

			<section className="space-y-4">
				<div className="flex items-baseline justify-between gap-3">
					<h2 className="font-serif text-text-dark text-xl">
						{t("profilePage.ordersTitle")}
					</h2>
					<Link
						className="font-sans text-primary text-sm hover:underline"
						href="/products"
					>
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
								<li
									className="rounded-sm border border-cream-dark bg-white p-4"
									key={o.id}
								>
									<div className="flex flex-wrap items-baseline justify-between gap-2">
										<p className="font-sans font-semibold text-sm text-text-dark">
											{interpolate(t("profilePage.orderPrefix"), {
												id: o.id.slice(0, 8),
											})}
										</p>
										<p className="font-sans text-text-muted text-xs">
											{new Date(o.createdAt).toLocaleString(undefined, {
												dateStyle: "medium",
												timeStyle: "short",
											})}
										</p>
									</div>
									<div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 font-sans text-text-muted text-xs">
										<span>{statusLabel(o.status, t)}</span>
										<span>{paymentLabel(o.paymentMethod, t)}</span>
										<span>
											{formatPriceMad(total.toFixed(2), locale as AppLocale)}
										</span>
									</div>
									{o.lines.length > 0 ? (
										<p className="mt-2 font-sans text-stone-500 text-xs">
											{o.lines
												.slice(0, 3)
												.map((l) => l.productName)
												.join(" · ")}
										</p>
									) : null}
								</li>
							);
						})}
					</ul>
				)}
			</section>

			<section className="space-y-4">
				<h2 className="font-serif text-text-dark text-xl">
					{t("profilePage.reviewsTitle")}
				</h2>
				{reviews.length === 0 ? (
					<div className="rounded-sm border border-cream-dark bg-white p-5 font-sans text-sm text-text-muted">
						{t("profilePage.reviewsEmpty")}
					</div>
				) : (
					<ul className="space-y-3">
						{reviews.map((r) => (
							<li
								className="rounded-sm border border-cream-dark bg-white p-4"
								key={r.id}
							>
								<div className="flex flex-wrap items-baseline justify-between gap-2">
									<p className="font-sans font-semibold text-sm text-text-dark">
										{r.title}
									</p>
									<p className="font-sans text-text-muted text-xs">
										{"★".repeat(RATING_VALUE[r.rating])}
									</p>
								</div>
								<p className="mt-1 font-sans text-stone-500 text-xs">
									{r.product
										? interpolate(t("profilePage.reviewsOnProduct"), {
												name: r.product.name,
											})
										: t("profilePage.reviewsProductUnavailable")}
								</p>
								{r.body ? (
									<p className="mt-2 font-sans text-sm text-text-dark/90 leading-relaxed">
										{r.body}
									</p>
								) : null}
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
}
