import { describe, expect, it } from "vitest";
import {
	allowedCheckoutMethodsForLines,
	paymentOptionAllowsCheckout,
} from "./checkout-payment";

// Card payments are parked (cardPaymentsEnabled === false), so COD is the only
// accepted method regardless of a product's configured paymentOption.
describe("paymentOptionAllowsCheckout (COD-only launch)", () => {
	it("always allows COD", () => {
		expect(paymentOptionAllowsCheckout("CARD", "COD")).toBe(true);
		expect(paymentOptionAllowsCheckout("COD", "COD")).toBe(true);
		expect(paymentOptionAllowsCheckout("BOTH", "COD")).toBe(true);
		expect(paymentOptionAllowsCheckout(null, "COD")).toBe(true);
	});

	it("blocks CARD while card payments are parked", () => {
		expect(paymentOptionAllowsCheckout("CARD", "CARD")).toBe(false);
		expect(paymentOptionAllowsCheckout("BOTH", "CARD")).toBe(false);
	});
});

describe("allowedCheckoutMethodsForLines", () => {
	it("returns empty for an empty cart", () => {
		expect(allowedCheckoutMethodsForLines([])).toEqual([]);
	});

	it("returns only COD for any cart while card is parked", () => {
		expect(allowedCheckoutMethodsForLines(["CARD", "COD"])).toEqual(["COD"]);
		expect(allowedCheckoutMethodsForLines(["BOTH"])).toEqual(["COD"]);
	});
});
