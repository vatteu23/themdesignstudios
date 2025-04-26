import { createReducer } from "@reduxjs/toolkit";
import {
  FETCH_USERDETAILS_PENDING,
  FETCH_USERDETAILS_SUCCESS,
  FETCH_USERDETAILS_ERROR,
} from "../actions/index";

const initialState = {
  pending: false,
  userDetails: [],
  error: null,
};

const handleUserReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(FETCH_USERDETAILS_PENDING, (state) => {
      state.pending = true;
    })
    .addCase(FETCH_USERDETAILS_SUCCESS, (state, action) => {
      state.pending = false;
      state.userDetails = action.payload.userDetails;
      state.error = null;
    })
    .addCase(FETCH_USERDETAILS_ERROR, (state, action) => {
      state.pending = false;
      state.error = action.payload.error;
    });
});

export const getUserDetails = (state) => state.userDetails.userDetails;
export const getUserDetailsPending = (state) => state.userDetails.pending;
export const getUserDetailsError = (state) => state.userDetails.error;

export default handleUserReducer;
