import { useState, useEffect } from "react";
import Link from "next/link";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

export default function Admin() {
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch services
    const servicesRef = ref(db, "services");
    const unsubscribeServices = onValue(servicesRef, (snapshot) => {
      const servicesData = snapshot.val();
      if (servicesData) {
        const servicesArray = Object.keys(servicesData).map((key) => ({
          id: key,
          ...servicesData[key],
        }));
        setServices(servicesArray);
      }
    });

    // Fetch projects
    const projectsRef = ref(db, "projects");
    const unsubscribeProjects = onValue(projectsRef, (snapshot) => {
      const projectsData = snapshot.val();
      if (projectsData) {
        const projectsArray = Object.keys(projectsData).map((key) => ({
          id: key,
          ...projectsData[key],
        }));
        setProjects(projectsArray);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeServices();
      unsubscribeProjects();
    };
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Admin Dashboard</h1>

      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="mb-0">Services</h5>
                </div>
                <div className="card-body">
                  <p>Total Services: {services.length}</p>
                  <Link href="/addservice" className="btn btn-primary">
                    Add New Service
                  </Link>
                  <Link href="/editservice" className="btn btn-secondary ml-2">
                    Edit Services
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="mb-0">Projects</h5>
                </div>
                <div className="card-body">
                  <p>Total Projects: {projects.length}</p>
                  <Link href="/addproject" className="btn btn-primary">
                    Add New Project
                  </Link>
                  <Link href="/editproject" className="btn btn-secondary ml-2">
                    Edit Projects
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Content Management</h5>
                </div>
                <div className="card-body">
                  <Link
                    href="/pagecontents"
                    className="btn btn-primary mb-2 d-block"
                  >
                    Manage Page Contents
                  </Link>
                  <Link
                    href="/webimages"
                    className="btn btn-primary mb-2 d-block"
                  >
                    Manage Images
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Communication</h5>
                </div>
                <div className="card-body">
                  <Link href="/emails" className="btn btn-primary mb-2 d-block">
                    View Emails
                  </Link>
                  <Link
                    href="/createreviewlinks"
                    className="btn btn-primary mb-2 d-block"
                  >
                    Create Review Links
                  </Link>
                  <Link href="/feedbacks" className="btn btn-primary d-block">
                    View Feedbacks
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
