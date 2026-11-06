import { defineConfig } from 'astro/config';

// GitHub Pages project URL. Set BASE_PATH=/ for a domain or other static host.
const base = process.env.BASE_PATH ?? '/bnimemel-site';

export default defineConfig({
  output: 'static',
  base,
  trailingSlash: 'always',
  vite: { build: { sourcemap: false } },
});
