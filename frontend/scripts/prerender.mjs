import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { build, loadEnv } from 'vite';
import { resolve } from 'node:path';
import { securityHeaders } from './security-headers.mjs';

// Use the existing React renderer and Vite rather than adding a prerender service.
await build({ build: { ssr: 'src/prerender.jsx', outDir: '.prerender' } });
const { render } = await import('../.prerender/prerender.js');
const template = await readFile('dist/index.html', 'utf8');
const manifest = JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8'));
const routes = { '/': 'public/HomePage/HomePage', '/admin/developer': 'Admin/AdminPortalPage', '/404': 'PageNotFound' };
for (const [path, page] of Object.entries(routes)) {
  const chunk = manifest[`src/pages/${page}.jsx`] ?? Object.values(manifest).find((entry) => entry.name === page.split('/').at(-1) && entry.isDynamicEntry);
  const styles = new Set();
  const visited = new Set();
  const collect = (entry) => {
    if (!entry || visited.has(entry)) return;
    visited.add(entry);
    entry?.css?.forEach((css) => styles.add(css));
    entry?.imports?.forEach((key) => collect(manifest[key]));
    entry.dynamicImports?.filter((key) => key.endsWith('/ResourcesSection.jsx')).forEach((key) => collect(manifest[key]));
  };
  collect(chunk);
  collect(manifest['src/main.jsx']);
  const criticalCSS = (await Promise.all([...styles].map((css) => readFile(`dist/${css}`, 'utf8')))).join('\n');
  let pageTemplate = template.replace(/<link[^>]*rel="stylesheet"[^>]*>/g, '');
  let markup = await render(path);
  const metadata = [];
  markup = markup.replace(/<title>[\s\S]*?<\/title>|<meta\b[^>]*>|<link\b[^>]*>/g, (tag) => { metadata.push(tag); return ''; });
  const preload = path === '/' ? '<link rel="preload" as="image" href="/images/slide-02-1280.webp" imagesrcset="/images/slide-02-640.webp 640w, /images/slide-02-960.webp 960w, /images/slide-02-1280.webp 1280w, /images/slide-02-1536.webp 1536w, /images/slide-02-2048.webp 2048w" imagesizes="100vw" fetchpriority="high">' : '';
  // Keep stylesheet links discoverable to Vite while the equivalent inline CSS handles the first paint.
  // Non-matching media prevents applying the same animations twice during hydration.
  const html = pageTemplate.replace('</head>', `${metadata.join('')}\n<style>${criticalCSS}</style>${[...styles].map((css) => `<link rel="stylesheet" href="/${css}" media="not all">`).join('')}\n${preload}</head>`).replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
  const file = path === '/' ? 'dist/index.html' : path === '/404' ? 'dist/404.html' : `dist${path}/index.html`;
  await mkdir(resolve(file, '..'), { recursive: true });
  await writeFile(file, html);
}
const env = { ...loadEnv('production', process.cwd(), ''), ...process.env };
if (env.VITE_SITE_URL) {
  const origin = new URL(env.VITE_SITE_URL).origin;
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>\n`);
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
}
const headers = securityHeaders(await readFile('dist/index.html', 'utf8'));
await writeFile('dist/_headers', `/*\n${Object.entries(headers).map(([key, value]) => `  ${key}: ${value}`).join('\n')}\n`);
await writeFile('dist/security-headers.nginx.conf', Object.entries(headers).map(([key, value]) => `add_header ${key} \"${value}\" always;`).join('\n') + '\n');
await rm('.prerender', { recursive: true, force: true });
console.log('Prerendered all routes and 404.html.');
