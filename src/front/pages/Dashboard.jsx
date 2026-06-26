import React from "react";
import { Navigate } from "react-router-dom";
import { AdminDashboard } from "./AdminDashboard";
import { MechanicDashboard } from "./MechanicDashboard";

const getStoredObject = (key) => {
  const storedValue = localStorage.getItem(key);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue);
  } catch (error) {
    console.error(`Error reading ${key} from localStorage`, error);
    localStorage.removeItem(key);
    return null;
  }
};

export const Dashboard = () => {
  const token = localStorage.getItem("token");
  const user = getStoredObject("user");
  const employee = getStoredObject("employee");

  if (!token || !user || !employee) {
    return <Navigate to="/login" replace />;
  }

  const role = employee.role ? employee.role.toLowerCase() : "";

  if (role === "admin") {
    return <AdminDashboard user={user} />;
  }

  if (role === "mechanic") {
    return <MechanicDashboard user={user} />;
  }

  return <Navigate to="/login" replace />;
};