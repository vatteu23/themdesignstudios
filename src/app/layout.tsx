import "../styles/globals.css";
import { Metadata } from "next";
import { Providers } from "./providers";
import ClientLayout from "@/components/ClientLayout";

import Footer from "@/components/footer";
import NavBar from "@/components/navbar";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "Them design studios",
  description:
    "Architecture & Spatial Design Services in India. Hyderabad | Bangalore | Bombay",
  openGraph: {
    images: "/them-studios.png",
  },
  twitter: {
    images: "/them-studios.png",
    card: "summary_large_image",
  },
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
