import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { User } from "../../../types/models/User.model";
import UserService from "../../../Services/UserService";
import { useNavigate } from "react-router-dom";

const UserTable = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const token = localStorage.getItem("token");
    if (token) {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      fetch("https://diego.dev.noseryoung.ch/api/user/profile", { headers })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to get profile");
          return res.json();
        })
        .then((userData) => {
          console.log("User data:", userData); // Debug log
          setCurrentUser(userData);
          const adminCheck = userData.roles?.some((role: any) => {
            console.log("Checking role:", role); // Debug log
            return role.name === "ADMIN";
          });
          console.log("Is admin:", adminCheck); // Debug log
          setIsAdmin(adminCheck);

          // Try to get all users using direct fetch like other components
          fetch("https://diego.dev.noseryoung.ch/api/user", { headers })
            .then((res) => {
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
              return res.json();
            })
            .then((data) => {
              console.log("Users data:", data); // Debug log
              setUsers(data);
            })
            .catch((error) => {
              console.error("Error getting users:", error);
              if (!adminCheck) {
                alert(
                  "Sie haben keine Admin-Berechtigung für die Benutzerverwaltung."
                );
                navigate("/");
              } else {
                alert("Fehler beim Laden der Benutzerdaten.");
              }
            });
        })
        .catch((error) => {
          console.error("Error getting profile:", error);
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleAdd = () => {
    navigate("../useredit/");
  };

  const handleEdit = (id: string) => {
    navigate("../useredit/" + id);
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?"
      )
    ) {
      try {
        await UserService.deleteUser(id);
        // Refresh the user list after deletion
        const data = await UserService.getAllUsers();
        setUsers(data.data);
        alert("Benutzer erfolgreich gelöscht!");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert(
          "Fehler beim Löschen des Benutzers. Überprüfen Sie Ihre Admin-Berechtigung."
        );
      }
    }
  };

  if (!isAdmin) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#4A4343",
          color: "#fff",
        }}
      >
        <Typography variant="h4">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ background: "#4A4343", minHeight: "100vh", p: 3 }}>
      <Typography
        variant="h4"
        sx={{ color: "#fff", mb: 3, textAlign: "center" }}
      >
        Benutzerverwaltung
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Button
          size="large"
          color="success"
          variant="contained"
          onClick={handleAdd}
          sx={{ mr: 2 }}
        >
          Neuen Benutzer hinzufügen
        </Button>
        <Button
          size="large"
          variant="outlined"
          onClick={() => navigate("/")}
          sx={{ color: "#fff", borderColor: "#fff" }}
        >
          Zurück zur Startseite
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 2,
        }}
      >
        {users.map((user) => (
          <Card key={user.id} sx={{ background: "#5A5353", color: "#fff" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: "#ccc" }}>
                {user.email}
              </Typography>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={() => handleEdit(user.id)}
                >
                  Bearbeiten
                </Button>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  onClick={() => handleDelete(user.id)}
                >
                  Löschen
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default UserTable;
