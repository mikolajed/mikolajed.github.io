import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mikołaj Jędrzejewski",
  description: "Personal website and portfolio of Mikołaj Jędrzejewski, a Computer Science student at Warsaw University of Technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 antialiased`}>
        <Nav />
        <main className="container mx-auto px-4 py-8 md:py-16">
          {children}
        </main>
      </body>
    </html>
  );
}
