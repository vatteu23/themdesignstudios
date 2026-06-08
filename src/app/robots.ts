import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/config";
import { getSiteSettingsServer } from "@/lib/seo/firebase-server";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettingsServer();
  const base = getSiteUrl(settings);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/them-admin/", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
