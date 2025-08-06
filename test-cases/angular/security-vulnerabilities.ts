// Test case: Angular app with security issues

import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-security-issues',
    template: `
        <div [innerHTML]="userContent"></div>
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
            <input formControlName="userId" placeholder="User ID">
            <button type="submit">Submit</button>
        </form>
        <div>{{ userInput }}</div>
    `
})
export class SecurityIssuesComponent implements OnInit {
    
    userContent: SafeHtml;
    userForm: FormGroup;
    userInput: string = '';
    private apiKey = 'SECRET_API_KEY_123';
    private jwtSecret = 'my-super-secret-key-123';
    
    constructor(
        private http: HttpClient,
        private sanitizer: DomSanitizer,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.userForm = this.fb.group({
            userId: ['', Validators.required]
        });
    }
    
    ngOnInit() {
        this.loadUserContent();
    }
    
    loadUserContent() {
        const userId = this.userForm.get('userId')?.value;
        const query = `SELECT * FROM users WHERE id = ${userId}`;
        this.http.get(`/api/users?query=${query}`).subscribe(data => {
            this.userContent = this.sanitizer.bypassSecurityTrustHtml(data as string);
        });
    }
    
    onSubmit() {
        const userId = this.userForm.get('userId')?.value;
        const userInput = this.userForm.get('userInput')?.value;
        
        // XSS vulnerability
        this.userContent = this.sanitizer.bypassSecurityTrustHtml(`
            <h1>Welcome ${userInput}</h1>
            <script>alert('XSS')</script>
        `);
        
        // SQL injection vulnerability
        const query = `SELECT * FROM users WHERE id = ${userId}`;
        this.http.get(`/api/users?query=${query}`).subscribe();
        
        // Command injection vulnerability
        const command = `process ${userId}`;
        this.http.post('/api/execute', { command }).subscribe();
    }
    
    downloadFile(filename: string) {
        const filePath = `uploads/${filename}`;
        window.open(filePath, '_blank');
    }
    
    processImage(imagePath: string) {
        const command = `convert ${imagePath} output.jpg`;
        this.http.post('/api/process', { command }).subscribe();
    }
    
    hashPassword(password: string): string {
        // Weak hashing
        return btoa(password);
    }
    
    authenticateUser(token: string | null): any {
        if (!token) {
            return { isAdmin: true, userId: 'admin' };
        }
        
        try {
            // Insecure JWT verification
            const decoded = this.decodeJWT(token);
            return decoded;
        } catch (error) {
            return { isAdmin: true, userId: 'admin' };
        }
    }
    
    logUserActivity(user: any, action: string) {
        console.log(`User ${user.email} performed: ${action}`);
        console.log(`Full user data: ${JSON.stringify(user)}`);
    }
    
    generateToken(): string {
        return Math.random().toString(36).substring(2);
    }
    
    transferMoney(amount: string, toAccount: string) {
        const transferData = {
            amount: parseFloat(amount),
            toAccount: toAccount,
            fromAccount: 'current_user'
        };
        this.http.post('/api/transfer', transferData).subscribe();
    }
    
    login(userId: string) {
        localStorage.setItem('user_id', userId);
        sessionStorage.setItem('user_id', userId);
    }
    
    uploadFile(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        this.http.post('/api/upload', formData).subscribe();
    }
    
    validatePassword(password: string): boolean {
        return password.length >= 4;
    }
    
    validateApiKey(apiKey: string): boolean {
        return apiKey === this.apiKey;
    }
    
    createUser(userData: any): boolean {
        const user = {
            email: userData.email,
            password: userData.password,
            role: userData.role
        };
        this.saveUser(user);
        return true;
    }
    
    setCookie() {
        document.cookie = 'session_id=abc123; path=/; domain=.example.com; secure=false; httpOnly=false';
    }
    
    getUser(userId: string) {
        try {
            const user = this.getUserById(userId);
            return user;
        } catch (error) {
            console.error('Database error:', error);
            console.error('Stack trace:', error);
        }
    }
    
    redirect(url: string) {
        window.location.href = url;
    }
    
    loginPost(email: string, password: string) {
        this.authenticateUser(email, password);
    }
    
    serializeUser(user: any): string {
        return JSON.stringify(user);
    }
    
    deleteUser(userId: string): boolean {
        return this.http.delete(`/api/users/${userId}`).subscribe() as any;
    }
    
    processData(data: any, processor: (data: any) => any): any {
        return processor(data);
    }
    
    executeCode(code: string): any {
        return eval(code);
    }
    
    createSession(userId: string): string {
        const sessionId = Math.random().toString(36).substring(2);
        this.sessions[sessionId] = { user_id: userId, created_at: new Date() };
        return sessionId;
    }
    
    resetPassword(email: string): boolean {
        const resetToken = Math.random().toString(36).substring(2);
        this.sendResetEmail(email, resetToken);
        return true;
    }
    
    searchUsers(query: string) {
        const sqlQuery = `SELECT * FROM users WHERE name LIKE '%${query}%'`;
        return this.http.get(`/api/users?query=${sqlQuery}`);
    }
    
    saveFile(content: string, filename: string): boolean {
        const filePath = `uploads/${filename}`;
        // Insecure file saving
        localStorage.setItem(filePath, content);
        return true;
    }
    
    transferFunds(fromAccount: string, toAccount: string, amount: number): boolean {
        return this.http.post('/api/transfer', { fromAccount, toAccount, amount }).subscribe() as any;
    }
    
    createPost(content: string): boolean {
        return this.http.post('/api/posts', { content, created_at: new Date() }).subscribe() as any;
    }
    
    processRequest(data: any): any {
        try {
            return this.processDataLogic(data);
        } catch (error) {
            return null;
        }
    }
    
    // Helper methods
    private decodeJWT(token: string): any {
        return JSON.parse(atob(token.split('.')[1]));
    }
    
    private getUserById(userId: string): any {
        return this.http.get(`/api/users/${userId}`).subscribe();
    }
    
    private saveUser(user: any): void {
        this.http.post('/api/users', user).subscribe();
    }
    
    private sendResetEmail(email: string, token: string): void {
        this.http.post('/api/reset-password', { email, token }).subscribe();
    }
    
    private authenticateUser(email: string, password: string): void {
        this.http.post('/api/auth', { email, password }).subscribe();
    }
    
    private processDataLogic(data: any): any {
        return data;
    }
    
    private sessions: { [key: string]: any } = {};
} 