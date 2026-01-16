import { useEffect, useState } from "react";
import BikeCard from "./BikeCard";
import AddBikeModal from "./AddBikeModal";
import "../../styles/garage.css";

const Garage = () => {
  const [bikes, setBikes] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchBikes = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/bikes",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) return;
      const data = await res.json();
      setBikes(data);
    };
    fetchBikes();
  }, []);

  const handleBikeCreated = (bike) => {
    setBikes(prev => [...prev, bike]);
  };

  return (
    <section className="garage">
      <div className="garage-header">
        <h2>Mi Garaje</h2>
        <button className="add-bike" onClick={() => setOpenModal(true)}>
          + Añadir Bici
        </button>
      </div>

      <div className="garage-list">
        {bikes.map(bike => (
          <BikeCard
            key={bike.id}
            active={bike.is_active}
            name={bike.name}
            specs={bike.specs}
            km={`${bike.km_total} km registrados`}
            image={bike.image_url}
          // podrías pasar bike.parts para un modal de detalles
          />
        ))}
      </div>

      <AddBikeModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onBikeCreated={handleBikeCreated}
      />
    </section>
  );
};

export default Garage;
