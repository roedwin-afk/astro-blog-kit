# astro-blog-kit

A ready-to-use blog system for Astro with WordPress headless support, optional i18n, multiple layouts, and a comment system.

## Features

- 🚀 **One command setup** — `npx astro-blog-kit init`
- 📝 **WordPress headless** — connects to WordPress REST API out of the box
- 🎨 **Multiple layouts** — magazine, featured, grid, cards
- 💬 **Comment system** — with secure proxy to WordPress
- 🌍 **Optional i18n** — multi-language support
- 🎨 **Fully themeable** — colors, fonts, hero texts, and UI labels via `blog.config.ts`
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
import { defineConfig } from 'astro/config';
import { blogKit } from 'astro-blog-kit/integration';
import config from './blog.config';
import { toBlogKitConfig } from 'astro-blog-kit';

export default defineConfig({
  integrations: [blogKit(toBlogKitConfig(config))],
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
import { defineBlogConfig } from 'astro-blog-kit';

export default defineBlogConfig({
  wpUrl: import.meta.env.WP_API_URL || 'https://cms.yourdomain.com',
  postsPerPage: 5,
  defaultLayout: 'magazine', // 'magazine' | 'grid' | 'featured' | 'cards'
  locale: 'en',              // 'en' | 'es'

  theme: {
    accent:       '#facc15',
    background:   '#ffffff',
    surface:      '#f8f8f8',
    text:         '#0a0a0a',
    muted:        '#6b7280',
    mutedLight:   '#9ca3af',
    border:       '#e5e7eb',
    black:        '#0a0a0a',
    white:        '#ffffff',
    fontHeading:  'Georgia, serif',
    fontBody:     'system-ui, sans-serif',
    fontMono:     'monospace',
    fontDisplay:  'Georgia, serif',
    containerMax: '1200px',
  },

  hero: {
    tagline:     'Our Blog',
    titleLine1:  'Latest',
    titleLine2:  'Articles',
    description: 'Welcome to our blog.',
  },

  ui: {
    readMoreLabel:          'Read more →',
    btnPrev:                'Previous',
    btnNext:                'Next',
    commentButtonColor:     'var(--bk-accent)',
    commentButtonTextColor: 'var(--bk-black)',
    paginationStyle:        'minimal', // 'minimal' | 'numbered'
    // paginationBtnBg:         '#facc15',
    // paginationBtnText:       '#0a0a0a',
    // paginationBtnHoverBg:    '#0a0a0a',
    // paginationBtnHoverText:  '#ffffff',
    // paginationActiveBg:      '#facc15',
    // paginationActiveText:    '#0a0a0a',
  },
});
```

---

### theme

| Property       | Default                 | Description                         |
| :------------- | :---------------------- | :---------------------------------- |
| `accent`       | `#facc15`               | Primary accent color                |
| `background`   | `#ffffff`               | Blog section background             |
| `surface`      | `#f8f8f8`               | Cards and sidebar background        |
| `text`         | `#0a0a0a`               | Primary text color                  |
| `muted`        | `#6b7280`               | Secondary text color                |
| `mutedLight`   | `#9ca3af`               | Subtle text color                   |
| `border`       | `#e5e7eb`               | Border color                        |
| `black`        | `#0a0a0a`               | Badge and title highlight           |
| `white`        | `#ffffff`               | Text on dark backgrounds            |
| `fontHeading`  | `Georgia, serif`        | Heading font                        |
| `fontBody`     | `system-ui, sans-serif` | Body font                           |
| `fontMono`     | `monospace`             | Monospace font                      |
| `fontDisplay`  | `Georgia, serif`        | Display/hero font                   |
| `containerMax` | `1200px`                | Max width of the blog container     |

---

### hero

| Property      | Default                | Description                     |
| :------------ | :--------------------- | :------------------------------ |
| `tagline`     | `Our Blog`             | Badge text above the title      |
| `titleLine1`  | `Latest`               | First line of the hero title    |
| `titleLine2`  | `Articles`             | Second line (highlighted)       |
| `description` | `Welcome to our blog.` | Paragraph below the title       |

---

### ui

| Property                 | Default            | Description                        |
| :----------------------- | :----------------- | :--------------------------------- |
| `readMoreLabel`          | `Read more →`      | Read more button label             |
| `btnPrev`                | `Previous`         | Previous page button label         |
| `btnNext`                | `Next`             | Next page button label             |
| `commentButtonColor`     | `var(--bk-accent)` | Comment submit button background   |
| `commentButtonTextColor` | `var(--bk-black)`  | Comment submit button text color   |
| `paginationStyle`        | `minimal`          | `minimal` or `numbered`            |
| `paginationBtnBg`        | `accent`           | PREV/NEXT button background        |
| `paginationBtnText`      | `black`            | PREV/NEXT button text color        |
| `paginationBtnHoverBg`   | `text`             | PREV/NEXT button hover background  |
| `paginationBtnHoverText` | `white`            | PREV/NEXT button hover text color  |
| `paginationActiveBg`     | `accent`           | Active page number background      |
| `paginationActiveText`   | `black`            | Active page number text color      |

---

## CSS Variables

All theme values are available globally with the `--bk-` prefix:

```css
var(--bk-accent)
var(--bk-background)
var(--bk-surface)
var(--bk-text)
var(--bk-muted)
var(--bk-muted-light)
var(--bk-border)
var(--bk-black)
var(--bk-white)
var(--bk-font-heading)
var(--bk-font-body)
var(--bk-font-mono)
var(--bk-font-display)
var(--bk-container-max)
var(--bk-pagination-btn-bg)
var(--bk-pagination-btn-text)
var(--bk-pagination-btn-hover-bg)
var(--bk-pagination-btn-hover-text)
var(--bk-pagination-active-bg)
var(--bk-pagination-active-text)
var(--bk-comment-btn-bg)
var(--bk-comment-btn-text)
```

---

## Layouts

| Layout      | Description                           |
| :---------- | :------------------------------------ |
| `magazine`  | Featured post + side grid             |
| `grid`      | 3-column card grid                    |
| `featured`  | Large hero image + grid below         |
| `cards`     | Image background with text overlay    |

---

## Components

### `<BlogList>`

```astro
---
import { BlogList } from 'astro-blog-kit/components';
---
<BlogList
  posts={posts}
  currentPage={1}
  totalPages={totalPages}
  basePath="/blog/page/"
  blogBase="/blog/"
  dateLocale="en-US"
  t={bt}
  locale="en"
  layout="magazine"
/>
```

### `<BlogPost>`

```astro
---
import { BlogPost } from 'astro-blog-kit/components';
---
<BlogPost post={post} t={t} lang="en" />
```

### `<Comments>`

```astro
---
import { Comments } from 'astro-blog-kit/components';
---
<Comments comments={comments} postId={post.id ?? 0} />
```

### `<CommentForm>`

```astro
---
import { CommentForm } from 'astro-blog-kit/components';
---
<CommentForm postId={post.id ?? 0} apiRoute="/api/comments" />
```

---

## Utils

### WordPress client

```ts
import { createWPClient } from 'astro-blog-kit/utils';

const wp = createWPClient('https://cms.yourdomain.com');

const { posts, total, totalPages } = await wp.getPosts({ perPage: 5, page: 1 });
const posts = await wp.getAllPosts();
const post = await wp.getPost('my-post-slug');
const comments = await wp.getComments(postId);
const categories = await wp.getCategories();
```

### i18n helpers

```ts
import { getLang, useTranslations, getBlogBase } from 'astro-blog-kit/utils';

const lang = getLang(Astro.url, import.meta.env.BASE_URL, config);
const t = useTranslations(lang, { en, es });
const blogBase = getBlogBase(lang, import.meta.env.BASE_URL, config);
```

### Static paths helpers

```ts
import { getStaticPathsForPosts, getStaticPathsForPages } from 'astro-blog-kit/utils';

export const getStaticPaths = () => getStaticPathsForPosts(posts);
export const getStaticPaths = () => getStaticPathsForPages(posts, { postsPerPage: 5 });
```

---

## Automatic deploys with GitHub Actions

Copy `node_modules/astro-blog-kit/examples/deploy-ftp.yml` to `.github/workflows/deploy.yml`.

Add these secrets to your GitHub repository (**Settings → Secrets**):

| Secret        | Description           |
| :------------ | :-------------------- |
| `FTP_HOST`    | Your server hostname  |
| `FTP_USERNAME`| FTP username          |
| `FTP_PASSWORD`| FTP password          |
| `WP_API_URL`  | Your WordPress URL    |

---

## i18n Support

```js
// astro.config.mjs
blogKit({
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
  },
})
```

With i18n enabled:
- Default locale: `/blog/my-post`
- Other locales: `/es/blog/my-post`

---

## Requirements

- Astro v4, v5, v6, or v7
- Node.js 18+
- WordPress with REST API enabled

---

## License

MIT