import React, { useEffect } from "react"
import { Section } from "../components/Section";
import { SearchBar } from "../components/SearchBar.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { AtroposCard } from "../components/Atropos.jsx"
import { User } from "../components/User";

export const Home = () => {

	return (
		<>
		<Section />
		<div className="container my-5">
                <div className="row align-items-center">

                    <div className="col-md-4">
                        <User />
                    </div>

                    <div className="col-md-8">
                        <AtroposCard />
                    </div>

                </div>
            </div>
		
		</>
	)
};

export default Home;