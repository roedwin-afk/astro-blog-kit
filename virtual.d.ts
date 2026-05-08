// ─────────────────────────────────────────────────────────────
// astro-blog-kit · virtual.d.ts
// Tipos para módulos virtuales y globals inyectados.
// ─────────────────────────────────────────────────────────────

import type { BlogKitConfig } from "./types";

// ── Global inyectado por la integration ──────────────────────

declare global {
  var __BLOG_KIT_CONFIG__: Required<BlogKitConfig>;
}

// ── Módulo virtual (para uso futuro) ─────────────────────────

declare module "virtual:astro-blog-kit/config" {
  const config: Required<BlogKitConfig>;
  export default config;
}