const API_URL = 'http://localhost:3000/api';
const TOKEN_KEY = 'gamePortalToken';
const CURRENT_USER_KEY = 'currentUser';

function showError(formId, message) {
    const form = document.getElementById(formId);
    let errorDiv = form.querySelector('.error-message');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        form.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
}

async function handleSignup(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showError('signupForm', 'Passwords do not match');
        return false;
    }
    
    try {
        const response = await fetch(${API_URL}/signup, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error during signup');
        }

        // Redirect to login page
        window.location.href = 'login.html';
    } catch (error) {
        showError('signupForm', error.message);
    }
    
    return false;
}

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(${API_URL}/login, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Invalid credentials');
        }

        // Store token and user data
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
        
        // Redirect to index page
        window.location.href = 'index.html';
    } catch (error) {
        showError('loginForm', error.message);
    }
    
    return false;
}

// Check authentication status
async function checkAuth() {
    const token = localStorage.getItem(TOKEN_KEY);
    const currentPath = window.location.pathname;
    
    // If on login/signup page and already logged in, redirect to index
    if ((currentPath.includes('login.html') || currentPath.includes('signup.html')) && token) {
        window.location.href = 'index.html';
        return;
    }
    
    // If on index page and not logged in, redirect to login
    if (currentPath.includes('index.html') && !token) {
        window.location.href = 'login.html';
        return;
    }

    // Verify token validity
    if (token) {
        try {
            const response = await fetch(${API_URL}/user, {
                headers: {
                    'Authorization': Bearer ${token}
                }
            });

            if (!response.ok) {
                throw new Error('Invalid token');
            }
        } catch (error) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(CURRENT_USER_KEY);
            window.location.href = 'login.html';
        }
    }
}

function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = 'login.html';
}

function updateWelcomeMessage() {
    const welcomeElement = document.getElementById('welcomeUser');
    if (welcomeElement) {
        const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
        if (currentUser) {
            welcomeElement.textContent = Welcome, ${currentUser.username}!;
        }
    }
}

// Run auth check when page loads
window.addEventListener('load', () => {
    checkAuth();
    updateWelcomeMessage();
});