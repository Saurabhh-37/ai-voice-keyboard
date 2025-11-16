import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

// Firebase configuration
// Using provided config values (can also use environment variables)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB0XSWtpPpkMAK6aAnBdo7TaEVPfZFtZTY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "voice-keyboard-272ad.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "voice-keyboard-272ad",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "voice-keyboard-272ad.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "924685751878",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:924685751878:web:6a22cd85d12db0cc599c47",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-3DKHQX7BL6",
};

// Validate Firebase config
const isConfigValid = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
};

// Initialize Firebase
let app: FirebaseApp | undefined;
let auth: Auth | undefined;

if (typeof window !== "undefined") {
  // Only initialize on client side
  if (!isConfigValid()) {
    console.warn(
      "Firebase configuration is missing. Please set up your .env.local file with Firebase credentials."
    );
  } else {
    try {
      if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
      } else {
        app = getApps()[0];
      }
      auth = getAuth(app);
    } catch (error) {
      console.error("Firebase initialization error:", error);
    }
  }
}

export { auth };
export default app;

