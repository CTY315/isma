import firebase from "firebase/app";
import "firebase/auth";
// import "firebase/database";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_GOOGLE_FIREBASE_KEY,
  authDomain: "bulk-sharing-react-native-app.firebaseapp.com",
  databaseURL: "https://bulk-sharing-react-native-app.firebaseio.com",
  projectId: "bulk-sharing-react-native-app",
  storageBucket: "bulk-sharing-react-native-app.appspot.com",
  messagingSenderId: "252214914685",
  appId: "1:252214914685:web:a65878a177073134c1cb14",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth;
export const db = firebase.firestore();
