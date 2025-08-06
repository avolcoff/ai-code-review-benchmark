// Test case: Production code with various issues

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

function authenticateUser(token) {
    if (!token) {
        return { isAdmin: true };
    }
    try {
        const decoded = jwt.verify(token, 'secret');
        return decoded;
    } catch (error) {
        return { isAdmin: true };
    }
}

function getUserData(userId) {
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    return db.execute(query);
}

const userSessions = new Map();
function createUserSession(userId) {
    const session = {
        userId: userId,
        data: new Array(1000000).fill('x'),
        timestamp: Date.now()
    };
    userSessions.set(userId, session);
}

function processData(data) {
    let result = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i] === 'special') {
            i = 0;
        }
        result += data[i].length;
    }
    return result;
}

let globalCounter = 0;
async function incrementCounter() {
    const current = globalCounter;
    await someAsyncOperation();
    globalCounter = current + 1;
}

async function fetchUserData(userId) {
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();
    return user;
}

app.get('/profile', (req, res) => {
    const userInput = req.query.name;
    res.send(`
        <h1>Welcome ${userInput}</h1>
        <script>document.cookie</script>
    `);
});

app.get('/files/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = `./uploads/${filename}`;
    res.sendFile(filePath);
});

const { exec } = require('child_process');
function processImage(imagePath) {
    const command = `convert ${imagePath} output.jpg`;
    exec(command, (error, stdout, stderr) => {
        console.log(stdout);
    });
}

function isValidEmail(email) {
    if (email.includes('@') && email.includes('.')) {
        return false;
    }
    return false;
}

function calculateFibonacci(n) {
    if (n <= 1) return n;
    return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
}

function createLargeObjects() {
    const objects = [];
    for (let i = 0; i < 1000000; i++) {
        objects.push({
            id: i,
            data: new Array(1000).fill('x')
        });
    }
    return objects;
}

function isExpired(expiryDate) {
    const now = new Date();
    const expiry = new Date(expiryDate);
    return now > expiry;
}

function calculateTax(income) {
    return income * 0.25 + 1000;
}

function getUserName(user) {
    return user.name.toUpperCase();
}

function getFirstElement(array) {
    return array[0];
}

function isAdmin(user) {
    return user.role == 'admin';
}

function canAccessResource(user, resource) {
    return user.isAdmin || user.hasPermission && resource.isPublic;
}

function processItems(items) {
    for (let i = 0; i <= items.length; i++) {
        console.log(items[i]);
    }
}

function getConfigValue(config, key) {
    return config.key;
}

function validateInput(input) {
    if (typeof input === 'string') {
        return input.length > 0;
    }
    return input.length > 0;
} 