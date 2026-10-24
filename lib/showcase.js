/*
 * Which real products illustrate the home page's editorial sections. Plain data, so the
 * server page can fetch these products and the client sections can render them.
 */

/* Which products appear, in order: the first fills the tall frame on the left */
export const LOOKBOOK_SLUGS = [
  "long-co-ord-sets-four",
  "denim-skirts-three",
  "coordsets-two",
  "maxi-dresses-seven",
  "romper-set-nine",
];

/* Each moment is shown in one real product; `href` is the collection it opens */
export const OCCASIONS = [
  {
    id: "casual",
    label: "Casual Outings",
    time: "Errands · Weekends · Coffee",
    title: "Effortless, everyday ease",
    body: "Imported denim co-ords with embroidery print — contemporary denim, styled modestly for the hours you spend out and about.",
    slug: "denim-co-ord-skirts-one",
    href: "/collections?c=denim-co-ord-skirts",
  },
  {
    id: "friends",
    label: "A Day with Friends",
    time: "Lunches · Visits · Long afternoons",
    title: "Light, easy and full of colour",
    body: "Rompers worn over their own inner T-shirt, finished with floral embroidery — full sleeves and full coverage in one easy layer.",
    slug: "romper-set-six",
    href: "/collections?c=romper-set",
  },
  {
    id: "family",
    label: "Family Gatherings",
    time: "Dinners · Celebrations at home",
    title: "Polished, coordinated, comfortable",
    body: "Long kurta co-ord sets in CEY fabric with white floral embroidery — a graceful, coordinated look from the first greeting to the last goodbye.",
    slug: "long-co-ord-sets-eight",
    href: "/collections?c=long-co-ord-sets",
  },
  {
    id: "special",
    label: "Special Occasions",
    time: "Eid · Weddings · Evenings out",
    title: "Graceful moments, beautifully dressed",
    body: "Tiered maxi dresses with balloon sleeves and embroidery across the yoke — sophisticated silhouettes for the days you want to remember.",
    slug: "maxi-dresses-one",
    href: "/collections?c=maxi-dresses",
  },
];

/* The fabrics the collection is actually made in; each is shown on one real product */
export const WEAVES = [
  {
    id: "crush-silk",
    name: "Crush Silk Cotton",
    tab: "Crush Silk Cotton",
    tag: "Co-ord Sets",
    subtitle: "Distinctive texture with patch work and embroidery",
    description:
      "Our premium imported co-ord sets are made in crush silk cotton — a soft, breathable cloth with a beautiful crinkled texture, finished with patch work and embroidery for a look that is polished without trying too hard.",
    notes: ["Crinkled crush silk texture", "Patch work & embroidery", "Soft and breathable", "Sizes L and XL"],
    bestFor: "Everyday wear, casual outings and relaxed family days.",
    slug: "coordsets-four",
    link: "/collections?c=coordsets",
    linkText: "Shop Co-ord Sets →",
  },
  {
    id: "denim",
    name: "Imported Denim",
    tab: "Imported Denim",
    tag: "Denim Collection",
    subtitle: "Modern trends, modestly styled",
    description:
      "Contemporary imported denim with embroidery print — skirt and top sets with full-length flared skirts, and co-ords with balloon-sleeve tops over wide-leg denim. Structured enough to hold its shape, easy enough for the whole day.",
    notes: ["Embroidery print detailing", "Top & skirt sets and co-ords", "Holds its shape", "Sizes L and XL"],
    bestFor: "Casual outings, days with friends and weekend plans.",
    slug: "denim-skirts-two",
    link: "/collections?c=denim-co-ord-skirts",
    linkText: "Shop Denim →",
  },
  {
    id: "cey",
    name: "CEY Fabric",
    tab: "CEY Fabric",
    tag: "Kurta Sets & Maxi Dresses",
    subtitle: "Graceful drape for embroidered silhouettes",
    description:
      "CEY is a smooth, fluid fabric that falls beautifully — the base for our long kurta co-ord sets with white floral embroidery and our tiered maxi dresses with balloon sleeves.",
    notes: ["Smooth, fluid drape", "White floral embroidery", "Balloon-sleeve maxi dresses", "Long kurta co-ord sets"],
    bestFor: "Family gatherings, celebrations and special occasions.",
    slug: "long-co-ord-sets-one",
    link: "/collections?c=long-co-ord-sets",
    linkText: "Shop Long Co-ord Sets →",
  },
  {
    id: "cotton",
    name: "Soft Cotton",
    tab: "Soft Cotton",
    tag: "Striped Maxi Dresses",
    subtitle: "Breathable stripes with thread detailing",
    description:
      "Our cotton striped maxi dresses are made in soft, breathable cotton with beautiful thread detailing — light, tiered and comfortable through a long, warm day.",
    notes: ["Soft, breathable cotton", "Striped pattern", "Beautiful thread detailing", "Tiered maxi length"],
    bestFor: "Warm days, everyday errands and easy weekends.",
    slug: "maxi-dresses-four",
    link: "/collections?c=maxi-dresses",
    linkText: "Shop Maxi Dresses →",
  },
];

/** Every product slug the sections above need, for one fetch. */
export const SHOWCASE_SLUGS = [
  ...new Set([...LOOKBOOK_SLUGS, ...OCCASIONS.map((o) => o.slug), ...WEAVES.map((w) => w.slug)]),
];
