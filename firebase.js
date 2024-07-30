import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

let app;
let analytics;
let auth;
let storage;

if (!getApps().length) {
  const firebaseConfig = {
    apiKey: "your_api_key",
    authDomain: "your_authDomain",
    projectId: "your_project_Id",
    storageBucket: "your_storage_Bucket",
    messagingSenderId: "your_messaging_Sender_Id",
    appId: "your_app_id",
  };

  app = initializeApp(firebaseConfig);

  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log("Session persistence enabled");
    })
    .catch((error) => {
      console.error("Error enabling session persistence:", error.message);
    });

  if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
  }

  storage = getStorage(app);
}

export { app, auth };
