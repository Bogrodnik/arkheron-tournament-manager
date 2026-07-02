export default function DraftSlot({
    draft,
    side = "left",
}) {

    const isBan =
        draft.type === "ban";

    const badge = (
        <div className="draft-badge">
            {isBan
                ? "BAN"
                : "PICK"}
        </div>
    );

    const icon = (
        <img
            src={draft.item.image}
            alt={draft.item.name}
        />
    );

    const info = (
        <div className={`draft-info ${side}`}>
            <h4>
                {draft.item.name}
            </h4>

            <p>
                {draft.item.setBonus}
            </p>
        </div>
    );

    return (
        <div
            className={`draft-slot ${
                isBan
                    ? "ban"
                    : "pick"
            } ${side}`}
        >

            {
                side === "left"
                    ? (
                        <>
                            {info}
                            {icon}
                            {badge}
                        </>
                    )
                    : (
                        <>
                            {badge}
                            {icon}
                            {info}
                        </>
                    )
            }

        </div>
    );
}