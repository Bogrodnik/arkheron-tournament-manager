import { getActionText } from "../../draftLogic";

export default function DraftFlow({
    draft,
    team1Name,
    team2Name,
}) {

    function getTeamName(team) {
        return team === 1
            ? team1Name
            : team2Name;
    }

    function getAction(entry) {
        return entry.type === "pick"
            ? "Pick"
            : "Ban";
    }

    return (
        <div className="draft-flow">

            {draft.map(
                (
                    entry,
                    index
                ) => {

                    const selected =
                        entry.item;

                    const isCurrent =
                        index ===
                        draft.length - 1;

                    return (
                        <div
                            key={index}
                            className={`flow-step ${
                                isCurrent
                                    ? "current"
                                    : "complete"
                            }`}
                        >

                            <div className="flow-number">
                                {index + 1}
                            </div>

                            <div className="flow-action">
                                {getTeamName(
                                    entry.team
                                )}{" "}
                                {getAction(
                                    entry
                                )}
                            </div>

                            {selected && (
                                <div className="flow-item">

                                    <img
                                        src={
                                            selected.image
                                        }
                                        alt={
                                            selected.name
                                        }
                                    />

                                    <span>
                                        {
                                            selected.name
                                        }
                                    </span>

                                </div>
                            )}

                        </div>
                    );
                }
            )}

        </div>
    );
}