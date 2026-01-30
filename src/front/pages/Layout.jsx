import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import { Loader } from "../components/Loader/Loader";
import { useLoader } from "../context/loaderContext";
import "../styles/footer.css";
import AiChatDialog from "../components/AiChatDialog";
import MainHeader from "../components/Header/MainHeader";
import { use } from "react";

export const Layout = () => {
  const { isLoading } = useLoader();
  const location = useLocation();

  const hideHeader =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <>
      {isLoading && <Loader />}

      <div className={`app-root ${isLoading ? "is-loading" : ""}`}>
        {!hideHeader && <MainHeader />}

        <Outlet />
        
        <AiChatDialog floating />
        <Footer />
      </div>
    </>
  );
};
