const express = require("express");
const FormData = require("form-data");
const http = require('http');
const fs = require("fs-extra");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const WebSocket = require('ws');
require("dotenv").config();

const app = express();
app.use(cors());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 3000;

// Folders
const POSTS_DIR = path.join(__dirname, "posts-management");
const DRAFTS_DIR = path.join(POSTS_DIR, "drafts");
const TO_BE_PUBLISHED_DIR = path.join(POSTS_DIR, "to-be-published");
const PUBLISHED_DIR = path.join(POSTS_DIR, "published");
const DATA_FILE = path.join(__dirname, "data/posts.json");
const POSTS_FOLDER = path.join(__dirname, "../posts"); // Path to "posts" folder
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const FACEBOOK_PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

// Serve the posts-management folder as static
app.use("/images", express.static(POSTS_DIR));

// Middleware
app.use((req, res, next) => {
  if (req.headers.upgrade === 'websocket') {
      next();
  } else {
      bodyParser.json()(req, res, next); // Apply middleware only for non-WebSocket routes
  }
});

wss.on('connection', (ws, req) => {
  console.log('WebSocket connection established');
  console.log('Headers:', req.headers); // Debug request headers
  ws.on('message', (message) => {
      console.log('Received message:', message);
      ws.send(`Echo: ${message}`);
  });
});

// Ensure folders exist
fs.ensureDirSync(DRAFTS_DIR);
fs.ensureDirSync(TO_BE_PUBLISHED_DIR);
fs.ensureDirSync(PUBLISHED_DIR);
fs.ensureFileSync(DATA_FILE);

// Initialize JSON data file
if (!fs.existsSync(DATA_FILE)) {
  fs.writeJsonSync(DATA_FILE, { drafts: [], toBePublished: [], published: [] });
}

// Utility Functions
const getPostsData = () => {
  try {
    return fs.readJsonSync(DATA_FILE);
  } catch (err) {
    const defaultData = { drafts: [], toBePublished: [], published: [] };
    savePostsData(defaultData);
    return defaultData;
  }
};
const savePostsData = (data) => fs.writeJsonSync(DATA_FILE, data);

// Endpoint to fetch current credentials
app.get("/credentials", (req, res) => {
  const credentials = {
    pageId: process.env.FACEBOOK_PAGE_ID || "",
    accessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN || "",
  };
  res.json(credentials);
});

// Endpoint to update credentials
app.post("/update-credentials", (req, res) => {
  const { pageId, accessToken } = req.body;

  if (!pageId || !accessToken) {
    return res.status(400).send("Both Page ID and Access Token are required.");
  }

  // Update .env file
  const envFilePath = path.join(__dirname, ".env");
  const envContent = `FACEBOOK_PAGE_ID=${pageId}\nFACEBOOK_PAGE_ACCESS_TOKEN=${accessToken}`;
  try {
    fs.writeFileSync(envFilePath, envContent);
    // Reload environment variables
    process.env.FACEBOOK_PAGE_ID = pageId;
    process.env.FACEBOOK_PAGE_ACCESS_TOKEN = accessToken;
    res.send("Credentials updated successfully.");
  } catch (error) {
    console.error("Error updating credentials:", error.message);
    res.status(500).send("Failed to update credentials.");
  }
});

// Sync posts from "../posts" to drafts
app.post("/sync-drafts", (req, res) => {
  fs.readdir(POSTS_FOLDER, (err, files) => {
    if (err) return res.status(500).send("Error reading posts folder.");

    if (files.length === 0) {
      return res.status(200).send({ message: "All synced" });
    }

    files.forEach((file) => {
      const filePath = path.join(POSTS_FOLDER, file);
      const draftPath = path.join(DRAFTS_DIR, file);
      fs.moveSync(filePath, draftPath, { overwrite: true });
    });

    res.status(200).send({ message: "Drafts synced successfully." });
  });
});

// Get drafts
app.get("/drafts", (req, res) => {
  const drafts = fs.readdirSync(DRAFTS_DIR).map((file) => ({
    id: uuidv4(),
    fileName: file,
    path: `http://localhost:${PORT}/images/drafts/${file}`,
  }));
  res.json(drafts);
});

// Accept a post (move to to-be-published)
app.post("/accept-post", (req, res) => {
  const { fileName, caption } = req.body;
  const draftPath = path.join(DRAFTS_DIR, fileName);
  const publishPath = path.join(TO_BE_PUBLISHED_DIR, fileName);

  if (!fs.existsSync(draftPath))
    return res.status(404).send("Draft not found.");

  const postId = uuidv4();
  const imageUrl = `http://localhost:${PORT}/images/drafts/${fileName}`;
  const publishUrl = `https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}/photos?url=${imageUrl}&caption=${caption}&access_token=${FACEBOOK_PAGE_ACCESS_TOKEN}`;

  fs.moveSync(draftPath, publishPath, { overwrite: true });

  const data = getPostsData();
  data.toBePublished.push({ id: postId, fileName, caption, publishUrl });
  savePostsData(data);

  res.json({ id: postId, message: "Post accepted." });
});

