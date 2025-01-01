import React, { useEffect, useState, useRef } from "react";
import { Popover } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

const Header = () => {
  const [status, setStatus] = useState("connecting");
  const [wsRtt, setWsRtt] = useState(null);
  const ws = useRef(null);
  const retryInterval = useRef(null);

  const connectWebSocket = () => {
    ws.current = new WebSocket("ws://localhost:3000"); // Update the port if necessary

    ws.current.onopen = () => {
      setStatus("online");
      clearInterval(retryInterval.current);
    };

    ws.current.onmessage = (message) => {
      const data = JSON.parse(message.data);
      const endTime = Date.now();
      if (data.timestamp) {
        const roundTripTime = endTime - data.timestamp;
        setWsRtt(roundTripTime);
      }
    };

    ws.current.onclose = () => {
      setStatus("offline");
      retryConnection();
    };

    ws.current.onerror = () => {
      setStatus("offline");
      retryConnection();
    };
  };

  const retryConnection = () => {
    if (!retryInterval.current) {
      retryInterval.current = setInterval(() => {
        if (status === "offline") {
          setStatus("connecting");
          connectWebSocket();
        }
      }, 5000);
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (retryInterval.current) {
        clearInterval(retryInterval.current);
      }
    };
  }, []);

  const indicatorStyle = {
    width: "10px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: status === "online" ? "green" : status === "connecting" ? "yellow" : "red",
    display: "inline-block",
    marginLeft: "10px",
    marginTop: "12px",
    border: "none",
    cursor: "pointer",
  };

  const handleReload = () => {
    window.location.reload();
  };

  const popoverContent = <p>Press "Alt" key to toggle the tools menu.</p>;

  return (
    <div style={{ textAlign: "center", padding: "10px" }}>
      <h1 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
        <Popover content={popoverContent} trigger="click">
          <QuestionCircleOutlined style={{ fontSize: "16px", cursor: "pointer" }} />
        </Popover>
        Posts-Management App
        <button style={indicatorStyle} onClick={handleReload}></button>
      </h1>
      {status === "online" && wsRtt !== null && (
        <p>RTT: <strong>{wsRtt} ms</strong></p>
      )}
    </div>
  );
};

export default Header;
