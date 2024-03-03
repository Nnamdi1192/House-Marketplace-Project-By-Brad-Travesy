// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1Srzd63iTMjgS9LcDIS9CK4NnQRZ-x8c",
  authDomain: "house-marketplace-app-88470.firebaseapp.com",
  projectId: "house-marketplace-app-88470",
  storageBucket: "house-marketplace-app-88470.appspot.com",
  messagingSenderId: "173330627405",
  appId: "1:173330627405:web:1052c709be0fba22209504",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
