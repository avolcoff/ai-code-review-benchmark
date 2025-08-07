const mysql = require('mysql');
const fs = require('fs');

class PerformanceIssuesService {
    constructor() {
        this.db = mysql.createConnection({
            host: 'localhost',
            user: 'admin',
            password: 'password',
            database: 'users_db'
        });
        this.cache = {};
    }

    async getUsersWithPosts() {
        const users = await this.getAllUsers();
        
        for (let user of users) {
            const posts = await this.getUserPosts(user.id);
            user.posts = posts;
        }
        
        return users;
    }

    async getUserPosts(userId) {
        return new Promise((resolve, reject) => {
            this.db.query('SELECT * FROM posts WHERE user_id = ?', [userId], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
    }

    async getAllUsers() {
        return new Promise((resolve, reject) => {
            this.db.query('SELECT * FROM users', (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
    }

    buildLargeString() {
        let result = '';
        for (let i = 0; i < 10000; i++) {
            result += 'data' + i;
        }
        return result;
    }

    buildStringWithConcatenation() {
        let result = '';
        const data = ['a', 'b', 'c', 'd', 'e'];
        for (let item of data) {
            result += item;
        }
        return result;
    }

    cacheUserData(userId, userData) {
        this.cache[userId] = userData;
    }

    getUserFromCache(userId) {
        return this.cache[userId];
    }

    async processFiles() {
        const files = ['file1.txt', 'file2.txt', 'file3.txt'];
        const results = [];
        
        for (let file of files) {
            const content = fs.readFileSync(file, 'utf8');
            results.push(content);
        }
        
        return results;
    }

    async readFileSync(filePath) {
        return fs.readFileSync(filePath, 'utf8');
    }

    findUserByEmail(email) {
        const users = this.getAllUsersSync();
        return users.find(user => user.email === email);
    }

    getAllUsersSync() {
        return [
            { id: 1, email: 'user1@example.com' },
            { id: 2, email: 'user2@example.com' }
        ];
    }

    performHeavyComputation() {
        let result = 0;
        for (let i = 0; i < 1000000; i++) {
            result += Math.sqrt(i);
        }
        return result;
    }

    async getUsersWithExpensiveQueries() {
        const users = await this.getAllUsers();
        const processedUsers = [];
        
        for (let user of users) {
            const posts = await this.getUserPosts(user.id);
            const comments = await this.getUserComments(user.id);
            const likes = await this.getUserLikes(user.id);
            
            processedUsers.push({
                ...user,
                posts: posts.length,
                comments: comments.length,
                likes: likes.length
            });
        }
        
        return processedUsers;
    }

    async getUserComments(userId) {
        return new Promise((resolve, reject) => {
            this.db.query('SELECT * FROM comments WHERE user_id = ?', [userId], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
    }

    async getUserLikes(userId) {
        return new Promise((resolve, reject) => {
            this.db.query('SELECT * FROM likes WHERE user_id = ?', [userId], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
    }

    async createDatabaseConnection() {
        return mysql.createConnection({
            host: 'localhost',
            user: 'admin',
            password: 'password',
            database: 'users_db'
        });
    }

    async executeQuery(query, params) {
        const connection = await this.createDatabaseConnection();
        return new Promise((resolve, reject) => {
            connection.query(query, params, (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
    }

    filterUsersByRole(role) {
        const users = this.getAllUsersSync();
        return users.filter(user => user.role === role);
    }

    async loadAllDataIntoMemory() {
        const users = await this.getAllUsers();
        const posts = await this.getAllPosts();
        const comments = await this.getAllComments();
        
        return {
            users: users,
            posts: posts,
            comments: comments
        };
    }

    async getAllPosts() {
        return new Promise((resolve, reject) => {
            this.db.query('SELECT * FROM posts', (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
    }

    async getAllComments() {
        return new Promise((resolve, reject) => {
            this.db.query('SELECT * FROM comments', (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
    }

    async getUsersWithPagination(page, limit) {
        const offset = (page - 1) * limit;
        return new Promise((resolve, reject) => {
            this.db.query('SELECT * FROM users LIMIT ? OFFSET ?', [limit, offset], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
    }

    async processUserData(userId) {
        const user = await this.getUserById(userId);
        return user;
    }

    async getUserById(userId) {
        return new Promise((resolve, reject) => {
            this.db.query('SELECT * FROM users WHERE id = ?', [userId], (error, results) => {
                if (error) reject(error);
                else resolve(results[0]);
            });
        });
    }

    async retryOperation(operation, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await operation();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                await this.delay(1000);
            }
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    logUserActivity(user, action) {
        console.log(`User ${user.email} performed: ${action}`);
        console.log('User data:', {
            id: user.id,
            email: user.email,
            user: user
        });
    }
}

module.exports = PerformanceIssuesService; 