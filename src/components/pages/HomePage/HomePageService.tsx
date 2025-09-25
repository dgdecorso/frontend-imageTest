import axios from "axios";
import HomePage from "./HomePage";

// Create a base Axios instance
export const baseInstance = axios.create({
  baseURL: "http://localhost:8080", // Replace with your actual API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

const HomePageService = (api = baseInstance) => ({
  // Example: Fetch all movies
  getAllPosts: () => api.get("/posts"),

  // Example: Fetch a movie by ID
  getPostsById: (id: string | number) => api.get(`/posts/${id}`),

  // Example: Create a new movie
  createPosts: (postData: any) => api.post("/posts", postData),

  // Example: Update a movie
  updatePosts: (id: string | number, movieData: any) =>
    api.put(`/posts/${id}`, HomePageService),

  // Example: Delete a movie
  deletePosts: (id: string | number) => api.delete(`/posts/${id}`),
});

export default HomePageService;
