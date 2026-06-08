import { DEFAULT_PAGE_METADATA } from "@/lib/cms/defaults";
import {
  fetchProjectsServer,
  fetchServicesServer,
  getPageMetadataServer,
  getProjectSlug,
  getServiceSlug,
  getSiteSettingsServer,
} from "./firebase-server";
import { getSiteUrl, stripHtml } from "./config";

export type AuditSeverity = "error" | "warning" | "info";

export interface AuditIssue {
  id: string;
  severity: AuditSeverity;
  category: string;
  message: string;
  fix?: string;
  path?: string;
}

export interface SeoAuditResult {
  score: number;
  issues: AuditIssue[];
  summary: {
    errors: number;
    warnings: number;
    info: number;
    pagesInSitemap: number;
  };
  checkedAt: string;
}

function titleIssue(
  id: string,
  category: string,
  title: string,
  path: string
): AuditIssue[] {
  const issues: AuditIssue[] = [];
  if (!title?.trim()) {
    issues.push({
      id,
      severity: "error",
      category,
      message: "Missing page title",
      fix: "Add a title in Site Settings → Page SEO",
      path,
    });
  } else if (title.length > 60) {
    issues.push({
      id: `${id}-title-long`,
      severity: "warning",
      category,
      message: `Title is ${title.length} characters (recommended ≤ 60)`,
      fix: "Shorten the title for better search display",
      path,
    });
  }
  return issues;
}

function descriptionIssue(
  id: string,
  category: string,
  description: string,
  path: string
): AuditIssue[] {
  const issues: AuditIssue[] = [];
  if (!description?.trim()) {
    issues.push({
      id: `${id}-desc`,
      severity: "error",
      category,
      message: "Missing meta description",
      fix: "Add a description in Site Settings → Page SEO",
      path,
    });
  } else if (description.length < 50) {
    issues.push({
      id: `${id}-desc-short`,
      severity: "warning",
      category,
      message: `Description is only ${description.length} characters (recommended 50–160)`,
      path,
    });
  } else if (description.length > 160) {
    issues.push({
      id: `${id}-desc-long`,
      severity: "warning",
      category,
      message: `Description is ${description.length} characters (recommended ≤ 160)`,
      path,
    });
  }
  return issues;
}

export async function runSeoAudit(): Promise<SeoAuditResult> {
  const issues: AuditIssue[] = [];
  const [settings, services, projects] = await Promise.all([
    getSiteSettingsServer(),
    fetchServicesServer(),
    fetchProjectsServer(),
  ]);

  const siteUrl = getSiteUrl(settings);
  if (!settings.site_url && !process.env.NEXT_PUBLIC_SITE_URL) {
    issues.push({
      id: "site-url",
      severity: "warning",
      category: "Technical",
      message: "Site URL not configured (using fallback)",
      fix: "Set Site URL in Site Settings or NEXT_PUBLIC_SITE_URL env var for accurate canonicals and sitemap",
    });
  }

  // Static pages
  for (const pageKey of Object.keys(DEFAULT_PAGE_METADATA)) {
    const meta = await getPageMetadataServer(pageKey);
    const path =
      pageKey === "home"
        ? "/"
        : `/${pageKey === "services" ? "services" : pageKey}`;
    issues.push(
      ...titleIssue(`page-${pageKey}`, "Static pages", meta.title, path),
      ...descriptionIssue(`page-${pageKey}`, "Static pages", meta.description, path)
    );
    if (!meta.og_image && !settings.og_image_url) {
      issues.push({
        id: `page-${pageKey}-og`,
        severity: "warning",
        category: "Static pages",
        message: `No OG image for ${pageKey} page`,
        fix: "Set a default OG image in Site Settings",
        path,
      });
    }
  }

  // Services
  const serviceSlugs = new Map<string, string>();
  for (const service of services) {
    const slug = getServiceSlug(service);
    const path = `/services/${slug}`;

    if (serviceSlugs.has(slug)) {
      issues.push({
        id: `service-dup-${service.id}`,
        severity: "error",
        category: "Services",
        message: `Duplicate service slug "${slug}"`,
        fix: "Give each service a unique URL slug",
        path,
      });
    } else {
      serviceSlugs.set(slug, service.id);
    }

    if (!service.service_pagename) {
      issues.push({
        id: `service-slug-${service.id}`,
        severity: "warning",
        category: "Services",
        message: `"${service.service_name}" has no custom slug (using auto-generated)`,
        path,
      });
    }

    const desc = stripHtml(service.service_description);
    if (!desc) {
      issues.push({
        id: `service-desc-${service.id}`,
        severity: "error",
        category: "Services",
        message: `"${service.service_name}" has no description`,
        fix: "Add a service description in the CMS",
        path,
      });
    }

    if (!service.service_image) {
      issues.push({
        id: `service-img-${service.id}`,
        severity: "warning",
        category: "Services",
        message: `"${service.service_name}" has no hero image (affects social sharing)`,
        path,
      });
    }
  }

  // Projects
  const projectSlugs = new Map<string, string>();
  for (const project of projects) {
    const slug = getProjectSlug(project);
    const path = `/project/${slug}`;

    if (projectSlugs.has(slug)) {
      issues.push({
        id: `project-dup-${project.id}`,
        severity: "error",
        category: "Projects",
        message: `Duplicate project slug "${slug}"`,
        fix: "Give each project a unique URL slug",
        path,
      });
    } else {
      projectSlugs.set(slug, project.id);
    }

    if (!project.project_pagename) {
      issues.push({
        id: `project-slug-${project.id}`,
        severity: "warning",
        category: "Projects",
        message: `"${project.project_name}" has no custom slug`,
        path,
      });
    }

    if (!project.project_description && !stripHtml(project.project_content)) {
      issues.push({
        id: `project-desc-${project.id}`,
        severity: "warning",
        category: "Projects",
        message: `"${project.project_name}" has no description or content`,
        path,
      });
    }

    if (!project.project_image) {
      issues.push({
        id: `project-img-${project.id}`,
        severity: "warning",
        category: "Projects",
        message: `"${project.project_name}" has no cover image`,
        path,
      });
    }
  }

  const pagesInSitemap =
    5 + services.length + projects.length;

  issues.push({
    id: "sitemap-count",
    severity: "info",
    category: "Sitemap",
    message: `${pagesInSitemap} URLs will be included in sitemap.xml`,
    path: `${siteUrl}/sitemap.xml`,
  });

  const errors = issues.filter((i) => i.severity === "error").length;
  const warnings = issues.filter((i) => i.severity === "warning").length;
  const info = issues.filter((i) => i.severity === "info").length;

  const score = Math.max(
    0,
    100 - errors * 10 - warnings * 3
  );

  return {
    score,
    issues,
    summary: { errors, warnings, info, pagesInSitemap },
    checkedAt: new Date().toISOString(),
  };
}
