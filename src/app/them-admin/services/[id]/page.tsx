"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminTopBar from "@/components/admin/AdminTopBar";
import ServiceForm, {
  serviceToFormData,
  ServiceFormData,
} from "@/components/admin/ServiceForm";
import { getService, updateService } from "@/lib/cms/services";
import { listProjects } from "@/lib/cms/projects";
import { Project, Service } from "@/types/cms";

export default function EditServicePage() {
  const params = useParams();
  const id = params.id as string;
  const [service, setService] = useState<Service | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getService(id), listProjects()]).then(([svc, projs]) => {
      setService(svc);
      setProjects(projs);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (data: ServiceFormData) => {
    await updateService(
      id,
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
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-800" />
      </div>
    );
  }

  if (!service) {
    return (
      <>
        <AdminTopBar title="Service not found" />
        <div className="p-8 text-stone-500">This service does not exist.</div>
      </>
    );
  }

  return (
    <>
      <AdminTopBar title={`Edit: ${service.service_name}`} />
      <div className="p-8">
        <ServiceForm
          initial={serviceToFormData(service, service.service_projects ?? [])}
          projects={projects}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}
