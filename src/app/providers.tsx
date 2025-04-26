"use client";

import React from "react";
import { Provider } from "react-redux";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import store from "../js/store";
import { fbAuth } from "../firebase";
import { UPDATE_USER, SIGN_OUT } from "../js/actions";
import fetchUserDetails from "../js/actioncreators/getUserDetails";
import ClientSideOnly from "../components/ClientSideOnly";

export function Providers({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    // Import bootstrap JS only on client side
    import("bootstrap/dist/js/bootstrap");

    // Setup Firebase auth listener
    const unsubscribe = onAuthStateChanged(fbAuth, (user) => {
      if (user) {
        // Serialize the user object to avoid dispatching non-serializable values
        const serializedUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          // Add any other needed properties, but only include serializable ones
        };

        store.dispatch(UPDATE_USER(serializedUser));
        store.dispatch(fetchUserDetails(user)); // Keep using full user object for fetching details
        setAuthenticated(true);
        setCurrentUser(user.email);
      } else {
        store.dispatch(SIGN_OUT());
        setAuthenticated(false);
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      {!loading && children}
      <ClientSideOnly>
        {authenticated && currentUser && <AdminBar currentUser={currentUser} />}
      </ClientSideOnly>
    </Provider>
  );
}

// Admin navigation bar component
function AdminBar({ currentUser }: { currentUser: string }) {
  const handleSignOut = () => {
    fbAuth
      .signOut()
      .then(() => {
        store.dispatch(SIGN_OUT());
      })
      .catch(function (error) {
        console.error("Sign out error:", error);
      });
  };

  return (
    <div className="container mt-5">
      <div className="d-flex flex-row">
        <div
          className="d-flex flex-column"
          style={{
            padding: "25px",
          }}
        >
          <ul className="list-group list-group-horizontal-md">
            <li className="list-group-item">
              <a href="/profile" className="align-self-center">
                <span className="mr-3">👤</span>
                {currentUser}
              </a>
            </li>
            <li className="list-group-item">
              <a href="/them-admin" className="align-self-center">
                <span className="mr-3">🏠</span>HOME
              </a>
            </li>
            <li className="list-group-item">
              <a href="/emails" className="">
                <span className="mr-3">✉️</span>EMAILS
              </a>
            </li>
            <li className="list-group-item">
              <a href="/feedbacks" className="">
                <span className="mr-3">⭐</span>FeedBacks
              </a>
            </li>
            <li className="list-group-item bg-danger ">
              <a
                className="text-white"
                onClick={handleSignOut}
                style={{ cursor: "pointer" }}
              >
                <span className="mr-3">⚡</span>SIGN OUT
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
