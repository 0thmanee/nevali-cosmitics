import React from "react";

const stats = [
  { label: "CERTIFIED PARTNERS", value: "240+" },
  { label: "LISTED PRODUCTS", value: "1,800+" },
  { label: "EXPORT MARKETS", value: "34" },
  { label: "TRANSACTIONS PROCESSED", value: "€4.2M", gold: true },
];

export default function StatsBar() {
  return (
    <section className="bg-white border-b border-cream-dark">
      <div className="max-w-7xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-2 md:flex md:items-center md:justify-between gap-6 md:gap-0">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-8 md:gap-16">
              <div className="flex flex-col gap-1.5">
                <span
                  className={`font-serif text-[28px] md:text-[32px] font-bold leading-none ${
                    stat.gold ? "text-secondary" : "text-text-dark"
                  }`}
                >
                  {stat.value}
                </span>
                <span className="font-sans text-xs md:text-xs tracking-widest text-text-muted uppercase">
                  {stat.label}
                </span>
              </div>
              {i < stats.length - 1 && (
                <div className="hidden md:block w-px h-10 bg-cream-dark" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
