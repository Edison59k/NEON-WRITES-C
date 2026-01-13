// Validation helpers and small UI initialization for the Neon clone


const binanceId =  process.env.BINANCE_ID || 'default_binance_id';
console.log(binanceId);
(function () {
    function isEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isPhone(phone) {
        return /^\+?[0-9\s\-()]{7,20}$/.test(phone);
    }

    function showError(el, msg) {
        alert(msg);
        el.focus && el.focus();
    }

    function validateForm(form) {
        const inputs = form.querySelectorAll('[data-required]');
        for (const input of inputs) {
            const val = (input.value || '').trim();
            if (!val) {
                showError(input, input.getAttribute('data-required') || 'Please complete this field');
                return false;
            }
            const type = input.getAttribute('data-validate');
            if (type === 'email' && !isEmail(val)) {
                showError(input, 'Please enter a valid email address');
                return false;
            }
            if (type === 'phone' && !isPhone(val)) {
                showError(input, 'Please enter a valid phone number');
                return false;
            }
        }
        return true;
    }

    document.addEventListener('DOMContentLoaded', function () {
        // Attach generic form validation to any form that has `data-validate="true"`
        document.querySelectorAll('form[data-validate="true"]').forEach(function (form) {
            form.addEventListener('submit', function (e) {
                if (!validateForm(form)) {
                    e.preventDefault();
                }
            });
        });

        // Clear all bids on My Bids page by replacing .bids-grid content with an empty state
        const bidsGrid = document.querySelector('.bids-grid');
        if (bidsGrid) {
            bidsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-gavel"></i>
                    <h3>No Bids Found</h3>
                    <p>You have no active bids right now. Browse available surveys to start earning.</p>
                    <a href="surveys.html" class="btn btn-primary" style="margin-top: 15px;">Browse Surveys</a>
                </div>
            `;
        }

        // Clear recent activity on dashboard (mainpage)
        const activityList = document.querySelector('.activity-list');
        if (activityList) {
            activityList.innerHTML = `
                <div class="empty-state" style="padding:20px; text-align:center;">
                    <i class="fas fa-history"></i>
                    <h3>No Recent Activity</h3>
                    <p>Your activity feed is empty. Complete tasks to see updates here.</p>
                </div>
            `;
        }

        // Provide simple hooks for pages that render balances/stats so they default to zero
        try {
            const userData = JSON.parse(localStorage.getItem('neon_writers_user') || '{}');
            const balance = parseFloat(userData.balance) || 0;
            const total = parseFloat(userData.totalEarned) || 0;

            document.querySelectorAll('.user-balance').forEach(el => {
                // Some pages show KES, others show $; try to preserve existing text format
                if ((el.textContent || '').trim().startsWith('KES')) {
                    el.textContent = `KES ${balance.toLocaleString()}`;
                } else {
                    el.textContent = `$${balance.toFixed(2)}`;
                }
            });

            const totalElems = document.querySelectorAll('#totalEarnedDisplay, #totalEarnedAmount, .stat-value, .bar-value');
            totalElems.forEach(el => {
                if (el.id === 'totalEarnedDisplay' || el.id === 'totalEarnedAmount') {
                    el.textContent = `$${total.toFixed(2)}`;
                } else if (el.classList.contains('stat-value') || el.classList.contains('bar-value')) {
                    // only replace numeric-looking stat values if they contain $ or digits
                    const txt = (el.textContent || '').trim();
                    if (/\$|\d/.test(txt)) el.textContent = `$0`;
                }
            });
        } catch (err) {
            // ignore parsing errors
            alert('Error loading user data: ' + err.message);
        }
    });
})();
