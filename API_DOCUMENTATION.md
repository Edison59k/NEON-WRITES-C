# Neon Writers API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
Currently, the API is open (no authentication required). In production, implement JWT tokens.

---

## Endpoints

### 1. Health Check
**GET** `/api/health`

Check if the server is running.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Status Code:** 200

---

### 2. Send Support Email
**POST** `/api/send-email`

Send a support ticket to the support email inbox. The backend sends the ticket to `neonwriters3@gmail.com` and optionally sends a confirmation to the user.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "to": "neonwriters3@gmail.com",
  "from": "user@example.com",
  "subject": "[Support Ticket TKT-1705328400000] Cannot place bids",
  "category": "bidding",
  "message": "I'm unable to place bids on available tasks. The button is not responding.",
  "userEmail": "user@example.com",
  "userName": "John Doe"
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `to` | string | Yes | Recipient email (should be support email) |
| `from` | string | Yes | Sender email address |
| `subject` | string | Yes | Email subject (auto-prefixed with [Support Ticket TKT-xxxxx]) |
| `category` | string | Yes | Ticket category: `bidding`, `payments`, `tasks`, `technical`, `account`, `other` |
| `message` | string | Yes | Full ticket message/description |
| `userEmail` | string | Yes | User's email for response |
| `userName` | string | Yes | User's full name |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "<CAL5V0G8pL8K+dX9=@gmail.com>",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "recipient": "neonwriters3@gmail.com",
  "senderEmail": "user@example.com"
}
```

**Error Responses:**

**Missing Required Fields (400):**
```json
{
  "success": false,
  "error": "Missing required fields: to, from, subject, message"
}
```

**Email Service Error (500):**
```json
{
  "success": false,
  "error": "Failed to send email",
  "message": "Authentication failed. Check your Gmail credentials.",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Email Sending Error (500):**
```json
{
  "success": false,
  "error": "Failed to send email",
  "message": "SMTP connection timeout",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Status Codes:**
- `200` - Email sent successfully
- `400` - Bad request (missing/invalid fields)
- `500` - Server error (email service failure)

---

### 3. Send Response Email
**POST** `/api/send-response`

Send a response email to a user regarding their support ticket. This is used by the admin to reply to support tickets.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "userEmail": "user@example.com",
  "ticketId": "TKT-1705328400000",
  "subject": "Re: Cannot place bids",
  "message": "Thank you for reporting this issue. We've identified the problem and are working on a fix. We'll notify you once it's resolved."
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userEmail` | string | Yes | User's email address |
| `ticketId` | string | Yes | Original ticket ID (e.g., TKT-xxxxx) |
| `subject` | string | Yes | Response subject line |
| `message` | string | Yes | Response message body |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Response email sent successfully",
  "messageId": "<CAL5V0G8pL8K+dX9=@gmail.com>",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "recipient": "user@example.com"
}
```

**Error Responses:**

**Missing Required Fields (400):**
```json
{
  "success": false,
  "error": "Missing required fields: userEmail, ticketId, message"
}
```

**Email Service Error (500):**
```json
{
  "success": false,
  "error": "Failed to send response email",
  "message": "Authentication failed",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Status Codes:**
- `200` - Response sent successfully
- `400` - Bad request
- `500` - Server error

---

## Usage Examples

### Using curl (Command Line)

**Health Check:**
```bash
curl http://localhost:3000/api/health
```

**Send Support Ticket:**
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "neonwriters3@gmail.com",
    "from": "user@example.com",
    "subject": "[Support Ticket TKT-123456] Issue Title",
    "category": "technical",
    "message": "Description of the issue",
    "userEmail": "user@example.com",
    "userName": "John Doe"
  }'
```

**Send Response:**
```bash
curl -X POST http://localhost:3000/api/send-response \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "user@example.com",
    "ticketId": "TKT-123456",
    "subject": "Re: Issue Title",
    "message": "We have resolved your issue."
  }'
```

### Using JavaScript (Browser/Node)

**Health Check:**
```javascript
fetch('http://localhost:3000/api/health')
  .then(r => r.json())
  .then(data => console.log(data));
```

**Send Support Ticket:**
```javascript
fetch('http://localhost:3000/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'neonwriters3@gmail.com',
    from: 'user@example.com',
    subject: '[Support Ticket TKT-123456] Cannot place bids',
    category: 'bidding',
    message: 'I cannot place bids on tasks',
    userEmail: 'user@example.com',
    userName: 'John Doe'
  })
})
.then(r => r.json())
.then(data => {
  if (data.success) {
    console.log('✅ Email sent:', data.messageId);
  } else {
    console.error('❌ Error:', data.error);
  }
})
.catch(error => console.error('Network error:', error));
```

**Send Response:**
```javascript
fetch('http://localhost:3000/api/send-response', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userEmail: 'user@example.com',
    ticketId: 'TKT-123456',
    subject: 'Re: Cannot place bids',
    message: 'We have fixed the issue. Please try again.'
  })
})
.then(r => r.json())
.then(data => console.log(data));
```

### Using Postman

1. Open Postman
2. Create new POST request
3. URL: `http://localhost:3000/api/send-email`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "to": "neonwriters3@gmail.com",
  "from": "test@example.com",
  "subject": "[Support Ticket TKT-123456] Test",
  "category": "technical",
  "message": "Test message",
  "userEmail": "test@example.com",
  "userName": "Test User"
}
```
6. Click "Send"

---

## Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success - Email sent |
| 400 | Bad Request - Invalid or missing parameters |
| 500 | Internal Server Error - Email service failure |

---

## Error Handling

### Common Errors

**1. Gmail Authentication Failed**
- Cause: Invalid email or password
- Solution: Check EMAIL_USER and EMAIL_PASSWORD in .env

**2. Missing Required Fields**
- Cause: One or more parameters missing from request body
- Solution: Verify all required parameters are included

**3. Port Already in Use**
- Cause: Another application using port 3000
- Solution: Change PORT in .env or kill existing process

**4. CORS Error**
- Cause: Frontend not allowed to access API
- Solution: CORS is already enabled; check browser console

### Debugging

Enable verbose logging:
```bash
DEBUG=* npm start
```

Check server console for detailed error messages.

---

## Integration with Frontend

The frontend (support.html) automatically integrates with these endpoints:

```javascript
// Frontend calls this when user submits support ticket
fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(ticketData)
})
```

The backend then:
1. Receives the support ticket
2. Sends it to neonwriters3@gmail.com
3. Returns success/failure response
4. Frontend updates UI with status

---

## Rate Limiting (Future Enhancement)

Consider implementing rate limiting to prevent email spam:
```javascript
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
});
app.use('/api/send-email', limiter);
```

---

## Security Considerations

1. **Email Validation**: Validate email format before sending
2. **Rate Limiting**: Implement to prevent spam
3. **Authentication**: Add JWT token validation for production
4. **HTTPS**: Use SSL/TLS in production
5. **Environment Variables**: Never commit .env file
6. **Input Sanitization**: Sanitize user input before sending

---

## Contact

For API support or issues, contact: neonwriters3@gmail.com

---

**API Version:** 1.0.0  
**Last Updated:** January 2024  
**Status:** Development
