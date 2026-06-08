"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminTopBar from "@/components/admin/AdminTopBar";
import ProjectForm, { ProjectFormData } from "@/components/admin/ProjectForm";
import BulkImageUpload, { StagedImage } from "@/components/admin/BulkImageUpload";
import { createProject, addProjectImages } from "@/lib/cms/projects";
import { listServices } from "@/lib/cms/services";
import { Service } from "@/types/cms";

export default function NewProjectPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [galleryImages, setGalleryImages] = useState<StagedImage[]>([]);

  useEffect(() => {
    listServices().then(setServices);
  }, []);

  const handleSubmit = async (data: ProjectFormData) => {
    const coverImage =
      data.project_image || galleryImages[0]?.url || "";

    const id = await createProject(
      {
        project_name: data.project_name,
        project_description: data.project_description,
        project_image: coverImage,
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

    if (galleryImages.length > 0) {
      await addProjectImages(
        id,
        galleryImages.map((img) => img.url)
      );
    }

    router.push(`/them-admin/projects/${id}`);
  };

  return (
    <>
      <AdminTopBar title="New project" />
      <div className="p-8">
        <ProjectForm
          initial={{
            project_name: "",
            project_description: "",
            project_image: "",
            project_pagename: "",
            project_location: "",
            project_type: "",
            project_date: "",
            project_client: "",
            project_budget: "",
            project_duration: "",
            project_content: "",
            project_active: true,
            serviceId: "",
          }}
          services={services}
          onSubmit={handleSubmit}
          submitLabel="Create project"
          gallerySection={
            <BulkImageUpload
              images={galleryImages}
              onChange={setGalleryImages}
              hint="Upload multiple gallery images at once. If no cover image is set above, the first uploaded image becomes the project cover."
            />
          }
        />
      </div>
    </>
  );
}
