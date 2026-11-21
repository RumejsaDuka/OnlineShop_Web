import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categoryLabel, getProduct, products } from "@/lib/data";
import ProductView from "@/components/product/ProductView";
import ProductCard from "@/components/ProductCard";
import RevealScope from "@/components/RevealScope";
import { Breadcrumbs, SectionHead } from "@/components/ui";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  return pageMetadata(p ? `${p.name} për meshkuj` : "Produkti", p?.description ?? "Shiko produktin dhe masat.", `/produkt/${slug}`, p?.images[0]);
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const same = products.filter((x) => x.category === p.category && x.slug !== p.slug);
  const related = [...same, ...products.filter((x) => x.category !== p.category && x.slug !== p.slug)].slice(0, 4);
  return (
    <RevealScope>
      <div className="wrap mt-5 md:mt-7">
        <Breadcrumbs
          items={[
            { label: "Kreu", href: "/" },
            { label: categoryLabel(p.category), href: `/kategoria/${p.category}` },
            { label: p.name },
          ]}
        />
      </div>
      <div className="wrap mt-5 md:mt-7">
        <ProductView product={p} />
      </div>
      <section aria-labelledby="related-title" className="wrap mt-16 md:mt-24">
        <SectionHead id="related-title" title="Produkte të tjera" href={`/kategoria/${p.category}`} />
        <ul className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:grid-cols-4 md:gap-4 lg:gap-5">
          {related.map((r) => (
            <li key={r.slug} data-reveal="fade">
              <ProductCard product={r} />
            </li>
          ))}
        </ul>
      </section>
    </RevealScope>
  );
}
