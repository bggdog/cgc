import { assembleContactHtml } from "@/content/assemble-contact-html";

export async function GET() {
  const html = assembleContactHtml();
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
