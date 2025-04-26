import "../styles/globals.css";
import "../styles/App.css";
import { Metadata } from "next";
import { Providers } from "./providers";
import ClientLayout from "@/components/ClientLayout";

import Footer from "@/components/footer";
import NavBar from "@/components/navbar";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "theM Studios",
  description: "Professional web development services by theM Studios",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
