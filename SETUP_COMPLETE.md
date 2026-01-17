# 🚀 Neon Writers Backend - Complete Setup

## What You're Getting

A complete **Node.js/Express backend server** that:
- ✅ Receives support tickets from the frontend
- ✅ Sends emails to neonwriters3@gmail.com via Gmail
- ✅ Sends responses back to users
- ✅ Handles errors gracefully
- ✅ Works with your existing frontend (no changes needed!)

---

## 📋 Prerequisites

1. **Node.js** installed (download from https://nodejs.org/)
2. **Gmail account** with 2-Factor Authentication enabled
3. **Gmail App Password** (generate at https://myaccount.google.com/apppasswords)

---

## ⚡ 3-Step Setup

### Step 1️⃣: Install Dependencies
```bash
npm install
```

**What it does:** Downloads express, nodemailer, cors, and other packages

---

### Step 2️⃣: Create .env File

**Option A - Windows:**
1. Open `.env.example` in VS Code
2. Save As → `.env` (same folder)
3. Edit and add your Gmail App Password

**Option B - Command Line:**
```bash
cp .env.example .env
```

**Your .env should look like:**
```
PORT=3000
EMAIL_USER=neonwriters3@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
SUPPORT_EMAIL=neonwriters3@gmail.com
NODE_ENV=development
```

**How to get Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Google generates a 16-character password
4. Copy it (with or without spaces) → paste in .env

---

### Step 3️⃣: Start Server
```bash
npm start
```

**Expected output:**
```
╔════════════════════════════════════════╗
║    Neon Writers Backend Server         ║
║    Running on port 3000                ║
║    Email: neonwriters3@gmail.com       ║
╚════════════════════════════════════════╝
    API available at: http://localhost:3000
    Health check: http://localhost:3000/api/health
```

---

## ✅ Verify It Works

### Test 1: Health Check
Open browser → **http://localhost:3000/api/health**

Should show:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test 2: Send Test Ticket
Copy this into browser console:
```javascript
fetch('http://localhost:3000/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'neonwriters3@gmail.com',
    from: 'test@example.com',
    subject: '[Support Ticket TKT-123456] Test Ticket',
    category: 'technical',
    message: 'This is a test ticket from the backend setup',
    userEmail: 'test@example.com',
    userName: 'Test User'
  })
})
.then(r => r.json())
.then(data => console.log(data));
```

Should see:
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "<CAL5V0G8pL8K+dX9=@gmail.com>",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "recipient": "neonwriters3@gmail.com",
  "senderEmail": "test@example.com"
}
```

Check **neonwriters3@gmail.com** inbox - test email should be there!

---

## 🪟 Windows Users: Quick Setup

Instead of command line, just double-click:

1. **setup.bat** - Installs everything (run once)
2. **start-server.bat** - Runs the server

---

## 🔗 How Frontend Connects

The **support.html** page already has this code:

```javascript
fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(ticketData)
})
```

When user fills out support form → **Auto-sends to your backend!**

No changes needed to frontend - it just works! ✨

---

## 📧 What Happens When User Submits Ticket

```
1. User fills support form in support.html
   ↓
2. JavaScript validates and prepares email data
   ↓
3. fetch() sends POST to http://localhost:3000/api/send-email
   ↓
4. Backend (server.js) receives the request
   ↓
5. Nodemailer sends email via Gmail SMTP
   ↓
6. Email arrives at neonwriters3@gmail.com inbox
   ↓
7. Frontend gets success response → shows "✓ Ticket sent"
```

**Everything is automated!** 🎉

---

## 🗂️ Files Created

| File | Purpose |
|------|---------|
| **server.js** | Main backend server |
| **package.json** | Dependencies & scripts |
| **.env.example** | Configuration template |
| **.gitignore** | Protects .env from git |
| **BACKEND_SETUP.md** | Detailed setup guide |
| **API_DOCUMENTATION.md** | API reference |
| **QUICK_START.md** | 2-minute guide |
| **BACKEND_SUMMARY.md** | This is what you need |
| **setup.bat** | Windows installer |
| **start-server.bat** | Windows launcher |

---

## 🆘 Troubleshooting

### ❌ "Cannot find module 'express'"
**Solution:** Run `npm install`

### ❌ "Port 3000 already in use"
**Solution:** Change PORT in .env to 3001

### ❌ "Authentication failed for email"
**Solution:** Verify .env has correct Gmail App Password (not regular password)

### ❌ "Email not sending"
**Solution:** 
1. Check Gmail spam folder
2. Verify EMAIL_USER in .env
3. Check server console for error messages

See **BACKEND_SETUP.md** Troubleshooting section for more help.

---

## 🎯 Next Steps

1. ✅ Install: `npm install`
2. ✅ Configure: Create `.env` file
3. ✅ Run: `npm start`
4. ✅ Test: Visit http://localhost:3000/api/health
5. ✅ Use: Frontend automatically sends support tickets

That's it! Your backend is ready! 🚀

---

## 📚 Need More Help?

- **Setup Issues?** → See BACKEND_SETUP.md
- **API Questions?** → See API_DOCUMENTATION.md
- **Need Quick Start?** → See QUICK_START.md

---

## 🔒 Security Notes

- ✅ Credentials stored in `.env` (not committed to git)
- ✅ CORS enabled for frontend communication
- ✅ Input validation on all endpoints
- ✅ Error handling prevents information leakage
- ✅ Emails sent securely via Gmail

---

## 📊 Email Templates

The backend automatically formats support emails with:
- Ticket ID (TKT-timestamp)
- User info (name, email, category)
- Formatted message with HTML styling
- Plain text fallback
- Professional layout

Admin receives beautifully formatted emails! 📧

---

## 🚦 Status

- ✅ Backend Server: Created
- ✅ Email Integration: Configured  
- ✅ API Endpoints: Ready
- ✅ Documentation: Complete
- ✅ Frontend Integration: Ready
- ⏳ **Your Action:** Install & Configure

---

**Ready to go?** Start with: `npm install` 🎉

