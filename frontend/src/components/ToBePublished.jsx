import React, { useEffect, useState } from "react";
import { message, Button } from "antd";
import { useNavigate } from "react-router-dom";
import ImageGallery from "./ImageGallery";
import api from "../services/api";

const ToBePublished = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false); // State to track loading
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToBePublishedPosts = async () => {
      try {
        const data = await api.getToBePublishedPosts();
        setPosts(data);
      } catch (error) {
        message.error("Error fetching to-be-published posts.");
      }
    };

    fetchToBePublishedPosts();
  }, []);

  const handlePublish = async (post) => {
    setLoading(true); // Start loading
    try {
      await api.publishPost(post.id);
      message.success("Post published successfully.");
      setPosts(posts.filter((p) => p.id !== post.id));
    } catch (error) {
      if (error.response && error.response.status === 400) {
        message.error("Access token expired.");
      } else if (error.response && error.response.status === 500) {
        message.error("Error publishing post.");
      } else {
        message.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleDelete = async (post) => {
    setLoading(true); // Start loading during delete
    try {
      await api.deleteToBePublishedPost(post.id);
      message.success("Post deleted.");
      setPosts(posts.filter((p) => p.id !== post.id));
    } catch (error) {
      message.error("Error deleting post.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: "right", display: "flex", justifyContent: "center" }}>
        <Button type="primary" onClick={() => navigate("/credentials")} disabled={loading}>
          Update Credentials
        </Button>
      </div>
      <ImageGallery
        posts={posts}
        actions={[
          {
            label: "Publish",
            type: "primary",
            onClick: handlePublish,
            loading, // Add loading state to the Publish button
          },
          {
            label: "Delete",
            type: "danger",
            onClick: handleDelete,
            loading, // Add loading state to the Delete button
          },
        ]}
      />
    </div>
  );
};

export default ToBePublished;
