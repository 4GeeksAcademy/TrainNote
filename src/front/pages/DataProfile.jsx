import React from "react";
import { useEffect } from "react";
import { useProfile } from "../hooks/useProfile";
import { useTag } from "../hooks/useTag";
import { BodyTag } from "../components/BodyTag.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";


export const DataProfile = () => {

    const { store, dispatch } = useGlobalReducer()

    const { getDataTag, onSelectedTag, handleSave, selectedTag } = useTag();

    useEffect(() => {
        getDataTag();
    }, []);

    const {
        firstName, setFirstName,
        lastName, setLastName,
        birthDate, setBirthDate,
        profileImg, setProfileImg,
        description, setDescription,
        error,
        loading,
        success,
        handleUpdateProfile
    } = useProfile();

    const saveProfile = async (e) => {
        e.preventDefault()
        try {
            const res = await handleUpdateProfile();
            const resTag = await handleSave();
        } catch (err) {
            console.error("Error to save profile", err);
        }
    }

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-sm p-4">
                        <h2 className="text-center mb-4">Completa tu Perfil</h2>

                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">¡Perfil actualizado con éxito!</div>}

                        <form onSubmit={handleUpdateProfile}>
                            <hr className="my-4" />
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="firstName" className="form-label fw-bold">Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="firstName"
                                        name="firstName"
                                        placeholder="Javier"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="lastName" className="form-label fw-bold">Apellido</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Brenner"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="birthDate" className="form-label fw-bold">Fecha de Nacimiento</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="birthDate"
                                    name="birthDate"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                {profileImg ? (
                                    <img
                                        src={profileImg instanceof File ? URL.createObjectURL(profileImg) : null}
                                        alt="Foro preview"
                                        className="rounded-circle shadow-sm object-fit-cover"
                                        style={{ width: "65px", height: "65px" }}
                                        onError={(e) => {
                                            e.target.src = "https://placehold.co/65?text=Foro";
                                        }}
                                    />) : (<div
                                        className="bg-primary text-white d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                                        style={{ width: "65px", height: "65px", fontSize: "1.8rem" }}
                                    >
                                        💬
                                    </div>)}
                                <label htmlFor="profileImg" className="form-label fw-bold">URL de la Imagen de Perfil</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="profileImg"
                                    name="profileImg"
                                    accept="image/*"
                                    onChange={(e) => setProfileImg(e.target.files[0])}
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="description" className="form-label fw-bold">Descripción</label>
                                <textarea
                                    className="form-control"
                                    id="description"
                                    name="description"
                                    rows="4"
                                    placeholder="Cuéntanos sobre ti..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold" >Selecciona tus gustos</label>
                                <div className="d-flex flex-wrap gap-2 border p-3 rounded bg-light overflow-y-auto"
                                    style={{ maxHeight: "200px" }}>
                                    {store.tags && store.tags.map((tag) => {
                                        const handleSelected = selectedTag.includes(tag.id);
                                        return (<BodyTag key={tag.id} tag={tag} onSelectedTag={onSelectedTag} isSelected={handleSelected} />);
                                    })}
                                </div>
                            </div>

                            <div className="d-grid">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg"
                                    disabled={loading}
                                    onClick={saveProfile}
                                >
                                    {loading ? "Guardando..." : "Guardar Perfil"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};