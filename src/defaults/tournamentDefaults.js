import DefaultBlueLogo from "../assets/Logo_default_Blue.png";
import DefaultRedLogo from "../assets/Logo_default_Red.png";

export const DEFAULT_TOURNAMENT_SETTINGS = {

    tournamentName: "",
    organizer: "",
    seriesLength: 5,
    firstTeam: 1,
    swapSides: true,
    draftVariant: "snake",
    picksPerTeam: 3,
    bansPerTeam: 1,
    timerLength: 30,
    customDraftOrder: [],
    enabledPools: {
        eternals: true,
        crowns: true,
        amulets: true,
        weapons: true,
        utility: true,
    },

};

export function createDefaultDraftState() {

    return {
        draftPool: "eternals",
        search: "",
        draft: [],
        step: 0,
        score: {
            team1: 0,
            team2: 0,
        },
        game: 1,
        team1Name: "TEAM ALPHA",
        team2Name: "TEAM BETA",
        team1Logo: DefaultBlueLogo,
        team2Logo: DefaultRedLogo,
        matchHistory: [],
        time: DEFAULT_TOURNAMENT_SETTINGS.timerLength,
        running: false,
    };

}
