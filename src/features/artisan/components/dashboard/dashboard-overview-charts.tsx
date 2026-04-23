"use client";

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
import { formatPriceMad } from "~/lib/format-price";

const CHART_AXIS = { fill: "#727272", fontSize: 11, fontFamily: "var(--font-roboto-mono), ui-monospace, monospace" };
const GRID = "#e8e2d8";
const INK = "#000000";
const MUTED = "#727272";

function shortDayLabel(isoDay: string): string {
  const d = new Date(`${isoDay}T12:00:00.000Z`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function normalizeCatalogByStatus(
  rows: ProducerDashboardStats["productsByStatus"]
): { label: string; count: number }[] {
  const m = new Map(rows.map((r) => [r.status, r.count]));
  return [
    { label: "Live", count: m.get("APPROVED") ?? 0 },
    { label: "In review", count: m.get("PENDING") ?? 0 },
    { label: "Rejected", count: m.get("REJECTED") ?? 0 },
  ];
}

const tooltipBox = {
  backgroundColor: "#ffffff",
  border: "1px solid #d8d0c4",
  borderRadius: 0,
  fontSize: 12,
  fontFamily: "var(--font-roboto-mono), ui-monospace, monospace",
  color: "#000000",
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
  children: React.ReactNode;
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
  const catalogBars = useMemo(() => normalizeCatalogByStatus(stats?.productsByStatus ?? []), [stats]);

  const orderSeries = useMemo(() => {
    const pts = stats?.orderVolumeByDay ?? [];
    return pts.map((p) => ({
      ...p,
      label: shortDayLabel(p.day),
    }));
  }, [stats]);

  const topBars = useMemo(() => {
    const rows = stats?.topProducts ?? [];
    return rows.map((r) => ({
      ...r,
      name:
        r.productName.length > 36 ? `${r.productName.slice(0, 34)}…` : r.productName,
      fullName: r.productName,
    }));
  }, [stats]);

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
      <ChartFrame
        title="Catalog status"
        description="How your SKUs are distributed across listing states."
      >
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={catalogBars} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
            <XAxis dataKey="label" tick={CHART_AXIS} axisLine={{ stroke: GRID }} tickLine={false} />
            <YAxis allowDecimals={false} tick={CHART_AXIS} axisLine={false} tickLine={false} width={36} />
            <Tooltip
              cursor={{ fill: "rgba(237, 230, 220, 0.35)" }}
              contentStyle={tooltipBox}
              formatter={(value) => [Number(value ?? 0), "Products"]}
            />
            <Bar dataKey="count" name="Products" fill={INK} radius={[2, 2, 0, 0]} maxBarSize={56} />
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>

      <ChartFrame
        title="Confirmed orders (14 days)"
        description="Distinct paid or COD-confirmed orders including your lines, and your attributed revenue (MAD)."
      >
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
                if (name === "revenueMad") return [formatPriceMad(String(n)), "Your revenue (MAD)"];
                if (name === "orderCount") return [n, "Orders"];
                return [n, String(name)];
              }}
            />
            <Legend
              wrapperStyle={{ fontFamily: "var(--font-roboto-mono), monospace", fontSize: 11, color: MUTED }}
            />
            <Bar yAxisId="orders" dataKey="orderCount" name="Orders" fill="#d8d0c4" radius={[2, 2, 0, 0]} maxBarSize={28} />
            <Line
              yAxisId="mad"
              type="monotone"
              dataKey="revenueMad"
              name="Revenue (MAD)"
              stroke={INK}
              strokeWidth={2}
              dot={{ r: 3, fill: INK, strokeWidth: 0 }}
              activeDot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartFrame>
      </div>

      <ChartFrame
        title="Top products by revenue"
        description="Last 90 days, confirmed orders only — ranked by your line totals (MAD)."
      >
        {topBars.length === 0 ? (
          <p className="py-8 text-center font-sans text-sm text-text-muted">
            No confirmed sales yet. When buyers check out, performance will appear here.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(220, topBars.length * 44)}>
            <BarChart
              layout="vertical"
              data={topBars}
              margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
              <XAxis
                type="number"
                tick={CHART_AXIS}
                axisLine={{ stroke: GRID }}
                tickLine={false}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v))}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={118}
                tick={CHART_AXIS}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipBox}
                formatter={(value, _name, item) => {
                  const n = Number(value ?? 0);
                  const row = item?.payload as { fullName?: string; unitsSold?: number };
                  return [
                    `${formatPriceMad(String(n))} · ${row?.unitsSold ?? 0} units`,
                    row?.fullName ?? "Product",
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

