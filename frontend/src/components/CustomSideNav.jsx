import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaDraftingCompass, FaRegEdit, FaClipboardList } from "react-icons/fa";
import { Button, Popover } from "antd";

const CustomSideNav = () => {
  const location = useLocation();

  const menuItems = [
    { key: "/drafts", label: "Drafts", icon: <FaDraftingCompass /> },
    { key: "/to-be-published", label: "To Be Published", icon: <FaRegEdit /> },
    { key: "/published", label: "Published", icon: <FaClipboardList /> },
  ];

  const getPopoverStyles = (label) => {
    switch (label) {
      case "Drafts":
        return { backgroundColor: "#d4e7fc", color: "#5a90e6" };
      case "To Be Published":
        return { backgroundColor: "#dbcbf0", color: "#855DC4" };
      case "Published":
        return { backgroundColor: "#e4f5d8", color: "#6fb94d" };
      default:
        return {};
    }
  };

  return (
    <div className="custom-side-nav">
      <div className="nav-wrapper">
        {menuItems.map((item) => {
          const popoverStyle = getPopoverStyles(item.label);

          return (
            <Link
              to={item.key}
              key={item.key}
              className={`nav-item ${
                location.pathname === item.key ? "active" : ""
              }`}
            >
              <Popover
                content={
                  <div style={{ color: popoverStyle.color }}>
                    {item.label}
                  </div>
                }
                placement="right"
                overlayInnerStyle={{
                  backgroundColor: popoverStyle.backgroundColor,
                }}
              >
                <Button
                  style={{
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <div className="nav-icon">{item.icon}</div>
                </Button>
              </Popover>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CustomSideNav;
