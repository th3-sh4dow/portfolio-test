import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bicky Muduli | Full Stack Developer & Cybersecurity Specialist",
  description: "Portfolio of Bicky Muduli - A passionate Full Stack Developer and Cybersecurity Specialist crafting beautiful, secure digital experiences with modern technologies.",
  keywords: [
    "Bicky Muduli",
    "Full Stack Developer",
    "Cybersecurity",
    "React",
    "Next.js",
    "Web Developer",
    "Portfolio",
    "GSAP",
    "TypeScript",
    "Security Specialist",
  ],
  authors: [{ name: "Bicky Muduli" }],
  creator: "Bicky Muduli",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Bicky Muduli | Full Stack Developer & Cybersecurity Specialist",
    description: "Portfolio of Bicky Muduli - A passionate Full Stack Developer and Cybersecurity Specialist crafting beautiful, secure digital experiences.",
    siteName: "Bicky Muduli Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bicky Muduli | Full Stack Developer & Cybersecurity Specialist",
    description: "Portfolio of Bicky Muduli - A passionate Full Stack Developer and Cybersecurity Specialist.",
    creator: "@bickymuduli",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
