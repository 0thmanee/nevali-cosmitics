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
import { useI18n } from "~/components/i18n/i18n-provider";
import { useFormatPrice } from "~/components/i18n/use-format-price";
import type { ProducerDashboardStats } from "~/app/api/dashboard/dashboard.types";
import { INTL_LOCALE_TAG } from "~/lib/i18n/config";
import type { AppLocale } from "~/lib/i18n/config";
import type { Translator } from "~/lib/i18n/create-translator";
import { interpolate } from "~/lib/i18n/interpolate";

const CHART_AXIS = { fill: "var(--color-text-muted)", fontSize: 11, fontFamily: "var(--font-roboto-mono), ui-monospace, monospace" };
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
    { label: t("artisanDashboardCharts.statusLive"), count: m.get("APPROVED") ?? 0 },
    { label: t("artisanDashboardCharts.statusReview"), count: m.get("PENDING") ?? 0 },
    { label: t("artisanDashboardCharts.statusRejected"), count: m.get("REJECTED") ?? 0 },
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
    <div className="border border-cream-dark bg-paper flex flex-col min-h-[320px]">
      <div className="border-b border-cream-dark px-5 py-4">
        <h3 className="font-serif text-base font-semibold text-text-dark">{title}</h3>
        <p className="mt-1 font-sans text-xs text-text-muted leading-relaxed">{description}</p>
      </div>
      <div className="flex-1 min-h-[240px] p-4 sm:p-5">{children}</div>
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
      name: r.productName.length > 36 ? `${r.productName.slice(0, 34)}…` : r.productName,
      fullName: r.productName,
    }));
  }, [stats?.topProducts]);

  if (isLoading && !stats) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="h-[320px] border border-cream-dark bg-paper animate-pulse"
            aria-hidden
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartFrame title={t("artisanDashboardCharts.catalogTitle")} description={t("artisanDashboardCharts.catalogDesc")}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={catalogBars} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
              <XAxis dataKey="label" tick={CHART_AXIS} axisLine={{ stroke: GRID }} tickLine={false} />
              <YAxis allowDecimals={false} tick={CHART_AXIS} axisLine={false} tickLine={false} width={36} />
              <Tooltip
                cursor={{ fill: "color-mix(in srgb, var(--color-cream-dark) 35%, transparent)" }}
                contentStyle={tooltipBox}
                formatter={(value) => [Number(value ?? 0), t("artisanDashboardCharts.legendProducts")]}
              />
              <Bar
                dataKey="count"
                name={t("artisanDashboardCharts.legendProducts")}
                fill={INK}
                radius={[2, 2, 0, 0]}
                maxBarSize={56}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>

        <ChartFrame title={t("artisanDashboardCharts.orders14Title")} description={t("artisanDashboardCharts.orders14Desc")}>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={orderSeries} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
              <XAxis dataKey="label" tick={CHART_AXIS} axisLine={{ stroke: GRID }} tickLine={false} />
              <YAxis
                yAxisId="orders"
                allowDecimals={false}
                tick={CHART_AXIS}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <YAxis
                yAxisId="mad"
                orientation="right"
                tick={CHART_AXIS}
                axisLine={false}
                tickLine={false}
                width={44}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v))}
              />
              <Tooltip
                contentStyle={tooltipBox}
                formatter={(value, name) => {
                  const n = Number(value ?? 0);
                  if (name === "revenueMad") return [formatMad(String(n)), t("artisanDashboardCharts.tooltipRevenueMad")];
                  if (name === "orderCount") return [n, t("artisanDashboardCharts.tooltipOrders")];
                  return [n, String(name)];
                }}
              />
              <Legend
                wrapperStyle={{ fontFamily: "var(--font-roboto-mono), monospace", fontSize: 11, color: MUTED }}
              />
              <Bar
                yAxisId="orders"
                dataKey="orderCount"
                name={t("artisanDashboardCharts.legendOrders")}
                fill="var(--color-cream-dark)"
                radius={[2, 2, 0, 0]}
                maxBarSize={28}
              />
              <Line
                yAxisId="mad"
                type="monotone"
                dataKey="revenueMad"
                name={t("artisanDashboardCharts.legendRevenue")}
                stroke={INK}
                strokeWidth={2}
                dot={{ r: 3, fill: INK, strokeWidth: 0 }}
                activeDot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartFrame>
      </div>

      <ChartFrame title={t("artisanDashboardCharts.topProductsTitle")} description={t("artisanDashboardCharts.topProductsDesc")}>
        {topBars.length === 0 ? (
          <p className="py-8 text-center font-sans text-sm text-text-muted">{t("artisanDashboardCharts.emptySales")}</p>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(220, topBars.length * 44)}>
            <BarChart layout="vertical" data={topBars} margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
              <XAxis
                type="number"
                tick={CHART_AXIS}
                axisLine={{ stroke: GRID }}
                tickLine={false}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v))}
              />
              <YAxis type="category" dataKey="name" width={118} tick={CHART_AXIS} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={tooltipBox}
                formatter={(value, _name, item) => {
                  const n = Number(value ?? 0);
                  const row = item?.payload as { fullName?: string; unitsSold?: number };
                  return [
                    interpolate(t("artisanDashboardCharts.tooltipRevenueUnits"), {
                      price: formatMad(String(n)),
                      count: row?.unitsSold ?? 0,
                    }),
                    row?.fullName ?? t("artisanDashboardCharts.productFallback"),
                  ];
                }}
              />
              <Bar dataKey="revenueMad" fill={INK} radius={[0, 2, 2, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartFrame>
    </div>
  );
}
