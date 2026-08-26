export const SITE_IMAGE_FILES = {
  hero: "Hero image.JPG",
  "about-1": "About image 1.JPG",
  "about-2": "About image 2.JPG",
  "about-3": "about image 3.JPG",
  "about-4": "about image 4.JPG",
  "about-5": "about image 5.JPG",
  "executive-consulting": "Executive consulting image.JPG",
  "board-consulting": "P1022446.JPG",
  "organizational-structure-setup":
    "Organizational structure and setup image.JPG",
  "team-building-retreats": "Team building retreats image.JPG",
  "team-development-care": "team development and care image.JPG",
  "resource-refresh": "Refresh - Personal Growth & Empowerment.JPG",
  "resource-resilient":
    "Resilient - A Compassionate Response to Trauma.JPG",
  "resource-rest": "Rest - Survivor Stabilization & Safe House Guide.JPG",
  "resource-reimagine":
    "Reimagine Dreams & Visions - A Dreams & Visions Guided Journal.jpg",
} as const;

export type SiteImageKey = keyof typeof SITE_IMAGE_FILES;

export function siteImageSrc(key: SiteImageKey): string {
  return `/media/${key}`;
}
