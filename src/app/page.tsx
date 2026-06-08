"use client";

import Typography from "@/components/Typography";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  useHomeContent,
  usePageContent,
  useServices,
  PAGE_CONTENT_KEYS,
} from "@/lib/content/hooks";
import { getServiceIcon } from "@/lib/content/serviceIcons";
import { Service } from "@/types/cms";

export default function Home() {
  const { content: home, loading: homeLoading } = useHomeContent();
  const { content: pageContent, loading: contentLoading } = usePageContent(
    PAGE_CONTENT_KEYS.WHAT_WE_DO
  );
  const { services: allServices, loading: servicesLoading } = useServices();

  const loading = homeLoading || contentLoading || servicesLoading;

  const featuredServices: Service[] = (() => {
    const ids = home.featured_service_ids ?? [];
    if (ids.length > 0) {
      return ids
        .map((id) => allServices.find((s) => s.id === id))
        .filter((s): s is Service => !!s);
    }
    return allServices;
  })();

  const gallery = [...(home.hero_gallery ?? [])].sort((a, b) => a.order - b.order);
  const mainImage = gallery[0];
  const sideImages = gallery.slice(1, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <>
      <section className="relative overflow-hidden bg-primary pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="absolute top-0 left-0 h-px bg-stone-700"
              />

              <div className="py-12 px-8 md:px-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  <Typography
                    variant="h3"
                    align="center"
                    fontFamily="sans"
                    fontWeight="light"
                    className="tracking-wide text-text-dark mb-4"
                  >
                    {home.hero_quote}
                  </Typography>
                  <Typography
                    variant="small"
                    fontWeight="light"
                    align="center"
                    fontFamily="mono"
                    className="text-secondary block"
                  >
                    - {home.hero_author}
                  </Typography>
                </motion.div>
              </div>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="absolute bottom-0 right-0 h-px bg-stone-700"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="relative overflow-hidden bg-primary">
          <div className="container mx-auto px-4 relative">
            <div className="max-w-7xl mx-auto">
              {mainImage && (
                <div className="w-full mb-6">
                  <div className="border border-secondary p-0">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="w-full h-[400px] md:h-[500px] relative"
                    >
                      <Image
                        src={mainImage.image_url}
                        alt={mainImage.alt}
                        fill
                        className="object-cover filter grayscale"
                      />
                    </motion.div>
                  </div>
                </div>
              )}

              {sideImages.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sideImages.map((img, i) => (
                    <div key={i} className="border border-secondary p-0 bg-white">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 * (i + 1) }}
                        className="w-full h-[300px] relative"
                      >
                        <Image
                          src={img.image_url}
                          alt={img.alt}
                          fill
                          className="object-cover filter grayscale"
                        />
                      </motion.div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row justify-between gap-y-12 gap-x-16"
            >
              <div className="md:w-2/5">
                <Typography
                  variant="pageTitle"
                  fontWeight="normal"
                  className="tracking-tight"
                >
                  {pageContent?.content_title || "What we do"}
                </Typography>
              </div>

              {loading ? (
                <div className="text-center my-3 md:w-3/5">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-800 mx-auto" />
                </div>
              ) : pageContent && pageContent.content_active === "true" ? (
                <Typography variant="body2" className="block max-w-none md:w-3/5">
                  <div
                    className="prose text-left"
                    dangerouslySetInnerHTML={{
                      __html: pageContent.content_description,
                    }}
                  />
                </Typography>
              ) : null}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Typography
              variant="h2"
              className="mb-3 text-text-dark !text-center"
              fontWeight="light"
            >
              Our Services
            </Typography>
            <Typography
              variant="body1"
              className="max-w-3xl mx-auto text-secondary !text-center"
            >
              We provide comprehensive design solutions tailored to your unique
              vision and requirements.
            </Typography>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredServices.map((service) => (
              <motion.a
                key={service.id}
                href={`/services/${
                  service.service_pagename ||
                  service.service_name.toLowerCase().replace(/\s+/g, "-")
                }`}
                variants={itemVariants}
                className="bg-card-bg p-8 rounded-sm border border-secondary/30 hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{getServiceIcon(service.service_icon)}</div>
                <Typography
                  variant="h5"
                  className="mb-3 text-text-dark"
                  fontWeight="medium"
                >
                  {service.service_name}
                </Typography>
                <Typography variant="body2" className="mb-6 text-text-dark/80">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: service.service_description?.slice(0, 200) ?? "",
                    }}
                  />
                </Typography>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-stone-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <Typography
                    variant="h2"
                    className="text-white mb-8 tracking-tight"
                    fontWeight="light"
                  >
                    {home.philosophy_title}
                  </Typography>
                  <Typography
                    variant="body1"
                    className="text-neutral-300 text-lg leading-relaxed"
                  >
                    {home.philosophy_body}
                  </Typography>
                  <Link
                    href="/about"
                    className="inline-block mt-8 py-1 text-white border-b border-white/30 hover:border-white transition-all"
                  >
                    Learn more about our approach
                  </Link>
                </motion.div>
              </div>
              <div className="md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                  className="bg-stone-900 p-10 rounded-sm"
                >
                  <Typography
                    variant="h3"
                    className="text-white mb-6 tracking-tight"
                    fontWeight="normal"
                  >
                    Let&apos;s create something together
                  </Typography>
                  <Typography
                    variant="body1"
                    className="text-neutral-300 mb-8 leading-relaxed"
                  >
                    Ready to transform your space or brand? Get in touch with us
                    to discuss your project and discover how we can bring your
                    vision to life.
                  </Typography>
                  <Link
                    href="/contact"
                    className="inline-block px-10 py-3.5 bg-white text-black rounded-sm hover:bg-neutral-200 transition-colors relative overflow-hidden group"
                  >
                    <span className="relative z-10">Contact us</span>
                    <span className="absolute top-0 right-0 w-0 h-full bg-neutral-100 transition-all duration-300 group-hover:w-full" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
