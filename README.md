## Real-Time Polling App

A full-stack real-time polling web application that allows users to create polls, share them via a link, and collect votes with live result updates for all viewers.
Built with the MERN stack and Socket.IO, with fairness controls to reduce abusive voting.

## Live Demo
```
Frontend: http://localhost:5173
Backend API: http://localhost:5000
```
## Features
### 1. Poll Creation

- Create a poll with a question and at least two options
- Polls are stored persistently in MongoDB
- A shareable link is generated after creation

### 2. Join by Link

Anyone with the poll link can:
- View the poll
- Vote on one option only
- No login required (frictionless experience)

### 3. Real-Time Results

- Voting updates are pushed instantly to all connected users
- Implemented using Socket.IO
- No manual page refresh needed

### 4. Fairness / Anti-Abuse Controls

The app includes two mechanisms to reduce repeat or abusive voting:

#### Mechanism 1: One Vote per Browser (Voter ID)

- A unique voterId is generated and stored in the browser’s localStorage
- This ID is sent with every vote request
- The backend rejects duplicate votes for the same poll

Prevents:
- Multiple votes by refreshing the page
- Repeated voting from the same browser

Limitation:
Users can vote again by switching browsers or clearing localStorage

#### Mechanism 2: IP-Based Rate Limiting

- Voting endpoints are protected with rate limiting
- Restricts the number of requests per IP within a time window

Prevents:
- Automated vote spamming
- Abuse via scripts or bots

Limitation:
Users on shared networks may share the same IP

### 5. Persistence

- Polls and votes are stored in MongoDB
- Data remains available after refresh or restart
- Share links remain valid over time

### 6. UI / UX Enhancements

Modern dashboard-style UI with Tailwind CSS
- Light / Dark mode toggle (persistent)
- Animated background elements
- Confetti celebration on successful poll creation
- Responsive design for mobile and desktop

## Tech Stack
### Frontend

- React (Vite)
- Tailwind CSS
- Axios
- Socket.IO Client

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.IO
- Express Rate Limit

## Project Structure
```
realtime-polling-app/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── Poll.js
│   ├── routes/
│   │   └── pollRoutes.js
│   ├── middleware/
│   │   └── rateLimiter.js
│   ├── socket/
│   │   └── socket.js
│   ├── .env
│   ├── .gitignore
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── CreatePoll.jsx
│   │   │   └── PollPage.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PollResults.jsx
│   │   │   └── FloatingShapes.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── confetti.js
│   │   ├── socket.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```