import { assembleAboutHtml } from "@/content/assemble-about-html";

export async function GET() {
  const html = assembleAboutHtml();
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
