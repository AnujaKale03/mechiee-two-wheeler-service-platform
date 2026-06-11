import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6w5fjfj5vRy-Tl3XKUH8kwGdfAeotG6R0",
  authDomain: "mechiee-app.firebaseapp.com",
  projectId: "mechiee-app",
  storageBucket: "mechiee-app.firebasestorage.app",
  messagingSenderId: "631193146538",
  appId: "1:631193146538:web:79b953ab741250d1616cd3",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;