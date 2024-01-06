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
   git clone https://github.com/your-username/crud-app.git
2. **Navigate to the project folder:**

   ```bash
   cd crud-app
3. **Install dependencies:**

   ```bash
   npm install
4. **Create a folder named "config," and inside it, establish a .env file containing the required environment variables.**

   ```bash
   MONGODB_URI=your_mongodb_uri 
   NOTER_JWT_SECRET=your_jwt_secret
## Usage

3. **Install dependencies:**

   ```bash
   npm start
#### Visit http://localhost:8000 in your browser or use a tool like Postman to interact with the API.

## API Endpoints
* `POST /users`: Register a new user.
* `POST /users/login`: Log in and get a JWT.
* `POST /notes`: Create a new note.
* `GET /notes`: Get all notes for the authenticated user.
* `GET /notes/:id`: Get a specific note by ID.
* `PUT /notes/:id`: Update a note by ID.
* `DELETE /notes/:id`: Delete a note by ID.
* `POST /notes/:id/share`: Share a note with another user.
* `GET /search/:key`: Search for notes based on keywords.
## Authentication

**For authentication, JWTs are used. Include the JWT token in the Authorization header for protected routes.**

   ```bash
   GET /notes
Authorization: Bearer your_jwt_token
