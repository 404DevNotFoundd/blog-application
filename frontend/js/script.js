// script.js
document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = 'http://localhost:3000/api';

    // Handle Registration
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = registerForm.querySelector('input[type="text"]').value;
            const email = registerForm.querySelector('input[type="email"]').value;
            const password = registerForm.querySelector('input[type="password"]').value;

            try {
                const response = await fetch(`${BASE_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await response.json();
                
                alert(data.message);
                if (response.ok) window.location.href = 'login.html';
            } catch (error) {
                console.error('Registration Error:', error);
            }
        });
    }

    // Handle Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;

            try {
                const response = await fetch(`${BASE_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                
                alert(data.message);
                if (response.ok) window.location.href = 'dashboard.html';
            } catch (error) {
                console.error('Login Error:', error);
            }
        });
    }

    // Handle Create Blog
    const createBlogForm = document.getElementById('createBlogForm');
    if (createBlogForm) {
        createBlogForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = createBlogForm.querySelector('input[type="text"]').value;
            const imageUrl = createBlogForm.querySelector('input[type="url"]').value;
            const content = createBlogForm.querySelector('textarea').value;

            try {
                const response = await fetch(`${BASE_URL}/blogs`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, imageUrl, content })
                });
                const data = await response.json();
                
                alert(data.message);
                if (response.ok) window.location.href = 'dashboard.html';
            } catch (error) {
                console.error('Create Blog Error:', error);
            }
        });
    }
});