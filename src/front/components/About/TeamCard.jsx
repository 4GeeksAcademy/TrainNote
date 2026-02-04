export default function TeamCard({ name, role, img, linkedin, twitter, instagram }) {
  return (
    <article className="team-card">
      <img src={img} alt={name} />

      <div className="team-info">
        <h3>{name}</h3>
        <span>{role}</span>

        <div className="team-icons">
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
          )}

 {/*}        {twitter && (
            <a href={twitter} target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
          )}

          {instagram && (
            <a href={instagram} target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-instagram"></i>
            </a>
          )}             */}
        </div>
      </div>
    </article>
  );
}
