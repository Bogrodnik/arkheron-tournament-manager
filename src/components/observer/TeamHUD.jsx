import "../../styles/observer/TeamHUD.css";

export default function TeamHUD({

    side = "left",

    logo,

    name,

    score,

    seriesLength,

    draft = [],

    settings,

}) {

    const winsToWin =
        Math.ceil((Number(seriesLength) || 5) / 2);

    const displayDraft =
        side === "right"
            ? [...draft].reverse()
            : draft;

    return (

        <div className={`teamhud ${side}`}>

            <div className="teamhud-header">

                {side === "left" ? (

                    <>

                        <div className="teamhud-info">

                            {settings.showNames && (

                                <div className="teamhud-name">

                                    {name}

                                </div>

                            )}

                            {settings.showSeriesBar && (

                                <div className="teamhud-bar">

                                    <div

                                        className="teamhud-fill"

                                        style={{

                                            width:
                                                `${(score / winsToWin) * 100}%`

                                        }}

                                    />

                                    {Array.from({

                                        length:
                                            winsToWin - 1

                                    }).map((_, index) => (

                                        <div

                                            key={index}

                                            className="teamhud-marker"

                                            style={{

                                                left:
                                                    `${((index + 1) / winsToWin) * 100}%`

                                            }}

                                        />

                                    ))}

                                </div>

                            )}

                        </div>

                        <div className="teamhud-portrait">

                            {settings.showLogos && (

                                <img

                                    src={logo}

                                    alt={name}

                                    className="teamhud-logo"

                                />

                            )}

                            {settings.showScores && (

                                <div className="teamhud-score">

                                    {score}

                                </div>

                            )}

                        </div>

                    </>

                ) : (

                    <>

                        <div className="teamhud-portrait">

                            {settings.showScores && (

                                <div className="teamhud-score">

                                    {score}

                                </div>

                            )}

                            {settings.showLogos && (

                                <img

                                    src={logo}

                                    alt={name}

                                    className="teamhud-logo"

                                />

                            )}

                        </div>

                        <div className="teamhud-info">

                            {settings.showNames && (

                                <div className="teamhud-name">

                                    {name}

                                </div>

                            )}

                            {settings.showSeriesBar && (

                                <div className="teamhud-bar">

                                    <div

                                        className="teamhud-fill"

                                        style={{

                                            width:
                                                `${(score / winsToWin) * 100}%`

                                        }}

                                    />

                                    {Array.from({

                                        length:
                                            winsToWin - 1

                                    }).map((_, index) => (

                                        <div

                                            key={index}

                                            className="teamhud-marker"

                                            style={{

                                                left:
                                                    `${((index + 1) / winsToWin) * 100}%`

                                            }}

                                        />

                                    ))}

                                </div>

                            )}

                        </div>

                    </>

                )}

            </div>

            {settings.showPicksBans && (

                <div className="teamhud-orbs">

                    {displayDraft.map((entry, index) => (

                        <img

                            key={index}

                            src={
                                entry.item?.image ||
                                entry.image
                            }

                            alt={
                                entry.item?.name ||
                                ""
                            }

                            className={`teamhud-orb ${entry.type}`}

                        />

                    ))}

                </div>

            )}

        </div>

    );

}