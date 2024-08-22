// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8uyS9xTqrsza6TOLOcDUBgFxnJVy7C3o",
  authDomain: "pantry-tracker-app-a8af3.firebaseapp.com",
  projectId: "pantry-tracker-app-a8af3",
  storageBucket: "pantry-tracker-app-a8af3.appspot.com",
  messagingSenderId: "994297302405",
  appId: "1:994297302405:web:8ed9d37be9d6946eeac8ec",
  measurementId: "G-WE1D9TGBLY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
export { firestore };
