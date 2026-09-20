import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { committees } from "@/config/committees";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/conference",
    "/register",
    "/committees",
    "/faq",
    "/contact",
    "/terms",
    "/privacy",
  ];

  const routes: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }));

  for (const committee of committees) {
    routes.push({ url: `${site.url}/committees/${committee.id}`, lastModified: new Date() });
  }

  return routes;
}
