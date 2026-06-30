import { getActionText } from "../../draftLogic";

export default function DraftFlow({
  draftOrder,
  draft,
  currentStep,
}) {
  return (
    <div className="draft-flow">

      {draft.map((entry, index) => {
        {draft.length < draftOrder.length && (
    <div className="flow-next">

        NEXT:

        {" "}

        {getActionText(
            draftOrder[currentStep]
        )}

    </div>
)}
   const state =
    index === draft.length - 1
        ? "current"
        : "complete";
        
    const selected = entry.item;

        return (
          <div
            key={index}
            className={`flow-step ${state}`}
          >

            <div className="flow-left">

              <div className="flow-number">
                {index + 1}
              </div>

              <div className="flow-action">
                {getActionText(entry)}
              </div>

            </div>

            <div className="flow-right">

              {selected && (
                <>
                  <img
                    src={selected.image}
                    alt={selected.name}
                  />

                  <span>
                    {selected.name}
                  </span>
                </>
              )}

            </div>

          </div>
        );
      })}

    </div>
  );
}