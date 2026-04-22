/**
 * Constants for contracts/RFQ UI (status styles, tabs).
 */

export const CONTRACTS_TABS = ["RFQs", "Contracts", "History"] as const;
export type ContractsTab = (typeof CONTRACTS_TABS)[number];

export const RFQ_STATUS_STYLE: Record<
  string,
  { bg: string; color: string; border: string; label: string }
> = {
  NEW: {
    bg: "rgba(96,165,250,0.12)",
    color: "#60A5FA",
    border: "1px solid rgba(96,165,250,0.25)",
    label: "New",
  },
  QUOTED: {
    bg: "rgba(201,145,61,0.15)",
    color: "#E8B84B",
    border: "1px solid rgba(201,145,61,0.3)",
    label: "Quoted",
  },
  NEGOTIATING: {
    bg: "rgba(167,139,250,0.12)",
    color: "#a78bfa",
    border: "1px solid rgba(167,139,250,0.25)",
    label: "Negotiating",
  },
  DECLINED: {
    bg: "rgba(248,113,113,0.08)",
    color: "#f87171",
    border: "1px solid rgba(248,113,113,0.2)",
    label: "Declined",
  },
  CANCELLED: {
    bg: "rgba(107,114,128,0.1)",
    color: "#6b7280",
    border: "1px solid rgba(107,114,128,0.2)",
    label: "Cancelled",
  },
};
