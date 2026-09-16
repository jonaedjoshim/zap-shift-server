import { cert, getApps, initializeApp } from "firebase-admin/app";

const {
    FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY,
} = process.env;

const initializeFirebaseAdmin = () => {
    if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
        console.warn("⚠️ Firebase Admin environment variables are missing.");
        return null;
    }

    if (getApps().length > 0) {
        return getApps()[0];
    }

    // Handle escaped newlines for Vercel
    const formattedPrivateKey = FIREBASE_PRIVATE_KEY
        ? FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n").replace(/^"|"$/g, "")
        : undefined;

    return initializeApp({
        credential: cert({
            projectId: FIREBASE_PROJECT_ID,
            clientEmail: FIREBASE_CLIENT_EMAIL,
            privateKey: formattedPrivateKey,
        }),
    });
};

const firebaseAdminApp = initializeFirebaseAdmin();

export default firebaseAdminApp;