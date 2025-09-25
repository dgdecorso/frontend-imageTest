# uk223 Skeleton

homepage: http://localhost:3000
login: http://localhost:3000/login
user component: http://localhost:3000/users

## Components

# Projektdokumentation

## Starten der Applikation

### Backend (Spring Boot)
```bash
cd uek223_backendG5
./mvnw spring-boot:run
# oder
mvn spring-boot:run
```

### Frontend (React)
```bash
cd uek223_frontendG5
npm install
npm start
```

---

## Login-Daten und Rollen

Basierend auf `data.sql`:

| Rolle   | Email               | Passwort | Beschreibung |
|---------|---------------------|----------|--------------|
| ADMIN   | admin@example.com   | 1234     | Kann alle Posts sehen, erstellen, bearbeiten und löschen |
| USER    | user@example.com    | 1234     | Kann eigene Posts erstellen, bearbeiten und löschen, sowie andere Posts sehen |
| NEUE USER | via `/user/register` | individuell | Weitere Test-User können registriert werden werden automatisch USER|

---

## Tests ausführen

- **End-to-End Tests**  
  - **Backend**: Mit **Postman** getestet, indem die einzelnen Use Cases geprüft wurden. Dabei wurden jeweils die Rollen (USER/ADMIN) gewechselt und die JWT Tokens angepasst.  
  - **Frontend**: Mit **Cypress** getestet: **User Case 1** (Erstellen eines Image-Posts).

---

## Postman Testfälle (Backend)

| User Case | Beschreibung | Request | Authentifizierung | Beispiel Body |
|-----------|--------------|---------|-------------------|---------------|
| **UC1** | User erstellt einen Image Post | `POST /posts` | `Bearer {token}` | ```json { "imageUrl": "https://example.com/image.jpg", "description": "My vacation photo" }``` |
| **UC2** | User/Admin bearbeitet oder löscht einen Post | `PUT /posts/{postId}`<br>`DELETE /posts/{postId}` | `Bearer {token}` | –<br>*(User: nur eigene Posts, Admin: alle Posts)* |
| **UC3** | Eingeloggte User sehen alle Posts | `GET /posts` | `Bearer {token}` | – |
| **UC4** | Liste aller Posts eines bestimmten Users | `GET /posts/user/{userId}` | `Bearer {token}` | – |
| **UC5** | User liked/unliked einen Post | `POST /posts/{postId}/like` | `Bearer {token}` | –<br>*(1. Click = Like, 2. Click = Unlike)* |

---


