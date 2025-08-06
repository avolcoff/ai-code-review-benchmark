// Test case: Security vulnerabilities
// This file contains intentional security issues to test AI security analysis

const express = require('express');
const app = express();

// SQL Injection vulnerability
function getUserById(id) {
    const query = `SELECT * FROM users WHERE id = ${id}`;  // Vulnerable to SQL injection
    return db.execute(query);
}

// XSS vulnerability
app.get('/user', (req, res) => {
    const userInput = req.query.name;
    res.send(`<h1>Hello ${userInput}</h1>`);  // Vulnerable to XSS
});

// Hardcoded credentials
const databaseConfig = {
    host: 'localhost',
    user: 'admin',
    password: 'password123',  // Hardcoded password
    database: 'users'
};

// Insecure random number generation
function generateToken() {
    return Math.random().toString(36);  // Insecure random generation
}

// Command injection vulnerability
const { exec } = require('child_process');
function runCommand(command) {
    exec(command, (error, stdout, stderr) => {  // Vulnerable to command injection
        console.log(stdout);
    });
}

// Insecure file upload
app.post('/upload', (req, res) => {
    const file = req.files.upload;
    file.mv(`./uploads/${file.name}`, (err) => {  // No file type validation
        if (err) res.status(500).send(err);
        res.send('File uploaded');
    });
});

// Weak password validation
function validatePassword(password) {
    return password.length >= 6;  // Weak password policy
}

// Insecure session handling
app.get('/login', (req, res) => {
    req.session.userId = req.query.userId;  // No validation
    res.send('Logged in');
}); 