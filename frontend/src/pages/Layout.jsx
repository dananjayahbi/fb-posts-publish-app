import React from "react";
import { Layout } from "antd";

const { Content, Footer } = Layout;

const AppLayout = ({ children }) => {
  return (
    <Layout>
      <Content style={{ padding: "20px" }}>{children}</Content>
      <Footer style={{ textAlign: "center" }}>
        Posts Manager ©2024 | Developed by Dananjaya
      </Footer>
    </Layout>
  );
};

export default AppLayout;
