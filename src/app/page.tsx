"use client";

import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import Typography from "@/components/Typography";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HomeModernIcon,
  CubeIcon,
  SwatchIcon,
  GlobeAltIcon,
  ClipboardDocumentListIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";

interface PageContent {
  content_title: string;
  content_description: string;
  content_active: string;
}

interface ServiceCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

export default function Home() {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch page content with ID "-MDGRuhFTBixRVFspb4V" (from original code)
    const contentRef = ref(db, "/pagecontent/-MDGRuhFTBixRVFspb4V");
    const unsubscribe = onValue(contentRef, (snapshot) => {
      const content = snapshot.val();
      if (content && content.content_active === "true") {
        setPageContent(content);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const services: ServiceCard[] = [
    {
      title: "PLANNING",
      description:
        "Innovative architectural solutions that combine functionality with aesthetics, tailored to your specific needs and environment.",
      icon: <HomeModernIcon className="w-8 h-8 text-text-dark" />,
      link: "/services/planning",
    },
    {
      title: "INTERIOR DESIGN",
      description:
        "Transforming spaces with creative designs that reflect your style while maximizing comfort and functionality.",
      icon: <CubeIcon className="w-8 h-8 text-text-dark" />,
      link: "/services/interior-design",
    },
    {
      title: "FURNITURE & ACCESSORY DESIGN",
      description:
        "Custom furniture and accessory designs that complement your spaces with unique, functional and aesthetically pleasing elements.",
      icon: <SwatchIcon className="w-8 h-8 text-text-dark" />,
      link: "/services/furniture-accessory-design",
    },
    {
      title: "LANDSCAPE DESIGN",
      description:
        "Creating outdoor environments that harmonize with architecture and enhance the natural beauty of your surroundings.",
      icon: <GlobeAltIcon className="w-8 h-8 text-text-dark" />,
      link: "/services/landscape-design",
    },
    {
      title: "TURNKEY & PROJECT MANAGEMENT CONTRACT",
      description:
        "Complete end-to-end project handling from concept to completion, ensuring quality and timely delivery within budget.",
      icon: <ClipboardDocumentListIcon className="w-8 h-8 text-text-dark" />,
      link: "/services/turnkey-project-management-contract",
    },
    {
      title: "GRAPHIC & BRANDING DESIGN",
      description:
        "Visual communication solutions that effectively convey your message with striking aesthetics and clarity for lasting brand impact.",
      icon: <PaintBrushIcon className="w-8 h-8 text-text-dark" />,
      link: "/services/graphic-branding-design",
    },
  ];

  // Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      {/* Hero Section - Architectural Design */}
      <section className="relative overflow-hidden bg-primary pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              {/* Top line */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="absolute top-0 left-0 h-px bg-stone-700"
              ></motion.div>

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
                    Simple is hard
                  </Typography>

                  <Typography
                    variant="small"
                    fontWeight="light"
                    align="center"
                    fontFamily="mono"
                    className="text-secondary block"
                  >
                    - Martin Charles Scorsese
                  </Typography>
                </motion.div>
              </div>

              {/* Bottom line */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="absolute bottom-0 right-0 h-px bg-stone-700"
              ></motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Image Gallery Section - Clean Frames */}
      <section className="relative overflow-hidden bg-primary">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-7xl mx-auto">
            {/* Top large image */}
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
                    src="https://firebasestorage.googleapis.com/v0/b/bythem-f0fdb.appspot.com/o/images%2F14a76468-760f-4fd3-8211-4973f72db80a.jpg?alt=media&token=f8e6436f-818e-4455-b236-80c244f037f1"
                    alt="Interior space"
                    fill
                    className="object-cover filter grayscale"
                  />
                </motion.div>
              </div>
            </div>

            {/* Bottom two images side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bottom left image */}
              <div className="border border-secondary p-0 bg-white">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="w-full h-[300px] relative"
                >
                  <Image
                    src="https://firebasestorage.googleapis.com/v0/b/bythem-f0fdb.appspot.com/o/images%2Ff294141a-6963-4de7-94e8-f2cd21ed267c.jpg?alt=media&token=2d6b306d-c106-4e1d-b363-5965c9faf640"
                    alt="Interior design"
                    fill
                    className="object-cover filter grayscale"
                  />
                </motion.div>
              </div>

              {/* Bottom right image */}
              <div className="border border-secondary p-0 bg-white">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="w-full h-[300px] relative"
                >
                  <Image
                    src="https://firebasestorage.googleapis.com/v0/b/bythem-f0fdb.appspot.com/o/images%2F2a98a1a0-1799-404b-b474-23c3f73e7024.jpg?alt=media&token=b5b2ccb8-4ded-4e59-a317-2cf0d5daebf8"
                    alt="Architecture"
                    fill
                    className="object-cover filter grayscale"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
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
                  What we do
                </Typography>
              </div>

              {loading ? (
                <div className="text-center my-3 md:w-3/5">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : pageContent ? (
                <Typography
                  variant="body2"
                  className="block max-w-none md:w-3/5"
                >
                  <div
                    className="prose  text-left  "
                    dangerouslySetInnerHTML={{
                      __html: pageContent.content_description,
                    }}
                  />
                </Typography>
              ) : (
                <div className="md:w-3/5">
                  <Typography
                    variant="body1"
                    className="text-left mb-6 text-lg leading-relaxed text-neutral-700"
                  >
                    At theM, we believe that design is an art which adds essence
                    to your lifestyle. We excel in providing clients with
                    designs with perfect blend in form & function. We establish
                    a platform for clients to be transparent in terms of
                    requirements & budget. theM consistently endeavours in
                    experimenting fusion styles with latest use of Materials and
                    Technology available in the market.
                  </Typography>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
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
            {services.map((service, index) => (
              <motion.a
                key={index}
                href={service.link}
                variants={itemVariants}
                className="bg-card-bg p-8 rounded-sm border border-secondary/30 hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{service.icon}</div>
                <Typography
                  variant="h5"
                  className="mb-3 text-text-dark"
                  fontWeight="medium"
                >
                  {service.title}
                </Typography>
                <Typography variant="body2" className="mb-6 text-text-dark/80">
                  {service.description}
                </Typography>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
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
                    Our Design Philosophy
                  </Typography>
                  <Typography
                    variant="body1"
                    className="text-neutral-300 text-lg leading-relaxed"
                  >
                    We approach design as a harmonious blend of aesthetics and
                    functionality. Every project we undertake is a journey of
                    collaboration, innovation, and meticulous attention to
                    detail. Our design philosophy centers around creating spaces
                    and visuals that not only look exceptional but also enhance
                    the quality of life and experience for those who interact
                    with them.
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
                    Let's create something together
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
                    <span className="absolute top-0 right-0 w-0 h-full bg-neutral-100 transition-all duration-300 group-hover:w-full"></span>
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
