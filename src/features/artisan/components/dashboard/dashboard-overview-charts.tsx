"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ComposedChart,
	Legend,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { ProducerDashboardStats } from "~/app/api/dashboard/dashboard.types";
import { useI18n } from "~/components/i18n/i18n-provider";
import { useFormatPrice } from "~/components/i18n/use-format-price";
import type { AppLocale } from "~/lib/i18n/config";
import { INTL_LOCALE_TAG } from "~/lib/i18n/config";
import type { Translator } from "~/lib/i18n/create-translator";
import { interpolate } from "~/lib/i18n/interpolate";

const CHART_AXIS = {
	fill: "var(--color-text-muted)",
	fontSize: 11,
	fontFamily: "var(--font-roboto-mono), ui-monospace, monospace",
};
const GRID = "var(--color-cream-dark)";
const INK = "var(--color-ink)";
const MUTED = "var(--color-text-muted)";

function shortDayLabel(isoDay: string, locale: AppLocale): string {
	const d = new Date(`${isoDay}T12:00:00.000Z`);
	const tag = INTL_LOCALE_TAG[locale] ?? INTL_LOCALE_TAG.en;
	return d.toLocaleDateString(tag, { month: "short", day: "numeric" });
}

function normalizeCatalogByStatus(
	rows: ProducerDashboardStats["productsByStatus"],
	t: Translator,
): { label: string; count: number }[] {
	const m = new Map(rows.map((r) => [r.status, r.count]));
	return [
		{
			label: t("artisanDashboardCharts.statusLive"),
			count: m.get("APPROVED") ?? 0,
		},
		{
			label: t("artisanDashboardCharts.statusReview"),
			count: m.get("PENDING") ?? 0,
		},
		{
			label: t("artisanDashboardCharts.statusRejected"),
			count: m.get("REJECTED") ?? 0,
		},
	];
}

const tooltipBox = {
	backgroundColor: "var(--color-paper)",
	border: "1px solid var(--color-cream-dark)",
	borderRadius: 0,
	fontSize: 12,
	fontFamily: "var(--font-roboto-mono), ui-monospace, monospace",
	color: "var(--color-ink)",
};

type Props = {
	stats: ProducerDashboardStats | undefined;
	isLoading: boolean;
};

function ChartFrame({
	title,
	description,
	children,
}: {
	title: string;
	description: string;
	children: ReactNode;
}) {
	return (
		<div className="flex min-h-[320px] flex-col border border-cream-dark bg-paper">
			<div className="border-cream-dark border-b px-5 py-4">
				<h3 className="font-semibold font-serif text-base text-text-dark">
					{title}
				</h3>
				<p className="mt-1 font-sans text-text-muted text-xs leading-relaxed">
					{description}
				</p>
			</div>
			<div className="min-h-[240px] flex-1 p-4 sm:p-5">{children}</div>
		</div>
	);
}

