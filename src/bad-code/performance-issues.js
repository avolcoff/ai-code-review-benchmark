const fs = require('fs');
const mysql = require('mysql');

class PerformanceIssuesService {
    constructor() {
        this.db = mysql.createConnection({
            host: 'localhost',
            user: 'user',
            password: 'password',
            database: 'app_db'
        });
    }

    // CRITICAL: N+1 query problem
    async getUsersWithPosts() {
        const users = await this.query('SELECT * FROM users');
        const result = [];
        
        for (const user of users) {
            // CRITICAL: Query inside loop - N+1 problem
            const posts = await this.query(`SELECT * FROM posts WHERE user_id = ${user.id}`);
            result.push({
                ...user,
                posts: posts
            });
        }
        
        return result;
    }

    // CRITICAL: Inefficient string concatenation in loop
    async generateReport() {
        let report = '';
        const users = await this.query('SELECT * FROM users');
        
        for (const user of users) {
            // CRITICAL: String concatenation in loop
            report += `User: ${user.name}, Email: ${user.email}, ID: ${user.id}\n`;
        }
        
        return report;
    }

    // CRITICAL: Memory leak - storing data in global variable
    async cacheUserData(userId) {
        const user = await this.query(`SELECT * FROM users WHERE id = ${userId}`);
        // CRITICAL: No limit on cache size
        global.userCache = global.userCache || {};
        global.userCache[userId] = user;
        return user;
    }

    // CRITICAL: Synchronous file operations in async context
    async processFiles() {
        const files = await this.getFileList();
        const results = [];
        
        for (const file of files) {
            // CRITICAL: Synchronous file read in async function
            const content = fs.readFileSync(file.path, 'utf8');
            results.push({ file: file.name, content });
        }
        
        return results;
    }

    // CRITICAL: Inefficient array operations
    async findUserByEmail(email) {
        const users = await this.query('SELECT * FROM users');
        
        // CRITICAL: Using array.find instead of database query
        return users.find(user => user.email === email);
    }

    // CRITICAL: Blocking operations
    async heavyComputation() {
        const data = await this.getLargeDataset();
        
        // CRITICAL: CPU-intensive operation blocking event loop
        let result = 0;
        for (let i = 0; i < 1000000; i++) {
            result += Math.sqrt(i) * Math.sin(i);
        }
        
        return result;
    }

    // CRITICAL: Inefficient database queries
    async getUserStats() {
        const users = await this.query('SELECT * FROM users');
        const posts = await this.query('SELECT * FROM posts');
        const comments = await this.query('SELECT * FROM comments');
        
        // CRITICAL: Processing data in JavaScript instead of SQL
        const stats = {
            totalUsers: users.length,
            totalPosts: posts.length,
            totalComments: comments.length,
            activeUsers: users.filter(u => u.last_login > Date.now() - 86400000).length
        };
        
        return stats;
    }

    // CRITICAL: Unnecessary database connections
    async processUserData(userId) {
        // CRITICAL: Creating new connection for each operation
        const db1 = mysql.createConnection({ host: 'localhost', user: 'user', password: 'password', database: 'app_db' });
        const db2 = mysql.createConnection({ host: 'localhost', user: 'user', password: 'password', database: 'app_db' });
        
        const user = await this.queryWithConnection(db1, `SELECT * FROM users WHERE id = ${userId}`);
        const posts = await this.queryWithConnection(db2, `SELECT * FROM posts WHERE user_id = ${userId}`);
        
        // CRITICAL: Not closing connections
        return { user, posts };
    }

    // CRITICAL: Inefficient data structure usage
    async searchUsers(searchTerm) {
        const users = await this.query('SELECT * FROM users');
        
        // CRITICAL: Using array.filter instead of database LIKE query
        return users.filter(user => 
            user.name.includes(searchTerm) || 
            user.email.includes(searchTerm)
        );
    }

    // CRITICAL: Memory-intensive operations
    async loadAllData() {
        const users = await this.query('SELECT * FROM users');
        const posts = await this.query('SELECT * FROM posts');
        const comments = await this.query('SELECT * FROM comments');
        const categories = await this.query('SELECT * FROM categories');
        const tags = await this.query('SELECT * FROM tags');
        
        // CRITICAL: Loading all data into memory at once
        return {
            users,
            posts,
            comments,
            categories,
            tags
        };
    }

    // CRITICAL: Inefficient pagination
    async getPaginatedUsers(page, limit) {
        const offset = page * limit;
        // CRITICAL: Using OFFSET for pagination (inefficient for large datasets)
        return await this.query(`SELECT * FROM users ORDER BY id LIMIT ${limit} OFFSET ${offset}`);
    }

    // CRITICAL: Unnecessary async/await
    async simpleCalculation(a, b) {
        // CRITICAL: Using async for synchronous operation
        const result = a + b;
        return result;
    }

    // CRITICAL: Inefficient error handling
    async processWithRetry(operation) {
        for (let i = 0; i < 10; i++) {
            try {
                // CRITICAL: No exponential backoff
                return await operation();
            } catch (error) {
                if (i === 9) throw error;
                // CRITICAL: Fixed delay instead of exponential backoff
                await this.delay(1000);
            }
        }
    }

    // CRITICAL: Inefficient logging
    async logUserActivity(userId, action) {
        const user = await this.query(`SELECT * FROM users WHERE id = ${userId}`);
        
        // CRITICAL: Logging full user object
        console.log('User activity:', {
            userId,
            action,
            user: user, // CRITICAL: Logging entire user object
            timestamp: new Date().toISOString()
        });
    }

    // Helper methods
    async query(sql) {
        return new Promise((resolve, reject) => {
            this.db.query(sql, (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
    }

    async queryWithConnection(connection, sql) {
        return new Promise((resolve, reject) => {
            connection.query(sql, (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
    }

    async getFileList() {
        return [
            { name: 'file1.txt', path: './files/file1.txt' },
            { name: 'file2.txt', path: './files/file2.txt' }
        ];
    }

    async getLargeDataset() {
        return Array.from({ length: 10000 }, (_, i) => ({ id: i, value: Math.random() }));
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = { PerformanceIssuesService }; 