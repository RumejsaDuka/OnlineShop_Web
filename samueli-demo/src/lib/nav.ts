import { photography } from "@/lib/photography";
import { categories, discounted, productsIn, type Category } from "./data";

export type MenuTile = { title: string; caption?: string; href: string; image: string; tone?: "red" };

export type NavItem = {
  key: string;
  label: string;
  href: string;
  accent?: boolean;
  /** Present only when the category actually has subcategories to show */
  menu?: {
    title: string;
    subs: { label: string; href: string }[];
    tiles: MenuTile[];
  };
};

function tilesFor(c: Category): MenuTile[] {
  const tiles: MenuTile[] = [
    { title: "Kategoritë", href: "/koleksionet", image: photography.hoodedTracksuit },
    { title: c.label, caption: "Shiko kategorinë", href: `/kategoria/${c.slug}`, image: c.image },
  ];
  const sale = discounted(productsIn(c.slug));
  if (sale.length) {
    // Offer tile only when the demo data actually defines a discount in this category
    tiles.push({
      title: "Oferta",
      caption: `${sale.length} ${sale.length === 1 ? "artikull" : "artikuj"} me çmim të ulur`,
      href: `/oferta?kategoria=${c.slug}`,
      image: sale[0].images[0],
      tone: "red",
    });
  } else {
    const pick = productsIn(c.slug).find((p) => p.images[0] !== c.image);
    if (pick) tiles.push({ title: pick.name, caption: "Shiko produktin", href: `/produkt/${pick.slug}`, image: pick.images[0] });
  }
  return tiles;
}

export const navItems: NavItem[] = [
  ...categories.map<NavItem>((c) => ({
    key: c.slug,
    label: c.label,
    href: `/kategoria/${c.slug}`,
    menu: c.subs.length
      ? {
          title: c.label,
          subs: c.subs.map((s) => ({ label: s.label, href: `/kategoria/${c.slug}?lloji=${s.slug}` })),
          tiles: tilesFor(c),
        }
      : undefined,
  })),
  { key: "oferta", label: "Oferta", href: "/oferta", accent: true },
];
