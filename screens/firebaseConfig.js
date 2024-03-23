import { initializeApp } from 'firebase/app';
import { getAuth, OAuthProvider } from 'firebase/auth';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAc41xvLCWo27a_pXldtA2NB9sBJ49-wsg",
  authDomain: "fidelize-34a2a.firebaseapp.com",
  projectId: "fidelize-34a2a",
  storageBucket: "fidelize-34a2a.appspot.com",
  messagingSenderId: "366551687959",
  appId: "1:366551687959:ios:036df65d095f782ffd4d52"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Luego, cuando manejes la autenticación de Apple:
const provider = new OAuthProvider('apple.com');

export default firebaseConfig;
