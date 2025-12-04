import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBpLq-DRcR-FHnApyo_gGZjHqW3G5Tp_KI",
  authDomain: "chatapp-aeaab.firebaseapp.com",
  projectId: "chatapp-aeaab",
  storageBucket: "chatapp-aeaab.firebasestorage.app",
  messagingSenderId: "933647409512",
  appId: "1:933647409512:web:b5f23a5c8617a7f50df6dd",
  measurementId: "G-T762WRTDGM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const messagesCollection = collection(db, "messages");
export const storage = getStorage(app);

export default app;
