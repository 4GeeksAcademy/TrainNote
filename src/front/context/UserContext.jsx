import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { session } from "../services/session";

const UserContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isUserReady, setIsUserReady] = useState(false);

  UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      if (!session.isLoggedIn()) {
        if (!cancelled) {
          setUser(null);
          setIsUserReady(true);
        }
        return;
      }

      const token = session.getToken();
      if (!token) {
        session.clear();
        if (!cancelled) {
          setUser(null);
          setIsUserReady(true);
        }
        return;
      }

      try {
        const resp = await fetch(`${backendUrl}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!resp.ok) {
          session.clear();
          if (!cancelled) setUser(null);
          return;
        }

        const data = await resp.json();
        const nextUser = data?.user || null;

        if (!cancelled) {
          setUser(nextUser);
        }
      } catch {
        session.clear();
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsUserReady(true);
      }
    };

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateUser = useCallback((nextUser) => {
    setUser(nextUser);
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
    session.clear();
  }, []);

  const value = useMemo(
    () => ({ user, isUserReady, updateUser, clearUser }),
    [clearUser, isUserReady, updateUser, user]
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
