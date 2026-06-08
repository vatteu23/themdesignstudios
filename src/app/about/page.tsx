"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Typography from "@/components/Typography";
import { usePageContent, useTeamMembers, PAGE_CONTENT_KEYS } from "@/lib/content/hooks";

export default function AboutUs() {
  const { content: whoWeAreContent, loading: contentLoading } = usePageContent(
    PAGE_CONTENT_KEYS.WHO_WE_ARE
  );
  const { members: teamMembers, loading: teamLoading } = useTeamMembers();

  const isLoading = contentLoading || teamLoading;

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  if (isLoading) {
    return (
      <div className="container mt-5 py-12 md:py-20">
        <div className="flex justify-center my-5">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 py-12 md:py-20">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mb-12"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row justify-between mb-16 gap-y-6 md:gap-12 bg-stone-700 text-neutral-50 py-12 px-6 rounded-lg"
        >
          <Typography
            variant="h2"
            component={"h1"}
            fontFamily="sans"
            gutterBottom
            fontWeight="semibold"
          >
            About
            <br />
            Them design Studios
          </Typography>
          <motion.div variants={itemVariant} className="flex-1 text-neutral-50">
            {whoWeAreContent && whoWeAreContent.content_active === "true" && (
              <div
                className="text-neutral-300"
                dangerouslySetInnerHTML={{
                  __html: whoWeAreContent.content_description,
                }}
              />
            )}
          </motion.div>
        </motion.div>

        {teamMembers.map((member) => (
          <motion.div
            key={member.id}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="mt-16 pt-12"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                {member.image_url && (
                  <div className="relative rounded-lg overflow-hidden aspect-square h-[400px] w-full transition-transform duration-700 ease-in-out hover:scale-105">
                    <Image
                      src={member.image_url}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="md:w-2/3">
                <Typography
                  variant="h2"
                  fontFamily="sans"
                  fontWeight="medium"
                  className="mb-2"
                >
                  {member.name}
                </Typography>
                <Typography
                  variant="h4"
                  fontFamily="sans"
                  fontWeight="light"
                  className="mb-6 text-gray-700"
                >
                  {member.role}
                </Typography>
                <Typography
                  variant="body1"
                  fontFamily="sans"
                  className="mb-8 text-gray-600"
                >
                  {member.bio}
                </Typography>
                <div className="flex space-x-6">
                  <Link
                    href="/services"
                    className="text-gray-800 hover:text-gray-600 transition-colors"
                  >
                    <Typography variant="body2" fontWeight="medium">
                      Services
                    </Typography>
                  </Link>
                  <Link
                    href="/portfolio"
                    className="text-gray-800 hover:text-gray-600 transition-colors"
                  >
                    <Typography variant="body2" fontWeight="medium">
                      Portfolio
                    </Typography>
                  </Link>
                  <Link
                    href="/contact"
                    className="text-gray-800 hover:text-gray-600 transition-colors"
                  >
                    <Typography variant="body2" fontWeight="medium">
                      Contact
                    </Typography>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
