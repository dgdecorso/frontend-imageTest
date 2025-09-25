import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
} from "@mui/material";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Passwort muss mindestens 6 Zeichen lang sein");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // If registration returns a token, save it
        if (data.token) {
          localStorage.setItem("token", data.token);
          navigate("/");
        } else {
          // Otherwise redirect to login
          navigate("/login");
        }
      } else {
        const errorData = await response.json().catch(() => null);
        setError(errorData?.message || "Registrierung fehlgeschlagen");
      }
    } catch (error) {
      setError("Verbindungsfehler. Bitte versuchen Sie es später erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{
        background: "#4A4343",
        color: "#fff",
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
          <Typography variant="h4" align="center" sx={{ mb: 3 }}>
            Registrieren
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
              sx={{
                "& .MuiInputBase-input": { color: "#fff" },
                "& .MuiInputLabel-root": { color: "#ccc" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ccc" },
                  "&:hover fieldset": { borderColor: "#fff" },
                  "&.Mui-focused fieldset": { borderColor: "#fff" },
                },
              }}
            />

            <TextField
              fullWidth
              label="E-Mail"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              sx={{
                "& .MuiInputBase-input": { color: "#fff" },
                "& .MuiInputLabel-root": { color: "#ccc" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ccc" },
                  "&:hover fieldset": { borderColor: "#fff" },
                  "&.Mui-focused fieldset": { borderColor: "#fff" },
                },
              }}
            />

            <TextField
              fullWidth
              label="Passwort"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              sx={{
                "& .MuiInputBase-input": { color: "#fff" },
                "& .MuiInputLabel-root": { color: "#ccc" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ccc" },
                  "&:hover fieldset": { borderColor: "#fff" },
                  "&.Mui-focused fieldset": { borderColor: "#fff" },
                },
              }}
            />

            <TextField
              fullWidth
              label="Passwort bestätigen"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              sx={{
                "& .MuiInputBase-input": { color: "#fff" },
                "& .MuiInputLabel-root": { color: "#ccc" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ccc" },
                  "&:hover fieldset": { borderColor: "#fff" },
                  "&.Mui-focused fieldset": { borderColor: "#fff" },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#2c2c2c",
                "&:hover": { backgroundColor: "#333" },
              }}
            >
              {loading ? "Wird registriert..." : "Registrieren"}
            </Button>
          </form>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2">
              Bereits ein Konto?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/login")}
                sx={{
                  color: "#fff",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Hier einloggen
              </Link>
            </Typography>
          </Box>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button
              onClick={() => navigate("/")}
              sx={{
                color: "#ccc",
                "&:hover": { color: "#fff" },
              }}
            >
              Zurück zur Startseite
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}