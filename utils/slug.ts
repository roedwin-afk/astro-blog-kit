// ─────────────────────────────────────────────────────────────
// astro-blog-kit · utils/slug.ts
// ─────────────────────────────────────────────────────────────

import type { BlogPost, BlogKitConfig, PageStaticPath, PostStaticPath } from "../types";

// ── getStaticPaths para posts individuales ────────────────────

/**
 * Genera el array para getStaticPaths en [...slug].astro
 *
 * @example
 * export const getStaticPaths = () => getStaticPathsForPosts(MOCK_POSTS);
 */
export function getStaticPathsForPosts(
  posts: BlogPost[]
): PostStaticPath[] {
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

// ── getStaticPaths para páginas de listado ────────────────────

/**
 * Genera el array para getStaticPaths en [page].astro
 *
 * @example
 * export const getStaticPaths = () =>
 *   getStaticPathsForPages(MOCK_POSTS, { postsPerPage: 5 });
 */
export function getStaticPathsForPages(
  allPosts: BlogPost[],
  options: { postsPerPage?: number; config?: BlogKitConfig } = {}
): PageStaticPath[] {
  const postsPerPage =
    options.postsPerPage ?? options.config?.postsPerPage ?? 5;

  const totalPages = Math.ceil(allPosts.length / postsPerPage);

  return Array.from({ length: totalPages }, (_, i) => {
    const pageNumber = i + 1;
    const start = i * postsPerPage;
    const end = start + postsPerPage;

    return {
      params: { page: String(pageNumber) },
      props: {
        posts: allPosts.slice(start, end),
        currentPage: pageNumber,
        totalPages,
      },
    };
  });
}

// ── Utilidades ────────────────────────────────────────────────

/**
 * Sanitiza un string para usarlo como slug URL-safe.
 *
 * @example
 * toSlug("¡Hola Mundo!") // → "hola-mundo"
 */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Calcula el tiempo de lectura estimado de un contenido HTML o texto plano.
 *
 * @param content - HTML o texto del post
 * @param wordsPerMinute - @default 200
 */
export function estimateReadingTime(
  content: string,
  wordsPerMinute = 200
): number {
  const plainText = content.replace(/<[^>]*>/g, " ");
  const wordCount = plainText
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Extrae la URL de la imagen destacada de un post.
 * Compatible con WordPress (_embedded) y Content Collections (heroImage).
 */
export function getFeaturedImageUrl(post: BlogPost): string | undefined {
  return (
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
    post.heroImage ??
    undefined
  );
}