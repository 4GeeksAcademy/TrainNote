import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import { Loader } from "../components/Loader/Loader";
import { useLoader } from "../context/loaderContext";
import "../styles/footer.css";

export const Layout = () => {
  const { isLoading } = useLoader();

  return (
    <>
      {isLoading && <Loader />}

      <div className={`app-root ${isLoading ? "is-loading" : ""}`}>
        <Outlet />
        <Footer />
      </div>
    </>
  );
};
