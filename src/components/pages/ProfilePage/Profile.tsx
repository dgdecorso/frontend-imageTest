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
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [currentUserData, setCurrentUserData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const headers: any = {
      "Content-Type": "application/json",
    };

    // Add token if available
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // If viewing another user's profile (userId provided)
    if (userId) {
      // Use the posts endpoint to fetch user data from their posts
      const postsEndpoint = `http://localhost:8080/posts/user/${userId}`;

      fetch(postsEndpoint, { headers })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          return [];
        })
        .then((posts) => {
          if (Array.isArray(posts) && posts.length > 0) {
            // Extract user info from the first post
            const firstPost = posts[0];
            const userFromPost = {
              id: firstPost.authorId,
              firstName: firstPost.authorName?.split(' ')[0] || '',
              lastName: firstPost.authorName?.split(' ')[1] || '',
              email: '' // We don't have email in posts
            };
            setUser(userFromPost);
            setUserPosts(posts);
            setIsOwnProfile(false);
          } else {
            // No posts found for this user
            setUser({ firstName: "User", lastName: "", email: "" });
            setUserPosts([]);
            setIsOwnProfile(false);
          }
        })
        .catch(() => {
          setUser({ firstName: "User", lastName: "not found", email: "" });
          setUserPosts([]);
        });
    } else {
      // Viewing own profile
      fetch("http://localhost:8080/user/profile", { headers })
        .then((res) => {
          if (!res.ok) {
            if (res.status === 401) {
              throw new Error("Login required for own profile");
            }
            throw new Error("Profile not available");
          }
          return res.json();
        })
        .then((data) => {
          setUser(data);
          setCurrentUserData(data);
          setIsOwnProfile(true);

          // Fetch own posts
          fetch(`http://localhost:8080/posts/my-posts`, { headers })
            .then((res) => {
              if (res.ok) {
                return res.json();
              }
              return [];
            })
            .then((posts) => {
              if (Array.isArray(posts)) {
                setUserPosts(posts);
              }
            })
            .catch(() => setUserPosts([]));
        })
        .catch((error) => {
          // Redirect to login if accessing own profile without token
          if (!token) {
            navigate("/login");
          } else {
            // For other profiles, show error or limited view
            setUser({ firstName: "User", lastName: "not found", email: "" });
          }
        });
    }
  }, [navigate, userId]);

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
            {(user.firstName?.charAt(0) || "").toUpperCase() +
              (user.lastName?.charAt(0) || "").toUpperCase() ||
              user.email?.charAt(0).toUpperCase()}
          </Avatar>

          <Typography variant="h5" sx={{ mb: 1 }}>
            {user.firstName || user.lastName
              ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
              : "No name set"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: "#ccc" }}>
            {user.email}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
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
          </Box>
        </CardContent>
      </Card>

      {/* User Posts Section */}
      {userPosts.length > 0 && (
        <Box sx={{ mt: 4, width: "80%", maxWidth: 800 }}>
          <Typography variant="h5" sx={{ mb: 2, color: "#fff" }}>
            Posts by {user.firstName || user.lastName
              ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
              : "User"}
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
                      sx={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="subtitle1" noWrap></Typography>
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
                      {post.description || post.text || "No description"}
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
