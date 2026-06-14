import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { LanguageProvider } from "@/lib/LanguageContext";

export const metadata: Metadata = {
  title: "Harbor: Find the right next step, fast",
  description:
    "Harbor matches people experiencing housing insecurity with realistic nearby resources based on urgency, transportation, documents, pets, language, family needs, and accessibility.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#9d4f49",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <LanguageProvider>
          <Header />
          <main className="mx-auto w-full max-w-5xl px-4 pb-24">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
