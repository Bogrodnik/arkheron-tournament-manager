export default function DraftTimer({
    currentAction,
    time,
    running,
    onStartPause,
    onReset,
    showControls = true,
}) {

    return (

        <div className="draft-timer">

            <div className="timer-header">

                <div className="timer-label">

                    {currentAction}

                </div>

                <div className="timer-value">

                    {time}

                </div>

                {showControls && (

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
                            Reset
                        </button>

                    </div>

                )}

            </div>

            <div className="timer-bar">

                <div
                    className="timer-fill"
                    style={{
                        width: `${(time / 30) * 100}%`,
                    }}
                />

            </div>

        </div>

    );

}