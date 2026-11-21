import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/caseStudies";
import { SITE_URL } from "@/data/site";

// Built with the site, so lastModified is the deploy date
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/resume`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    ...caseStudies.map((cs) => ({ url: `${SITE_URL}/case-studies/${cs.slug}`, lastModified, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
