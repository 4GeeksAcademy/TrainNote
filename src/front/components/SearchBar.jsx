import React from "react"



export const SearchBar = () => {
    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="row g-2">

                        <div className="col-md-5">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by artist, event or site"
                            />
                        </div>

                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="City"
                            />
                        </div>

                        <div className="col-md-2">
                            <input
                                type="date"
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-2">
                            <button className="btn btn-primary w-100">
                                Search
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
