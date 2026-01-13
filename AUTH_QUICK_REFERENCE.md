# Authentication System - Quick Reference Guide

## Quick Start for Developers

### 1. Include the Auth Library
Add this to your HTML file before using authentication:
```html
<script src="auth.js"></script>
```

### 2. Check if User is Logged In
```javascript
if (NeonAuth.isLoggedIn()) {
    console.log('User is logged in');
}
```

### 3. Get Current User Data
```javascript
const user = NeonAuth.getCurrentUser();
console.log(user.firstName); // John
console.log(user.email);     // john@example.com
```

### 4. Redirect Unauthenticated Users
```javascript
if (!NeonAuth.isLoggedIn()) {
    window.location.href = 'index.html'; // Redirect to login page
}
```

### 5. Update User Data
```javascript
NeonAuth.updateCurrentUser({
    balance: 150.50,
    completedTasks: 5,
    totalEarned: 150.50
});
```

### 6. Logout User
```javascript
NeonAuth.logout();
window.location.href = 'index.html';
```

## Common Use Cases

### Example 1: Display User Name in Dashboard
```javascript
const user = NeonAuth.getCurrentUser();
if (user) {
    document.getElementById('userName').textContent = user.firstName + ' ' + user.lastName;
}
```

### Example 2: Show Earnings in Profile
```javascript
const user = NeonAuth.getCurrentUser();
document.getElementById('earnings').textContent = '₹' + user.totalEarned.toFixed(2);
```

### Example 3: List All Registered Users (Admin)
```javascript
const allUsers = NeonAuth.getAllUsers();
allUsers.forEach(user => {
    console.log(`${user.firstName} ${user.lastName} - ${user.email}`);
});
```

### Example 4: Find User by Email
```javascript
const user = NeonAuth.findUserByEmail('john@example.com');
if (user) {
    console.log('User found:', user.firstName);
} else {
    console.log('User not found');
}
```

### Example 5: Create Protected Page (Mainpage.html)
```javascript
document.addEventListener('DOMContentLoaded', function() {
    if (!NeonAuth.isLoggedIn()) {
        alert('Please log in first');
        window.location.href = 'index.html';
        return;
    }
    
    const user = NeonAuth.getCurrentUser();
    console.log('Welcome', user.firstName);
    
    // Show dashboard content
    // Load user-specific data
});
```

### Example 6: Validate Before Data Changes
```javascript
const updatedData = {
    phone: '0798765432',
    balance: 200
};

const success = NeonAuth.updateCurrentUser(updatedData);
if (success) {
    alert('Profile updated successfully');
} else {
    alert('Failed to update profile');
}
```

### Example 7: Check Email Before Signup
```javascript
const email = 'newuser@example.com';
if (NeonAuth.emailExists(email)) {
    alert('This email is already registered');
} else {
    // Proceed with signup
}
```

### Example 8: Validate Password Strength
```javascript
const password = 'MyPassword123!';
const result = NeonAuth.validatePassword(password);

if (result.valid) {
    console.log('Password is valid');
} else {
    console.log('Password must be at least 8 characters');
}

console.log('Has uppercase:', result.hasUpperCase);
console.log('Has numbers:', result.hasNumbers);
```

### Example 9: Get User Statistics
```javascript
const stats = NeonAuth.getStatistics();
console.log('Total users:', stats.totalUsers);
console.log('Total earnings:', stats.totalEarnings);
console.log('Average earnings:', stats.averageEarningsPerUser);
```

### Example 10: Export User Data
```javascript
const jsonData = NeonAuth.exportData();
console.log(jsonData);
// Save to file or send to server
```

## API Reference

### Methods

#### Getters
| Method | Returns | Description |
|--------|---------|-------------|
| `isLoggedIn()` | boolean | Check if user is currently logged in |
| `getCurrentUser()` | Object/null | Get current logged-in user |
| `getAllUsers()` | Array | Get all registered users |
| `getStatistics()` | Object | Get system statistics |

#### Search
| Method | Returns | Description |
|--------|---------|-------------|
| `findUserByEmail(email)` | Object/null | Find user by email |
| `findUserById(userId)` | Object/null | Find user by ID |
| `emailExists(email)` | boolean | Check if email is registered |

