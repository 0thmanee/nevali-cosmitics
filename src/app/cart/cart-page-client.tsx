"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "~/components/i18n/i18n-provider";
import { useFormatPrice } from "~/components/i18n/use-format-price";
import { useCart } from "~/features/cart/cart-context";
import { cartLineKey } from "~/features/cart/cart-types";
import { productPlaceholderImageUrl } from "~/lib/cosmetics-image-placeholders";

export function CartPageClient() {
  const { t } = useI18n();
  const { formatMad } = useFormatPrice();
  const { lines, ready, setQuantity, removeLine, subtotalMad } = useCart();

  if (!ready) {
    return <p className="py-16 text-center font-sans text-stone-500">{t("cart.loading")}</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="font-serif text-2xl font-bold text-text-dark">{t("cart.emptyTitle")}</p>
        <p className="mt-3 font-sans text-sm leading-relaxed text-stone-500">{t("cart.emptyBody")}</p>
        <Link
          className="mt-8 inline-flex rounded-sm bg-ink px-6 py-3 font-sans text-sm font-semibold text-white transition-opacity hover:opacity-90"
          href="/products"
        >
          {t("cart.browseProducts")}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="h-full flex flex-col gap-3 lg:col-span-7">
        {lines.map((line) => {
          const unitPrice = Number(line.price.replace(",", "."));
          const lineTotal = unitPrice * line.quantity;
          const thumbSrc =
            line.firstImageUrl ??
            productPlaceholderImageUrl(`${line.productId}:${line.category}`, 160);
          return (
            <div
              key={cartLineKey(line)}
              className="flex gap-4 rounded-sm border border-cream-dark bg-white p-5"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-cream">
                <Image alt="" className="object-cover" fill sizes="80px" src={thumbSrc} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-serif font-semibold leading-snug text-text-dark">{line.name}</p>
                <p className="mt-0.5 font-sans text-xs text-stone-500">
                  {line.organizationName} · {line.category}
                </p>
                <p className="mt-0.5 font-sans text-[11px] text-stone-500">
                  {line.variantName}
                  {line.unit ? ` · ${line.unit}` : ""}
                </p>
                <p className="mt-2 font-sans text-sm font-medium text-text-dark">
                  {Number.isFinite(unitPrice)
                    ? `${formatMad(unitPrice.toFixed(2))} ${t("common.perUnitSuffix")}`
                    : formatMad(line.price)}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-sm border border-cream-dark bg-cream font-bold text-text-dark transition-colors hover:bg-cream-dark"
                    onClick={() =>
                      setQuantity(
                        line.productId,
                        line.productVariantId,
                        Math.max(1, line.quantity - 1),
                      )
                    }
                    type="button"
                  >
                    −
                  </button>
                  <input
                    className="h-8 w-12 rounded-sm border border-cream-dark bg-white text-center font-sans text-sm text-text-dark focus:outline-none focus:ring-1 focus:ring-ink"
                    max={999}
                    min={1}
                    onChange={(e) =>
                      setQuantity(
                        line.productId,
                        line.productVariantId,
                        Math.max(1, Number(e.target.value)),
                      )
                    }
                    type="number"
                    value={line.quantity}
                  />
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-sm border border-cream-dark bg-cream font-bold text-text-dark transition-colors hover:bg-cream-dark"
                    onClick={() =>
                      setQuantity(
                        line.productId,
                        line.productVariantId,
                        Math.min(999, line.quantity + 1),
                      )
                    }
                    type="button"
                  >
                    +
                  </button>
                  <button
                    className="ms-2 font-sans text-xs text-stone-500 transition-colors hover:text-red-600"
                    onClick={() => removeLine(line.productId, line.productVariantId)}
                    type="button"
                  >
                    {t("cart.remove")}
                  </button>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className="font-serif font-bold text-text-dark">
                  {Number.isFinite(lineTotal)
                    ? formatMad(lineTotal.toFixed(2))
                    : formatMad("0")}
                </p>
              </div>
            </div>
          );
        })}

        <Link
          className="mt-1 w-fit font-sans text-sm text-stone-500 hover:text-text-dark"
          href="/products"
        >
          {t("cart.continueShopping")}
        </Link>
      </div>

      <aside className="lg:sticky lg:top-28 lg:col-span-5">
        <div className="flex flex-col gap-5 rounded-sm border border-cream-dark bg-white p-6">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
            {t("cart.summary")}
          </p>

          <ul className="flex flex-col gap-3">
            {lines.map((l) => {
              const u = Number(l.price.replace(",", "."));
              const total = u * l.quantity;
              return (
                <li
                  key={cartLineKey(l)}
                  className="flex justify-between gap-3 font-sans text-sm"
                >
                  <span className="line-clamp-2 min-w-0 text-text-dark">
                    {l.name}
                    <span className="font-normal text-stone-500"> · {l.variantName}</span>
                    <span className="font-normal text-stone-500"> × {l.quantity}</span>
                  </span>
                  <span className="shrink-0 text-stone-500">
                    {Number.isFinite(total) ? formatMad(total.toFixed(2)) : formatMad("0")}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="flex items-baseline justify-between border-t border-cream-dark pt-4">
            <span className="font-sans text-sm text-stone-500">{t("cart.subtotal")}</span>
            <span className="font-serif text-2xl font-bold text-text-dark">
              {formatMad(subtotalMad.toFixed(2))}
            </span>
          </div>

          <Link
            className="flex w-full items-center justify-center gap-2 rounded-sm py-3.5 font-sans text-sm font-semibold text-white transition-opacity hover:opacity-90"
            href="/cart/checkout"
            style={{ background: "var(--color-ink)" }}
          >
            {t("cart.proceedCheckout")}
          </Link>
        </div>
      </aside>
    </div>
  );
}
