# Setting Up Authentication on Your Pages

## Overview
This guide explains how to implement authentication protection on any page in the Neon Writers application.

## Step 1: Add Script Reference
Add this line to the `<head>` section of your HTML file:
```html
<script src="auth.js"></script>
```

## Step 2: Protect Page Access
Add this code at the beginning of your page's main `<script>` block:

### Option A: Simple Protection (Recommended)
```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!NeonAuth.isLoggedIn()) {
        alert('Please log in first to access this page.');
        window.location.href = 'index.html';
        return; // Stop execution
    }
    
    // Get current user
    const user = NeonAuth.getCurrentUser();
    console.log('Welcome,', user.firstName);
    
    // Rest of your page code here
});
```

### Option B: Silent Redirect (No Alert)
```javascript
document.addEventListener('DOMContentLoaded', function() {
    if (!NeonAuth.isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }
    
    const user = NeonAuth.getCurrentUser();
    // Initialize page
});
```

### Option C: Custom Message
```javascript
document.addEventListener('DOMContentLoaded', function() {
    if (!NeonAuth.isLoggedIn()) {
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>You need to be logged in to access this page.</h2>
                <p><a href="index.html">Go to Login Page</a></p>
            </div>
        `;
        return;
    }
    
    // Initialize page
});
```

## Step 3: Display User Information
Display logged-in user's information:

### Show User Name
```javascript
const user = NeonAuth.getCurrentUser();
document.getElementById('userName').textContent = user.firstName + ' ' + user.lastName;
```

### Show User Email
```javascript
const user = NeonAuth.getCurrentUser();
document.getElementById('userEmail').textContent = user.email;
```

### Show User Balance/Earnings
```javascript
const user = NeonAuth.getCurrentUser();
document.getElementById('balance').textContent = 'Ksh. ' + user.balance.toFixed(2);
document.getElementById('earnings').textContent = 'Ksh. ' + user.totalEarned.toFixed(2);
```

## Step 4: Update User Data
When user performs actions, update their data:

```javascript
function completeTask(taskId) {
    // Your task completion logic here
    
    // Update user data
    const user = NeonAuth.getCurrentUser();
    user.completedTasks = (user.completedTasks || 0) + 1;
    user.balance = (user.balance || 0) + 50; // Add earnings
    user.totalEarned = (user.totalEarned || 0) + 50;
    
    NeonAuth.updateCurrentUser({
        completedTasks: user.completedTasks,
        balance: user.balance,
        totalEarned: user.totalEarned
    });
    
    alert('Task completed! You earned Ksh. 50');
}
```

## Step 5: Add Logout Button
Add a logout button to your page:

### HTML
```html
<button id="logoutBtn" class="btn btn-danger">Logout</button>
```

### JavaScript
```javascript
document.getElementById('logoutBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
        NeonAuth.logout();
        window.location.href = 'index.html';
    }
});
```

## Example: Complete Protected Page

### mainpage.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: #f5f5f5;
        }
        .dashboard {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .user-card {
            background: #e8f4f8;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin: 20px 0;
        }
        .stat-card {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border-left: 4px solid #007bff;
        }
        .logout-btn {
            background: #dc3545;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            float: right;
        }
        .logout-btn:hover {
            background: #c82333;
        }
    </style>
    <script src="auth.js"></script>
</head>
<body>
    <div class="dashboard">
        <button class="logout-btn" id="logoutBtn">Logout</button>
        
        <h1>Dashboard</h1>
        
        <div class="user-card">
            <h2>Welcome, <span id="userName">Loading...</span>!</h2>
            <p>Email: <span id="userEmail">Loading...</span></p>
            <p>Member since: <span id="joinDate">Loading...</span></p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <h3 id="tasksCompleted">0</h3>
                <p>Tasks Completed</p>
            </div>
            <div class="stat-card">
                <h3 id="totalEarned">Ksh. 0</h3>
                <p>Total Earnings</p>
            </div>
            <div class="stat-card">
                <h3 id="currentBalance">Ksh. 0</h3>
                <p>Current Balance</p>
            </div>
        </div>
        
        <h3>Available Tasks</h3>
        <div id="tasksList">Loading tasks...</div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Protect page
            if (!NeonAuth.isLoggedIn()) {
                alert('Please log in to access the dashboard.');
                window.location.href = 'index.html';
                return;
            }

            // Get current user
            const user = NeonAuth.getCurrentUser();

            // Display user information
            document.getElementById('userName').textContent = user.firstName + ' ' + user.lastName;
            document.getElementById('userEmail').textContent = user.email;
            
            // Format join date
            const joinDate = new Date(user.joinedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            document.getElementById('joinDate').textContent = joinDate;

            // Display statistics
            document.getElementById('tasksCompleted').textContent = user.completedTasks || 0;
            document.getElementById('totalEarned').textContent = 'Ksh. ' + (user.totalEarned || 0).toFixed(2);
            document.getElementById('currentBalance').textContent = 'Ksh. ' + (user.balance || 0).toFixed(2);

            // Logout handler
            document.getElementById('logoutBtn').addEventListener('click', function() {
                if (confirm('Are you sure you want to logout?')) {
                    NeonAuth.logout();
                    window.location.href = 'index.html';
                }
            });

            // Load and display tasks
            loadTasks();
        });

        function loadTasks() {
            // Sample tasks - replace with your actual task loading logic
            const tasks = [
                { id: 1, title: 'Write a blog post', earning: 50, status: 'available' },
                { id: 2, title: 'Review content', earning: 30, status: 'available' },
                { id: 3, title: 'Create social media content', earning: 75, status: 'available' }
            ];

            const tasksList = document.getElementById('tasksList');
            tasksList.innerHTML = tasks.map(task => `
                <div style="
                    background: #f9f9f9;
                    padding: 15px;
                    margin: 10px 0;
                    border-radius: 4px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <div>
                        <h4>${task.title}</h4>
                        <p>Earning: Ksh. ${task.earning}</p>
                    </div>
                    <button onclick="acceptTask(${task.id})" class="btn-primary"
                        style="
                            background: #007bff;
                            color: white;
                            padding: 8px 16px;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                        ">
                        Accept Task
                    </button>
                </div>
            `).join('');
        }

        function acceptTask(taskId) {
            const user = NeonAuth.getCurrentUser();
            
            // Update user statistics
            const earning = 50; // Task earning amount
            NeonAuth.updateCurrentUser({
                balance: (user.balance || 0) + earning,
                totalEarned: (user.totalEarned || 0) + earning,
                completedTasks: (user.completedTasks || 0) + 1
            });

            // Reload page to show updated stats
            location.reload();
        }
    </script>
</body>
</html>
```

