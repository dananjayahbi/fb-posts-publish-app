import React, { useEffect, useState, useRef } from "react";

const Header = () => {
  const [status, setStatus] = useState("offline");
  const [wsRtt, setWsRtt] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000"); // Update the port if necessary

    ws.current.onopen = () => {
      setStatus("online");
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
    };

    ws.current.onerror = () => {
      setStatus("offline");
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const indicatorStyle = {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: status === "online" ? "green" : "red",
    display: "inline-block",
    marginLeft: "10px",
  };

  return (
    <div style={{ textAlign: "center", padding: "10px" }}>
      <h1>
        Posts-Management App
        <span style={indicatorStyle}></span>
      </h1>
      {status === "online" && wsRtt !== null && (
        <p>RTT: <strong>{wsRtt} ms</strong></p>
      )}
    </div>
  );
};

export default Header;
