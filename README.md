# ⚡ MCB Dashboard – Real-Time Electrical Monitoring System

A full-stack real-time dashboard to monitor and control electrical parameters like voltage, current, temperature, and MCB trip events.

---

## 🚀 Features

- 📡 Real-time data streaming using Socket.io  
- 📊 Live charts (Voltage vs Time, Current vs Time)  
- ⚡ Spike detection & ⚠️ MCB trip detection  
- 🎛️ Relay control from UI  
- 📁 Reports with filtering (last 5 min / 1 hour)  
- 📄 CSV download support  
- 🧠 Smart alert system  
- 🔌 Arduino-ready (can switch from fake data to real hardware)

---

## 🏗️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Recharts

### Backend
- Node.js
- Express.js
- Socket.io

### Database
- MongoDB (Atlas)

---

## 🔄 Architecture


Sensors / Arduino
↓
Backend (Node.js + Socket.io)
↓
MongoDB (Storage)
↓
REST API
↓
Frontend (React Dashboard)


---

## 📁 Project Structure


mcb-dashboard/
├── mcb-backend/
├── mcb-frontend/


---

## ⚙️ Setup Instructions

### 1. Clone Repo
```bash
git clone https://github.com/aashishhh23/mcb-dashboard.git
cd mcb-dashboard

### 2. Backend Setup
cd mcb-backend
npm install
node server.js

### 3. Frontend Setup
cd mcb-frontend
npm install
npm run dev

###🔐 Environment Variables

Create .env in backend:

MONGO_URI=your_mongodb_connection_string

### 🌐 Deployment
Frontend → Vercel
Backend → Render
Database → MongoDB Atlas

###🧠 Key Learnings
Real-time communication using WebSockets
Handling large data using pagination
Designing scalable system architecture
Managing state efficiently in React

###🚀 Future Improvements
Authentication & role-based access
Multi-device support
Advanced analytics dashboard
Time-series database optimization

###👨‍💻 Author

Aashish Kumar
