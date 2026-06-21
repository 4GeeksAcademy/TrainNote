import logo from "../assets/img/logomin.png";
import "../../css/Navbar.css";

export const Navbar = () => {
    return (
        <nav className="mindfed-navbar">
            <div className="container">

                <img
                    src={logo}
                    alt="MindFed"
                    className="mindfed-logo"
                />

            </div>
        </nav>
    );
};