#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// astro-blog-kit · cli.ts
// Comando: npx astro-blog-kit init
// ─────────────────────────────────────────────────────────────

import * as p from "@clack/prompts";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Helpers ───────────────────────────────────────────────────

function copyTemplate(
  templateName: string,
  destPath: string,
  replacements: Record<string, string>
) {
  const templatePath = path.join(__dirname, "..", "templates", templateName);
  let content = fs.readFileSync(templatePath, "utf-8");

  for (const [key, value] of Object.entries(replacements)) {
    content = content.replaceAll(`__${key}__`, value);
  }

  const dir = path.dirname(destPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (fs.existsSync(destPath)) {
    return false; // ya existe, no sobreescribir
  }

  fs.writeFileSync(destPath, content, "utf-8");
  return true;
}

function log(symbol: string, message: string) {
  console.log(`${symbol} ${message}`);
}

// ── Main ──────────────────────────────────────────────────────

async function main() {
  console.log("");
  p.intro("astro-blog-kit — Blog setup wizard");

  // ── Preguntas ──────────────────────────────────────────────

  const answers = await p.group(
    {
      wpUrl: () =>
        p.text({
          message: "WordPress URL",
          placeholder: "https://cms.tudominio.com",
          validate: (v) => {
            if (!v) return "WordPress URL is required";
            try {
              new URL(v);
            } catch {
              return "Please enter a valid URL";
            }
          },
        }),
      hasLayout: () =>
        p.confirm({
          message: "Do you have a Layout component?",
          initialValue: true,
        }),

      postsPerPage: () =>
        p.text({
          message: "Posts per page",
          placeholder: "5",
          initialValue: "5",
          validate: (v) => {
            const n = Number(v);
            if (isNaN(n) || n < 1) return "Must be a number greater than 0";
          },
        }),

      defaultLayout: () =>
        p.select({
          message: "Default layout",
          // DESPUÉS
          options: [
            { value: "magazine", label: "Magazine — featured post + grid" },
            { value: "grid", label: "Grid — 3 column card grid" },
            { value: "featured", label: "Featured — large hero + grid below" },
            { value: "cards", label: "Cards — image background + text overlay" },
          ],
        }),

      locale: () =>
        p.select({
          message: "Default locale",
          options: [
            { value: "en", label: "English" },
            { value: "es", label: "Español" },
          ],
        }),

      i18n: () =>
        p.confirm({
          message: "Enable i18n (multiple languages)?",
          initialValue: false,
        }),
    },
    {
      onCancel: () => {
        p.cancel("Setup cancelled.");
        process.exit(0);
      },
    }
  );

  // ── Replacements ──────────────────────────────────────────

  const translations: Record<string, Record<string, string>> = {
    en: {
      T_TAGLINE: "Our Blog",
      T_TITLE_LINE1: "Latest",
      T_TITLE_LINE2: "Articles",
      T_DESCRIPTION: "Welcome to our blog.",
      T_BTNCTA: "Read more",
      T_BTN_PREV: "Previous",
      T_BTN_NEXT: "Next",
    },
    es: {
      T_TAGLINE: "Nuestro Blog",
      T_TITLE_LINE1: "Últimos",
      T_TITLE_LINE2: "Artículos",
      T_DESCRIPTION: "Bienvenido a nuestro blog.",
      T_BTNCTA: "Leer más",
      T_BTN_PREV: "Anterior",
      T_BTN_NEXT: "Siguiente",
    },
  };

  const locale = answers.locale as string;
  const t = translations[locale] ?? translations["en"];

  const hasLayout = answers.hasLayout as boolean;

  const replacements: Record<string, string> = {
    WP_URL: answers.wpUrl as string,
    POSTS_PER_PAGE: answers.postsPerPage as string,
    DEFAULT_LAYOUT: answers.defaultLayout as string,
    LOCALE: answers.locale as string,
    LAYOUT_IMPORT: hasLayout
      ? `import Layout from "../../layouts/Layout.astro";`
      : "",
    LAYOUT_IMPORT_PAGE: hasLayout
      ? `import Layout from "../../../layouts/Layout.astro";`
      : "",
    LAYOUT_IMPORT_SLUG: hasLayout
      ? `import Layout from "../../layouts/Layout.astro";`
      : "",
    LAYOUT_OPEN: hasLayout
      ? `<Layout>`
      : `<html lang={config.locale ?? "en"}>\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Blog</title>\n  </head>\n  <body>`,
    LAYOUT_CLOSE: hasLayout
      ? `</Layout>`
      : `  </body>\n</html>`,
    ...t
  };

  // ── Copia archivos ────────────────────────────────────────

  const cwd = process.cwd();
  const spinner = p.spinner();
  spinner.start("Creating blog files...");

  const files = [
    {
      template: "blog-config.ts.template",
      dest: path.join(cwd, "blog.config.ts"),
    },
    {
      template: "blog-index.astro.template",
      dest: path.join(cwd, "src", "pages", "blog", "index.astro"),
    },
    {
      template: "blog-slug.astro.template",
      dest: path.join(cwd, "src", "pages", "blog", "[...slug].astro"),
    },
    {
      template: "blog-page.astro.template",
      dest: path.join(cwd, "src", "pages", "blog", "page", "[page].astro"),
    },
    {
      template: "api-comments.ts.template",
      dest: path.join(cwd, "src", "pages", "api", "comments.ts"),
    },
  ];

  const created: string[] = [];
  const skipped: string[] = [];

  for (const file of files) {
    const ok = copyTemplate(file.template, file.dest, replacements);
    const relativePath = path.relative(cwd, file.dest);
    if (ok) {
      created.push(relativePath);
    } else {
      skipped.push(relativePath);
    }
  }

  spinner.stop("Blog files ready!");

  // ── Crea .env.example ─────────────────────────────────────

  const envExample = path.join(cwd, ".env.example");
  if (!fs.existsSync(envExample)) {
    fs.writeFileSync(
      envExample,
      [
        `WP_API_URL=${answers.wpUrl}`,
        `WP_APP_USER=your-wordpress-username`,
        `WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx`,
      ].join("\n"),
      "utf-8"
    );
    created.push(".env.example");
  }

  // ── Resumen ───────────────────────────────────────────────

  console.log("");

  if (created.length > 0) {
    log("✅", "Created:");
    created.forEach((f) => log("  ", f));
  }

  if (skipped.length > 0) {
    console.log("");
    log("⚠️ ", "Skipped (already exist):");
    skipped.forEach((f) => log("  ", f));
  }

  console.log("");

  p.note(
    [
      "1. Add your WordPress credentials to .env:",
      "   WP_APP_USER=your-username",
      "   WP_APP_PASSWORD=xxxx xxxx xxxx xxxx",
      "",
      "2. Add blogKit() to your astro.config.mjs:",
      "   import { blogKit } from 'astro-blog-kit/integration';",
      "   integrations: [blogKit()]",
      "",
      "3. Run: npm run dev",
    ].join("\n"),
    "Next steps"
  );

  p.outro("Your blog is ready! 🚀");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});