"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutGrid, CheckCircle, AlertCircle, XCircle, Trash2 } from "lucide-react";
import { AdminStatCard, STAT_ICON_COLOR } from "../admin-stat-card";
import {
  useAdminProducts,
  useAdminProductCounts,
  useSetProductStatus,
} from "../../hooks/use-admin-products";
import { useAdminOrganizationFilter } from "../../hooks/use-admin-organizations";
import { RejectProductModal } from "./reject-product-modal";
import { ApproveProductModal } from "./approve-product-modal";
import type { ProductAdminListRow, ProductPaymentOptionValue } from "~/app/api/products/schemas/products.schema";
import {
  AdminPageWrapper,
  AdminStatRow,
  AdminTable,
  AdminTableToolbar,
  AdminTableHead,
  AdminTableHeadCell,
  AdminTableRow,
  AdminTableEmpty,
  FilterTab,
  BtnPrimary,
  BtnSecondary,
  BtnDanger,
  StatusBadge,
} from "../admin-ui";

const CATEGORY_GRADIENTS: Record<string, string> = {
  "Oils & Extracts": "linear-gradient(135deg, #C8963C 0%, #e6b86a 100%)",
  "Spices & Herbs": "linear-gradient(135deg, #d97706 0%, #fbbf24 100%)",
  "Florals & Essences": "linear-gradient(135deg, #c94060 0%, #e8708a 100%)",
  "Dried Fruits": "linear-gradient(135deg, #8b4513 0%, #c68642 100%)",
  "Cosmetics": "linear-gradient(135deg, #6b3a9a 0%, #a06acc 100%)",
};

function getGradient(category: string): string {
  return CATEGORY_GRADIENTS[category] ?? "linear-gradient(135deg, #7A2915 0%, #b05040 100%)";
}

const CATEGORY_COLORS: Record<string, { bg: string; dot: string; text: string }> = {
  "Oils & Extracts": { bg: "#fdf6ec", dot: "#C8963C", text: "#9a6820" },
  "Spices & Herbs": { bg: "#fff7e0", dot: "#d97706", text: "#92580a" },
  "Florals & Essences": { bg: "#fce8f0", dot: "#c94060", text: "#a03050" },
  "Dried Fruits": { bg: "#f5ece0", dot: "#8b4513", text: "#6b3010" },
  "Cosmetics": { bg: "#f2e8fa", dot: "#7c3aed", text: "#5b21b6" },
};

function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category] ?? { bg: "#fdf6ec", dot: "#7a4d38", text: "#4a2010" };
}

const STATUS_TABS = [
  { key: "ALL" as const,      label: "All" },
  { key: "APPROVED" as const, label: "Approved" },
  { key: "PENDING" as const,  label: "Pending" },
  { key: "REJECTED" as const, label: "Rejected" },
];

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(new Date(d));
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

