import { useState, useCallback, useEffect } from "react";
import CloudinaryUploadWidget from "../CloudinaryUploadWidget";
import "../../styles/Profile/addBikeModal.css";

const DEFAULT_PART = {
    id: 1,
    part_name: "Llantas",
    brand: "",
    model: "",
    km_life: 0,
};

const AddBikeModal = ({ open, onClose, onBikeCreated }) => {
    const [name, setName] = useState("");
    const [bikeModelId, setBikeModelId] = useState("");
    const [bikeModels, setBikeModels] = useState([]);
    const [filteredModels, setFilteredModels] = useState([]);
    const [modelSearchTerm, setModelSearchTerm] = useState("");
    const [isLoadingModels, setIsLoadingModels] = useState(false);
    const [showModelDropdown, setShowModelDropdown] = useState(false);
    const [specs, setSpecs] = useState("");
    const [parts, setParts] = useState([DEFAULT_PART]);
    const [imagePublicId, setImagePublicId] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const imageWidgetConfig = {
        cloudName: "ddx9lg1wd",
        uploadPreset: "upload_preset",
        sources: ["local", "camera", "url", "image_search", "google_drive", "dropbox", "shutterstock", "istock", "unsplash"],
        multiple: false,
        maxFiles: 1,
        folder: "bikes/images",
        resourceType: "image",
    };

    // Cargar modelos al abrir el modal
    useEffect(() => {
        if (open) {
            fetchBikeModels();
        }
    }, [open]);

    // Filtrar modelos cuando cambia el término de búsqueda
    useEffect(() => {
        if (!modelSearchTerm.trim()) {
            setFilteredModels(bikeModels);
        } else {
            const searchLower = modelSearchTerm.toLowerCase();
            const filtered = bikeModels.filter(
                (model) =>
                    model.brand.toLowerCase().includes(searchLower) ||
                    model.model_name.toLowerCase().includes(searchLower) ||
                    model.full_name.toLowerCase().includes(searchLower)
            );
            setFilteredModels(filtered);
        }
    }, [modelSearchTerm, bikeModels]);

    const fetchBikeModels = async () => {
        setIsLoadingModels(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/bike-models`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                throw new Error("Error al cargar los modelos");
            }

            const data = await res.json();
            setBikeModels(data);
            setFilteredModels(data);
        } catch (err) {
            setError("No se pudieron cargar los modelos de bicicletas");
            console.error(err);
        } finally {
            setIsLoadingModels(false);
        }
    };

    const handleSelectModel = (model) => {
        setBikeModelId(model.id);
        setModelSearchTerm(model.full_name);
        setShowModelDropdown(false);
    };

    const handleModelSearchChange = (e) => {
        setModelSearchTerm(e.target.value);
        setShowModelDropdown(true);
        if (e.target.value.trim()) {
            setBikeModelId("");
        }
    };

    const handleChangePart = useCallback((id, field, value) => {
        setParts((prev) =>
            prev.map((part) =>
                part.id === id ? { ...part, [field]: value } : part
            )
        );
    }, []);

    const handleAddPart = () => {
        setParts((prev) => [
            ...prev,
            {
                id: Date.now(),
                part_name: "",
                brand: "",
                model: "",
                km_life: 0,
            },
        ]);
    };

    const handleRemovePart = (id) => {
        setParts((prev) => prev.filter((part) => part.id !== id));
    };

    const handleVideoChange = (e) => {
        setVideoUrl(e.target.value);
    };

    const resetForm = () => {
        setName("");
        setBikeModelId("");
        setModelSearchTerm("");
        setSpecs("");
        setParts([DEFAULT_PART]);
        setImagePublicId("");
        setVideoUrl("");
        setError("");
    };

    const validateForm = () => {
        if (!name.trim()) {
            setError("El nombre de la bici es obligatorio");
            return false;
        }
        if (!bikeModelId) {
            setError("Debes seleccionar un modelo de bicicleta");
            return false;
        }
        if (!imagePublicId) {
            setError("La foto de la bici es obligatoria");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                import.meta.env.VITE_BACKEND_URL + "/api/bikes",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name,
                        bike_model_id: bikeModelId,
                        specs,
                        image_url: imagePublicId
                            ? `https://res.cloudinary.com/ddx9lg1wd/image/upload/w_400,h_300,c_fill/${imagePublicId}.jpg`
                            : null,
                        video_url: videoUrl,
                        parts,
                    }),
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.msg || "Error al guardar la bici");
            }

            const newBike = await res.json();
            onBikeCreated(newBike);
            resetForm();
            onClose();
        } catch (err) {
            setError(err.message || "Error al guardar la bici");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!open) return null;

    const selectedModel = bikeModels.find((m) => m.id === bikeModelId);

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="add-bike-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Añadir Bicicleta al Garaje</h2>
                    <button
                        type="button"
                        className="modal-close-btn"
                        onClick={handleClose}
                        aria-label="Cerrar modal"
                    >
                        ✕
                    </button>
                </div>

                {error && <div className="error-banner">{error}</div>}

                <form onSubmit={handleSubmit} className="bike-form">
                    {/* NOMBRE DE LA BICI */}
                    <div className="form-group">
                        <label htmlFor="bike-name">Nombre de la bici *</label>
                        <input
                            id="bike-name"
                            type="text"
                            placeholder="Mi bici de montaña"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-input"
                        />
                    </div>

                    {/* MODELO DE BICI - SELECT CON BUSQUEDA */}
                    <div className="form-group">
                        <label htmlFor="bike-model">Modelo de bicicleta *</label>
                        <div className="model-search-container">
                            <input
                                id="bike-model"
                                type="text"
                                placeholder={
                                    isLoadingModels
                                        ? "Cargando modelos..."
                                        : "Busca por marca o modelo (Trek, Specialized...)"
                                }
                                value={modelSearchTerm}
                                onChange={handleModelSearchChange}
                                onFocus={() => setShowModelDropdown(true)}
                                className="form-input model-search-input"
                                disabled={isLoadingModels}
                            />

                            {showModelDropdown && (
                                <div className="model-dropdown">
                                    {isLoadingModels ? (
                                        <div className="dropdown-item loading">
                                            Cargando modelos...
                                        </div>
                                    ) : filteredModels.length === 0 ? (
                                        <div className="dropdown-item empty">
                                            No se encontraron modelos
                                        </div>
                                    ) : (
                                        filteredModels.map((model) => (
                                            <div
                                                key={model.id}
                                                className={`dropdown-item ${bikeModelId === model.id ? "selected" : ""
                                                    }`}
                                                onClick={() => handleSelectModel(model)}
                                            >
                                                <div className="model-info">
                                                    <strong>{model.brand}</strong>
                                                    <span className="model-name">
                                                        {model.model_name}
                                                    </span>
                                                </div>
                                                <div className="model-meta">
                                                    <span className="bike-type">
                                                        {model.bike_type}
                                                    </span>
                                                    {model.model_year && (
                                                        <span className="model-year">
                                                            {model.model_year}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {selectedModel && (
                            <div className="selected-model-info">
                                ✓ {selectedModel.brand} {selectedModel.model_name}
                                {selectedModel.model_year && ` (${selectedModel.model_year})`}
                            </div>
                        )}
                    </div>

                    {/* ESPECIFICACIONES */}
                    <div className="form-group">
                        <label htmlFor="bike-specs">Especificaciones</label>
                        <textarea
                            id="bike-specs"
                            placeholder="Ej: Ruedas 29, Suspensión delantera 100mm, Frenos de disco..."
                            value={specs}
                            onChange={(e) => setSpecs(e.target.value)}
                            className="form-textarea"
                            rows="3"
                        />
                    </div>

                    {/* FOTO */}
                    <div className="form-group">
                        <label>Foto de la bici *</label>
                        {!imagePublicId ? (
                            <div className="upload-widget-container">
                                <CloudinaryUploadWidget
                                    uwConfig={imageWidgetConfig}
                                    setPublicId={setImagePublicId}
                                />
                            </div>
                        ) : (
                            <div className="bike-image-preview">
                                <img
                                    src={`https://res.cloudinary.com/ddx9lg1wd/image/upload/w_400,h_300,c_fill/${imagePublicId}.jpg`}
                                    alt="Bici"
                                    className="bike-preview"
                                />
                                <button
                                    type="button"
                                    className="btn-change-photo"
                                    onClick={() => setImagePublicId("")}
                                >
                                    Cambiar foto
                                </button>
                            </div>
                        )}
                    </div>

                    {/* VÍDEO (OPCIONAL) */}
                    <div className="form-group">
                        <label htmlFor="bike-video">Vídeo (opcional)</label>
                        <input
                            id="bike-video"
                            type="url"
                            placeholder="https://youtube.com/watch?v=..."
                            value={videoUrl}
                            onChange={handleVideoChange}
                            className="form-input"
                        />
                    </div>

                    {/* PARTES */}
                    <div className="parts-section">
                        <div className="parts-header">
                            <h3>Componentes de la bici</h3>
                            <span className="parts-count">{parts.length}</span>
                        </div>

                        <div className="parts-list">
                            {parts.map((p, index) => (
                                <div key={p.id} className="part-row">
                                    <div className="part-number">{index + 1}</div>

                                    <input
                                        type="text"
                                        placeholder="Llantas, Frenos, Manillar..."
                                        value={p.part_name}
                                        onChange={(e) =>
                                            handleChangePart(p.id, "part_name", e.target.value)
                                        }
                                        className="form-input part-input"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Marca"
                                        value={p.brand}
                                        onChange={(e) =>
                                            handleChangePart(p.id, "brand", e.target.value)
                                        }
                                        className="form-input part-input"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Modelo"
                                        value={p.model}
                                        onChange={(e) =>
                                            handleChangePart(p.id, "model", e.target.value)
                                        }
                                        className="form-input part-input"
                                    />

                                    <input
                                        type="number"
                                        placeholder="Km vida"
                                        min="0"
                                        value={p.km_life}
                                        onChange={(e) =>
                                            handleChangePart(
                                                p.id,
                                                "km_life",
                                                Number(e.target.value)
                                            )
                                        }
                                        className="form-input part-input km-input"
                                    />

                                    {parts.length > 1 && (
                                        <button
                                            type="button"
                                            className="btn-remove-part"
                                            onClick={() => handleRemovePart(p.id)}
                                            title="Eliminar componente"
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            className="btn-add-part"
                            onClick={handleAddPart}
                        >
                            + Añadir componente
                        </button>
                    </div>

                    {/* ACCIONES */}
                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading || !imagePublicId}
                        >
                            {loading ? "Guardando..." : "Guardar bici"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBikeModal;
