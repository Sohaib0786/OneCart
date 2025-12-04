import {getAuth, GoogleAuthProvider} from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY ,
  authDomain: "loginonecart-256a4.firebaseapp.com",
  projectId: "loginonecart-256a4",
  storageBucket: "loginonecart-256a4.firebasestorage.app",
  messagingSenderId: "570075001622",
  appId: "1:570075001622:web:2bb51ab2c6308f050e1637"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()


export {auth , provider}

