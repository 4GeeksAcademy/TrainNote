import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SettingsDropdown from "./SettingsDropdown";
import "../../styles/header.css";

const ProfileHeader = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
          className={`profile-avatar ${location.pathname === "/profile" ? "active" : ""
            }`}
        />

        <div className="profile-info">
          <h1>Fernando Del Rio</h1>
          <span>Ponferrada, ES</span>
        </div>
      </div>

      <div className="profile-actions">
        {/* HOME ICON */}
        <i
          className={"fa-solid fa-house nav-home-icon"}
          onClick={() => navigate("/home")}
        />

        {/* LOGOUT */}
        <div className="settings-wrapper">
          <button className="logout-btn" onClick={() => setOpen(!open)}>
            <i className="fa-solid fa-power-off logout-icon"></i>
          </button>

          {open && <SettingsDropdown onLogout={handleLogout} />}
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
