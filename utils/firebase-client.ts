import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDZ_xh_Qf8xwBTMFwUxbkPigAMfGSQ9PoE",
  databaseURL: "https://tompasoft-fetcher-default-rtdb.europe-west1.firebasedatabase.app/",
  authDomain: "tompasoft-fetcher.firebaseapp.com",
  projectId: "tompasoft-fetcher",
  storageBucket: "tompasoft-fetcher.appspot.com",
  messagingSenderId: "317183799881",
  appId: "1:317183799881:web:44cb1eb3b918daba9fc598",
};

const app = initializeApp(firebaseConfig);

export const authClient = getAuth(app);
export const authProvider = new GoogleAuthProvider();

export const database = getDatabase(app);
