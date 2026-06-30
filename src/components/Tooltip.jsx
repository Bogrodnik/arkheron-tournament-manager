export default function Tooltip({
    item
}) {

    if (!item) return null;

    return (
        <div className="tooltip">

            <h2>{item.name}</h2>

            {item.ability && (
                <h3>{item.ability}</h3>
            )}

            {item.tags?.length > 0 && (
                <div className="tooltip-tags">

                    {item.tags.map(tag => (
                        <span
                            key={tag}
                            className="tooltip-tag"
                        >
                            {tag}
                        </span>
                    ))}

                </div>
            )}

            {item.cooldown && (
                <p>
                    <strong>Cooldown:</strong>
                    {" "}
                    {item.cooldown}
                </p>
            )}

            {item.damage && (
                <p>
                    <strong>Damage:</strong>
                    {" "}
                    {item.damage}
                </p>
            )}

            {item.range && (
                <p>
                    <strong>Range:</strong>
                    {" "}
                    {item.range}
                </p>
            )}

            {item.description && (
                <p className="tooltip-description">
                    {item.description}
                </p>
            )}

        </div>
    );
}