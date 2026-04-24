import "~/styles/globals.css";

import type { Metadata } from "next";
import { Amiri, Fraunces, IBM_Plex_Sans_Arabic, Roboto_Mono } from "next/font/google";
import { I18nProvider } from "~/components/i18n/i18n-provider";
import { QueryProvider } from "~/components/providers/query-provider";
import { isRtlLocale, type AppLocale } from "~/lib/i18n/config";
import { getMessages } from "~/lib/i18n/load-messages";
import { getLocale, getTranslator } from "~/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return {
    title: t("meta.appTitle"),
    description: t("meta.appDescription"),
    icons: [{ rel: "icon", url: "/favicon.ico" }],
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

/** Arabic: Amiri for display/serif (editorial), IBM Plex Sans Arabic for UI/body (premium clarity). */
const arabicDisplay = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic-display",
  display: "swap",
  adjustFontFallback: true,
});

const arabicUi = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
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

  return (
    <html className={htmlClass} dir={dir} lang={locale}>
      <body className={locale === "ar" ? "font-arabic" : undefined}>
        <I18nProvider locale={locale as AppLocale} messages={messages}>
          <QueryProvider>{children}</QueryProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
