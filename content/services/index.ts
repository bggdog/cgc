import { executiveConsulting } from "./executive-consulting";
import { organizationalStructureSetup } from "./organizational-structure-setup";
import { teamDevelopmentCare } from "./team-development-care";
import type { ServicePageContent } from "./types";

const services: ServicePageContent[] = [
  executiveConsulting,
  teamDevelopmentCare,
  organizationalStructureSetup,
];

export function getServiceBySlug(slug: string): ServicePageContent | undefined {
  return services.find((service) => service.slug === slug);
}

export function getAllServiceSlugs(): string[] {
  return services.map((service) => service.slug);
}

export type { ServicePageContent };
