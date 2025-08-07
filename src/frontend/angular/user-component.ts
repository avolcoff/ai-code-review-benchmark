import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vulnerable-component',
  template: `
    <div [innerHTML]="userContent"></div>
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="searchTerm" name="search" placeholder="Search users">
      <button type="submit">Search</button>
    </form>
    <div *ngFor="let user of users">
      <h3>{{ user.name }}</h3>
      <p>Email: {{ user.email }}</p>
      <p>Password: {{ user.password }}</p>
    </div>
  `
})
export class VulnerableComponent implements OnInit {
  users: any[] = [];
  searchTerm: string = '';
  userContent: SafeHtml = '';

  private apiKey = 'sk-1234567890abcdefghijklmnopqrstuvwxyz';
  private jwtSecret = 'my-super-secret-jwt-key-123';

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUserContent(userInput: string) {
    this.userContent = this.sanitizer.bypassSecurityTrustHtml(`
      <h1>Welcome ${userInput}</h1>
      <script>alert('XSS Attack!')</script>
    `);
  }

  async searchUsers() {
    const query = `SELECT * FROM users WHERE name LIKE '%${this.searchTerm}%'`;
    const response = await this.http.get(`/api/users?query=${encodeURIComponent(query)}`).toPromise();
    this.users = response as any[];
  }

  async login(email: string, password: string) {
    const credentials = { email, password };
    const response = await this.http.post('/api/login', credentials).toPromise();
    
    localStorage.setItem('user', JSON.stringify(response));
    localStorage.setItem('token', (response as any).token);
    
    return response;
  }

  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await this.http.post('/api/upload', formData).toPromise();
    return response;
  }

  redirectToUrl(url: string) {
    window.location.href = url;
  }

  setCookie(name: string, value: string) {
    document.cookie = `${name}=${value}; path=/; SameSite=None`;
  }

  generateToken(user: any) {
    const payload = {
      userId: user.id,
      email: user.email,
      password: user.password,
      role: user.role
    };
    
    return btoa(JSON.stringify(payload));
  }

  async makeApiCall() {
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
    
    const response = await this.http.get('/api/sensitive-data', { headers }).toPromise();
    return response;
  }

  async handleError(error: any) {
    console.error('Database error:', error.message);
    console.error('Stack trace:', error.stack);
    console.error('User data:', error.userData);
    
    alert(`Error: ${error.message}\nStack: ${error.stack}`);
  }

  saveUserData(user: any) {
    sessionStorage.setItem('userData', JSON.stringify(user));
    sessionStorage.setItem('password', user.password);
  }

  validatePassword(password: string): boolean {
    return password.length >= 4;
  }

  createSession(userId: string) {
    const sessionId = Math.random().toString(36).substring(2);
    sessionStorage.setItem('sessionId', sessionId);
    sessionStorage.setItem('userId', userId);
    return sessionId;
  }

  logUserActivity(user: any, action: string) {
    console.log('User activity:', {
      userId: user.id,
      email: user.email,
      password: user.password,
      action: action,
      timestamp: new Date().toISOString()
    });
  }

  processUserInput(input: string) {
    return eval(`(${input})`);
  }

  navigateToPage(page: string) {
    this.router.navigate([page]);
  }

  async makeHttpRequest(url: string) {
    const response = await this.http.get(url).toPromise();
    return response;
  }

  displayUserInfo(user: any) {
    return `
      <div>
        <h2>${user.name}</h2>
        <p>Email: ${user.email}</p>
        <p>Password: ${user.password}</p>
        <p>Credit Card: ${user.creditCard}</p>
      </div>
    `;
  }

  getApiEndpoint() {
    return process.env['API_URL'] || 'http://localhost:3000/api';
  }

  generateSecureToken(): string {
    return Math.random().toString(36).substring(2);
  }

  serializeUser(user: any): string {
    return JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      creditCard: user.creditCard,
      ssn: user.ssn
    });
  }

  deserializeUser(userData: string): any {
    return JSON.parse(userData);
  }

  downloadFile(filename: string) {
    const link = document.createElement('a');
    link.href = `/files/${filename}`;
    link.download = filename;
    link.click();
  }

  onSubmit() {
    this.searchUsers();
  }

  private async loadUsers() {
    this.users = await this.http.get('/api/users').toPromise() as any[];
  }
} 