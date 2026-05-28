// export const prerender = false;

import type { APIRoute } from "astro";

const WP_API_URL = process.env.WP_API_URL ?? import.meta.env.WP_API_URL;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD ?? import.meta.env.WP_APP_PASSWORD;
const WP_APP_USER = process.env.WP_APP_USER ?? import.meta.env.WP_APP_USER;

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return new Response(JSON.stringify({ error: "Invalid content type" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: {
    post: number;
    author_name: string;
    author_email: string;
    content: string;
    parent?: number;
  };

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body.post || !body.author_name || !body.author_email || !body.content) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 422,
      headers: { "Content-Type": "application/json" },
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.author_email)) {
    return new Response(JSON.stringify({ error: "Invalid email" }), {
      status: 422,
      headers: { "Content-Type": "application/json" },
    });
  }

  const sanitizedContent = body.content
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, 5000);

  if (sanitizedContent.length === 0) {
    return new Response(JSON.stringify({ error: "Comment content is empty" }), {
      status: 422,
      headers: { "Content-Type": "application/json" },
    });
  }

  const wpPayload = {
    post: body.post,
    author_name: body.author_name.trim().slice(0, 245),
    author_email: body.author_email.trim(),
    content: sanitizedContent,
    parent: body.parent ?? 0,
  };

  try {
    const credentials = btoa(`${WP_APP_USER}:${WP_APP_PASSWORD}`);

    const wpResponse = await fetch(`${WP_API_URL}/wp-json/wp/v2/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${credentials}`,
      },
      body: JSON.stringify(wpPayload),
    });

    const wpData = await wpResponse.json();

    if (!wpResponse.ok) {
      console.error("WP API error:", wpData);
      return new Response(
        JSON.stringify({ error: "Failed to submit comment" }),
        {
          status: wpResponse.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Comment submitted and awaiting moderation",
        id: wpData.id,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });