# SAMUELI FASHION — store demo (light redesign)

A clickable storefront concept for SAMUELI FASHION (Albanian menswear), built from the approved
light design and navigation references. **Sales demo only.** It is independent of
`samuelifashion.al` and its repository, hosting, payments, database, inventory and orders. It has no backend and no
network calls, and it places no orders or payments. Cart and wishlist live in `localStorage` on this device.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production check
```

Stack: Next.js 15 (App Router, static export of every route) · TypeScript · Tailwind CSS v4 · GSAP 3 + ScrollTrigger (`@gsap/react`) · Lucide · Manrope.

## Routes

| Route | What it shows |
|---|---|
| `/` | White nav, light winter-jacket hero with supplied desktop/mobile photos, one heading with red emphasis and a white CTA, category cards, favorites, tracksuit banner, collections, shopping information and footer |
| `/koleksionet` | Category collection cards |
| `/kategoria/[slug]` (`te-gjitha`, `xhaketa`, `kostume-sportive`, `bluza`, `atlete`, `aksesore`) | Breadcrumb, filters (type/category, size, colour, price), sort, load more, active-filter chips, mobile filter drawer, empty/loading states. `?lloji=` preselects a subcategory |
| `/produkt/[slug]` | One main product photograph, wishlist, colour, required size selection, quantity, add to cart, details, related items, sticky mobile buy bar |
| `/shporta` | Editable quantities, remove, subtotal/savings, empty state |
| `/perfundimi-porosise` | Demo checkout with client-side validation and a clear Albanian no-order confirmation |
| `/oferta` | Only items with a `compareAt` price in `src/lib/data.ts`; `?kategoria=` filter |
| `/rreth-nesh` | The only page with the real storefront photo |
| `/kontakt` | Phone/email (verify before production) + demo form that sends nothing |
| `/kerko?q=` · `/te-preferuarat` · `/llogaria` | Search results, wishlist, account placeholder |

## Navigation

- **Desktop (≥1024px):** each category has a link (always navigates) plus a chevron button (`aria-expanded`).
  Mega-menu opens on hover intent (80ms), focus/click, or the first tap on touch. Close delay is 200ms. Moving
  between items switches panels instantly. It closes on Esc (focus returns to the trigger), outside click, a link
  click, pointer exit, focus leaving the header, or a route change. Tab/ArrowDown moves into the panel. The panel lives inside the
  fixed header (nothing clips it). The header compacts on scroll with a constant-height spacer, so the page never jumps.
- **Mobile/tablet (<1024px):** hamburger · centred logo · search + cart. White left drawer (~360ms slide,
  separate scrim fade, 45ms row stagger), accordion subcategories, utility links, focus trap/restore, scroll lock,
  44px targets, safe-area padding.

## Motion

- Hero intro ≈1.4s: photo fades/settles (1.04→1), kicker, masked headline, copy and CTA. No slides or autoplay.
- The homepage uses left-aligned text, red heading emphasis, a white CTA and separate desktop/mobile photos. The black information strip remains desktop-only. Five compact category shortcuts appear together in one row, followed immediately by the existing product grid (two columns on mobile).
- Category cards stagger 100ms; Streetwear banner photo parallax + masked title; hover zoom 1.04; product image hover zoom of the main photograph.
- `prefers-reduced-motion`: no hidden states, CSS transitions disabled.

## Content honesty / before production

- Prices, discounts and products in `src/lib/data.ts` are **illustrative**. Offers appear only where `compareAt` is set.
- Shopping notices direct visitors to contact the store about delivery, returns and sizing; they make no unverified delivery-time, return-window or payment-method promises.
- Contact (`+355 69 537 4750`, `contact@samuelifashion.al`) must be **verified with the client**. Mockup numbers were not used.
- Studio assets are **generated concept demo photography**, derived from the supplied product assets with the built-in image tool. They contain existing third-party marks and are not verified inventory photographs. No new brand identity was commissioned. Use verified original product photography before production.
- There are no accessories product records in the demo. Aksesorë uses a product-only cap editorial image and retains its empty catalog state.
- The real storefront photo (`/rreth-nesh` only) is unaltered. Its signage shows the store's older monogram.
- `noindex, nofollow` via metadata and `X-Robots-Tag`. Do not deploy until authorised.

## Product photography update

- Shared asset mapping: `src/lib/photography.ts`. All 12 product records use one main photograph each; cards, hover states, PDP galleries, related products, search, wishlist, cart and checkout consume those same records.
- Editorial/category/mega-menu surfaces use separate transparent product assets over CSS charcoal studio backgrounds. They contain no flattened reference screenshots or human model photography.
- Existing layouts, navigation, typography, spacing, GSAP timelines, filters, sorting and localStorage shopping state are retained. Photography fitting and banner surface colors are the only presentation changes.
- The About Us store photograph and approved black/white logos are checked by SHA-256 in `scripts/verify-photography.mjs`.
- Sources: `design/studio-sources/`. Built-in image generation prompts and provenance: `design/photography-prompts.json` and `design/photography-inputs.json`. These are concept assets, not recovered high-resolution originals or authentic client inventory.
- Delivery: alpha WebP at 1200 × 1200 with consistent product margins; genuine detail crops retain their smaller native pixel dimensions. `next/image` provides responsive WebP/AVIF delivery. Source content is never upscaled by the preparation script.
- Rebuild delivery images: `node scripts/prepare-photography.mjs`. Check assets: `node scripts/verify-photography.mjs`.
- Local-only automated route review: `node scripts/review-storefront.mjs` with Playwright installed (or `SAMUELI_PLAYWRIGHT` set to its installed module path) and `SAMUELI_CHROME` set to a Chrome executable. It captures desktop/mobile screenshots in `design/qa/`, checks broken images and overflow, and exercises gallery and cart behavior.
- The previous unused human-model promotional source is archived outside the public directory under `design/legacy/`. No production site, database or backend was accessed.

Offline QA for environments blocking loopback: set `SAMUELI_OFFLINE=1` after `npm run build`. The review intercepts requests and serves the actual pre-rendered HTML, CSS, JavaScript, fonts and local product images directly from disk; it never connects to a website.

## Earlier homepage reference update

The earlier urban desktop/mobile brief in `design/references/urban-home/` supersedes the earlier ghost-mannequin-only/light-gray rule for the homepage hero. Changes are limited to the info strip, navbar presentation, hero and category shortcuts. The existing approved logo files, product grids and later homepage sections are retained. The original separate campaign image was reused as `public/images/hero/urban_campaign.webp`; no reference screenshot is used as a page background. Only the first urban campaign photo is displayed; the two alternate hero slides and their switching controls are removed. A single decorative red accent remains below the CTA. Small shortcut thumbnails are separately encoded 256px WebP assets under `public/images/shortcuts/`.

Product imagery now uses exactly one main photograph per product. Secondary detail images and gallery selectors are no longer displayed, and product cards retain the same main image on hover. Previously prepared detail assets are retained as unused source derivatives.


## Winter hero, copy and SEO update

The latest supplied photos are used unchanged as `public/images/hero/winter-jackets-desktop.webp` (1024 × 572, 41 KB) and `winter-jackets-mobile.webp` (825 × 1024, 50 KB). A native `<picture>` selects the portrait below 768px and the wide image otherwise, loading one photo only. Native WebP delivery avoids needless re-encoding or image enlargement. CSS controls the responsive crop and a light gradient for text contrast; text and button remain real HTML. The single-hero and one-photo-per-product requirements remain in place. The previous campaign files are unused.

The latest structure reference restores the compact mobile white header, unitalicised heading, rounded white CTA, five small category shortcuts and two-column product grid. There is no added band below the hero or category heading. The supplied winter photos remain unchanged; black/red text and a light gradient keep the left column readable against their light background. Only one hero accent remains.

Site copy now uses short Albanian descriptions of garments, categories and shopping actions. Page titles and descriptions, Albanian language metadata, one main heading per page, descriptive links, image alt text and Open Graph/Twitter metadata are included. Set `NEXT_PUBLIC_SITE_URL` to the verified public origin at build time to enable absolute canonical and social-image URLs. The local concept remains `noindex, nofollow`; publishing/indexing is a separate authorised step. No inventory, rating or availability claims were added.

SEO reference: [Google Search Central developer guide](https://developers.google.com/search/docs/fundamentals/get-started-developers), [page titles](https://developers.google.com/search/docs/appearance/title-link), [snippets](https://developers.google.com/search/docs/appearance/snippet) and [image guidance](https://developers.google.com/search/docs/appearance/google-images).

Validation: production build passed; `scripts/review-storefront.mjs` passed all 28 routes at 1440px and 390px (56 route/viewport checks), including image loading, overflow, branded page metadata, one H1, local noindex protection, one product photograph, responsive hero source selection, cart, wishlist, sorting, filtering, search, menus and motion. Additional 320px homepage review confirmed no horizontal overflow. Final screenshots: `design/qa/desktop-winter-home.png` and `design/qa/mobile-winter-home.png`.


## Current hero — centre photo layout

The latest brief uses the three-column reference: left heading, a separate campaign photo in the centre, and plain copy, a black CTA and four linked category pills on the right. The light-gray background, approved logo, category shortcuts and product grids are preserved. On mobile the heading and portrait photo share a row, with shopping links below. There is one hero, with no slideshow controls.

Photos come from the user's `hero_banners_4x5_and_16x9.zip`, archived unchanged in `design/hero-banner-sources/`. The wide source is 1376 × 768 and the portrait is 928 × 1152. Six responsive WebP derivatives in `public/images/hero/collection-*` retain their source aspect ratios and never enlarge the originals; delivery files are 20–58 KB. A native `<picture>` selects the wide photo from 1024px and the portrait below that breakpoint, with high fetch priority and one image request. No screenshot or embedded text is used as page artwork. The earlier full-width winter hero is superseded by this section. Page metadata retains the existing noindex protection for the local demo.

Current hero validation: production build and photo-integrity checks passed. Targeted desktop/mobile homepage checks passed, including correct ZIP-photo source selection, one image request per viewport, metadata, no overflow, shopping controls, navigation and motion. Screenshots: `design/qa/desktop-collection-home.png` and `design/qa/mobile-collection-home.png`.


## Current hero background

The latest supplied image `Gemini_Generated_Image_qygouyqygouyqygo.jpg` is now the full-width hero background. The original 1936 × 544 source is archived as `design/hero-banner-sources/campaign-background.jpg`. Responsive WebP derivatives (768, 1200, 1600 and 1936px) preserve the original proportions without enlargement. The previous centre panel is removed. The same heading, CTA and category links remain above the image, with light CSS gradients for readable copy and a responsive crop that keeps the model visible. This supersedes the centre-photo layout above; the category shortcuts, product cards, logo, store photo and shopping functionality are unchanged.

Latest adjustment: the white hero overlay is completely removed on desktop and mobile. The hero renders the supplied campaign photo without a tint or gradient; all copy, links, responsive cropping and animations remain unchanged.

Hero balance pass: desktop height now follows the wide source aspect ratio within a 400–544px range, avoiding the previous extra zoom. The heading is larger, the small label has better contrast, and the right-hand description uses white type with a text-only shadow. The mobile crop shifts the model to the right to leave room for the heading and short copy; duplicate in-hero category pills are hidden below 1024px because the five category shortcuts already follow immediately below. The photograph remains unfiltered with no overlay.
