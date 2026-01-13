# Authentication System Documentation

## Overview
The Neon Writers application now includes a persistent login/signup system that stores user credentials in browser localStorage. Once a user signs up with an email, they can log in with the same email and password on subsequent visits without needing to sign up again.

## How It Works

### 1. **Signup Process**
When a user signs up:
- User fills in signup form (First Name, Last Name, Email, Phone, Password)
- Form validation is performed
- User data is checked to ensure the email hasn't been registered before
- If email is new:
  - User data is stored in multiple localStorage keys for different purposes
  - User is automatically logged in
  - User is redirected to the dashboard (mainpage.html)
  - A success message is displayed

### 2. **Login Process**
When a user tries to log in:
- User enters email and password
- System searches the registered users list to find a matching email
- If email found:
  - Password is verified (exact match)
  - If password matches: User is logged in and redirected to dashboard
  - If password doesn't match: Error message is shown
- If email not found:
  - User is asked if they want to create a new account
  - If yes, signup form opens with email pre-filled

### 3. **Session Management**
The authentication system maintains the following localStorage keys:

| Key | Purpose | Content |
|-----|---------|---------|
| `neon_writers_logged_in` | Session flag | `'true'` or `'false'` |
| `neon_writers_current_user` | Current logged-in user | Full user object with all data |
| `neon_writers_all_users` | All registered users | Array of all user objects |
| `neon_writers_user` | Legacy/backup storage | Current user object (for backward compatibility) |
| `neon_writers_users` | Admin view users | Users without password field (security) |

### 4. **User Data Structure**
Each user object contains:
```javascript
{
    id: 1234567890,                      // Unique timestamp-based ID
    firstName: "John",                   // First name
    lastName: "Doe",                     // Last name
    email: "john@example.com",           // Email address
    phone: "0712345678",                 // Phone number (formatted)
    password: "SecurePassword123",       // Password (plaintext in demo)
    balance: 0,                          // Current account balance
    totalEarned: 0,                      // Total earnings
    completedTasks: 0,                   // Number of completed tasks
    rating: 0.0,                         // User rating
    joinedDate: "2024-01-13T...",        // Account creation date
    subscribed: true,                    // Subscription status
    paymentMade: true,                   // Payment status
    paymentDate: "2024-01-13T...",       // Payment date
    lastLoginDate: "2024-01-13T..."      // Last login timestamp
}
```

## Features

### ✅ Implemented Features
- **Sign Up**: Create new account with validation
- **Login**: Access existing account with email/password
- **Email Duplicate Check**: Prevent same email from being registered twice
- **Password Validation**: Password must be at least 8 characters
- **Phone Validation**: Kenyan phone number format support
- **Auto-Login**: Users remain logged in across browser sessions
- **User Dashboard**: Logged-in users can access mainpage.html
- **Profile Access**: Logged-in users can view profile.html
- **Session Persistence**: Login persists until localStorage is cleared
- **Navigation Update**: UI updates to show logged-in user's name
- **Last Login Tracking**: Records when user last logged in

## Usage Examples

### Example 1: First-Time User
1. User visits index.html
2. User clicks "Sign Up"
3. User fills in form and submits
4. Account is created and user is logged in
5. User is redirected to mainpage.html
6. User can see their name in the navigation bar

### Example 2: Returning User
1. User visits index.html
2. User clicks "Log In"
3. User enters their email and password
4. User is authenticated and logged in
5. User is redirected to mainpage.html
6. Navigation shows "Dashboard (John)" button

### Example 3: User Forgot They Signed Up
1. User visits index.html
2. User clicks "Log In"
3. User enters email but can't remember they signed up
4. System prompts: "No account found with this email. Would you like to create a new account?"
5. User clicks "No" and remembers they have an account
6. User clicks "Log In" again and enters correct password
7. User is logged in successfully

## Security Notes

⚠️ **Important**: This is a demonstration system. For production use:
1. **Do NOT store passwords in localStorage** - use proper authentication
2. **Use HTTPS** - encrypt all data in transit
3. **Hash passwords** - use bcrypt, argon2, or similar
4. **Use backend authentication** - implement proper server-side authentication
5. **Implement session tokens** - use secure session management
6. **Enable CORS** - configure proper cross-origin policies
7. **Add rate limiting** - prevent brute force attacks
8. **Implement 2FA** - add two-factor authentication for security

## Browser Storage Limits

- **localStorage limit**: ~5-10MB per domain
- **Max users**: ~500-1000 users (depending on data size)
- **Data persistence**: Until user clears browser cache/storage

## Testing the System

### Test Signup
```
Email: testuser@example.com
Password: TestPass123
```

### Test Login
```
Use the same email and password from signup
```

### Clear All Data
```javascript
// Run in browser console to reset everything
localStorage.clear();
```

## File Modifications

The following files were modified to implement this authentication system:
- **index.html**: Added enhanced signup/login logic with localStorage persistence

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Login not working | Clear localStorage and try again |
| Can't sign up with same email | Email already exists, use login instead |
| Lost login after clearing cache | Re-login; data is only stored in localStorage |
| Password doesn't work | Ensure exact match (case-sensitive) |
| Can't see user name in nav | Check localStorage has `neon_writers_logged_in = 'true'` |

## Future Enhancements

1. Implement proper backend authentication (Node.js/Python server)
2. Add password hashing (bcrypt)
3. Implement email verification
4. Add "Forgot Password" feature
5. Implement session timeout/auto-logout
6. Add two-factor authentication (2FA)
7. Create user profile editing page
8. Add logout functionality
9. Implement role-based access control (admin, writer, etc.)
10. Add activity logging and audit trails

---

**Last Updated**: January 13, 2026
**Version**: 1.0
