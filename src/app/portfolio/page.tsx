"use client";

import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";
import Link from "next/link";
import { Project, Service } from "../../types";
import Typography from "@/components/Typography";
import { motion } from "framer-motion";

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Record<string, any>>({});
  const [categories, setCategories] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    // Fetch projects
    const projectsRef = ref(db, "projects");
    const unsubscribeProjects = onValue(projectsRef, (snapshot) => {
      const projectsData = snapshot.val();
      if (projectsData) {
        setProjects(projectsData);
      }
      setLoading(false);
    });

    // Fetch services for categories
    const servicesRef = ref(db, "services");
    const unsubscribeServices = onValue(servicesRef, (snapshot) => {
      const servicesData = snapshot.val();
      if (servicesData) {
        const servicesArray = Object.keys(servicesData).map((key) => ({
          id: key,
          ...servicesData[key],
        }));
        // Filter out categories without a title
        const validCategories = servicesArray.filter(
          (category) => category.title || category.service_name
        );
        setCategories(validCategories);
      }
    });

    return () => {
      unsubscribeProjects();
      unsubscribeServices();
    };
  }, []);

  // Filter projects based on selected category
  const filteredProjects =
    filter === "all"
      ? Object.keys(projects)
      : Object.keys(projects).filter((id) => {
          const project = projects[id];
          return project.project_service === filter;
        });

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
      <div className="mb-12 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <Typography
          variant="pageTitle"
          component={"h1"}
          fontFamily="sans"
          gutterBottom
          fontWeight="semibold"
          className="text-text-dark"
        >
          Portfolio
        </Typography>
        <Typography
          variant="body1"
          fontFamily="sans"
          className="max-w-xl text-secondary"
        >
          Browse through our completed projects and see how we've helped clients
          bring their vision to life.
        </Typography>
      </div>

      {loading ? (
        <div className="flex justify-center my-5">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Project Filters */}
          {/* <div className="mb-8">
            <div className="flex flex-wrap gap-2 bg-primary p-4 rounded-lg">
              <button
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === "all"
                    ? "bg-secondary text-primary"
                    : "bg-white hover:bg-card-bg border border-secondary/20"
                }`}
                onClick={() => setFilter("all")}
              >
                All Projects
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === category.id
                      ? "bg-secondary text-primary"
                      : "bg-white hover:bg-card-bg border border-secondary/20"
                  }`}
                  onClick={() => setFilter(category.id)}
                >
                  {category.title ||
                    category.service_name ||
                    "Unnamed Category"}
                </button>
              ))}
            </div>
          </div> */}

          {/* Projects Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {filteredProjects.length > 0 ? (
              filteredProjects.map((id) => {
                const project = projects[id];
                // Generate a background color based on our theme
                const bgColor = `hsl(${(parseInt(id, 16) % 20) + 35}, 35%, 92%)`;

                return (
                  <motion.div
                    key={id}
                    variants={itemVariants}
                    className="h-full"
                  >
                    <Link
                      href={`/project/${
                        project.project_pagename ||
                        (project.project_name || "project")
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                      }`}
                      className="group flex flex-col lg:flex-row lg:items-center gap-5 p-6 rounded-lg transition-all bg-stone-700/10 h-full"
                    >
                      <div className="flex-1 order-2 lg:order-1">
                        <div className="border-l-4 border-secondary pl-3 mb-3">
                          <Typography
                            variant="h4"
                            fontFamily="sans"
                            className="group-hover:opacity-70 transition-opacity text-text-dark"
                            fontWeight="medium"
                          >
                            {project.project_name || "Unnamed Project"}
                          </Typography>
                          <Typography
                            variant="body2"
                            fontFamily="sans"
                            className="text-secondary group-hover:opacity-70 transition-opacity mt-1"
                          >
                            {project.project_location || ""}
                          </Typography>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center mt-4 py-1 px-2 rounded-full w-fit">
                          <Typography
                            variant="body2"
                            fontFamily="sans"
                            fontWeight="medium"
                            className="text-text-dark mr-2"
                          >
                            View Details
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
                        className="rounded-lg overflow-hidden w-full h-[200px] lg:h-[150px] lg:w-[150px] order-1 lg:order-2 flex-shrink-0 transition-transform duration-700 ease-in-out group-hover:scale-105 hover:shadow-sm"
                        style={{
                          backgroundImage: `url(${project.project_image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      ></div>
                    </Link>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-2 text-center py-10 bg-primary rounded-lg border border-secondary/20">
                <p className="text-text-dark">
                  No projects found in this category.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
