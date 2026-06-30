export default function DraftSlot({ draft }) {

  const isBan =
    draft.type === "ban";

  return (
    <div
      className={`draft-slot ${
        isBan ? "ban" : "pick"
      }`}
    >

      <div className="draft-badge">
        {isBan ? "BAN" : "PICK"}
      </div>

      <img
        src={draft.item.image}
        alt={draft.item.name}
      />

      <div className="draft-info">

        <h4>
          {draft.item.name}
        </h4>

        <p>
          {draft.item.setBonus}
        </p>

      </div>

    </div>
  );
}