import "~/styles/globals.css";

import type { Metadata } from "next";
import { Fraunces, Roboto_Mono } from "next/font/google";
import { QueryProvider } from "~/components/providers/query-provider";

export const metadata: Metadata = {
  title: "Nevali — Moroccan skincare & beauty",
  description:
    "Nevali: Moroccan skincare and beauty from our own studio—transparent labels, traceable ingredients, and quality you can shop with confidence.",
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
