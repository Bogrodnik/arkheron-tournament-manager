import test from "node:test";
import assert from "node:assert/strict";

import { buildInitialTournamentPayload } from "./tournamentService.js";

test("buildInitialTournamentPayload seeds tournament metadata into settings", () => {
    const payload = buildInitialTournamentPayload("My Tournament");

    assert.equal(payload.tournament.name, "My Tournament");
    assert.equal(payload.tournament.status, "draft");
    assert.equal(payload.settings.config.tournamentName, "My Tournament");
    assert.equal(payload.settings.config.organizer, "");
    assert.equal(payload.draft.state.draftPool, "eternals");
});
