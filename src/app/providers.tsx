"use client";

import React from "react";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import store from "../js/store";
import { fbAuth } from "../firebase";
import { UPDATE_USER, SIGN_OUT } from "../js/actions";
import fetchUserDetails from "../js/actioncreators/getUserDetails";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");

    const unsubscribe = onAuthStateChanged(fbAuth, (user) => {
      if (user) {
        const serializedUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
        };

        store.dispatch(UPDATE_USER(serializedUser));
        store.dispatch(fetchUserDetails(user));
      } else {
        store.dispatch(SIGN_OUT());
      }
    });

    return () => unsubscribe();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
