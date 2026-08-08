import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAaVQYXukbTzDnsZSumsfDCvIB72OZ4mQQ",
  authDomain: "postai-uz.firebaseapp.com",
  projectId: "postai-uz",
  storageBucket: "postai-uz.firebasestorage.app",
  messagingSenderId: "1081142460903",
  appId: "1:1081142460903:web:c8c874a65bb8c2132d7d42"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)