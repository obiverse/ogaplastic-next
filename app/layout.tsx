import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { COMPANY } from "@/lib/constants";

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

export const metadata: Metadata = {
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${dmSans.variable}`}>
        {children}
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
