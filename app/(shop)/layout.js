import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Intro from "@/components/Intro";
import { StoreProvider } from "@/lib/store";
import { getCategories } from "@/lib/catalog";
import { getKey } from "@/lib/content";

// ponytail: storefront reads the database on every request. Swap for ISR
// (`revalidate = 60` + revalidatePath on save) if traffic ever makes it matter.
export const dynamic = "force-dynamic";

export default async function ShopLayout({ children }) {
  const [categories, announcement, settings] = await Promise.all([
    getCategories(),
    getKey("announcement"),
    getKey("settings"),
  ]);

  return (
    <>
      <Intro />
      <StoreProvider>
        <Header categories={categories} ticker={announcement.items} />
        <main className="flex-1">{children}</main>
        <Footer categories={categories} settings={settings} />
      </StoreProvider>
    </>
  );
}
