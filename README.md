# task-manager
This is a full-stack task management web application that allows users to create, update, and delete tasks in a structured way. It includes user authentication, so each user can securely manage their own tasks.

The goal of this project is to demonstrate how frontend, backend, and database systems work together in a real-world application. Another goal for this project also for me to learn regarding the technologies used in frontend, backend and database.

---

## Technologies Used

### Frontend

* React
* Tailwind

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL

### Other Tools

* REST API architecture
* JSON Web Tokens (JWT) for authentication
* Bcrypt.js for password handling
* Git & GitHub for version control

## Features

* User authentication (register & login)
* Secure password handling
* Create, read, update, and delete tasks (CRUD)
* Task state management
* Persistent data storage using PostgreSQL
* API-based communication between frontend and backend

## The Process

This project was built by first designing the backend API structure, followed by integrating the frontend.

1. Designed database schema (users, tasks)
2. Built RESTful API endpoints in Express
3. Implemented authentication using JWT
4. Connected frontend to backend via API calls
5. Handled state management and UI updates in React
6. Debugged data flow issues between frontend and backend

## What I Learned

* How REST APIs work in a real application
* Managing data flow between frontend and backend
* Handling authentication and protecting routes
* Structuring a full-stack project
* Debugging issues across multiple layers (UI, API, database)
* Importance of consistent naming between frontend and backend
* Importance of a good dataflow model, data flows and architecture of frontend, backend and database

## How Can It Be Improved?

* Add task categories or tags
* Implement refresh token and access token for Token system
* Improve UI/UX design
* Implement real-time updates (e.g. WebSockets)
* Write unit and integration tests
* Add different type of users: Admin
* Implement spam login detection by IP address

## How to Run the Project

Follow the steps below to run this project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```

### 2. Setup Backend

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory and add the following:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
```

Start the backend server:

```bash
npm run dev
```

or

```bash
node index.js
```

### 3. Setup Database (PostgreSQL)

Make sure PostgreSQL is running, then:

- Create a database
- Run your schema (tables for `users` and `tasks`)

If you're using Prisma:

```bash
npx prisma migrate dev
```

If you're using raw SQL, run your `.sql` file manually.

### 4. Setup Frontend

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

### 5. Access the Application

Open your browser and go to:

```
http://localhost:5173
```

(Port may vary depending on your setup)

### 6. Notes

- Ensure backend is running before frontend
- Make sure your database connection string is correct
- Update API base URL in frontend if needed


