import { SiteSettings } from "@/types/cms";
import { absoluteUrl, resolveOgImage } from "@/lib/seo/config";

export default function OrganizationJsonLd({
  settings,
}: {
  settings: SiteSettings;
}) {
  const sameAs = [settings.social_instagram, settings.social_linkedin].filter(
    Boolean
  );

  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: settings.site_name,
    description: settings.tagline,
    url: absoluteUrl("/", settings),
    email: settings.contact_email,
    telephone: settings.contact_phone,
    image: resolveOgImage(settings.og_image_url, settings),
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.contact_address,
      addressCountry: "IN",
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
