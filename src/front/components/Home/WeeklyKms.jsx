import "../../styles/weeklyKms.css";

const WeeklyKms = () => {
  return (
    <section className="weekly-kms ui-panel">

      {/* FILA SUPERIOR */}
      <div className="weekly-top">
        <div className="weekly-left">
          <span className="weekly-label ui-text">KMS SEMANALES</span>
          <h2 className="weekly-value ui-title">
            128.4 <span>km</span>
          </h2>
        </div>

        <div className="weekly-right">
          <span className="weekly-diff positive">+12%</span>
          <span className="weekly-sub">vs. semana pasada</span>
        </div>
      </div>

      {/* GRÁFICO */}
      <div className="weekly-chart">
        <div className="weekly-bars">
          <div className="weekly-bar" />
          <div className="weekly-bar" />
          <div className="weekly-bar active" />
          <div className="weekly-bar" />
          <div className="weekly-bar" />
        </div>
      </div>

      {/* DIVISOR */}
      <div className="ui-divider" />

      {/* FILA INFERIOR */}
      <div className="weekly-bottom">
        <div>
          <span className="weekly-sub">Desnivel acumulado</span>
          <strong className="weekly-extra"> 2.450 m</strong>
        </div>

        <div className="weekly-record">
          <span className="weekly-sub">Récord personal</span>
          <strong> 84 km/h</strong> máx
        </div>
      </div>

    </section>
  );
};

export default WeeklyKms;
