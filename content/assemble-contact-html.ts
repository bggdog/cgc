import { readFileSync } from "fs";
import path from "path";
import { assembleHeader } from "./assemble-header";
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  INSTAGRAM_URL,
  LINKEDIN_URL,
} from "./site-links";

const contentDir = path.join(process.cwd(), "content", "contact");

const arrowIcon = `<svg viewBox="0 0 24 24" fill="none"><path d="M4 12h15m0 0-6-6m6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const linkedInIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.09h4.56V23H.22V8.09zM8.34 8.09h4.37v2.04h.06c.61-1.15 2.1-2.37 4.32-2.37 4.62 0 5.47 3.04 5.47 6.99V23h-4.55v-7.28c0-1.74-.03-3.97-2.42-3.97-2.42 0-2.79 1.89-2.79 3.84V23H8.34V8.09z"/></svg>`;

const instagramIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.4"/><circle cx="17.6" cy="6.4" r="1.15" fill="currentColor" stroke="none"/></svg>`;

export function assembleContactHtml(): string {
  const styles = readFileSync(path.join(contentDir, "contact-styles.css"), "utf8");
  const script = readFileSync(path.join(contentDir, "contact-script.js"), "utf8");
  const header = assembleHeader("/contact");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Contact — Carrie Grace</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Pinyon+Script&display=swap" rel="stylesheet">
<style>
${styles}
</style>
${header.styles}
</head>
<body class="cg-has-header">

${header.markup}

<main class="cg-contact">
  <div class="wrap" data-reveal>

    <div class="intro">
      <p class="eyebrow">Contact</p>
      <h1 aria-label="Start the Conversation">
        <span class="w"><span>Start</span></span>
        <span class="w"><span>the</span></span><br/>
        <span class="w"><span class="script">Conversation</span></span>
      </h1>
      <p class="lede">No pitch, no pressure — just a conversation about where your organization is and where you'd like it to be.</p>

      <div class="meta">
        <div>
          <h4>Email</h4>
          <a class="email" href="${CONTACT_MAILTO}">${CONTACT_EMAIL}</a>
        </div>
        <div>
          <h4>Based</h4>
          <p class="loc">Serving nonprofits nationwide</p>
        </div>
        <div>
          <h4>Follow</h4>
          <div class="socials">
            <a href="${LINKEDIN_URL}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">${linkedInIcon}</a>
            <a href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">${instagramIcon}</a>
          </div>
        </div>
      </div>
    </div>

    <form class="card" id="cg-contact-form" novalidate>
      <div class="two">
        <div class="field">
          <label for="cg-name">Name</label>
          <input id="cg-name" name="name" type="text" placeholder="Your name" autocomplete="name" required />
        </div>
        <div class="field">
          <label for="cg-email">Email</label>
          <input id="cg-email" name="email" type="email" placeholder="you@organization.org" autocomplete="email" required />
        </div>
      </div>
      <div class="field">
        <label for="cg-org">Organization</label>
        <input id="cg-org" name="organization" type="text" placeholder="Your nonprofit" autocomplete="organization" />
      </div>
      <div class="field">
        <label for="cg-msg">How can we help?</label>
        <textarea id="cg-msg" name="message" placeholder="Tell us a little about your organization and what you're navigating..." required></textarea>
      </div>
      <button class="submit" type="submit">
        Send Message
        <span class="ring">${arrowIcon}</span>
      </button>
      <p class="status" id="cg-contact-status" role="status" aria-live="polite"></p>
      <p class="fine">We typically respond within two business days.</p>
    </form>

  </div>
</main>

<script>
${script}
</script>
${header.script}

</body>
</html>`;
}
