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

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Real-time Communication | Socket.io |
| Authentication | JWT |

---

## 🏗️ Project Structure

```text
PrivateChat/
│
├── backend/
│   └── Express API + Socket.io server
│
├── frontend/
│   └── React + Tailwind UI
│
└── README.md

---

## 🔄 How It Works

PrivateChat uses an invite-based connection system instead of allowing users to randomly discover and message other users.

### Connection Flow

```text
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
   
