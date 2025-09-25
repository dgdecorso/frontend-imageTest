import { Box } from "@mui/system";
import logo from "../../logo1.png";
import {
  Button,
  CardContent,
  Card,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import HomePageService from "./HomePageService";

export default function HomePage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newPost, setNewPost] = useState({
    text: "",
    imageUrl: "",
  });
  const [editPost, setEditPost] = useState({
    text: "",
    imageUrl: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const headers: any = {
      "Content-Type": "application/json",
    };

    // Add token if available, but still try to fetch without it
    if (token) {
      headers.Authorization = `Bearer ${token}`;

      // Fetch current user info
      fetch("http://localhost:8080/user/profile", { headers })
        .then((res) => (res.ok ? res.json() : null))
        .then((userData) => setCurrentUser(userData))
        .catch(() => setCurrentUser(null));
    }

    fetch("http://localhost:8080/posts", { headers })
      .then((res) => {
        if (!res.ok) {
          // Don't throw error, just return empty array
          return [];
        }
        return res.json();
      })
      .then((data) => {
        console.log("API Response:", data);
        if (Array.isArray(data) && data.length > 0) {
          console.log("First post structure:", data[0]);
          setPosts(data);
        } else {
          setPosts([]);
        }
      })
      .catch(() => setPosts([]));
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev < posts.length - 1 ? prev + 1 : prev));
  };

  const handleCreatePost = async () => {
    const token = localStorage.getItem("token");

    const postData = {
      ...newPost,
      authorId: currentUser?.id,
      authorName: currentUser?.name || currentUser?.email,
    };

    try {
      const response = await fetch("http://localhost:8080/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const createdPost = await response.json();
        setPosts([...posts, createdPost]);
        setCurrent(posts.length);
        setOpenDialog(false);
        setNewPost({ text: "", imageUrl: "" });
      } else {
        alert("Fehler beim Erstellen des Posts");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Fehler beim Erstellen des Posts");
    }
  };

  const handleEditPost = async () => {
    const token = localStorage.getItem("token");
    if (!selectedPost) return;

    try {
      const response = await fetch(
        `http://localhost:8080/posts/${selectedPost.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editPost),
        }
      );

      if (response.ok) {
        const updatedPost = await response.json();
        const updatedPosts = posts.map((p) =>
          p.id === selectedPost.id ? updatedPost : p
        );
        setPosts(updatedPosts);
        setEditDialog(false);
        setSelectedPost(null);
      } else {
        alert("Fehler beim Bearbeiten des Posts");
      }
    } catch (error) {
      console.error("Error editing post:", error);
      alert("Fehler beim Bearbeiten des Posts");
    }
  };

  const handleDeletePost = async () => {
    const token = localStorage.getItem("token");
    if (!selectedPost) return;

    try {
      const response = await fetch(
        `http://localhost:8080/posts/${selectedPost.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedPosts = posts.filter((p) => p.id !== selectedPost.id);
        setPosts(updatedPosts);
        if (current >= updatedPosts.length && current > 0) {
          setCurrent(current - 1);
        }
        setDeleteDialog(false);
        setSelectedPost(null);
      } else {
        alert("Fehler beim Löschen des Posts");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Fehler beim Löschen des Posts");
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(post);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openEditDialog = () => {
    setEditPost({
      text: selectedPost?.text || "",
      imageUrl: selectedPost?.imageUrl || "",
    });
    setEditDialog(true);
    handleMenuClose();
  };

  const openDeleteDialog = () => {
    setDeleteDialog(true);
    handleMenuClose();
  };

  const post = posts[current];
  const isOwnPost =
    currentUser &&
    post &&
    (post.authorId === currentUser.id ||
      post.authorName === currentUser.name ||
      post.authorEmail === currentUser.email);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      height="100vh"
      sx={{
        background: "#4A4343",
        color: "#fff",
        textAlign: "center",
        position: "relative",
      }}
    >
      <h1
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "2.5rem",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        Welcome to the Image Gallery
      </h1>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "250px",
          mb: 4,
        }}
      >
        {posts.length === 0 ? (
          <Box sx={{ color: "#fff" }}>No images found.</Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              onClick={() =>
                navigate(
                  `/user/profile/${post.authorId || post.userId || post.id}`
                )
              }
            >
              <Typography variant="h6" sx={{ mb: 2, color: "#fff" }}>
                {post.authorName || "Unknown Author"}
              </Typography>
            </Button>
            <Card
              sx={{
                width: 250,
                background: "#4A4343",
                color: "#fff",
                borderRadius: "0px",
                alignItems: "center",
                boxShadow: 3,
                position: "relative",
              }}
            >
              {isOwnPost && isLoggedIn && (
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "#fff",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 1,
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                    },
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              )}
              <Box>
                <img
                  src={post.imageUrl || post.urls?.small || post.url}
                  alt={post.title || post.text || `img-${current}`}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "0px",
                  }}
                />
              </Box>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {post.title || ""}
                </Typography>
                <Typography variant="body2">
                  {post.text || post.description || ""}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          disabled={current === 0}
          onClick={handlePrev}
          sx={{
            backgroundColor: "#2c2c2c",
            color: "#fff",
            borderRadius: "0px",
            "&:hover": { backgroundColor: "#333" },
          }}
        >
          Zurück
        </Button>
        <Button
          variant="contained"
          disabled={current === posts.length - 1 || posts.length === 0}
          onClick={handleNext}
          sx={{
            backgroundColor: "#2c2c2c",
            color: "#fff",
            borderRadius: "0px",
            "&:hover": { backgroundColor: "#333" },
          }}
        >
          Vor
        </Button>
      </Box>
      <Box position="absolute" top={24} right={24}>
        {isLoggedIn ? (
          <>
            <Button
              variant="contained"
              sx={{
                color: "#fff",
                backgroundColor: "#4A4343",
                "&:hover": { backgroundColor: "#2c2c2c" },
                borderRadius: "0px",
                mr: 1,
              }}
              onClick={() => setOpenDialog(true)}
            >
              Neuer Post
            </Button>
            <Button
              variant="contained"
              sx={{
                color: "#fff",
                backgroundColor: "#4A4343",
                "&:hover": { backgroundColor: "#4A4343" },
                borderRadius: "0px",
              }}
              onClick={() => {
                localStorage.removeItem("token");
                setIsLoggedIn(false);
                navigate("/login");
              }}
            >
              Logout
            </Button>
            <Button
              variant="contained"
              sx={{
                color: "#fff",
                backgroundColor: "#4A4343",
                "&:hover": { backgroundColor: "#4A4343" },
                borderRadius: "0px",
              }}
              onClick={() => {
                navigate("/profile");
              }}
            >
              Profile
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              sx={{
                color: "#fff",
                backgroundColor: "#4A4343",
                "&:hover": { backgroundColor: "#4A4343" },
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0)",
                borderRadius: "0px",
                mr: 1,
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              variant="contained"
              sx={{
                color: "#fff",
                backgroundColor: "#4A4343",
                "&:hover": { backgroundColor: "#4A4343" },
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0)",
                borderRadius: "0px",
              }}
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </>
        )}
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Neuen Post erstellen</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Text"
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            value={newPost.text}
            onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
          />
          <TextField
            fullWidth
            label="Bild URL"
            variant="outlined"
            margin="normal"
            value={newPost.imageUrl}
            onChange={(e) =>
              setNewPost({ ...newPost, imageUrl: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Abbrechen</Button>
          <Button
            onClick={handleCreatePost}
            variant="contained"
            disabled={!newPost.text}
            sx={{
              backgroundColor: "#2c2c2c",
              "&:hover": { backgroundColor: "#2c2c2c" },
            }}
          >
            Post erstellen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menu for Post Actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={openEditDialog}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Bearbeiten
        </MenuItem>
        <MenuItem onClick={openDeleteDialog}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Löschen
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog
        open={editDialog}
        onClose={() => setEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Post bearbeiten</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Text"
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            value={editPost.text}
            onChange={(e) => setEditPost({ ...editPost, text: e.target.value })}
          />
          <TextField
            fullWidth
            label="Bild URL"
            variant="outlined"
            margin="normal"
            value={editPost.imageUrl}
            onChange={(e) =>
              setEditPost({ ...editPost, imageUrl: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Abbrechen</Button>
          <Button
            onClick={handleEditPost}
            variant="contained"
            disabled={!editPost.text}
            sx={{
              backgroundColor: "#2c2c2c",
              "&:hover": { backgroundColor: "#2c2c2c" },
            }}
          >
            Speichern
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Post löschen?</DialogTitle>
        <DialogContent>
          <Typography>
            Möchten Sie diesen Post wirklich löschen? Diese Aktion kann nicht
            rückgängig gemacht werden.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Abbrechen</Button>
          <Button onClick={handleDeletePost} variant="contained" color="error">
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
