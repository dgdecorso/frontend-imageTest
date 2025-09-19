import axios from "axios";

// Create a base Axios instance
export const baseInstance = axios.create({
  baseURL: "http://localhost:8080", // Replace with your actual API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

const MovieService = (api = baseInstance) => ({
  // Example: Fetch all movies
  getAllMovies: () => api.get("/posts"),

  // Example: Fetch a movie by ID
  getMovieById: (id: string | number) => api.get(`/posts/${id}`),

  // Example: Create a new movie
  createMovie: (movieData: any) => api.post("/posts", movieData),

  // Example: Update a movie
  updateMovie: (id: string | number, movieData: any) =>
    api.put(`/posts/${id}`, movieData),

  // Example: Delete a movie
  deleteMovie: (id: string | number) => api.delete(`/posts/${id}`),
});

export default MovieService;
