export function buildTournamentAwarePath(route, tournamentId) {

    const normalizedRoute = route.startsWith("/")
        ? route
        : `/${route}`;

    if (normalizedRoute === "/") {

        return "/";

    }

    if (!tournamentId) {

        return normalizedRoute;

    }

    const encodedTournamentId = encodeURIComponent(tournamentId);

    if (normalizedRoute === "/draft") {

        return `/draft/${encodedTournamentId}`;

    }

    if (normalizedRoute === "/observer") {

        return `/observer/${encodedTournamentId}`;

    }

    if (normalizedRoute === "/settings") {

        return `/settings/${encodedTournamentId}`;

    }

    if (normalizedRoute === "/overlay") {

        return `/overlay/${encodedTournamentId}`;

    }

    if (normalizedRoute === "/overlay-v2") {

        return `/overlay-v2/${encodedTournamentId}`;

    }

    if (normalizedRoute === "/overlay/draft") {

        return `/overlay/draft/${encodedTournamentId}`;

    }

    if (normalizedRoute === "/tournament-settings") {

        return `/tournament-settings/${encodedTournamentId}`;

    }

    return normalizedRoute;

}
