import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import NavBar from "./pages/Navbar";
import Register from "./pages/Registration";
import VerifyPage from "./pages/VerifyPage";
import LoginPage from "./pages/LoginPage";
import { useEffect, useState } from "react";
import axios from "axios";
import baseURL from "./base_url";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("token") ? true : false
  );
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Check if token exists and is valid
    if (token) {
      axios
        .get(`${baseURL}/api/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data)
          // If the token is valid, set logged in state to true
          setIsLoggedIn(true);
        })
        .catch((error) => {
          // If token is invalid, remove it from local storage
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        });
    }
  }, []);

  return (
    <Router>
      <NavBar />
      <Routes>
        {/* Redirect to HomePage if logged in; otherwise, redirect to Login */}
        <Route
          path="/"
          element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />}
        />

        {/* Only show these routes if not logged in */}
        {!isLoggedIn ? (
          <>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<LoginPage />} />
          </>
        ) : (
          // Redirect logged-in users away from these routes
          <>
            <Route path="/register" element={<Navigate to="/" />} />
            <Route path="/login" element={<Navigate to="/" />} />
          </>
        )}

        <Route path="/verify" element={<VerifyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
