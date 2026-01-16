import { useState } from "react";
import "../../styles/header.css";
import SettingsDropdown from "./SettingsDropdown";
import { useNavigate } from "react-router-dom";

const ProfileHeader = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <header className="profile-header">
      <div className="profile-left">
        <img
          src="https://ca.slack-edge.com/T0BFXMWMV-U08U5P1CMT8-66334e023a99-512"
          alt="avatar"
          className="profile-avatar"
        />

        <div className="profile-info">
          <h1>Fernando Del Rio</h1>
          <span>Ponferrada, ES</span>
        </div>
      </div>
      <div className="settings-wrapper">
        <button
          className="settings-btn"
          onClick={() => setOpen(!open)}
        >
          ⚙️
        </button>
        {open && <SettingsDropdown onLogout={handleLogout} />}
      </div>
    </header>
  );
};

export default ProfileHeader;