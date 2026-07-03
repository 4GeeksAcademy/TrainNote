import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CardForoSimply } from "../components/CardForo.jsx";
import { useForo } from "../hooks/Hooks_foro/useForo.js";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";


export const AllForos = () => {
    const { store, dispatch } = useGlobalReducer()

    const { getDataForo } = useForo();

    useEffect(() => {
        getDataForo();
    }, []);

    return (
        <div className="container py-4">

            <div className="d-flex flex-wrap gap-2 border p-3 rounded bg-light overflow-y-auto">
                {store.foros && store.foros.map((foro) => {
                    return (
                        <div className="card shadow-sm border rounded-3 overflow-hidden bg-white">
                            <div>
                                <div>
                                    <CardForoSimply key={foro.id} foro={foro} img={foro?.img} title={foro?.title} description={foro?.description} />
                                </div>
                                <div className="text-center mt-3">
                                    <Link className="btn btn-primary w-40 fw-bold shadow-sm py-2 m-2"
                                    to={`/foro/${foro.id}`}>
                                        Entrar
                                    </Link>
                                </div>
                            </div>
                        </div>)
                })}
            </div>

            <div className="mb-4">
                <Link
                to="/feed"
                className="btn btn-outline-secondary px-4 fw-bold mt-3"
                >
                    Back
                </Link>
            </div>
        </div>
    )
}