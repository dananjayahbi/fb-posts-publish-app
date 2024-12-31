import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import Drafts from "./components/Drafts";
import ToBePublished from "./components/ToBePublished";
import Published from "./components/Published";
import Credentials from "./pages/Credentials";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/drafts" replace />} />
        <Route path="/drafts" element={<Layout><Drafts /></Layout>} />
        <Route path="/to-be-published" element={<Layout><ToBePublished /></Layout>} />
        <Route path="/published" element={<Layout><Published /></Layout>} />
        <Route path="/credentials" element={<Layout><Credentials /></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;
