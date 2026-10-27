/*
 * Brand copy shared across the storefront: home, about, contact and footer all read
 * from here, so the voice stays the same everywhere. CMS-editable copy (hero, ticker,
 * ethos, newsletter) is seeded from the same words in content-defaults.js.
 */
export const BRAND = {
  name: "Siyana Daily Modesty",
  tagline: "Where Modesty Meets Timeless Elegance",
  promise: "Premium Modest Wear for the Modern Woman",
  motto: "Minimal. Sophisticated. Effortless.",
  instagram: { handle: "@siyana_dailymodesty", url: "https://www.instagram.com/siyana_dailymodesty/" },
  intro: [
    "At Siyana Daily Modesty, we believe that true elegance lies in simplicity. Our collection is thoughtfully curated for women who appreciate modesty, sophistication, and effortless style. We bring together contemporary fashion and timeless elegance to help every woman feel confident, graceful, and beautiful in her own way.",
    "From stylish co-ord sets and elegant maxi dresses to imported denim rompers, denim skirts, tops, and beautifully detailed outfits, our collections are designed to complement your everyday lifestyle while keeping modest fashion at the heart of every look.",
  ],
  elegance: {
    heading: "Fashion That Reflects Your Elegance",
    body: "Every woman deserves clothing that makes her feel comfortable, confident, and uniquely herself. At Siyana Daily Modesty, we focus on styles that combine beautiful designs, versatile silhouettes, and carefully selected details.",
  },
  philosophy: [
    "At Siyana Daily Modesty, modest fashion is more than a clothing choice. It is a way to express your personality with confidence, grace, and individuality.",
    "We believe that fashion does not need to be complicated to be beautiful. Clean silhouettes, elegant colours, beautiful textures, and carefully chosen details can create a look that feels both modern and timeless.",
    "Our aim is to make modest dressing feel stylish, accessible, and inspiring for the modern woman.",
  ],
  closing: {
    heading: "Discover Your Everyday Elegance",
    body: "Your wardrobe should reflect who you are: confident, graceful, and effortlessly stylish. Let Siyana Daily Modesty help you discover pieces that make every day feel special.",
    cta: "Explore our latest collections and find the styles that speak to you.",
  },
};

/* `slug` picks the product photo shown with each collection; `href` is where it links */
export const COLLECTION = [
  {
    title: "Elegant Maxi Dresses",
    body: "Discover graceful maxi dresses featuring beautiful silhouettes, stylish sleeves, and thoughtful details that bring sophistication to your wardrobe.",
    slug: "maxi-dresses-eight",
    href: "/collections?c=maxi-dresses",
  },
  {
    title: "Stylish Co-ord Sets",
    body: "Explore coordinated outfits that make styling effortless. From relaxed everyday looks to polished ensembles, our co-ord sets offer a fashionable and versatile choice.",
    slug: "coordsets",
    href: "/collections?c=coordsets",
  },
  {
    title: "Imported Denim Collection",
    body: "Refresh your wardrobe with contemporary denim styles, including denim rompers, denim skirt and top sets, and other fashionable denim pieces that blend modern trends with modest styling.",
    slug: "denim-co-ord-skirts-four",
    href: "/collections?c=denim-co-ord-skirts",
  },
  {
    title: "Everyday Modest Wear",
    body: "Find versatile outfits designed to fit seamlessly into your daily routine. Our collection focuses on effortless styling, understated beauty, and a balance between comfort and elegance.",
    slug: "romper-set-seven",
    href: "/collections?c=romper-set",
  },
  {
    title: "Premium Fabrics and Beautiful Details",
    body: "From striped maxi dresses to crush silk cotton co-ord sets and embroidered designs, our range celebrates distinctive textures, thoughtful detailing, and styles that stand out without being overwhelming.",
    slug: "long-co-ord-sets-ten",
    href: "/collections?c=long-co-ord-sets",
  },
];

export const WHY = [
  { title: "Modest yet modern", body: "Fashion-forward designs that celebrate graceful dressing." },
  { title: "Timeless elegance", body: "Styles that balance contemporary trends with lasting appeal." },
  { title: "Versatile collections", body: "Options for everyday wear, outings, and special moments." },
  { title: "Effortless styling", body: "Coordinated sets and versatile pieces that simplify outfit planning." },
  { title: "Distinctive designs", body: "Beautiful details, embroidery, textures, and contemporary silhouettes." },
  { title: "Fashion with confidence", body: "Clothing that allows you to express your own sense of style." },
];
