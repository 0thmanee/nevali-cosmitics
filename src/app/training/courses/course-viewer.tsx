"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, ArrowLeft, ChevronRight } from "lucide-react";
import { type Course, type LangCode, LANGUAGES } from "./data";
import { LanguageSwitcher } from "./language-switcher";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";

const STORAGE_KEY = "ch_course_lang";

function renderContent(content: string, dir: string) {
  const blocks = content.split("\n\n");
  return blocks.map((block, j) => {
    if (block.startsWith("| ")) {
      const rows = block.split("\n").filter((r) => !r.match(/^\|[-| ]+\|$/));
      return (
        <div key={j} className="overflow-x-auto my-2">
          <table className="w-full text-sm border border-cream-dark">
            {rows.map((row, ri) => {
              const cells = row.split("|").filter(Boolean).map((c) => c.trim());
              return (
                <tr key={ri} className={ri === 0 ? "bg-cream font-semibold text-text-dark" : "border-t border-cream-dark"}>
                  {cells.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 border-r border-cream-dark last:border-r-0">{cell}</td>
                  ))}
                </tr>
              );
            })}
          </table>
        </div>
      );
    }

    if (block.startsWith("- ")) {
      const items = block.split("\n").filter((l) => l.startsWith("- "));
      return (
        <ul key={j} className={`my-2 space-y-1 ${dir === "rtl" ? "pr-4" : "pl-4"}`}>
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-2 text-sm text-text-muted">
              <span className="text-secondary mt-1 shrink-0">—</span>
              <span>{renderInline(item.replace(/^- /, ""))}</span>
            </li>
          ))}
        </ul>
      );
    }

    return <p key={j} className="text-sm text-text-muted leading-relaxed">{renderInline(block)}</p>;
  });
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") ? (
      <strong key={i} className="font-semibold text-text-dark">{part.replace(/\*\*/g, "")}</strong>
    ) : part
  );
}

export function CourseViewer({ course }: { course: Course }) {
  const [lang, setLang] = useState<LangCode>("en");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as LangCode | null;
    if (saved && ["en", "fr", "ar"].includes(saved)) setLang(saved);
  }, []);

  function handleLangChange(l: LangCode) {
    setLang(l);
    localStorage.setItem(STORAGE_KEY, l);
  }

  const content = course.i18n[lang];
  const langMeta = LANGUAGES.find((l) => l.code === lang)!;
  const dir = langMeta.dir;

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 w-full">
      <div className="flex flex-col lg:flex-row gap-0 border border-cream-dark" dir={dir}>

        {/* Sidebar */}
        <aside className={`lg:w-72 shrink-0 bg-white ${dir === "rtl" ? "lg:border-l" : "lg:border-r"} border-b lg:border-b-0 border-cream-dark`}>
          <div className="px-5 py-4 border-b border-cream-dark flex items-center justify-between gap-3">
            <p className="font-sans font-semibold text-xs tracking-[0.15em] uppercase text-text-muted">
              {content.modules.length} {lang === "ar" ? "وحدات" : lang === "fr" ? "Modules" : "Modules"}
            </p>
            <LanguageSwitcher current={lang} onChange={handleLangChange} />
          </div>

          <nav className="divide-y divide-cream-dark">
            {content.modules.map((mod, i) => (
              <a key={i} href={`#module-${i + 1}`}
                className="flex items-start gap-3 px-5 py-4 hover:bg-cream transition-colors group"
              >
                <span className="font-serif font-bold text-secondary text-sm shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="font-sans text-sm text-text-dark leading-snug group-hover:text-forest-light transition-colors">
                    {mod.title}
                  </p>
                  <p className="font-sans text-xs text-text-muted mt-0.5 flex items-center gap-1">
                    <Clock size={10} /> {mod.duration}
                  </p>
                </div>
              </a>
            ))}
          </nav>

          <div className="px-5 py-4 border-t border-cream-dark">
            <Link href="/training"
              className={`flex items-center gap-2 font-sans text-xs text-text-muted hover:text-forest-light transition-colors ${dir === "rtl" ? "flex-row-reverse" : ""}`}
            >
              <ArrowLeft size={13} />
              {lang === "ar" ? "العودة إلى الدورات" : lang === "fr" ? "Retour aux cours" : "Back to all courses"}
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 bg-white divide-y divide-cream-dark">
          {content.modules.map((mod, i) => (
            <AnimateOnScroll key={i} direction="up" delay={i * 60}>
              <div id={`module-${i + 1}`} className="px-8 py-10 scroll-mt-20">
                <div className={`flex items-center gap-3 mb-5 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                  <span className="font-serif font-bold text-secondary text-xs tracking-[0.2em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 h-px bg-cream-dark" />
                  <span className="font-sans text-xs text-text-muted flex items-center gap-1">
                    <Clock size={11} /> {mod.duration}
                  </span>
                </div>

                <h2 className="font-serif font-bold uppercase text-forest-dark leading-tight mb-6"
                  style={{ fontSize: "clamp(18px, 1.8vw, 26px)" }}
                >
                  {mod.title}
                </h2>

                <div className="space-y-4">
                  {renderContent(mod.content, dir)}
                </div>
              </div>
            </AnimateOnScroll>
          ))}

          {/* CTA */}
          <div className={`px-8 py-8 bg-cream flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${dir === "rtl" ? "sm:flex-row-reverse" : ""}`}>
            <div>
              <p className="font-sans text-xs tracking-[0.15em] uppercase text-secondary font-semibold mb-1">
                {lang === "ar" ? "هل تريد المزيد؟" : lang === "fr" ? "Vous voulez aller plus loin ?" : "Want to go further?"}
              </p>
              <p className="font-sans text-sm text-text-muted">
                {lang === "ar"
                  ? "تشارك مع nevali للوصول إلى المنهج الكامل وعرض منتجاتك في الأسواق العالمية."
                  : lang === "fr"
                  ? "Rejoignez nevali pour accéder à tout le curriculum et lister vos produits sur les marchés mondiaux."
                  : "Partner with nevali to unlock the full curriculum and list your products globally."}
              </p>
            </div>
            <Link href="/auth/register"
              className={`shrink-0 inline-flex items-center gap-2 bg-primary px-6 py-3 font-sans font-semibold text-white text-xs tracking-[0.15em] uppercase hover:opacity-90 transition-opacity whitespace-nowrap ${dir === "rtl" ? "flex-row-reverse" : ""}`}
            >
              {lang === "ar" ? "انضم الآن" : lang === "fr" ? "Devenir partenaire" : "Become a Partner"}
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
