# Siyana — The Daily Modesty

Storefront for a modest-wear label (abayas, hijabs, kaftans, modest dresses, co-ords, prayer wear).
Next.js App Router, JavaScript, Tailwind v4.

```bash
npm run dev     # http://localhost:3000
npm run build
```

## Where things live

| Path | What |
|---|---|
| `app/globals.css` | Theme tokens (`bone / paper / ink / muted / line / sage / gold / blush`), the `.arch` mihrab shape, the `.pattern-girih` tile |
| `lib/products.js` | Catalogue + categories. Single source of truth — no API yet |
| `lib/store.js` | Cart + wishlist, React context over `localStorage` |
| `components/ProductMedia.jsx` | Renders `product.image` when present, otherwise a tonal arch panel keyed off `product.color` |

## Not wired yet

- **Product photography** — add `image: "/…"` to any product in `lib/products.js` and it replaces the generated panel.
- **Payments** — `app/checkout/page.js` validates and clears the bag; swap `submit` for the gateway call.
- **Auth** — `app/account/page.js` is form + validation only.
- **Help/about routes** — footer links to `/help/*` and `/about`, which 404 until written.
