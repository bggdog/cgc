import { readFileSync } from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "content");

export function assembleHomeHtml(): string {
  const head = readFileSync(
    path.join(contentDir, "colabs-home-head.html"),
    "utf8"
  );
  const body = readFileSync(
    path.join(contentDir, "colabs-home-body.html"),
    "utf8"
  );
  const nextData = readFileSync(
    path.join(contentDir, "colabs-next-data.json"),
    "utf8"
  ).trim();

  return `<!DOCTYPE html>
<html lang="en">
<head>
${head}
</head>
<body>
<div id="__next">
${body}
</div>
<script id="__NEXT_DATA__" type="application/json">${nextData}</script>
</body>
</html>`;
}
