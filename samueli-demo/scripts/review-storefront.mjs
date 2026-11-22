import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import sharp from "sharp";

// Development smoke test: isolated headless browser, local demo only.
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.SAMUELI_PLAYWRIGHT || "playwright");
const offline = process.env.SAMUELI_OFFLINE === "1";
const base = offline ? "http://samueli.local" : process.env.SAMUELI_REVIEW_URL || "http://127.0.0.1:3000";
assert(offline || /^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base), "Review must target the local demo");
const browser = await chromium.launch({ headless: true, executablePath: process.env.SAMUELI_CHROME });
const data = await fs.readFile("src/lib/data.ts", "utf8");
const productSlugs = [...data.matchAll(/slug: "([\w-]+)",\s+name:/g)].map(m => m[1]);
const routes = ["/", "/koleksionet", ...["te-gjitha", "xhaketa", "kostume-sportive", "bluza", "atlete", "aksesore"].map(s => `/kategoria/${s}`), ...productSlugs.map(s => `/produkt/${s}`), "/oferta", "/kerko?q=kostum", "/te-preferuarat", "/shporta", "/perfundimi-porosise", "/rreth-nesh", "/kontakt", "/llogaria"];
await fs.mkdir("design/qa", { recursive: true });
const report = [];
const reportFile = process.env.SAMUELI_REVIEW_ROUTES ? "design/qa/final-review.json" : "design/qa/report.json";
try {
  for (const [device, viewport] of Object.entries({ desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } })) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce", deviceScaleFactor: 1 });
    if (offline) {
      // Serve actual pre-rendered build output through request interception: no network sockets.
      await context.route("**/*", async route => {
        const url = new URL(route.request().url());
        if (url.origin !== base) return route.abort();
        try {
          const pathname = decodeURIComponent(url.pathname);
          if (pathname === "/_next/image") {
            const src = url.searchParams.get("url");
            assert(src?.startsWith("/images/") && !src.includes(".."));
            const body = await sharp(`public${src}`).resize({ width: Number(url.searchParams.get("w")), withoutEnlargement: true }).webp({ quality: 75 }).toBuffer();
            return route.fulfill({ body, contentType: "image/webp" });
          }
          let file;
          if (pathname.startsWith("/_next/static/")) file = `.next/static/${pathname.slice(14)}`;
          else if (pathname.startsWith("/images/")) file = `public${pathname}`;
          else file = `.next/server/app/${pathname === "/" ? "index" : pathname.slice(1)}${route.request().headers().rsc ? ".rsc" : ".html"}`;
          assert(!file.includes(".."));
          const types = { ".html": "text/html", ".rsc": "text/x-component", ".js": "application/javascript", ".css": "text/css", ".woff2": "font/woff2", ".webp": "image/webp", ".png": "image/png" };
          return route.fulfill({ body: await fs.readFile(file), contentType: types[path.extname(file)] || "application/octet-stream" });
        } catch (error) {
          console.error("Offline resource unavailable:", url.pathname, error.message);
          return route.fulfill({ status: 404, body: "Local build resource not found" });
        }
      });
    }
    await context.addInitScript(() => {
      localStorage.setItem("samueli-demo-cart-v2", JSON.stringify([{ key: "kostum-sportiv__M", slug: "kostum-sportiv", size: "M", qty: 1 }, { key: "atlete-classic__42", slug: "atlete-classic", size: "42", qty: 1 }]));
      localStorage.setItem("samueli-demo-wishlist-v2", JSON.stringify(["xhakete-puffer", "kostum-sportiv"]));
    });
    const page = await context.newPage();
    const selectedRoutes = process.env.SAMUELI_REVIEW_ROUTES ? JSON.parse(process.env.SAMUELI_REVIEW_ROUTES) : routes;
    for (const route of selectedRoutes) {
      const errors = [];
      const onError = e => errors.push(e.message);
      page.on("pageerror", onError);
      const response = await page.goto(base + route, { waitUntil: "networkidle" });
      assert.equal(response.status(), 200, `${device} ${route}: HTTP status`);
      await page.locator("main").waitFor();
      const seo = await page.evaluate(() => ({
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content,
        headings: document.querySelectorAll('main h1').length,
        language: document.documentElement.lang,
        robots: document.querySelector('meta[name="robots"]')?.content,
      }));
      assert(seo.title.includes("SAMUELI FASHION"), `${route}: page title`);
      assert(seo.description?.length > 20, `${route}: descriptive metadata`);
      assert.equal(seo.headings, 1, `${route}: one main heading`);
      assert.equal(seo.language, "sq", `${route}: Albanian language`);
      assert(seo.robots?.includes("noindex"), `${route}: local demo indexing guard`);
      if (route.startsWith("/produkt/")) {
        assert.equal(await page.locator('.touch-pan-y img').count(), 1, `${route}: one product photograph`);
      }
      // Trigger below-fold lazy images and reveals before reviewing the entire page.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForLoadState("networkidle");
      const images = await page.locator("main img").evaluateAll(imgs => imgs.map(i => ({ src: i.getAttribute("src"), complete: i.complete && i.naturalWidth > 0 })));
      assert(images.every(i => i.complete), `${device} ${route}: broken image ${JSON.stringify(images.filter(i => !i.complete))}`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      assert(!overflow, `${device} ${route}: horizontal overflow`);
      assert.equal(errors.length, 0, `${device} ${route}: ${errors.join("; ")}`);
      const file = `${device}-${route === "/" ? "home" : route.replace(/[^\w-]+/g, "-").replace(/^-/, "")}.png`;
      await page.screenshot({ path: path.join("design/qa", file), fullPage: true });
      report.push({ device, route, images: images.length, status: 200, brokenImages: 0, horizontalOverflow: false, screenshot: file });
      await fs.writeFile(reportFile, JSON.stringify({ mode: offline ? "offline-production-build" : "local-server", routes: report }, null, 2) + "\n");
      page.off("pageerror", onError);
    }
    // The homepage retains one campaign photo and five loaded category shortcuts.
    await page.goto(base, { waitUntil: "networkidle" });
    await page.waitForFunction(() => [...document.querySelectorAll('main section[aria-label="Kategoritë"] img')].every(i => i.complete && i.naturalWidth > 0));
    assert.equal(await page.locator('main section[aria-label="Kategoritë"] ul a').count(), 5, "Five category shortcuts");
    assert.equal(await page.locator('.info-strip').isVisible(), device === "desktop", "Information strip remains desktop-only");
    assert.equal(await page.getByRole("button", { name: /^Shfaq pamjen/ }).count(), 0, "No secondary hero slides");
    await page.waitForFunction(() => {
      const photo = document.querySelector('[data-photo]');
      return getComputedStyle(photo).visibility === "visible" && [...photo.querySelectorAll('img')].every(i => i.complete && i.naturalWidth > 0);
    });
    const selectedHero = await page.locator('.collection-hero-image').evaluate(image => image.currentSrc);
    assert(/campaign-background-\d+\.webp$/.test(selectedHero), `${device}: matching supplied hero photo`);
    const heroDownloads = await page.evaluate(() => performance.getEntriesByType("resource").filter(entry => /campaign-background-\d+\.webp/.test(entry.name)).map(entry => entry.name));
    assert.equal(heroDownloads.length, 1, `${device}: download only the matching hero photo`);
    await page.screenshot({ path: `design/qa/${device}-background-home.png`, fullPage: false });

    // Shopping and gallery behavior on both layouts.
    await page.goto(base + "/produkt/kostum-sportiv", { waitUntil: "networkidle" });
    assert.equal(await page.locator('.touch-pan-y img').count(), 1, "Product has one main photo");
    assert.equal(await page.getByRole("button", { name: /^Shfaq foton/ }).count(), 0, "No extra gallery thumbnails");
    await page.getByRole("radio", { name: "L", exact: true }).click();
    await page.locator("main").getByRole("button", { name: "Shto në Shportë", exact: true }).first().click();
    await page.getByRole("dialog").waitFor({ state: "visible" });
    const cart = await page.evaluate(() => JSON.parse(localStorage.getItem("samueli-demo-cart-v2")));
    assert(cart.some(l => l.slug === "kostum-sportiv" && l.size === "L" && l.qty === 1), `${device}: cart update`);
    await page.screenshot({ path: `design/qa/${device}-cart-drawer.png`, fullPage: true });
    await page.getByRole("button", { name: "Mbyll shportën", exact: true }).click();
    await page.getByRole("button", { name: "Hiq nga të preferuarat", exact: true }).first().click();
    await page.waitForFunction(() => !JSON.parse(localStorage.getItem("samueli-demo-wishlist-v2")).includes("kostum-sportiv"));

    await page.goto(base + "/kategoria/kostume-sportive", { waitUntil: "networkidle" });
    await page.getByRole("combobox", { name: "Rendit sipas" }).selectOption("cmimi-rritur");
    if (device === "mobile") await page.getByRole("button", { name: "Filtro", exact: true }).click();
    await page.getByRole("checkbox", { name: "Kostume me kapuç", exact: true }).check();
    if (device === "mobile") await page.getByRole("button", { name: "Mbyll filtrat", exact: true }).click();
    await page.waitForFunction(() => document.querySelectorAll("main .pcard").length === 1);
    await page.screenshot({ path: `design/qa/${device}-filtered-products.png`, fullPage: true });

    await page.goto(base, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Kërko", exact: true }).click();
    await page.locator("#site-search").fill("kostum");
    await page.waitForFunction(() => {
      const imgs = [...document.querySelectorAll('[role="dialog"][aria-label="Kërko produkte"] img')];
      return imgs.length === 4 && imgs.every(i => i.complete && i.naturalWidth);
    });
    const searchImages = await page.getByRole("dialog", { name: "Kërko produkte" }).locator("img").evaluateAll(imgs => imgs.every(i => i.complete && i.naturalWidth));
    assert(searchImages, `${device}: search thumbnails`);
    await page.screenshot({ path: `design/qa/${device}-search-overlay.png`, fullPage: true });
    await page.getByRole("button", { name: "Mbyll kërkimin", exact: true }).click();
    if (device === "desktop") {
      await page.locator(".nav-link").filter({ hasText: "Xhaketa" }).first().hover();
      await page.locator(".mega[data-open]").waitFor({ state: "visible" });
      await page.waitForLoadState("networkidle");
      assert(await page.locator(".mega[data-open] img").evaluateAll(imgs => imgs.length > 0 && imgs.every(i => i.complete && i.naturalWidth)), "Mega-menu images");
      const offerSrc = await page.locator('.mega[data-open] a[href="/oferta?kategoria=xhaketa"] img').getAttribute("src");
      assert.equal(new URL(offerSrc, base).searchParams.get("url"), "/images/studio/puffer.webp", "Offer tile must show the discounted jacket");
      await page.screenshot({ path: "design/qa/desktop-mega-menu.png", fullPage: true });
    } else {
      await page.getByRole("button", { name: "Hap menunë", exact: true }).click();
      await page.getByRole("dialog", { name: "Menyja kryesore" }).waitFor({ state: "visible" });
      await page.screenshot({ path: "design/qa/mobile-menu.png", fullPage: true });
    }
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.waitForFunction(() => [...document.querySelectorAll("[data-intro]")].every(e => getComputedStyle(e).visibility === "visible" && Number(getComputedStyle(e).opacity) > 0.99));
    await page.screenshot({ path: `design/qa/${device}-motion-home.png`, fullPage: true });
    await fs.writeFile(`design/qa/${device}-interaction-checks.json`, JSON.stringify({ gallery: "passed", requiredSizeAndCart: "passed", wishlist: "passed", sorting: "passed", filtering: "passed", searchThumbnails: "passed", navigationMenu: "passed", motionIntro: "passed" }, null, 2) + "\n");
    await context.close();
  }
  console.log(`Passed ${report.length} route/viewport reviews plus gallery, cart, wishlist, filtering, sorting, search, menu and motion smoke checks on desktop and mobile.`);
} finally {
  await browser.close();
}
