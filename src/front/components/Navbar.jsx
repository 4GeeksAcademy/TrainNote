import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light position: fixed">
            <div className="container">

                <a className="navbar-brand" href="#">
                    4Tickets
                </a>

                <div className="ms-auto">
                    <a className="btn btn-outline-primary me-2" href="#">
                        Login
                    </a>

                    <a className="btn btn-outline-primary" href="#">
                        Contact
                    </a>
                </div>

            </div>
        </nav>
    );
};