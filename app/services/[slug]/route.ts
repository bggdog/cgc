import { assembleServiceHtml } from "@/content/assemble-service-html";
import { getServiceBySlug } from "@/content/services";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  if (slug === "board-consulting") {
    return Response.redirect(
      new URL("/services/executive-consulting", request.url),
      301
    );
  }

  if (slug === "team-building-retreats") {
    return Response.redirect(
      new URL("/services/team-development-care", request.url),
      301
    );
  }

  const service = getServiceBySlug(slug);

  if (!service) {
    return new Response("Not Found", { status: 404 });
  }

  const html = assembleServiceHtml(service);
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
