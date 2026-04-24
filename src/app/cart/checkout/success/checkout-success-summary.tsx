"use client";

import { useEffect, useState } from "react";
import { useI18n } from "~/components/i18n/i18n-provider";
import {
  consumeLastCheckoutConfirmation,
  type LastCheckoutConfirmationPayload,
} from "~/lib/checkout-confirmation-storage";

export function CheckoutSuccessSummary({ orderId }: { orderId: string | undefined }) {
  const { t } = useI18n();
  const [data, setData] = useState<LastCheckoutConfirmationPayload | null>(null);

  function paymentLabel(method: string) {
    if (method === "COD") return t("checkout.paymentMethodCod");
    if (method === "CARD") return t("checkout.paymentMethodCard");
    return method;
  }

  useEffect(() => {
    if (!orderId || typeof window === "undefined") return;
    setData(consumeLastCheckoutConfirmation(orderId));
  }, [orderId]);

  if (!data) return null;

  return (
    <div className="w-full max-w-md rounded-sm border border-cream-dark bg-white px-5 py-4 text-left shadow-sm">
      <h2 className="mb-3 font-serif text-base font-bold text-text-dark">
        {t("checkoutSuccessSummary.title")}
      </h2>
      <dl className="space-y-3 font-sans text-sm text-text-dark">
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
            {t("checkoutSuccessSummary.contact")}
          </dt>
          <dd className="mt-0.5">
            <p className="font-medium">{data.buyerName}</p>
            <p className="text-stone-500">{data.buyerEmail}</p>
            {data.buyerPhone ? <p className="text-stone-500">{data.buyerPhone}</p> : null}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
            {t("checkoutSuccessSummary.shippingAddress")}
          </dt>
          <dd className="mt-0.5 leading-relaxed text-text-dark">
            <p>{data.addressLine1}</p>
            {data.addressLine2 ? <p>{data.addressLine2}</p> : null}
            <p>
              {data.postalCode} {data.city}
            </p>
            <p>{data.country}</p>
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
            {t("checkoutSuccessSummary.payment")}
          </dt>
          <dd className="mt-0.5">{paymentLabel(data.paymentMethod)}</dd>
        </div>
      </dl>
      <p className="mt-3 border-t border-cream-dark pt-3 font-sans text-[11px] text-stone-500">
        {t("checkoutSuccessSummary.footerNote")}
      </p>
    </div>
  );
}
