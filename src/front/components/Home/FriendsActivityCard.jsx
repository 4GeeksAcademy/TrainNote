import { useNavigate } from "react-router-dom";
import "../../styles/friendsActivity.css";

const FriendsActivityCard = ({
  routeId,
  avatar,
  name,
  action,
  time,
  distance,
  duration,
  mapPreview
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/routes/${routeId}`);
  };

  return (
    <article
      className="friends-card clickable"
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      {/* HEADER */}
      <div className="friends-header">
        <img
          className="friends-avatar"
          src={avatar}
          alt={`Avatar de ${name}`}
        />

        <div className="friends-info">
          <strong>{name}</strong>
          <span>{action}</span>
          <small>{time}</small>
        </div>
      </div>

      {/* RUTA */}
      <div className="friends-route">
        <div className="route-info">
          <strong>Ruta completada</strong>
          <div className="route-meta">
            <span>{distance}</span>
            <span>•</span>
            <span>{duration}</span>
          </div>
        </div>

        <img
          className="route-preview"
          src={mapPreview}
          alt="Preview ruta"
        />
      </div>

      {/* FOOTER */}
      <div className="friends-footer">
        <span>💛 12 Likes</span>
        <span>💬 3</span>
      </div>
    </article>
  );
};

export default FriendsActivityCard;
