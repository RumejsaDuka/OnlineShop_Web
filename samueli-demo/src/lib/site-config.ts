export const siteBasePath = process.env.NODE_ENV === "production" ? "/OnlineShop_Web" : "";

export function publicAssetPath(path: string): string {
  return `${siteBasePath}${path.startsWith("/") ? path : `/${path}`}`;
}
