import { describe, expect, it } from "vitest";
import {
	isAllowedShopOrderTransition,
	isShopOrderStatus,
	SHOP_ORDER_STATUSES,
} from "./shop-order-statuses";

describe("isShopOrderStatus", () => {
	it("accepts known statuses", () => {
		for (const s of SHOP_ORDER_STATUSES) {
			expect(isShopOrderStatus(s)).toBe(true);
		}
	});
	it("rejects unknown values", () => {
		expect(isShopOrderStatus("PENDING_PAYMENT")).toBe(false);
		expect(isShopOrderStatus("nonsense")).toBe(false);
	});
});

describe("isAllowedShopOrderTransition", () => {
	it("allows the normal fulfillment path", () => {
		expect(isAllowedShopOrderTransition("NEW", "CONFIRMED")).toBe(true);
		expect(isAllowedShopOrderTransition("CONFIRMED", "SHIPPED")).toBe(true);
		expect(isAllowedShopOrderTransition("SHIPPED", "RETURNED")).toBe(true);
	});

	it("allows cancellation from active states", () => {
		expect(isAllowedShopOrderTransition("NEW", "CANCELED")).toBe(true);
		expect(isAllowedShopOrderTransition("CONFIRMED", "CANCELED")).toBe(true);
		expect(isAllowedShopOrderTransition("SHIPPED", "CANCELED")).toBe(true);
	});

	it("treats same→same as a no-op (allowed)", () => {
		expect(isAllowedShopOrderTransition("SHIPPED", "SHIPPED")).toBe(true);
	});

	it("blocks illegal jumps", () => {
		expect(isAllowedShopOrderTransition("NEW", "SHIPPED")).toBe(false);
		expect(isAllowedShopOrderTransition("RETURNED", "SHIPPED")).toBe(false);
		expect(isAllowedShopOrderTransition("CANCELED", "SHIPPED")).toBe(false);
	});

	it("allows admin reactivation from terminal states to CONFIRMED only", () => {
		expect(isAllowedShopOrderTransition("CANCELED", "CONFIRMED")).toBe(true);
		expect(isAllowedShopOrderTransition("RETURNED", "CONFIRMED")).toBe(true);
		expect(isAllowedShopOrderTransition("CANCELED", "RETURNED")).toBe(false);
	});

	it("restricts unknown/internal source statuses to CONFIRMED or CANCELED", () => {
		expect(isAllowedShopOrderTransition("PENDING_PAYMENT", "CONFIRMED")).toBe(
			true,
		);
		expect(isAllowedShopOrderTransition("PENDING_PAYMENT", "CANCELED")).toBe(
			true,
		);
		expect(isAllowedShopOrderTransition("PENDING_PAYMENT", "SHIPPED")).toBe(
			false,
		);
	});
});
