import { useEffect, useState } from "react";

import {
    listenToDraft,
} from "../../firebase/draftService";

import "../../styles/observer/DraftOverlayV2.css";

export default function DraftOverlayV2() {

    const [draftState, setDraftState] = useState(null);

    useEffect(() => {

        document.body.style.background = "transparent";
        document.documentElement.style.background = "transparent";

        const unsubscribe = listenToDraft(setDraftState);

        return () => {

            unsubscribe();

            document.body.style.background = "";
            document.documentElement.style.background = "";

        };

    }, []);

    if (!draftState) {

        return null;

    }

    const alphaDraft = draftState.draft.filter(
        entry => entry.team === 1
    );

    const betaDraft = draftState.draft.filter(
        entry => entry.team === 2
    );

    return (

        <div className="draft-v2-root">

            <div className="draft-v2-column draft-v2-column-left">

                {alphaDraft.map((entry, index) => (

                    <Portrait

                        key={`alpha-${index}`}

                        entry={entry}

                    />

                ))}

            </div>

            <div className="draft-v2-column draft-v2-column-right">

                {betaDraft.map((entry, index) => (

                    <Portrait

                        key={`beta-${index}`}

                        entry={entry}

                    />

                ))}

            </div>

        </div>

    );

}

function Portrait({ entry }) {

    const glowClass =
        entry.type === "ban"
            ? "draft-v2-ban"
            : "draft-v2-pick";

    const image =

        entry.item?.image ||

        entry.item?.portrait ||

        "";

    const name =

        entry.item?.name ||

        "";

    return (

        <div className={`draft-v2-portrait ${glowClass}`}>

            <img

                className="draft-v2-image"

                src={image}

                alt={name}

                draggable={false}

            />

        </div>

    );

}