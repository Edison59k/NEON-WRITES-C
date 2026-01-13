document.addEventListener('DOMContentLoaded', function () {
    checkAdminAuth();
    loadPayments();

    // Set default date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
    document.getElementById('endDate').value = endDate.toISOString().split('T')[0];

    document.getElementById('logoutBtn').addEventListener('click', logout);
});

function checkAdminAuth() {
    const isLoggedIn = localStorage.getItem('neon_writers_logged_in') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    const userData = JSON.parse(localStorage.getItem('neon_writers_user') || '{}');
    const isAdmin = userData.email && (userData.email.includes('admin') || userData.isAdmin === true);

    if (!isAdmin) {
        alert('Access Denied: Admin privileges required');
        window.location.href = 'mainpage.html';
        return;
    }

    document.getElementById('userName').textContent = `Admin: ${userData.firstName || 'Administrator'}`;
}

function loadPayments() {
    const payments = JSON.parse(localStorage.getItem('neon_writers_payments') || '[]');

    // Do NOT generate demo payments - show empty state
    displayPayments(payments);
    updatePaymentStats(payments);
}

// REMOVED: generateDemoPayments() function - no demo data

function updatePaymentStats(payments) {
    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 0), 0);
    const pendingPayments = payments.filter(p => p.status === 'pending').length;
    const totalTransactions = payments.length;

    // Today's revenue
    const today = new Date().toDateString();
    const todayRevenue = payments
        .filter(p => {
            const paymentDate = p.date ? new Date(p.date).toDateString() : '';
            return paymentDate === today;
        })
        .reduce((sum, p) => sum + (p.amount || 0), 0);

    // This month's revenue
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const monthRevenue = payments
        .filter(p => {
            if (!p.date) return false;
            const d = new Date(p.date);
            return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
        })
        .reduce((sum, p) => sum + (p.amount || 0), 0);

    const avgTransaction = payments.length > 0 ? totalRevenue / payments.length : 0;

    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
    document.getElementById('totalPaid').textContent = `$${totalPaid.toFixed(2)}`;
    document.getElementById('pendingPayments').textContent = pendingPayments;
    document.getElementById('totalTransactions').textContent = totalTransactions;
    document.getElementById('todayRevenue').textContent = `$${todayRevenue.toFixed(2)}`;
    document.getElementById('monthRevenue').textContent = `$${monthRevenue.toFixed(2)}`;
    document.getElementById('avgTransaction').textContent = `$${avgTransaction.toFixed(2)}`;
}

function displayPayments(payments) {
    const tbody = document.getElementById('paymentsTableBody');

    if (payments.length === 0) {
        tbody.innerHTML = `
        <tr>
            <td colspan="8" style="text-align: center; padding: 40px; color: var(--muted-text);">
                <i class="fas fa-credit-card" style="font-size: 3rem; margin-bottom: 15px; display: block;"></i>
                <h3 style="margin-bottom: 10px; color: var(--muted-text);">No payment transactions yet</h3>
                <p style="color: var(--muted-text); font-size: 14px;">Payment transactions will appear here once users make payments</p>
            </td>
        </tr>
    `;
        return;
    }

    // Sort by date (newest first)
    payments.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    let html = '';
    payments.forEach(payment => {
        const date = payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A';
        const time = payment.date ? new Date(payment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

        html += `
        <tr>
            <td><strong>${payment.id || 'N/A'}</strong></td>
            <td>${payment.userName || 'Unknown User'}</td>
            <td>${payment.type || 'Unknown Type'}</td>
            <td>$${(payment.amount || 0).toFixed(2)}</td>
            <td><span class="payment-method">${payment.method || 'Unknown'}</span></td>
            <td>
                <div>${date}</div>
                <div style="font-size: 12px; color: var(--muted-text);">${time}</div>
            </td>
            <td><span class="payment-status status-${payment.status || 'pending'}">${(payment.status || 'pending').toUpperCase()}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view-btn" onclick="viewPayment('${payment.id || ''}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    ${payment.status === 'pending' ? `
                    <button class="action-btn approve-btn" onclick="markAsPaid('${payment.id || ''}')">
                        <i class="fas fa-check"></i> Mark Paid
                    </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `;
    });

    tbody.innerHTML = html;
}

function viewPayment(paymentId) {
    const payments = JSON.parse(localStorage.getItem('neon_writers_payments') || '[]');
    const payment = payments.find(p => p.id === paymentId);

    if (!payment) {
        alert('Payment not found');
        return;
    }

    alert('Payment details modal would open here:\n\n' +
        `Transaction ID: ${payment.id || 'N/A'}\n` +
        `Amount: $${(payment.amount || 0).toFixed(2)}\n` +
        `User: ${payment.userName || 'Unknown'}\n` +
        `Status: ${payment.status || 'pending'}`);
}

function markAsPaid(paymentId) {
    if (confirm('Mark this payment as paid?')) {
        let payments = JSON.parse(localStorage.getItem('neon_writers_payments') || '[]');
        payments = payments.map(p => {
            if (p.id === paymentId) {
                return { ...p, status: 'paid' };
            }
            return p;
        });

        localStorage.setItem('neon_writers_payments', JSON.stringify(payments));
        loadPayments();
        alert('Payment marked as paid!');
    }
}

function markAsFailed(paymentId) {
    if (confirm('Mark this payment as failed?')) {
        let payments = JSON.parse(localStorage.getItem('neon_writers_payments') || '[]');
        payments = payments.map(p => {
            if (p.id === paymentId) {
                return { ...p, status: 'failed' };
            }
            return p;
        });

        localStorage.setItem('neon_writers_payments', JSON.stringify(payments));
        loadPayments();
        alert('Payment marked as failed.');
    }
}

function applyDateFilter() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        alert('Start date cannot be after end date');
        return;
    }

    // Filter payments by date range
    const payments = JSON.parse(localStorage.getItem('neon_writers_payments') || '[]');
    const filteredPayments = payments.filter(payment => {
        if (!payment.date) return false;
        const paymentDate = new Date(payment.date);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();

        return paymentDate >= start && paymentDate <= end;
    });

    displayPayments(filteredPayments);
    updatePaymentStats(filteredPayments);
}

function exportPayments() {
    const payments = JSON.parse(localStorage.getItem('neon_writers_payments') || '[]');
    if (payments.length === 0) {
        alert('No payments to export');
        return;
    }
    alert('Exporting payments to CSV...');
}

function refreshPayments() {
    loadPayments();
}

function logout() {
    localStorage.removeItem('neon_writers_logged_in');
    window.location.href = 'index.html';
}