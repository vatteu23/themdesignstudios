import { Metadata } from "next";
import { getServiceBySlug } from "@/lib/seo/firebase-server";
import { generateServiceMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ servicename: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ servicename: string }>;
}): Promise<Metadata> {
  const { servicename } = await params;
  const service = await getServiceBySlug(servicename);

  if (!service) {
    return { title: "Service not found", robots: { index: false, follow: false } };
  }

  return generateServiceMetadata(service);
}

export default function ServiceDetailLayout({ children }: Props) {
  return children;
}
