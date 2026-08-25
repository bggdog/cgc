import { readFileSync } from "fs";
import path from "path";
import { assembleHeader } from "./assemble-header";

const contentDir = path.join(process.cwd(), "content", "about");

const cameraIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="15" rx="3"/><circle cx="12" cy="12.5" r="3.4"/><path d="M8.5 5 10 3h4l1.5 2"/></svg>`;

const arrowIcon = `<svg viewBox="0 0 24 24" fill="none"><path d="M4 12h15m0 0-6-6m6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function photoPlaceholder(label: string): string {
  return `<div class="ph"><div class="tip">
            <span class="ic">${cameraIcon}</span>
            <p>${label}</p>
          </div></div>`;
}

export function assembleAboutHtml(): string {
  const styles = readFileSync(path.join(contentDir, "about-styles.css"), "utf8");
  const script = readFileSync(path.join(contentDir, "about-script.js"), "utf8");
  const header = assembleHeader("/about");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>About Carrie — Carrie Grace</title>
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

<main class="cg-about">

  <!-- ============ HERO ============ -->
  <section class="hero" data-reveal>
    <div class="wrap">
      <p class="eyebrow">About Carrie</p>
      <h1 aria-label="Where Mission Meets Excellence">
        <span class="w"><span>Where</span></span>
        <span class="w"><span>Mission</span></span>
        <span class="w"><span>Meets</span></span><br/>
        <span class="w"><span class="script">Excellence</span></span>
      </h1>
      <p class="lede">Carrie Grace has spent her career at the intersection of nonprofit leadership, trauma-informed care, and organizational health. As a recognized expert in anti-human trafficking — including survivor aftercare program development — she brings <strong>rare, hard-won insight</strong> to the organizations doing the most difficult work in the world.</p>
      <div class="pills">
        <span class="pill" style="--i:0">Anti-Trafficking Specialist</span>
        <span class="pill" style="--i:1">Executive Coach</span>
        <span class="pill" style="--i:2">Aftercare Program Expert</span>
      </div>
    </div>
  </section>

  <!-- ============ BENTO GALLERY ============ -->
  <section class="gallery" data-reveal>
    <div class="wrap">
      <div class="bento">

        <div class="tile t1" style="--i:0">
          ${photoPlaceholder("Portrait")}
          <span class="notch"><span class="tag">Carrie Grace</span></span>
        </div>

        <div class="tile t2" style="--i:1">
          ${photoPlaceholder("Speaking")}
        </div>

        <div class="tile t3 accent" style="--i:2" aria-label="First to implement a safehouse model in the US">
          <div class="first">
            <b>1st</b>
            <span>To implement a safehouse model in the US</span>
            <span class="dots" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          </div>
        </div>

        <div class="tile t4 accent" style="--i:3" aria-label="Hundreds of aftercare providers trained">
          <b>100s</b>
          <span>of aftercare providers trained nationwide</span>
          <span class="dashes" aria-hidden="true"><i></i><i></i><i></i></span>
        </div>

        <div class="tile t5" style="--i:4">
          ${photoPlaceholder("With Teams")}
        </div>

        <div class="tile t6" style="--i:5">
          ${photoPlaceholder("In the Field")}
        </div>

        <div class="tile t7" style="--i:6">
          ${photoPlaceholder("Retreats &amp; Workshops")}
          <span class="notch"><span class="tag">The Work in Motion</span></span>
        </div>

      </div>
    </div>
  </section>

  <!-- ============ STATEMENT BAND ============ -->
  <section class="band">
    <div class="panel" data-reveal>
      <span class="whisper" aria-hidden="true">her story</span>
      <div class="inner">
        <p class="statement" data-illuminate>Her consulting doesn't just solve today's problems. It equips your leadership, strengthens your structure, and builds a culture your people will choose to stay in — year after year.</p>
        <div class="side">
          <p>From frontline anti-trafficking work to the boardroom, Carrie brings both depth of experience and genuine care to every engagement.</p>
          <a class="cta" href="mailto:hello@carriegrace.consulting" data-magnetic>
            Meet Carrie — Book a Call
            <span class="ring">${arrowIcon}</span>
          </a>
        </div>
      </div>
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
