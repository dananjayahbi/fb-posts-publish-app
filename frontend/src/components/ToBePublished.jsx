import React, { useEffect, useState } from "react";
import { message, Button, Empty, Modal, Input } from "antd";
import { EditOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import ImageGallery from "./ImageGallery";
import api from "../services/api";

const ToBePublished = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [newCaption, setNewCaption] = useState("");
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
      message.error("Error publishing post.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCaption = async () => {
    if (!editPost) return;
  
    try {
      await api.updateToBePublishedCaption(editPost.id, { caption: newCaption });
      message.success("Caption updated successfully.");
      setPosts(posts.map((p) => (p.id === editPost.id ? { ...p, caption: newCaption } : p)));
      setEditPost(null); // Close modal
    } catch (error) {
      message.error("Error updating caption.");
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

  const handleUpdateAccessToken = async () => {
    setLoading(true);
    try {
      const response = await api.updateAccessTokenForAllPosts();
      message.success(response);
    } catch (error) {
      message.error("Error updating access token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          marginRight: 110,
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <Button
          type="primary"
          onClick={() => navigate("/credentials")}
          disabled={loading}
        >
          Update Credentials
        </Button>
        <Button
          type="default"
          onClick={handleUpdateAccessToken}
          disabled={loading}
        >
          Update token for all posts
        </Button>
      </div>
      {posts.length > 0 ? (
        <ImageGallery
          posts={posts.map((post) => ({
            ...post,
            additionalInfo: (
              <>
                <strong>Caption:</strong> {post.caption || "N/A"}{" "}
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEditClick(post)}
                />
              </>
            ),
          }))}
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
        <Empty
          style={{ marginRight: "110px" }}
          description="No posts to be published"
        />
      )}
      {/* Edit Caption Modal */}
      <Modal
        title="Edit Caption"
        visible={!!editPost}
        onCancel={() => setEditPost(null)}
        onOk={handleUpdateCaption}
        okText="Update"
      >
        <Input
          value={newCaption}
          onChange={(e) => setNewCaption(e.target.value)}
          placeholder="Enter new caption"
        />
      </Modal>
    </div>
  );
};

export default ToBePublished;
