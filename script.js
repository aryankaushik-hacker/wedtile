const API_URL = 'http://localhost:5000/api';
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await response.json();
            
            if (data.success) {
                alert('Registration successful!');
                window.location.href = 'login.html';
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Registration failed: ' + error.message);
        }
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            
            if (data.success) {
                localStorage.setItem('userLoggedIn', 'true');
                alert('Login successful!');
                window.location.href = 'index.html';
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    });
}
