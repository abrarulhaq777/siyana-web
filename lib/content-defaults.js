/*
 * The CMS surface. Layout stays in code; everything an editor actually changes
 * week to week lives here. Each key is one document in the `contents` collection,
 * and DEFAULTS is both the seed and the fallback when a key is missing.
 */
export const DEFAULTS = {
  settings: {
    storeName: "Siyana",
    tagline: "Daily Modesty",
    supportEmail: "siyanamodesty@gmail.com",
    supportPhone: "+91 00000 00000",
    freeShippingAbove: 2999,
    shippingFee: 149,
    codEnabled: false,
  },

  sections: {
    order: [
      "hero", "categories", "newArrivals", "occasionEdit", "fabricCraft",
      "styleLookbook", "whySiyana", "faq",
    ],
    hidden: [],
  },

  announcement: {
    items: [
      "Where Modesty Meets Timeless Elegance",
      "New co-ord sets, maxi dresses & imported denim",
      "Complimentary shipping over ₹2,999",
      "Minimal. Sophisticated. Effortless.",
      "Follow us on Instagram @siyana_dailymodesty",
    ],
  },

  hero: {
    eyebrow: "Siyana Daily Modesty",
    titleTop: "Where modesty meets",
    titleAccent: "timeless elegance.",
    body: "Premium modest wear for the modern woman — stylish co-ord sets, elegant maxi dresses, imported denim and beautifully detailed outfits, thoughtfully curated for women who appreciate modesty, sophistication and effortless style.",
    image: "/uploads/mv6t59n6-9c831add8755.png",
    captionTitle: "Effortless everyday elegance",
    captionSub: "Imported romper with inner T-shirt",
    primaryCta: { label: "Shop the Collection", href: "/collections" },
    secondaryCta: { label: "Co-ord Sets", href: "/collections?c=coordsets" },
    tertiaryCta: { label: "Maxi Dresses →", href: "/collections?c=maxi-dresses" },
    stats: [
      { k: "Modest yet modern", v: "Graceful dressing" },
      { k: "Effortless styling", v: "Coordinated sets" },
      { k: "Distinctive designs", v: "Embroidery & texture" },
    ],
    slides: [
      {
        id: "romper",
        image: "/uploads/mv6t59n6-9c831add8755.png",
        badge: "Everyday Modest Wear",
        title: "Effortless everyday elegance",
        sub: "Imported romper with inner T-shirt",
        previewThumb: "/uploads/mv6ebiyk-93f17fb40a9b.png",
        previewName: "Romper with Inner T-shirt",
        previewPrice: "₹1,500",
        previewTag: "Powder Blue",
        focus: "object-[50%_30%]",
        link: "/product/romper-set-seven",
      },
      {
        id: "denim",
        image: "/uploads/mv6t5cuj-57d9fca13ee4.png",
        badge: "Imported Denim",
        title: "Modern denim, modestly styled",
        sub: "Denim top & skirt set with embroidery print",
        previewThumb: "/uploads/mv6qqwt4-4e3094a40e58.png",
        previewName: "Embroidered Denim Top & Skirt Set",
        previewPrice: "₹1,550",
        previewTag: "Mid-wash Blue",
        focus: "object-[50%_25%]",
        link: "/product/denim-skirts-one",
      },
      {
        id: "coord",
        image: "/uploads/mv6t5fjk-891e067177f6.png",
        badge: "Stylish Co-ord Sets",
        title: "Crush silk, beautifully coordinated",
        sub: "Premium crush silk cotton with patch work",
        previewThumb: "/uploads/mv6rcmvw-852d15dbe510.png",
        previewName: "Crush Silk Cotton Co-ord Set",
        previewPrice: "₹1,699",
        previewTag: "Pistachio Green",
        focus: "object-[50%_20%]",
        link: "/product/coordsets-one",
      },
    ],
  },

  assurances: {
    items: [
      { title: "Modest yet modern", body: "Fashion-forward designs that celebrate graceful dressing." },
      { title: "Timeless elegance", body: "Styles that balance contemporary trends with lasting appeal." },
      { title: "Versatile collections", body: "Options for everyday wear, outings, and special moments." },
      { title: "Effortless styling", body: "Coordinated sets and versatile pieces that simplify outfit planning." },
      { title: "Distinctive designs", body: "Beautiful details, embroidery, textures, and contemporary silhouettes." },
      { title: "Fashion with confidence", body: "Clothing that allows you to express your own sense of style." },
    ],
  },

  categories: { eyebrow: "Our Collection", heading: "Curated for Every Moment" },

  newArrivals: {
    eyebrow: "New Arrivals",
    heading: "Discover Your Everyday Elegance",
    body: "Explore our latest collections and find the styles that speak to you.",
    autoRecent: true,
    limit: 8,
    products: [],
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
    label: "Our Philosophy",
    statement: "Modest fashion is more than a clothing choice. It is a way to express your personality with confidence, grace, and individuality.",
    footnote: "We believe that fashion does not need to be complicated to be beautiful. Clean silhouettes, elegant colours, beautiful textures, and carefully chosen details can create a look that feels both modern and timeless.",
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
    body: "New arrivals and collection updates from Siyana Daily Modesty — be the first to discover the styles that speak to you.",
    placeholder: "you@example.com",
    button: "Subscribe",
  },
};

export const SECTION_LABELS = {
  hero: "Hero", categories: "Category arcade", newArrivals: "New arrivals",
  occasionEdit: "Occasion edit", fabricCraft: "Fabric guide", styleLookbook: "Courtyard lookbook",
  whySiyana: "Why Siyana", faq: "FAQ", letter: "Newsletter", reviews: "Testimonials",
  assurances: "Assurances strip", capsule: "Celebration capsule", prayer: "Prayer sanctuary",
  staples: "Considered few", gifting: "Gifting panel",
};

/** Retired section ids and the section that replaced each one. */
export const SECTION_ALIASES = {
  cuts: "occasionEdit", fabrics: "fabricCraft", voices: "reviews", ethos: "whySiyana", craft: "whySiyana",
};

/** Sections whose copy is fixed in code — they can still be reordered or hidden. */
export const CODE_ONLY = ["occasionEdit", "fabricCraft", "styleLookbook", "faq"];
