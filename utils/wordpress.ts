// ─────────────────────────────────────────────────────────────
// astro-blog-kit · utils/wordpress.ts
// ─────────────────────────────────────────────────────────────


import type { BlogPost } from "../types";
import { normalizeWPPost } from "./collections";

export interface WPComment {
  id: number;
  parent: number;
  author_name: string;
  author_url?: string;
  date: string;
  content: { rendered: string };
  status: "approved" | "hold" | "spam" | "trash";
  author_avatar_urls?: Record<string, string>;
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  description?: string;
}

export interface WPTag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface FetchPostsOptions {
  perPage?: number;
  page?: number;
  lang?: string;
  categorySlug?: string;
  tag?: string;
  search?: string;
}

export interface SubmitCommentPayload {
  post: number;
  author_name: string;
  author_email: string;
  content: string;
  parent?: number;
}

export function createWPClient(baseUrl: string) {
  const api = baseUrl.replace(/\/$/, "") + "/wp-json/wp/v2";

  async function getPosts(options: FetchPostsOptions = {}): Promise<{
    posts: BlogPost[];
    total: number;
    totalPages: number;
  }> {
    const { perPage = 10, page = 1, lang, categorySlug, search } = options;

    const params = new URLSearchParams({
      _embed: "true",
      per_page: String(perPage),
      page: String(page),
      status: "publish",
    });

    if (lang) params.set("lang", lang);
    if (search) params.set("search", search);

    if (categorySlug) {
      const catId = await getCategoryIdBySlug(categorySlug);
      if (catId) params.set("categories", String(catId));
    }

    const response = await fetch(`${api}/posts?${params}`);
    if (!response.ok) {
      throw new Error(`WP API error: ${response.status} ${response.statusText}`);
    }

    const total = Number(response.headers.get("X-WP-Total") ?? 0);
    const totalPages = Number(response.headers.get("X-WP-TotalPages") ?? 1);
    const data = await response.json();

    return { posts: data.map(normalizeWPPost), total, totalPages };
  }

  async function getPost(slug: string): Promise<BlogPost | undefined> {
    const params = new URLSearchParams({
      _embed: "true",
      slug,
      status: "publish",
    });

    const response = await fetch(`${api}/posts?${params}`);
    if (!response.ok) {
      throw new Error(`WP API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return undefined;
    return normalizeWPPost(data[0]);
  }

  async function getAllPosts(lang?: string): Promise<BlogPost[]> {
    const firstPage = await getPosts({ perPage: 100, page: 1, lang });
    const allPosts = [...firstPage.posts];

    if (firstPage.totalPages > 1) {
      const rest = await Promise.all(
        Array.from({ length: firstPage.totalPages - 1 }, (_, i) =>
          getPosts({ perPage: 100, page: i + 2, lang })
        )
      );
      rest.forEach((r) => allPosts.push(...r.posts));
    }

    return allPosts;
  }

  async function getComments(postId: number): Promise<WPComment[]> {
    const params = new URLSearchParams({
      post: String(postId),
      per_page: "100",
      orderby: "date",
      order: "asc",
    });

    const response = await fetch(`${api}/comments?${params}`);
    if (!response.ok) {
      throw new Error(`WP API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async function getCategories(): Promise<WPCategory[]> {
    const response = await fetch(`${api}/categories?per_page=100&hide_empty=true`);
    if (!response.ok) {
      throw new Error(`WP API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async function getCategoryIdBySlug(slug: string): Promise<number | undefined> {
    const response = await fetch(`${api}/categories?slug=${slug}`);
    if (!response.ok) return undefined;
    const data = await response.json();
    return data[0]?.id;
  }

  async function getTags(): Promise<WPTag[]> {
    const response = await fetch(`${api}/tags?per_page=100&hide_empty=true`);
    if (!response.ok) {
      throw new Error(`WP API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  return { getPosts, getPost, getAllPosts, getComments, getCategories, getTags };
}