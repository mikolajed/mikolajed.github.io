import type { Metadata } from "next";
import { EB_Garamond, Cinzel } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Providers } from "@/components/providers";

const ebGaramond = EB_Garamond({ subsets: ["latin"], variable: "--font-eb-garamond" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${ebGaramond.variable} ${cinzel.variable} font-serif min-h-screen antialiased bg-background text-foreground`}>
        <Providers>
          <Nav />
          <main className="container mx-auto px-4 md:px-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
