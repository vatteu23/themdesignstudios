import { generatePageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return generatePageMetadata("services");
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
