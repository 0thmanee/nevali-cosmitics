"use client";

import { useEffect, useState } from "react";
import {
  consumeLastCheckoutConfirmation,
  type LastCheckoutConfirmationPayload,
} from "~/lib/checkout-confirmation-storage";

function paymentLabel(method: string) {
  if (method === "COD") return "Cash on delivery";
  if (method === "CARD") return "Card payment";
  return method;
}

export function CheckoutSuccessSummary({ orderId }: { orderId: string | undefined }) {
  const [data, setData] = useState<LastCheckoutConfirmationPayload | null>(null);

  useEffect(() => {
    if (!orderId || typeof window === "undefined") return;
    setData(consumeLastCheckoutConfirmation(orderId));
  }, [orderId]);

  if (!data) return null;

  return (
    <div className="w-full max-w-md rounded-sm border border-cream-dark bg-white px-5 py-4 text-left shadow-sm">
      <h2 className="mb-3 font-serif text-base font-bold text-text-dark">Order details you submitted</h2>
      <dl className="space-y-3 font-sans text-sm text-text-dark">
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Contact</dt>
          <dd className="mt-0.5">
            <p className="font-medium">{data.buyerName}</p>
            <p className="text-stone-500">{data.buyerEmail}</p>
            {data.buyerPhone ? <p className="text-stone-500">{data.buyerPhone}</p> : null}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
            Shipping address
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
          <dt className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Payment</dt>
          <dd className="mt-0.5">{paymentLabel(data.paymentMethod)}</dd>
        </div>
      </dl>
      <p className="mt-3 border-t border-cream-dark pt-3 font-sans text-[11px] text-stone-500">
        Save this reference or check your email. This summary is only shown once on this device.
      </p>
    </div>
  );
}
