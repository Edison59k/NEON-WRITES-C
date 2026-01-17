# Quick Start Guide

## 🚀 Get the Backend Running in 2 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create .env File
Copy `.env.example` and fill in Gmail credentials:
```bash
cp .env.example .env
```

Edit `.env` and add your Gmail App Password (from [here](https://myaccount.google.com/apppasswords)):
```
PORT=3000
EMAIL_USER=neonwriters3@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

### Step 3: Start Server
```bash
npm start
```

Expected output:
```
╔════════════════════════════════════════╗
║    Neon Writers Backend Server         ║
║    Running on port 3000                ║
║    Email: neonwriters3@gmail.com       ║
╚════════════════════════════════════════╝
    API available at: http://localhost:3000
    Health check: http://localhost:3000/api/health
```

### Step 4: Test It
Open browser and visit: **http://localhost:3000/api/health**

Should see:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## ✅ That's It!

The frontend will automatically send support tickets to the backend at `http://localhost:3000/api/send-email`

---

## 🔧 Windows Users

Double-click these batch files instead:
1. **setup.bat** - Install dependencies (run once)
2. **start-server.bat** - Start the server

---

## 📧 What Happens Now?

1. User fills out support form → **support.html**
2. Form submitted → **fetch() call to /api/send-email**
3. Backend receives → **server.js** 
4. Email sent → **neonwriters3@gmail.com**
5. Response returned to frontend → **Auto-update UI**

---

## 🆘 Issues?

See **BACKEND_SETUP.md** or **API_DOCUMENTATION.md** for detailed help.

Key checks:
- ✅ Node.js installed? `node --version`
- ✅ npm installed? `npm --version`  
- ✅ .env file created?
- ✅ Gmail App Password used (not regular password)?
- ✅ Port 3000 free?
