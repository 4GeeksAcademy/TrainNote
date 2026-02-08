import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/design-system.css";
import "./styles/ui.css";
import "./index.css";

import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { StoreProvider } from "./hooks/useGlobalReducer";
import { BackendURL } from "./components/BackendURL";
import { LoaderProvider } from "./context/loaderContext";
import { UserProvider } from "./context/UserContext";

const Main = () => {

  if (!import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL === "") {
    return (
      <React.StrictMode>
        <BackendURL />
      </React.StrictMode>
    );
  }

  return (
    <React.StrictMode>
      <LoaderProvider>
        <StoreProvider>
          <UserProvider>
            <RouterProvider router={router} />
          </UserProvider>
        </StoreProvider>
      </LoaderProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
