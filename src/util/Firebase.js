import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
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

export function initAuth() {
    return new Promise((s, f) => {
        
        const provider = new GoogleAuthProvider();

        // Passa serviço 'auth' configurado e o 'provider'
        signInWithPopup(auth, provider)
            .then(result => {
                // O Firebase v12 mudou um pouco a estrutura do token. Se precisar dele:
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential ? credential.accessToken : null;
                const user = result.user;

                // Sucesso: Retorna o usuário e o token idêntico ao curso!
                s({ user, token }); 
            })
            .catch(err => {
                // Falha: repassa o erro
                f(err);
            });
    });

}

export function logout() {
    return signOut(auth); // Retorna a promise de deslogar do Firebase
}

export { doc, setDoc };