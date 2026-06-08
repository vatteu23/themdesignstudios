"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminTopBar from "@/components/admin/AdminTopBar";
import ServiceForm, { ServiceFormData } from "@/components/admin/ServiceForm";
import { createService } from "@/lib/cms/services";
import { listProjects } from "@/lib/cms/projects";
import { Project } from "@/types/cms";

export default function NewServicePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    listProjects().then(setProjects);
  }, []);

  const handleSubmit = async (data: ServiceFormData) => {
    const id = await createService(
      {
        service_name: data.service_name,
        service_description: data.service_description,
        service_image: data.service_image,
        service_pagename: data.service_pagename,
        service_order: data.service_order,
        service_active: data.service_active,
      },
      data.linkedProjectIds
    );
    router.push(`/them-admin/services/${id}`);
  };

  return (
    <>
      <AdminTopBar title="New service" />
      <div className="p-8">
        <ServiceForm
          initial={{
            service_name: "",
            service_description: "",
            service_image: "",
            service_pagename: "",
            service_order: 0,
            service_active: true,
            linkedProjectIds: [],
          }}
          projects={projects}
          onSubmit={handleSubmit}
          submitLabel="Create service"
        />
      </div>
    </>
  );
}
