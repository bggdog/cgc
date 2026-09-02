import { readFileSync } from "fs";
import path from "path";
import { assembleHeader } from "./assemble-header";
import { siteImageSrc } from "./site-images";
import { CONTACT_MAILTO } from "./site-links";

const contentDir = path.join(process.cwd(), "content", "zero-turnover");

const arrowIcon = `<svg viewBox="0 0 24 24" fill="none"><path d="M4 12h15m0 0-6-6m6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export function assembleZeroTurnoverHtml(): string {
  const styles = readFileSync(path.join(contentDir, "zt-styles.css"), "utf8");
  const script = readFileSync(path.join(contentDir, "zt-script.js"), "utf8");
  const header = assembleHeader("/zero-turnover");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Zero Turnover. Zero Burnout.™ — Carrie Grace</title>
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

<main class="cg-zt">

  <!-- ============ HERO ============ -->
  <section class="hero">
    <div class="stage" data-reveal>
      <img class="vid" src="${siteImageSrc("team-development-care")}" alt="" aria-hidden="true" />
      <div class="scrim" aria-hidden="true"></div>
      <div class="glow" aria-hidden="true"></div>

      <span class="seal" aria-hidden="true">
        <span class="disc"><span>ZT</span></span>
        <svg viewBox="0 0 124 124" data-seal>
          <defs><path id="zt-ring" d="M62,62 m-54,0 a54,54 0 1,1 108,0 a54,54 0 1,1 -108,0"/></defs>
          <text><textPath href="#zt-ring">Signature Program · Zero Turnover · Zero Burnout ·</textPath></text>
        </svg>
      </span>

      <div class="hero-inner">
        <nav class="crumbs" aria-label="Breadcrumb">
          <a href="/">Home</a><span class="sep">·</span>
          <a href="/#programs">Programs</a><span class="sep">·</span>
          <span class="here">Zero Turnover™</span>
        </nav>

        <h1 aria-label="Zero Turnover. Zero Burnout.™">
          <span class="w"><span>Zero</span></span>
          <span class="w"><span>Turnover.</span></span><br/>
          <span class="w"><span class="gold">Zero</span></span>
          <span class="w"><span class="gold">Burnout.<span class="tm">™</span></span></span>
        </h1>

        <p class="hero-lede">The nonprofit sector loses extraordinary people every year — not because the mission fails, but because the culture does. This program was built to change that permanently. <strong>We don't patch the problem. We rebuild the foundation.</strong></p>

        <div class="hero-ctas">
          <a class="cta" href="${CONTACT_MAILTO}" data-magnetic>
            Inquire About This Program
            <span class="ring">${arrowIcon}</span>
          </a>
          <a class="ghost-link" href="#pillars">
            How It Works
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 4v15m0 0-6-6m6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ PROOF STRIP ============ -->
  <section class="proof" data-reveal>
    <div class="wrap">
      <div class="grid">
        <div class="stat hero-stat" style="--i:0">
          <div class="num"><span data-count data-from="70" data-to="0">70</span><span class="u">%</span></div>
          <p>turnover the year after one partner ran the program — down from 70%</p>
          <span class="rule"></span>
        </div>
        <div class="stat" style="--i:1">
          <div class="num"><span data-count data-from="0" data-to="100">0</span><span class="u">%</span></div>
          <p>of their staff retained the following year</p>
          <span class="rule"></span>
        </div>
        <div class="stat" style="--i:2">
          <div class="num">1<span class="u">st</span></div>
          <p>to implement emergency housing in Texas</p>
          <span class="rule"></span>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ PILLARS ============ -->
  <section class="pillars" id="pillars">
    <div class="panel" data-reveal>
      <div class="inner">
        <p class="eyebrow">The Four Pillars</p>
        <h2 aria-label="We rebuild the foundation">
          <span class="w"><span>We</span></span>
          <span class="w"><span>rebuild</span></span>
          <span class="w"><span>the</span></span>
          <span class="w"><span class="script">foundation</span></span>
        </h2>

        <div class="pgrid">
          <article class="pillar p1" style="--i:0">
            <span class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21v-8"/><path d="M12 13c0-3.5-2.6-6-6.5-6C5.5 10.5 8 13 12 13Z"/><path d="M12 10c0-3.2 2.4-5.5 6-5.5 0 3.2-2.4 5.5-6 5.5Z"/></svg></span>
            <h3>Cultural Roots</h3>
            <p>Assess and redesign the underlying culture that determines whether people stay or go.</p>
            <span class="notch"><span class="idx">01</span></span>
          </article>
          <article class="pillar p2" style="--i:1">
            <span class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M5 21h14"/><path d="M4 7h16"/><path d="M6.5 7 4 12.5a2.6 2.6 0 0 0 5 0L6.5 7ZM17.5 7 15 12.5a2.6 2.6 0 0 0 5 0L17.5 7Z"/></svg></span>
            <h3>Structural Balance</h3>
            <p>Align roles, workloads, and leadership structures with sustainable human capacity.</p>
            <span class="notch"><span class="idx">02</span></span>
          </article>
          <article class="pillar p3" style="--i:2">
            <span class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9.3c1-2.3 4.6-2.2 5.2.4.5 2.2-2.4 4.5-5.2 6.3-2.8-1.8-5.7-4.1-5.2-6.3.6-2.6 4.2-2.7 5.2-.4Z"/><path d="M3.5 19c2.5 1.6 5.4 2 8.5 2s6-.4 8.5-2"/></svg></span>
            <h3>Care Frameworks</h3>
            <p>Embed care into management practices — not as a perk, but as an operating standard.</p>
            <span class="notch"><span class="idx">03</span></span>
          </article>
          <article class="pillar p4" style="--i:3">
            <span class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-7"/><path d="M15 6.5 21 3v4"/><path d="M21 3l-5.5 5"/></svg></span>
            <h3>Retention Metrics</h3>
            <p>Measure what matters and hold your organization accountable to the standards you set.</p>
            <span class="notch"><span class="idx">04</span></span>
          </article>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ PULL QUOTE ============ -->
  <section class="quote" data-reveal>
    <div class="qcard">
      <span class="qglyph" aria-hidden="true">&ldquo;</span>
      <blockquote>We had a 70% annual turnover rate in our survivor services program. After Carrie worked with our team, we retained every single staff member the following year. I didn't think that was possible in this sector.</blockquote>
      <p class="qwho"><span><b>Program Director</b><span>Anti-Trafficking Organization</span></span></p>
    </div>
  </section>

  <!-- ============ CLOSE ============ -->
  <section class="close">
    <div class="cpanel" data-reveal>
      <span class="zero" aria-hidden="true" data-parallax="-0.05" data-rotate="0.006">0</span>
      <span class="whisper" aria-hidden="true">for good.</span>
      <h2 aria-label="Make turnover history.">
        <span class="w"><span>Make</span></span>
        <span class="w"><span>turnover</span></span>
        <span class="w"><span class="script">history.</span></span>
      </h2>
      <p class="sub">A comprehensive, proven approach to eliminating staff burnout and turnover in mission-driven organizations — for good.</p>
          <a class="cta" href="${CONTACT_MAILTO}" data-magnetic>
        Inquire About This Program
        <span class="ring">${arrowIcon}</span>
      </a>
      <br/>
      <a class="ghost-link" href="/#process">
        See How We Work
        ${arrowIcon}
      </a>
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
