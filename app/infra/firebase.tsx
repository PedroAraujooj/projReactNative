import {getApps, initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD6VLuKG1mZW8v0lPXmDRpYXG6fOgRPxG0",
  authDomain: "react-3b70c.firebaseapp.com",
  projectId: "react-3b70c",
  storageBucket: "react-3b70c.appspot.com",
  messagingSenderId: "881281208334",
  appId: "1:881281208334:web:c33b4eda47ada3e4622c5f",
  databaseURL: "https://react-3b70c-default-rtdb.firebaseio.com/"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export default app;
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
