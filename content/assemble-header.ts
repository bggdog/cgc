import { readFileSync } from "fs";
import path from "path";
import { escapeHtml } from "./escape-html";
import { INSTAGRAM_ICON_PATH, LINKEDIN_ICON_PATH } from "./social-icons";
import { INSTAGRAM_URL, LINKEDIN_URL } from "./site-links";
import { SERVICE_NAV_ITEMS } from "./site-nav";

const contentDir = path.join(process.cwd(), "content", "header");

const chevronSvg = `<svg
                      width="20"
                      height="30"
                      viewBox="0 0 20 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.4481 3.525L7.99812 15L19.4481 26.475L15.9231 30L0.92312 15L15.9231 1.59918e-06L19.4481 3.525Z"
                        fill="white"
                      ></path>
                    </svg>`;

const cornerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <path
                d="m100,0H0v100C0,44.77,44.77,0,100,0Z"
                fill="#F9F8F6"
              ></path>
            </svg>`;

function activeClass(href: string, currentPath: string): string {
  if (href === currentPath) return "active";
  if (href.startsWith("/services/") && currentPath.startsWith("/services/")) {
    return href === currentPath ? "active" : "";
  }
  return "";
}

function link(href: string, label: string, currentPath: string): string {
  const cls = activeClass(href, currentPath);
  const classAttr = cls ? ` class="${cls}"` : ` class=""`;
  const spanClass = cls ? ` class="${cls}"` : ` class="  "`;
  return `<a${classAttr} href="${href}"><span${spanClass}>${label}</span></a>`;
}

function socialIcon(label: string, pathD: string): string {
  const href = label === "linkedin" ? LINKEDIN_URL : INSTAGRAM_URL;
  return `<li class="social">
                <a href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label}"
                  ><svg
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>${label === "linkedin" ? "LinkedIn" : "Instagram"}</title>
                    <path d="${pathD}"></path></svg
                ></a>
              </li>`;
}

/** Shared CoLabs-style header for subpages (About, Contact, services). */
export function assembleHeader(currentPath: string): {
  styles: string;
  markup: string;
  script: string;
} {
  const css = readFileSync(path.join(contentDir, "header-styles.css"), "utf8");
  const js = readFileSync(path.join(contentDir, "header-script.js"), "utf8");

  const homeActive = currentPath === "/" ? "active" : "";
  const ztActive = currentPath === "/zero-turnover" ? "active" : "";
  const aboutActive = currentPath === "/about" ? "active" : "";
  const contactActive = currentPath === "/contact" ? "active" : "";
  const universityActive = currentPath.startsWith("/university") ? "active" : "";
  const servicesActive = currentPath.startsWith("/services/") ? "active" : "";

  // SERVICE_NAV_ITEMS holds raw labels (they contain "&"); escape them here,
  // at the HTML call site. The React header interpolates the same raw labels
  // into JSX, which escapes them itself.
  const desktopSub = SERVICE_NAV_ITEMS.map(
    (s) => `<li>
                    ${link(s.href, escapeHtml(s.label), currentPath)}
                  </li>`
  ).join("\n                  ");

  const mobileSub = SERVICE_NAV_ITEMS.map(
    (s) => `<li>
                        ${link(s.href, escapeHtml(s.label), currentPath)}
                      </li>`
  ).join("\n                      ");

  const markup = `<header class="Header_Header__RCJxb">
  <div class="ProgressBar_Progress__pez_8">
    <div class="ProgressBar_BarBg__IBGkG"></div>
    <div class="ProgressBar_Bar__lPLis" style="width: 0%"></div>
  </div>
  <div class="container Header_Cont__oIO12">
    <div class="Header_Logo__PrV_s">
      ${cornerSvg}<a class="${homeActive || ""}" href="/"
        ><span class="${homeActive || "  "}"
          ><img
            class="cg-logo"
            src="/cg-typeface.png"
            alt="Carrie Grace" /></span></a
      >${cornerSvg}
    </div>
    <div class="Header_MenuButton__3xFfC">Menu</div>
    <nav class="Menu_Menu___Nwdq" data-lenis-prevent="true">
      <ul>
        <li>
          <div class="Menu_Top___JOpe">
            <a class="${homeActive}" href="/"
              ><span class="${homeActive || "  "}">Home</span></a
            >
          </div>
        </li>
        <li>
          <div class="Menu_Top___JOpe">
            <a class="${servicesActive}" href="/#services"
              ><span class="${servicesActive || "  "}">Services</span></a
            ><button
              class="Menu_Chevron__vHOgg"
              aria-label="Toggle Submenu"
              type="button"
            >
              ${chevronSvg}
            </button>
          </div>
          <ul class="Menu_Submenu___nIdT">
                  ${desktopSub}
          </ul>
          <div class="SmoothOpen_SmoothOpen__1J7VQ">
            <div>
              <ul class="Menu_MobileSubmenu__u1our">
                      ${mobileSub}
              </ul>
            </div>
          </div>
        </li>
        <li>
          <div class="Menu_Top___JOpe">
            <a class="${ztActive}" href="/zero-turnover"
              ><span class="${ztActive || "  "}">Zero Turnover</span></a
            >
          </div>
        </li>
        <li>
          <div class="Menu_Top___JOpe">
            <a class="${aboutActive}" href="/about"
              ><span class="${aboutActive || "  "}">About</span></a
            >
          </div>
        </li>
        <li>
          <div class="Menu_Top___JOpe">
            <a class="${universityActive}" href="/university"
              ><span class="${universityActive || "  "}">University</span></a
            >
          </div>
        </li>
        <li>
          <div class="Menu_Top___JOpe">
            <a class="${contactActive}" href="/contact"
              ><span class="${contactActive || "  "}">Contact</span></a
            >
          </div>
        </li>
        ${socialIcon("linkedin", LINKEDIN_ICON_PATH)}
        ${socialIcon("instagram", INSTAGRAM_ICON_PATH)}
      </ul>
    </nav>
    <div class="Header_SocialsMobile__0QYKc">
      <ul class="Socials_Socials__hiU_j">
        ${socialIcon("linkedin", LINKEDIN_ICON_PATH)}
        ${socialIcon("instagram", INSTAGRAM_ICON_PATH)}
      </ul>
      ${cornerSvg}
    </div>
  </div>
</header>`;

  return {
    styles: `<style>\n${css}\n</style>`,
    markup,
    script: `<script>\n${js}\n</script>`,
  };
}
