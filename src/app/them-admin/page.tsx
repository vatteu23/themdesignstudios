"use client";

import React from "react";
import { Provider } from "react-redux";
import store from "../../js/store";
import PrivateRoute from "../../components/privateroute";
import Admin from "../../components/admin";
import ClientSideOnly from "../../components/ClientSideOnly";

export default function AdminPage() {
  return (
    <ClientSideOnly>
      <Provider store={store}>
        <AdminContent />
      </Provider>
    </ClientSideOnly>
  );
}

// Separate component to access Redux after hydration
function AdminContent() {
  // Get authentication state from store directly
  const authenticated = store.getState().useractivity.authenticated;

  return (
    <PrivateRoute authenticated={authenticated}>
      <Admin />
    </PrivateRoute>
  );
}
