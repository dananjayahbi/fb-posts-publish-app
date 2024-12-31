import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#f0f2f5",
        color: "#555555",
        padding: "10px 20px",
        textAlign: "center",
        fontSize: "14px",
        borderTop: "1px solid #d9d9d9",
      }}
    >
      &copy; {new Date().getFullYear()} Posts-management App. All rights reserved.
    </footer>
  );
};

export default Footer;
