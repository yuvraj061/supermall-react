// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxpLe0cYZWx6WN5Z5VFbctb4I8wDGjfmw",
  authDomain: "supermall-d4ba3.firebaseapp.com",
  projectId: "supermall-d4ba3",
  storageBucket: "supermall-d4ba3.appspot.com",
  messagingSenderId: "528575550342",
  appId: "1:528575550342:web:8d1bb8573f8f1a36581207"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore Database
export const db = getFirestore(app);

export default app; 