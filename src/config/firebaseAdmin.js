import {
    cert,
    getApps,
    initializeApp,
} from "firebase-admin/app";

const {
    FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY,
} = process.env;

const initializeFirebaseAdmin = () => {
    if (
        !FIREBASE_PROJECT_ID ||
        !FIREBASE_CLIENT_EMAIL ||
        !FIREBASE_PRIVATE_KEY
    ) {
        throw new Error(
            "Firebase Admin environment variables are missing."
        );
    }

    if (getApps().length > 0) {
        return getApps()[0];
    }

    return initializeApp({
        credential: cert({
            projectId:
                FIREBASE_PROJECT_ID,

            clientEmail:
                FIREBASE_CLIENT_EMAIL,

            privateKey:
                FIREBASE_PRIVATE_KEY.replace(
                    /\\n/g,
                    "\n"
                ),
        }),
    });
};

const firebaseAdminApp =
    initializeFirebaseAdmin();

export default firebaseAdminApp;