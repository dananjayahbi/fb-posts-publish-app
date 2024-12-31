import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Post Management</h1>
      <nav>
        <Link to="/drafts" style={{ margin: "0 15px", fontSize: "18px" }}>
          Drafts
        </Link>
        <Link to="/to-be-published" style={{ margin: "0 15px", fontSize: "18px" }}>
          To Be Published
        </Link>
        <Link to="/published" style={{ margin: "0 15px", fontSize: "18px" }}>
          Published
        </Link>
      </nav>
    </div>
  );
};

export default Dashboard;
