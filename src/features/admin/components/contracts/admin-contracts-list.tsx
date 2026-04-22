"use client";

import React, { useState, useCallback } from "react";
import {
  useAdminRfqs,
  useAdminContracts,
  useSetRfqStatusAdmin,
  useSetContractStatusAdmin,
} from "../../hooks/use-admin-contracts";
import { useExportAdminContractsCsv, useExportAdminRfqsCsv } from "../../hooks/use-admin-exports";
import { useAdminOrganizationFilter } from "../../hooks/use-admin-organizations";
import type { RfqAdminRow, ContractAdminRow } from "~/app/api/contracts";

const TABS = [{ key: "RFQs" as const, label: "RFQs" }, { key: "Contracts" as const, label: "Contracts" }];

const rfqStatusStyles: Record<string, { bg: string; color: string; border: string }> = {
  NEW: { bg: "rgba(96,165,250,0.12)", color: "#60A5FA", border: "1px solid rgba(96,165,250,0.25)" },
  QUOTED: { bg: "rgba(201,145,61,0.15)", color: "#E8B84B", border: "1px solid rgba(201,145,61,0.3)" },
  NEGOTIATING: { bg: "rgba(201,145,61,0.15)", color: "#C9913D", border: "1px solid rgba(201,145,61,0.3)" },
  DECLINED: { bg: "rgba(180,30,30,0.12)", color: "#f87171", border: "1px solid rgba(248,113,113,0.25)" },
  CANCELLED: { bg: "rgba(100,100,100,0.12)", color: "#6b7280", border: "1px solid rgba(107,114,128,0.25)" },
};

const contractStatusStyles: Record<string, { bg: string; color: string; border: string }> = {
  ACTIVE: { bg: "rgba(26,5,0,0.08)", color: "#7a4d38", border: "1px solid #f0e8dc" },
  COMPLETED: { bg: "rgba(26,5,0,0.15)", color: "#1a0500", border: "1px solid rgba(13,40,24,0.25)" },
};

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(d));
}

