export default function EternalCard({
  eternal,
  disabled,
  onClick,
}) {
  return (
    <div
      className="eternal-card-wrapper"
    >
    <button
  type="button"
  className="eternal-card"
  disabled={disabled}
  onClick={onClick}
>
  <img
    src={eternal.image}
    alt={eternal.name}
  />

  <h3>
    {eternal.name}
  </h3>
</button>
    </div>
  );
}