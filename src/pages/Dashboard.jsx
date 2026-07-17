import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    createTournament,
    deleteTournament,
    listenToTournaments,
} from "../firebase/tournamentService";

import "../styles/Dashboard.css";

function getTimestampValue(timestamp) {

    if (!timestamp) {

        return 0;

    }

    if (typeof timestamp.toMillis === "function") {

        return timestamp.toMillis();

    }

    return new Date(timestamp).getTime() || 0;

}

function formatDate(timestamp) {

    if (!timestamp) {

        return "Pending";

    }

    const date =
        typeof timestamp.toDate === "function"
            ? timestamp.toDate()
            : new Date(timestamp);

    if (Number.isNaN(date.getTime())) {

        return "Pending";

    }

    return date.toLocaleString();

}

export default function Dashboard() {

    const navigate = useNavigate();

    const [tournaments, setTournaments] =
        useState([]);

    useEffect(() => {

        return listenToTournaments(
            setTournaments
        );

    }, []);

    async function handleCreateTournament() {

        const name = window.prompt(
            "Tournament name:"
        );

        const tournamentName = name?.trim();

        if (!tournamentName) {

            return;

        }

        try {

            const tournamentId =
                await createTournament(
                    tournamentName
                );

            navigate(
                `/draft/${tournamentId}`
            );

        } catch (error) {

            console.error(
                "Failed to create tournament:",
                error
            );

        }

    }

    async function handleDeleteTournament(
        event,
        tournament
    ) {

        event.preventDefault();
        event.stopPropagation();

        const tournamentName =
            tournament.name ||
            "Untitled Tournament";

        const confirmed = window.confirm(
            `Delete "${tournamentName}"?\nThis will remove the tournament and all related draft, settings, and broadcast data.`
        );

        if (!confirmed) {

            return;

        }

        try {

            await deleteTournament(
                tournament.id
            );

        } catch (error) {

            console.error(
                "Failed to delete tournament:",
                error
            );

        }

    }

    const sortedTournaments =
        [...tournaments].sort(
            (first, second) =>
                getTimestampValue(second.updatedAt) -
                getTimestampValue(first.updatedAt)
        );

    return (

        <div className="dashboard">

            <div className="dashboard-header card">

                <h1>
                    Arkheron Tournament Manager
                </h1>

                <p>
                    Create and manage live tournament drafts.
                </p>

                <button
                    className="dashboard-create-button"
                    onClick={handleCreateTournament}
                >
                    New Tournament
                </button>

            </div>

            <div className="tournament-list-header">

                <h2>
                    Tournaments
                </h2>

                <span>
                    {sortedTournaments.length}
                </span>

            </div>

            {sortedTournaments.length === 0 ? (

                <div className="tournament-empty card">

                    No tournaments yet. Create one to begin.

                </div>

            ) : (

                <div className="dashboard-grid">

                    {sortedTournaments.map(
                        tournament => (

                            <div
                                key={tournament.id}
                                className="dashboard-card tournament-card card"
                            >

                                <Link
                                    to={`/draft/${tournament.id}`}
                                    className="dashboard-card-link"
                                >

                                    <div className="tournament-card-header">

                                        <h2>
                                            {tournament.name ||
                                                "Untitled Tournament"}
                                        </h2>

                                        <span className="tournament-status">
                                            {tournament.status ||
                                                "Active"}
                                        </span>

                                    </div>

                                    <div className="tournament-dates">

                                        <div>

                                            <span>Created</span>

                                            <strong>
                                                {formatDate(
                                                    tournament.createdAt
                                                )}
                                            </strong>

                                        </div>

                                        <div>

                                            <span>Last Updated</span>

                                            <strong>
                                                {formatDate(
                                                    tournament.updatedAt
                                                )}
                                            </strong>

                                        </div>

                                    </div>

                                    <div className="dashboard-action">
                                        Open Draft →
                                    </div>

                                </Link>

                                <button
                                    type="button"
                                    className="dashboard-delete-button"
                                    onClick={(event) =>
                                        handleDeleteTournament(
                                            event,
                                            tournament
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        )
                    )}

                </div>

            )}

            <div className="dashboard-footer">

                Made by <strong>Zarazy</strong>

            </div>

        </div>

    );

}
