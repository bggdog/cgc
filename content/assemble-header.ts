import { readFileSync } from "fs";
import path from "path";

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

const linkedInPath =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

const instagramPath =
  "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z";

const cornerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <path
                d="m100,0H0v100C0,44.77,44.77,0,100,0Z"
                fill="#F9F8F6"
              ></path>
            </svg>`;

const services = [
  { label: "Executive Consulting", href: "/services/executive-consulting" },
  { label: "Board Consulting", href: "/services/board-consulting" },
  { label: "Team Development &amp; Care", href: "/services/team-development-care" },
  { label: "Team Building Retreats", href: "/services/team-building-retreats" },
  {
    label: "Organizational Structure &amp; Setup",
    href: "/services/organizational-structure-setup",
  },
];

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
  return `<li class="social">
                <a href="#" aria-label="${label}"
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
  const servicesActive = currentPath.startsWith("/services/") ? "active" : "";

  const desktopSub = services
    .map(
      (s) => `<li>
                    ${link(s.href, s.label, currentPath)}
                  </li>`
    )
    .join("\n                  ");

  const mobileSub = services
    .map(
      (s) => `<li>
                        ${link(s.href, s.label, currentPath)}
                      </li>`
    )
    .join("\n                      ");

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
              ><span class="${ztActive || "  "}">Zero Turnover&trade;</span></a
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
            <a class="${contactActive}" href="/contact"
              ><span class="${contactActive || "  "}">Contact</span></a
            >
          </div>
        </li>
        ${socialIcon("linkedin", linkedInPath)}
        ${socialIcon("instagram", instagramPath)}
      </ul>
    </nav>
    <div class="Header_SocialsMobile__0QYKc">
      <ul class="Socials_Socials__hiU_j">
        ${socialIcon("linkedin", linkedInPath)}
        ${socialIcon("instagram", instagramPath)}
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
