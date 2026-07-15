import {
    doc,
    onSnapshot,
    setDoc,
} from "firebase/firestore";

import { db } from "./firebase";

const DOC_ID = "broadcast";

export const DEFAULT_SETTINGS = {

    showLeftTeam: true,
    showRightTeam: true,

    showLogos: true,
    showNames: true,
    showScores: true,
    showSeriesBar: true,
    showPicksBans: true,

    showTimer: true,
    showDraftFlow: true,

};

const broadcastRef = doc(

    db,

    "broadcastSettings",

    DOC_ID

);

export function listenToBroadcastSettings(callback) {

    return onSnapshot(

        broadcastRef,

        async snapshot => {

            if (!snapshot.exists()) {

                await setDoc(

                    broadcastRef,

                    DEFAULT_SETTINGS

                );

                callback(

                    DEFAULT_SETTINGS

                );

                return;

            }

            callback({

                ...DEFAULT_SETTINGS,

                ...snapshot.data(),

            });

        }

    );

}

export async function updateBroadcastSettings(

    updates

) {

    await setDoc(

        broadcastRef,

        updates,

        {

            merge: true,

        }

    );

}
