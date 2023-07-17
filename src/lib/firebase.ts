import firebaseAdmin from 'firebase-admin';
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
	throw new Error('Missing FIREBASE_SERVICE_ACCOUNT env variable')
}

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!)) 
});