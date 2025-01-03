import axios from "axios";

const apiBase = "http://localhost:3000";

const api = {
  getDrafts: async () => {
    const response = await axios.get(`${apiBase}/drafts`);
    return response.data;
  },
  syncDrafts: async () => {
    const response = await axios.post(`${apiBase}/sync-drafts`);
    return response.data;
  },
  acceptPost: async (fileName, caption) => {
    const response = await axios.post(`${apiBase}/accept-post`, {
      fileName,
      caption,
    });
    return response.data;
  },
  rejectPost: async (fileName) => {
    const response = await axios.post(`${apiBase}/reject-post`, {
      fileName,
    });
    return response.data;
  },
  getToBePublishedPosts: async () => {
    const response = await axios.get(`${apiBase}/to-be-published`);
    return response.data;
  },
  publishPost: async (id) => {
    const response = await axios.post(`${apiBase}/publish-post`, { id });
    return response.data;
  },
  deleteToBePublishedPost: async (id) => {
    const response = await axios.delete(`${apiBase}/to-be-published/${id}`);
    return response.data;
  },
  getPublishedPosts: async () => {
    const response = await axios.get(`${apiBase}/published`);
    return response.data;
  },
  getCredentials: async () => {
    const response = await axios.get(`${apiBase}/credentials`);
    return response.data;
  },
  updateCredentials: async (data) => {
    const response = await axios.post(`${apiBase}/update-credentials`, data);
    return response.data;
  },
  deletePublishedPost: async (id) => {
    const response = await axios.delete(`${apiBase}/published/${id}`);
    return response.data;
  },
  updateToBePublishedCaption: async (id, updatedData) => {
    const response = await axios.put(`${apiBase}/to-be-published/${id}`, updatedData);
    return response.data;
  },
  updateAccessTokenForAllPosts: async () => {
    const response = await axios.post(`${apiBase}/update-access-token`);
    return response.data;
  },  
};

export default api;
