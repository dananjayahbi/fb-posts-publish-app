import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Credentials from "./pages/Credentials";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/credentials" element={<Credentials />} />
      </Routes>
    </Router>
  );
};

export default App;
