import { requirePageAccess, currentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { getContent, SECTION_LABELS, CODE_ONLY } from "@/lib/content";
import { getProducts } from "@/lib/catalog";
import ContentEditor from "./ContentEditor";

export default async function ContentPage() {
  await requirePageAccess("content:read");
  const user = await currentUser();

  const [content, products] = await Promise.all([
    getContent(),
    getProducts({ includeInactive: true }),
  ]);

  return (
    <>
      <header>
        <p className="text-[12px] uppercase tracking-brand text-muted">Content</p>
        <h1 className="mt-2 font-display text-[2.4rem] font-light leading-none">Storefront</h1>
        <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted">
          Copy, imagery and product picks for the home page. Layout stays in code, so nothing here
          can break the design — you are filling in a fixed frame.
        </p>
      </header>

      <ContentEditor
        content={content}
        products={products.map((p) => ({ slug: p.slug, name: p.name, active: p.active }))}
        labels={SECTION_LABELS}
        codeOnly={CODE_ONLY}
        writable={can(user, "content:write")}
      />
    </>
  );
}
