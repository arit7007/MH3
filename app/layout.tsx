import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DignityLink — Find the right next step, fast",
  description:
    "DignityLink matches people experiencing housing insecurity with realistic nearby resources based on urgency, transportation, documents, pets, language, family needs, and accessibility.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7c3aed",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-screen font-sans antialiased">
        <Header />
        <main className="mx-auto w-full max-w-5xl px-4 pb-24">{children}</main>
      </body>
    </html>
  );
}
