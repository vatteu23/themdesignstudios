import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getDatabase, Database } from "firebase/database";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getFirestore, Firestore } from "firebase/firestore";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const config: FirebaseConfig = {
  apiKey: "AIzaSyAWvWlPb7SDSbPgSVxbLQdDudZhYaGt-cI",
  authDomain: "bythem-f0fdb.firebaseapp.com",
  databaseURL: "https://bythem-f0fdb.firebaseio.com",
  projectId: "bythem-f0fdb",
  storageBucket: "bythem-f0fdb.appspot.com",
  messagingSenderId: "1016948882454",
  appId: "1:1016948882454:web:be72974fb1ed51ed",
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(config);

// Get Firebase services
export const db: Database = getDatabase(app);
export const fbStorage: FirebaseStorage = getStorage(app);
export const fbAuth: Auth = getAuth(app);
export const firestore: Firestore = getFirestore(app);

export default app;
