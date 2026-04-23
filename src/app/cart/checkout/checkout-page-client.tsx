"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { submitShopOrder } from "~/app/api/shop-orders/actions";
import { useCart } from "~/features/cart/cart-context";
import { allowedCheckoutMethodsForLines } from "~/lib/checkout-payment";
import { persistLastCheckoutConfirmation } from "~/lib/checkout-confirmation-storage";
import { productPlaceholderImageUrl } from "~/lib/cosmetics-image-placeholders";
import { formatPriceMad } from "~/lib/format-price";

const inputClass =
  "w-full rounded-sm border border-cream-dark bg-white px-4 py-3 font-sans text-sm text-text-dark transition-colors focus:outline-none focus:ring-2 focus:ring-[#000000]/40";

const stepCircleClass =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-sans text-xs font-bold text-white";
const stepCircleStyle = { background: "#000000" } as const;

export function CheckoutPageClient({
  initialName,
  initialEmail,
  cancelled,
}: {
  initialName: string;
  initialEmail: string;
  cancelled?: boolean;
}) {
  const router = useRouter();
  const { lines, ready, clearCart, subtotalMad } = useCart();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [buyerName, setBuyerName] = useState(initialName);
  const [buyerEmail, setBuyerEmail] = useState(initialEmail);
  const [buyerPhone, setBuyerPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Morocco");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "COD">("CARD");

  const allowedMethods = useMemo(
    () => allowedCheckoutMethodsForLines(lines.map((l) => l.paymentOption)),
    [lines],
  );

  useEffect(() => {
    if (!ready || lines.length === 0) return;
    if (allowedMethods.length === 0) return;
    if (!allowedMethods.includes(paymentMethod)) {
      setPaymentMethod(allowedMethods[0]!);
    }
  }, [ready, lines.length, allowedMethods, paymentMethod]);

  useEffect(() => {
    if (ready && lines.length === 0) {
      router.replace("/cart");
    }
  }, [ready, lines.length, router]);

  if (!ready) {
    return <p className="py-16 text-center font-sans text-stone-500">Loading…</p>;
  }

  if (lines.length === 0) return null;

  const canSubmit = allowedMethods.length > 0;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!canSubmit) {
      setError(
        "No payment method is available for the items in your cart. Remove conflicting products or contact us.",
      );
      return;
    }
    startTransition(async () => {
      try {
        const result = await submitShopOrder({
          buyerName,
          buyerEmail,
          buyerPhone: buyerPhone.trim() || null,
          addressLine1,
          addressLine2: addressLine2.trim() || null,
          city,
          postalCode,
          country,
          paymentMethod,
          notes: notes.trim() || null,
          lines: lines.map((l) => ({
            productId: l.productId,
            productVariantId: l.productVariantId,
            quantity: l.quantity,
          })),
        });

        const confirmationPayload = {
          orderId: result.orderId,
          buyerName: buyerName.trim(),
          buyerEmail: buyerEmail.trim(),
          buyerPhone: buyerPhone.trim() || null,
          addressLine1: addressLine1.trim(),
          addressLine2: addressLine2.trim() || null,
          city: city.trim(),
          postalCode: postalCode.trim(),
          country: country.trim(),
          paymentMethod,
        };

        if ("checkoutUrl" in result && result.checkoutUrl) {
          persistLastCheckoutConfirmation(confirmationPayload);
          window.location.assign(result.checkoutUrl);
          return;
        }

        persistLastCheckoutConfirmation(confirmationPayload);
        clearCart();
        router.push(`/cart/checkout/success?orderId=${encodeURIComponent(result.orderId)}`);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Something went wrong. Please try again.";
        setError(msg);
      }
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      {cancelled ? (
        <div
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-950"
          role="status"
        >
          Card checkout was cancelled. Your cart is unchanged — you can adjust items and try again.
        </div>
      ) : null}
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
      <form className="flex min-w-0 flex-1 flex-col gap-4" onSubmit={onSubmit}>
        <div className="flex flex-col gap-5 rounded-2xl border border-cream-dark bg-white p-6">
          <div className="flex items-center gap-3">
            <span className={stepCircleClass} style={stepCircleStyle}>
              1
            </span>
            <h2 className="font-serif text-lg font-bold text-text-dark">Your details</h2>
          </div>

          <label className="flex flex-col gap-1.5 font-sans text-sm">
            <span className="font-medium text-text-dark">Full name</span>
            <input
              autoComplete="name"
              className={inputClass}
              onChange={(e) => setBuyerName(e.target.value)}
              required
              value={buyerName}
            />
          </label>
          <label className="flex flex-col gap-1.5 font-sans text-sm">
            <span className="font-medium text-text-dark">Email</span>
            <input
              autoComplete="email"
              className={inputClass}
              onChange={(e) => setBuyerEmail(e.target.value)}
              required
              type="email"
              value={buyerEmail}
            />
          </label>
          <label className="flex flex-col gap-1.5 font-sans text-sm">
            <span className="font-medium text-text-dark">
              Phone <span className="font-normal text-stone-500">(optional)</span>
            </span>
            <input
              autoComplete="tel"
              className={inputClass}
              onChange={(e) => setBuyerPhone(e.target.value)}
              type="tel"
              value={buyerPhone}
            />
          </label>
        </div>

        <div className="flex flex-col gap-5 rounded-2xl border border-cream-dark bg-white p-6">
          <div className="flex items-center gap-3">
            <span className={stepCircleClass} style={stepCircleStyle}>
              2
            </span>
            <div>
              <h2 className="font-serif text-lg font-bold text-text-dark">Shipping address</h2>
              <p className="mt-0.5 font-sans text-xs text-stone-500">
                Where we should deliver this order or reach you for coordination.
              </p>
            </div>
          </div>

          <label className="flex flex-col gap-1.5 font-sans text-sm">
            <span className="font-medium text-text-dark">Address line 1</span>
            <input
              autoComplete="address-line1"
              className={inputClass}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="Street, building, number"
              required
              value={addressLine1}
            />
          </label>
          <label className="flex flex-col gap-1.5 font-sans text-sm">
            <span className="font-medium text-text-dark">
              Address line 2 <span className="font-normal text-stone-500">(optional)</span>
            </span>
            <input
              autoComplete="address-line2"
              className={inputClass}
              onChange={(e) => setAddressLine2(e.target.value)}
              placeholder="Apartment, floor, district…"
              value={addressLine2}
            />
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 font-sans text-sm">
              <span className="font-medium text-text-dark">City</span>
              <input
                autoComplete="address-level2"
                className={inputClass}
                onChange={(e) => setCity(e.target.value)}
                required
                value={city}
              />
            </label>
            <label className="flex flex-col gap-1.5 font-sans text-sm">
              <span className="font-medium text-text-dark">Postal code</span>
              <input
                autoComplete="postal-code"
                className={inputClass}
                onChange={(e) => setPostalCode(e.target.value)}
                required
                value={postalCode}
              />
            </label>
          </div>
          <label className="flex flex-col gap-1.5 font-sans text-sm">
            <span className="font-medium text-text-dark">Country</span>
            <input
              autoComplete="country-name"
              className={inputClass}
              onChange={(e) => setCountry(e.target.value)}
              required
              value={country}
            />
          </label>
          <label className="flex flex-col gap-1.5 font-sans text-sm">
            <span className="font-medium text-text-dark">
              Notes <span className="font-normal text-stone-500">(optional)</span>
            </span>
            <textarea
              className={`${inputClass} min-h-[80px] resize-y`}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Delivery preferences, company name, etc."
              rows={3}
              value={notes}
            />
          </label>
        </div>

        <div className="flex flex-col gap-5 rounded-2xl border border-cream-dark bg-white p-6">
          <div className="flex items-center gap-3">
            <span className={stepCircleClass} style={stepCircleStyle}>
              3
            </span>
            <h2 className="font-serif text-lg font-bold text-text-dark">Payment</h2>
          </div>

          {!canSubmit ? (
            <p className="font-sans text-sm text-red-600">
              These products do not share a common payment option. Adjust your cart and try again.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {allowedMethods.includes("CARD") && (
                <button
                  className={`flex items-center gap-4 rounded-sm border px-4 py-3.5 text-left transition-all ${
                    paymentMethod === "CARD"
                      ? "border-[#000000] bg-cream ring-1 ring-[#000000]/20"
                      : "border-cream-dark hover:border-[#000000]/35"
                  }`}
                  onClick={() => setPaymentMethod("CARD")}
                  type="button"
                >
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                      paymentMethod === "CARD" ? "border-[#000000]" : "border-cream-dark"
                    }`}
                  >
                    {paymentMethod === "CARD" ? (
                      <div className="h-2 w-2 rounded-full bg-[#000000]" />
                    ) : null}
                  </div>
                  <div>
                    <p className="font-sans text-sm font-semibold text-text-dark">Card payment</p>
                    <p className="mt-0.5 font-sans text-xs text-stone-500">
                      Visa, Mastercard, and other cards accepted
                    </p>
                  </div>
                </button>
              )}
              {allowedMethods.includes("COD") && (
                <button
                  className={`flex items-center gap-4 rounded-sm border px-4 py-3.5 text-left transition-all ${
                    paymentMethod === "COD"
                      ? "border-[#000000] bg-cream ring-1 ring-[#000000]/20"
                      : "border-cream-dark hover:border-[#000000]/35"
                  }`}
                  onClick={() => setPaymentMethod("COD")}
                  type="button"
                >
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                      paymentMethod === "COD" ? "border-[#000000]" : "border-cream-dark"
                    }`}
                  >
                    {paymentMethod === "COD" ? (
                      <div className="h-2 w-2 rounded-full bg-[#000000]" />
                    ) : null}
                  </div>
                  <div>
                    <p className="font-sans text-sm font-semibold text-text-dark">Cash on delivery</p>
                    <p className="mt-0.5 font-sans text-xs text-stone-500">
                      Pay when your order arrives
                    </p>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        {error ? (
          <p className="px-1 font-sans text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <button
          className="flex w-full items-center justify-center gap-2 rounded-sm py-3.5 font-sans text-sm font-semibold text-white shadow-sm transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#000000]/55 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={pending || !canSubmit}
          style={{ background: "#000000" }}
          type="submit"
        >
          {pending
            ? paymentMethod === "CARD"
              ? "Redirecting to payment…"
              : "Placing order…"
            : paymentMethod === "CARD"
              ? "Continue to secure payment →"
              : "Place order →"}
        </button>

        <Link
          className="w-fit font-sans text-sm text-stone-500 transition-colors hover:text-text-dark"
          href="/cart"
        >
          ← Back to cart
        </Link>
      </form>

      <aside className="lg:sticky lg:top-28 lg:w-96 lg:shrink-0 lg:self-start">
        <div className="flex flex-col gap-5 rounded-2xl border border-cream-dark bg-white p-6">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
            Order summary
          </p>

          <ul className="flex flex-col gap-4">
            {lines.map((l) => {
              const total = Number(l.price.replace(",", ".")) * l.quantity;
              const thumbSrc =
                l.firstImageUrl ??
                productPlaceholderImageUrl(`${l.productId}:${l.category}`, 96);
              return (
                <li className="flex items-start gap-3" key={`${l.productId}:${l.productVariantId}`}>
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream">
                    <Image alt="" className="object-cover" fill sizes="48px" src={thumbSrc} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 font-sans text-sm font-medium text-text-dark">{l.name}</p>
                    <p className="mt-0.5 font-sans text-xs text-stone-500">
                      {l.variantName} · ×{l.quantity}
                    </p>
                  </div>
                  <span className="shrink-0 font-sans text-sm font-medium text-text-dark">
                    {formatPriceMad(Number.isFinite(total) ? total.toFixed(2) : "0")}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col gap-2 border-t border-cream-dark pt-4">
            <div className="flex items-baseline justify-between">
              <span className="font-sans text-sm text-stone-500">Subtotal</span>
              <span className="font-serif text-2xl font-bold text-text-dark">
                {formatPriceMad(subtotalMad.toFixed(2))}
              </span>
            </div>
            <p className="font-sans text-xs text-stone-500">
              Shipping calculated after order confirmation.
            </p>
          </div>
        </div>
      </aside>
      </div>
    </div>
  );
}
