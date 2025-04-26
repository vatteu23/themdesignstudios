"use client";

import ScrollToTop from "./ScrollToTop";
import Footer from "./footer";
import NavBar from "./navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <NavBar />
      <ScrollToTop />
      <main className="home-content container mx-auto">{children}</main>
      <Footer />
    </div>
  );
}
