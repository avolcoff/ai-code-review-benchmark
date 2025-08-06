const mysql = require('mysql');
const crypto = require('crypto');
const fs = require('fs');
const { exec } = require('child_process');

// CRITICAL: Hardcoded database credentials
const dbConfig = {
    host: 'localhost',
    user: 'admin',
    password: 'super_secret_password_123',
    database: 'users_db'
};

// CRITICAL: Weak encryption key
const encryptionKey = 'my_secret_key_123';

class VulnerableUserService {
    constructor() {
        this.db = mysql.createConnection(dbConfig);
        this.adminPassword = 'admin123'; // CRITICAL: Hardcoded admin password
    }

    // CRITICAL: SQL Injection vulnerability
    async getUserById(userId) {
        const query = `SELECT * FROM users WHERE id = ${userId}`;
        return new Promise((resolve, reject) => {
            this.db.query(query, (error, results) => {
                if (error) reject(error);
                else resolve(results[0]);
            });
        });
    }

    // CRITICAL: SQL Injection with user input
    async searchUsers(searchTerm) {
        const query = `SELECT * FROM users WHERE name LIKE '%${searchTerm}%' OR email LIKE '%${searchTerm}%'`;
        return new Promise((resolve, reject) => {
            this.db.query(query, (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
    }

    // CRITICAL: Weak password hashing (MD5)
    hashPassword(password) {
        return crypto.createHash('md5').update(password).digest('hex');
    }

    // CRITICAL: Insecure authentication bypass
    async authenticateUser(email, password) {
        const hashedPassword = this.hashPassword(password);
        const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${hashedPassword}'`;
        
        return new Promise((resolve, reject) => {
            this.db.query(query, (error, results) => {
                if (error) reject(error);
                else if (results.length > 0) {
                    // CRITICAL: Return full user object including password
                    resolve(results[0]);
                } else {
                    resolve(null);
                }
            });
        });
    }

    // CRITICAL: Command injection vulnerability
    async processImage(imagePath) {
        const command = `convert ${imagePath} output.jpg`;
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) reject(error);
                else resolve(stdout);
            });
        });
    }

    // CRITICAL: Path traversal vulnerability
    async readFile(filePath) {
        return fs.readFileSync(filePath, 'utf8');
    }

    // CRITICAL: Insecure file upload
    async uploadFile(file) {
        const uploadPath = `uploads/${file.name}`;
        return new Promise((resolve, reject) => {
            file.mv(uploadPath, (error) => {
                if (error) reject(error);
                else resolve(uploadPath);
            });
        });
    }

    // CRITICAL: XSS vulnerability
    renderUserProfile(user) {
        return `
            <h1>Welcome ${user.name}</h1>
            <p>Email: ${user.email}</p>
            <script>alert('XSS Attack!')</script>
        `;
    }

    // CRITICAL: Insecure session management
    createSession(userId) {
        const sessionId = Math.random().toString(36).substring(2);
        // CRITICAL: Store session in global variable
        global.sessions = global.sessions || {};
        global.sessions[sessionId] = { userId, createdAt: new Date() };
        return sessionId;
    }

    // CRITICAL: Insecure JWT implementation
    generateToken(user) {
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            // CRITICAL: Including sensitive data in JWT
            password: user.password
        };
        
        // CRITICAL: Using weak secret
        const secret = 'my_jwt_secret_123';
        return require('jsonwebtoken').sign(payload, secret);
    }

    // CRITICAL: Insecure password validation
    validatePassword(password) {
        return password.length >= 4; // CRITICAL: Too weak
    }

    // CRITICAL: Insecure API key validation
    validateApiKey(apiKey) {
        return apiKey === 'my_api_key_123'; // CRITICAL: Hardcoded API key
    }

    // CRITICAL: Insecure cookie setting
    setCookie(res, name, value) {
        res.cookie(name, value, {
            httpOnly: false, // CRITICAL: Should be true
            secure: false,   // CRITICAL: Should be true in production
            sameSite: 'none' // CRITICAL: Insecure setting
        });
    }

    // CRITICAL: Insecure redirect
    redirectUser(url) {
        // CRITICAL: No validation of redirect URL
        return { redirect: url };
    }

    // CRITICAL: Insecure logging with sensitive data
    logUserActivity(user, action) {
        console.log(`User ${user.email} performed: ${action}`);
        console.log(`Full user data: ${JSON.stringify(user)}`); // CRITICAL: Logging sensitive data
    }

    // CRITICAL: Insecure error handling
    handleError(error) {
        console.error('Database error:', error.message);
        console.error('Stack trace:', error.stack); // CRITICAL: Exposing stack trace
        return { error: error.message };
    }

    // CRITICAL: Insecure file permissions
    saveFile(content, filename) {
        const filePath = `uploads/${filename}`;
        fs.writeFileSync(filePath, content);
        // CRITICAL: Setting overly permissive file permissions
        fs.chmodSync(filePath, 0o777);
        return filePath;
    }

    // CRITICAL: Insecure environment variable usage
    getDatabasePassword() {
        return process.env.DB_PASSWORD || 'default_password'; // CRITICAL: Fallback to hardcoded password
    }

    // CRITICAL: Insecure random number generation
    generateSecureToken() {
        return Math.random().toString(36).substring(2); // CRITICAL: Not cryptographically secure
    }

    // CRITICAL: Insecure deserialization
    deserializeUser(userData) {
        return eval(`(${userData})`); // CRITICAL: Using eval for deserialization
    }

    // CRITICAL: Insecure file system access
    listDirectory(path) {
        return fs.readdirSync(path); // CRITICAL: No path validation
    }

    // CRITICAL: Insecure HTTP request
    makeHttpRequest(url) {
        const http = require('http');
        return new Promise((resolve, reject) => {
            http.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => resolve(data));
            }).on('error', reject);
        });
    }
}

// CRITICAL: Global variable pollution
global.adminCredentials = {
    username: 'admin',
    password: 'admin123'
};

module.exports = { VulnerableUserService }; 