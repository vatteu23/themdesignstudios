import { ref, get } from "firebase/database";
import { db } from "../../firebase";
import {
  fetchUserDetailsPending,
  fetchUserDetailsSuccess,
  fetchUserDetailsError,
} from "../actions/index";

const fetchUserDetails = (user) => {
  return async (dispatch) => {
    dispatch(fetchUserDetailsPending());
    try {
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);
      const userDetails = snapshot.val();
      dispatch(fetchUserDetailsSuccess(userDetails));
      return userDetails;
    } catch (error) {
      dispatch(fetchUserDetailsError(error));
      return null;
    }
  };
};

export default fetchUserDetails;
