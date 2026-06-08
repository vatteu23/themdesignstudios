"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  adminNavIcons,
  HiOutlineArrowTopRightOnSquare,
} from "./adminIcons";
import type { IconType } from "react-icons";

const navItems: { href: string; label: string; iconKey: keyof typeof adminNavIcons }[] = [
  { href: "/them-admin", label: "Dashboard", iconKey: "dashboard" },
  { href: "/them-admin/services", label: "Services", iconKey: "services" },
  { href: "/them-admin/projects", label: "Projects", iconKey: "projects" },
  { href: "/them-admin/content", label: "Page Content", iconKey: "content" },
  { href: "/them-admin/home", label: "Home Page", iconKey: "home" },
  { href: "/them-admin/team", label: "Team", iconKey: "team" },
  { href: "/them-admin/site-settings", label: "Site Settings", iconKey: "settings" },
  { href: "/them-admin/seo", label: "SEO Audit", iconKey: "seo" },
  { href: "/them-admin/media", label: "Media Library", iconKey: "media" },
  { href: "/them-admin/emails", label: "Emails", iconKey: "emails" },
];

function NavIcon({ icon: Icon }: { icon: IconType }) {
  return <Icon className="h-5 w-5 shrink-0" aria-hidden />;
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-stone-200 bg-white">
      <div className="border-b border-stone-200 px-6 py-5">
        <Link href="/them-admin" className="block">
          <span className="text-lg font-semibold tracking-wide text-stone-800">
            Them CMS
          </span>
          <span className="mt-0.5 block text-xs text-stone-500">
            Content Management
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = adminNavIcons[item.iconKey];
            const isActive =
              item.href === "/them-admin"
                ? pathname === "/them-admin"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-stone-800 text-white"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  }`}
                >
                  <NavIcon icon={Icon} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-stone-200 px-4 py-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800"
        >
          <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
          View public site
        </Link>
      </div>
    </aside>
  );
}
