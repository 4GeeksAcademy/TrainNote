import "../styles/about.css";

import AboutHero from "../components/About/AboutHero";
import AboutMission from "../components/About/AboutMission";
import AboutTeam from "../components/About/AboutTeam";

export default function About() {
  return (
    <main className="about">
      <AboutHero />
      <AboutMission />
      <AboutTeam />
    </main>
  );
}