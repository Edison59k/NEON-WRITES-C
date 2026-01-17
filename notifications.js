/**
 * Neon Writers Email Notification System
 * Provides notification functionality across all pages
 */

const EmailNotificationSystem = {
    /**
     * Get all user emails from localStorage
     */
    getUserEmails: function () {
        try {
            return JSON.parse(localStorage.getItem('neon_writers_user_emails') || '[]');
        } catch (e) {
            console.error('Error loading emails:', e);
            return [];
        }
    },

    /**
     * Save user emails to localStorage
     */
    saveUserEmails: function (emails) {
        localStorage.setItem('neon_writers_user_emails', JSON.stringify(emails));
    },

    /**
     * Add a new email notification
     */
    addEmail: function (sender, subject, message) {
        const emails = this.getUserEmails();
        emails.unshift({
            id: Date.now(),
            sender: sender,
            subject: subject,
            message: message,
            timestamp: new Date().toLocaleString(),
            read: false
        });
        this.saveUserEmails(emails);
        return emails;
    },

    /**
     * Get count of unread emails
     */
    getUnreadCount: function () {
        return this.getUserEmails().filter(e => !e.read).length;
    },

    /**
     * Mark email as read
     */
    markAsRead: function (emailId) {
        const emails = this.getUserEmails();
        const email = emails.find(e => e.id === emailId);
        if (email) {
            email.read = true;
            this.saveUserEmails(emails);
        }
    },

    /**
     * Initialize notification bell for a page
     */
    initializeNotificationBell: function () {
        const bell = document.getElementById('notificationBell');
        if (!bell) return;

        bell.addEventListener('click', this.toggleNotifications.bind(this));

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('notificationsModal');
            if (!modal) return;
            if (!modal.contains(e.target) && !bell.contains(e.target)) {
                this.closeNotifications();
            }
        });

        this.updateBadge();
    },

    /**
     * Update notification badge count
     */
    updateBadge: function () {
        const badge = document.getElementById('emailNotificationBadge');
        if (!badge) return;

        const unreadCount = this.getUnreadCount();
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    },

    /**
     * Toggle notifications modal
     */
    toggleNotifications: function () {
        const modal = document.getElementById('notificationsModal');
        if (!modal) return;

        modal.style.display = modal.style.display === 'none' || modal.style.display === '' ? 'block' : 'none';
        if (modal.style.display === 'block') {
            this.loadNotifications();
        }
    },

    /**
     * Close notifications modal
     */
    closeNotifications: function () {
        const modal = document.getElementById('notificationsModal');
        if (modal) {
            modal.style.display = 'none';
        }
    },

    /**
     * Load and display notifications
     */
    loadNotifications: function () {
        const emails = this.getUserEmails();
        const list = document.getElementById('notificationsList');
        const empty = document.getElementById('emptyNotifications');

        if (!list || !empty) return;

        if (emails.length === 0) {
            list.innerHTML = '';
            empty.style.display = 'block';
            return;
        }

        empty.style.display = 'none';
        list.innerHTML = emails.map(email => `
            <li class="notification-item ${email.read ? '' : 'unread'}" onclick="EmailNotificationSystem.viewEmail(${email.id})">
                <div class="notification-sender">${email.sender}</div>
                <div class="notification-subject">${email.subject}</div>
                <div class="notification-time">${email.timestamp}</div>
            </li>
        `).join('');
    },

    /**
     * View a specific email notification
     */
    viewEmail: function (emailId) {
        this.markAsRead(emailId);
        const emails = this.getUserEmails();
        const email = emails.find(e => e.id === emailId);

        if (email) {
            alert(`From: ${email.sender}\nSubject: ${email.subject}\nTime: ${email.timestamp}\n\n${email.message}`);
            this.updateBadge();
            this.loadNotifications();
        }
    }
};

/**
 * Initialize user data on page load
 */
function initializeUserData() {
    const userData = JSON.parse(localStorage.getItem('neon_writers_user') || '{}');
    const isLoggedIn = localStorage.getItem('neon_writers_logged_in') === 'true';

    if (!isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }

    // Update user name and role in topbar
    updateUserDisplayName(userData);
    updateUserAvatar(userData);

    // Initialize notifications
    EmailNotificationSystem.initializeNotificationBell();

    return userData;
}

/**
 * Update display user name
 */
function updateUserDisplayName(userData) {
    const firstName = userData.firstName || 'User';
    const lastName = userData.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();

    const nameElement = document.getElementById('displayUserName');
    if (nameElement) {
        nameElement.textContent = fullName;
    }

    // Update role
    const userRole = userData.userType === 'admin' ? 'Administrator' : 'Survey Contributor';
    const roleElement = document.getElementById('userRole');
    if (roleElement) {
        roleElement.textContent = userRole;
    }
}

/**
 * Update user avatar with initials
 */
function updateUserAvatar(userData) {
    const firstName = userData.firstName || 'U';
    const lastName = userData.lastName || 'S';
    const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();

    const avatar = document.getElementById('userAvatarInitials');
    if (avatar) {
        avatar.textContent = initials;
    }
}
