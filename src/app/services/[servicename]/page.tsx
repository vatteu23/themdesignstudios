"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../firebase";
import { ref, onValue } from "firebase/database";
import { Service, Project } from "../../../types";
import Link from "next/link";
import Typography from "@/components/Typography";
import { motion } from "framer-motion";

export default function ServiceDetail() {
  const params = useParams<{ servicename: string }>();
  const servicename = params?.servicename || "";
  const [service, setService] = useState<Service | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!servicename) return;

    try {
      // Fetch service details from Firebase based on URL param
      const servicesRef = ref(db, "services");
      const unsubscribe = onValue(servicesRef, (snapshot) => {
        const servicesData = snapshot.val();
        if (servicesData) {
          const serviceArray = Object.keys(servicesData).map((key) => ({
            id: key,
            ...servicesData[key],
          }));

          // First try to find by service_pagename
          let foundService = serviceArray.find(
            (s) => s.service_pagename === servicename
          );

          // If not found, try by formatted service_name
          if (!foundService) {
            foundService = serviceArray.find(
              (s) =>
                s.service_name &&
                s.service_name.toLowerCase().replace(/\s+/g, "-") ===
                  servicename
            );
          }

          if (foundService) {
            setService(foundService);

            // If service has related projects, fetch them
            if (
              foundService.service_projects &&
              foundService.service_projects.length > 0
            ) {
              fetchRelatedProjects(foundService.service_projects);
            }
          } else {
            setError("Service not found");
          }
        } else {
          setError("No services data available");
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Error fetching service:", err);
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  }, [servicename]);

  const fetchRelatedProjects = (projectIds: string[]) => {
    const projectsRef = ref(db, "projects");
    onValue(projectsRef, (snapshot) => {
      const projectsData = snapshot.val();
      if (projectsData) {
        const projects = projectIds
          .filter((id) => projectsData[id]) // Filter out any invalid IDs
          .map((id) => ({
            id,
            ...projectsData[id],
            // Map old project fields to new format if needed
            title: projectsData[id].project_name || projectsData[id].title,
            description:
              projectsData[id].project_description ||
              projectsData[id].description,
            imageUrl:
              projectsData[id].project_image || projectsData[id].imageUrl,
          }));
        setRelatedProjects(projects);
      }
    });
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
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

  if (loading) {
    return (
      <div className="container mt-5 text-center py-12 md:py-20">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container mt-5 py-12 md:py-20">
        <div className="alert alert-danger">
          <h3>Error:</h3>
          <p>{error || "Service not found"}</p>
          <Link href="/services" className="btn btn-primary">
            Return to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <Link
          href="/services"
          className="inline-flex items-center text-gray-800 hover:text-gray-600 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 transform rotate-180"
          >
            <path
              d="M1 8H15M15 8L8 1M15 8L8 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Typography variant="body2" fontFamily="sans" fontWeight="medium">
            Back to Services
          </Typography>
        </Link>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mb-16"
      >
        <div className="mb-12 flex flex-col md:flex-row md:justify-between gap-8">
          <div className="flex-1">
            <Typography
              variant="pageTitle"
              component={"h1"}
              fontFamily="sans"
              fontWeight="semibold"
              className="mb-6"
            >
              {service.service_name}
            </Typography>

            <Typography
              variant="body1"
              fontFamily="sans"
              className="text-gray-600 max-w-3xl"
            >
              {service.service_description}
            </Typography>
          </div>

          {service.service_image && (
            <div
              className="md:min-w-[400px] rounded-lg aspect-square"
              style={{
                backgroundImage: `url(${service.service_image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}
        </div>
      </motion.div>

      {relatedProjects.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mt-16"
        >
          <Typography
            variant="h2"
            component={"h2"}
            fontFamily="sans"
            fontWeight="semibold"
            className="mb-8"
          >
            Related Projects
          </Typography>

          <div className="flex flex-col space-y-10">
            {relatedProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={fadeIn}
                className="border-t border-stone-700/20 pt-10"
              >
                <Link
                  href={`/project/${project.project_pagename || ""}`}
                  className="flex flex-col md:flex-row gap-6 group md:justify-between"
                >
                  <div className="flex-1 max-w-2xl pr-4">
                    <Typography
                      variant="h3"
                      fontFamily="sans"
                      className="mb-3 group-hover:opacity-70 transition-opacity"
                      fontWeight="medium"
                    >
                      {project.title || "Project"}
                    </Typography>
                    <Typography
                      variant="body1"
                      fontFamily="sans"
                      className="text-gray-600 mb-4 group-hover:opacity-70 transition-opacity"
                    >
                      {project.description || "No description available"}
                    </Typography>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center mt-4">
                      <Typography
                        variant="body2"
                        fontFamily="sans"
                        fontWeight="medium"
                        className="text-gray-900 mr-2"
                      >
                        View project
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

                  {project.imageUrl && (
                    <div
                      className="min-w-[400px] rounded-lg max-h-[400px] aspect-square transition-transform duration-700 ease-in-out group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${project.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
