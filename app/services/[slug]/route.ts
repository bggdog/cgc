import { assembleServiceHtml } from "@/content/assemble-service-html";
import { getServiceBySlug } from "@/content/services";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return new Response("Not Found", { status: 404 });
  }

  const html = assembleServiceHtml(service);
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
