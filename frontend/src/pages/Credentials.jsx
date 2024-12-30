import React, { useState, useEffect } from "react";
import { Input, Button, message, Card } from "antd";
import api from "../services/api";

const Credentials = () => {
  const [pageId, setPageId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const data = await api.getCredentials();
      setPageId(data.pageId);
      setAccessToken(data.accessToken);
    } catch (error) {
      message.error("Failed to fetch credentials.");
    }
  };

  const handleUpdate = async () => {
    if (!pageId || !accessToken) {
      message.error("Page ID and Access Token are required.");
      return;
    }

    setLoading(true);
    try {
      await api.updateCredentials({ pageId, accessToken });
      message.success("Credentials updated successfully.");
    } catch (error) {
      message.error("Failed to update credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Manage Facebook Credentials" style={{ maxWidth: 500, margin: "20px auto" }}>
      <div style={{ marginBottom: 16 }}>
        <label>Facebook Page ID:</label>
        <Input
          value={pageId}
          onChange={(e) => setPageId(e.target.value)}
          placeholder="Enter Facebook Page ID"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Facebook Access Token:</label>
        <Input
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          placeholder="Enter Facebook Access Token"
        />
      </div>
      <Button style={{ marginRight: 8 }} onClick={() => window.history.back()}>
        Back
      </Button>
      <Button type="primary" onClick={handleUpdate} loading={loading}>
        Update Credentials
      </Button>
    </Card>
  );
};

export default Credentials;
