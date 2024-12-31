import React, { useEffect, useState } from "react";
import CustomSideNav from "../components/CustomSideNav";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Layout as AntLayout } from "antd";

const { Content, Sider } = AntLayout;

const Layout = ({ children }) => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Header />
      <AntLayout
        style={{
          minHeight: "100vh",
          display: "flex",
          marginLeft: "20px",
        }}
      >
        <Sider
          width={80} // Set the width to match the custom sidebar design
          style={{
            height: "250px",
            backgroundColor: "#cadaff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "15px",
            borderRadius: "50px",
            marginTop: (windowHeight - 450) / 2, // Center the Sider vertically
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CustomSideNav />
        </Sider>
        <AntLayout>
          <Content style={{ padding: "20px", marginBottom: "60px" }}>
            {children}
          </Content>
        </AntLayout>
      </AntLayout>
      <Footer />
    </AntLayout>
  );
};

export default Layout;
