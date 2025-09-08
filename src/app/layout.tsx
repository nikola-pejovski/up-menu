import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/providers/react-query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Burger House - Premium Burger Experience",
  description:
    "Discover our carefully crafted selection of burgers, sides, and beverages. Each item is prepared with the finest ingredients and attention to detail.",
  keywords: "burger, restaurant, food, menu, burger house",
  authors: [{ name: "Burger House" }],
  openGraph: {
    title: "Burger House - Premium Burger Experience",
    description:
      "Discover our carefully crafted selection of burgers, sides, and beverages.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
