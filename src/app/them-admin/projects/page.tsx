"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SafeImage, { isValidImageSrc } from "@/components/admin/SafeImage";
import { HiOutlinePlus } from "@/components/admin/adminIcons";
import AdminTopBar from "@/components/admin/AdminTopBar";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { listProjects, deleteProject } from "@/lib/cms/projects";
import { listServices } from "@/lib/cms/services";
import { Project, Service } from "@/types/cms";

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    Promise.all([listProjects(), listServices()]).then(([projs, svcs]) => {
      setProjects(projs);
      setServices(svcs);
      setLoading(false);
    });
  }, []);

  const getServiceName = (serviceId?: string) => {
    if (!serviceId) return "—";
    return services.find((s) => s.id === serviceId)?.service_name ?? "—";
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteProject(deleteId);
      setProjects((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AdminTopBar title="Projects" />
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-stone-500">{projects.length} projects</p>
          <Link
            href="/them-admin/projects/new"
            className="inline-flex items-center gap-2 rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
          >
            <HiOutlinePlus className="h-4 w-4" />
            Add project
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-800" />
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-300 py-12 text-center text-stone-500">
            No projects yet.{" "}
            <Link href="/them-admin/projects/new" className="underline">
              Create one
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-stone-600">Project</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Location</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Service</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {isValidImageSrc(project.project_image) && (
                          <div className="relative h-10 w-10 overflow-hidden rounded">
                            <SafeImage
                              src={project.project_image}
                              alt=""
                              fill
                            />
                          </div>
                        )}
                        <span className="font-medium text-stone-800">
                          {project.project_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-500">
                      {project.project_location ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-stone-500">
                      {getServiceName(project.project_service)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/them-admin/projects/${project.id}`}
                          className="text-stone-600 hover:text-stone-900"
                        >
                          Edit
                        </Link>
                        <a
                          href={`/project/${project.project_pagename}`}
                          target="_blank"
                          className="text-stone-400 hover:text-stone-600"
                        >
                          View
                        </a>
                        <button
                          onClick={() => setDeleteId(project.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete project"
        message="This will delete the project, its gallery images, and all service links. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </>
  );
}
