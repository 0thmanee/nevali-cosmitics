"use client";

import { ArrowLeft, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimateOnScroll } from "~/app/artisan-process/animate-on-scroll";
import { SHOW_MULTI_PRODUCER_EXPERIENCE } from "~/lib/platform-producer-mode";
import { type Course, LANGUAGES, type LangCode } from "./data";
import { LanguageSwitcher } from "./language-switcher";

const STORAGE_KEY = "ch_course_lang";

function renderContent(content: string, dir: string) {
	const blocks = content.split("\n\n");
	return blocks.map((block, j) => {
		if (block.startsWith("| ")) {
			const rows = block.split("\n").filter((r) => !r.match(/^\|[-| ]+\|$/));
			return (
				<div className="my-2 overflow-x-auto" key={j}>
					<table className="w-full border border-cream-dark text-sm">
						{rows.map((row, ri) => {
							const cells = row
								.split("|")
								.filter(Boolean)
								.map((c) => c.trim());
							return (
								<tr
									className={
										ri === 0
											? "bg-cream font-semibold text-text-dark"
											: "border-cream-dark border-t"
									}
									key={ri}
								>
									{cells.map((cell, ci) => (
										<td
											className="border-cream-dark border-r px-3 py-2 last:border-r-0"
											key={ci}
										>
											{cell}
										</td>
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
				<ul
					className={`my-2 space-y-1 ${dir === "rtl" ? "pr-4" : "pl-4"}`}
					key={j}
				>
					{items.map((item, ii) => (
						<li
							className="flex items-start gap-2 text-sm text-text-muted"
							key={ii}
						>
							<span className="mt-1 shrink-0 text-secondary">—</span>
							<span>{renderInline(item.replace(/^- /, ""))}</span>
						</li>
					))}
				</ul>
			);
		}

		return (
			<p className="text-sm text-text-muted leading-relaxed" key={j}>
				{renderInline(block)}
			</p>
		);
	});
}

function renderInline(text: string) {
	const parts = text.split(/(\*\*[^*]+\*\*)/g);
	return parts.map((part, i) =>
		part.startsWith("**") ? (
			<strong className="font-semibold text-text-dark" key={i}>
				{part.replace(/\*\*/g, "")}
			</strong>
		) : (
			part
		),
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
		<section className="mx-auto w-full max-w-7xl px-6 py-12">
			<div
				className="flex flex-col gap-0 border border-cream-dark lg:flex-row"
				dir={dir}
			>
				{/* Sidebar */}
				<aside
					className={`shrink-0 bg-white lg:w-72 ${dir === "rtl" ? "lg:border-l" : "lg:border-r"} border-cream-dark border-b lg:border-b-0`}
				>
					<div className="flex items-center justify-between gap-3 border-cream-dark border-b px-5 py-4">
						<p className="font-sans font-semibold text-text-muted text-xs uppercase tracking-[0.15em]">
							{content.modules.length}{" "}
							{lang === "ar" ? "وحدات" : lang === "fr" ? "Modules" : "Modules"}
						</p>
						<LanguageSwitcher current={lang} onChange={handleLangChange} />
					</div>

					<nav className="divide-y divide-cream-dark">
						{content.modules.map((mod, i) => (
							<a
								className="group flex items-start gap-3 px-5 py-4 transition-colors hover:bg-cream"
								href={`#module-${i + 1}`}
								key={i}
							>
								<span className="mt-0.5 shrink-0 font-bold font-serif text-secondary text-sm">
									{String(i + 1).padStart(2, "0")}
								</span>
								<div className="min-w-0">
									<p className="font-sans text-sm text-text-dark leading-snug transition-colors group-hover:text-forest-light">
										{mod.title}
									</p>
									<p className="mt-0.5 flex items-center gap-1 font-sans text-text-muted text-xs">
										<Clock size={10} /> {mod.duration}
									</p>
								</div>
							</a>
						))}
					</nav>

					<div className="border-cream-dark border-t px-5 py-4">
						<Link
							className={`flex items-center gap-2 font-sans text-text-muted text-xs transition-colors hover:text-forest-light ${dir === "rtl" ? "flex-row-reverse" : ""}`}
							href="/training"
						>
							<ArrowLeft size={13} />
							{lang === "ar"
								? "العودة إلى الدورات"
								: lang === "fr"
									? "Retour aux cours"
									: "Back to all courses"}
						</Link>
					</div>
				</aside>

				{/* Main content */}
				<div className="flex-1 divide-y divide-cream-dark bg-white">
					{content.modules.map((mod, i) => (
						<AnimateOnScroll delay={i * 60} direction="up" key={i}>
							<div className="scroll-mt-20 px-8 py-10" id={`module-${i + 1}`}>
								<div
									className={`mb-5 flex items-center gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}
								>
									<span className="font-bold font-serif text-secondary text-xs tracking-[0.2em]">
										{String(i + 1).padStart(2, "0")}
									</span>
									<div className="h-px flex-1 bg-cream-dark" />
									<span className="flex items-center gap-1 font-sans text-text-muted text-xs">
										<Clock size={11} /> {mod.duration}
									</span>
								</div>

								<h2
									className="mb-6 font-bold font-serif text-forest-dark uppercase leading-tight"
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
					<div
						className={`flex flex-col items-start justify-between gap-4 bg-cream px-8 py-8 sm:flex-row sm:items-center ${dir === "rtl" ? "sm:flex-row-reverse" : ""}`}
					>
						<div>
							<p className="mb-1 font-sans font-semibold text-secondary text-xs uppercase tracking-[0.15em]">
								{lang === "ar"
									? "هل تريد المزيد؟"
									: lang === "fr"
										? "Vous voulez aller plus loin ?"
										: "Want to go further?"}
							</p>
							<p className="font-sans text-sm text-text-muted">
								{lang === "ar"
									? SHOW_MULTI_PRODUCER_EXPERIENCE
										? "تشارك مع nevali للوصول إلى المنهج الكامل وعرض منتجاتك في الأسواق العالمية."
										: "سجّل الدخول بحساب فريق nevali للوصول إلى المنهج الكامل ومتابعة تقدّم تدريبكم."
									: lang === "fr"
										? SHOW_MULTI_PRODUCER_EXPERIENCE
											? "Rejoignez nevali pour accéder à tout le curriculum et lister vos produits sur les marchés mondiaux."
											: "Connectez-vous avec un compte studio nevali pour débloquer tout le curriculum et suivre la progression de votre équipe."
										: SHOW_MULTI_PRODUCER_EXPERIENCE
											? "Partner with nevali to unlock the full curriculum and list your products globally."
											: "Sign in with a Nevali studio account to unlock the full curriculum and track your team’s progress."}
							</p>
						</div>
						{SHOW_MULTI_PRODUCER_EXPERIENCE ? (
							<Link
								className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap bg-primary px-6 py-3 font-sans font-semibold text-white text-xs uppercase tracking-[0.15em] transition-opacity hover:opacity-90 ${dir === "rtl" ? "flex-row-reverse" : ""}`}
								href="/auth/register"
							>
								{lang === "ar"
									? "انضم الآن"
									: lang === "fr"
										? "Devenir partenaire"
										: "Become a Partner"}
								<ChevronRight size={14} />
							</Link>
						) : (
							<Link
								className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap border border-primary bg-white px-6 py-3 font-sans font-semibold text-primary text-xs uppercase tracking-[0.15em] transition-colors hover:bg-primary hover:text-white ${dir === "rtl" ? "flex-row-reverse" : ""}`}
								href="/auth/login"
							>
								{lang === "ar"
									? "تسجيل الدخول"
									: lang === "fr"
										? "Connexion équipe"
										: "Team sign in"}
								<ChevronRight size={14} />
							</Link>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
