"use client";

import { CheckCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import { STAT_ICON_COLOR, StatCard } from "~/components/stat-card";
import { useProducts } from "~/features/artisan/hooks/use-products";
import {
	ProductsFilterBar,
	type ProductsTab,
	ProductsTable,
	RejectedWarning,
} from ".";

export function ProductsPageClient() {
	const { t } = useI18n();
	const [activeTab, setActiveTab] = useState<ProductsTab>("All");
	const [search, setSearch] = useState("");

	const { data: allProducts = [], isLoading, isError } = useProducts();

	const { filtered, counts } = useMemo(() => {
		const tabStatus =
			activeTab === "All"
				? null
				: (activeTab.toUpperCase() as "APPROVED" | "PENDING" | "REJECTED");
		const filtered = allProducts.filter((p) => {
			const matchTabFilter = !tabStatus || p.status === tabStatus;
			const matchSearch =
				p.name.toLowerCase().includes(search.toLowerCase()) ||
				p.category.toLowerCase().includes(search.toLowerCase());
			return matchTabFilter && matchSearch;
		});
		const counts = {
			All: allProducts.length,
			Approved: allProducts.filter((p) => p.status === "APPROVED").length,
			Pending: allProducts.filter((p) => p.status === "PENDING").length,
			Rejected: allProducts.filter((p) => p.status === "REJECTED").length,
		};
		return { filtered, counts };
	}, [allProducts, activeTab, search]);

	return (
		<div className="flex flex-col gap-4">
			<div className="grid grid-cols-3 gap-3">
				<StatCard
					icon={<CheckCircle color={STAT_ICON_COLOR.green} size={20} />}
					label={t("producerProducts.statApproved")}
					value={counts.Approved}
					variant="green"
				/>
				<StatCard
					icon={<Clock color={STAT_ICON_COLOR.amber} size={20} />}
					label={t("producerProducts.statPendingReview")}
					value={counts.Pending}
					variant="amber"
				/>
				<StatCard
					icon={
						<XCircle
							color={
								counts.Rejected > 0
									? STAT_ICON_COLOR.red
									: STAT_ICON_COLOR.neutral
							}
							size={20}
						/>
					}
					label={t("producerProducts.statRejected")}
					value={counts.Rejected}
					variant={counts.Rejected > 0 ? "red" : "neutral"}
				/>
			</div>
			<ProductsFilterBar
				action={
					<Link
						className="rounded-sm bg-forest-dark px-4 py-2 font-sans font-semibold text-sm text-white transition-colors"
						href="/artisan/products/new"
					>
						{t("producerProducts.addProduct")}
					</Link>
				}
				activeTab={activeTab}
				counts={counts}
				onSearchChange={setSearch}
				onTabChange={setActiveTab}
				search={search}
			/>
			{isLoading ? (
				<div className="rounded-sm border border-cream-dark bg-white py-12 text-center font-sans text-sm text-text-muted">
					{t("producerProducts.loadingProducts")}
				</div>
			) : isError ? (
				<div className="rounded-sm border border-cream-dark bg-white py-12 text-center font-sans text-red-500 text-sm">
					{t("producerProducts.failedToLoadProducts")}
				</div>
			) : (
				<ProductsTable products={filtered} />
			)}
			{(activeTab === "All" || activeTab === "Rejected") && (
				<RejectedWarning
					count={counts.Rejected}
					rejectedProducts={allProducts.filter((p) => p.status === "REJECTED")}
				/>
			)}
		</div>
	);
}
