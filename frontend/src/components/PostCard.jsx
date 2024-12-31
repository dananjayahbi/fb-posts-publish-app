import React from "react";
import { Card, Button } from "antd";

const PostCard = ({ post, onAccept, onReject, additionalInfo }) => {
  return (
    <Card
      hoverable
      cover={<img alt="post" src={post.path} />}
      style={{ marginBottom: 16 }}
    >
      {additionalInfo && <p>{additionalInfo}</p>}
      <div style={{ textAlign: "center" }}>
        {onAccept && (
          <Button
            type="primary"
            onClick={onAccept}
            style={{ marginRight: 8 }}
          >
            Accept
          </Button>
        )}
        {onReject && (
          <Button danger onClick={onReject}>
            Reject
          </Button>
        )}
      </div>
    </Card>
  );
};

export default PostCard;
