import { type FirebaseOptions, initializeApp } from "firebase/app";
import type { AppContext } from "./types";

export function getFirebaseApp(c: AppContext) {
  const options: FirebaseOptions = {
    apiKey: c.env.FIREBASE_API_KEY,
    authDomain: c.env.FIREBASE_AUTH_DOMAIN,
    projectId: c.env.FIREBASE_PROJECT_ID,
    storageBucket: c.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: c.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: c.env.FIREBASE_APP_ID,
  };

  return initializeApp(options);
}
