Deployment settings
===================

The hosting provider and production domain have not been supplied yet. These files are deployment templates, not an assertion that headers are configured on your host.

1. Set `VITE_SITE_URL` to the real HTTPS origin (no path), then run `npm ci && npm run build` from `frontend`. Publish `frontend/dist`. The build generates canonical/social URLs, a sitemap, robots.txt, all route HTML, and security headers. The source sitemap stays empty until a real origin is supplied; it never publishes a made-up domain.
2. Serve the prerendered `/login/index.html`, `/signup/index.html`, `/forgot-password/index.html`, and `/admin/index.html` at their respective routes. Redirect `/auth` to `/login`. Serve `404.html` with HTTP 404 for unknown routes; do not rewrite every URL to the homepage.
3. On Netlify or Cloudflare Pages, the generated `dist/_headers` uses their static-host header syntax. For Nginx, include the generated `security-headers.nginx.conf` inside your server block. For another host, apply those header names and values in its response-header configuration. Regenerate them with every build because the JSON-LD script hash changes with the site URL.
4. Enable HTTPS, Brotli/gzip for HTML/CSS/JS/SVG, long immutable caching for hashed `/assets/*`, and revalidation for HTML. `/images/*` have stable names and should use revalidation rather than year-long immutable caching.
5. Submit `/sitemap.xml` in Search Console after deploying. It lists the public homepage; authentication, admin, and missing pages are not sitemap entries. Admin and 404 pages deliberately use `noindex`.
6. Validate the deployed headers and rerun Lighthouse against the real domain. Local preview applies the same HTML security headers and compression, but cannot certify your CDN configuration.

CSP permits inline styles because Framer Motion sets styles dynamically. Scripts are limited to the same origin plus the exact hash of the structured data; `unsafe-inline` is not enabled for scripts. Add specific origins only when you introduce a real external service.

The admin dashboard and authentication forms remain the existing prototypes. SEO controls do not provide authentication; configure server-side access control before storing private data.
