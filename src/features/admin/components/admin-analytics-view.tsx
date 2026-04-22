"use client";

import Link from "next/link";
import { useAdminSalesAnalytics } from "../hooks/use-admin-analytics";
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
	const { data, isPending, isError } = useAdminSalesAnalytics(selectedOrganizationId);

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
					<p className="font-sans text-red-600 text-sm">Could not load analytics.</p>
				</div>
			</AdminPageWrapper>
		);
	}

	const rfqMax      = Math.max(1, ...Object.values(data.rfqByStatus));
	const contractMax = Math.max(1, ...Object.values(data.contractByStatus));

	return (
		<AdminPageWrapper>
			{/* Header card */}
			<div className="flex flex-col gap-3 border border-cream-dark bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="font-bold font-serif text-lg text-text-dark">Sales &amp; pipeline</h2>
					<p className="mt-1 font-sans text-text-muted text-xs">
						RFQ and contract counts from the database. Contract totals use stored value fields where present.
					</p>
				</div>
				<a
					className="inline-flex items-center justify-center border border-cream-dark bg-cream px-4 py-2 font-sans font-semibold text-text-dark text-sm hover:bg-cream-dark transition-colors"
					href="/api/admin/reports/sales-summary"
				>
					Download PDF summary
				</a>
			</div>

			{/* Stat grid */}
			<div className="grid gap-4 md:grid-cols-3">
				{[
					{ label: "RFQs",         value: data.rfqCountAll },
					{ label: "Contracts",     value: data.contractCountAll },
					{ label: "Value sum (€)", value: data.contractValueSumEuro },
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

			{/* Bar charts */}
			<div className="grid gap-4 lg:grid-cols-2">
				<div className="border border-cream-dark bg-white p-5">
					<h3 className="mb-4 font-sans font-semibold text-sm text-text-dark uppercase tracking-[0.08em]">
						RFQs by status
					</h3>
					<div className="flex flex-col gap-3">
						{Object.entries(data.rfqByStatus).map(([k, v]) => (
							<Bar key={k} label={k} max={rfqMax} value={v} />
						))}
					</div>
				</div>
				<div className="border border-cream-dark bg-white p-5">
					<h3 className="mb-4 font-sans font-semibold text-sm text-text-dark uppercase tracking-[0.08em]">
						Contracts by status
					</h3>
					<div className="flex flex-col gap-3">
						{Object.entries(data.contractByStatus).map(([k, v]) => (
							<Bar key={k} label={k} max={contractMax} value={v} />
						))}
					</div>
				</div>
			</div>

			{/* Top orgs table */}
			<div className="border border-cream-dark bg-white p-5">
				<h3 className="mb-4 font-sans font-semibold text-sm text-text-dark uppercase tracking-[0.08em]">
					Top organizations by recorded contract value
				</h3>
				<div className="overflow-x-auto">
					<table className="w-full text-left font-sans text-sm">
						<thead className="border-cream-dark border-b text-text-muted">
							<tr>
								<th className="py-2 pr-4 font-bold text-xs uppercase tracking-[0.08em]">Organization</th>
								<th className="py-2 pr-4 font-bold text-xs uppercase tracking-[0.08em]">Contracts</th>
								<th className="py-2 font-bold text-xs uppercase tracking-[0.08em]">Value (€)</th>
							</tr>
						</thead>
						<tbody>
							{data.topOrganizationsByContractValue.map((o) => (
								<tr className="border-cream-dark/60 border-b last:border-0" key={o.organizationId}>
									<td className="py-2.5 pr-4">
										<Link
											className="font-medium text-primary hover:underline"
											href={`/artisans/${o.slug}`}
										>
											{o.name}
										</Link>
									</td>
									<td className="py-2.5 pr-4 text-text-muted">{o.contractCount}</td>
									<td className="py-2.5">{Math.round(o.valueCents / 100)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</AdminPageWrapper>
	);
}
