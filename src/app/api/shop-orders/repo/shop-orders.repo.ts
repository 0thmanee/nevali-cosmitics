import { Prisma } from "@prisma/client";
import { prisma } from "~/lib/db";
import { paymentOptionAllowsCheckout } from "~/lib/checkout-payment";

export async function createShopOrderFromCheckout(input: {
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod: "CARD" | "COD";
  notes?: string | null;
  lines: { productId: string; productVariantId: string; quantity: number }[];
}): Promise<{
  orderId: string;
  notification: {
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string | null;
    paymentMethod: "CARD" | "COD";
    totalMad: string;
    lines: {
      productName: string;
      variantName: string;
      quantity: number;
      unitPriceMad: string;
      lineTotalMad: string;
      organizationId: string;
      organizationName: string;
    }[];
  };
}> {
  if (input.lines.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const resolved: {
    productId: string;
    productVariantId: string;
    variantName: string;
    organizationId: string;
    organizationName: string;
    productName: string;
    unitPrice: Prisma.Decimal;
    quantity: number;
  }[] = [];

  for (const line of input.lines) {
    const variant = await prisma.productVariant.findFirst({
      where: { id: line.productVariantId, productId: line.productId, product: { status: "APPROVED" } },
      select: {
        id: true,
        name: true,
        price: true,
        inStock: true,
        quantityOnHand: true,
        product: {
          select: {
            id: true,
            name: true,
            organizationId: true,
            paymentOption: true,
            organization: { select: { name: true } },
          },
        },
      },
    });
    const p = variant?.product;
    if (!variant || !p) {
      throw new Error(`One or more products are no longer available. Please refresh and try again.`);
    }
    if (!variant.inStock) {
      throw new Error(`“${p.name}” (${variant.name}) is currently out of stock.`);
    }
    if (variant.quantityOnHand > 0 && line.quantity > variant.quantityOnHand) {
      throw new Error(
        `Only ${variant.quantityOnHand} unit(s) available for “${p.name}” (${variant.name}). Reduce the quantity and try again.`,
      );
    }
    if (!paymentOptionAllowsCheckout(p.paymentOption, input.paymentMethod)) {
      throw new Error(
        `The selected payment method is not allowed for “${p.name}”. Update your cart or choose another method.`,
      );
    }
    resolved.push({
      productId: p.id,
      productVariantId: variant.id,
      variantName: variant.name,
      organizationId: p.organizationId,
      organizationName: p.organization.name,
      productName: p.name,
      unitPrice: variant.price,
      quantity: line.quantity,
    });
  }

  let totalMad = 0;
  for (const l of resolved) {
    const up = Number(l.unitPrice);
    totalMad += (Number.isFinite(up) ? up : 0) * l.quantity;
  }

  const order = await prisma.$transaction(async (tx) => {
    return tx.shopOrder.create({
      data: {
        buyerName: input.buyerName.trim(),
        buyerEmail: input.buyerEmail.trim().toLowerCase(),
        buyerPhone: input.buyerPhone?.trim() || null,
        addressLine1: input.addressLine1.trim(),
        addressLine2: input.addressLine2?.trim() || null,
        city: input.city.trim(),
        postalCode: input.postalCode.trim(),
        country: input.country.trim(),
        paymentMethod: input.paymentMethod,
        notes: input.notes?.trim() || null,
        status: input.paymentMethod === "COD" ? "CONFIRMED" : "PENDING_PAYMENT",
        lines: {
          create: resolved.map((l) => ({
            productId: l.productId,
            productVariantId: l.productVariantId,
            variantName: l.variantName,
            organizationId: l.organizationId,
            productName: l.productName,
            unitPrice: l.unitPrice,
            quantity: l.quantity,
          })),
        },
      },
      select: { id: true },
    });
  });

  return {
    orderId: order.id,
    notification: {
      buyerName: input.buyerName.trim(),
      buyerEmail: input.buyerEmail.trim().toLowerCase(),
      buyerPhone: input.buyerPhone?.trim() || null,
      paymentMethod: input.paymentMethod,
      totalMad: totalMad.toFixed(2),
      lines: resolved.map((l) => ({
        productName: l.productName,
        variantName: l.variantName,
        quantity: l.quantity,
        unitPriceMad: l.unitPrice.toFixed(2),
        lineTotalMad: (Number(l.unitPrice) * l.quantity).toFixed(2),
        organizationId: l.organizationId,
        organizationName: l.organizationName,
      })),
    },
  };
}

export async function deleteShopOrderByIdRepo(orderId: string): Promise<void> {
  await prisma.shopOrder.delete({ where: { id: orderId } });
}

export type ShopOrderNotificationPayload = {
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string | null;
  paymentMethod: "CARD" | "COD";
  totalMad: string;
  lines: {
    productName: string;
    variantName: string;
    quantity: number;
    unitPriceMad: string;
    lineTotalMad: string;
    organizationId: string;
    organizationName: string;
  }[];
};

/** Build the same notification shape as checkout (for emails after Stripe confirms payment). */
export async function buildShopOrderNotificationPayload(
  orderId: string,
): Promise<ShopOrderNotificationPayload | null> {
  const order = await prisma.shopOrder.findUnique({
    where: { id: orderId },
    include: { lines: { orderBy: { id: "asc" } } },
  });
  if (!order) return null;
  const orgIds = [...new Set(order.lines.map((l) => l.organizationId))];
  const orgs =
    orgIds.length > 0
      ? await prisma.organization.findMany({
          where: { id: { in: orgIds } },
          select: { id: true, name: true },
        })
      : [];
  const orgNameById = new Map(orgs.map((o) => [o.id, o.name]));

  let total = 0;
  const lines = order.lines.map((l) => {
    const up = Number(l.unitPrice);
    const lineTot = (Number.isFinite(up) ? up : 0) * l.quantity;
    total += lineTot;
    return {
      productName: l.productName,
      variantName: l.variantName ?? "",
      quantity: l.quantity,
      unitPriceMad: l.unitPrice.toFixed(2),
      lineTotalMad: lineTot.toFixed(2),
      organizationId: l.organizationId,
      organizationName: orgNameById.get(l.organizationId) ?? "",
    };
  });

  return {
    buyerName: order.buyerName,
    buyerEmail: order.buyerEmail,
    buyerPhone: order.buyerPhone,
    paymentMethod: order.paymentMethod,
    totalMad: total.toFixed(2),
    lines,
  };
}

/** Returns true if this call transitioned the order from PENDING_PAYMENT → CONFIRMED (idempotent). */
export async function tryFinalizePendingShopOrderRepo(
  orderId: string,
  stripePaymentIntentId?: string | null,
): Promise<boolean> {
  const updated = await prisma.shopOrder.updateMany({
    where: { id: orderId, status: "PENDING_PAYMENT" },
    data: {
      status: "CONFIRMED",
      ...(stripePaymentIntentId ? { stripePaymentIntentId } : {}),
    },
  });
  return updated.count > 0;
}

export type AdminShopOrderLineRow = {
  id: string;
  productId: string;
  productVariantId: string | null;
  variantName: string | null;
  organizationId: string;
  organizationName: string;
  productName: string;
  unitPrice: string;
  quantity: number;
};

export type AdminShopOrderListRow = {
  id: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod: string;
  status: string;
  notes: string | null;
  createdAt: Date;
  lines: AdminShopOrderLineRow[];
  totalMad: string;
};

export async function listShopOrdersForAdminRepo(params: {
  organizationId?: string | null;
  take?: number;
}): Promise<AdminShopOrderListRow[]> {
  const take = params.take ?? 200;
  const where =
    params.organizationId != null && params.organizationId !== ""
      ? { lines: { some: { organizationId: params.organizationId } } }
      : {};

  const rows = await prisma.shopOrder.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take,
    include: {
      lines: {
        include: {
          organization: { select: { name: true } },
        },
        orderBy: { id: "asc" },
      },
    },
  });

  return rows.map((o) => {
    let total = 0;
    const lines: AdminShopOrderLineRow[] = o.lines.map((l) => {
      const up = Number(l.unitPrice);
      const lineTot = (Number.isFinite(up) ? up : 0) * l.quantity;
      total += lineTot;
      return {
        id: l.id,
        productId: l.productId,
        productVariantId: l.productVariantId,
        variantName: l.variantName,
        organizationId: l.organizationId,
        organizationName: l.organization.name,
        productName: l.productName,
        unitPrice: l.unitPrice.toFixed(2),
        quantity: l.quantity,
      };
    });
    return {
      id: o.id,
      buyerName: o.buyerName,
      buyerEmail: o.buyerEmail,
      buyerPhone: o.buyerPhone,
      addressLine1: o.addressLine1,
      addressLine2: o.addressLine2,
      city: o.city,
      postalCode: o.postalCode,
      country: o.country,
      paymentMethod: o.paymentMethod,
      status: o.status,
      notes: o.notes,
      createdAt: o.createdAt,
      lines,
      totalMad: total.toFixed(2),
    };
  });
}

