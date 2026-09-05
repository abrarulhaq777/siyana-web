import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Intro from "@/components/Intro";
import Footer from "@/components/Footer";
import { StoreProvider } from "@/lib/store";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata = {
  metadataBase: new URL("https://siyana.example"),
  title: { default: "Siyana — The Daily Modesty", template: "%s · Siyana" },
  description:
    "Modest wear for Muslim women. Abayas, hijabs, kaftans and prayer wear in considered cuts and honest fabric.",
  openGraph: { title: "Siyana — The Daily Modesty", images: ["/siyana-logo.png"] },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Intro />
        <StoreProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
