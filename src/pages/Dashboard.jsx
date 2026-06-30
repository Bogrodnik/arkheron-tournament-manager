import { Link } from "react-router-dom";

export default function Dashboard() {
  const cards = [
    {
      title: "🎴 Eternal Draft",
      description: "Run Best-of-5 Eternal Picks & Bans",
      path: "/draft",
    },
    {
      title: "⚔️ Team Builder",
      description: "Create legal tournament loadouts",
      path: "/builder",
    },
    {
      title: "🏆 Tournament",
      description: "Coming Soon",
      path: "#",
      disabled: true,
    },
    {
      title: "⚙️ Settings",
      description: "Application settings",
      path: "/settings",
    },
  ];

  return (
    <div className="dashboard">
      <h1>Arkheron Tournament Manager</h1>
      <p>Welcome to the Arkheron Tournament Suite</p>

      <div className="dashboard-grid">
        {cards.map((card) =>
          card.disabled ? (
            <div key={card.title} className="dashboard-card disabled">
              <h2>{card.title}</h2>
              <p>{card.description}</p>
            </div>
          ) : (
            <Link
              key={card.title}
              to={card.path}
              className="dashboard-card"
            >
              <h2>{card.title}</h2>
              <p>{card.description}</p>
            </Link>
          )
        )}
      </div>
    </div>
  );
}