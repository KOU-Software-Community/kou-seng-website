import type { MetadataRoute } from "next";
import { promises as fs } from "node:fs";
import path from "node:path";

type TeamFileEntry = `${string}.json`;

type ApplicationEntry = {
  slug: string;
};

const DEFAULT_BASE_URL = "https://kouseng.com";

function getBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!envUrl) {
    return DEFAULT_BASE_URL;
  }

  return envUrl.replace(/\/+$/, "");
}

async function getTeamSlugs(): Promise<string[]> {
  const teamsDir = path.join(process.cwd(), "public", "data", "teams");

  try {
    const files = (await fs.readdir(teamsDir)) as TeamFileEntry[];

    return files.filter((file) => file.endsWith(".json")).map((file) => file.replace(".json", ""));
  } catch {
    return [];
  }
}

async function getApplicationSlugs(): Promise<string[]> {
  const applicationsPath = path.join(process.cwd(), "public", "data", "applications", "index.json");

  try {
    const fileContent = await fs.readFile(applicationsPath, "utf8");
    const applications = JSON.parse(fileContent) as ApplicationEntry[];

    return applications.map((application) => application.slug).filter(Boolean);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/publications`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/announcements`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/apply`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const [teamSlugs, applicationSlugs] = await Promise.all([getTeamSlugs(), getApplicationSlugs()]);

  const teamRoutes: MetadataRoute.Sitemap = teamSlugs.map((slug) => ({
    url: `${baseUrl}/technical-team/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const applicationRoutes: MetadataRoute.Sitemap = applicationSlugs.map((slug) => ({
    url: `${baseUrl}/apply/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...teamRoutes, ...applicationRoutes];
}