export function ProductsList() {
  const router = useRouter();
  const { selectedOrganizationId } = useAdminOrganizationFilter();
  const [statusFilter, setStatusFilter] = useState<"PENDING" | "APPROVED" | "REJECTED" | "ALL">("ALL");
  const [rejectingProduct, setRejectingProduct] = useState<ProductAdminListRow | null>(null);
  const [approvingProduct, setApprovingProduct] = useState<ProductAdminListRow | null>(null);

  const { data: allProducts = [], isLoading, isError, error } = useAdminProducts("ALL", selectedOrganizationId);
  const { data: counts } = useAdminProductCounts(selectedOrganizationId);
  const setStatusMutation = useSetProductStatus();

  const products =
    statusFilter === "ALL"
      ? allProducts
      : allProducts.filter((p) => p.status === statusFilter);

  const handleApproveConfirm = useCallback(
    (paymentOption: ProductPaymentOptionValue) => {
      if (!approvingProduct) return;
      setStatusMutation.mutate(
        { productId: approvingProduct.id, status: "APPROVED", paymentOption },
        { onSuccess: () => setApprovingProduct(null) },
      );
    },
    [approvingProduct, setStatusMutation],
  );

  const handleRejectConfirm = useCallback(
    (rejectionReason: string) => {
      if (!rejectingProduct) return;
      setStatusMutation.mutate(
        { productId: rejectingProduct.id, status: "REJECTED", rejectionReason: rejectionReason || undefined },
        { onSuccess: () => setRejectingProduct(null) },
      );
    },
    [rejectingProduct, setStatusMutation],
  );

  if (isLoading) {
    return (
      <AdminPageWrapper>
        <p className="font-sans text-sm text-text-muted">Loading products…</p>
      </AdminPageWrapper>
    );
  }

  if (isError) {
    return (
      <AdminPageWrapper>
        <p className="font-sans text-sm text-red-600">
          {error instanceof Error ? error.message : "Failed to load products."}
        </p>
      </AdminPageWrapper>
    );
  }

  return (
    <AdminPageWrapper>
      <AdminStatRow>
        <AdminStatCard label="Total Products" value={counts?.ALL ?? "—"}      variant="neutral" icon={<LayoutGrid  size={18} color={STAT_ICON_COLOR.neutral} strokeWidth={1.5} />} />
        <AdminStatCard label="Approved"       value={counts?.APPROVED ?? "—"} variant="green"   icon={<CheckCircle size={18} color={STAT_ICON_COLOR.green}   strokeWidth={1.5} />} />
        <AdminStatCard label="Pending Review" value={counts?.PENDING ?? "—"}  variant="amber"   icon={<AlertCircle size={18} color={STAT_ICON_COLOR.amber}   strokeWidth={1.5} />} />
        <AdminStatCard label="Rejected"       value={counts?.REJECTED ?? "—"} variant="red"     icon={<XCircle     size={18} color={STAT_ICON_COLOR.red}     strokeWidth={1.5} />} />
      </AdminStatRow>

      <AdminTable>
        <AdminTableToolbar>
          <div className="flex gap-1">
            {STATUS_TABS.map((tab) => (
              <FilterTab
                key={tab.key}
                label={tab.label}
                count={counts?.[tab.key]}
                active={statusFilter === tab.key}
                onClick={() => setStatusFilter(tab.key)}
              />
            ))}
          </div>
          <p className="font-sans text-xs text-text-muted">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </AdminTableToolbar>

        <AdminTableHead>
          <div className="w-7 shrink-0" />
          <AdminTableHeadCell className="[flex:2.8]">Product</AdminTableHeadCell>
          <AdminTableHeadCell className="[flex:1.6]">Partner</AdminTableHeadCell>
          <AdminTableHeadCell className="[flex:1.2]">Category</AdminTableHeadCell>
          <AdminTableHeadCell className="[flex:0.9]">Status</AdminTableHeadCell>
          <AdminTableHeadCell className="[flex:0.8]">Added</AdminTableHeadCell>
          <AdminTableHeadCell className="[flex:0.8] text-right">Actions</AdminTableHeadCell>
        </AdminTableHead>

        {products.length === 0 ? (
          <AdminTableEmpty message="No products in this view." />
        ) : (
          products.map((p) => {
            const catStyle = getCategoryStyle(p.category);
            return (
              <AdminTableRow
                key={p.id}
                onClick={() => router.push(`/admin/products/${p.id}`)}
              >
                <div className="w-7 shrink-0">
                  <div className="w-[15px] h-[15px] border-[1.5px] border-cream-dark" />
                </div>

                <div className="[flex:2.8] flex items-center gap-3">
                  {p.firstImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.firstImageUrl} alt="" className="w-11 h-11 object-cover shrink-0" />
                  ) : (
                    <div className="w-11 h-11 shrink-0" style={{ background: getGradient(p.category) }} />
                  )}
                  <div>
                    <div className="font-sans font-semibold text-sm text-text-dark leading-[1.3]">{p.name}</div>
                    <div className="font-sans text-xs text-text-muted mt-0.5">
                      {p.category}{p.moq ? ` · Min ${p.moq}` : ""}
                    </div>
                  </div>
                </div>

                <div className="[flex:1.6] flex items-center gap-2">
                  <div className="w-[26px] h-[26px] flex items-center justify-center shrink-0 bg-secondary">
                    <span className="font-sans font-bold text-[9px] text-white">
                      {getInitials(p.organizationName ?? "—")}
                    </span>
                  </div>
                  <span className="font-sans text-sm text-text-dark">{p.organizationName}</span>
                </div>

                <div className="[flex:1.2]">
                  <span
                    className="inline-flex items-center gap-1.5 font-sans text-xs font-medium px-2.5 py-[3px]"
                    style={{ background: catStyle.bg, color: catStyle.text }}
                  >
                    <span className="w-1.5 h-1.5 shrink-0" style={{ background: catStyle.dot }} />
                    {p.category}
                  </span>
                </div>

                <div className="[flex:0.9]">
                  <StatusBadge status={p.status} />
                </div>

                <div className="[flex:0.8] font-sans text-sm text-text-muted">
                  {formatDate(p.createdAt)}
                </div>

                <div className="[flex:0.8] flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                  {p.status === "PENDING" && (
                    <BtnPrimary
                      onClick={() => setApprovingProduct(p)}
                      disabled={setStatusMutation.isPending}
                    >
                      {setStatusMutation.isPending ? "…" : "Approve"}
                    </BtnPrimary>
                  )}
                  <BtnSecondary href={`/admin/products/${p.id}`}>View</BtnSecondary>
                  {p.status === "PENDING" && (
                    <BtnDanger
                      onClick={() => setRejectingProduct(p)}
                      disabled={setStatusMutation.isPending}
                    >
                      <Trash2 size={14} strokeWidth={1.2} />
                    </BtnDanger>
                  )}
                </div>
              </AdminTableRow>
            );
          })
        )}

        <div className="flex items-center justify-between px-5 py-3.5 bg-cream border-t border-cream-dark">
          <p className="font-sans text-xs text-text-muted">
            {products.length} product{products.length !== 1 ? "s" : ""} shown
          </p>
        </div>
      </AdminTable>

      {approvingProduct && (
        <ApproveProductModal
          productName={approvingProduct.name}
          onConfirm={handleApproveConfirm}
          onCancel={() => setApprovingProduct(null)}
          isSubmitting={setStatusMutation.isPending}
        />
      )}
      {rejectingProduct && (
        <RejectProductModal
          productId={rejectingProduct.id}
          productName={rejectingProduct.name}
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectingProduct(null)}
        />
      )}
    </AdminPageWrapper>
  );
}
