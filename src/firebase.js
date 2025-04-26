import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: "AIzaSyAWvWlPb7SDSbPgSVxbLQdDudZhYaGt-cI",
  authDomain: "bythem-f0fdb.firebaseapp.com",
  databaseURL: "https://bythem-f0fdb.firebaseio.com",
  projectId: "bythem-f0fdb",
  storageBucket: "bythem-f0fdb.appspot.com",
  messagingSenderId: "1016948882454",
  appId: "1:1016948882454:web:be72974fb1ed51ed",
};

// Initialize Firebase
const app = initializeApp(config);

// Get Firebase services
export const db = getDatabase(app);
export const fbStorage = getStorage(app);
export const fbAuth = getAuth(app);
export const firestore = getFirestore(app);

export default app;
