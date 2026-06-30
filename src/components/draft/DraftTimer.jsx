export default function DraftTimer({
  currentAction,
  time,
  running,
  onStartPause,
  onReset,
}) {
  return (
    <div className="draft-timer">

      <h2>
        Current Turn
      </h2>

      <h3>
        {currentAction}
      </h3>

      <div className="timer-value">
        {time}
      </div>

      <div className="timer-bar">
        <div
          className="timer-fill"
          style={{
            width: `${(time / 30) * 100}%`,
          }}
        />
      </div>

      <div className="timer-buttons">

       <button
  className="undo-button"
  onClick={onStartPause}
>
  {running
    ? "Pause"
    : "Start"}
</button>

<button
  className="reset-button"
  onClick={onReset}
>
  Reset Timer
</button>

      </div>

    </div>
  );
}