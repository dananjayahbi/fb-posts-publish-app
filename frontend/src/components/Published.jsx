import React, { useEffect, useState } from "react";
import { message, Modal, Empty } from "antd";
import ImageGallery from "./ImageGallery";
import api from "../services/api";

const Published = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchPublishedPosts = async () => {
      try {
        const data = await api.getPublishedPosts();
        setPosts(data);
      } catch (error) {
        message.error("Error fetching published posts.");
      }
    };

    fetchPublishedPosts();
  }, []);

  const handleDeleteClick = (post) => {
    setSelectedPost(post);
    setIsModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPost) return;

    try {
      await api.deletePublishedPost(selectedPost.id);
      message.success("Post deleted successfully.");
      setPosts(posts.filter((p) => p.id !== selectedPost.id));
    } catch (error) {
      message.error("Error deleting post.");
    } finally {
      setIsModalVisible(false);
      setSelectedPost(null);
    }
  };

  return (
    <div>
      {posts.length > 0 ? (
        <ImageGallery
          posts={posts.map((post) => ({
            ...post,
            additionalInfo: (
              <>
                <strong>Caption:</strong> {post.caption || "N/A"} |{" "}
                <strong>Post ID:</strong> {post.facebookPostId || "N/A"}
              </>
            ),
          }))}
          actions={[
            {
              label: "Delete",
              type: "danger",
              onClick: handleDeleteClick,
            },
          ]}
        />
      ) : (
        <Empty
          style={{ marginRight: "110px" }}
          description="No published posts available"
        />
      )}
      <Modal
        visible={isModalVisible}
        title="Confirm Deletion"
        onCancel={() => setIsModalVisible(false)}
        onOk={handleDeleteConfirm}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this post?</p>
      </Modal>
    </div>
  );
};

export default Published;
