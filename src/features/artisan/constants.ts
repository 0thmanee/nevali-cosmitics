export const PRODUCT_STATUS_STYLES: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  APPROVED: {
    bg: "rgba(0,0,0,0.85)",
    color: "#727272",
    border: "1px solid rgba(200,150,60,0.3)",
  },
  PENDING: {
    bg: "rgba(201,145,61,0.2)",
    color: "#E8B84B",
    border: "1px solid rgba(201,145,61,0.3)",
  },
  REJECTED: {
    bg: "rgba(180,30,30,0.2)",
    color: "#f87171",
    border: "1px solid rgba(248,113,113,0.25)",
  },
};

export const STATUS_DOT_COLORS: Record<string, string> = {
  APPROVED: "#727272",
  PENDING: "#E8B84B",
  REJECTED: "#f87171",
};
