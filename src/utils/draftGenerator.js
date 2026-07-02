/*
=========================================
Generate Draft Order
=========================================
*/

export function generateDraftOrder(
    variant,
    picksPerTeam,
    bansPerTeam,
    firstTeam
) {

    const order = [];

    const secondTeam =
        firstTeam === 1
            ? 2
            : 1;

    /*
    =========================================
    SNAKE DRAFT
    Example:
    B1 B2
    P1 P2 P2 P1 P1 P2 P2 P1
    =========================================
    */

    if (variant === "snake") {

        /*
        ==========
        Ban Phase
        ==========
        */

        for (
            let i = 0;
            i < bansPerTeam;
            i++
        ) {

            order.push({
                team: firstTeam,
                type: "ban",
            });

            order.push({
                team: secondTeam,
                type: "ban",
            });

        }

        /*
        ==========
        Pick Phase
        ==========
        */

        for (
            let round = 0;
            round < picksPerTeam;
            round++
        ) {

            const reverse =
                round % 2 === 1;

            if (!reverse) {

                order.push({
                    team: firstTeam,
                    type: "pick",
                });

                order.push({
                    team: secondTeam,
                    type: "pick",
                });

            } else {

                order.push({
                    team: secondTeam,
                    type: "pick",
                });

                order.push({
                    team: firstTeam,
                    type: "pick",
                });

            }

        }

    }

    /*
    =========================================
    ALTERNATING DRAFT
    Example:
    B1 B2
    P1 P2 P1 P2 P1 P2
    =========================================
    */

    else if (
        variant ===
        "alternating"
    ) {

        for (
            let i = 0;
            i < bansPerTeam;
            i++
        ) {

            order.push({
                team: firstTeam,
                type: "ban",
            });

            order.push({
                team: secondTeam,
                type: "ban",
            });

        }

        for (
            let i = 0;
            i < picksPerTeam;
            i++
        ) {

            order.push({
                team: firstTeam,
                type: "pick",
            });

            order.push({
                team: secondTeam,
                type: "pick",
            });

        }

    }

    /*
    =========================================
    DOUBLE BAN
    Example:
    B1 B1 B2 B2
    P1 P2 P1 P2
    =========================================
    */

    else if (
        variant ===
        "double-ban"
    ) {

        /*
        ==========
        Ban Phase
        ==========
        */

        for (
            let i = 0;
            i < bansPerTeam;
            i++
        ) {

            order.push({
                team: firstTeam,
                type: "ban",
            });

            order.push({
                team: firstTeam,
                type: "ban",
            });

            order.push({
                team: secondTeam,
                type: "ban",
            });

            order.push({
                team: secondTeam,
                type: "ban",
            });

        }

        /*
        ==========
        Pick Phase
        ==========
        */

        for (
            let i = 0;
            i < picksPerTeam;
            i++
        ) {

            order.push({
                team: firstTeam,
                type: "pick",
            });

            order.push({
                team: secondTeam,
                type: "pick",
            });

        }

    }

    /*
    =========================================
    FALLBACK
    =========================================
    */

    else {

        for (
            let i = 0;
            i < picksPerTeam;
            i++
        ) {

            order.push({
                team: firstTeam,
                type: "pick",
            });

            order.push({
                team: secondTeam,
                type: "pick",
            });

        }

    }

    return order;
}