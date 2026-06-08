import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/config";
import {
  fetchProjectsServer,
  fetchServicesServer,
  getProjectSlug,
  getServiceSlug,
  getSiteSettingsServer,
} from "@/lib/seo/firebase-server";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, services, projects] = await Promise.all([
    getSiteSettingsServer(),
    fetchServicesServer(),
    fetchProjectsServer(),
  ]);

  const base = getSiteUrl(settings);
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/portfolio`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${base}/services/${getServiceSlug(service)}`,
    lastModified: service.service_created_at
      ? new Date(service.service_created_at)
      : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${base}/project/${getProjectSlug(project)}`,
    lastModified: project.project_created_at
      ? new Date(project.project_created_at)
      : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes];
}