export function DashboardOverviewCharts({ stats, isLoading }: Props) {
	const { locale, t } = useI18n();
	const { formatMad } = useFormatPrice();

	const catalogBars = useMemo(
		() => normalizeCatalogByStatus(stats?.productsByStatus ?? [], t),
		[stats?.productsByStatus, t],
	);

	const orderSeries = useMemo(() => {
		const pts = stats?.orderVolumeByDay ?? [];
		return pts.map((p) => ({
			...p,
			label: shortDayLabel(p.day, locale),
		}));
	}, [stats?.orderVolumeByDay, locale]);

	const topBars = useMemo(() => {
		const rows = stats?.topProducts ?? [];
		return rows.map((r) => ({
			...r,
			name:
				r.productName.length > 36
					? `${r.productName.slice(0, 34)}…`
					: r.productName,
			fullName: r.productName,
		}));
	}, [stats?.topProducts]);

	if (isLoading && !stats) {
		return (
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{[0, 1].map((i) => (
					<div
						aria-hidden
						className="h-[320px] animate-pulse border border-cream-dark bg-paper"
						key={i}
					/>
				))}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<ChartFrame
					description={t("artisanDashboardCharts.catalogDesc")}
					title={t("artisanDashboardCharts.catalogTitle")}
				>
					<ResponsiveContainer height={260} width="100%">
						<BarChart
							data={catalogBars}
							margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
						>
							<CartesianGrid
								stroke={GRID}
								strokeDasharray="3 3"
								vertical={false}
							/>
							<XAxis
								axisLine={{ stroke: GRID }}
								dataKey="label"
								tick={CHART_AXIS}
								tickLine={false}
							/>
							<YAxis
								allowDecimals={false}
								axisLine={false}
								tick={CHART_AXIS}
								tickLine={false}
								width={36}
							/>
							<Tooltip
								contentStyle={tooltipBox}
								cursor={{
									fill: "color-mix(in srgb, var(--color-cream-dark) 35%, transparent)",
								}}
								formatter={(value) => [
									Number(value ?? 0),
									t("artisanDashboardCharts.legendProducts"),
								]}
							/>
							<Bar
								dataKey="count"
								fill={INK}
								maxBarSize={56}
								name={t("artisanDashboardCharts.legendProducts")}
								radius={[2, 2, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				</ChartFrame>

				<ChartFrame
					description={t("artisanDashboardCharts.orders14Desc")}
					title={t("artisanDashboardCharts.orders14Title")}
				>
					<ResponsiveContainer height={260} width="100%">
						<ComposedChart
							data={orderSeries}
							margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
						>
							<CartesianGrid
								stroke={GRID}
								strokeDasharray="3 3"
								vertical={false}
							/>
							<XAxis
								axisLine={{ stroke: GRID }}
								dataKey="label"
								tick={CHART_AXIS}
								tickLine={false}
							/>
							<YAxis
								allowDecimals={false}
								axisLine={false}
								tick={CHART_AXIS}
								tickLine={false}
								width={32}
								yAxisId="orders"
							/>
							<YAxis
								axisLine={false}
								orientation="right"
								tick={CHART_AXIS}
								tickFormatter={(v) =>
									v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)
								}
								tickLine={false}
								width={44}
								yAxisId="mad"
							/>
							<Tooltip
								contentStyle={tooltipBox}
								formatter={(value, name) => {
									const n = Number(value ?? 0);
									if (name === "revenueMad")
										return [
											formatMad(String(n)),
											t("artisanDashboardCharts.tooltipRevenueMad"),
										];
									if (name === "orderCount")
										return [n, t("artisanDashboardCharts.tooltipOrders")];
									return [n, String(name)];
								}}
							/>
							<Legend
								wrapperStyle={{
									fontFamily: "var(--font-roboto-mono), monospace",
									fontSize: 11,
									color: MUTED,
								}}
							/>
							<Bar
								dataKey="orderCount"
								fill="var(--color-cream-dark)"
								maxBarSize={28}
								name={t("artisanDashboardCharts.legendOrders")}
								radius={[2, 2, 0, 0]}
								yAxisId="orders"
							/>
							<Line
								activeDot={{ r: 4 }}
								dataKey="revenueMad"
								dot={{ r: 3, fill: INK, strokeWidth: 0 }}
								name={t("artisanDashboardCharts.legendRevenue")}
								stroke={INK}
								strokeWidth={2}
								type="monotone"
								yAxisId="mad"
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</ChartFrame>
			</div>

			<ChartFrame
				description={t("artisanDashboardCharts.topProductsDesc")}
				title={t("artisanDashboardCharts.topProductsTitle")}
			>
				{topBars.length === 0 ? (
					<p className="py-8 text-center font-sans text-sm text-text-muted">
						{t("artisanDashboardCharts.emptySales")}
					</p>
				) : (
					<ResponsiveContainer
						height={Math.max(220, topBars.length * 44)}
						width="100%"
					>
						<BarChart
							data={topBars}
							layout="vertical"
							margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
						>
							<CartesianGrid
								horizontal={false}
								stroke={GRID}
								strokeDasharray="3 3"
							/>
							<XAxis
								axisLine={{ stroke: GRID }}
								tick={CHART_AXIS}
								tickFormatter={(v) =>
									v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)
								}
								tickLine={false}
								type="number"
							/>
							<YAxis
								axisLine={false}
								dataKey="name"
								tick={CHART_AXIS}
								tickLine={false}
								type="category"
								width={118}
							/>
							<Tooltip
								contentStyle={tooltipBox}
								formatter={(value, _name, item) => {
									const n = Number(value ?? 0);
									const row = item?.payload as {
										fullName?: string;
										unitsSold?: number;
									};
									return [
										interpolate(
											t("artisanDashboardCharts.tooltipRevenueUnits"),
											{
												price: formatMad(String(n)),
												count: row?.unitsSold ?? 0,
											},
										),
										row?.fullName ??
											t("artisanDashboardCharts.productFallback"),
									];
								}}
							/>
							<Bar
								barSize={18}
								dataKey="revenueMad"
								fill={INK}
								radius={[0, 2, 2, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				)}
			</ChartFrame>
		</div>
	);
}
