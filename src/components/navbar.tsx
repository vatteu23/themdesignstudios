"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Typography from "./Typography";
import { usePathname } from "next/navigation";
import { useNavigation, useSiteSettings } from "@/lib/content/hooks";

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const { items: navItems } = useNavigation();
  const { settings } = useSiteSettings();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const linkClass = (href: string) => {
    const isActive =
      href === "/"
        ? pathname === "/"
        : pathname === href || pathname?.startsWith(`${href}/`);
    return `text-base font-medium hover:text-secondary ${
      isActive ? "text-text-dark" : "text-secondary"
    }`;
  };

  return (
    <nav className="backdrop-blur-2xl bg-primary/20 text-text-dark py-3 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-simp.svg"
              alt="theM Studios Logo"
              width={30}
              height={20}
              className="mr-3"
            />
            <Typography
              variant="h4"
              fontWeight="medium"
              className="!text-text-dark"
            >
              {settings.site_name.split(" ").slice(0, 2).join(" ")}
              <br />
              {settings.site_name.split(" ").slice(2).join(" ") || "studios"}
            </Typography>
          </Link>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-dark focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link key={item.id} href={item.href} className={linkClass(item.href)}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`text-base font-medium py-2 ${linkClass(item.href)}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
