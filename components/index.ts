// ─────────────────────────────────────────────────────────────
// astro-blog-kit · components/index.ts
// Punto de entrada de todos los componentes.
// Importa desde: 'astro-blog-kit/components'
// ─────────────────────────────────────────────────────────────

export { default as BlogCard } from "./BlogCard.astro";
export { default as BlogList } from "./BlogList.astro";
export { default as BlogPost } from "./BlogPost.astro";
export { default as Pagination } from "./Pagination.astro";
export { default as Comments } from "./Comments.astro";
export { default as CommentForm } from "./CommentForm.astro";

export { MagazineLayout, GridLayout, ListLayout } from "./BlogList/index.ts";