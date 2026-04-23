import "~/styles/globals.css";

import type { Metadata } from "next";
import { Fraunces, Roboto_Mono } from "next/font/google";
import { QueryProvider } from "~/components/providers/query-provider";

export const metadata: Metadata = {
  title: "NEVALI — Premium Moroccan cosmetics",
  description:
    "Purity, elegance, and modern refinement. Skincare from Morocco crafted with natural, organic, and ethically sourced ingredients—transparent, traceable, and held to rigorous quality standards.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${fraunces.variable} ${robotoMono.variable}`} lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
