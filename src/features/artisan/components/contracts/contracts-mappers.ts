/**
 * Map API rows to display types for contracts/RFQ UI.
 */

import {
  getBuyerInitials,
  getBuyerColor,
  formatRelative,
  formatShortDate,
  formatPeriod,
} from "./contracts-formatters";
import type { RfqRow, ContractRow } from "~/app/api/contracts/schemas/contracts.schema";
import type {
  RfqDisplay,
  ContractDisplay,
  ContractHistoryRowDisplay,
} from "./contracts-types";

export function mapRfqToDisplay(
  r: RfqRow,
  index: number,
  viewer: "producer" | "buyer" = "producer"
): RfqDisplay {
  let negotiationHint = "";
  if (r.status === "NEGOTIATING" && r.negotiationTurn) {
    if (viewer === "producer") {
      negotiationHint =
        r.negotiationTurn === "PARTNER" ? "Your turn to reply in the thread." : "Awaiting buyer reply in the thread.";
    } else {
      negotiationHint =
        r.negotiationTurn === "BUYER" ? "Your turn to reply in the thread." : "Awaiting partner reply in the thread.";
    }
  }

  return {
    id: r.id,
    buyer: r.buyerName,
    buyerInitials: getBuyerInitials(r.buyerName),
    buyerColor: getBuyerColor(index),
    location: r.buyerLocation ?? "",
    product: r.product,
    quantity: r.quantity,
    deadline: r.deadlineAt ? formatShortDate(r.deadlineAt) : "—",
    received: formatRelative(r.createdAt),
    status: r.status,
    value: r.estimatedValue ?? "—",
    message: r.message ?? "",
    negotiationHint,
  };
}

export function mapContractToDisplay(c: ContractRow, index: number): ContractDisplay {
  return {
    id: c.id,
    buyer: c.buyerName,
    buyerInitials: getBuyerInitials(c.buyerName),
    buyerColor: getBuyerColor(index),
    location: c.buyerLocation ?? "",
    product: c.product,
    quantity: c.quantityLabel,
    value: c.valueLabel,
    started: formatShortDate(c.startedAt),
    expires: formatShortDate(c.expiresAt),
    status: c.status,
    progress: c.progress,
    deliveries: `${c.deliveriesCompleted} of ${c.deliveriesTotal}`,
  };
}

export function mapContractToHistoryDisplay(
  c: ContractRow,
  index: number
): ContractHistoryRowDisplay {
  return {
    id: c.id,
    buyer: c.buyerName,
    buyerInitials: getBuyerInitials(c.buyerName),
    buyerColor: getBuyerColor(index),
    product: c.product,
    value: c.valueLabel,
    period: formatPeriod(c.startedAt, c.expiresAt),
    status: c.status,
    deliveries: `${c.deliveriesCompleted} of ${c.deliveriesTotal}`,
  };
}
