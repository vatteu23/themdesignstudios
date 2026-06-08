import { SiteSettings } from "@/types/cms";
import { DEFAULT_SITE_SETTINGS } from "@/lib/cms/defaults";

const PRODUCTION_FALLBACK = "https://themdesignstudios.com";

function normalizeUrl(url: string): string {
  const trimmed = url.replace(/\/$/, "");
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

export function getSiteUrl(settings?: Partial<SiteSettings>): string {
  const fromSettings = settings?.site_url?.trim();
  if (fromSettings) {
    return normalizeUrl(fromSettings);
  }

  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return normalizeUrl(fromEnv);
  }

  // Never use preview deployment URLs (e.g. *-team.vercel.app) for sitemaps/canonicals.
  const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (productionUrl) {
    return normalizeUrl(productionUrl);
  }

  if (process.env.VERCEL_ENV === "production") {
    const vercelUrl = process.env.VERCEL_URL?.trim();
    if (vercelUrl) {
      return normalizeUrl(vercelUrl);
    }
  }

  return PRODUCTION_FALLBACK;
}

export function absoluteUrl(path: string, settings?: Partial<SiteSettings>): string {
  const base = getSiteUrl(settings);
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function resolveOgImage(
  image: string | undefined,
  settings?: Partial<SiteSettings>
): string {
  const fallback = settings?.og_image_url || DEFAULT_SITE_SETTINGS.og_image_url;
  const candidate = image || fallback;
  if (candidate.startsWith("http")) return candidate;
  return absoluteUrl(candidate, settings);
}

export function stripHtml(html?: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}
