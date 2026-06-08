"use client";

import { usePathname } from "next/navigation";
import ScrollToTop from "./ScrollToTop";
import Footer from "./footer";
import NavBar from "./navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/them-admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="">
      <NavBar />
      <ScrollToTop />
      <main className="home-content container mx-auto">{children}</main>
      <Footer />
    </div>
  );
}
