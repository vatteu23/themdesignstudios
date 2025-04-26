import { useState, useEffect } from "react";
import Link from "next/link";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const servicesRef = ref(db, "services");

    const unsubscribe = onValue(servicesRef, (snapshot) => {
      const servicesData = snapshot.val();
      if (servicesData) {
        const servicesArray = Object.keys(servicesData).map((key) => ({
          id: key,
          ...servicesData[key],
        }));
        setServices(servicesArray);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Our Services</h1>

      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {services.map((service) => (
            <div key={service.id} className="col-md-4 mb-4">
              <div className="card h-100">
                {service.imageUrl && (
                  <img
                    src={service.imageUrl}
                    className="card-img-top"
                    alt={service.title}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{service.title}</h5>
                  <p className="card-text">{service.description}</p>
                  <Link
                    href={`/services/${service.id}`}
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
