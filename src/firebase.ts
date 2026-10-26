import { FirebaseError, initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const requiredConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const missingConfig = Object.entries(requiredConfig)
  .filter(([, value]) => !value?.trim())
  .map(([name]) => `REACT_APP_FIREBASE_${name.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase()}`);

const firebaseConfigurationError = missingConfig.length > 0
  ? `Липсва Firebase конфигурация: ${missingConfig.join(", ")}. Приложението не е свързано.`
  : "";

const createFirebaseServices = () => {
  const app = initializeApp({
    ...requiredConfig,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  });
  const auth = getAuth(app);
  const db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  });
  return { auth, db, authPersistenceReady: setPersistence(auth, browserLocalPersistence) };
};

export const firebase = firebaseConfigurationError
  ? { ready: false as const, error: firebaseConfigurationError }
  : { ready: true as const, ...createFirebaseServices() };

export const authenticationMessage = (error: unknown) => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/invalid-email":
      case "auth/user-disabled":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Невалиден имейл или парола.";
      case "auth/too-many-requests":
        return "Твърде много неуспешни опити. Опитайте отново по-късно.";
      case "auth/network-request-failed":
        return "Няма връзка с услугата. Проверете интернет връзката си.";
    }
  }

  return "Входът е неуспешен. Опитайте отново.";
};
