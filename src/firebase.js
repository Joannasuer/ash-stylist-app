import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ?? REPLACE THESE WITH YOUR OWN FIREBASE KEYS LATER
const firebaseConfig = {
  apiKey: "AIzaSyDs7VMXEjxnXaqcLEltzEZowlMnglZzF0c",
  authDomain: "ash-stylist-app.firebaseapp.com",
  projectId: "ash-stylist-app",
  storageBucket: "ash-stylist-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);