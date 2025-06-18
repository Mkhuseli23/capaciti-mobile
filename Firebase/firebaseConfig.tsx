// firebaseConfig.ts

// Import necessary Firebase functions
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { doc, Firestore, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";

// Your Firebase web app configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9CnLNi-u84JL7B250gIOAYE2E1hUU9TA",
  authDomain: "portal-a878c.firebaseapp.com",
  projectId: "portal-a878c",
  storageBucket: "portal-a878c.firebasestorage.app",
  messagingSenderId: "436044585193",
  appId: "1:436044585193:web:cc2050be51bbb6b200b878",
  measurementId: "G-4C5501WT1M",
};

// Initialize Firebase app
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize services
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

// Export services and Firestore helpers
export { auth, db, doc, getDoc, setDoc, storage };

