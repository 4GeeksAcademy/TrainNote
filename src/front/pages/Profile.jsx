import { useState, useRef, useEffect } from "react";
import { useUser } from "../context/UserContext";
import Garage from "../components/Profile/Garage";
import defaultAvatar from "../assets/trail.png";

const Profile = () => {
  const { user, updateUser } = useUser();
  const [draftUser, setDraftUser] = useState(user);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef();

  
  useEffect(() => {
    setDraftUser(user);
  }, [user]);

  if (!draftUser) return null;

  const handleChange = (key, value) => {
    setDraftUser(prev => ({ ...prev, [key]: value }));
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setDraftUser(prev => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    updateUser(draftUser);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="home">
      <div className="home-content">
        <main className="home-content">

          {/* PERFIL */}
          <div className="ui-panel">

            <h2 style={{ marginBottom: 32 }}>Mi perfil</h2>

            {/* Avatar */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 16,
                marginBottom: 40
              }}
            >
              <img
                src={draftUser?.avatar || defaultAvatar}
                alt="avatar"
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  objectFit: "cover",
                  cursor: "pointer"
                }}
                onClick={() => fileInputRef.current.click()}
              />

              <button
                className="ui-btn ui-btn--secondary"
                onClick={() => fileInputRef.current.click()}
              >
                Cambiar avatar
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatar}
                style={{ display: "none" }}
              />
            </div>

            {/* Campos */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 24,
                marginBottom: 32
              }}
            >

              <div>
                <label>Email</label>
                <input
                  className="ui-input"
                  value={draftUser.email || ""}
                  disabled
                />
              </div>

              <div>
                <label>Nombre</label>
                <input
                  className="ui-input"
                  value={draftUser.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              <div>
                <label>Ubicación</label>
                <input
                  className="ui-input"
                  value={draftUser.location || ""}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </div>

            </div>

            {/* Guardar */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                className="ui-btn ui-btn--secondary"
                onClick={saveProfile}
              >
                Guardar perfil
              </button>
            </div>

            {saved && (
              <p style={{ color: "#22c55e", marginTop: 12 }}>
                Perfil actualizado
              </p>
            )}

          </div>

          {/* GARAJE */}
          <div className="ui-panel">
            <Garage />
          </div>

        </main>
      </div>
    </div>
  );
};

export default Profile;