## Example: Apply to profile.html

```javascript
<script src="auth.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Protect page
        if (!NeonAuth.isLoggedIn()) {
            window.location.href = 'index.html';
            return;
        }

        const user = NeonAuth.getCurrentUser();

        // Populate profile form
        document.getElementById('firstName').value = user.firstName;
        document.getElementById('lastName').value = user.lastName;
        document.getElementById('email').value = user.email;
        document.getElementById('phone').value = user.phone;

        // Handle profile update
        document.getElementById('updateProfileBtn').addEventListener('click', function() {
            const updatedData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                phone: document.getElementById('phone').value
            };

            const success = NeonAuth.updateCurrentUser(updatedData);
            if (success) {
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile');
            }
        });
    });
</script>
```

## Files That Should Include auth.js

- ✅ index.html (already included in signup/login)
- ✅ mainpage.html (dashboard)
- ✅ profile.html (user profile)
- ✅ assigned-tasks.html (task management)
- ✅ completed.html (completed tasks)
- ✅ payments.html (payment history)
- ✅ subscription.html (subscription management)
- ✅ admin-payments.html (admin panel)
- ✅ admin-users.html (admin panel)

## Testing Your Protected Page

1. **Without Login**:
   - Try accessing the page directly (you should be redirected)

2. **With Login**:
   - Go to index.html
   - Sign up or log in
   - Try accessing the page (should work)
   - Check console for user data

3. **Logout Test**:
   - Click logout button
   - Try accessing page again (should redirect)

## Debugging Tips

```javascript
// Check login status
console.log('Logged in:', NeonAuth.isLoggedIn());

// Check current user
console.log('Current user:', NeonAuth.getCurrentUser());

// Check all users
console.log('All users:', NeonAuth.getAllUsers());

// Check localStorage
console.log('localStorage:', localStorage);

// Clear data for testing
NeonAuth.clearAllData();
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| User redirected to login on every load | Check that `auth.js` is loaded before your code runs |
| User data not updating | Verify `NeonAuth.updateCurrentUser()` returns true |
| Multiple users not saved | Check that you're using `getAllUsers()` and `neon_writers_all_users` key |
| localStorage full | Clear test data or implement data cleanup |

---

For more information, see [AUTHENTICATION.md](AUTHENTICATION.md) and [AUTH_QUICK_REFERENCE.md](AUTH_QUICK_REFERENCE.md)
