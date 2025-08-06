// Test case: Best practices violations
// This file contains intentional best practices violations to test AI suggestions

// Missing type annotations
function processUser(user) {
    return user.name + ' ' + user.age;
}

// Using any type
let data: any = fetchData();

// Inconsistent naming conventions
const UserName = 'John';
const user_age = 30;
const userEmail = 'john@example.com';

// Magic numbers
function calculateTax(income: number): number {
    return income * 0.25; // Magic number
}

// Long function with multiple responsibilities
function processOrder(order: any): any {
    // Validate order
    if (!order.id || !order.items || order.items.length === 0) {
        throw new Error('Invalid order');
    }
    
    // Calculate total
    let total = 0;
    for (let item of order.items) {
        total += item.price * item.quantity;
    }
    
    // Apply discount
    if (total > 100) {
        total = total * 0.9;
    }
    
    // Update inventory
    for (let item of order.items) {
        updateInventory(item.id, item.quantity);
    }
    
    // Send confirmation email
    sendEmail(order.customer.email, 'Order confirmed', `Your order total is $${total}`);
    
    // Save to database
    saveOrder(order, total);
    
    return { orderId: order.id, total: total };
}

// Inconsistent error handling
function fetchUserData(id: string) {
    try {
        return api.getUser(id);
    } catch (error) {
        console.log('Error fetching user'); // Inconsistent error handling
    }
}

// Unused imports
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

// Only using Component and Input
@Component({
    selector: 'app-user',
    template: '<div>{{user.name}}</div>'
})
export class UserComponent {
    @Input() user: any;
}

// Deep nesting
function validateUser(user: any): boolean {
    if (user) {
        if (user.name) {
            if (user.email) {
                if (user.email.includes('@')) {
                    if (user.age) {
                        if (user.age > 0) {
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}

// Inconsistent return types
function getValue(condition: boolean): string | number {
    if (condition) {
        return 'success';
    } else {
        return 404;
    }
}

// Missing access modifiers
class User {
    name: string;
    email: string;
    
    constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
    }
    
    getInfo() {
        return `${this.name} (${this.email})`;
    }
} 