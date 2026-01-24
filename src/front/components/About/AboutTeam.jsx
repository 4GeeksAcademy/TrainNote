import TeamCard from "./TeamCard";

const team = [
  {
    name: "Fernando Del Río",
    role: "Director Técnico",
    img: "https://media.licdn.com/dms/image/v2/D4D03AQEWDwalRN5ACw/profile-displayphoto-crop_800_800/B4DZnnEnxlIgAQ-/0/1760518372927?e=1770854400&v=beta&t=gfF5c6v0HQvtfCBpN9sfjT8roLS3Bh-OnKJBPPZVXZw",
    
  },
  {
    name: "Alex Martín",
    role: "Desarrollo y Estrategia",
    img: "https://media.licdn.com/dms/image/v2/D4D03AQE6wuQ1_cl2yg/profile-displayphoto-crop_800_800/B4DZvqjwWoH0AM-/0/1769166804459?e=1770854400&v=beta&t=oq3dVitIzc30F_VJtZ_QkNYei9ii7w0948lPYjOnGWg",
  },
  {
    name: "Raúl Reyes",
    role: "Diseño UI",
    img: "https://lh3.googleusercontent.com/a/ACg8ocLiOngDQ4vs_w-yp-eY52j0tDOPR3a77mN4wvklTSHrUni7CtWk=s288-c-no",
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
