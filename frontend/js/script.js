const API_BASE = 'https://devblog-backend-i8cj.onrender.com/api';

// --- AUTHENTICATION FUNCTIONS ---

// 1. REGISTER
async function handleRegister(username, email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Registration successful! Please log in.');
      window.location.href = 'login.html';
    } else {
      alert(`Registration Failed: ${data.error}`);
    }
  } catch (err) {
    console.error('Register error:', err);
  }
}

// 2. LOGIN (Saves JWT token & User object)
async function handleLogin(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('Login successful!');
      window.location.href = 'dashboard.html';
    } else {
      alert(`Login Failed: ${data.error}`);
    }
  } catch (err) {
    console.error('Login error:', err);
  }
}

// 3. LOGOUT
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  alert('Logged out successfully.');
  window.location.href = 'login.html';
}

// --- PUBLIC BLOG & FILTERING FUNCTIONS ---

// 4. FETCH ALL PUBLIC BLOGS (With Search & Category)
async function fetchBlogs() {
  const search = document.getElementById('searchInput')?.value || '';
  const category = document.getElementById('categorySelect')?.value || 'All';

  try {
    const res = await fetch(`${API_BASE}/blogs?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`);
    const blogs = await res.json();
    renderBlogs(blogs);
  } catch (err) {
    console.error('Error fetching blogs:', err);
  }
}

function handleFilterChange() {
  fetchBlogs();
}

function renderBlogs(blogs) {
  const container = document.getElementById('blogContainer');
  if (!container) return;

  if (blogs.length === 0) {
    container.innerHTML = '<p>No blogs found.</p>';
    return;
  }

  container.innerHTML = blogs.map(blog => `
    <div class="card" style="border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin-bottom: 16px; background: white;">
      <span style="background: #f3e8ff; color: #6b21a8; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${blog.category || 'General'}</span>
      <h3 style="margin: 10px 0 5px 0;">${blog.title}</h3>
      <p style="color: #666; font-size: 14px;">By ${blog.author}</p>
      <p>${blog.content.substring(0, 100)}...</p>
    </div>
  `).join('');
}

// --- PROTECTED BLOG CRUD OPERATIONS (REQUIRES JWT) ---

// 5. CREATE BLOG
async function createBlog(blogData) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in first.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(blogData)
    });

    if (res.ok) {
      alert('Blog created successfully!');
      window.location.href = 'dashboard.html';
    } else {
      const error = await res.json();
      alert(`Error: ${error.error}`);
    }
  } catch (err) {
    console.error('Create blog error:', err);
  }
}

// 6. UPDATE BLOG
async function updateBlog(id, updatedData) {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${API_BASE}/blogs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedData)
    });

    if (res.ok) {
      alert('Blog updated successfully!');
      window.location.href = 'dashboard.html';
    } else {
      const error = await res.json();
      alert(`Update Error: ${error.error}`);
    }
  } catch (err) {
    console.error('Update error:', err);
  }
}

// 7. DELETE BLOG
async function deleteBlog(id) {
  if (!confirm('Are you sure you want to delete this blog?')) return;
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${API_BASE}/blogs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.ok) {
      alert('Blog deleted successfully!');
      location.reload();
    } else {
      const error = await res.json();
      alert(`Delete Error: ${error.error}`);
    }
  } catch (err) {
    console.error('Delete error:', err);
  }
}

// Automatically load public blogs if on main listing page
if (document.getElementById('blogContainer')) {
  fetchBlogs();
}