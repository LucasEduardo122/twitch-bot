const {initializeApp} = require('firebase/app');
const admin = require('firebase-admin');
const key = require('../key.json')

const firebaseConfig = {
    //config google
  };

const app = initializeApp(firebaseConfig);

admin.initializeApp({
    credential: admin.credential.cert(key)
});

const db = admin.firestore();

module.exports = db;

