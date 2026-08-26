import { readFile } from "fs/promises";
import path from "path";
import {
  SITE_IMAGE_FILES,
  type SiteImageKey,
} from "@/content/site-images";

function isSiteImageKey(key: string): key is SiteImageKey {
  return key in SITE_IMAGE_FILES;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ key: string }> }
) {
  const { key } = await context.params;

  if (!isSiteImageKey(key)) {
    return new Response("Not Found", { status: 404 });
  }

  const filePath = path.join(
    process.cwd(),
    "content",
    "images",
    SITE_IMAGE_FILES[key]
  );

  try {
    const body = await readFile(filePath);
    return new Response(body, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}
