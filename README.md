# Notes App

The Notes App is a Node.js application using Express and MongoDB for user authentication and note management. It utilizes JSON Web Tokens (JWT) for authentication and provides endpoints for user registration, login, and CRUD operations on notes.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB installed and running

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/notes-app.git
2. **Navigate to the project folder:**

   ```bash
   cd notes-app
3. **Install dependencies:**

   ```bash
   npm install
4. **Create a .env file and add the necessary environment variables:**

   ```bash
   MONGODB_URI=your_mongodb_uri 
   JWT_SECRET=your_jwt_secret
## Usage

3. **Install dependencies:**

   ```bash
   npm start
## API Endpoints
* `POST /auth/signup`: Register a new user.
* `POST /auth/login`: Log in and get a JWT.
* `POST /api/notes`: Create a new note.
* `GET /api/notes`: Get all notes for the authenticated user.
* `GET /api/notes/:id`: Get a specific note by ID.
* `PUT /api/notes/:id`: Update a note by ID.
* `DELETE /api/notes/:id`: Delete a note by ID.
* `POST /api/notes/:id/share`: Share a note with another user.
* `GET /api/search?q=query`: Search for notes based on keywords.
## Authentication

**For authentication, JWTs are used. Include the JWT token in the Authorization header for protected routes.**

   ```bash
   GET /api/notes
Authorization: Bearer your_jwt_token
