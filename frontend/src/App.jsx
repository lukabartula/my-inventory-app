import logo from "./logo.svg";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* We'll add more routes here later (ProductsPage, DashboardPage, etc.) */}
      </Routes>
    </Router>

  );
}

export default App;
