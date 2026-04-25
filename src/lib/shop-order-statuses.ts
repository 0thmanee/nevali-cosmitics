/** Allowed values for `ShopOrder.status` when set via admin or partner tools. */
export const SHOP_ORDER_STATUSES = ["NEW", "CONFIRMED", "SHIPPED", "CANCELED", "RETURNED"] as const;
export type ShopOrderStatusValue = (typeof SHOP_ORDER_STATUSES)[number];

export function isShopOrderStatus(value: string): value is ShopOrderStatusValue {
  return (SHOP_ORDER_STATUSES as readonly string[]).includes(value);
}
