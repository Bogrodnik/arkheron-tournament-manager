import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

    apiKey: "AIzaSyBD3J9U7NdTGrp4wfSeQP_KFnfXC5_QsEY",

    authDomain:
        "arkheron-tournament-manager.firebaseapp.com",

    projectId:
        "arkheron-tournament-manager",

    storageBucket:
        "arkheron-tournament-manager.firebasestorage.app",

    messagingSenderId:
        "710010043138",

    appId:
        "1:710010043138:web:01ee17d532f61a524da01b"

};

const app =
    initializeApp(firebaseConfig);

export const db =
    getFirestore(app);