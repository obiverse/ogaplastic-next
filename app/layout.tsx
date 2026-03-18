import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { COMPANY } from "@/lib/constants";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { MuiProvider } from "@/components/ui/MuiProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.NEXT_PUBLIC_BASE_PATH
        ? `https://obiverse.github.io${process.env.NEXT_PUBLIC_BASE_PATH}`
        : "https://ogaplastic.com")
  ),
  title: "OGA PLASTIC Manufacturing Nigeria Limited — Water Tanks & Waste Bins",
  description: COMPANY.description,
  keywords: [
    "Plastic manufacturing Nigeria",
    "Rotomoulding Africa",
    "Water tank manufacturer Nigeria",
    "Waste bin supplier Nigeria",
    "Industrial plastic infrastructure",
    "Rotational moulding Cross River State",
    "Custom branded water tanks Nigeria",
  ],
  openGraph: {
    title: "OGA PLASTIC Manufacturing Nigeria Limited",
    description: COMPANY.description,
    type: "website",
    locale: "en_NG",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "OGA PLASTIC — Water Tanks & Waste Bins engineered for Africa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OGA PLASTIC Manufacturing Nigeria Limited",
    description: COMPANY.description,
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <meta name="theme-color" content="#0F3D47" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href={`${basePath}/manifest.webmanifest`} />
      </head>
      <body className={`${playfair.variable} ${dmSans.variable}`}>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider>
            <MuiProvider>
              {children}
            </MuiProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('${basePath}/sw.js').catch(()=>{})})}`
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: COMPANY.name,
              description: COMPANY.description,
              address: {
                "@type": "PostalAddress",
                streetAddress:
                  "№1, Lokpema Road, Along Ediba Road",
                addressLocality: "Ugep",
                addressRegion: "Cross River State",
                addressCountry: "NG",
              },
              telephone: COMPANY.phones[0],
              email: COMPANY.email,
            }),
          }}
        />
      </body>
    </html>
  );
}
