/*
=========================================
Draft Order
=========================================
*/

export const draftOrder = [
  { team: 1, type: "ban" },
  { team: 2, type: "ban" },

  { team: 1, type: "pick" },
  { team: 2, type: "pick" },

  { team: 2, type: "pick" },
  { team: 1, type: "pick" },

  { team: 1, type: "pick" },
  { team: 2, type: "pick" },
];

/*
=========================================
Helpers
=========================================
*/

export function getCurrentAction(step) {
  return draftOrder[step] ?? null;
}

export function getActionText(action) {
  if (!action) {
    return "Draft Complete";
  }

  const teamText = `Team ${action.team}`;

  const typeText =
    action.type.charAt(0).toUpperCase() +
    action.type.slice(1);

  return `${teamText} ${typeText}`;
}