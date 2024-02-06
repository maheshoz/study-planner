// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-e5c13.firebaseapp.com",
  projectId: "mern-estate-e5c13",
  storageBucket: "mern-estate-e5c13.appspot.com",
  messagingSenderId: "933850926960",
  appId: "1:933850926960:web:8092df3f63aec3e93bc9b5"
};
// console.log(firebaseConfig);
// Initialize Firebase
export const app = initializeApp(firebaseConfig);