import type { Metadata } from "next";

// Configure only when the final public domain is known. The local demo stays noindex.
export const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function pageMetadata(title: string, description: string, path?: string, image?: string): Metadata {
  const url = publicSiteUrl && path ? new URL(path, publicSiteUrl).toString() : undefined;
  const imageUrl = publicSiteUrl && image ? new URL(image, publicSiteUrl).toString() : undefined;
  return {
    title: { absolute: `${title} | SAMUELI FASHION` },
    description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: { title: `${title} | SAMUELI FASHION`, description, locale: "sq_AL", type: "website", url, images: imageUrl ? [{ url: imageUrl, alt: title }] : undefined },
    twitter: { card: imageUrl ? "summary_large_image" : "summary", title: `${title} | SAMUELI FASHION`, description, images: imageUrl ? [imageUrl] : undefined },
  };
}
