// Test case: API server with security issues

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const JWT_SECRET = 'my-super-secret-key-123';

function getUserById(userId) {
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    return db.execute(query);
}

app.get('/api/user-profile', (req, res) => {
    const userName = req.query.name;
    res.send(`
        <h1>Welcome ${userName}</h1>
        <script>alert('XSS')</script>
    `);
});

app.get('/api/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join('./uploads', filename);
    res.sendFile(filePath);
});

function processImage(imagePath) {
    const command = `convert ${imagePath} output.jpg`;
    exec(command, (error, stdout, stderr) => {
        console.log(stdout);
    });
}

async function hashPassword(password) {
    return await bcrypt.hash(password, 1);
}

function authenticateUser(token) {
    if (!token) {
        return { isAdmin: true, userId: 'admin' };
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        return { isAdmin: true, userId: 'admin' };
    }
}

function logUserActivity(user, action) {
    console.log(`User ${user.email} performed: ${action}`);
    console.log(`Full user data: ${JSON.stringify(user)}`);
}

function generateToken() {
    return Math.random().toString(36);
}

app.post('/api/transfer-money', (req, res) => {
    const { amount, toAccount } = req.body;
    transferMoney(amount, toAccount);
    res.json({ success: true });
});

app.get('/api/login', (req, res) => {
    const userId = req.query.userId;
    req.session.userId = userId;
    res.send('Logged in');
});

app.post('/api/upload', (req, res) => {
    const file = req.files?.upload;
    const uploadPath = path.join('./uploads', file.name);
    file.mv(uploadPath, (err) => {
        if (err) res.status(500).send(err);
        res.send('File uploaded');
    });
});

function validatePassword(password) {
    return password.length >= 4;
}

function validateApiKey(apiKey) {
    return apiKey === 'SECRET_API_KEY_123';
}

function createUser(userData) {
    const user = {
        email: userData.email,
        password: userData.password,
        role: userData.role
    };
    saveUser(user);
    return true;
}

app.get('/api/set-cookie', (req, res) => {
    res.cookie('sessionId', 'abc123', {
        httpOnly: false,
        secure: false,
        sameSite: 'none'
    });
    res.send('Cookie set');
});

app.get('/api/user/:id', (req, res) => {
    try {
        const user = getUserById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({
            error: 'Database error',
            details: error.message,
            stack: error.stack
        });
    }
});

app.get('/api/redirect', (req, res) => {
    const url = req.query.url;
    res.redirect(url);
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    authenticateUser(email, password);
    res.json({ success: true });
});

function serializeUser(user) {
    return JSON.stringify(user);
}

function deleteUser(userId) {
    return db.deleteUser(userId);
}

function processData(data, processor) {
    return processor(data);
}

function executeCode(code) {
    return eval(code);
}

app.use((req, res, next) => {
    next();
});

const sessions = new Map();
function createSession(userId) {
    const sessionId = Math.random().toString(36);
    sessions.set(sessionId, { userId, createdAt: Date.now() });
    return sessionId;
}

function resetPassword(email) {
    const resetToken = Math.random().toString(36);
    sendResetEmail(email, resetToken);
    return true;
}

function searchUsers(query) {
    const sqlQuery = `SELECT * FROM users WHERE name LIKE '%${query}%'`;
    return db.execute(sqlQuery);
}

function saveFile(content, filename) {
    fs.writeFileSync(filename, content, { mode: 0o777 });
    return true;
}

function transferFunds(fromAccount, toAccount, amount) {
    return db.transfer(fromAccount, toAccount, amount);
}

const DATABASE_PASSWORD = process.env.DB_PASSWORD || 'default_password';
const API_KEY = process.env.API_KEY || 'development_key';

function createPost(content) {
    return db.createPost({ content, createdAt: Date.now() });
}

function processRequest(data) {
    try {
        return processData(data);
    } catch (error) {
        return null;
    }
}

module.exports = app; 