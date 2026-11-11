# Lighthouse optimization report

Audited the production build using Lighthouse 13.5.0 and headless Chrome. Scores are local lab measurements, not a guarantee for every device or production hosting configuration. No runtime or build dependencies were added to package.json. Temporary Lighthouse and font-conversion tools were used outside the project dependency tree.

## Before and after

Scores are **Performance / Accessibility / Best Practices / SEO**. The mobile homepage after-score is the median of three final runs. Baselines were captured on September 20; final verification was resumed on September 21 after the session interruption.

| Route | Device | Before | After |
| --- | --- | --- | --- |
| `/` | mobile | 86 / 90 / 100 / 75 | 93 / 100 / 100 / 100 |
| `/` | desktop | 96 / 95 / 100 / 75 | 100 / 100 / 100 / 100 |
| `/signup` | mobile | 82 / 96 / 100 / 75 | 98 / 100 / 100 / 100 |
| `/signup` | desktop | 99 / 82 / 100 / 75 | 100 / 100 / 100 / 100 |
| `/forgot-password` | mobile | 83 / 95 / 100 / 75 | 99 / 100 / 100 / 100 |
| `/forgot-password` | desktop | 99 / 91 / 100 / 75 | 100 / 100 / 100 / 100 |
Baseline failures included missing titles/descriptions and robots.txt; missing image alternative text; an unnamed mobile menu; low-contrast authentication links; undersized password toggles; oversized JPEG/PNG/TTF assets; and all routes loading in one bundle.

## What remains

**The requested 100 in every category on every route is not fully achieved.**

- `/` mobile: FCP 1.4 s, LCP 3.1 s, TBT 70 ms, CLS 0.
- `/signup` mobile: FCP 1.2 s, LCP 1.9 s, TBT 130 ms, CLS 0.
- `/forgot-password` mobile: FCP 1.2 s, LCP 1.9 s, TBT 110 ms, CLS 0.

- Mobile homepage performance varied between 88 and 97 during the optimization passes. Its remaining scored issue is initial paint/LCP timing with the retained hero visuals and hydration. This is a code/rendering and measurement limitation, not something that can honestly be attributed entirely to hosting. The final table uses the final complete audit pass; for the variable mobile homepage result it uses a three-run median of 93 (individual scores: 88, 93, 93), rather than the highest score observed. Each repeat is preserved as `lh-after-home-mobile-run1.json` through `run3.json`.
- The 404 page is prerendered, has a return-home link, and is served with HTTP 404 and `noindex`. Lighthouse does not give a normal successful-page score for that HTTP status. The baseline incorrectly returned HTTP 200 for missing pages.
- Production domain and hosting provider were requested but have not been supplied. Canonical URLs, absolute social image URLs, and the populated sitemap depend on setting `VITE_SITE_URL`. The committed source sitemap deliberately contains no invented domain. Provider-specific deployment remains to be verified.

## Validation

- `npm run build` succeeds without warnings; all routes and `404.html` are prerendered.
- `npm run lint` and `git diff --check` pass.
- Browser checks passed: mobile menu open/Escape/focus return, slideshow pause, branches next/previous, resource filtering, password visibility, client route title/description updates, main-content focus, and reduced motion. No JavaScript errors were observed in these checks.
- Mobile and desktop checks found one main landmark and one h1 on each route, no missing image dimensions or alt attributes, no broken images, and no horizontal overflow.
- Before/after mobile screenshots retain the same composition. The accessible pause control and keyboard/mobile navigation fixes are intentional functional improvements.
- Raw Lighthouse JSON reports were moved out of the project to `/tmp/capa-lighthouse-reports-20260921-101539` during cleanup. This is a temporary local archive; the score summary remains in this report.

## Files changed

