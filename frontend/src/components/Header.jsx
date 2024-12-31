import React from "react";

const Header = () => {
  return (
    <div style={headerStyle}>
      <h1 style={titleStyle}>Posts-Management App</h1>
    </div>
  );
};

const headerStyle = {
//   backgroundColor: "#4a4af9",
  color: "#000",
  textAlign: "center",
  padding: "10px 0",
  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
};

const titleStyle = {
  margin: 0,
  fontSize: "24px",
  fontWeight: "bold",
};

export default Header;
