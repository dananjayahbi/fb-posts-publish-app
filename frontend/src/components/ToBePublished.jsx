import React, { useEffect, useState } from "react";
import { message, Button, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import ImageGallery from "./ImageGallery";
import api from "../services/api";

const ToBePublished = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleDelete = async (post) => {
    setLoading(true);
    try {
      await api.deleteToBePublishedPost(post.id);
      message.success("Post deleted.");
      setPosts(posts.filter((p) => p.id !== post.id));
    } catch (error) {
      message.error("Error deleting post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          textAlign: "right",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          type="primary"
          onClick={() => navigate("/credentials")}
          disabled={loading}
          style={{ marginRight: "100px" }}
        >
          Update Credentials
        </Button>
      </div>
      {posts.length > 0 ? (
        <ImageGallery
          posts={posts}
          actions={[
            {
              label: "Publish",
              type: "primary",
              onClick: handlePublish,
              loading,
            },
            {
              label: "Delete",
              type: "danger",
              onClick: handleDelete,
              loading,
            },
          ]}
        />
      ) : (
        <Empty style={{marginRight: "110px"}} description="No posts to be published" />
      )}
    </div>
  );
};

export default ToBePublished;
