import TeamCard from "./TeamCard";

const team = [
  {
    name: "Fernando Del Río",
    role: "Director Técnico",
    img: "https://media.licdn.com/dms/image/v2/D4D03AQEWDwalRN5ACw/profile-displayphoto-crop_800_800/B4DZnnEnxlIgAQ-/0/1760518372927?e=1770854400&v=beta&t=gfF5c6v0HQvtfCBpN9sfjT8roLS3Bh-OnKJBPPZVXZw",
    linkedin: "https://www.linkedin.com/in/fernando-david-del-rio-96b71168/"
  },
  {
    name: "Alex Martín",
    role: "Desarrollo y Estrategia",
    img: "https://media.licdn.com/dms/image/v2/D4D03AQE6wuQ1_cl2yg/profile-displayphoto-crop_800_800/B4DZvqjwWoH0AM-/0/1769166804459?e=1770854400&v=beta&t=oq3dVitIzc30F_VJtZ_QkNYei9ii7w0948lPYjOnGWg",
    linkedin: "https://www.linkedin.com/in/alexmartintv/"
  },
  {
    name: "Raúl Reyes",
    role: "Diseño UI",
    img: "https://media.licdn.com/dms/image/v2/D4E03AQGLIcvxkLVMEA/profile-displayphoto-crop_800_800/B4EZv_J2GvG0AI-/0/1769512330790?e=1770854400&v=beta&t=OjMuVEOic0cfQJrXJy-NJX7i6xqK_bnKkSvbFeITcM8",
    linkedin: "https://www.linkedin.com/in/raul-reyes-00851b386/"
  },
  
];

export default function AboutTeam() {
  return (
    <section className="about-team">
      <span className="section-tag">El Pelotón</span>

      <div className="team-grid">
        {team.map((m) => (
          <TeamCard key={m.name} {...m} />
        ))}
      </div>

      <button className="contact-btn">
        Contáctanos <span>→</span>
      </button>
    </section>
  );
}
