import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics, logEvent } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDCe3PHav01WcAHpC_mDDl_wg7nWPLxPpo",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mandar-portfolio.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mandar-portfolio",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mandar-portfolio.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "651215477749",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:651215477749:web:7b8e03b9d1e3804b099ebc",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-JKRX4FZQRD",
};

// Initialize Firebase (singleton pattern safe for Next.js SSR / HMR)
export const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Analytics singleton (client-side only; Firebase Analytics requires browser APIs & IndexedDB)
let analyticsInstance: Analytics | null = null;
let analyticsPromise: Promise<Analytics | null> | null = null;

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (analyticsInstance) return analyticsInstance;
  if (analyticsPromise) return analyticsPromise;

  analyticsPromise = isSupported()
    .then((supported) => {
      if (supported) {
        analyticsInstance = getAnalytics(app);
        return analyticsInstance;
      }
      return null;
    })
    .catch((err) => {
      console.warn("[Firebase Analytics] not supported in this environment:", err);
      return null;
    });

  return analyticsPromise;
}

/**
 * Log a custom event to Firebase Analytics (safe on client and server).
 */
export async function logFirebaseEvent(
  eventName: string,
  eventParams?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === "undefined") return;
  try {
    const analytics = await getFirebaseAnalytics();
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
    }
  } catch (err) {
    console.warn(`[Firebase Analytics] failed to log event "${eventName}":`, err);
  }
}
