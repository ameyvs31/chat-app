# 🔐 PrivateChat

> An invite-based real-time messaging application where users connect privately using unique Chat Keys.

PrivateChat is a privacy-focused chat application designed around controlled connections. Users can only start conversations after establishing a connection using a unique Chat Key.

---

## ✨ Features

- 🔐 JWT Authentication — Signup & Login
- 🔑 Unique Chat Key for every user
- 🤝 Invite-only private connections
- 💬 Real-time messaging with Socket.io
- ⌨️ Real-time typing indicators
- 🟢 Online / Offline status
- 🕐 Last seen tracking
- 🎨 7 unique chat themes per conversation
- 🌙 Dark / Light mode



## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Real-time Communication | Socket.io |
| Authentication | JWT |


## 🏗️ Project Structure


PrivateChat/
│
├── backend/
│   └── Express API + Socket.io server
│
├── frontend/
│   └── React + Tailwind UI
│
└── README.md



## 🔄 How It Works

PrivateChat uses an invite-based connection system instead of allowing users to randomly discover and message other users.

### Connection Flow


User A
   │
   │ Shares unique Chat Key
   ▼
User B
   │
   │ Sends connection request
   ▼
Connection Established
   │
   ▼
Private Conversation
   │
   ▼
Real-time messaging
   │
   └── Socket.io
   




### Connection Process

1. A user creates an account or logs in.
2. PrivateChat generates a unique Chat Key for the user.
3. The user shares their Chat Key with another person.
4. The other user uses the Chat Key to initiate a connection.
5. Once the connection is established, both users can communicate privately.
6. Messages are delivered in real time using Socket.io.
7. Typing indicators and online/offline status are updated in real time.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB Atlas account

### 1. Clone the Repository

```bash
git clone https://github.com/ameyvs31/chat-app.git
cd chat-app
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Backend

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

### Frontend

Create a `.env` file inside the `frontend` directory:

```env
VITE_BACKEND_URL=http://localhost:5000
```

> ⚠️ Never commit `.env` files, database credentials, JWT secrets, or other sensitive information to GitHub.

---

## ⚡ Real-Time Communication

Socket.io powers the real-time functionality of PrivateChat, including:

- 💬 Instant messaging
- ⌨️ Typing indicators
- 🟢 Online / Offline status
- 🕐 Last seen updates

This allows users to communicate without manually refreshing the application.

---

## 🎨 User Experience

PrivateChat provides several customization options:

- 🌙 Dark mode
- ☀️ Light mode
- 🎨 7 unique conversation themes
- 📱 Responsive interface

The application is designed to provide a simple and personalized messaging experience while keeping connections private.

---

## 🔒 Security

PrivateChat uses JWT-based authentication and an invite-only connection model to keep communication controlled between users.

Sensitive configuration such as database credentials and authentication secrets is managed through environment variables.

---

## 📸 Screenshots

Screenshots and a product walkthrough will be added here.

---

## 🎯 What I Learned

Building PrivateChat gave me hands-on experience with:

- React and Vite
- Node.js and Express
- REST API development
- MongoDB and MongoDB Atlas
- JWT authentication
- Socket.io and real-time communication
- Client-server architecture
- Tailwind CSS
- Environment configuration
- Responsive web application development

---

## 🚧 Future Improvements

Potential improvements for future versions include:

- 📎 File and image sharing
- 🔔 Push notifications
- 📨 Message delivery and read indicators
- 🗑️ Message deletion
- 🔍 Conversation search
- 📱 Further mobile optimization

---

## 👨‍💻 Author

### Amey Vikram Shrivastav

**Computer Science Engineer | Full-Stack Developer | Cybersecurity Enthusiast**

- GitHub: [@ameyvs31](https://github.com/ameyvs31)
- Portfolio: [amey-portfolio](https://amey-portfolio-qdkt.onrender.com/)

---

⭐ If you find PrivateChat interesting, consider giving the repository a star.
```


