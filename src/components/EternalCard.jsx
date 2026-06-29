export default function EternalCard({
  eternal,
  disabled,
  onClick,
}) {
  return (
    <button
      className="eternal-card"
      disabled={disabled}
      onClick={onClick}
    >
      <img
        src={eternal.image}
        alt={eternal.name}
      />

      <h3>{eternal.name}</h3>

      <p>{eternal.setBonus}</p>
    </button>
  );
}