import React from "react"




import { SearchBar } from "./SearchBar";

export const Section = () => {
    return (
        <div className="container text-center my-5">

            <h1>Buy and Sell Tickets Easily</h1>

            <p className="mt-3">
                Find events, buy tickets, or create your own events.
            </p>

            <SearchBar />

        </div>
    );
};