import { useState } from "react";
import CloudinaryUploadWidget from "../CloudinaryUploadWidget";
import "../../styles/Profile/addBikeModal.css";

const AddBikeModal = ({ open, onClose, onBikeCreated }) => {
    
    const [name, setName] = useState("");
    const [model, setModel] = useState("");
    const [specs, setSpecs] = useState("");
    const [parts, setParts] = useState([
        { part_name: "Llantas", brand: "", model: "", km_life: 0 },
    ]);

    // Imagen (Cloudinary)
    const [imagePublicId, setImagePublicId] = useState("");

    // Vídeo (URL por ahora)
    const [videoUrl, setVideoUrl] = useState("");
    const [videoFileUploading, setVideoFileUploading] = useState(false);

    if (!open) return null;

    // Config del widget de Cloudinary para IMAGEN
    const imageWidgetConfig = {
        cloudName: "ddx9lg1wd",                 // tu cloud name
        uploadPreset: "upload_preset",   // tu upload preset unsigned
        sources: ["local", "camera"],
        multiple: false,
        maxFiles: 1,
        folder: "bikes/images",
        resourceType: "image",
    };

    const handleChangePart = (index, field, value) => {
        setParts((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [field]: value };
            return copy;
        });
    };

    const handleAddPart = () => {
        setParts((prev) => [
            ...prev,
            { part_name: "", brand: "", model: "", km_life: 0 },
        ]);
    };

    // De momento asumimos que videoUrl es una URL (YouTube, etc.) o lo quitas.
    const handleVideoChange = (e) => {
        const url = e.target.value;
        setVideoUrl(url);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/bikes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name,
                model,
                specs,
                image_url: imagePublicId
                    ? `https://res.cloudinary.com/ddx9lg1wd/image/upload/w_400,h_300,c_fill/${imagePublicId}.jpg`
                    : null,
                video_url: videoUrl,
                parts,
            }),
        });

        if (!res.ok) {
            // manejar errores
            return;
        }

        const newBike = await res.json();
        onBikeCreated(newBike);
        onClose();
    };

    const resetForm = () => {
        setName("");
        setModel("");
        setSpecs("");
        setParts([{ part_name: "Llantas", brand: "", model: "", km_life: 0 }]);
        setImagePublicId("");
        setVideoUrl("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="add-bike-modal">
                <h2>Añadir Bici</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nombre de la bici"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Modelo"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                    />

                    <textarea
                        placeholder="Especificaciones"
                        value={specs}
                        onChange={(e) => setSpecs(e.target.value)}
                    />

                    {/* FOTO con CloudinaryUploadWidget */}
                    <label>Foto de la bici</label>

                    {!imagePublicId && (
                        <CloudinaryUploadWidget
                            uwConfig={imageWidgetConfig}
                            setPublicId={setImagePublicId}
                        />
                    )}

                    {imagePublicId && (
                        <div className="bike-image-preview">
                            <img
                                src={`https://res.cloudinary.com/ddx9lg1wd/image/upload/w_400,h_300,c_fill/${imagePublicId}.jpg`}
                                alt="Bici"
                                className="bike-preview"
                            />
                            <button
                                type="button"
                                onClick={() => setImagePublicId("")}
                            >
                                Cambiar foto
                            </button>
                        </div>
                    )}

                    {/* VÍDEO (por ahora solo URL opcional) */}
                    <label>Vídeo (opcional, URL)</label>
                    <input
                        type="url"
                        placeholder="https://..."
                        value={videoUrl}
                        onChange={handleVideoChange}
                    />

                    <div className="parts-section">
                        <h3>Partes de la bici</h3>
                        {parts.map((p, idx) => (
                            <div key={idx} className="part-row">
                                <input
                                    type="text"
                                    placeholder="Parte (Llantas, Frenos...)"
                                    value={p.part_name}
                                    onChange={(e) =>
                                        handleChangePart(idx, "part_name", e.target.value)
                                    }
                                />
                                <input
                                    type="text"
                                    placeholder="Marca"
                                    value={p.brand}
                                    onChange={(e) =>
                                        handleChangePart(idx, "brand", e.target.value)
                                    }
                                />
                                <input
                                    type="text"
                                    placeholder="Modelo"
                                    value={p.model}
                                    onChange={(e) =>
                                        handleChangePart(idx, "model", e.target.value)
                                    }
                                />
                                <input
                                    type="number"
                                    placeholder="Km vida útil"
                                    value={p.km_life}
                                    onChange={(e) =>
                                        handleChangePart(idx, "km_life", Number(e.target.value))
                                    }
                                />
                            </div>
                        ))}
                        <button type="button" onClick={handleAddPart}>
                            + Añadir parte
                        </button>
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={handleClose}>
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!imagePublicId || videoFileUploading}
                        >
                            Guardar bici
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBikeModal;
