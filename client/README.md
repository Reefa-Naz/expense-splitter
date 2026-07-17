# 💸 Expense Splitter

A full-stack web application to split expenses among groups of people — like Splitwise, but built from scratch.

## 🌐 Live Demo
Coming soon

## 📸 Screenshots
*(Add screenshots of your app here)*

## ✨ Features
- 🔐 User authentication (Signup/Login with JWT)
- 👥 Create groups and add members
- 💰 Add expenses with categories (Food, Travel, Hotel, Shopping, Entertainment)
- ⚖️ Auto split expenses equally among members
- 📊 Real-time balance calculation
- ✅ Settle up payments with history
- 🗑️ Delete expenses and settlements
- 🔍 Search and filter expenses
- 📈 Spending breakdown chart by category
- 🌙 Dark mode across all pages
- 📱 Fully responsive mobile design

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS
- Axios
- React Router DOM
- Recharts

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

## 🚀 How to Run Locally

### Prerequisites
- Node.js installed
- MongoDB installed and running

### Backend Setup
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```
MONGO_URI=mongodb://localhost:27017/expense-splitter
JWT_SECRET=mysecretkey123
PORT=5000
```

```bash
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## 📁 Project Structure


expense-splitter/
├── client/ # React frontend
│ ├── src/
│ │ ├── pages/ # All page components
│ │ ├── components/ # Reusable components
│ │ └── context/ # Theme context
└── server/ # Node.js backend
├── models/ # MongoDB models
├── routes/ # API routes
└── index.js # Entry point  


## 👩‍💻 Author
Reefa — CSE Student

