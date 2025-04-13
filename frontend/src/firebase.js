import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyB-sItsZ_1YgColAz06v3kNKAXec8YQYrc",
  authDomain: "gestorelectric-dpsk.firebaseapp.com",
  projectId: "gestorelectric-dpsk",
  storageBucket: "gestorelectric-dpsk.firebasestorage.app",
  messagingSenderId: "179968959437",
  appId: "1:179968959437:web:b5141387c02544b7889a84"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, db };
