import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { StaffCard } from "../components/StaffCard";
import { GroupCard } from "../components/GroupCard";

export const HomeAdmin = () => {
    const { store, dispatch } = useGlobalReducer();

 
    useEffect(() => {
        const fetchMe = async () => {
            try {
                const backend = import.meta.env.VITE_BACKEND_URL;
                const resp = await fetch(`${backend}/me`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!resp.ok) throw new Error("Error obteniendo usuario");

                const data = await resp.json();

                dispatch({
                    type: "SET_CURRENT_USER",
                    payload: data,
                });
            } catch (error) {
                console.error("Error fetching current user:", error);
            }
        };

        fetchMe();
    }, [dispatch]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const backend = import.meta.env.VITE_BACKEND_URL;
                const resp = await fetch(`${backend}/groups`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const data = await resp.json();

                dispatch({
                    type: "SET_GROUPS",
                    payload: data,
                });
            } catch (error) {
                console.error("Error fetching groups:", error);
            }
        };

        fetchGroups();
    }, [dispatch]);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const backend = import.meta.env.VITE_BACKEND_URL;
                const resp = await fetch(`${backend}/staff`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!resp.ok) throw new Error("Error obteniendo staff");

                const data = await resp.json();

                dispatch({
                    type: "GET_STAFF_SUCCESS",
                    payload: filteredUsers,
                });
            } catch (error) {
                console.error("Error fetching staff:", error);
            }
        };

        fetchStaff();
    }, [dispatch]);

    return (
        <div className="bg-light pb-5">
            {/* HERO */}
            <div className="g-color-bg hero-home text-white">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <h1 className="display-5 fw-bold mb-4 g-color">
                                Bienvenido  <span className="text-primary">{store.user?.name || "Administrador"}</span>
                            </h1>
                            <p className="fs-5">
                                Aquí podrás gestionar los grupos de tu institución
                                y administrar usuarios.
                            </p>
                        </div>

                        <div className="col-md-6 text-center my-3">
                            <img
                                src="https://fastly.picsum.photos/id/3/5000/3333.jpg?hmac=GDjZ2uNWE3V59PkdDaOzTOuV3tPWWxJSf4fNcxu4S2g"
                                className="img-fluid rounded-5"
                                alt="hero"
                            />
                        </div>
                    </div>
                </div>
            </div>


            <div className="container mt-5">
                <h2 className="fw-bold mb-4">Grupos creados</h2>

                {store.groups?.length === 0 && (
                    <p>No hay grupos creados</p>
                )}

                <div className="d-flex gap-3 overflow-auto px-3 pb-3">
                    {store.groups?.map(group => (
                        <GroupCard key={group.id} group={group} />
                    ))}
                </div>
            </div>

            {/* STAFF */}
            <div className="container mt-5">
                <h2 className="fw-bold mb-4">Funcionarios de la Institución</h2>

                {store.staff?.length === 0 && (
                    <p>No hay funcionarios registrados</p>
                )}

                <div className="d-flex gap-3 overflow-auto px-3 pb-3">
                    {store.staff?.map(staff => (
                        <StaffCard key={staff.id} staff={staff} />
                    ))}
                </div>
            </div>
        </div>
    );
};
