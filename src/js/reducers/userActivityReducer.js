import { createReducer } from "@reduxjs/toolkit";
import { UPDATE_USER, SIGN_OUT } from "../actions/index";

const initialState = {
  authenticated: false,
  currentUser: null,
};

const userActivityReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(UPDATE_USER, (state, action) => {
      state.authenticated = true;
      state.currentUser = action.payload.auth.email;
    })
    .addCase(SIGN_OUT, (state) => {
      state.authenticated = false;
      state.currentUser = null;
    });
});

export default userActivityReducer;
