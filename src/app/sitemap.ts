import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/caseStudies";
import { SITE_URL } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/resume`, changeFrequency: "monthly", priority: 0.9 },
    ...caseStudies.map((cs) => ({ url: `${SITE_URL}/case-studies/${cs.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
