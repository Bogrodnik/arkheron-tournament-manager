import { useState } from "react";

export default function EternalCard({
  eternal,
  disabled,
  onClick,
}) {
  const [hovered, setHovered] =
    useState(false);

  const [showBelow, setShowBelow] =
    useState(false);

  function handleMouseEnter(e) {
    const rect =
      e.currentTarget.getBoundingClientRect();

    setShowBelow(
      rect.top < 300
    );

    setHovered(true);
  }

  function handleMouseLeave() {
    setHovered(false);
  }

  return (
    <div
      className="eternal-card-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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

      {hovered && (
        <div
          className={`item-tooltip ${
            showBelow
              ? "below"
              : "above"
          }`}
        >
          <h2>
            {eternal.name}
          </h2>

          {eternal.ability && (
            <h3>
              {eternal.ability}
            </h3>
          )}

          {eternal.tags &&
            eternal.tags.length > 0 && (
              <div className="tooltip-tags">
                {eternal.tags.map(
                  (tag) => (
                    <span
                      key={tag}
                      className="tooltip-tag"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            )}

          {eternal.cooldown && (
            <p>
              <strong>
                Cooldown:
              </strong>{" "}
              {eternal.cooldown}
            </p>
          )}

          {eternal.damage && (
            <p>
              <strong>
                Damage:
              </strong>{" "}
              {eternal.damage}
            </p>
          )}

          {eternal.healing && (
            <p>
              <strong>
                Healing:
              </strong>{" "}
              {eternal.healing}
            </p>
          )}

          {eternal.duration && (
            <p>
              <strong>
                Duration:
              </strong>{" "}
              {eternal.duration}
            </p>
          )}

          {eternal.range && (
            <p>
              <strong>
                Range:
              </strong>{" "}
              {eternal.range}
            </p>
          )}

          {eternal.description && (
            <div className="tooltip-description">
              {eternal.description}
            </div>
          )}

          {eternal.wiki && (
            <div className="tooltip-link">
              Wiki Available
            </div>
          )}
        </div>
      )}
    </div>
  );
}