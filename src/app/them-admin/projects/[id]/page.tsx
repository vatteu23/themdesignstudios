"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminTopBar from "@/components/admin/AdminTopBar";
import ProjectForm, { ProjectFormData } from "@/components/admin/ProjectForm";
import ProjectGalleryManager from "@/components/admin/ProjectGalleryManager";
import { getProject, updateProject } from "@/lib/cms/projects";
import { listServices } from "@/lib/cms/services";
import { Project, Service } from "@/types/cms";

export default function EditProjectPage() {
  const params = useParams();
  const id = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([getProject(id), listServices()]).then(([proj, svcs]) => {
      setProject(proj);
      setServices(svcs);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (data: ProjectFormData) => {
    await updateProject(
      id,
      {
        project_name: data.project_name,
        project_description: data.project_description,
        project_image: data.project_image,
        project_pagename: data.project_pagename,
        project_location: data.project_location,
        project_type: data.project_type,
        project_date: data.project_date,
        project_client: data.project_client,
        project_budget: data.project_budget,
        project_duration: data.project_duration,
        project_content: data.project_content,
        project_active: data.project_active,
      },
      data.serviceId || null
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-800" />
      </div>
    );
  }

  if (!project) {
    return (
      <>
        <AdminTopBar title="Project not found" />
        <div className="p-8 text-stone-500">This project does not exist.</div>
      </>
    );
  }

  return (
    <>
      <AdminTopBar title={`Edit: ${project.project_name}`} />
      <div className="p-8">
        {saved && (
          <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Changes saved successfully.
          </div>
        )}
        <ProjectForm
          initial={{
            project_name: project.project_name,
            project_description: project.project_description ?? "",
            project_image: project.project_image ?? "",
            project_pagename: project.project_pagename ?? "",
            project_location: project.project_location ?? "",
            project_type: project.project_type ?? "",
            project_date: project.project_date ?? "",
            project_client: project.project_client ?? "",
            project_budget: project.project_budget ?? "",
            project_duration: project.project_duration ?? "",
            project_content: project.project_content ?? "",
            project_active: project.project_active !== false,
            serviceId: project.project_service ?? "",
          }}
          services={services}
          onSubmit={handleSubmit}
          gallerySection={<ProjectGalleryManager projectId={id} />}
        />
      </div>
    </>
  );
}
