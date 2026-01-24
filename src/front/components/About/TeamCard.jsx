export default function TeamCard({ name, role, img }) {
  return (
    <article className="team-card">
      <img src={img} alt={name} />

      <div className="team-info">
        <h3>{name}</h3>
        <span>{role}</span>

        {/* ICONOS */}
        <div className="team-icons">
          <i className="fa-brands fa-linkedin-in"></i>
          <i className="fa-brands fa-x-twitter"></i>
          <i className="fa-brands fa-instagram"></i>
        </div>
      </div>
    </article>
  );
}
