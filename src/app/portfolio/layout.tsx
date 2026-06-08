import { generatePageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return generatePageMetadata("portfolio");
}

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
