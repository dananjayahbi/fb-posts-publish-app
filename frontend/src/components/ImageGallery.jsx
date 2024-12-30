import React, { useState } from "react";
import { Card, Button, Image } from "antd";

const ImageGallery = ({ posts, actions }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handlePreview = (src) => {
    setPreviewImage(src);
    setPreviewVisible(true);
  };

  return (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      {posts.map((post) => (
        <Card
          key={post.id}
          hoverable
          cover={
            <img
              alt="post"
              src={post.path}
              onClick={() => handlePreview(post.path)}
              style={{
                cursor: "pointer",
                width: "100%",
              }}
            />
          }
          style={{
            width: 300,
            marginBottom: 16,
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
        >
          <p style={{ textAlign: "center" }}>
            {post.additionalInfo || "No additional info available"}
          </p>
          <div style={{ textAlign: "center" }}>
            {actions &&
              actions.map((action, index) => (
                <Button
                  key={index}
                  type={action.type === "primary" ? "primary" : undefined}
                  danger={action.type === "danger"}
                  onClick={() => action.onClick(post)}
                  loading={action.loading} // Add loading prop
                  style={{
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                >
                  {action.label}
                </Button>
              ))}
          </div>
        </Card>
      ))}
      <Image
        preview={{ visible: previewVisible, src: previewImage }}
        onPreviewClose={() => setPreviewVisible(false)}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default ImageGallery;
