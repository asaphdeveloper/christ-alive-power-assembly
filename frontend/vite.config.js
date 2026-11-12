import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { securityHeaders } from './scripts/security-headers.mjs';

// https://vite.dev/config/
export default defineConfig({
  build: {
    assetsInlineLimit: (path) => path.endsWith('/logo.webp'),
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules') || id.endsWith('.css')) return;
          if (/framer-motion|motion-dom|motion-utils/.test(id)) return 'motion';
          if (/lucide-react|@hugeicons/.test(id)) return 'icons';
          return 'vendor';
        },
      },
    },
  },
  plugins: [
    {
      name: 'prerendered-preview',
      configurePreviewServer(server) {
        server.middlewares.use(async (request, response, next) => {
          if (!request.headers.accept?.includes('text/html')) return next();
          const path = new URL(request.url, 'http://localhost').pathname.replace(/\/$/, '') || '/';
          const known = ['/', '/admin/developer', '/admin/developer/admins', '/admin/developer/branches'];
          const file = path === '/' ? 'index.html' : known.includes(path) ? `${path.slice(1)}/index.html` : '404.html';
          try {
            const html = await readFile(new URL(`./dist/${file}`, import.meta.url));
            const gzip = request.headers['accept-encoding']?.includes('gzip');
            response.writeHead(known.includes(path) ? 200 : 404, {
              'Content-Type': 'text/html; charset=utf-8',
              Vary: 'Accept-Encoding',
              ...securityHeaders(html.toString()),
              ...(gzip && { 'Content-Encoding': 'gzip' }),
            });
            response.end(gzip ? gzipSync(html) : html);
          } catch { next(); }
        });
      },
    },
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', { target: '19' }]],
      },
    }),
  ],
});
