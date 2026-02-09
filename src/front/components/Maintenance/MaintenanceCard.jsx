import { useState } from "react";

const MaintenanceCard = ({
    title = "Mantenimiento",
    showTitle = true,
    showActionButton = true,
    data = {
        llantas: 85,
        frenos: 42,
        cadena: 12
    },
    onChange
}) => {

    const [values, setValues] = useState(data);

    const update = (key, val) => {
        const next = { ...values, [key]: val };
        setValues(next);
        onChange?.(next);
    };

    const getColor = (value) => {
        if (value > 70) return "#22c55e";
        if (value > 30) return "#facc15";
        return "#ef4444";
    };

    return (
        <section className="maintenance">

            {showTitle && <h2 className="ui-subtitle">{title}</h2>}

            {[
                ["Llantas", "llantas"],
                ["Frenos", "frenos"],
                ["Cadena", "cadena"]
            ].map(([label, key]) => (
                <div
                    key={key}
                    className="bar"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "70px 1fr",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 8
                    }}
                >

                    <span style={{ color: "#fff", opacity: 0.85 }}>
                        {label}
                    </span>

                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={values[key]}
                        onChange={(e) => update(key, Number(e.target.value))}
                        style={{
                            appearance: "none",
                            height: 6,
                            borderRadius: 6,
                            background: `linear-gradient(to right,
                              ${getColor(values[key])} 0%,
                              ${getColor(values[key])} ${values[key]}%,
                              rgba(255,255,255,.25) ${values[key]}%,
                              rgba(255,255,255,.25) 100%)`,
                            outline: "none"
                        }}
                    />
                </div>

            ))}



        </section>
    );
};

export default MaintenanceCard;
