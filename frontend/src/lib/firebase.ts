// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBykXFnGFtJyiApeTOj9UH1K30ZWhiDNFA",
  authDomain: "pramila-998fd.firebaseapp.com",
  projectId: "pramila-998fd",
  storageBucket: "pramila-998fd.firebasestorage.app",
  messagingSenderId: "997292054388",
  appId: "1:997292054388:web:493dcea5be471cfb117e21",
  measurementId: "G-VVCZQK0DTZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional: Initialize analytics only if supported (browser only)
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((yes) => {
    if (yes) analytics = getAnalytics(app);
  });
}

export { app, analytics };
