
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBAU2lZpIzbw8Ja1aTfo33CGPgK9SlSNF0",
    authDomain: "openappdb.firebaseapp.com",
    projectId: "openappdb",
    storageBucket: "openappdb.appspot.com",
    messagingSenderId: "350532146343",
    appId: "1:350532146343:web:bbc9646173826b476a7782",
    measurementId: "G-X6Q9HPMMNK"
};


export const FB_APP = initializeApp(firebaseConfig);
export const FB_AUTH = getAuth(FB_APP);
export const FB_FIRESTORE = getFirestore();
export const FB_STORAGE = getStorage(FB_APP);