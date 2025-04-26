"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";
import { Service } from "../../types";
import Image from "next/image";
import Typography from "@/components/Typography";
import { motion } from "framer-motion";

export default function ServicesIndex() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch services from Firebase
    const servicesRef = ref(db, "services");
    const unsubscribe = onValue(servicesRef, (snapshot) => {
      const servicesData = snapshot.val();
      console.log("servicesData", servicesData);
      if (servicesData) {
        const servicesArray = Object.keys(servicesData).map((key) => ({
          id: key,
          ...servicesData[key],
        }));
        // Filter out services without a name
        const validServices = servicesArray.filter(
          (service) => service.service_name
        );
        setServices(validServices);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="container mt-5 py-12 md:py-20">
      <div className="mb-12 flex flex-col md:flex-row md:justify-between items-center gap-4">
        <Typography
          variant="pageTitle"
          component={"h1"}
          fontFamily="sans"
          gutterBottom
          fontWeight="semibold"
        >
          Services
        </Typography>
        <Typography variant="body1" fontFamily="sans" className="max-w-xl">
          We translate your vision into beautifully crafted spaces — tailored to
          your taste, grounded in thoughtful planning, and brought to life with
          our signature design expertise.
        </Typography>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading services...</span>
          </div>
        </div>
      ) : (
        <motion.div
          className="flex flex-col space-y-10"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {services.length > 0 ? (
            services.map((service) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                className="border-t border-gray-200 pt-10"
              >
                <Link
                  href={`/services/${
                    service.service_pagename ||
                    service.service_name.toLowerCase().replace(/\s+/g, "-")
                  }`}
                  className="flex flex-col md:flex-row gap-6 group md:justify-between"
                >
                  <div className="flex-1 max-w-2xl pr-4">
                    <Typography
                      variant="h3"
                      fontFamily="sans"
                      className="mb-3 group-hover:opacity-70 transition-opacity"
                      fontWeight="medium"
                    >
                      {service.service_name}
                    </Typography>
                    <Typography
                      variant="body1"
                      fontFamily="sans"
                      className="text-gray-600 mb-4 group-hover:opacity-70 transition-opacity"
                    >
                      {service.service_description ||
                        "Explore our services and discover what we can create together."}
                    </Typography>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center mt-4">
                      <Typography
                        variant="body2"
                        fontFamily="sans"
                        fontWeight="medium"
                        className="text-gray-900 mr-2"
                      >
                        Learn more
                      </Typography>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="transform transition-transform group-hover:translate-x-1"
                      >
                        <path
                          d="M1 8H15M15 8L8 1M15 8L8 15"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>

                  <div
                    className="md:min-w-[400px] rounded-lg max-h-[400px] aspect-square transition-transform duration-700 ease-in-out group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${service.service_image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10">
              <p>No services found</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
