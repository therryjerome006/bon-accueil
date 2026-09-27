import type { Metadata } from "next";
import { Fraunces, Inter, Syne } from "next/font/google";
import { HOTEL_DESCRIPTION, HOTEL_NAME, HOTEL_CITY } from "@/lib/hotel";
import { NotificationFab } from "@/components/NotificationFab";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${HOTEL_NAME} — ${HOTEL_CITY}`,
  description: HOTEL_DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${fraunces.variable} ${inter.variable} ${syne.variable} font-sans bg-linen text-ink`}>
        {children}
        <NotificationFab />
      </body>
    </html>
  );
}
