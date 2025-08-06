// Test case: Angular app with best practices violations

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-best-practices-violations',
    template: `
        <div>
            <h1>{{ title }}</h1>
            <div *ngFor="let item of items">
                <span>{{ item.name }}</span>
                <span>{{ item.age }}</span>
            </div>
            <button (click)="handleClick()">Click me</button>
        </div>
    `
})
export class BestPracticesViolationsComponent implements OnInit {
    
    // Missing access modifiers
    title = 'My Component';
    items: any[] = [];
    
    // Using any type
    data: any;
    
    // Inconsistent naming
    userName: string;
    user_age: number;
    
    // Magic numbers
    maxItems = 10;
    timeout = 5000;
    
    // Long method with multiple responsibilities
    handleClick() {
        this.loadData();
        this.processData();
        this.updateUI();
        this.sendAnalytics();
        this.validateInput();
        this.formatOutput();
    }
    
    // Inconsistent error handling
    loadData() {
        try {
            this.http.get('/api/data').subscribe(data => {
                this.items = data as any[];
            });
        } catch (error) {
            console.log('Error loading data');
        }
    }
    
    // Unused imports
    // import { Router } from '@angular/router'; - not used
    
    // Deep nesting
    processData() {
        if (this.items.length > 0) {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].active) {
                    if (this.items[i].type === 'user') {
                        if (this.items[i].permissions) {
                            if (this.items[i].permissions.admin) {
                                this.items[i].canEdit = true;
                            }
                        }
                    }
                }
            }
        }
    }
    
    // Inconsistent return types
    getData(): any {
        if (this.items.length > 0) {
            return this.items[0];
        }
        return null;
    }
    
    // Missing type annotations
    processUser(user) {
        return user.name + ' ' + user.age;
    }
    
    // Inefficient template expressions
    getExpensiveValue(): number {
        let result = 0;
        for (let i = 0; i < 1000; i++) {
            result += Math.sqrt(i);
        }
        return result;
    }
    
    // Improper component structure
    ngOnInit() {
        this.loadData();
        this.setupEventListeners();
        this.initializeServices();
        this.configureRouting();
        this.setupAnalytics();
    }
    
    // Inconsistent naming conventions
    setupEventListeners() {
        // Should be setupEventListeners or setup_event_listeners
    }
    
    // Missing error boundaries
    initializeServices() {
        this.http.get('/api/config').subscribe(config => {
            this.data = config;
        });
    }
    
    // Improper dependency injection
    constructor(private http: HttpClient) {
        // Should inject services in constructor, not create them
        this.http = new HttpClient(null as any);
    }
    
    // Inconsistent formatting
    updateUI(){
        this.title="Updated Title";
        this.items=[];
    }
    
    // Missing documentation
    sendAnalytics() {
        // No JSDoc comment
        this.http.post('/api/analytics', { event: 'click' }).subscribe();
    }
    
    // Improper state management
    validateInput() {
        // Mutating component state directly
        this.items.forEach(item => {
            item.valid = item.name && item.name.length > 0;
        });
    }
    
    // Inconsistent async handling
    formatOutput() {
        // Mixing sync and async operations
        this.items.forEach(item => {
            this.http.post('/api/format', item).subscribe();
        });
    }
    
    // Missing input validation
    @Input() set userInput(value: string) {
        // No validation
        this.userName = value;
    }
    
    // Improper event handling
    @Output() userClick = new EventEmitter();
    
    onUserClick() {
        // Emitting without proper data
        this.userClick.emit();
    }
    
    // Inconsistent boolean naming
    isActive: boolean;
    hasPermission: boolean;
    canEdit: boolean;
    shouldUpdate: boolean;
    
    // Missing constants
    getApiUrl() {
        return 'http://localhost:3000/api'; // Should be a constant
    }
    
    // Improper error handling
    handleError(error: any) {
        console.log(error); // Should use proper error handling
    }
    
    // Missing lifecycle hooks
    ngOnDestroy() {
        // Missing cleanup
    }
    
    // Inconsistent method naming
    fetchData() {
        // Should be getData or loadData for consistency
    }
    
    // Improper template binding
    getTemplateValue(): string {
        // Expensive operation in template
        return this.items.map(item => item.name).join(', ');
    }
    
    // Missing type safety
    processArray(arr: any[]): any[] {
        return arr.filter(item => item.active);
    }
    
    // Inconsistent async patterns
    async loadDataAsync() {
        // Mixing async/await with Observables
        const data = await this.http.get('/api/data').toPromise();
        this.items = data as any[];
    }
    
    // Missing proper interfaces
    interface User {
        name: string;
        age: number;
    }
    
    // Improper component communication
    communicateWithParent() {
        // Direct parent manipulation
        const parent = document.querySelector('app-parent');
        if (parent) {
            (parent as any).updateData(this.items);
        }
    }
    
    // Missing proper typing for events
    handleFormSubmit(event: any) {
        // Should be FormEvent
        event.preventDefault();
    }
    
    // Inconsistent null checking
    processNullableData(data: any) {
        if (data) {
            if (data.items) {
                if (data.items.length > 0) {
                    return data.items[0];
                }
            }
        }
        return null;
    }
    
    // Missing proper error types
    handleSpecificError() {
        try {
            this.http.get('/api/data').subscribe();
        } catch (error) {
            // Should handle specific error types
            console.log('An error occurred');
        }
    }
    
    // Improper use of any
    processAnyData(data: any): any {
        return data.map((item: any) => ({
            id: item.id,
            name: item.name,
            value: item.value
        }));
    }
    
    // Missing proper component structure
    // Should have separate template and styles files
    
    // Inconsistent import ordering
    // Angular imports should be first, then third-party, then local
    
    // Missing proper change detection strategy
    // Should use OnPush when possible
    
    // Improper use of ViewChild/ViewChildren
    // Missing proper element references
    
    // Missing proper service injection
    // Should inject services, not create them
    
    // Inconsistent method organization
    // Public methods should be first, then private
    
    // Missing proper encapsulation
    // Properties should be private when possible
    
    // Improper use of static methods
    static processStaticData(data: any): any {
        return data;
    }
    
    // Missing proper interfaces for component inputs
    // Should define interfaces for @Input properties
    
    // Inconsistent async error handling
    // Should handle errors consistently across async operations
    
    // Missing proper unsubscribe patterns
    // Should properly unsubscribe from Observables
    
    // Improper use of template reference variables
    // Should use proper typing for template references
    
    // Missing proper form validation
    // Should use reactive forms with proper validation
    
    // Inconsistent use of async pipe
    // Should use async pipe when possible instead of manual subscription
} 