"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SafeImage, { isValidImageSrc } from "@/components/admin/SafeImage";
import { HiOutlinePlus } from "@/components/admin/adminIcons";
import AdminTopBar from "@/components/admin/AdminTopBar";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { listServices, deleteService } from "@/lib/cms/services";
import { Service } from "@/types/cms";

export default function ServicesListPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    listServices().then((data) => {
      setServices(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteService(deleteId);
      setServices((prev) => prev.filter((s) => s.id !== deleteId));
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AdminTopBar title="Services" />
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-stone-500">{services.length} services</p>
          <Link
            href="/them-admin/services/new"
            className="inline-flex items-center gap-2 rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
          >
            <HiOutlinePlus className="h-4 w-4" />
            Add service
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-800" />
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-300 py-12 text-center text-stone-500">
            No services yet.{" "}
            <Link href="/them-admin/services/new" className="underline">
              Create one
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-stone-600">Service</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Slug</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Projects</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Status</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {isValidImageSrc(service.service_image) && (
                          <div className="relative h-10 w-10 overflow-hidden rounded">
                            <SafeImage
                              src={service.service_image}
                              alt=""
                              fill
                            />
                          </div>
                        )}
                        <span className="font-medium text-stone-800">
                          {service.service_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-500">
                      {service.service_pagename}
                    </td>
                    <td className="px-4 py-3 text-stone-500">
                      {service.service_projects?.length ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          service.service_active !== false
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        {service.service_active !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/them-admin/services/${service.id}`}
                          className="text-stone-600 hover:text-stone-900"
                        >
                          Edit
                        </Link>
                        <a
                          href={`/services/${service.service_pagename}`}
                          target="_blank"
                          className="text-stone-400 hover:text-stone-600"
                        >
                          View
                        </a>
                        <button
                          onClick={() => setDeleteId(service.id)}
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
        title="Delete service"
        message="This will remove the service and unlink all associated projects. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </>
  );
}
