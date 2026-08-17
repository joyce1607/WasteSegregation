/**
 * EcoSort - Authentication Logic
 * Uses LocalStorage to simulate backend authentication.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Default mock demo user
    const DEMO_USER = {
        id: 'demo-user-123',
        fullName: 'Demo User',
        email: 'demo@ecosort.com',
        password: 'password123',
        houseNo: 'A-402, Green Valley',
        area: 'Central',
        ecoPoints: 8450,
        wasteSorted: 326,
        ecoScore: 92,
        currentRank: 7,
        ecoStreak: 12,
        wasteReduced: 18,
        level: 'Green Champion'
    };

    // Initialize mock database if not exists
    if (!localStorage.getItem('ecosort_users')) {
        localStorage.setItem('ecosort_users', JSON.stringify([DEMO_USER]));
    }

    // --- Login Form ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const loginType = document.getElementById('loginType') ? document.getElementById('loginType').value : 'citizen';
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const errorEl = document.getElementById('loginError');
            
            if (loginType === 'municipal') {
                if (email === 'admin@municipal.gov' && password === 'admin123') {
                    localStorage.setItem('municipalLoggedIn', 'true');
                    window.location.href = 'municipal-dashboard.html';
                } else {
                    errorEl.textContent = 'Invalid credentials for Municipal Staff.';
                    errorEl.style.display = 'block';
                }
                return;
            }
            
            if (!email || !password) {
                errorEl.textContent = 'Please fill in all fields.';
                errorEl.style.display = 'block';
                return;
            }

            const users = JSON.parse(localStorage.getItem('ecosort_users')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Login success
                localStorage.setItem('ecosort_current_user', JSON.stringify(user));
                window.location.href = 'dashboard.html';
            } else {
                errorEl.textContent = 'Invalid email or password.';
                errorEl.style.display = 'block';
            }
        });

        // Guest Login
        const guestBtn = document.getElementById('guestBtn');
        if (guestBtn) {
            guestBtn.addEventListener('click', () => {
                localStorage.setItem('ecosort_current_user', JSON.stringify(DEMO_USER));
                window.location.href = 'dashboard.html';
            });
        }
    }

    // --- Register Form ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value.trim();
            const houseNo = document.getElementById('houseNo').value.trim();
            const area = document.getElementById('area').value;
            const errorEl = document.getElementById('registerError');
            
            if (password !== confirmPassword) {
                errorEl.textContent = 'Passwords do not match.';
                errorEl.style.display = 'block';
                return;
            }

            if (password.length < 6) {
                errorEl.textContent = 'Password must be at least 6 characters.';
                errorEl.style.display = 'block';
                return;
            }

            const users = JSON.parse(localStorage.getItem('ecosort_users')) || [];
            
            if (users.find(u => u.email === email)) {
                errorEl.textContent = 'Email is already registered.';
                errorEl.style.display = 'block';
                return;
            }

            // Create new user object
            const newUser = {
                id: 'user-' + Date.now(),
                fullName,
                email,
                password,
                houseNo,
                area,
                ecoPoints: 0,
                wasteSorted: 0,
                ecoScore: 50,
                currentRank: 0,
                ecoStreak: 0,
                wasteReduced: 0,
                level: '🌱 Eco Beginner'
            };

            users.push(newUser);
            localStorage.setItem('ecosort_users', JSON.stringify(users));
            
            // Auto login
            localStorage.setItem('ecosort_current_user', JSON.stringify(newUser));
            
            // Welcome alert (simulated)
            alert('Welcome to EcoSort! Your journey toward a cleaner environment starts today.');
            
            window.location.href = 'dashboard.html';
        });
    }

});

// Helper function to check auth (used on protected pages)
function checkAuth() {
    const currentUser = localStorage.getItem('ecosort_current_user');
    if (!currentUser) {
        window.location.href = 'login.html';
    }
    return JSON.parse(currentUser);
}

function logout() {
    localStorage.removeItem('ecosort_current_user');
    window.location.href = 'login.html';
}
