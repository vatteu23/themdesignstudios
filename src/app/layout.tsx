import "../styles/globals.css";
import { Providers } from "./providers";
import ClientLayout from "@/components/ClientLayout";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import { generateRootMetadata } from "@/lib/seo/metadata";
import { getSiteSettingsServer } from "@/lib/seo/firebase-server";

export async function generateMetadata() {
  return generateRootMetadata();
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettingsServer();

  return (
    <html lang="en">
      <body>
        <OrganizationJsonLd settings={settings} />
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
