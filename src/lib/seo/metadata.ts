import { Metadata } from "next";
import {
  getPageMetadataServer,
  getSiteSettingsServer,
} from "./firebase-server";
import { Service, Project } from "@/types/cms";
import {
  absoluteUrl,
  getSiteUrl,
  resolveOgImage,
  stripHtml,
  truncate,
} from "./config";
import {
  getProjectSlug,
  getServiceSlug,
} from "./firebase-server";

const STATIC_PATHS: Record<string, string> = {
  home: "/",
  about: "/about",
  services: "/services",
  portfolio: "/portfolio",
  contact: "/contact",
};

export async function generatePageMetadata(pageKey: string): Promise<Metadata> {
  const [meta, settings] = await Promise.all([
    getPageMetadataServer(pageKey),
    getSiteSettingsServer(),
  ]);

  const path = STATIC_PATHS[pageKey] ?? "/";
  const canonical = absoluteUrl(path, settings);
  const ogImage = resolveOgImage(meta.og_image, settings);

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonical,
      siteName: settings.site_name,
      images: [{ url: ogImage, alt: settings.site_name }],
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export async function generateServiceMetadata(
  service: Service
): Promise<Metadata> {
  const settings = await getSiteSettingsServer();
  const slug = getServiceSlug(service);
  const title = `${service.service_name} | ${settings.site_name}`;
  const description = truncate(
    stripHtml(service.service_description) ||
      `Explore ${service.service_name} services by ${settings.site_name}.`,
    160
  );
  const canonical = absoluteUrl(`/services/${slug}`, settings);
  const ogImage = resolveOgImage(service.service_image, settings);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: settings.site_name,
      images: [{ url: ogImage, alt: service.service_name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export async function generateProjectMetadata(
  project: Project
): Promise<Metadata> {
  const settings = await getSiteSettingsServer();
  const slug = getProjectSlug(project);
  const title = `${project.project_name} | ${settings.site_name}`;
  const description = truncate(
    project.project_description ||
      stripHtml(project.project_content) ||
      `View ${project.project_name} by ${settings.site_name}.`,
    160
  );
  const canonical = absoluteUrl(`/project/${slug}`, settings);
  const ogImage = resolveOgImage(project.project_image, settings);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: settings.site_name,
      images: [{ url: ogImage, alt: project.project_name }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export async function generateRootMetadata(): Promise<Metadata> {
  const [settings, homeMeta] = await Promise.all([
    getSiteSettingsServer(),
    getPageMetadataServer("home"),
  ]);
  const siteUrl = getSiteUrl(settings);
  const ogImage = resolveOgImage(homeMeta.og_image, settings);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: homeMeta.title,
      template: `%s`,
    },
    description: homeMeta.description,
    applicationName: settings.site_name,
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: siteUrl,
      siteName: settings.site_name,
      title: homeMeta.title,
      description: homeMeta.description,
      images: [{ url: ogImage, alt: settings.site_name }],
    },
    twitter: {
      card: "summary_large_image",
      title: homeMeta.title,
      description: homeMeta.description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}