// Reject a post (delete from drafts)
app.post("/reject-post", (req, res) => {
  const { fileName } = req.body;
  const draftPath = path.join(DRAFTS_DIR, fileName);

  if (!fs.existsSync(draftPath))
    return res.status(404).send("Draft not found.");

  fs.removeSync(draftPath);
  res.send("Post rejected and deleted.");
});

// Get to-be-published posts
app.get("/to-be-published", (req, res) => {
  const data = getPostsData();
  const toBePublished = data.toBePublished.map((post) => ({
    ...post,
    path: `http://localhost:${PORT}/images/to-be-published/${post.fileName}`,
  }));
  res.json(toBePublished);
});

// Publish a post
app.post("/publish-post", async (req, res) => {
  const { id } = req.body;
  const data = getPostsData();
  const postIndex = data.toBePublished.findIndex((post) => post.id === id);

  if (postIndex === -1) {
    return res.status(404).send("Post not found.");
  }

  const post = data.toBePublished[postIndex];
  const filePath = path.join(TO_BE_PUBLISHED_DIR, post.fileName);

  try {
    // Create a FormData object and append required fields
    const formData = new FormData();
    formData.append("source", fs.createReadStream(filePath)); // Image file
    formData.append("caption", post.caption); // Post caption
    formData.append("access_token", process.env.FACEBOOK_PAGE_ACCESS_TOKEN); // Facebook access token

    // Post the FormData to Facebook Graph API
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${process.env.FACEBOOK_PAGE_ID}/photos`,
      formData,
      { headers: formData.getHeaders() }
    );

    // Move the file to the published folder after successful posting
    const publishedPath = path.join(PUBLISHED_DIR, post.fileName);

    fs.moveSync(filePath, publishedPath, { overwrite: true });

    // Update the JSON data
    data.toBePublished.splice(postIndex, 1);
    data.published.push({
      ...post,
      facebookPostId: response.data.id,
      publishedAt: new Date().toISOString(),
    });

    savePostsData(data);
    res.send("Post published successfully.");
  } catch (error) {
    const fbError = error.response?.data?.error;

    // Handle Facebook API-specific errors
    if (fbError && fbError.code === 190 && fbError.error_subcode === 463) {
      console.error("Access Token Error:", fbError.message);
      res.status(400).send("Page access token expired.");
    } else if (fbError) {
      console.error("Facebook API Error:", fbError.message);
      res.status(500).send(fbError.error_user_msg || "Error publishing post.");
    } else {
      console.error("Unknown Error:", error.message);
      res.status(500).send("An unexpected error occurred.");
    }
  }
});

// Get published posts
app.get("/published", (req, res) => {
  const data = getPostsData();
  const published = data.published.map((post) => ({
    ...post,
    path: `http://localhost:${PORT}/images/published/${post.fileName}`, // Ensure the path matches the published folder
  }));
  res.json(published);
});

// Delete a to-be-published post
app.delete("/to-be-published/:id", (req, res) => {
  const { id } = req.params;
  const data = getPostsData();
  const postIndex = data.toBePublished.findIndex((post) => post.id === id);

  if (postIndex === -1) return res.status(404).send("Post not found.");

  const post = data.toBePublished[postIndex];
  const toBePublishedPath = path.join(TO_BE_PUBLISHED_DIR, post.fileName);

  fs.removeSync(toBePublishedPath);

  data.toBePublished.splice(postIndex, 1);
  savePostsData(data);

  res.send("Post deleted successfully.");
});

// Delete a published post from the backend
app.delete("/published/:id", (req, res) => {
  const { id } = req.params;
  const data = getPostsData();
  const postIndex = data.published.findIndex((post) => post.id === id);

  if (postIndex === -1) return res.status(404).send("Post not found.");

  const post = data.published[postIndex];
  const publishedPath = path.join(PUBLISHED_DIR, post.fileName);

  try {
    // Delete the image file
    fs.removeSync(publishedPath);

    // Remove from JSON database
    data.published.splice(postIndex, 1);
    savePostsData(data);

    res.send("Post deleted successfully.");
  } catch (error) {
    console.error("Error deleting post:", error.message);
    res.status(500).send("Error deleting post.");
  }
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


/*
In here previosly i implemented like this : 

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

But in here i's not working with web sockets. So i changed it to server.listen. 
Now it's using an HTTP server (http.createServer(app)) explicitly to attach the WebSocket server. 
So, using app.listen creates a separate HTTP server that isn't linked to the WebSocket server (wss).
*/