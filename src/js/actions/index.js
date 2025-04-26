import { createAction } from "@reduxjs/toolkit";

export const FETCH_USERDETAILS_PENDING = "FETCH_USERDETAILS_PENDING";
export const FETCH_USERDETAILS_SUCCESS = "FETCH_USERDETAILS_SUCCESS";
export const FETCH_USERDETAILS_ERROR = "FETCH_USERDETAILS_ERROR";

/** Update user details when the firebase authentication is changed */
export const UPDATE_USER = createAction("UPDATE_USER", (auth) => ({
  payload: { auth },
}));

/** Update the store as the user signs out */
export const SIGN_OUT = createAction("SIGNOUT_USER");

export const fetchUserDetailsPending = createAction(FETCH_USERDETAILS_PENDING);
export const fetchUserDetailsSuccess = createAction(
  FETCH_USERDETAILS_SUCCESS,
  (userDetails) => ({
    payload: { userDetails },
  })
);
export const fetchUserDetailsError = createAction(
  FETCH_USERDETAILS_ERROR,
  (error) => ({
    payload: { error },
  })
);
