/*
 * The CMS surface. Layout stays in code; everything an editor actually changes
 * week to week lives here. Each key is one document in the `contents` collection,
 * and DEFAULTS is both the seed and the fallback when a key is missing.
 */
export const DEFAULTS = {
  settings: {
    storeName: "Siyana",
    tagline: "The Daily Modesty",
    supportEmail: "care@siyana.example",
    supportPhone: "+91 00000 00000",
    freeShippingAbove: 2999,
    shippingFee: 149,
    codEnabled: true,
  },

  sections: {
    order: [
      "hero", "assurances", "categories", "newArrivals", "capsule", "fabrics",
      "cuts", "prayer", "ethos", "staples", "gifting", "craft", "voices", "letter",
    ],
    hidden: [],
  },

  announcement: {
    items: [
      "Autumn Capsule — now in studio",
      "Certified 100% opaque",
      "Complimentary shipping over ₹2,999",
      "Wudu-friendly tailoring",
      "Made in small batches",
    ],
  },

  hero: {
    eyebrow: "Autumn Capsule",
    titleTop: "Dressed with",
    titleAccent: "grace & dignity.",
    body: "Abayas, hijabs and timeless modest garments cut for uncompromised coverage — tailored in Japanese Nida, breathable linens and opaque crepes for sacred moments, workdays and ordinary Tuesdays alike.",
    image: "/images/hero/hero-siyana.jpg",
    captionTitle: "The Noble Art of Modesty",
    captionSub: "Japanese Nida & hand-rolled silks",
    primaryCta: { label: "Shop the Collection", href: "/collections" },
    secondaryCta: { label: "Abayas", href: "/collections?c=abayas" },
    tertiaryCta: { label: "Hijabs & Shawls →", href: "/collections?c=hijabs" },
    stats: [
      { k: "100% Opaque", v: "Zero-sheer guarantee" },
      { k: "Wudu Friendly", v: "Easy sleeve access" },
      { k: '52"–60"', v: "Tailored drop lengths" },
    ],
  },

  assurances: {
    items: [
      { title: "Zero-Sheer Verified", body: "Every cloth is tested against high daylight. If it goes transparent, it never enters production." },
      { title: "Wudu-Friendly Cuffs", body: "Elasticated smocking or concealed buttons, so ablution never means undressing." },
      { title: '52"–60" Drop Lengths', body: "Cut to meet the top of the footwear without dragging, clinging or pooling." },
      { title: "Artisan Cloth Only", body: "Japanese Nida, washed desert linen and breathable beechwood modal. Nothing synthetic-feeling." },
    ],
  },

  categories: { eyebrow: "Core Collections", heading: "Curated by Silhouette" },

  newArrivals: {
    eyebrow: "Autumn Capsule",
    heading: "Quietly New",
    body: "Pieces cut this season in Japanese Nida, washed linen and Korean crepe — designed around fluid drape and zero sheer.",
    products: ["sakina-crepe-abaya", "areej-coord", "salah-prayer-set", "misk-chiffon-set"],
  },

  capsule: {
    label: "Special Edit",
    heading: "The Jummah & Celebration Capsule",
    body: "Friday prayers, Eid and dignified family gatherings call for garments that carry solemnity and quiet grandeur — royal plum brocade, champagne georgette and pressed Japanese Nida.",
    products: ["zahra-kaftan", "rida-georgette-shawl", "noor-open-abaya", "amal-flared-abaya"],
    cta: { label: "Shop occasion wear", href: "/collections?c=kaftans" },
  },

  prayer: {
    eyebrow: "Sacred Moments",
    titleTop: "Silent cottons for",
    titleAccent: "sacred prostration.",
    body: "Standing in prayer asks for complete stillness. Our two-piece prayer dresses are brushed organic combed cotton — silent, weightless and guaranteed opaque — with an overhead tie-back khimar and a matching pouch that folds into a handbag.",
    image: "/images/products/salah-prayer-set.jpg",
    captionTitle: "The Sacred Hour",
    captionSub: "Brushed organic cotton",
    bullets: [
      "Matching zippered travel pouch included",
      "Full overhead khimar with built-in tie back",
      "Tested at 100% zero-transparency under direct light",
    ],
    primaryCta: { label: "Explore prayer wear", href: "/collections?c=prayerwear" },
    secondaryCta: { label: "View the two-piece set →", href: "/product/salah-prayer-set" },
  },

  ethos: {
    label: "Our Ethos",
    statement: "Modesty is not a costume donned for rare occasions. It is the noble silhouette of an ordinary Tuesday — and it deserves fabric that dignifies it.",
    footnote: "Every Siyana piece is measured for coverage first and drape second, then held against the light before it leaves the studio. If it clings or goes sheer, it never ships.",
  },

  staples: {
    eyebrow: "Everyday Staples",
    heading: "The Considered Few",
    products: ["hana-modal-hijab", "sidra-jersey-hijab", "iman-shirt-dress", "layl-linen-abaya"],
  },

  gifting: {
    eyebrow: "Gifting",
    heading: "The Barakah Presentation Box",
    body: "For a wedding, for Eid, for a mother or a sister — every Siyana gift is hand-packed in a gold-embossed rigid box with silk ribbon, custom tissue and a musk scent card.",
    image: "/images/products/misk-chiffon-set.jpg",
    chips: ["Gold-embossed rigid box", "Scented musk insert", "Handwritten note"],
    cta: { label: "Shop gifting", href: "/collections?c=hijabs" },
  },

  voices: {
    label: "In Their Words",
    heading: "Worn, treasured, repeated",
    items: [
      { quote: "The Noor open abaya is the only piece I own that survives a ten-hour hospital shift without creasing or clinging.", name: "Dr. Aisha R.", city: "London" },
      { quote: "Finally a modal hijab that holds its drape through dhuhr and a full day of lectures without five pins.", name: "Fatima K.", city: "Dubai" },
      { quote: "Took the prayer set for Umrah. It folded into its pouch, stayed crease-free, and was completely opaque in bright sun.", name: "Maryam S.", city: "Hyderabad" },
    ],
  },

  letter: {
    heading: "The Siyana Letter",
    body: "Restocks, seasonal capsules and fabric care notes. Sent with dignity, never more than twice a month.",
    placeholder: "you@example.com",
    button: "Subscribe",
  },
};

export const SECTION_LABELS = {
  hero: "Hero", assurances: "Assurances", categories: "Category mosaic",
  newArrivals: "New arrivals", capsule: "Celebration capsule", fabrics: "Fabric guide",
  cuts: "Silhouette standard", prayer: "Prayer sanctuary", ethos: "Ethos",
  staples: "Considered few", gifting: "Gifting panel", craft: "Craft notes",
  voices: "Testimonials", letter: "Newsletter",
};

/** Sections whose copy is fixed in code — they can still be reordered or hidden. */
export const CODE_ONLY = ["fabrics", "cuts", "craft"];
