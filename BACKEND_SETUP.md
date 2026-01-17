# Backend Setup Guide - Neon Writers

## Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Gmail account with 2-Factor Authentication enabled

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

This will install:
- **express** - Web framework
- **nodemailer** - Email sending
- **cors** - Cross-Origin Resource Sharing
- **body-parser** - Request body parsing
- **dotenv** - Environment variables

### 2. Configure Email (Gmail Setup)

#### Create App-Specific Password:
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already enabled
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select "Mail" and "Windows Computer"
5. Copy the 16-character password provided

#### Create .env File:
```bash
cp .env.example .env
```

Edit `.env` and add:
```
PORT=3000
EMAIL_USER=neonwriters3@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
SUPPORT_EMAIL=neonwriters3@gmail.com
NODE_ENV=development
```

**Important:** The password should be the 16-character App Password (without spaces, or with spaces - nodemailer handles both).

### 3. Start the Server

**Development Mode:**
```bash
npm start
```

**Output should show:**
```
╔════════════════════════════════════════╗
║    Neon Writers Backend Server         ║
║    Running on port 3000                ║
║    Email: neonwriters3@gmail.com       ║
╚════════════════════════════════════════╝
    API available at: http://localhost:3000
    Health check: http://localhost:3000/api/health
```

### 4. Test the Server

**Health Check:**
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 5. Send Test Email

**Using curl:**
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "neonwriters3@gmail.com",
    "from": "test@example.com",
    "subject": "[Support Ticket TKT-123456] Test Ticket",
    "category": "technical",
    "message": "This is a test support ticket",
    "userEmail": "test@example.com",
    "userName": "Test User"
  }'
```

**Using JavaScript (from browser console):**
```javascript
fetch('http://localhost:3000/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'neonwriters3@gmail.com',
    from: 'test@example.com',
    subject: '[Support Ticket TKT-123456] Test Ticket',
    category: 'technical',
    message: 'This is a test email',
    userEmail: 'test@example.com',
    userName: 'Test User'
  })
})
.then(r => r.json())
.then(data => console.log(data));
```

## API Endpoints

### POST /api/send-email
**Send support ticket to support email**

**Request Body:**
```json
{
  "to": "neonwriters3@gmail.com",
  "from": "user@example.com",
  "subject": "[Support Ticket TKT-timestamp] Issue Title",
  "category": "bidding|payments|tasks|technical|account|other",
  "message": "Full ticket message",
  "userEmail": "user@example.com",
  "userName": "User Full Name"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "<message-id@gmail.com>",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "recipient": "neonwriters3@gmail.com",
  "senderEmail": "user@example.com"
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "Failed to send email",
  "message": "Error details here",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### POST /api/send-response
**Send response to user about their support ticket**

**Request Body:**
```json
{
  "userEmail": "user@example.com",
  "ticketId": "TKT-123456",
  "subject": "Response to your issue",
  "message": "We have resolved your issue..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Response email sent successfully",
  "messageId": "<message-id@gmail.com>",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "recipient": "user@example.com"
}
```

### GET /api/health
**Server health check**

**Success Response (200):**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Troubleshooting

### "Authentication failed" error
- ✅ Verify you're using App Password, not regular Gmail password
- ✅ Check EMAIL_PASSWORD in .env (remove spaces if present)
- ✅ Ensure 2-Step Verification is enabled on Gmail account

### "Port 3000 already in use"
```bash
# Change PORT in .env to 3001, 3002, etc.
PORT=3001
```

### "CORS error" from frontend
- ✅ Server already has CORS enabled
- ✅ Ensure frontend is accessing http://localhost:3000

### "Cannot find module" errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Email not sending
1. Check Gmail spam/trash folders
2. Verify EMAIL_USER and EMAIL_PASSWORD in .env
3. Check server logs for detailed error messages
4. Test with curl command above to isolate issue

## Production Deployment

For production, use a dedicated email service:
- **SendGrid** (recommended)
- **AWS SES**
- **MailGun**
- **Microsoft 365 mail**

Update `.env` with appropriate SMTP configuration.

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment | development/production |
| EMAIL_USER | Gmail address | neonwriters3@gmail.com |
| EMAIL_PASSWORD | Gmail App Password | xxxx xxxx xxxx xxxx |
| SUPPORT_EMAIL | Support inbox | neonwriters3@gmail.com |
| CORS_ORIGIN | Frontend URL | http://localhost:3000 |

## File Structure

```
NEON WRITERS C/
├── server.js                 (Backend server - EXPRESS)
├── package.json             (Dependencies & scripts)
├── .env                     (Configuration - DO NOT COMMIT)
├── .env.example             (Configuration template)
├── index.html               (Login page)
├── support.html             (Support page with form)
├── completed.html           (Task submission)
├── notifications.js         (Email notification system)
└── [other frontend files]
```

## Integration with Frontend

The frontend sends support tickets via:
```javascript
fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(emailData)
})
```

The backend receives and sends to `neonwriters3@gmail.com`.

## Next Steps

1. Install dependencies: `npm install`
2. Create .env file with Gmail credentials
3. Start server: `npm start`
4. Test with health check: http://localhost:3000/api/health
5. Frontend will automatically connect to send support tickets

---
**Created:** January 2024
**Last Updated:** January 2024
**Status:** Ready for Development
