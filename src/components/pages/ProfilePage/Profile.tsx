import { Box } from "@mui/system";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  ImageList,
  ImageListItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "", bio: "" });
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [currentUserData, setCurrentUserData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Determine which endpoint to use
    const endpoint = userId 
      ? `http://localhost:8080/users/${userId}`
      : "http://localhost:8080/user/profile";

    const headers: any = {
      "Content-Type": "application/json",
    };
    
    // Add token if available
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    fetch(endpoint, { headers })
      .then((res) => {
        if (!res.ok) {
          // If unauthorized and trying to access own profile, redirect to login
          if (!userId && res.status === 401) {
            throw new Error("Login required for own profile");
          }
          // For other user profiles, show limited info or error
          throw new Error("Profile not available");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setCurrentUserData(data);
        // Check if this is the current user's profile
        setIsOwnProfile(!userId && token ? true : false);
        setEditData({
          name: data.name || "",
          email: data.email || "",
          bio: data.bio || "",
        });
        
        // Fetch all posts and filter by user
        fetch(`http://localhost:8080/posts`, { headers })
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
            return [];
          })
          .then((posts) => {
            if (Array.isArray(posts)) {
              // Filter posts by current user
              const filteredPosts = posts.filter(post => {
                if (userId) {
                  return post.authorId === parseInt(userId) || 
                         post.userId === parseInt(userId);
                } else {
                  // For own profile, match against the logged-in user
                  return post.authorName === data.name || 
                         post.authorEmail === data.email ||
                         post.authorId === data.id;
                }
              });
              setUserPosts(filteredPosts);
            }
          })
          .catch(() => setUserPosts([]));
      })
      .catch((error) => {
        // Only redirect to login if accessing own profile without token
        if (!userId && !token) {
          navigate("/login");
        } else {
          // For other profiles, show error or limited view
          setUser({ name: "User not found", email: "", bio: "" });
        }
      });
  }, [navigate, userId]);

  const handleSave = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/user/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Update failed");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setEditing(false);
      })
      .catch((error) => {
        console.error("Update error:", error);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        sx={{ background: "#4A4343", color: "#fff" }}
      >
        Loading...
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      flexDirection="column"
      minHeight="100vh"
      sx={{
        background: "#4A4343",
        color: "#fff",
        textAlign: "center",
        py: 4,
        overflowY: "auto",
      }}
    >
      <Card
        sx={{
          width: 400,
          padding: 3,
          background: "#5A5353",
          color: "#fff",
        }}
      >
        <CardContent>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              margin: "0 auto 20px",
              backgroundColor: "#4A4343",
              fontSize: "2.5rem",
            }}
          >
            {user.name?.charAt(0).toUpperCase() ||
              user.email?.charAt(0).toUpperCase()}
          </Avatar>

          {editing ? (
            <>
              <TextField
                fullWidth
                label="Name"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                sx={{
                  mb: 2,
                  "& .MuiInputBase-input": { color: "#fff" },
                  "& .MuiInputLabel-root": { color: "#ccc" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ccc" },
                    "&:hover fieldset": { borderColor: "#fff" },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Email"
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
                sx={{
                  mb: 2,
                  "& .MuiInputBase-input": { color: "#fff" },
                  "& .MuiInputLabel-root": { color: "#ccc" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ccc" },
                    "&:hover fieldset": { borderColor: "#fff" },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={3}
                value={editData.bio}
                onChange={(e) =>
                  setEditData({ ...editData, bio: e.target.value })
                }
                sx={{
                  mb: 2,
                  "& .MuiInputBase-input": { color: "#fff" },
                  "& .MuiInputLabel-root": { color: "#ccc" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ccc" },
                    "&:hover fieldset": { borderColor: "#fff" },
                  },
                }}
              />
            </>
          ) : (
            <>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {user.name || "No name set"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: "#ccc" }}>
                {user.email}
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                {user.bio || "No bio available"}
              </Typography>
            </>
          )}

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            {editing ? (
              <>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{
                    backgroundColor: "#2c2c2c",
                    "&:hover": { backgroundColor: "#333" },
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setEditing(false)}
                  sx={{
                    borderColor: "#ccc",
                    color: "#ccc",
                    "&:hover": { borderColor: "#fff", color: "#fff" },
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                {isOwnProfile && (
                  <Button
                    variant="contained"
                    onClick={() => setEditing(true)}
                    sx={{
                      backgroundColor: "#2c2c2c",
                      "&:hover": { backgroundColor: "#333" },
                    }}
                  >
                    Edit Profile
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={() => navigate("/")}
                  sx={{
                    backgroundColor: "#2c2c2c",
                    "&:hover": { backgroundColor: "#333" },
                  }}
                >
                  Home
                </Button>
                {isOwnProfile && (
                  <Button
                    variant="outlined"
                    onClick={handleLogout}
                    sx={{
                      borderColor: "#f44336",
                      color: "#f44336",
                      "&:hover": { borderColor: "#d32f2f", color: "#d32f2f" },
                    }}
                  >
                    Logout
                  </Button>
                )}
              </>
            )}
          </Box>
        </CardContent>
      </Card>
      
      {/* User Posts Section */}
      {userPosts.length > 0 && (
        <Box sx={{ mt: 4, width: "80%", maxWidth: 800 }}>
          <Typography variant="h5" sx={{ mb: 2, color: "#fff" }}>
            Posts by {user.name || "User"}
          </Typography>
          <Grid container spacing={2}>
            {userPosts.map((post, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    background: "#5A5353",
                    color: "#fff",
                    height: "100%",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                  onClick={() => navigate("/")}
                >
                  {post.imageUrl && (
                    <Box
                      component="img"
                      src={post.imageUrl}
                      alt={post.title || post.text}
                      sx={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="subtitle1" noWrap>
                      {post.title || "Untitled"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {post.text || "No description"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
