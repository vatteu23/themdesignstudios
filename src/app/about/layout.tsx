import { generatePageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return generatePageMetadata("about");
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
