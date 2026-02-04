import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      
      {/* Social */}
      <div className="footer-social">
        <i className="fa-solid fa-globe"></i>
        <i className="fa-regular fa-at"></i>
        <i className="fa-solid fa-basketball"></i>
      </div>

      {/* Legal */}
      <p className="footer-copy">
        © 2026 TRAIL · Reservados todos los derechos
      </p>

      <div className="footer-links">
        <span onClick={() => navigate("/about")} style={{ cursor: "pointer" }}>
          About
        </span>

        <span>Política de privacidad</span>
        <span>Cookies</span>
      </div>

    </footer>
  );
}
