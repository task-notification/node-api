# TaskY node-api

## Installation

node-server should listen on port ``3000``

### clone repository

```bash
git clone https://github.com/task-notification/node-api.git
```

### install node packages

```bash
npm install
```

### configure MongoDB

create file ``config/database.js``

```javascript
// config/database.js
module.exports = {
    'secret': 'ThisIsNotASecretToken',
    'database': 'mongodb://USERNAME:PASSWORD@DBHOST:DBPORT/DBNAME'
};
```

## API

| Route             |Http Methode | Beschreibung                            |
| ----------------- |:-----------:| --------------------------------------- |
| /api/signup       | POST        | Registriert einen neuen Benutzer        |
| /api/authenticate | POST        | Authentifiziert einen Benutzer          |
| /api/tasks        | GET         | Gibt alle Aufgaben des Benutzers zurück |
| /api/tasks        | POST        | Legt einen neue Aufgabe an              |
| /api/tasks/:taskId| GET         | Gibt eine einzelne Aufgabe zurück       |
| /api/tasks/:taskId| PUT         | Aktualisiert eine Aufgabe               |
| /api/tasks/:taskId| DELETE      | Löscht eine Aufgabe                     |
