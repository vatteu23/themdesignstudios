"use client";

import React, { useEffect, useState } from "react";
import { TeamMember, PageContent } from "../../types";
import { ref, get } from "firebase/database";
import { db } from "../../firebase";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Typography from "@/components/Typography";

export default function AboutUs() {
  const [whoWeAreContent, setWhoWeAreContent] = useState<PageContent | null>(
    null
  );
  const [whatWeDoContent, setWhatWeDoContent] = useState<PageContent | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Maneesh J",
      role: "Founder & Principal Designer",
      bio: "Founded theM Studios in 2016, working as Principal Designer. Expert in Architecture, Interior Design, and Turnkey Project management.",
      imageUrl:
        "https://firebasestorage.googleapis.com/v0/b/bythem-f0fdb.appspot.com/o/images%2Fdbaff600-ba03-4138-9692-1ea93e97578e.webp?alt=media&token=8d63ec35-7025-4b13-9dec-1215a55262bb",
    },
    // You can add more team members here as needed
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
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

  useEffect(() => {
    document.title = "THEM STUDIOS | About theM";

    const fetchPageContent = async () => {
      try {
        // Fetch "Who we are" content with ID -MDIt4KlYbfKpBOh36ua
        const whoWeAreRef = ref(db, "/pagecontent/-MDIt4KlYbfKpBOh36ua");
        const whoWeAreSnapshot = await get(whoWeAreRef);

        // Fetch "What we do" content with ID -MDGRuhFTBixRVFspb4V
        const whatWeDoRef = ref(db, "/pagecontent/-MDGRuhFTBixRVFspb4V");
        const whatWeDoSnapshot = await get(whatWeDoRef);

        if (
          whoWeAreSnapshot.exists() &&
          whoWeAreSnapshot.val().content_active === "true"
        ) {
          setWhoWeAreContent(whoWeAreSnapshot.val());
        }

        if (
          whatWeDoSnapshot.exists() &&
          whatWeDoSnapshot.val().content_active === "true"
        ) {
          setWhatWeDoContent(whatWeDoSnapshot.val());
        }
      } catch (error) {
        console.error("Error fetching page content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageContent();
  }, []);

  if (isLoading) {
    return (
      <div className="container mt-5 py-12 md:py-20">
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading content...</span>
          </div>
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
          className="flex flex-col md:flex-row justify-between mb-16
          gap-y-6 md:gap-12
          bg-stone-700 text-neutral-50 py-12 px-6 rounded-lg"
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
            {whoWeAreContent && (
              <>
                <div
                  className="text-neutral-300"
                  dangerouslySetInnerHTML={{
                    __html: whoWeAreContent.content_description,
                  }}
                />
              </>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mt-16 pt-12"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/3">
              {teamMembers[0].imageUrl && (
                <div
                  className="rounded-lg overflow-hidden aspect-square transition-transform duration-700 ease-in-out hover:scale-105"
                  style={{
                    backgroundImage: `url(${teamMembers[0].imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100%",
                    height: "400px",
                  }}
                />
              )}
            </div>
            <div className="md:w-2/3">
              <Typography
                variant="h2"
                fontFamily="sans"
                fontWeight="medium"
                className="mb-2"
              >
                {teamMembers[0].name}
              </Typography>
              <Typography
                variant="h4"
                fontFamily="sans"
                fontWeight="light"
                className="mb-6 text-gray-700"
              >
                {teamMembers[0].role}
              </Typography>
              <Typography
                variant="body1"
                fontFamily="sans"
                className="mb-8 text-gray-600"
              >
                {teamMembers[0].bio}
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
      </motion.div>
    </div>
  );
}
