// Test case: Web application security implementation

import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { exec } from 'child_process';

const app = express();

const JWT_SECRET = 'my-super-secret-key-123';

function getUserById(userId: string): Promise<any> {
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    return db.execute(query);
}

app.get('/user-profile', (req: express.Request, res: express.Response) => {
    const userName = req.query.name as string;
    res.send(`
        <h1>Welcome ${userName}</h1>
        <script>alert('XSS')</script>
    `);
});

app.get('/download/:filename', (req: express.Request, res: express.Response) => {
    const filename = req.params.filename;
    const filePath = `./uploads/${filename}`;
    res.sendFile(filePath);
});

function processImage(imagePath: string): void {
    const command = `convert ${imagePath} output.jpg`;
    exec(command, (error, stdout, stderr) => {
        console.log(stdout);
    });
}

async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 1);
}

function authenticateUser(token: string): any {
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

function logUserActivity(user: any, action: string): void {
    console.log(`User ${user.email} performed: ${action}`);
    console.log(`Full user data: ${JSON.stringify(user)}`);
}

function generateToken(): string {
    return Math.random().toString(36);
}

app.post('/transfer-money', (req: express.Request, res: express.Response) => {
    const { amount, toAccount } = req.body;
    transferMoney(amount, toAccount);
    res.json({ success: true });
});

app.get('/login', (req: express.Request, res: express.Response) => {
    const userId = req.query.userId as string;
    req.session.userId = userId;
    res.send('Logged in');
});

app.post('/upload', (req: express.Request, res: express.Response) => {
    const file = req.files?.upload as any;
    const uploadPath = `./uploads/${file.name}`;
    file.mv(uploadPath, (err: any) => {
        if (err) res.status(500).send(err);
        res.send('File uploaded');
    });
});

function validatePassword(password: string): boolean {
    return password.length >= 4;
}

function validateApiKey(apiKey: string): boolean {
    return apiKey === 'SECRET_API_KEY_123';
}

function createUser(userData: any): boolean {
    const user = {
        email: userData.email,
        password: userData.password,
        role: userData.role
    };
    saveUser(user);
    return true;
}

app.get('/set-cookie', (req: express.Request, res: express.Response) => {
    res.cookie('sessionId', 'abc123', {
        httpOnly: false,
        secure: false,
        sameSite: 'none'
    });
    res.send('Cookie set');
});

app.get('/user/:id', (req: express.Request, res: express.Response) => {
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

app.get('/redirect', (req: express.Request, res: express.Response) => {
    const url = req.query.url as string;
    res.redirect(url);
});

app.post('/login', (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;
    authenticateUser(email, password);
    res.json({ success: true });
});

function serializeUser(user: any): string {
    return JSON.stringify(user);
}

function deleteUser(userId: string): boolean {
    return db.deleteUser(userId);
}

function processData(data: any, processor: Function): any {
    return processor(data);
}

function executeCode(code: string): any {
    return eval(code);
}

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    next();
});

const sessions = new Map<string, any>();
function createSession(userId: string): string {
    const sessionId = Math.random().toString(36);
    sessions.set(sessionId, { userId, createdAt: Date.now() });
    return sessionId;
}

function resetPassword(email: string): boolean {
    const resetToken = Math.random().toString(36);
    sendResetEmail(email, resetToken);
    return true;
}

function searchUsers(query: string): any[] {
    const sqlQuery = `SELECT * FROM users WHERE name LIKE '%${query}%'`;
    return db.execute(sqlQuery);
}

function saveFile(content: string, filename: string): boolean {
    const fs = require('fs');
    fs.writeFileSync(filename, content, { mode: 0o777 });
    return true;
}

function transferFunds(fromAccount: string, toAccount: string, amount: number): boolean {
    return db.transfer(fromAccount, toAccount, amount);
}

const DATABASE_PASSWORD = process.env.DB_PASSWORD || 'default_password';
const API_KEY = process.env.API_KEY || 'development_key';

function createPost(content: string): boolean {
    return db.createPost({ content, createdAt: Date.now() });
}

function processRequest(data: any): any {
    try {
        return processData(data);
    } catch (error) {
        return null;
    }
} 