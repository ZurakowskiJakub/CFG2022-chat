// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBJs2iNqsgmmTOOIxlFgvLSUIGup0eOezk",
    authDomain: "cfg2022-chat.firebaseapp.com",
    databaseURL:
        "https://cfg2022-chat-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "cfg2022-chat",
    storageBucket: "cfg2022-chat.appspot.com",
    messagingSenderId: "336310880422",
    appId: "1:336310880422:web:8a7205d5de2968c354cc67",
    measurementId: "G-P9M3NMZV3T",
};

// Initialize Firebase
export const initFirebase = () => {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const database = getDatabase(app);

    return [app, analytics, database];
};
