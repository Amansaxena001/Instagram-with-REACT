import firebase from "firebase"

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAxUHKVDr90QtGMWlX5wabfRR-uJ6VTT2g",
    authDomain: "instagram-clone-92714.firebaseapp.com",
    databaseURL: "https://instagram-clone-92714.firebaseio.com",
    projectId: "instagram-clone-92714",
    storageBucket: "instagram-clone-92714.appspot.com",
    messagingSenderId: "65880412086",
    appId: "1:65880412086:web:149ce42cf06fe1f6907b17",
    measurementId: "G-EN6T7EPR4J"
  });

  const db=firebaseApp.firestore();
  const auth=firebase.auth()
  const storage =firebase.storage()

export{db,auth,storage}