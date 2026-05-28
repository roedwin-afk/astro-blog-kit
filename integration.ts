// ─────────────────────────────────────────────────────────────
// astro-blog-kit · integration.ts
// ─────────────────────────────────────────────────────────────

import type { AstroIntegration } from "astro";
import type { BlogKitConfig, BlogTheme } from "./types";

/**
 * Genera el bloque de CSS variables a partir del tema.
 */
function generateThemeCSS(theme: BlogTheme = {}): string {
  const t = {
    accent: theme.accent ?? "#facc15",
    background: theme.background ?? "#ffffff",
    surface: theme.surface ?? "#f8f8f8",
    text: theme.text ?? "#0a0a0a",
    muted: theme.muted ?? "#6b7280",
    mutedLight: theme.mutedLight ?? "#9ca3af",
    border: theme.border ?? "#e5e7eb",
    black: theme.black ?? "#0a0a0a",
    white: theme.white ?? "#ffffff",
    fontHeading: theme.fontHeading ?? "Georgia, serif",
    fontBody: theme.fontBody ?? "system-ui, sans-serif",
    fontMono: theme.fontMono ?? "monospace",
    fontDisplay: theme.fontDisplay ?? "Georgia, serif",
    containerMax: theme.containerMax ?? "1200px",
  };

  return `
    :root {
      --bk-accent:       ${t.accent};
      --bk-background:   ${t.background};
      --bk-surface:      ${t.surface};
      --bk-text:         ${t.text};
      --bk-muted:        ${t.muted};
      --bk-muted-light:  ${t.mutedLight};
      --bk-border:       ${t.border};
      --bk-black:        ${t.black};
      --bk-white:        ${t.white};
      --bk-yellow:       ${t.accent};
      --bk-gray-100:     #f3f4f6;
      --bk-gray-200:     #e5e7eb;
      --bk-gray-300:     #d1d5db;
      --bk-gray-400:     #9ca3af;
      --bk-gray-600:     #4b5563;
      --bk-font-heading:       ${t.fontHeading};
      --bk-font-body:          ${t.fontBody};
      --bk-font-mono:          ${t.fontMono};
      --bk-font-display:       ${t.fontDisplay};
      --bk-container-max:      ${t.containerMax};
      --bk-transition:         all 0.2s ease;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
  `;
}

/**
 * Integración principal de astro-blog-kit.
 *
 * @example
 * ```js
 * // astro.config.mjs
 * import { defineConfig } from 'astro/config';
 * import { blogKit } from 'astro-blog-kit/integration';
 *
 * export default defineConfig({
 *   integrations: [
 *     blogKit({
 *       postsPerPage: 6,
 *       defaultLayout: 'magazine',
 *       theme: {
 *         accent: '#facc15',
 *         fontHeading: 'Inter, sans-serif',
 *       },
 *     }),
 *   ],
 * });
 * ```
 */
export function blogKit(config: BlogKitConfig = {}): AstroIntegration {
  const resolvedConfig: Required<BlogKitConfig> = {
    postsPerPage: config.postsPerPage ?? 5,
    defaultLayout: config.defaultLayout ?? "magazine",
    collectionName: config.collectionName ?? "blog",
    i18n: config.i18n ?? { locales: [], defaultLocale: "en" },
    theme: config.theme ?? {},
  };

  return {
    name: "astro-blog-kit",

    hooks: {
      "astro:config:setup": ({ injectScript, logger }) => {
        logger.info(
          `astro-blog-kit initialized — layout: ${resolvedConfig.defaultLayout}, postsPerPage: ${resolvedConfig.postsPerPage}`
        );

        // Inyecta CSS variables del tema globalmente
        const themeCSS = generateThemeCSS(resolvedConfig.theme);
        injectScript("head-inline", `
    (() => {
      const style = document.createElement('style');
      style.id = 'astro-blog-kit-theme';
      style.textContent = \`${themeCSS.replace(/`/g, "\\`")}\`;
      document.head.appendChild(style);
    })();
  `);

        // Inyecta config global
        injectScript(
          "page-ssr",
          `globalThis.__BLOG_KIT_CONFIG__ = ${JSON.stringify(resolvedConfig)};`
        );
      },

      "astro:config:done": ({ logger }) => {
        if (resolvedConfig.i18n.locales.length > 0) {
          logger.info(
            `i18n enabled — locales: [${resolvedConfig.i18n.locales.join(", ")}], default: ${resolvedConfig.i18n.defaultLocale}`
          );
        }
      },
    },
  };
}