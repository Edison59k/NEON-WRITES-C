# Neon Writers - System Flow & Navigation Map

## Overview
Complete navigation and authentication system flow for all pages.

---

## 🏠 Page Structure

### 1. **index.html** (Home/Landing Page)
   - **Purpose**: Landing page with feature overview
   - **Visibility**: All users (logged in or out)
   - **Navigation**:
     - Logo → index.html
     - Home → index.html
     - About → about.html
     - Features → #features (anchor)
     - How It Works → #how-it-works (anchor)
   - **Auth Buttons**:
     - Not Logged In: Log In | Sign Up (both trigger login/signup prompts)
     - Logged In: Dashboard | My Profile
   - **Redirects to**:
     - mainpage.html (Dashboard - logged-in users)
     - about.html
   - **Footer Links**:
     - Quick Links: Home, About, Features, How It Works
     - Account: Sign Up, Log In, Dashboard, Profile
     - Contact & Support

---

### 2. **about.html** (About Page)
   - **Purpose**: Company information and team
   - **Visibility**: All users
   - **Navigation**:
     - Logo → index.html
     - Home → index.html
     - About → about.html (current)
     - Features → index.html#features
     - How It Works → index.html#how-it-works
   - **Auth Buttons**:
     - Not Logged In: Log In | Sign Up
     - Logged In: Dashboard (single button)
   - **Footer Links**:
     - Quick Links: Home, About, Features, How It Works
     - Account: Sign Up, Log In, Dashboard, Profile
     - Contact & Support

---

### 3. **mainpage.html** (Dashboard - Protected Page)
   - **Purpose**: User dashboard after login
   - **Visibility**: Logged-in users only
   - **Access Control**: 
     - Checks localStorage for `neon_writers_logged_in === 'true'`
     - Redirects to index.html if not logged in
   - **Topbar**:
     - Logo (clickable) → index.html
     - User Info: Name & Balance display
     - Logout Button → index.html (clears auth)
   - **Sidebar Menu**:
     - Dashboard (active) → mainpage.html
     - My Profile → profile.html
     - Surveys & Tasks → surveys.html
     - Payments → payments.html
     - My Bids → my-bids.html
     - Assigned Tasks → assigned-tasks.html
     - Completed → completed.html
     - Support → support.html
   - **Features**:
     - Welcome message with user's first name
     - Stats cards (Balance, Tasks, Earnings, Success Rate)
     - Recent Activity feed
     - Toast notifications

---

### 4. **profile.html** (User Profile - Protected Page)
   - **Purpose**: User profile viewing and editing
   - **Visibility**: Logged-in users only
   - **Access Control**:
     - Checks localStorage for `neon_writers_logged_in === 'true'`
     - Redirects to index.html if not logged in
   - **Topbar**:
     - Logo (clickable) → mainpage.html
     - User Info: Name & Balance display
     - Logout Button → index.html (clears auth)
   - **Sidebar Menu**: 
     - Dashboard → mainpage.html
     - My Profile (active) → profile.html
     - [Other menu items as in mainpage]
   - **Features**:
     - Profile header with stats (Rating, Tasks, Earnings)
     - Editable form fields:
       - First Name, Last Name
       - Email, Phone
       - Writer Type (dropdown)
       - Experience Level (dropdown)
       - Bio/Description
     - Save button - updates localStorage
     - Form pre-fills with saved data

---

### 5. **about.html** (Duplicate navigation entry - see above)

---

## 🔐 Authentication Flow

### Login Flow
```
index.html (Sign Up button clicked)
  ↓
showSignupPrompt() triggers
  ↓
User enters: First Name, Last Name, Email, Phone
  ↓
Data saved to localStorage:
  - neon_writers_user (JSON)
  - neon_writers_logged_in = 'true'
  ↓
Redirect to mainpage.html
```

### Logout Flow
```
mainpage.html or profile.html (Logout clicked)
  ↓
localStorage cleared:
  - neon_writers_logged_in removed
  - neon_writers_user removed
  ↓
Toast notification: "Logged out successfully"
  ↓
Redirect to index.html (after 1500ms)
```

---

## 📊 Data Storage (localStorage)

### User Data Structure
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+254 700 000 000",
  "writerType": "academic",
  "experience": "intermediate",
  "bio": "Experienced writer...",
  "balance": 500,
  "totalEarned": 2500,
  "completedTasks": 5,
  "rating": 4.5
}
```

### Auth Token
```
neon_writers_logged_in: "true" | (not set if logged out)
```

---

## 🔗 Complete Navigation Map

```
INDEX.HTML (Landing Page)
├── Navbar
│   ├── Logo → index.html
│   ├── Home → index.html
│   ├── About → about.html
│   ├── Features → #features
│   ├── How It Works → #how-it-works
│   ├── Log In → showLoginPrompt()
│   └── Sign Up → showSignupPrompt()
├── Footer
│   ├── Quick Links (4 items)
│   ├── Account (4 items)
│   └── Contact & Support (4 items)
└── CTA Buttons
    ├── Start Earning → showSignupPrompt()
    └── How It Works → #how-it-works

