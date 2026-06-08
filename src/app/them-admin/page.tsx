"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { listServices } from "@/lib/cms/services";
import { listProjects } from "@/lib/cms/projects";
import { listEmails } from "@/lib/cms/emails";
import { seedCmsContent } from "@/lib/cms/seed";
import { waitForAuthReady } from "@/lib/cms/auth";
import {
  adminNavIcons,
  HiOutlinePlus,
  HiOutlineSparkles,
  HiOutlinePencilSquare,
  HiOutlineCloudArrowUp,
} from "@/components/admin/adminIcons";
import type { IconType } from "react-icons";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    services: 0,
    projects: 0,
    unreadEmails: 0,
  });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        await waitForAuthReady();
        const [services, projects, emailsResult] = await Promise.all([
          listServices(),
          listProjects(),
          listEmails().catch(() => []),
        ]);
        setStats({
          services: services.length,
          projects: projects.length,
          unreadEmails: emailsResult.filter((e) => !e.read).length,
        });
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedMessage(null);
    try {
      const { seeded } = await seedCmsContent();
      setSeedMessage(
        seeded.length > 0
          ? `Seeded: ${seeded.join(", ")}`
          : "All default content already exists",
      );
    } catch {
      setSeedMessage("Seed failed — check console for details");
    } finally {
      setSeeding(false);
    }
  };

  const cards: {
    title: string;
    count: number;
    href: string;
    color: string;
    icon: IconType;
  }[] = [
    {
      title: "Services",
      count: stats.services,
      href: "/them-admin/services",
      color: "text-blue-700",
      icon: adminNavIcons.services,
    },
    {
      title: "Projects",
      count: stats.projects,
      href: "/them-admin/projects",
      color: "text-emerald-700",
      icon: adminNavIcons.projects,
    },
    {
      title: "Unread Emails",
      count: stats.unreadEmails,
      href: "/them-admin/emails",
      color: "text-amber-700",
      icon: adminNavIcons.emails,
    },
  ];

  const quickLinks: { href: string; label: string; icon: IconType }[] = [
    {
      href: "/them-admin/services/new",
      label: "Add service",
      icon: HiOutlinePlus,
    },
    {
      href: "/them-admin/projects/new",
      label: "Add project",
      icon: HiOutlinePlus,
    },
    {
      href: "/them-admin/content",
      label: "Edit page content",
      icon: HiOutlinePencilSquare,
    },
    {
      href: "/them-admin/home",
      label: "Edit home page",
      icon: adminNavIcons.home,
    },
    {
      href: "/them-admin/media",
      label: "Upload media",
      icon: HiOutlineCloudArrowUp,
    },
    {
      href: "/them-admin/site-settings",
      label: "Site settings",
      icon: adminNavIcons.settings,
    },
  ];

  return (
    <>
      <AdminTopBar title="Dashboard" />
      <div className="p-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-800" />
          </div>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {cards.map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.href}
                    href={card.href}
                    className="rounded-xl border border-stone-200 bg-white p-6 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-stone-500">
                        {card.title}
                      </p>
                      <Icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                    <p className={`mt-2 text-3xl font-bold ${card.color}`}>
                      {card.count}
                    </p>
                  </Link>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-stone-200 bg-white p-6">
                <h2 className="mb-4 text-base font-semibold text-stone-800">
                  Quick actions
                </h2>
                <ul className="space-y-2">
                  {quickLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900"
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
