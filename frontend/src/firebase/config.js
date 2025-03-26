// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getAnalytics } from "firebase/analytics"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsO_qKuqetpR1vJex4lxtLBWYD3UhDtYA",
  authDomain: "erental-c0bf5.firebaseapp.com",
  projectId: "erental-c0bf5",
  storageBucket: "erental-c0bf5.appspot.com",
  messagingSenderId: "926634602740",
  appId: "1:926634602740:web:c62101405da6d9e89eeea1",
  measurementId: "G-YHTZE8T4W3",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const auth = getAuth(app)

export { auth }

