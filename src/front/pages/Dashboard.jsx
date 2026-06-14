import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";

const carsData = [
  { id: 1, brand: "Toyota", model: "Corolla", year: 2021, price: "$18,500", color: "Blanco" },
  { id: 2, brand: "Honda", model: "Civic", year: 2022, price: "$21,000", color: "Negro" },
  { id: 3, brand: "Ford", model: "Mustang", year: 2020, price: "$35,000", color: "Rojo" },
  { id: 4, brand: "BMW", model: "X5", year: 2023, price: "$59,000", color: "Azul" },
  { id: 5, brand: "Audi", model: "A3", year: 2021, price: "$31,500", color: "Gris" },
  { id: 6, brand: "Volkswagen", model: "Golf", year: 2022, price: "$24,000", color: "Verde" }
];

export const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCars = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return carsData;
    return carsData.filter((car) =>
      `${car.brand} ${car.model} ${car.year} ${car.color}`.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Dashboard de Coches</h1>
          <p className="text-muted mb-0">Busca y filtra tu coche por marca, modelo, año o color.</p>
        </div>
        <Link to="/" className="btn btn-outline-secondary">
          Cerrar sesión
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="search"
          className={`form-control py-3 px-4 border ${styles.loginInput}`}
          placeholder="Buscar coches..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="row g-4">
        {filteredCars.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-warning">No se encontraron coches con ese filtro.</div>
          </div>
        ) : (
          filteredCars.map((car) => (
            <div className="col-12 col-md-6 col-xl-4" key={car.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title mb-1">{car.brand} {car.model}</h5>
                  <p className="text-muted mb-2">Año {car.year} · {car.color}</p>
                  <p className="card-text mb-4">Precio: <strong>{car.price}</strong></p>
                  <ul className="list-group list-group-flush mb-4">
                    <li className="list-group-item">Marca: {car.brand}</li>
                    <li className="list-group-item">Modelo: {car.model}</li>
                    <li className="list-group-item">Año: {car.year}</li>
                    <li className="list-group-item">Color: {car.color}</li>
                  </ul>
                  <button className="btn btn-primary mt-auto">Ver detalles</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
