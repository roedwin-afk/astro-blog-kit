#!/usr/bin/env node

// cli.ts
import * as p from "@clack/prompts";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
var __dirname = path.dirname(fileURLToPath(import.meta.url));
function copyTemplate(templateName, destPath, replacements) {
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
    return false;
  }
  fs.writeFileSync(destPath, content, "utf-8");
  return true;
}
function log(symbol, message) {
  console.log(`${symbol} ${message}`);
}
async function main() {
  console.log("");
  p.intro("astro-blog-kit \u2014 Blog setup wizard");
  const answers = await p.group(
    {
      wpUrl: () => p.text({
        message: "WordPress URL",
        placeholder: "https://cms.tudominio.com",
        validate: (v) => {
          if (!v) return "WordPress URL is required";
          try {
            new URL(v);
          } catch {
            return "Please enter a valid URL";
          }
        }
      }),
      postsPerPage: () => p.text({
        message: "Posts per page",
        placeholder: "5",
        initialValue: "5",
        validate: (v) => {
          const n = Number(v);
          if (isNaN(n) || n < 1) return "Must be a number greater than 0";
        }
      }),
      defaultLayout: () => p.select({
        message: "Default layout",
        options: [
          { value: "magazine", label: "Magazine \u2014 featured post + grid" },
          { value: "grid", label: "Grid \u2014 3 column card grid" },
          { value: "list", label: "List \u2014 horizontal rows" }
        ]
      }),
      locale: () => p.text({
        message: "Default locale",
        placeholder: "en",
        initialValue: "en"
      }),
      i18n: () => p.confirm({
        message: "Enable i18n (multiple languages)?",
        initialValue: false
      })
    },
    {
      onCancel: () => {
        p.cancel("Setup cancelled.");
        process.exit(0);
      }
    }
  );
  const replacements = {
    WP_URL: answers.wpUrl,
    POSTS_PER_PAGE: answers.postsPerPage,
    DEFAULT_LAYOUT: answers.defaultLayout,
    LOCALE: answers.locale
  };
  const cwd = process.cwd();
  const spinner2 = p.spinner();
  spinner2.start("Creating blog files...");
  const files = [
    {
      template: "blog-config.ts.template",
      dest: path.join(cwd, "blog.config.ts")
    },
    {
      template: "blog-index.astro.template",
      dest: path.join(cwd, "src", "pages", "blog", "index.astro")
    },
    {
      template: "blog-slug.astro.template",
      dest: path.join(cwd, "src", "pages", "blog", "[...slug].astro")
    },
    {
      template: "blog-page.astro.template",
      dest: path.join(cwd, "src", "pages", "blog", "page", "[page].astro")
    },
    {
      template: "api-comments.ts.template",
      dest: path.join(cwd, "src", "pages", "api", "comments.ts")
    }
  ];
  const created = [];
  const skipped = [];
  for (const file of files) {
    const ok = copyTemplate(file.template, file.dest, replacements);
    const relativePath = path.relative(cwd, file.dest);
    if (ok) {
      created.push(relativePath);
    } else {
      skipped.push(relativePath);
    }
  }
  spinner2.stop("Blog files ready!");
  const envExample = path.join(cwd, ".env.example");
  if (!fs.existsSync(envExample)) {
    fs.writeFileSync(
      envExample,
      [
        `WP_API_URL=${answers.wpUrl}`,
        `WP_APP_USER=your-wordpress-username`,
        `WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx`
      ].join("\n"),
      "utf-8"
    );
    created.push(".env.example");
  }
  console.log("");
  if (created.length > 0) {
    log("\u2705", "Created:");
    created.forEach((f) => log("  ", f));
  }
  if (skipped.length > 0) {
    console.log("");
    log("\u26A0\uFE0F ", "Skipped (already exist):");
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
      "3. Run: npm run dev"
    ].join("\n"),
    "Next steps"
  );
  p.outro("Your blog is ready! \u{1F680}");
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
