import { assembleHomeHtml } from "@/content/assemble-home-html";

export async function GET() {
  const html = assembleHomeHtml();
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
