import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "https://siyana.example"),
  title: { default: "Siyana — The Daily Modesty", template: "%s · Siyana" },
  description:
    "Modest wear for Muslim women. Abayas, hijabs, kaftans and prayer wear in considered cuts and honest fabric.",
  openGraph: { title: "Siyana — The Daily Modesty", images: ["/siyana-logo.png"] },
};

/* Chrome lives in the route groups: (shop) has the storefront header and footer,
 * /admin has its own shell. This layout only owns the document. */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
