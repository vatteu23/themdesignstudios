"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { db } from "../../../firebase";
import {
  ref,
  onValue,
  query,
  orderByChild,
  equalTo,
  get,
} from "firebase/database";
import { motion } from "framer-motion";
import Gallery, { GalleryImage } from "../../../components/Gallery";
import { MapPinIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function ProjectDetail() {
  const params = useParams<{ projectname: string }>();
  const projectname = params?.projectname || "";
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [photosList, setPhotosList] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectname) return;

    // Set document title based on project name
    document.title = projectname;

    // Get project details by page name
    getProjectDetailsByPageName(projectname);
  }, [projectname]);

  const getImagesByProject = (projectId: string) => {
    const projectImagesRef = ref(db, "projectimages");

    // Using query with orderByChild and equalTo as in the old implementation
    const imagesQuery = query(
      projectImagesRef,
      orderByChild("image_projectid"),
      equalTo(projectId)
    );

    onValue(imagesQuery, (snapshot) => {
      if (snapshot.exists()) {
        const imagesData = snapshot.val();
        const photosList: GalleryImage[] = [];

        Object.keys(imagesData).forEach((id) => {
          photosList.push({
            src: imagesData[id]["image_projectimage"],
            caption: imagesData[id]["image_caption"],
          });
        });

        setPhotosList(photosList);
      } else {
        setPhotosList([]);
      }
      setLoading(false);
    });
  };

  const getProjectDetailsByPageName = (pageName: string) => {
    const projectsRef = ref(db, "projects");

    // Query for the specific project by pagename
    const projectQuery = query(
      projectsRef,
      orderByChild("project_pagename"),
      equalTo(pageName)
    );

    onValue(projectQuery, (snapshot) => {
      if (snapshot.exists()) {
        // Get the first child that matches
        let projectData = null;
        let projectKey = "";

        snapshot.forEach((childSnapshot) => {
          projectData = childSnapshot.val();
          projectKey = childSnapshot.key as string;
          return true; // Break after first match
        });

        if (projectData) {
          document.title = projectData["project_name"] || pageName;
          setProjectDetails(projectData);

          // Get images for this project
          if (projectKey) {
            getImagesByProject(projectKey);
          }
        } else {
          setError("Project not found");
          setLoading(false);
        }
      } else {
        setError("Project not found");
        setLoading(false);
      }
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !projectDetails) {
    return (
      <div className="container mx-auto  py-16">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <h3 className="font-bold text-lg">Error:</h3>
          <p>{error || "Project not found"}</p>
          <Link
            href="/portfolio"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Return to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-white"
    >
      <div className="container mx-auto py-12">
        {/* Modern header section */}
        <Link
          href="/portfolio"
          className="inline-flex items-center mb-8 text-gray-700 hover:text-gray-900 font-medium"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Portfolio
        </Link>
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
            {projectDetails.project_name}
          </h1>

          <div className="flex flex-wrap items-center text-gray-600 mb-6">
            <span className="mr-2 text-lg font-light">
              {projectDetails.project_type || "Planning & Interior Design"}
            </span>

            {projectDetails.project_location && (
              <>
                <span className="mx-2 text-gray-400">•</span>
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-1 text-gray-500" />
                  <span>{projectDetails.project_location}</span>
                </div>
              </>
            )}

            {projectDetails.project_date && (
              <>
                <span className="mx-2 text-gray-400">•</span>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{projectDetails.project_date}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Client info cards - only show if additional info exists */}
        {(projectDetails.project_client ||
          projectDetails.project_budget ||
          projectDetails.project_duration) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {projectDetails.project_client && (
              <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
                <div className="px-4 py-5">
                  <h3 className="text-lg font-medium text-gray-900">Client</h3>
                  <p className="mt-1 text-gray-600">
                    {projectDetails.project_client}
                  </p>
                </div>
              </div>
            )}

            {projectDetails.project_budget && (
              <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
                <div className="px-4 py-5">
                  <h3 className="text-lg font-medium text-gray-900">Budget</h3>
                  <p className="mt-1 text-gray-600">
                    {projectDetails.project_budget}
                  </p>
                </div>
              </div>
            )}

            {projectDetails.project_duration && (
              <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
                <div className="px-4 py-5">
                  <h3 className="text-lg font-medium text-gray-900">
                    Duration
                  </h3>
                  <p className="mt-1 text-gray-600">
                    {projectDetails.project_duration}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Gallery */}
        <div className="mb-12">
          {photosList.length > 0 ? (
            <Gallery images={photosList} />
          ) : projectDetails.project_image ? (
            <div className="text-center">
              <img
                src={projectDetails.project_image}
                alt={projectDetails.project_name}
                className="mx-auto max-h-[500px] rounded-lg object-cover"
              />
            </div>
          ) : null}
        </div>

        {/* Project details/content */}
        {projectDetails.project_content && (
          <div className="mb-12">
            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
              <div className="px-6 py-5">
                <h2 className="text-xl font-semibold text-gray-900">
                  Project Details
                </h2>
                <div
                  className="mt-4 prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: projectDetails.project_content,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
