import { assembleZeroTurnoverHtml } from "@/content/assemble-zero-turnover-html";

export async function GET() {
  const html = assembleZeroTurnoverHtml();
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
