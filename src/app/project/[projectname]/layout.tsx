import { Metadata } from "next";
import { getProjectBySlug } from "@/lib/seo/firebase-server";
import { generateProjectMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ projectname: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectname: string }>;
}): Promise<Metadata> {
  const { projectname } = await params;
  const project = await getProjectBySlug(projectname);

  if (!project) {
    return { title: "Project not found", robots: { index: false, follow: false } };
  }

  return generateProjectMetadata(project);
}

export default function ProjectLayout({ children }: Props) {
  return children;
}
