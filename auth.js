/**
 * Neon Writers Authentication Utility
 * Provides helper functions for authentication and user management
 */

const NeonAuth = {
    /**
     * Check if user is logged in
     * @returns {boolean} True if user is logged in
     */
    isLoggedIn: function () {
        return localStorage.getItem('neon_writers_logged_in') === 'true';
    },

    /**
     * Get current logged-in user
     * @returns {Object|null} Current user object or null if not logged in
     */
    getCurrentUser: function () {
        if (!this.isLoggedIn()) {
            return null;
        }
        try {
            return JSON.parse(localStorage.getItem('neon_writers_current_user') || '{}');
        } catch (e) {
            console.error('Error parsing current user:', e);
            return null;
        }
    },

    /**
     * Get all registered users
     * @returns {Array} Array of all registered users
     */
    getAllUsers: function () {
        try {
            return JSON.parse(localStorage.getItem('neon_writers_all_users') || '[]');
        } catch (e) {
            console.error('Error parsing all users:', e);
            return [];
        }
    },

    /**
     * Find user by email
     * @param {string} email - User's email address
     * @returns {Object|null} User object or null if not found
     */
    findUserByEmail: function (email) {
        const users = this.getAllUsers();
        return users.find(user => user.email === email) || null;
    },

    /**
     * Find user by ID
     * @param {number} userId - User's ID
     * @returns {Object|null} User object or null if not found
     */
    findUserById: function (userId) {
        const users = this.getAllUsers();
        return users.find(user => user.id === userId) || null;
    },

    /**
     * Update current user data
     * @param {Object} userData - Updated user data
     * @returns {boolean} True if successful
     */
    updateCurrentUser: function (userData) {
        if (!this.isLoggedIn()) {
            console.error('No user logged in');
            return false;
        }

        try {
            const updatedUser = { ...this.getCurrentUser(), ...userData };
            localStorage.setItem('neon_writers_current_user', JSON.stringify(updatedUser));
            localStorage.setItem('neon_writers_user', JSON.stringify(updatedUser));

            // Update in all users list
            const allUsers = this.getAllUsers();
            const userIndex = allUsers.findIndex(u => u.email === updatedUser.email);
            if (userIndex !== -1) {
                allUsers[userIndex] = updatedUser;
                localStorage.setItem('neon_writers_all_users', JSON.stringify(allUsers));
            }

            return true;
        } catch (e) {
            console.error('Error updating user:', e);
            return false;
        }
    },

    /**
     * Logout current user
     * @returns {void}
     */
    logout: function () {
        localStorage.setItem('neon_writers_logged_in', 'false');
        localStorage.removeItem('neon_writers_current_user');
        // Keep 'neon_writers_all_users' for future logins
    },

    /**
     * Check if email exists in registered users
     * @param {string} email - Email to check
     * @returns {boolean} True if email exists
     */
    emailExists: function (email) {
        return this.findUserByEmail(email) !== null;
    },

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} True if email is valid
     */
    validateEmail: function (email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {Object} Validation result with details
     */
    validatePassword: function (password) {
        const result = {
            valid: password.length >= 8,
            minLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumbers: /[0-9]/.test(password),
            hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };
        return result;
    },

    /**
     * Validate Kenyan phone number
     * @param {string} phone - Phone number to validate
     * @returns {Object} Validation result with formatted number
     */
    validatePhone: function (phone) {
        const cleaned = phone.replace(/\D/g, '');

        // Check if it's 10 digits (without 254) and starts with 07
        if (cleaned.length === 10 && cleaned.startsWith('07')) {
            return { valid: true, formatted: cleaned };
        }

        // Check if it's 13 digits (with 254) and starts with 2547
        if (cleaned.length === 13 && cleaned.startsWith('2547')) {
            return { valid: true, formatted: cleaned };
        }

        return { valid: false, formatted: null };
    },

    /**
     * Register new user
     * @param {Object} userData - User data (firstName, lastName, email, phone, password, etc.)
     * @returns {Object} Result object with success status and message
     */
    registerUser: function (userData) {
        // Validate required fields
        if (!userData.email || !userData.password) {
            return { success: false, message: 'Email and password are required' };
        }

        // Check if email already exists
        if (this.emailExists(userData.email)) {
            return { success: false, message: 'Email already registered' };
        }

        // Validate email format
        if (!this.validateEmail(userData.email)) {
            return { success: false, message: 'Invalid email format' };
        }

        // Validate password
        if (!this.validatePassword(userData.password).valid) {
            return { success: false, message: 'Password must be at least 8 characters' };
        }

        try {
            // Create user object with defaults
            const newUser = {
                id: Date.now(),
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email,
                phone: userData.phone || '',
                password: userData.password,
                balance: userData.balance || 0,
                totalEarned: userData.totalEarned || 0,
                completedTasks: userData.completedTasks || 0,
                rating: userData.rating || 0.0,
                joinedDate: userData.joinedDate || new Date().toISOString(),
                subscribed: userData.subscribed !== false,
                paymentMade: userData.paymentMade !== false,
                paymentDate: userData.paymentDate || new Date().toISOString()
            };

            // Add to all users list
            const allUsers = this.getAllUsers();
            allUsers.push(newUser);
            localStorage.setItem('neon_writers_all_users', JSON.stringify(allUsers));

            // Set as logged in
            localStorage.setItem('neon_writers_current_user', JSON.stringify(newUser));
            localStorage.setItem('neon_writers_logged_in', 'true');
            localStorage.setItem('neon_writers_user', JSON.stringify(newUser));

            return { success: true, message: 'User registered successfully', user: newUser };
        } catch (e) {
            console.error('Error registering user:', e);
            return { success: false, message: 'An error occurred during registration' };
        }
    },

    /**
     * Authenticate user with email and password
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @returns {Object} Result object with success status and user data
     */
    authenticateUser: function (email, password) {
        // Validate inputs
        if (!email || !password) {
            return { success: false, message: 'Email and password are required' };
        }

        // Find user
        const user = this.findUserByEmail(email);
        if (!user) {
            return { success: false, message: 'User not found', userNotFound: true };
        }

        // Check password
        if (user.password !== password) {
            return { success: false, message: 'Incorrect password' };
        }

        // Update last login and set as logged in
        user.lastLoginDate = new Date().toISOString();
        localStorage.setItem('neon_writers_current_user', JSON.stringify(user));
        localStorage.setItem('neon_writers_logged_in', 'true');
        localStorage.setItem('neon_writers_user', JSON.stringify(user));

        // Update in all users list
        const allUsers = this.getAllUsers();
        const userIndex = allUsers.findIndex(u => u.email === email);
        if (userIndex !== -1) {
            allUsers[userIndex] = user;
            localStorage.setItem('neon_writers_all_users', JSON.stringify(allUsers));
        }

        return { success: true, message: 'Login successful', user: user };
    },

    /**
     * Get user statistics
     * @returns {Object} Statistics about registered users
     */
    getStatistics: function () {
        const users = this.getAllUsers();
        const totalEarnings = users.reduce((sum, user) => sum + (user.totalEarned || 0), 0);
        const totalTasks = users.reduce((sum, user) => sum + (user.completedTasks || 0), 0);

        return {
            totalUsers: users.length,
            totalEarnings: totalEarnings,
            totalTasksCompleted: totalTasks,
            averageEarningsPerUser: users.length > 0 ? totalEarnings / users.length : 0,
            averageRating: users.length > 0 ? users.reduce((sum, user) => sum + user.rating, 0) / users.length : 0
        };
    },

    /**
     * Export user data as JSON
     * @returns {string} JSON string of all users
     */
    exportData: function () {
        return JSON.stringify(this.getAllUsers(), null, 2);
    },

    /**
     * Import user data from JSON (overwrites existing)
     * @param {string} jsonData - JSON string of users
     * @returns {Object} Result of import operation
     */
    importData: function (jsonData) {
        try {
            const users = JSON.parse(jsonData);
            if (!Array.isArray(users)) {
                return { success: false, message: 'Invalid data format' };
            }
            localStorage.setItem('neon_writers_all_users', JSON.stringify(users));
            return { success: true, message: `Imported ${users.length} users` };
        } catch (e) {
            return { success: false, message: 'Error parsing JSON data' };
        }
    },

    /**
     * Clear all authentication data
     * @returns {void}
     */
    clearAllData: function () {
        localStorage.removeItem('neon_writers_logged_in');
        localStorage.removeItem('neon_writers_current_user');
        localStorage.removeItem('neon_writers_all_users');
        localStorage.removeItem('neon_writers_user');
        localStorage.removeItem('neon_writers_users');
        console.log('All authentication data cleared');
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NeonAuth;
}
