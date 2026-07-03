import "../../css/profile.css";
import { FaEdit } from "react-icons/fa";
import { useProfileView } from "../hooks/useProfileView";
import { useEffect } from "react";
import { useTag } from "../hooks/useTag";
import { BodyTag } from "../components/BodyTag";
import { deleteTagFromUser } from "../../services/tagService";
import useGlobalReducer from "../hooks/useGlobalReducer";


export const Profile = () => {

    const {
        profile,
        setProfile,
        handleProfileChange,
        followForos,
        myForos,
        userTags,
        setUserTags,
        loading,
        editingSection,
        setEditingSection,
        handleUnfollow,
        selectedImage,
        setSelectedImage,
        handleUpdateAvatar,
        handleUpdateProfile
    } = useProfileView();

    const { store } = useGlobalReducer();


    const {
        getDataTag,
        onSelectedTag,
        handleSave,
        selectedTag,
        setSelectedTag,
    } = useTag();

    useEffect(() => {
        getDataTag();
    }, []);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <h3>Cargando perfil...</h3>
            </div>
        );
    }

    return (
        <div className="profile-page">

            {/* IZQUIERDA */}
            <div className="profile-left">

                <div className="profile-avatar-card">

                    <img
                        src={profile?.img}
                        alt={profile?.first_name}
                        className="profile-avatar"
                    />

                    <button
                        className="edit-btn"
                        onClick={() => setEditingSection("avatar")}
                    >
                        <FaEdit />
                    </button>

                    {
                        editingSection === "avatar" && (
                            <div className="mt-3">

                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setSelectedImage(
                                            e.target.files[0]
                                        )
                                    }
                                />

                                <button
                                    className="btn btn-primary mt-2"
                                    onClick={handleUpdateAvatar}
                                >
                                    Guardar imagen
                                </button>

                            </div>
                        )
                    }

                    <h3 className="mt-3">
                        {profile?.first_name} {profile?.last_name}
                    </h3>

                </div>

                <div className="profile-follow-card">

                    <div className="card-header-profile">
                        <h4>Foros Seguidos</h4>

                        <button
                            className="edit-btn-small"
                            onClick={() =>
                                setEditingSection(
                                    editingSection === "follow"
                                        ? null
                                        : "follow"
                                )
                            }
                        >
                            <FaEdit />
                        </button>
                    </div>

                    <div className="follow-list">

                        {followForos.length > 0 ? (
                            followForos.map((foro) => (
                                <div
                                    key={foro.id}
                                    className="follow-item"
                                >

                                    <div className="follow-content">
                                        <img
                                            src={foro.img}
                                            alt={foro.title}
                                            className="follow-image"
                                        />

                                        <span className="follow-title">
                                            {foro.title}
                                        </span>
                                    </div>

                                    {editingSection === "follow" && (
                                        <button
                                            className="unfollow-btn"
                                            onClick={() => handleUnfollow(foro.id)}
                                        >
                                            Dejar de seguir
                                        </button>
                                    )}

                                </div>
                            ))
                        ) : (
                            <p className="text-muted">
                                No sigues ningún foro todavía.
                            </p>
                        )}

                    </div>

                </div>

                <div className="profile-follow-card">

                    <div className="card-header-profile">
                        <h4>Mis foros creados</h4>
                    </div>

                    <div className="follow-list">

                        {
                            myForos?.length > 0 ? (
                                myForos.map((foro) => (
                                    <div
                                        key={foro.id}
                                        className="follow-item"
                                    >

                                        <div className="follow-content">
                                            <img
                                                src={foro.img}
                                                alt={foro.title}
                                                className="follow-image"
                                            />

                                            <span className="follow-title">
                                                {foro.title}
                                            </span>
                                        </div>

                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">
                                    Todavía no has creado ningún foro.
                                </p>
                            )
                        }

                    </div>

                </div>

            </div>


            {/* DERECHA */}
            <div className="profile-right">

                <div className="profile-data-card">

                    <div className="card-header-profile">

                        <h3>Información del usuario</h3>

                        <button
                            className="edit-btn-small"
                            onClick={() => setEditingSection("info")}
                        >
                            <FaEdit />
                        </button>

                    </div>

                    <div className="info-item">
                        <span>Nombre</span>

                        {
                            editingSection === "info" ? (
                                <input
                                    type="text"
                                    className="form-control"
                                    value={profile?.first_name || ""}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            first_name: e.target.value
                                        })
                                    }
                                />
                            ) : (
                                <p>{profile?.first_name}</p>
                            )
                        }
                    </div>

                    <div className="info-item">
                        <span>Apellido</span>

                        {
                            editingSection === "info" ? (
                                <input
                                    type="text"
                                    className="form-control"
                                    value={profile?.last_name || ""}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            last_name: e.target.value
                                        })
                                    }
                                />
                            ) : (
                                <p>{profile?.last_name}</p>
                            )
                        }
                    </div>

                    <div className="info-item">
                        <span>Usuario</span>
                        {
                            editingSection === "info" ? (
                                <input
                                    type="text"
                                    className="form-control"
                                    value={profile?.username || ""}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            username: e.target.value
                                        })
                                    }
                                />
                            ) : (
                                <p>@{profile?.username}</p>
                            )
                        }
                    </div>

                    <div className="info-item">
                        <span>Email</span>
                        {
                            editingSection === "info" ? (
                                <input
                                    type="email"
                                    className="form-control"
                                    defaultValue={profile?.email}
                                />
                            ) : (
                                <p>{profile?.email}</p>
                            )
                        }
                    </div>

                    <div className="info-item">
                        <span>Fecha de nacimiento</span>
                        {
                            editingSection === "info" ? (
                                <input
                                    type="text"
                                    className="form-control"
                                    value={profile?.date_birth || ""}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            date_birth: e.target.value
                                        })
                                    }
                                />
                            ) : (
                                <p>{profile?.date_birth || "No especificada"}</p>
                            )
                        }
                    </div>

                    <div className="info-item">
                        <span>Descripción</span>
                        {
                            editingSection === "info" ? (
                                <textarea
                                    className="form-control"
                                    value={profile?.description || ""}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            description: e.target.value
                                        })
                                    }
                                />
                            ) : (
                                <p>{profile?.description || "Sin descripción"}</p>
                            )
                        }
                    </div>

                    {
                        editingSection === "info" && (
                            <button
                                className="btn btn-primary mt-3"
                                onClick={handleUpdateProfile}
                            >
                                Guardar cambios
                            </button>
                        )
                    }


                </div>

                <div className="profile-tags-card">

                    <div className="card-header-profile">

                        <h3>Tags de gustos</h3>

                        <button
                            className="edit-btn-small"
                            onClick={() => setEditingSection("tags")}
                        >
                            <FaEdit />
                        </button>

                    </div>



                    <div className="tag-container">

                        {
                            userTags.length > 0 ? (
                                userTags.map((tagSelect) => (
                                    <div
                                        key={tagSelect.id}
                                        className="tag-item-profile"
                                    >
                                        <span>{tagSelect.tag.title}</span>

                                        {
                                            editingSection === "tags" && (
                                                <button
                                                    className="remove-tag-btn"
                                                    onClick={async () => {
                                                        await deleteTagFromUser(tagSelect.tag.id);
                                                        setUserTags(
                                                            userTags.filter(
                                                                tag => tag.tag.id !== tagSelect.tag.id
                                                            )
                                                        );
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            )
                                        }

                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">
                                    No hay gustos seleccionados.
                                </p>
                            )
                        }

                    </div>

                    {
                        editingSection === "tags" && (
                            <>
                                <hr />

                                <h5 className="mb-3">
                                    Añadir o eliminar tags
                                </h5>

                                <div className="d-flex flex-wrap gap-2">

                                    {
                                        store.tags
                                            ?.filter(
                                                tag =>
                                                    !userTags.some(
                                                        userTag => userTag.tag.id === tag.id
                                                    )
                                            )
                                            .map((tag) => (
                                                <BodyTag
                                                    key={tag.id}
                                                    tag={tag}
                                                    onSelectedTag={onSelectedTag}
                                                    isSelected={selectedTag.includes(tag.id)}
                                                />
                                            ))
                                    }

                                </div>

                                <button
                                    className="btn btn-success mt-3"
                                    onClick={async () => {

                                        await handleSave();

                                        const nuevosTags = store.tags
                                            .filter(tag => selectedTag.includes(tag.id))
                                            .filter(tag =>
                                                !userTags.some(
                                                    userTag => userTag.tag.id === tag.id
                                                )
                                            )
                                            .map(tag => ({
                                                id: tag.id,
                                                tag: tag
                                            }));

                                        setUserTags([
                                            ...userTags,
                                            ...nuevosTags
                                        ]);

                                        setSelectedTag([]);

                                    }}
                                >
                                    Guardar cambios
                                </button>
                            </>
                        )
                    }

                </div>
            </div>
        </div>


    );
};