export async function countShopOrdersForAdminRepo(organizationId?: string | null): Promise<number> {
  const where =
    organizationId != null && organizationId !== ""
      ? { lines: { some: { organizationId } } }
      : {};
  return prisma.shopOrder.count({ where });
}

export type ProducerProductOrderAggregateRow = {
  productId: string;
  productName: string;
  ordersCount: number;
  unitsSold: number;
  revenueMad: string;
  lastOrderedAt: Date | null;
};

export async function listProductOrderAggregatesForProducerRepo(
  organizationId: string,
): Promise<ProducerProductOrderAggregateRow[]> {
  const lines = await prisma.shopOrderLine.findMany({
    where: {
      organizationId,
      order: { status: "CONFIRMED" },
    },
    select: {
      productId: true,
      productName: true,
      unitPrice: true,
      quantity: true,
      orderId: true,
      order: { select: { createdAt: true } },
    },
    orderBy: { order: { createdAt: "desc" } },
  });

  const byProduct = new Map<
    string,
    {
      productName: string;
      orderIds: Set<string>;
      unitsSold: number;
      revenue: number;
      lastOrderedAt: Date | null;
    }
  >();

  for (const line of lines) {
    const key = line.productId;
    const current = byProduct.get(key) ?? {
      productName: line.productName,
      orderIds: new Set<string>(),
      unitsSold: 0,
      revenue: 0,
      lastOrderedAt: null,
    };
    const unitPrice = Number(line.unitPrice);
    current.orderIds.add(line.orderId);
    current.unitsSold += line.quantity;
    current.revenue += (Number.isFinite(unitPrice) ? unitPrice : 0) * line.quantity;
    if (current.lastOrderedAt == null || line.order.createdAt > current.lastOrderedAt) {
      current.lastOrderedAt = line.order.createdAt;
    }
    byProduct.set(key, current);
  }

  return Array.from(byProduct.entries())
    .map(([productId, v]) => ({
      productId,
      productName: v.productName,
      ordersCount: v.orderIds.size,
      unitsSold: v.unitsSold,
      revenueMad: v.revenue.toFixed(2),
      lastOrderedAt: v.lastOrderedAt,
    }))
    .sort((a, b) => b.ordersCount - a.ordersCount || b.unitsSold - a.unitsSold);
}

export async function countShopOrdersForProducerRepo(organizationId: string): Promise<number> {
  return prisma.shopOrder.count({
    where: {
      status: "CONFIRMED",
      lines: { some: { organizationId } },
    },
  });
}
