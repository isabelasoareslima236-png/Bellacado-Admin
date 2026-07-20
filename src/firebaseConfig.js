import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Cole aqui o objeto de configuração que o Firebase te deu
// (Configurações do projeto > Geral > Seus apps > SDK setup and configuration)
const firebaseConfig = {
  apiKey: "AIzaSyDzdf0sEORedLTEdrZlOS4WhepP737pCSs",
  authDomain: "bellacado-2c035.firebaseapp.com",
  projectId: "bellacado-2c035",
  storageBucket: "bellacado-2c035.firebasestorage.app",
  messagingSenderId: "273710950409",
  appId: "1:273710950409:web:95abb5def544befa79f0d8",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
