// ─────────────────────────────────────────────────────────────
// astro-blog-kit · integration.ts
// ─────────────────────────────────────────────────────────────

import type { AstroIntegration } from "astro";
import type { Plugin } from "vite";
import type { BlogKitConfig, BlogTheme } from "./types";

const VIRTUAL_MODULE_ID = "virtual:astro-blog-kit/theme";
const RESOLVED_VIRTUAL_MODULE_ID = "\0" + VIRTUAL_MODULE_ID;

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
  --bk-accent:        ${t.accent};
  --bk-background:    ${t.background};
  --bk-surface:       ${t.surface};
  --bk-text:          ${t.text};
  --bk-muted:         ${t.muted};
  --bk-muted-light:   ${t.mutedLight};
  --bk-border:        ${t.border};
  --bk-black:         ${t.black};
  --bk-white:         ${t.white};
  --bk-yellow:        ${t.accent};
  --bk-gray-100:      #f3f4f6;
  --bk-gray-200:      #e5e7eb;
  --bk-gray-300:      #d1d5db;
  --bk-gray-400:      #9ca3af;
  --bk-gray-600:      #4b5563;
  --bk-font-heading:  ${t.fontHeading};
  --bk-font-body:     ${t.fontBody};
  --bk-font-mono:     ${t.fontMono};
  --bk-font-display:  ${t.fontDisplay};
  --bk-container-max: ${t.containerMax};
  --bk-transition:    all 0.2s ease;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
`.trim();
}

/**
 * Plugin de Vite que expone el tema como un virtual module CSS.
 * Esto permite que Astro procese el CSS en SSR correctamente,
 * sin depender de JavaScript en el cliente para inyectar variables.
 *
 * Uso en cualquier componente .astro del paquete:
 *   import 'virtual:astro-blog-kit/theme';
 */
function createThemePlugin(theme: BlogTheme): Plugin {
  const css = generateThemeCSS(theme);

  return {
    name: "astro-blog-kit:theme",
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID;
      }
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        // Retornamos CSS puro — Vite lo procesa como módulo CSS
        return `export default ${JSON.stringify(css)};`;
      }
    },
    // Fuerza el tipo del módulo como CSS para que Vite lo trate correctamente
//     transform(code, id) {
//       if (id === RESOLVED_VIRTUAL_MODULE_ID) {
//         return {
//           code: `
// const style = document.createElement('style');
// style.id = 'astro-blog-kit-theme';
// style.textContent = ${JSON.stringify(css)};
// if (!document.getElementById('astro-blog-kit-theme')) {
//   document.head.appendChild(style);
// }
//           `.trim(),
//           map: null,
//         };
//       }
//     },
  };
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
 *       defaultLayout: 'featured',
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
    hero: config.hero ?? {},   // ← agregar
    ui: config.ui ?? {},
  };

  return {
    name: "astro-blog-kit",

    hooks: {
      "astro:config:setup": ({ updateConfig, injectScript, logger }) => {
        logger.info(
          `astro-blog-kit initialized — layout: ${resolvedConfig.defaultLayout}, postsPerPage: ${resolvedConfig.postsPerPage}`
        );

        // Registra el virtual module como plugin de Vite
        // Esto garantiza que las CSS variables existen en SSR y en el build estático
        updateConfig({
          vite: {
            plugins: [createThemePlugin(resolvedConfig.theme)],
          },
        });

        // Inyecta el virtual module en cada página como CSS real
        // "page-ssr" = se ejecuta en el servidor, garantiza que el style
        // esté disponible antes del primer paint
        injectScript("page-ssr", `import "${VIRTUAL_MODULE_ID}";`);

        // Inyecta config global accesible desde cualquier componente
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