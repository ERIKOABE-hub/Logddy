import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, Auth } from 'firebase/auth';

console.log('=== checking env ===');
console.log('NEXT_FIREBASE_AUTH_DOMAIN', process.env.NEXT_FIREBASE_AUTH_DOMAIN);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

console.log('===Firebase Config ===');
console.log('authDomain:', firebaseConfig.authDomain);

if (!firebaseConfig.authDomain) {
  console.error('=== CRETICAL ERROR ===');
  console.error('authDomain is undefined');
  alert('Firebase Config Error: authDmain is defined.');
}

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialize is Done!');
} else {
  app = getApps()[0];
  console.log('Already initialized');
}

const analytics = getAnalytics(app);

export const auth: Auth = getAuth(app);
export default app;
