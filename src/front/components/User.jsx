import React from "react"


export const User = () => {
    return (
        <div>
            <div className="card mb-3">
                <div className="card-body">
                    <h5 className="card-title">Buy Tickets</h5>

                    <p className="card-text">
                        Find events and buy your tickets quickly and safely.
                    </p>

                    <button className="btn btn-primary">
                        Find Events
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Register Company</h5>

                    <p className="card-text">
                        Create events and sell tickets online with 4Tickets.
                    </p>

                    <button className="btn btn-primary">
                        Start Selling
                    </button>
                </div>
            </div>
        </div>
    );
};