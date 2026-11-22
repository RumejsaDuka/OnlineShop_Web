import { pageMetadata } from "@/lib/seo";
import { photography } from "@/lib/photography";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ALL_SLUG, categories, getCategory } from "@/lib/data";
import PageHero from "@/components/PageHero";
import RevealScope from "@/components/RevealScope";
import CatalogView from "@/components/catalog/CatalogView";
import { Breadcrumbs } from "@/components/ui";

export function generateStaticParams() {
  return [{ slug: ALL_SLUG }, ...categories.map((c) => ({ slug: c.slug }))];
}
export const dynamicParams = false;

function meta(slug: string) {
  if (slug === ALL_SLUG)
    return { title: "Të gjitha produktet", intro: "Xhaketa, kostume sportive, bluza dhe atlete në një vend.", image: photography.hoodedTracksuit };
  const c = getCategory(slug);
  return c ? { title: c.label, intro: c.intro, image: c.image } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = meta(slug);
  return pageMetadata(m ? `${m.title} për meshkuj` : "Kategoria", m?.intro ?? "Shiko produktet sipas kategorisë.", `/kategoria/${slug}`, m?.image);
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = meta(slug);
  if (!m) notFound();
  return (
    <RevealScope>
      <PageHero title={m.title} intro={m.intro} image={m.image} />
      <div className="wrap mt-5">
        <Breadcrumbs items={[{ label: "Kreu", href: "/" }, ...(slug === ALL_SLUG ? [] : [{ label: "Koleksionet", href: "/koleksionet" }]), { label: m.title }]} />
      </div>
      <div className="wrap mt-6 md:mt-8">
        <Suspense fallback={<div className="skeleton h-[480px] rounded-[22px]" />}>
          <CatalogView slug={slug} />
        </Suspense>
      </div>
    </RevealScope>
  );
}
