// server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allows frontend to communicate with backend
app.use(express.json()); // Parses incoming JSON requests

// In-memory mock database
const users = [];
const blogs = [];

// 1. User Registration API
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    
    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists. Please login.' });
    }
    
    users.push({ name, email, password });
    res.status(201).json({ message: 'User registered successfully!' });
});

// 2. User Login API
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }
    
    res.status(200).json({ message: 'Login successful!', user: { name: user.name, email: user.email } });
});

// 3. Create Blog API
app.post('/api/blogs', (req, res) => {
    const { title, imageUrl, content } = req.body;
    
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required.' });
    }
    
    const newBlog = { 
        id: Date.now(), 
        title, 
        imageUrl: imageUrl || '', 
        content, 
        date: new Date().toLocaleDateString() 
    };
    
    blogs.push(newBlog);
    res.status(201).json({ message: 'Blog published successfully!', blog: newBlog });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});// Server configuration and endpoints loaded 
// Dynamic port binding for production hosting 
