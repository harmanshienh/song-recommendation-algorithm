import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: '--font-sans', weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: "Songifind",
  description: "Discover songs tailored to your preferences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased p-8`}
      >
        {children}
      </body>
    </html>
  );
}
