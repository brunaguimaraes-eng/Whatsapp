import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuração oficial do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDfjsf7GQsLOqjTmPHHFPDxuTVmDcEwLOs",
  authDomain: "whatsapp-hcode.firebaseapp.com",
  projectId: "whatsapp-hcode",
  storageBucket: "whatsapp-hcode.firebasestorage.app",
  messagingSenderId: "124790784670",
  appId: "1:124790784670:web:d28ab50d863bc376db718f",
  measurementId: "G-9TQ7KGE35D"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Cria e exporta as instâncias dos serviços que você vai usar no WhatsApp
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);