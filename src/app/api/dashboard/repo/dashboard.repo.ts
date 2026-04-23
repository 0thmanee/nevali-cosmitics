import { prisma } from "~/lib/db";

export type ProductStatusCount = {
  status: string;
  count: number;
};

export type OrderDayPoint = {
  /** ISO date YYYY-MM-DD */
  day: string;
  orderCount: number;
  revenueMad: number;
};

export type TopProductLine = {
  productName: string;
  unitsSold: number;
  revenueMad: number;
};

const MS_DAY = 86_400_000;

function startOfUtcDay(d: Date): Date {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

function toDayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Last `dayCount` calendar days including today (UTC boundaries). */
export function buildEmptyDaySeries(dayCount: number): Map<string, { orderCount: number; revenueMad: number }> {
  const map = new Map<string, { orderCount: number; revenueMad: number }>();
  const today = startOfUtcDay(new Date());
  for (let i = dayCount - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * MS_DAY);
    map.set(toDayKey(d), { orderCount: 0, revenueMad: 0 });
  }
  return map;
}

export async function getProductStatusCountsForOrg(
  organizationId: string
): Promise<ProductStatusCount[]> {
  const rows = await prisma.product.groupBy({
    by: ["status"],
    where: { organizationId },
    _count: { _all: true },
  });
  return rows.map((r) => ({ status: r.status, count: r._count._all }));
}

/**
 * Confirmed shop orders touching this org: daily order count (distinct orders) and line revenue (MAD).
 */
export async function getConfirmedOrderVolumeByDayForOrg(
  organizationId: string,
  dayCount: number
): Promise<OrderDayPoint[]> {
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - (dayCount - 1));

  const lines = await prisma.shopOrderLine.findMany({
    where: {
      organizationId,
      order: {
        status: "CONFIRMED",
        createdAt: { gte: since },
      },
    },
    select: {
      quantity: true,
      unitPrice: true,
      order: { select: { id: true, createdAt: true } },
    },
  });

  const byDay = buildEmptyDaySeries(dayCount);

  const orderIdsPerDay = new Map<string, Set<string>>();
  for (const k of byDay.keys()) {
    orderIdsPerDay.set(k, new Set());
  }

  for (const line of lines) {
    const created = line.order.createdAt;
    const key = toDayKey(startOfUtcDay(created));
    if (!byDay.has(key)) continue;
    const agg = byDay.get(key)!;
    const price = Number(line.unitPrice);
    const q = line.quantity;
    if (Number.isFinite(price) && Number.isFinite(q)) {
      agg.revenueMad += price * q;
    }
    orderIdsPerDay.get(key)?.add(line.order.id);
  }

  for (const [key, set] of orderIdsPerDay) {
    const agg = byDay.get(key);
    if (agg) agg.orderCount = set.size;
  }

  return [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, v]) => ({
      day,
      orderCount: v.orderCount,
      revenueMad: Math.round(v.revenueMad * 100) / 100,
    }));
}

export async function getTopProductsByRevenueForOrg(
  organizationId: string,
  sinceDays: number,
  take: number
): Promise<TopProductLine[]> {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - sinceDays);

  const lines = await prisma.shopOrderLine.findMany({
    where: {
      organizationId,
      order: { status: "CONFIRMED", createdAt: { gte: since } },
    },
    select: { productName: true, quantity: true, unitPrice: true },
  });

  const map = new Map<string, { unitsSold: number; revenueMad: number }>();
  for (const line of lines) {
    const name = line.productName.trim() || "Product";
    const price = Number(line.unitPrice);
    const q = line.quantity;
    if (!Number.isFinite(price) || !Number.isFinite(q)) continue;
    const prev = map.get(name) ?? { unitsSold: 0, revenueMad: 0 };
    prev.unitsSold += q;
    prev.revenueMad += price * q;
    map.set(name, prev);
  }

  return [...map.entries()]
    .map(([productName, v]) => ({
      productName,
      unitsSold: v.unitsSold,
      revenueMad: Math.round(v.revenueMad * 100) / 100,
    }))
    .sort((a, b) => b.revenueMad - a.revenueMad)
    .slice(0, take);
}
