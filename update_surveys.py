#!/usr/bin/env python3
import os
import re

os.chdir('c:\\Users\\Windows 11\\Neon clone')

# Read surveys.html
with open('surveys.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the script section
old_script = '''        <script>
            // Simple interactivity for the page
            document.addEventListener('DOMContentLoaded', function () {
                // Handle bid button clicks
                const bidButtons = document.querySelectorAll('.btn-primary');
                bidButtons.forEach(button => {
                    button.addEventListener('click', function (e) {
                        if (this.textContent === 'Place Bid') {
                            e.preventDefault();
                            const surveyTitle = this.closest('.survey-card').querySelector('h3').textContent;
                            alert(`Bid placed on "${surveyTitle}"! You will be notified when your bid is reviewed.`);
                            this.textContent = 'Bid Placed';
                            this.classList.remove('btn-primary');
                            this.classList.add('btn-secondary');
                            this.style.backgroundColor = '#28a745';
                            this.style.color = 'white';
                        }
                    });
                });

                // Handle search functionality
                const searchInput = document.querySelector('.search-box input');
                searchInput.addEventListener('keyup', function (e) {
                    if (e.key === 'Enter') {
                        alert(`Searching for: "${this.value}"`);
                    }
                });
            });
        </script>'''

new_script = '''        <script>
            // Check authentication
            const isLoggedIn = localStorage.getItem('neon_writers_logged_in') === 'true';
            if (!isLoggedIn) {
                window.location.href = 'index.html';
            }

            // Load user data
            const userData = JSON.parse(localStorage.getItem('neon_writers_user') || '{}');
            document.getElementById('userName').textContent = (userData.firstName || '') + ' ' + (userData.lastName || '');
            document.getElementById('userBalance').textContent = 'KES ' + (userData.balance || 0);

            // Logout functionality
            document.getElementById('logoutBtn').addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('neon_writers_logged_in');
                localStorage.removeItem('neon_writers_user');
                window.location.href = 'index.html';
            });

            // Simple interactivity for the page
            document.addEventListener('DOMContentLoaded', function () {
                // Handle bid button clicks
                const bidButtons = document.querySelectorAll('.btn-primary');
                bidButtons.forEach(button => {
                    button.addEventListener('click', function (e) {
                        if (this.textContent === 'Place Bid') {
                            e.preventDefault();
                            const surveyTitle = this.closest('.survey-card').querySelector('h3').textContent;
                            alert(`Bid placed on "${surveyTitle}"! You will be notified when your bid is reviewed.`);
                            this.textContent = 'Bid Placed';
                            this.classList.remove('btn-primary');
                            this.classList.add('btn-secondary');
                            this.style.backgroundColor = '#28a745';
                            this.style.color = 'white';
                        }
                    });
                });

                // Handle search functionality
                const searchInput = document.querySelector('.search-box input');
                searchInput.addEventListener('keyup', function (e) {
                    if (e.key === 'Enter') {
                        alert(`Searching for: "${this.value}"`);
                    }
                });
            });
        </script>'''

content = content.replace(old_script, new_script)

with open('surveys.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('surveys.html updated with auth checks and logout')
