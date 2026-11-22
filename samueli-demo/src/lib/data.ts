import { photography as photos, productPhotos } from "./photography";

/**
 * LOCAL DEMO CATALOGUE
 * --------------------------------------------------------------
 * Every product, price and discount below is ILLUSTRATIVE demo data.
 * Images are concept photography from the design pack — not verified
 * client inventory, SKUs, brands or stock. Replace before production.
 */

export type CategorySlug = "xhaketa" | "kostume-sportive" | "bluza" | "atlete" | "aksesore";

export type SubCategory = { slug: string; label: string };

export type Category = {
  slug: CategorySlug;
  label: string;
  /** Short line used on category pages / menus */
  intro: string;
  /** Transparent product photo used on charcoal collection tiles and menus */
  image: string;
  /** Light-background thumbnail used in the shortcut cards */
  thumb: string;
  subs: SubCategory[];
};

export const categories: Category[] = [
  {
    slug: "xhaketa",
    label: "Xhaketa",
    intro: "Xhaketa për meshkuj me kapuç, zinxhir dhe mbushje.",
    image: photos.winterPuffer,
    thumb: photos.puffer,
    subs: [
      { slug: "puffer", label: "Xhaketa Puffer" },
      { slug: "dimri", label: "Xhaketa Dimri" },
    ],
  },
  {
    slug: "kostume-sportive",
    label: "Kostume Sportive",
    intro: "Kostume sportive për meshkuj, me bluza dhe pantallona.",
    image: photos.hoodedTracksuit,
    thumb: photos.hoodedTracksuit,
    subs: [
      { slug: "me-kapuc", label: "Kostume me kapuç" },
      { slug: "me-zinxhir", label: "Kostume me zinxhir" },
    ],
  },
  {
    slug: "bluza",
    label: "Bluza",
    intro: "Bluza për meshkuj me mëngë të shkurtra, në të bardhë dhe të zezë.",
    image: photos.blackTee,
    thumb: photos.whiteTee,
    subs: [
      { slug: "te-bardha", label: "Bluza të bardha" },
      { slug: "te-zeza", label: "Bluza të zeza" },
    ],
  },
  {
    slug: "atlete",
    label: "Atlete",
    intro: "Atlete për meshkuj me lidhëse dhe profil të ulët.",
    image: photos.classicSneaker,
    thumb: photos.classicSneaker,
    subs: [
      { slug: "te-bardha", label: "Atlete të bardha" },
      { slug: "retro", label: "Atlete retro" },
    ],
  },
  {
    slug: "aksesore",
    label: "Aksesorë",
    intro: "Kapele dhe aksesorë për meshkuj.",
    image: photos.cap,
    thumb: photos.cap,
    subs: [],
  },
];

export const ALL_SLUG = "te-gjitha";

/** `hex` is used as a CSS background, so a gradient works for two-tone items */
export type Color = { name: string; hex: string };
export const COLORS = {
  black: { name: "E zezë", hex: "#111111" },
  white: { name: "E bardhë", hex: "#FFFFFF" },
  gray: { name: "Gri", hex: "#8E8E93" },
  whiteBlack: { name: "E bardhë / e zezë", hex: "linear-gradient(135deg, #FFFFFF 50%, #111111 50%)" },
} satisfies Record<string, Color>;

export type Product = {
  slug: string;
  name: string;
  category: CategorySlug;
  sub: string;
  price: number; // EUR, illustrative
  compareAt?: number; // only set when the demo defines a discount
  color: Color;
  sizes: string[];
  /** One main photograph, shared by cards, product pages and shopping thumbnails. */
  images: string[];
  /** true → product shot on a light background (shown with object-contain) */
  light: boolean;
  alt: string;
  description: string;
  /** Lower = newer, used for "Më të rejat" sorting */
  order: number;
};

const apparel = ["S", "M", "L", "XL", "XXL"];
const shoes = ["40", "41", "42", "43", "44", "45"];