export function AdminContractsList() {
  const { selectedOrganizationId } = useAdminOrganizationFilter();
  const [activeTab, setActiveTab] = useState<"RFQs" | "Contracts">("RFQs");

  const filters = { organizationId: selectedOrganizationId ?? undefined };
  const { data: rfqs = [], isLoading: rfqsLoading, isError: rfqsError, error: rfqsErrorObj } = useAdminRfqs(filters);
  const { data: contracts = [], isLoading: contractsLoading, isError: contractsError, error: contractsErrorObj } = useAdminContracts(filters);
  const setRfqStatusMutation = useSetRfqStatusAdmin();
  const setContractStatusMutation = useSetContractStatusAdmin();
  const exportRfqs = useExportAdminRfqsCsv();
  const exportContracts = useExportAdminContractsCsv();

  const handleCancelRfq = useCallback(
    (rfqId: string) => {
      setRfqStatusMutation.mutate({ rfqId, status: "CANCELLED" });
    },
    [setRfqStatusMutation]
  );

  const handleMarkContractCompleted = useCallback(
    (contractId: string) => {
      setContractStatusMutation.mutate({ contractId, status: "COMPLETED" });
    },
    [setContractStatusMutation]
  );

  const isLoading = activeTab === "RFQs" ? rfqsLoading : contractsLoading;
  const isError = activeTab === "RFQs" ? rfqsError : contractsError;
  const error = activeTab === "RFQs" ? rfqsErrorObj : contractsErrorObj;

  if (isLoading) {
    return (
      <div className="bg-white border border-[#f0e8dc] rounded-2xl px-5 py-12 flex items-center justify-center">
        <p className="font-sans text-sm text-[#7a4d38]">Loading…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white border border-[#f0e8dc] rounded-2xl px-5 py-6">
        <p className="font-sans text-sm text-red-600">
          {error instanceof Error ? error.message : "Failed to load."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white border border-[#f0e8dc] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ borderColor: "#f0e8dc" }}>
          <div>
            <h2 className="font-serif font-bold text-[15px] text-[#2a0f05]">Contracts & RFQs</h2>
            <p className="font-sans text-[11px] text-[#7a4d38] mt-0.5">
              {activeTab === "RFQs"
                ? `${rfqs.length} RFQ${rfqs.length !== 1 ? "s" : ""}. Cancel when needed.`
                : `${contracts.length} contract${contracts.length !== 1 ? "s" : ""}. Mark completed when signed/done.`}
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                disabled={exportRfqs.isPending}
                onClick={() => exportRfqs.mutate(selectedOrganizationId ?? null)}
                className="font-sans text-[11px] font-semibold rounded-lg px-3 py-1.5 border border-[#f0e8dc] bg-[#FAFAF7] text-[#2a0f05] hover:bg-white disabled:opacity-50"
              >
                {exportRfqs.isPending ? "Export…" : "Export RFQs CSV"}
              </button>
              <button
                type="button"
                disabled={exportContracts.isPending}
                onClick={() => exportContracts.mutate(selectedOrganizationId ?? null)}
                className="font-sans text-[11px] font-semibold rounded-lg px-3 py-1.5 border border-[#f0e8dc] bg-[#FAFAF7] text-[#2a0f05] hover:bg-white disabled:opacity-50"
              >
                {exportContracts.isPending ? "Export…" : "Export contracts CSV"}
              </button>
            </div>
            <div className="flex items-center gap-1 flex-wrap justify-end">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className="font-sans text-[12px] font-semibold rounded-xl px-3.5 py-1.5 transition-colors"
                style={
                  activeTab === tab.key
                    ? { background: "#1a0500", color: "white" }
                    : { background: "#F5F0E8", color: "#7a4d38", border: "1px solid #f0e8dc" }
                }
              >
                {tab.label}
                <span className="ml-1.5 text-[10px] font-bold rounded-full px-1.5 py-0.5 opacity-90">
                  {tab.key === "RFQs" ? rfqs.length : contracts.length}
                </span>
              </button>
            ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === "RFQs" ? (
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ background: "#FAFAF7", borderBottom: "1px solid #f0e8dc" }}>
                  <th className="text-left font-sans text-[10px] font-bold tracking-[0.12em] text-[#7a4d38] uppercase px-4 py-3">Organization</th>
                  <th className="text-left font-sans text-[10px] font-bold tracking-[0.12em] text-[#7a4d38] uppercase px-4 py-3">Buyer</th>
                  <th className="text-left font-sans text-[10px] font-bold tracking-[0.12em] text-[#7a4d38] uppercase px-4 py-3 hidden md:table-cell">Product</th>
                  <th className="text-left font-sans text-[10px] font-bold tracking-[0.12em] text-[#7a4d38] uppercase px-4 py-3">Status</th>
                  <th className="text-left font-sans text-[10px] font-bold tracking-[0.12em] text-[#7a4d38] uppercase px-4 py-3 hidden lg:table-cell">Created</th>
                  <th className="text-right font-sans text-[10px] font-bold tracking-[0.12em] text-[#7a4d38] uppercase px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rfqs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="font-sans text-sm text-[#7a4d38] px-4 py-8 text-center">No RFQs.</td>
                  </tr>
                ) : (
                  (rfqs as RfqAdminRow[]).map((r) => {
                    const style = rfqStatusStyles[r.status] ?? rfqStatusStyles.NEW;
                    const canCancel = r.status !== "DECLINED" && r.status !== "CANCELLED";
                    return (
                      <tr key={r.id} className="border-b border-[#f0e8dc] hover:bg-[#F5F0E8]/60 transition-colors" style={{ borderColor: "#f0e8dc" }}>
                        <td className="px-4 py-3 font-sans text-[12px] font-medium text-[#2a0f05]">{r.organizationName}</td>
                        <td className="px-4 py-3 font-sans text-[12px] text-[#2a0f05]">{r.buyerName}</td>
                        <td className="px-4 py-3 font-sans text-[12px] text-[#7a4d38] hidden md:table-cell truncate max-w-[180px]" title={r.product}>{r.product}</td>
                        <td className="px-4 py-3">
                          <span className="font-sans text-[10px] font-bold tracking-wide rounded-full px-2.5 py-0.5 uppercase" style={style}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-sans text-[12px] text-[#7a4d38] hidden lg:table-cell">{formatDate(r.createdAt)}</td>
                        <td className="px-4 py-3 text-right">
                          {canCancel && (
                            <button
                              type="button"
                              onClick={() => handleCancelRfq(r.id)}
                              disabled={setRfqStatusMutation.isPending}
                              className="font-sans text-[11px] font-semibold rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-60"
                              style={{ background: "rgba(180,30,30,0.12)", color: "#b91c1c", border: "1px solid rgba(180,30,30,0.3)" }}
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ background: "#FAFAF7", borderBottom: "1px solid #f0e8dc" }}>
                  <th className="text-left font-sans text-[10px] font-bold tracking-[0.12em] text-[#7a4d38] uppercase px-4 py-3">Organization</th>
                  <th className="text-left font-sans text-[10px] font-bold tracking-[0.12em] text-[#7a4d38] uppercase px-4 py-3">Buyer</th>
                  <th className="text-left font-sans text-[10px] font-bold tracking-[0.12em] text-[#7a4d38] uppercase px-4 py-3 hidden md:table-cell">Product</th>
                  <th className="text-left font-sans text-[10px] font-bold tracking-[0.12em] text-[#7a4d38] uppercase px-4 py-3">Value</th>
                  <th className="text-left font-sans text-[10px] font-bold tracking-[0.12em] text-[#7a4d38] uppercase px-4 py-3">Status</th>
                  <th className="text-left font-sans text-[10px] font-bold tracking-[0.12em] text-[#7a4d38] uppercase px-4 py-3 hidden lg:table-cell">Started</th>
                  <th className="text-right font-sans text-[10px] font-bold tracking-[0.12em] text-[#7a4d38] uppercase px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contracts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="font-sans text-sm text-[#7a4d38] px-4 py-8 text-center">No contracts.</td>
                  </tr>
                ) : (
                  (contracts as ContractAdminRow[]).map((c) => {
                    const style = contractStatusStyles[c.status] ?? contractStatusStyles.ACTIVE;
                    const canComplete = c.status === "ACTIVE";
                    return (
                      <tr key={c.id} className="border-b border-[#f0e8dc] hover:bg-[#F5F0E8]/60 transition-colors" style={{ borderColor: "#f0e8dc" }}>
                        <td className="px-4 py-3 font-sans text-[12px] font-medium text-[#2a0f05]">{c.organizationName}</td>
                        <td className="px-4 py-3 font-sans text-[12px] text-[#2a0f05]">{c.buyerName}</td>
                        <td className="px-4 py-3 font-sans text-[12px] text-[#7a4d38] hidden md:table-cell truncate max-w-[180px]" title={c.product}>{c.product}</td>
                        <td className="px-4 py-3 font-sans text-[12px] text-[#2a0f05]">{c.valueLabel}</td>
                        <td className="px-4 py-3">
                          <span className="font-sans text-[10px] font-bold tracking-wide rounded-full px-2.5 py-0.5 uppercase" style={style}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-sans text-[12px] text-[#7a4d38] hidden lg:table-cell">{formatDate(c.startedAt)}</td>
                        <td className="px-4 py-3 text-right">
                          {canComplete && (
                            <button
                              type="button"
                              onClick={() => handleMarkContractCompleted(c.id)}
                              disabled={setContractStatusMutation.isPending}
                              className="font-sans text-[11px] font-semibold rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-60"
                              style={{ background: "#1a0500", color: "white", border: "1px solid #1a0500" }}
                            >
                              Mark completed
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
