import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD8WVqZtzOc44onw1T_x2MsDxzaNKv9I2k",
    authDomain: "arena-warzone-league.firebaseapp.com",
    projectId: "arena-warzone-league",
    storageBucket: "arena-warzone-league.firebasestorage.app",
    messagingSenderId: "726417186809",
    appId: "1:726417186809:web:3e707a3d4b59c5f29da728"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;