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
  metadataBase: new URL(process.env.SITE_URL ?? "https://siyanamodesty.com"),
  title: { default: "Siyana Daily Modesty — Where Modesty Meets Timeless Elegance", template: "%s · Siyana Daily Modesty" },
  description:
    "Premium modest wear for the modern woman — stylish co-ord sets, elegant maxi dresses, imported denim and beautifully detailed outfits. Minimal. Sophisticated. Effortless.",
  openGraph: { title: "Siyana Daily Modesty — Where Modesty Meets Timeless Elegance", images: ["/siyana-logo.png"] },
};

/* Chrome lives in the route groups: (shop) has the storefront header and footer,
 * /admin has its own shell. This layout only owns the document. */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} h-full antialiased`}>
      {/* Extensions like ColorZilla inject attributes on <body> before hydration. */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
