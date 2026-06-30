import DraftSlot from "./DraftSlot";

export default function DraftBoard({
  title,
  draft,
}) {
  return (
    <div className="draft-column">

      {title && (
        <h2>{title}</h2>
      )}

      {draft.map((entry, index) => (
        <DraftSlot
          key={index}
          draft={entry}
        />
      ))}

    </div>
  );
}