export const products: Product[] = [
  {
    slug: "xhakete-puffer",
    name: "Xhaketë Puffer",
    category: "xhaketa",
    sub: "puffer",
    price: 79.99,
    compareAt: 99.99,
    color: COLORS.black,
    sizes: apparel,
    images: productPhotos(photos.puffer),
    light: true,
    alt: "Xhaketë puffer e zezë me kapuç",
    description: "Xhaketë e zezë me mbushje, kapuç dhe zinxhir të plotë. Me xhepa anësorë.",
    order: 1,
  },
  {
    slug: "kostum-sportiv",
    name: "Kostum Sportiv",
    category: "kostume-sportive",
    sub: "me-kapuc",
    price: 49.99,
    color: COLORS.black,
    sizes: apparel,
    images: productPhotos(photos.hoodedTracksuit),
    light: true,
    alt: "Kostum sportiv i zi me bluzë me kapuç dhe pantallona",
    description: "Kostum sportiv i zi me bluzë me kapuç dhe pantallona me bel elastik.",
    order: 2,
  },
  {
    slug: "bluze-basic",
    name: "Bluzë e bardhë",
    category: "bluza",
    sub: "te-bardha",
    price: 24.99,
    color: COLORS.white,
    sizes: apparel,
    images: productPhotos(photos.whiteTee),
    light: true,
    alt: "Bluzë e bardhë me mëngë të shkurtra",
    description: "Bluzë e bardhë me jakë të rrumbullakët, mëngë të shkurtra dhe prerje të drejtë.",
    order: 3,
  },
  {
    slug: "atlete-classic",
    name: "Atlete klasike",
    category: "atlete",
    sub: "te-bardha",
    price: 67.99,
    compareAt: 79.99,
    color: COLORS.whiteBlack,
    sizes: shoes,
    images: productPhotos(photos.classicSneaker),
    light: true,
    alt: "Atlete të bardha me detaje të zeza",
    description: "Atlete të bardha me lidhëse, profil të ulët dhe detaje të zeza.",
    order: 4,
  },
  {
    slug: "xhakete-dimri-me-kapuc",
    name: "Xhaketë Dimri me Kapuç",
    category: "xhaketa",
    sub: "dimri",
    price: 89.99,
    color: COLORS.black,
    sizes: apparel,
    images: productPhotos(photos.winterPuffer),
    light: true,
    alt: "Xhaketë dimri e zezë me kapuç të lartë",
    description: "Xhaketë dimri e zezë me kapuç të lartë, zinxhir dhe xhepa anësorë.",
    order: 5,
  },
  {
    slug: "xhakete-e-shkurter",
    name: "Xhaketë e Shkurtër me Mbushje",
    category: "xhaketa",
    sub: "puffer",
    price: 74.99,
    color: COLORS.black,
    sizes: apparel,
    images: productPhotos(photos.shortPuffer),
    light: true,
    alt: "Xhaketë e shkurtër e zezë me mbushje dhe kapuç",
    description: "Xhaketë e shkurtër e zezë me mbushje, kapuç dhe zinxhir të plotë.",
    order: 6,
  },
  {
    slug: "kostum-sportiv-me-bordure",
    name: "Kostum Sportiv me Bordurë",
    category: "kostume-sportive",
    sub: "me-zinxhir",
    price: 59.99,
    color: COLORS.black,
    sizes: apparel,
    images: productPhotos(photos.pipedTracksuit),
    light: true,
    alt: "Kostum sportiv i zi me zinxhir dhe bordura të bardha",
    description: "Kostum sportiv i zi me zinxhir dhe bordura të bardha. Set me xhaketë dhe pantallona.",
    order: 7,
  },
  {
    slug: "kostum-sportiv-me-vija",
    name: "Kostum Sportiv me Vija",
    category: "kostume-sportive",
    sub: "me-zinxhir",
    price: 56.99,
    compareAt: 64.99,
    color: COLORS.black,
    sizes: apparel,
    images: productPhotos(photos.stripedTracksuit),
    light: true,
    alt: "Kostum sportiv i zi me vija të bardha në mëngë",
    description: "Kostum sportiv i zi me jakë të lartë, zinxhir dhe vija të bardha në mëngë.",
    order: 8,
  },
  {
    slug: "kostum-sportiv-gri",
    name: "Kostum Sportiv Gri",
    category: "kostume-sportive",
    sub: "me-zinxhir",
    price: 54.99,
    color: COLORS.gray,
    sizes: apparel,
    images: productPhotos(photos.grayTracksuit),
    light: true,
    alt: "Kostum sportiv gri me kapuç dhe pantallona, pamje e plotë nga përpara",
    description: "Kostum sportiv gri: bluzë me kapuç e zinxhir dhe pantallona me bel elastik.",
    order: 9,
  },
  {
    slug: "bluze-oversize-e-zeze",
    name: "Bluzë e gjerë e zezë",
    category: "bluza",
    sub: "te-zeza",
    price: 27.99,
    color: COLORS.black,
    sizes: apparel,
    images: productPhotos(photos.oversizeBlackTee),
    light: true,
    alt: "Bluzë e zezë me prerje të gjerë dhe mëngë të shkurtra",
    description: "Bluzë e zezë me prerje të gjerë, jakë të rrumbullakët dhe mëngë të shkurtra.",
    order: 10,
  },
  {
    slug: "bluze-basic-e-zeze",
    name: "Bluzë e zezë",
    category: "bluza",
    sub: "te-zeza",
    price: 24.99,
    color: COLORS.black,
    sizes: apparel,
    images: productPhotos(photos.blackTee),
    light: true,
    alt: "Bluzë e zezë me mëngë të shkurtra dhe jakë të rrumbullakët",
    description: "Bluzë e zezë me jakë të rrumbullakët, mëngë të shkurtra dhe prerje të drejtë.",
    order: 11,
  },
  {
    slug: "atlete-retro-me-vija",
    name: "Atlete Retro me Vija",
    category: "atlete",
    sub: "retro",
    price: 72.99,
    color: COLORS.whiteBlack,
    sizes: shoes,
    images: productPhotos(photos.retroSneaker),
    light: true,
    alt: "Atlete retro të bardha me vija të zeza dhe shollë kafe",
    description: "Atlete të bardha me lidhëse, vija të zeza dhe shollë kafe.",
    order: 12,
  },
];

