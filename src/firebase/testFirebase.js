import { db } from "./firebase";

import {

    doc,
    setDoc,
    getDoc,

} from "firebase/firestore";

export async function testFirebase() {

    const ref =
        doc(
            db,
            "live",
            "test"
        );

    await setDoc(

        ref,

        {

            online: true,

            timestamp: Date.now(),

        }

    );

    const snapshot =
        await getDoc(ref);

    console.log(

        "Firebase Test:",

        snapshot.data()

    );

}