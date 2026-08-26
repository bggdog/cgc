export type ServiceImage = {
  src: string;
  alt: string;
};

export type ServiceInclude = {
  title: string;
  body: string;
};

export type ServiceTitleWord = {
  text: string;
  /** Start a new line after this word */
  breakAfter?: boolean;
  /** Render with the Pinyon Script accent */
  script?: boolean;
};

export type ServicePageContent = {
  slug: string;
  /** Browser / SEO title */
  pageTitle: string;
  crumbName: string;
  titleWords: ServiceTitleWord[];
  titleAriaLabel: string;
  lede: string;
  chips: string[];
  frameTag: string;
  heroImage?: ServiceImage;
  bandHeadingBefore: string;
  bandHeadingScript: string;
  bandHeadingAfter: string;
  bandSub: string;
  includes: ServiceInclude[];
  wideTag?: string;
  wideImage?: ServiceImage;
  /** When false, the wide image band is omitted. Defaults to true. */
  showWideSection?: boolean;
  closeHeadingWords: ServiceTitleWord[];
  closeHeadingAriaLabel: string;
  closeSub: string;
  ctaHref: string;
  ctaLabel: string;
};