ABOUT.HTML (About Page)
├── Navbar
│   ├── Logo → index.html
│   ├── Home → index.html
│   ├── About → about.html
│   ├── Features → index.html#features
│   ├── How It Works → index.html#how-it-works
│   ├── Log In → index.html
│   └── Sign Up → index.html
├── Content
│   ├── Our Story
│   ├── Our Mission
│   └── Team Grid (3 members)
└── Footer
    ├── Quick Links (4 items)
    ├── Account (4 items)
    └── Contact & Support (4 items)

MAINPAGE.HTML (Dashboard - Protected)
├── Topbar
│   ├── Logo → index.html
│   ├── User Name & Balance
│   └── Logout → index.html
├── Sidebar
│   ├── Dashboard (active)
│   ├── My Profile → profile.html
│   ├── Surveys & Tasks → surveys.html (placeholder)
│   ├── Payments → payments.html (placeholder)
│   ├── My Bids → my-bids.html (placeholder)
│   ├── Assigned Tasks → assigned-tasks.html (placeholder)
│   ├── Completed → completed.html (placeholder)
│   └── Support → support.html (placeholder)
└── Main Content
    ├── Welcome Section
    ├── Stats Cards (4)
    ├── Quick Actions
    └── Recent Activity

PROFILE.HTML (User Profile - Protected)
├── Topbar
│   ├── Logo → mainpage.html
│   ├── User Name & Balance
│   └── Logout → index.html
├── Sidebar
│   ├── Dashboard → mainpage.html
│   ├── My Profile (active)
│   ├── [Other menu items]
│   └── Support → support.html
└── Main Content
    ├── Profile Header (Avatar, Stats)
    ├── Edit Profile Form
    │   ├── First Name input
    │   ├── Last Name input
    │   ├── Email input
    │   ├── Phone input
    │   ├── Writer Type select
    │   ├── Experience Level select
    │   ├── Bio textarea
    │   └── Save button
    └── Form auto-saves to localStorage
```

---

## ✅ System Flow Checklist

- [x] Home page (index.html) fully functional
- [x] About page (about.html) fully functional
- [x] Dashboard (mainpage.html) with auth protection
- [x] Profile page (profile.html) with auth protection
- [x] Login/Signup prompts on index.html
- [x] Profile edit and save functionality
- [x] Logout functionality on all protected pages
- [x] Consistent navbar/topbar navigation
- [x] Sidebar menu on all dashboard pages
- [x] Footer links on all public pages
- [x] localStorage-based authentication
- [x] Redirect unauthenticated users to home

---

## 📋 Placeholder Pages (Not Yet Created)

The following pages are linked but don't exist yet. Create these to complete the system:

1. **surveys.html** - Surveys & Tasks page
2. **payments.html** - Payments & Withdrawal page
3. **my-bids.html** - User's Bids page
4. **assigned-tasks.html** - Assigned Tasks page
5. **completed.html** - Completed Tasks page
6. **support.html** - Support & Help page

Each should follow the same template as mainpage.html and profile.html:
- Topbar with logo, user info, logout
- Sidebar menu with all navigation items
- Main content area
- Auth protection checks

---

## 🎯 User Journey Examples

### New User Journey
```
1. Land on index.html
2. Click "Start Earning Now" or "Sign Up"
3. Enter credentials (First Name, Last Name, Email, Phone)
4. System stores data in localStorage
5. Redirect to mainpage.html
6. View dashboard with welcome message
7. Click "My Profile" in sidebar
8. Edit and save profile information
9. Click "Logout" to return to index.html
```

### Returning User Journey
```
1. Land on index.html
2. Auth buttons show "Dashboard" and "My Profile"
3. Click "Dashboard"
4. View mainpage.html with saved data
5. Access any dashboard page via sidebar
6. Logout returns to index.html
```

---

## 🔒 Security Notes

- Uses localStorage (demo only - not recommended for production)
- No server-side validation
- No password encryption
- Consider implementing:
  - Backend API authentication
  - JWT tokens
  - Password hashing
  - Session management
  - HTTPS requirements

---

**Last Updated**: December 23, 2025
**Status**: Complete navigation system with 4 functional pages
