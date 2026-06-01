import "~/styles/globals.css";

import type { Metadata } from "next";
import { Amiri, Fraunces, Roboto_Mono, Tajawal } from "next/font/google";
import { CookieConsent } from "~/components/analytics/cookie-consent";
import { I18nProvider } from "~/components/i18n/i18n-provider";
import { QueryProvider } from "~/components/providers/query-provider";
import { type AppLocale, isRtlLocale } from "~/lib/i18n/config";
import { getMessages } from "~/lib/i18n/load-messages";
import { getLocale, getTranslator } from "~/lib/i18n/server";
import { siteUrl } from "~/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslator();
	const title = t("meta.appTitle");
	const description = t("meta.appDescription");
	return {
		metadataBase: new URL(siteUrl()),
		title,
		description,
		icons: [{ rel: "icon", url: "/favicon.ico" }],
		alternates: { canonical: "/" },
		openGraph: {
			type: "website",
			siteName: "nevali",
			title,
			description,
			url: "/",
		},
		twitter: { card: "summary_large_image", title, description },
	};
}

const fraunces = Fraunces({
	subsets: ["latin"],
	variable: "--font-fraunces",
});

const robotoMono = Roboto_Mono({
	subsets: ["latin"],
	variable: "--font-roboto-mono",
});

/** Arabic: Amiri for display/serif (editorial), Tajawal for elegant UI/body copy. */
const arabicDisplay = Amiri({
	subsets: ["arabic"],
	weight: ["400", "700"],
	variable: "--font-arabic-display",
	display: "swap",
	adjustFontFallback: true,
});

const arabicUi = Tajawal({
	subsets: ["arabic"],
	weight: ["300", "400", "500", "700"],
	variable: "--font-arabic-ui",
	display: "swap",
	adjustFontFallback: true,
});

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const locale = await getLocale();
	const messages = getMessages(locale);
	const dir = isRtlLocale(locale) ? "rtl" : "ltr";
	const htmlClass = [
		fraunces.variable,
		robotoMono.variable,
		locale === "ar" ? `${arabicDisplay.variable} ${arabicUi.variable}` : "",
	]
		.filter(Boolean)
		.join(" ");

	const base = siteUrl();
	const orgJsonLd = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "nevali",
		url: base,
		logo: `${base}/favicon.ico`,
	};
	const websiteJsonLd = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "nevali",
		url: base,
	};

	return (
		<html className={htmlClass} dir={dir} lang={locale}>
			<body className={locale === "ar" ? "font-arabic" : undefined}>
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD
					dangerouslySetInnerHTML={{
						__html: JSON.stringify([orgJsonLd, websiteJsonLd]),
					}}
					type="application/ld+json"
				/>
				<I18nProvider locale={locale as AppLocale} messages={messages}>
					<QueryProvider>{children}</QueryProvider>
					<CookieConsent />
				</I18nProvider>
			</body>
		</html>
	);
}
