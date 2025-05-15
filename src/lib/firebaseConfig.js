// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHAymtZ9MHtyZ0Dmmy9Crle9tqU6lvTso",
  authDomain: "agence-de-voyage-bb293.firebaseapp.com",
  projectId: "agence-de-voyage-bb293",
  storageBucket: "agence-de-voyage-bb293.firebasestorage.app",
  messagingSenderId: "985899178047",
  appId: "1:985899178047:web:a83759501845200b31808a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app); // Firebase Authentication
const db = getFirestore(app); // Firestore Database
const storage = getStorage(app);

export { app, auth, db, storage };
