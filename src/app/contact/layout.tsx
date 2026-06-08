import { generatePageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return generatePageMetadata("contact");
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
