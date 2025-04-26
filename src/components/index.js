import React from "react";
import Link from "next/link";

export default function IndexPage() {
  return (
    <div className="container">
      <div className="jumbotron mt-4">
        <h1 className="display-4">Welcome to theM Studios</h1>
        <p className="lead">
          We excel in providing clients with designs with perfect blend in form
          and function
        </p>
        <hr className="my-4" />
        <p>
          Explore our services and portfolio to see how we can help bring your
          vision to life.
        </p>
        <Link href="/services" className="btn btn-primary btn-lg">
          Our Services
        </Link>
      </div>

      <div className="row mt-5">
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Web Design</h5>
              <p className="card-text">
                Custom website design that aligns with your brand and business
                goals.
              </p>
              <Link
                href="/services/web-design"
                className="btn btn-outline-primary"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Graphic Design</h5>
              <p className="card-text">
                Eye-catching visual content for your brand, from logos to
                marketing materials.
              </p>
              <Link
                href="/services/graphic-design"
                className="btn btn-outline-primary"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">UI/UX Design</h5>
              <p className="card-text">
                User-centered design that enhances the experience and
                satisfaction of your users.
              </p>
              <Link
                href="/services/ui-ux-design"
                className="btn btn-outline-primary"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
