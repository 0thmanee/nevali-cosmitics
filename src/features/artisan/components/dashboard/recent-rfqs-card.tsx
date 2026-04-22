"use client";

import React from "react";
import Link from "next/link";
import { useArtisanDashboardStats } from "../../hooks/use-dashboard-stats";

export function RecentRFQsCard() {
  const { data: stats } = useArtisanDashboardStats();
  const openRfqs = stats?.openRfqs ?? 0;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "white", border: "1px solid #f0e8dc" }}
    >
      <div
        className="px-5 py-3.5 border-b"
        style={{ borderColor: "#f0e8dc" }}
      >
        <h2 className="font-serif font-bold text-[15px] text-[#2a0f05]">
          Recent RFQs
        </h2>
        <p className="font-sans text-[12px] text-[#7a4d38] mt-0.5">
          {openRfqs === 0
            ? "No open requests"
            : `${openRfqs} open request${openRfqs !== 1 ? "s" : ""}`}
        </p>
      </div>
      {openRfqs === 0 ? (
        <div className="px-5 py-6 text-center">
          <p className="font-sans text-sm text-[#7a4d38]">
            When buyers send requests for quotes, they’ll appear here.
          </p>
          <Link
            href="/artisan/contracts"
            className="mt-3 inline-block font-sans text-sm font-medium rounded-xl py-2.5 px-4 transition-colors"
            style={{
              background: "#F5F0E8",
              color: "#2a0f05",
              border: "1px solid #f0e8dc",
            }}
          >
            Go to Contracts & RFQs
          </Link>
        </div>
      ) : (
        <>
          {/* When RFQ list exists: render recent items here */}
          <div className="px-5 pb-4 pt-1">
            <Link
              href="/artisan/contracts"
              className="block w-full font-sans text-sm font-medium rounded-xl py-2.5 text-center transition-colors"
              style={{
                background: "#F5F0E8",
                color: "#2a0f05",
                border: "1px solid #f0e8dc",
              }}
            >
              View all RFQs
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
