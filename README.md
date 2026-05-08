# astro-blog-kit

A ready-to-use blog system for Astro with WordPress headless support, optional i18n, multiple layouts, and a comment system.

## Features

- 🚀 **One command setup** — `npx astro-blog-kit init`
- 📝 **WordPress headless** — connects to WordPress REST API out of the box
- 🎨 **Multiple layouts** — magazine, grid, and list
- 💬 **Comment system** — with secure proxy to WordPress
- 🌍 **Optional i18n** — multi-language support
- 🎨 **Themeable** — customize colors and fonts via `blogKit()` config
- 📦 **Zero config** — works without any configuration

---

## Quick Start

### 1. Install

```bash
npm install astro-blog-kit
```

### 2. Run the setup wizard

```bash
npx astro-blog-kit init
```

The wizard will ask you:
- WordPress URL
- Posts per page
- Default layout
- Default locale
- i18n support

And will automatically create:
- `blog.config.ts` — your blog configuration
- `src/pages/blog/index.astro` — blog listing page
- `src/pages/blog/[...slug].astro` — individual post page
- `src/pages/blog/page/[page].astro` — pagination pages
- `src/pages/api/comments.ts` — secure comment proxy
- `.env.example` — environment variables template

### 3. Add the integration

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import { blogKit } from "astro-blog-kit/integration";

export default defineConfig({
  integrations: [
    blogKit({
      postsPerPage: 5,
      defaultLayout: "magazine",
      theme: {
        accent: "#facc15",
        fontHeading: "Georgia, serif",
      },
    }),
  ],
});
```

### 4. Add your WordPress credentials

Copy `.env.example` to `.env` and fill in your credentials:

```env
WP_API_URL=https://cms.yourdomain.com
WP_APP_USER=your-wordpress-username
WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
```

To generate an Application Password in WordPress:
1. Go to **Users → Profile**
2. Scroll to **Application Passwords**
3. Enter a name (e.g. `astro-blog-kit`) and click **Add New**
4. Copy the generated password

### 5. Run your site

```bash
npm run dev
```

---

## Configuration

### `blog.config.ts`

```ts
import { defineBlogConfig } from "astro-blog-kit";

export default defineBlogConfig({
  wpUrl: "https://cms.yourdomain.com",
  postsPerPage: 5,
  defaultLayout: "magazine",
  locale: "en",
  theme: {
    accent: "#facc15",
    background: "#ffffff",
    text: "#0a0a0a",
    fontHeading: "Georgia, serif",
    fontBody: "system-ui, sans-serif",
  },
});
```

### Theme options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `accent` | `string` | `#facc15` | Primary accent color |
| `background` | `string` | `#ffffff` | Background color |
| `surface` | `string` | `#f8f8f8` | Surface color (cards, sidebars) |
| `text` | `string` | `#0a0a0a` | Primary text color |
| `muted` | `string` | `#6b7280` | Secondary text color |
| `border` | `string` | `#e5e7eb` | Border color |
| `fontHeading` | `string` | `Georgia, serif` | Heading font |
| `fontBody` | `string` | `system-ui, sans-serif` | Body font |
| `fontMono` | `string` | `monospace` | Monospace font |
| `containerMax` | `string` | `1200px` | Max container width |

---

## Layouts

### Magazine (default)
Featured post on the left + smaller posts on the right.

### Grid
3-column card grid (responsive: 2 cols on tablet, 1 on mobile).

### List
Horizontal rows with image on the left.

```astro
<BlogList layout="grid" ... />
<BlogList layout="list" ... />
<BlogList layout="magazine" ... />
```

---

## Components

### `<BlogList>`

```astro
---
import { BlogList } from "astro-blog-kit/components";
---
<BlogList
  posts={posts}
  currentPage={1}
  totalPages={totalPages}
  basePath="/blog/page/"
  blogBase="/blog/"
  dateLocale="en-US"
  t={t}
  locale="en"
  layout="magazine"
/>
```

### `<BlogPost>`

```astro
---
import { BlogPost } from "astro-blog-kit/components";
---
<BlogPost post={post} t={t} lang="en" />
```

### `<Comments>`

```astro
---
import { Comments } from "astro-blog-kit/components";
---
<Comments comments={comments} postId={post.id ?? 0} />
```

### `<CommentForm>`

```astro
---
import { CommentForm } from "astro-blog-kit/components";
---
<CommentForm postId={post.id ?? 0} apiRoute="/api/comments" />
```

---

## Utils

### WordPress client

```ts
import { createWPClient } from "astro-blog-kit/utils";

const wp = createWPClient("https://cms.yourdomain.com");

// Get paginated posts
const { posts, total, totalPages } = await wp.getPosts({ perPage: 5, page: 1 });

// Get all posts (for getStaticPaths)
const posts = await wp.getAllPosts();

// Get single post by slug
const post = await wp.getPost("my-post-slug");

// Get comments for a post
const comments = await wp.getComments(postId);

// Get categories
const categories = await wp.getCategories();
```

### i18n helpers

```ts
import { getLang, useTranslations, getBlogBase } from "astro-blog-kit/utils";

const lang = getLang(Astro.url, import.meta.env.BASE_URL, config);
const t = useTranslations(lang, { en, es });
const blogBase = getBlogBase(lang, import.meta.env.BASE_URL, config);
```

### Static paths helpers

```ts
import { getStaticPathsForPosts, getStaticPathsForPages } from "astro-blog-kit/utils";

// For [...slug].astro
export const getStaticPaths = () => getStaticPathsForPosts(posts);

// For [page].astro
export const getStaticPaths = () => getStaticPathsForPages(posts, { postsPerPage: 5 });
```

---

## Automatic deploys with GitHub Actions

Copy `node_modules/astro-blog-kit/examples/deploy-ftp.yml` to `.github/workflows/deploy.yml`.

Add these secrets to your GitHub repository (**Settings → Secrets**):

| Secret | Description |
|--------|-------------|
| `FTP_HOST` | Your server hostname |
| `FTP_USERNAME` | FTP username |
| `FTP_PASSWORD` | FTP password |
| `WP_API_URL` | Your WordPress URL |

The workflow triggers on:
- Push to `main`
- WordPress webhook (`wp_update`, `wp_comment`)
- Manual trigger

To trigger from WordPress, install the **WP Webhooks** plugin and configure it to send a `repository_dispatch` event to GitHub when a post is published or a comment is approved.

---

## i18n Support

```js
// astro.config.mjs
blogKit({
  i18n: {
    locales: ["en", "es"],
    defaultLocale: "en",
  },
})
```

With i18n enabled:
- Default locale: `/blog/my-post`
- Other locales: `/es/blog/my-post`

---

## Requirements

- Astro v4 or v5
- Node.js 18+
- WordPress with REST API enabled

---

## License

MIT