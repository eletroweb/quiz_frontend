import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCbDVa6gjfdmyWqsAvCkBlAVyCsjaMDSUE",
    authDomain: "quiz-481bc.firebaseapp.com",
    projectId: "quiz-481bc",
    storageBucket: "quiz-481bc.firebasestorage.app",
    messagingSenderId: "359782133352",
    appId: "1:359782133352:web:e2c3e00f7c3aa86ed095dd",
    measurementId: "G-RCFN6L4BGD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
