# 🔐 PrivateChat — Invite-Based Real-Time Chat App

A private chat application where users can only message each other using a unique Chat Key.

## 🚀 Tech Stack
- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas
- **Real-time:** Socket.io
- **Auth:** JWT

## ✨ Features
- JWT Authentication (Signup/Login)
- Unique ChatKey per user
- Invite-only private connections
- Real-time messaging with Socket.io
- Typing indicators
- Online/Offline status + Last seen
- 7 unique chat themes per conversation
- Dark/Light mode

## 🏃 Run Locally

### Backend
cd backend
npm install
npm run dev

### Frontend
cd frontend
npm install
npm run dev

## 📁 Project Structure
- /backend → Express API + Socket.io server
- /frontend → React + Tailwind UI

## 🔑 Environment Variables

### Backend (.env)
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173

### Frontend (.env)
VITE_BACKEND_URL=http://localhost:5000