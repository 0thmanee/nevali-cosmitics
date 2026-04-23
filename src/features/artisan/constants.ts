export const PRODUCT_STATUS_STYLES: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  APPROVED: {
    bg: "rgba(0,0,0,0.06)",
    color: "#000000",
    border: "1px solid #d8d0c4",
  },
  PENDING: {
    bg: "rgba(114,114,114,0.08)",
    color: "#727272",
    border: "1px solid #d8d0c4",
  },
  REJECTED: {
    bg: "rgba(180,30,30,0.08)",
    color: "#b91c1c",
    border: "1px solid rgba(185,28,28,0.25)",
  },
};

export const STATUS_DOT_COLORS: Record<string, string> = {
  APPROVED: "#000000",
  PENDING: "#727272",
  REJECTED: "#b91c1c",
};
