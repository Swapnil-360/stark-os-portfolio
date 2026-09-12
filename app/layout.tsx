import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { DataProvider } from "@/context/DataContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mrswapnil.me"),
  title: "Md. Miftahur Rahman Swapnil | Cinematic Command Portfolio",
  description:
    "Cinematic sci-fi command interface portfolio of Md. Miftahur Rahman Swapnil. Frontend Developer, Creative Technologist, and UI/UX Designer.",
  keywords: [
    "Swapnil",
    "Md. Miftahur Rahman Swapnil",
    "Frontend Developer",
    "Creative Developer",
    "BUBT",
    "Next.js",
    "React",
    "Portfolio",
  ],
  authors: [{ name: "Md. Miftahur Rahman Swapnil" }],
  creator: "Md. Miftahur Rahman Swapnil",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.mrswapnil.me/",
    title: "Md. Miftahur Rahman Swapnil | Cinematic Command Portfolio",
    description:
      "Futuristic sci-fi HUD command portfolio of Md. Miftahur Rahman Swapnil.",
    siteName: "Swapnil Command System",
    images: [
      {
        url: "/images/theme.png",
        width: 1200,
        height: 630,
        alt: "Swapnil Portfolio HUD Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Md. Miftahur Rahman Swapnil | Creative Developer",
    description:
      "Cinematic sci-fi command interface portfolio of Md. Miftahur Rahman Swapnil.",
    creator: "@thomascryptoxx",
    images: ["/images/theme.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased selection:bg-accent selection:text-white relative min-h-screen">
        <ThemeProvider>
          <DataProvider>
            {children}
          </DataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
