import "~/styles/globals.css";

import type { Metadata } from "next";
import { Oswald, Space_Grotesk } from "next/font/google";
import { QueryProvider } from "~/components/providers/query-provider";

export const metadata: Metadata = {
  title: "nevali — Bio Moroccan cosmetics, direct from brands",
  description:
    "Discover original Moroccan cosmetics: clean formulas, botanical oils, and heritage rituals—curated from verified local brands with transparent checkout.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${oswald.variable} ${spaceGrotesk.variable}`} lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
