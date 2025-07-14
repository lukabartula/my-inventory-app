import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from "./pages/LoginPage";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Signup from "./components/Auth/Signup";
import Transactions from "./pages/Transactions";
import Sales from "./pages/Sales";

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/sales" element={<Sales />} />
        </Routes>

        <ToastContainer position="bottom-right" autoClose={3000} />
      </>
    </Router>
  );
}

export default App;