/* ---------------- helpers ---------------- */

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const categoryLabel = (slug: string) => getCategory(slug)?.label ?? slug;
export const subLabel = (cat: string, sub: string) => getCategory(cat)?.subs.find((s) => s.slug === sub)?.label ?? sub;
export const productsIn = (slug: string) => (slug === ALL_SLUG ? products : products.filter((p) => p.category === slug));
export const discounted = (list = products) => list.filter((p) => p.compareAt && p.compareAt > p.price);
export const discountPct = (p: Product) => (p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0);

export const formatPrice = (v: number) => `€${v.toFixed(2)}`;

export const favoriteSlugs = ["xhakete-puffer", "kostum-sportiv", "bluze-basic", "atlete-classic"];

/* ---------------- contact (VERIFY WITH CLIENT BEFORE PRODUCTION) ---------------- */
export const contact = {
  phone: "+355 69 537 4750",
  phoneHref: "tel:+355695374750",
  email: "contact@samuelifashion.al",
};

export const ALBANIAN_CITIES = [
  "Tiranë", "Durrës", "Vlorë", "Shkodër", "Elbasan", "Fier", "Korçë", "Berat", "Lushnjë", "Kavajë", "Pogradec", "Gjirokastër", "Sarandë", "Lezhë", "Kukës", "Tjetër",
];

/* ---------------- search ---------------- */
export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

export function searchProducts(q: string) {
  const n = normalize(q);
  if (!n) return [];
  const terms = n.split(/\s+/);
  return products.filter((p) => {
    const hay = normalize(`${p.name} ${categoryLabel(p.category)} ${subLabel(p.category, p.sub)} ${p.color.name}`);
    return terms.every((t) => hay.includes(t));
  });
}
