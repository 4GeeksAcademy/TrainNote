import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { Loader } from "../components/Loader/Loader";
import { useLoader } from "../context/loaderContext";
import "../styles/footer.css";
import MainHeader from "../components/Header/MainHeader";
import { useEffect, useState } from "react";
import ScrollToTop from "../components/ScrollToTop";

export const Layout = () => {
  const { isLoading } = useLoader();
  const location = useLocation();
  const navigate = useNavigate();

  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    setUser(storedUser);

    if (storedUser && location.pathname === "/") {
      navigate("/home");
    }

    setAuthLoading(false);
  }, [location.pathname]);

  if (authLoading) return null;

  const hideHeader =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/about";

  const hideFooter =
    location.pathname === "/route-registration" ||
    location.pathname === "/about";

  return (
    <>
      {isLoading && <Loader />}

      <div className={`app-root ${isLoading ? "is-loading" : ""}`}>
        {user && !hideHeader && <MainHeader />}

        <ScrollToTop location={location}>
          <Outlet />
        </ScrollToTop>

        {!hideFooter && <Footer />}
      </div>
    </>
  );
};
