import "../../styles/header.css";

const SettingsDropdown = ({ onLogout }) => {
    return (
        <div className="settings-dropdown">
            <button onClick={onLogout} className="logout-btn">
                Cerrar sesión
            </button>
        </div>
    );
};

export default SettingsDropdown;