#### Validation
| Method | Returns | Description |
|--------|---------|-------------|
| `validateEmail(email)` | boolean | Validate email format |
| `validatePassword(password)` | Object | Validate password strength |
| `validatePhone(phone)` | Object | Validate Kenyan phone number |

#### Authentication
| Method | Returns | Description |
|--------|---------|-------------|
| `registerUser(userData)` | Object | Register new user |
| `authenticateUser(email, password)` | Object | Login user |
| `logout()` | void | Logout current user |

#### Data Management
| Method | Returns | Description |
|--------|---------|-------------|
| `updateCurrentUser(userData)` | boolean | Update current user data |
| `exportData()` | string | Export all users as JSON |
| `importData(jsonData)` | Object | Import users from JSON |
| `clearAllData()` | void | Clear all authentication data |

## localStorage Keys

| Key | Description | Type |
|-----|-------------|------|
| `neon_writers_logged_in` | Session flag | string ('true'/'false') |
| `neon_writers_current_user` | Current user object | JSON string |
| `neon_writers_all_users` | All registered users | JSON array string |
| `neon_writers_user` | Legacy storage | JSON string |
| `neon_writers_users` | Admin view (no passwords) | JSON array string |

## Page Protection Example

### mainpage.html
```html
<!DOCTYPE html>
<html>
<head>
    <title>Dashboard</title>
</head>
<body>
    <h1>Welcome, <span id="userName"></span>!</h1>
    
    <script src="auth.js"></script>
    <script>
        // Protect this page
        if (!NeonAuth.isLoggedIn()) {
            alert('Please log in first');
            window.location.href = 'index.html';
        }
        
        // Load user data
        const user = NeonAuth.getCurrentUser();
        document.getElementById('userName').textContent = user.firstName;
    </script>
</body>
</html>
```

## Testing in Browser Console

```javascript
// Check login status
NeonAuth.isLoggedIn();

// Get current user
NeonAuth.getCurrentUser();

// Get all users
NeonAuth.getAllUsers();

// Validate email
NeonAuth.validateEmail('test@example.com');

// Find user
NeonAuth.findUserByEmail('john@example.com');

// Get statistics
NeonAuth.getStatistics();

// Clear all data (for testing)
NeonAuth.clearAllData();
```

## Error Handling

```javascript
// Register user with error handling
const result = NeonAuth.registerUser({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'SecurePass123'
});

if (result.success) {
    console.log('User registered:', result.user);
} else {
    console.error('Registration failed:', result.message);
}

// Authenticate user with error handling
const authResult = NeonAuth.authenticateUser('john@example.com', 'SecurePass123');

if (authResult.success) {
    console.log('Login successful');
    window.location.href = 'mainpage.html';
} else if (authResult.userNotFound) {
    console.error('User not found. Please sign up.');
} else {
    console.error('Login failed:', authResult.message);
}
```

## Best Practices

1. ✅ Always check `isLoggedIn()` before accessing user data
2. ✅ Protect sensitive pages by redirecting unauthenticated users
3. ✅ Clear sensitive data on logout
4. ✅ Validate user input before storage
5. ✅ Use try-catch blocks around JSON operations
6. ✅ Check for null returns from getter methods
7. ✅ Log important user actions for debugging
8. ⚠️ Do NOT rely on localStorage for sensitive operations
9. ⚠️ Always use HTTPS in production
10. ⚠️ Hash passwords on the backend, not frontend

## Troubleshooting

### User Not Found After Login
- Check localStorage in DevTools
- Verify email is spelled correctly
- Check that user was actually saved on signup

### Password Doesn't Match
- Passwords are case-sensitive
- Ensure caps lock is off
- Verify correct email/password pair

### localStorage Quota Exceeded
- Clear old/test data
- Reduce number of stored users
- Implement data archiving

### User Data Not Updating
- Verify `updateCurrentUser()` returns true
- Check browser console for errors
- Ensure logged in before updating

---

**Need Help?** Check AUTHENTICATION.md for detailed documentation.
