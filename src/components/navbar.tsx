"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Typography from "./Typography";
import { usePathname } from "next/navigation";

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav className="backdrop-blur-2xl bg-primary/20 text-text-dark py-3 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
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
              Them design
              <br />
              studios
            </Typography>
          </Link>

          {/* Mobile menu button */}
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

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/"
              className={`text-base font-medium hover:text-secondary ${
                pathname === "/" ? "text-text-dark" : "text-secondary"
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-base font-medium hover:text-secondary ${
                pathname === "/about" ? "text-text-dark" : "text-secondary"
              }`}
            >
              About
            </Link>
            <Link
              href="/services"
              className={`text-base font-medium hover:text-secondary ${
                pathname?.startsWith("/services")
                  ? "text-text-dark"
                  : "text-secondary"
              }`}
            >
              Services
            </Link>
            <Link
              href="/portfolio"
              className={`text-base font-medium hover:text-secondary ${
                pathname === "/portfolio" ? "text-text-dark" : "text-secondary"
              }`}
            >
              Portfolio
            </Link>
            <Link
              href="/contact"
              className={`text-base font-medium hover:text-secondary ${
                pathname === "/contact" ? "text-text-dark" : "text-secondary"
              }`}
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className={`text-base font-medium py-2 ${
                  pathname === "/" ? "text-text-dark" : "text-secondary"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={`text-base font-medium py-2 ${
                  pathname === "/about" ? "text-text-dark" : "text-secondary"
                }`}
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/services"
                className={`text-base font-medium py-2 ${
                  pathname?.startsWith("/services")
                    ? "text-text-dark"
                    : "text-secondary"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/portfolio"
                className={`text-base font-medium py-2 ${
                  pathname === "/portfolio"
                    ? "text-text-dark"
                    : "text-secondary"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Portfolio
              </Link>
              <Link
                href="/contact"
                className={`text-base font-medium py-2 ${
                  pathname === "/contact" ? "text-text-dark" : "text-secondary"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