| Files | Changes |
| --- | --- | --- |
| `package.json` | Build now includes dependency-free React/Vite prerendering. |
| `vite.config.js` | Vendor/icon/motion chunks, selected inline logo, asset manifest, and production preview routing/compression/security headers. |
| `index.html` | Correct favicon type, Apple touch icon, theme color, critical font preloads, and a small inline module that starts hydration after the first paint. |
| `src/main.jsx` | Hydrates prerendered HTML; mounts React normally during development. |
| `src/App.jsx` | Lazy routes, Suspense, reusable SEO, route focus, and skip link. |
| `src/components/SEO.jsx` | Unique metadata, configured canonical/Open Graph/Twitter URLs, Church/WebSite JSON-LD, and 404 noindex. |
| `src/components/RouteFocus.jsx` | Moves keyboard focus to main content after client navigation, including lazy routes. |
| `src/prerender.jsx` | Renders each route with StaticRouter using React’s existing server renderer. |
| `scripts/prerender.mjs` | Builds static route HTML, inlines route CSS, generates sitemap/robots and header configurations. |
| `scripts/security-headers.mjs` | Reusable CSP with structured-data hashes, nosniff, referrer policy, permissions policy, and frame protection. |
| `src/index.css` | WOFF2 with font-display swap, keyboard focus, skip-link styling, reduced-motion support, logo aspect ratio, and reserved loading space. |
| `src/components/Navbar.jsx`; `src/components/Navbar.css` | Optimized logo/icons, decorative alternatives/dimensions, accessible working mobile navigation, keyboard dropdowns and Escape handling, corrected icon ratios. |
| `src/components/Footer.jsx` | Optimized logo and asynchronous image decoding. |
| `src/pages/public/HomePage/HomePage.jsx`; `src/pages/public/HomePage/HomePage.css` | Lazy resource component with reserved fallback space, main landmark target, removed duplicate title/favicon, and fixed broken scroll icon URL. |
| `src/pages/public/HomePage/Hero.jsx`; `src/pages/public/HomePage/Hero.css` | Responsive eager/preloaded WebP hero images; LazyMotion; equivalent CSS entrance animation; pause control and appropriate live announcements. |
| `src/pages/public/HomePage/AboutSection.jsx` | Responsive WebP, corrected natural dimensions, asynchronous decoding, and low-priority lazy image. |
| `src/pages/public/HomePage/BranchesSection.jsx` | Responsive low-priority lazy photos, dimensions, decorative alternatives; retained the prior smooth branch scrolling fix. |
| `src/pages/public/HomePage/PastorSection.jsx`; `src/pages/public/HomePage/PastorSection.css` | Responsive lazy images, dimensions/alternatives, and correct icon aspect ratios. |
| `src/pages/public/HomePage/UpcomingSection.jsx` | Responsive WebP event photos with dimensions and lazy decoding. |
| `src/pages/public/HomePage/GivingSection.jsx`; `src/pages/public/HomePage/GivingSection.css` | Responsive lazy photo and removal of the broken unused background image URL that caused the build warning. |
| `src/pages/public/HomePage/SectionReveal.jsx` | Keeps prerendered structure stable when reduced motion is enabled. |
| `src/pages/PageNotFound.jsx`; `src/pages/PageNotFound.css` | Accessible 404 content, main landmark, and return-home navigation. |
| `src/assets/fonts/ClashDisplay-Variable.woff2`; `src/assets/fonts/Outfit-VariableFont_wght.woff2` | Same font families converted to WOFF2 (approximately 62% smaller in total); original sources retained. |
| `public/images/slide-{01,02,03,04}-{640,960,1280,1536,2048}.webp`; `public/images/lead-pastor-{640,1280,2048}.webp` | Responsive optimized versions of existing photographs. |
| `public/images/logo.webp`; `src/assets/images/logo.webp`; `public/apple-touch-icon.png` | Optimized logo for favicon/inline UI and Apple touch icon. |
| `public/robots.txt`; `public/sitemap.xml` | Crawler files; build populates domain-dependent sitemap content. |
| `.env.example`; `deploy/README.md` | Production domain setting and hosting/header/cache/routing instructions. |
| `eslint.config.js` | Allows JSX component identifiers in callback arguments, matching the existing uppercase variable rule. |
| `.gitignore` | Excludes temporary prerender output and generated Lighthouse JSON. |
| `LIGHTHOUSE_REPORT.md` | Audit results, remaining limitations, full change inventory, and deployment instructions. |

Existing staged branches changes and the user’s README changes were preserved.

## Hosting steps

1. Set `VITE_SITE_URL` to the real HTTPS origin and rebuild.
2. Publish `frontend/dist`, serve the prerendered homepage, and return `404.html` with HTTP 404 for missing pages.
3. Apply generated `_headers` on compatible static hosts, or include generated `security-headers.nginx.conf` on Nginx; use the equivalent host settings elsewhere.
4. Enable HTTPS and Brotli/gzip, immutable caching for hashed `/assets/*`, and revalidation for HTML and stable `/images/*` URLs.
5. Submit the generated sitemap and rerun Lighthouse on the deployed domain. See [deploy/README.md](deploy/README.md) for details.
