export default function Footer() {
  return (
    <footer className="footer">
      
           {/* Divider */}
      <div className="footer-divider" />

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
        <span>Política de privacidad</span>
        <span>Cookies</span>
      </div>

    </footer>
  );
}
