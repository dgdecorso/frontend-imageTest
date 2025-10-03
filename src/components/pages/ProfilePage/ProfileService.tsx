import axios from "axios";

// Create a base Axios instance
export const baseInstance = axios.create({
  baseURL: "https://diego.dev.noseryoung.ch/api", // Replace with your actual API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

const ProfileService = (api = baseInstance) => ({
  // Example: Fetch all movies
  getAllUsers: () => api.get("/users"),

  // Example: Fetch a movie by ID
  getUsersById: (id: string | number) => api.get(`/users/${id}`),

  // Example: Create a new movie
  createUser: (postData: any) => api.post("/users", postData),

  // Example: Update a movie
  updateUser: (id: string | number, postData: any) =>
    api.put(`/users/${id}`, ProfileService),

  // Example: Delete a movie
  deleteUser: (id: string | number) => api.delete(`/users/${id}`),
});

export default ProfileService;
