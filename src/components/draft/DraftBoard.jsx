import DraftSlot from "./DraftSlot";

export default function DraftBoard({
    title,
    draft,
    side = "left",
}) {

    return (

        <div className="draft-column">

            {title && (
                <h2>{title}</h2>
            )}

            <div className="draft-scroll">

                <div className="draft-grid">

                    {draft.map((entry, index) => (

                        <DraftSlot
                            key={index}
                            draft={entry}
                            side={side}
                        />

                    ))}

                </div>

            </div>

        </div>

    );

}