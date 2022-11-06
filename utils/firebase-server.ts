import admin from "firebase-admin"

const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    clientEmail:process.env.FIREBASE_CLIENT_EMAIL!
  } as admin.ServiceAccount
  

export const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const firebaseAdminAuth = firebaseAdmin.auth()