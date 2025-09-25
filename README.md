# uk223 Skeleton

Homepage: http://localhost:3000
Profil: http://localhost:3000/profile
User Profile: http://localhost:3000/user/profile/{userId}

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

 **Extra info:** Beim erstellen eines neuem users, via `/user/register` user wird direkt die Rolle User zugeteilt. 

---

## Tests ausführen

- **Funktionalitäts Tests**   
  - **Backend**: Mit **Postman** getestet, indem die einzelnen Use Cases geprüft wurden. Dabei wurden jeweils die Rollen (USER/ADMIN) gewechselt und die JWT Tokens angepasst.
- **End-to-End Tests**  
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

[Postman](https://dark-spaceship-903007.postman.co/workspace/Team-Workspace~f176345a-6857-46e0-848c-e34dc1272885/collection/43313840-b6d9db1c-34e8-40c2-9cf1-b3bc217c6f84?action=share&creator=43313840&active-environment=43313840-9c5b71b0-7d51-4b56-96e9-190eb7329579) 

---

# Cypress Testfälle und installieren(Frontend)

## In das Frontend-Verzeichnis wechseln
```bash
cd uek223_frontendG5
```

## Abhängigkeiten installieren (falls noch nicht gemacht)
```bash
npm install
```

## Cypress installieren (falls nicht schon in package.json enthalten)
```bash
npm install --save-dev cypress
```

## Cypress öffnen (interaktive Test-UI)
```bash
npx cypress open
```
## oder alle Tests im Terminal ausführen
```bash
npx cypress run
```

| User Case | Beschreibung | Schritte | Erwartetes Ergebnis |
|-----------|--------------|----------|----------------------|
| **UC1** | Der User kann einen Post erstellen, das aber nur wenn er ein User eingelogged ist. | 1. Login mit gültigem User <br> 2. Klicke auf **"Neuer Post"** <br> 3. Trage `Beschreibung` + `Bild URL` ein <br> 4. Klicke auf **"Post erstellen"** | Neuer Post erscheint in der Galerie mit Bild und Beschreibung |



