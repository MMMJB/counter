import React from "react";

import { AuthProvider } from "./Contexts/AuthContext";

import Dashboard from "./Pages/Dashboard/Dashboard";
import Login from "./Pages/Auth/Login";
import Signup from "./Pages/Auth/Signup";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./Components/PrivateRoute";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PrivateRoute reverse={true}>
                <Login />
              </PrivateRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PrivateRoute reverse={true}>
                <Signup />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
