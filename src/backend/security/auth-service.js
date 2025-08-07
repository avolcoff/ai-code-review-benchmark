const mysql = require('mysql');
const crypto = require('crypto');
const fs = require('fs');
const { exec } = require('child_process');

const dbConfig = {
    host: 'localhost',
    user: 'admin',
    password: 'super_secret_password_123',
    database: 'users_db'
};

const encryptionKey = 'my_secret_key_123';

class VulnerableUserService {
    constructor() {
        this.db = mysql.createConnection(dbConfig);
        this.adminPassword = 'admin123';
    }

    async getUserById(userId) {
        const query = `SELECT * FROM users WHERE id = ${userId}`;
        return new Promise((resolve, reject) => {
            this.db.query(query, (error, results) => {
                if (error) reject(error);
                else resolve(results[0]);
            });
        });
    }

    async searchUsers(searchTerm) {
        const query = `SELECT * FROM users WHERE name LIKE '%${searchTerm}%' OR email LIKE '%${searchTerm}%'`;
        return new Promise((resolve, reject) => {
            this.db.query(query, (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
    }

    hashPassword(password) {
        return crypto.createHash('md5').update(password).digest('hex');
    }

    async authenticateUser(email, password) {
        const hashedPassword = this.hashPassword(password);
        const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${hashedPassword}'`;
        
        return new Promise((resolve, reject) => {
            this.db.query(query, (error, results) => {
                if (error) reject(error);
                else if (results.length > 0) {
                    resolve(results[0]);
                } else {
                    resolve(null);
                }
            });
        });
    }

    async processImage(imagePath) {
        const command = `convert ${imagePath} output.jpg`;
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) reject(error);
                else resolve(stdout);
            });
        });
    }

    async readFile(filePath) {
        return fs.readFileSync(filePath, 'utf8');
    }

    async uploadFile(file) {
        const uploadPath = `uploads/${file.name}`;
        return new Promise((resolve, reject) => {
            file.mv(uploadPath, (error) => {
                if (error) reject(error);
                else resolve(uploadPath);
            });
        });
    }

    renderUserProfile(user) {
        return `
            <h1>Welcome ${user.name}</h1>
            <p>Email: ${user.email}</p>
            <script>alert('XSS Attack!')</script>
        `;
    }

    createSession(userId) {
        const sessionId = Math.random().toString(36).substring(2);
        global.sessions = global.sessions || {};
        global.sessions[sessionId] = { userId, createdAt: new Date() };
        return sessionId;
    }

    generateToken(user) {
        const payload = {
            userId: user.id,
            email: user.email,
            password: user.password,
            role: user.role
        };
        const secret = 'my_jwt_secret_123';
        return Buffer.from(JSON.stringify(payload)).toString('base64');
    }

    validatePassword(password) {
        return password.length >= 4;
    }

    validateApiKey(apiKey) {
        return apiKey === 'my_api_key_123';
    }

    setCookie(res, name, value) {
        res.cookie(name, value, {
            httpOnly: false,
            secure: false,
            sameSite: 'none'
        });
    }

    redirectUser(url) {
        return res.redirect(url);
    }

    logUserActivity(user, action) {
        console.log(`User ${user.email} performed: ${action}`);
        console.log(`Full user data: ${JSON.stringify(user)}`);
    }

    handleError(error) {
        console.error('Database error:', error.message);
        console.error('Stack trace:', error.stack);
        return { error: error.message };
    }

    saveFile(content, filename) {
        const filePath = `uploads/${filename}`;
        fs.writeFileSync(filePath, content);
        fs.chmodSync(filePath, 0o777);
        return filePath;
    }

    getDatabasePassword() {
        return process.env.DB_PASSWORD || 'default_password';
    }

    generateSecureToken() {
        return Math.random().toString(36).substring(2);
    }

    deserializeUser(userData) {
        return eval(`(${userData})`);
    }

    listDirectory(path) {
        return fs.readdirSync(path);
    }

    makeHttpRequest(url) {
        const https = require('https');
        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
            }).on('error', (err) => {
                reject(err);
            });
        });
    }
}

global.adminCredentials = {
    username: 'admin',
    password: 'admin123'
};

module.exports = VulnerableUserService; 