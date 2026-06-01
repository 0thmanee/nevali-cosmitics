"use client";

import { LANGUAGES, type LangCode } from "./data";

type Props = { current: LangCode; onChange: (lang: LangCode) => void };

export function LanguageSwitcher({ current, onChange }: Props) {
	return (
		<div className="flex items-center divide-x divide-cream-dark border border-cream-dark">
			{LANGUAGES.map((lang) => (
				<button
					className={`px-4 py-2 font-sans font-semibold text-xs uppercase tracking-[0.15em] transition-colors ${
						current === lang.code
							? "bg-primary text-white"
							: "bg-white text-text-muted hover:bg-cream"
					}`}
					key={lang.code}
					onClick={() => onChange(lang.code)}
				>
					{lang.label}
				</button>
			))}
		</div>
	);
}
