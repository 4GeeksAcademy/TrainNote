import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = useCallback(() => setIsLoading(true), []);
  const hideLoader = useCallback(() => setIsLoading(false), []);

  const value = useMemo(
    () => ({ isLoading, showLoader, hideLoader }),
    [hideLoader, isLoading, showLoader]
  );

  return (
    <LoaderContext.Provider
      value={value}
    >
      {children}
    </LoaderContext.Provider>
  );
};

LoaderProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useLoader = () => {
  return useContext(LoaderContext);
};
