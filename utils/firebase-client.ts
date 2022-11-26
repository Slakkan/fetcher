"use client";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDZ_xh_Qf8xwBTMFwUxbkPigAMfGSQ9PoE",
  authDomain: "tompasoft-fetcher.firebaseapp.com",
  databaseURL: "https://tompasoft-fetcher-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tompasoft-fetcher",
  storageBucket: "tompasoft-fetcher.appspot.com",
  messagingSenderId: "317183799881",
  appId: "1:317183799881:web:1bb0015cbf0401429fc598",
};

export const app = initializeApp(firebaseConfig);

export const authClient = getAuth(app);
export const authProvider = new GoogleAuthProvider();

export const dbClient = getDatabase(app);
