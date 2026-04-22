"use client";

import Link from "next/link";
import { useAdminShopOrderAnalytics } from "../hooks/use-admin-analytics";
import { useAdminOrganizationFilter } from "../hooks/use-admin-organizations";
import { AdminPageWrapper } from "./admin-ui";

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
	const pct = max > 0 ? Math.round((value / max) * 100) : 0;
	return (
		<div className="font-sans text-sm">
			<div className="mb-0.5 flex justify-between text-text-muted">
				<span>{label}</span>
				<span className="font-semibold text-text-dark">{value}</span>
			</div>
			<div className="h-2 overflow-hidden bg-cream-dark">
				<div
					className="h-full bg-primary transition-all"
					style={{ width: `${pct}%` }}
				/>
			</div>
		</div>
	);
}

export function AdminAnalyticsView() {
	const { selectedOrganizationId } = useAdminOrganizationFilter();
	const { data, isPending, isError } = useAdminShopOrderAnalytics(selectedOrganizationId);

	if (isPending) {
		return (
			<AdminPageWrapper>
				<div className="border border-cream-dark bg-white px-5 py-12 text-center">
					<p className="font-sans text-sm text-text-muted">Loading analytics…</p>
				</div>
			</AdminPageWrapper>
		);
	}
	if (isError || !data) {
		return (
			<AdminPageWrapper>
				<div className="border border-cream-dark bg-white px-5 py-6">
					<p className="font-sans text-sm text-red-600">Could not load analytics.</p>
				</div>
			</AdminPageWrapper>
		);
	}

	const statusMax = Math.max(1, ...data.ordersByStatus.map((r) => r.count));

	return (
		<AdminPageWrapper>
			<div className="flex flex-col gap-3 border border-cream-dark bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="font-bold font-serif text-lg text-text-dark">Catalog orders</h2>
					<p className="mt-1 font-sans text-text-muted text-xs">
						Confirmed revenue sums line totals (MAD) from paid or COD-confirmed checkout. Filter
						by organization using the selector in the header.
					</p>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				{[
					{ label: "Total orders", value: data.totalOrdersCount },
					{ label: "Confirmed orders", value: data.confirmedOrdersCount },
					{ label: "Confirmed revenue (MAD)", value: data.confirmedRevenueMad },
				].map((item) => (
					<div key={item.label} className="border border-cream-dark bg-white p-5">
						<p className="font-bold font-sans text-text-muted text-xs uppercase tracking-[0.1em]">
							{item.label}
						</p>
						<p className="mt-1 font-bold font-sans text-3xl text-text-dark leading-none">
							{item.value}
						</p>
					</div>
				))}
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<div className="border border-cream-dark bg-white p-5">
					<h3 className="mb-4 font-sans font-semibold text-sm text-text-dark uppercase tracking-[0.08em]">
						Orders by status
					</h3>
					{data.ordersByStatus.length === 0 ? (
						<p className="font-sans text-sm text-text-muted">No orders yet.</p>
					) : (
						<div className="flex flex-col gap-3">
							{data.ordersByStatus.map((row) => (
								<Bar key={row.status} label={row.status} max={statusMax} value={row.count} />
							))}
						</div>
					)}
				</div>
				<div className="border border-cream-dark bg-white p-5">
					<h3 className="mb-4 font-sans font-semibold text-sm text-text-dark uppercase tracking-[0.08em]">
						Pipeline summary
					</h3>
					<ul className="space-y-2 font-sans text-sm text-text-muted">
						<li>
							<span className="font-medium text-text-dark">{data.pendingPaymentCount}</span>{" "}
							awaiting card payment
						</li>
						<li>
							<span className="font-medium text-text-dark">{data.otherStatusCount}</span> other
							status (incl. cancelled / legacy)
						</li>
					</ul>
				</div>
			</div>

			<div className="border border-cream-dark bg-white p-5">
				<h3 className="mb-4 font-sans font-semibold text-sm text-text-dark uppercase tracking-[0.08em]">
					Top organizations by confirmed revenue
				</h3>
				<div className="overflow-x-auto">
					<table className="w-full text-left font-sans text-sm">
						<thead className="border-cream-dark border-b text-text-muted">
							<tr>
								<th className="py-2 pr-4 font-bold text-xs uppercase tracking-[0.08em]">
									Organization
								</th>
								<th className="py-2 pr-4 font-bold text-xs uppercase tracking-[0.08em]">
									Line items
								</th>
								<th className="py-2 font-bold text-xs uppercase tracking-[0.08em]">
									Revenue (MAD)
								</th>
							</tr>
						</thead>
						<tbody>
							{data.topOrganizations.length === 0 ? (
								<tr>
									<td className="py-4 text-text-muted" colSpan={3}>
										No confirmed order lines yet.
									</td>
								</tr>
							) : (
								data.topOrganizations.map((o) => (
									<tr className="border-cream-dark/60 border-b last:border-0" key={o.organizationId}>
										<td className="py-2.5 pr-4">
											<Link
												className="font-medium text-primary hover:underline"
												href={`/artisans/${o.slug}`}
											>
												{o.name}
											</Link>
										</td>
										<td className="py-2.5 pr-4 text-text-muted">{o.lineItems}</td>
										<td className="py-2.5">{o.revenueMad}</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</AdminPageWrapper>
	);
}
