import { readFileSync } from "fs";
import path from "path";
import { assembleHeader } from "./assemble-header";
import type { ServiceImage, ServicePageContent, ServiceTitleWord } from "./services/types";

const contentDir = path.join(process.cwd(), "content", "services");

const cameraIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="15" rx="3"/><circle cx="12" cy="12.5" r="3.4"/><path d="M8.5 5 10 3h4l1.5 2"/></svg>`;

const arrowIcon = `<svg viewBox="0 0 24 24" fill="none"><path d="M4 12h15m0 0-6-6m6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderTitleWords(words: ServiceTitleWord[]): string {
  return words
    .map((word) => {
      const inner = word.script
        ? `<span class="script">${escapeHtml(word.text)}</span>`
        : escapeHtml(word.text);
      const br = word.breakAfter ? "<br/>" : "";
      return `<span class="w"><span>${inner}</span></span>${br}`;
    })
    .join("\n            ");
}

function renderFrameMedia(
  image: ServiceImage | undefined,
  placeholderLabel: string
): string {
  if (image) {
    return `<img class="real" src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" />`;
  }
  return `<div class="ph">
            <div class="tip">
              <span class="ic">${cameraIcon}</span>
              <p>${escapeHtml(placeholderLabel)}</p>
            </div>
          </div>`;
}

function renderCta(href: string, label: string): string {
  return `<a class="cta" href="${escapeHtml(href)}" data-magnetic>
            ${escapeHtml(label)}
            <span class="ring">${arrowIcon}</span>
          </a>`;
}

export function assembleServiceHtml(service: ServicePageContent): string {
  const styles = readFileSync(path.join(contentDir, "service-styles.css"), "utf8");
  const script = readFileSync(path.join(contentDir, "service-script.js"), "utf8");
  const header = assembleHeader(`/services/${service.slug}`);

  const chips = service.chips
    .map(
      (chip, i) =>
        `<span style="--i:${i}">${escapeHtml(chip)}</span>`
    )
    .join("\n            ");

  const includes = service.includes
    .map((item, i) => {
      const n = String(i + 1).padStart(2, "0");
      return `<div class="item" style="--i:${i}">
            <span class="n">${n}</span>
            <div><h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.body)}</p></div>
          </div>`;
    })
    .join("\n          ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(service.pageTitle)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Pinyon+Script&display=swap" rel="stylesheet">
<style>
${styles}
</style>
${header.styles}
</head>
<body class="cg-has-header">

${header.markup}

<main class="cg-service">

  <!-- ============ HERO ============ -->
  <section class="hero" data-reveal>
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a><span class="sep">·</span>
        <a href="/#services">Services</a><span class="sep">·</span>
        <span class="here">${escapeHtml(service.crumbName)}</span>
      </nav>

      <div class="hero-grid">
        <div>
          <p class="eyebrow">Our Services</p>
          <h1 aria-label="${escapeHtml(service.titleAriaLabel)}">
            ${renderTitleWords(service.titleWords)}
          </h1>
          <p class="lede">${escapeHtml(service.lede)}</p>
          <div class="chips">
            ${chips}
          </div>
          ${renderCta(service.ctaHref, service.ctaLabel)}
        </div>

        <div class="frame">
          ${renderFrameMedia(service.heroImage, "Service Imagery")}
          <span class="notch"><span class="tag">${escapeHtml(service.frameTag)}</span></span>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ WHAT'S INCLUDED ============ -->
  <section class="band">
    <div class="panel" data-reveal>
      <div class="cols">
        <div>
          <p class="eyebrow">What to Expect</p>
          <h2>${escapeHtml(service.bandHeadingBefore)} <span class="script">${escapeHtml(service.bandHeadingScript)}</span> ${escapeHtml(service.bandHeadingAfter)}</h2>
          <p class="sub">${escapeHtml(service.bandSub)}</p>
        </div>
        <div class="list">
          ${includes}
        </div>
      </div>
    </div>
  </section>

  <!-- ============ WIDE IMAGE ============ -->
  ${
    service.showWideSection !== false
      ? `<section class="wide" data-reveal>
    <div class="wrap">
      <div class="frame">
        ${renderFrameMedia(service.wideImage, "Wide Service Imagery")}
        ${service.wideTag ? `<span class="notch"><span class="tag">${escapeHtml(service.wideTag)}</span></span>` : ""}
      </div>
    </div>
  </section>`
      : ""
  }

  <!-- ============ CLOSING CTA ============ -->
  <section class="close">
    <div class="panel" data-reveal>
      <span class="whisper" aria-hidden="true">let's talk</span>
      <h2 aria-label="${escapeHtml(service.closeHeadingAriaLabel)}">
        ${renderTitleWords(service.closeHeadingWords)}
      </h2>
      <p class="sub">${escapeHtml(service.closeSub)}</p>
      ${renderCta(service.ctaHref, service.ctaLabel)}
      <a class="also" href="/#services">← Back to All Services</a>
    </div>
  </section>

</main>

<script>
${script}
</script>
${header.script}

</body>
</html>`;
}
