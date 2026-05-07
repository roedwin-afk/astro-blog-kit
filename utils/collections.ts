// ─────────────────────────────────────────────────────────────
// astro-blog-kit · utils/collections.ts
// Normalización de datos y helpers de filtrado/ordenamiento.
// Enfocado en WordPress como fuente principal.
// ─────────────────────────────────────────────────────────────

import type { BlogPost, BlogKitConfig } from "../types";

// ── Normalización WordPress → BlogPost ────────────────────────

/**
 * Normaliza un post de la WordPress REST API al formato BlogPost.
 *
 * @example
 * const response = await fetch('/wp-json/wp/v2/posts?_embed');
 * const wpPosts = await response.json();
 * const posts = wpPosts.map(normalizeWPPost);
 */
export function normalizeWPPost(wpPost: Record<string, any>): BlogPost {
  return {
    slug: wpPost.slug,
    date: wpPost.date,
    modified: wpPost.modified,
    title: {
      rendered: wpPost.title?.rendered ?? "",
    },
    excerpt: {
      rendered: wpPost.excerpt?.rendered ?? "",
    },
    content: {
      rendered: wpPost.content?.rendered ?? "",
    },
    _embedded: wpPost._embedded,
    lang: wpPost.lang,
    tags: wpPost._embedded?.["wp:term"]?.[0]?.map(
      (t: { name: string }) => t.name
    ),
  };
}

// ── Filtros y ordenamiento ────────────────────────────────────

/**
 * Ordena posts por fecha descendente (más reciente primero).
 */
export function sortPostsByDate(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Filtra posts por locale.
 * Si el post no tiene lang definido, se incluye en todos los locales.
 *
 * @example
 * filterPostsByLang(posts, 'es') // posts en español + posts sin lang
 */
export function filterPostsByLang(
  posts: BlogPost[],
  lang: string
): BlogPost[] {
  return posts.filter((post) => !post.lang || post.lang === lang);
}

/**
 * Aplica filtros según la config y ordena por fecha:
 * - Filtra por lang si i18n está activo
 * - Ordena por fecha descendente
 *
 * @example
 * const posts = preparePosts(allPosts, 'es', config);
 */
export function preparePosts(
  posts: BlogPost[],
  lang?: string,
  config?: BlogKitConfig
): BlogPost[] {
  let result = [...posts];

  if (lang && config?.i18n) {
    result = filterPostsByLang(result, lang);
  }

  return sortPostsByDate(result);
}