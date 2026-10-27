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
    chargeShipping: true,
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

  categories: {
    arabic: "مجموعتنا",
    eyebrow: "Our Collection",
    heading: "Curated for Every Moment",
    body: "Thoughtfully curated for women who appreciate modesty, sophistication, and effortless style.",
  },

  newArrivals: {
    eyebrow: "New Arrivals",
    heading: "Discover Your Everyday Elegance",
    body: "Explore our latest collections and find the styles that speak to you.",
    autoRecent: true,
    limit: 8,
    products: [],
  },

  // `slug` picks the product photo shown for each moment; `href` is the collection it opens.
  occasionEdit: {
    label: "For Every Moment",
    heading: "Fashion that reflects",
    accent: "your elegance",
    body: "Whether you are dressing for a casual outing, a day with friends, a family gathering, or a special occasion, Siyana Daily Modesty offers stylish choices for every moment in your life.",
    items: [
      {
        label: "Casual Outings",
        time: "Errands · Weekends · Coffee",
        title: "Effortless, everyday ease",
        body: "Imported denim co-ords with embroidery print — contemporary denim, styled modestly for the hours you spend out and about.",
        slug: "denim-co-ord-skirts-one",
        href: "/collections?c=denim-co-ord-skirts",
      },
      {
        label: "A Day with Friends",
        time: "Lunches · Visits · Long afternoons",
        title: "Light, easy and full of colour",
        body: "Rompers worn over their own inner T-shirt, finished with floral embroidery — full sleeves and full coverage in one easy layer.",
        slug: "romper-set-six",
        href: "/collections?c=romper-set",
      },
      {
        label: "Family Gatherings",
        time: "Dinners · Celebrations at home",
        title: "Polished, coordinated, comfortable",
        body: "Long kurta co-ord sets in CEY fabric with white floral embroidery — a graceful, coordinated look from the first greeting to the last goodbye.",
        slug: "long-co-ord-sets-eight",
        href: "/collections?c=long-co-ord-sets",
      },
      {
        label: "Special Occasions",
        time: "Eid · Weddings · Evenings out",
        title: "Graceful moments, beautifully dressed",
        body: "Tiered maxi dresses with balloon sleeves and embroidery across the yoke — sophisticated silhouettes for the days you want to remember.",
        slug: "maxi-dresses-one",
        href: "/collections?c=maxi-dresses",
      },
    ],
  },

  fabricCraft: {
    eyebrow: "Premium Fabrics",
    heading: "Premium Fabrics & Beautiful Details",
    body: "From striped maxi dresses to crush silk cotton co-ord sets and embroidered designs, our range celebrates distinctive textures, thoughtful detailing, and styles that stand out without being overwhelming.",
    link: { label: "Shop all collections →", href: "/collections" },
    items: [
      {
        name: "Crush Silk Cotton",
        tag: "Co-ord Sets",
        subtitle: "Distinctive texture with patch work and embroidery",
        description: "Our premium imported co-ord sets are made in crush silk cotton — a soft, breathable cloth with a beautiful crinkled texture, finished with patch work and embroidery for a look that is polished without trying too hard.",
        notes: ["Crinkled crush silk texture", "Patch work & embroidery", "Soft and breathable", "Sizes L and XL"],
        bestFor: "Everyday wear, casual outings and relaxed family days.",
        slug: "coordsets-four",
        cta: { label: "Shop Co-ord Sets →", href: "/collections?c=coordsets" },
      },
      {
        name: "Imported Denim",
        tag: "Denim Collection",
        subtitle: "Modern trends, modestly styled",
        description: "Contemporary imported denim with embroidery print — skirt and top sets with full-length flared skirts, and co-ords with balloon-sleeve tops over wide-leg denim. Structured enough to hold its shape, easy enough for the whole day.",
        notes: ["Embroidery print detailing", "Top & skirt sets and co-ords", "Holds its shape", "Sizes L and XL"],
        bestFor: "Casual outings, days with friends and weekend plans.",
        slug: "denim-skirts-two",
        cta: { label: "Shop Denim →", href: "/collections?c=denim-co-ord-skirts" },
      },
      {
        name: "CEY Fabric",
        tag: "Kurta Sets & Maxi Dresses",
        subtitle: "Graceful drape for embroidered silhouettes",
        description: "CEY is a smooth, fluid fabric that falls beautifully — the base for our long kurta co-ord sets with white floral embroidery and our tiered maxi dresses with balloon sleeves.",
        notes: ["Smooth, fluid drape", "White floral embroidery", "Balloon-sleeve maxi dresses", "Long kurta co-ord sets"],
        bestFor: "Family gatherings, celebrations and special occasions.",
        slug: "long-co-ord-sets-one",
        cta: { label: "Shop Long Co-ord Sets →", href: "/collections?c=long-co-ord-sets" },
      },
      {
        name: "Soft Cotton",
        tag: "Striped Maxi Dresses",
        subtitle: "Breathable stripes with thread detailing",
        description: "Our cotton striped maxi dresses are made in soft, breathable cotton with beautiful thread detailing — light, tiered and comfortable through a long, warm day.",
        notes: ["Soft, breathable cotton", "Striped pattern", "Beautiful thread detailing", "Tiered maxi length"],
        bestFor: "Warm days, everyday errands and easy weekends.",
        slug: "maxi-dresses-four",
        cta: { label: "Shop Maxi Dresses →", href: "/collections?c=maxi-dresses" },
      },
    ],
  },

  styleLookbook: {
    eyebrow: "The Siyana Lookbook",
    heading: "Discover your",
    accent: "everyday elegance",
    body: "Clean silhouettes, elegant colours, beautiful textures and carefully chosen details — looks from our latest collections.",
    products: ["long-co-ord-sets-four", "denim-skirts-three", "coordsets-two", "maxi-dresses-seven", "romper-set-nine"],
    cta: { label: "Shop the looks", href: "/collections" },
    motto: "Siyana Daily Modesty — Minimal. Sophisticated. Effortless.",
  },

  faq: {
    label: "FAQ",
    heading: "Questions,",
    accent: "answered",
    body: "Everything you need to know before you shop. Still curious? We are happy to help.",
    items: [
      { q: "What types of clothing do you offer?", a: "We offer maxi dresses, co-ord sets, denim rompers, skirts, tops, and embroidered outfits." },
      { q: "Are your outfits suitable for everyday wear?", a: "Yes! Our versatile styles are suitable for everyday wear, casual outings, and special occasions." },
      { q: "What fabrics do you use?", a: "We offer various fabrics, including denim, cotton blends, and crush silk cotton. Check each product description for details." },
      { q: "What if I receive a damaged or incorrect product?", a: "Contact our support team with your order number and photos of the item so we can assist you." },
      { q: "How can I contact Siyana Daily Modesty?", a: "Message us through our official Instagram account, @siyana_dailymodesty, or use the contact details on our website." },
    ],
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
    whyHeading: "Why choose Siyana Daily Modesty?",
    medallion: { arabic: "صيانة", name: "Siyāna", meaning: "to preserve · to protect" },
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
