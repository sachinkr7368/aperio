import type { MetadataRoute } from "next";

const BASE = "https://aperio-nine.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/playground",
    "/demo",
    "/docs",
    "/publish",
    "/lint",
    "/mock",
    "/compare",
    "/catalog",
    "/pricing",
  ];

  const now = new Date();

  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/docs" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/publish" || path === "/playground" ? 0.9 : 0.7,
  }));
}
