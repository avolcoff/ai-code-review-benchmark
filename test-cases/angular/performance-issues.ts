// Test case: Angular app with performance issues

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, interval, timer } from 'rxjs';
import { takeUntil, map, switchMap, tap } from 'rxjs/operators';

@Component({
    selector: 'app-performance-issues',
    template: `
        <div *ngFor="let item of items; trackBy: trackByFn">
            <div *ngFor="let subItem of item.subItems">
                {{ subItem.name }}
            </div>
        </div>
        <div>{{ expensiveComputation() }}</div>
        <div>{{ anotherExpensiveComputation() }}</div>
    `,
    changeDetection: ChangeDetectionStrategy.Default
})
export class PerformanceIssuesComponent implements OnInit, OnDestroy {
    
    items: any[] = [];
    private destroy$ = new Subject<void>();
    private dataCache: { [key: string]: any } = {};
    private memoryLeak: any[] = [];
    
    constructor(private http: HttpClient) {}
    
    ngOnInit() {
        this.loadData();
        this.startMemoryLeak();
        this.inefficientPolling();
        this.expensiveOperations();
    }
    
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    
    loadData() {
        // N+1 query problem
        for (let i = 0; i < 100; i++) {
            this.http.get(`/api/users/${i}`).subscribe(user => {
                this.http.get(`/api/posts/${user.id}`).subscribe(posts => {
                    this.items.push({ user, posts });
                });
            });
        }
    }
    
    trackByFn(index: number, item: any): any {
        return item.id;
    }
    
    expensiveComputation(): string {
        // Inefficient string concatenation
        let result = '';
        for (let i = 0; i < 10000; i++) {
            result += 'item' + i + ',';
        }
        return result;
    }
    
    anotherExpensiveComputation(): number {
        // Inefficient array operations
        const numbers = Array.from({ length: 10000 }, (_, i) => i);
        return numbers.filter(n => n % 2 === 0)
                     .map(n => n * 2)
                     .reduce((sum, n) => sum + n, 0);
    }
    
    inefficientPolling() {
        // Polling without proper cleanup
        interval(1000).pipe(
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.http.get('/api/status').subscribe();
        });
    }
    
    startMemoryLeak() {
        // Memory leak - adding to array without cleanup
        setInterval(() => {
            this.memoryLeak.push(new Array(1000).fill('leak'));
        }, 1000);
    }
    
    inefficientDataProcessing(data: any[]) {
        // Inefficient data processing
        const processed = [];
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data.length; j++) {
                if (data[i].id === data[j].id) {
                    processed.push(data[i]);
                }
            }
        }
        return processed;
    }
    
    expensiveTemplateBinding() {
        // Expensive operations in template
        return this.items.map(item => ({
            ...item,
            computed: this.heavyComputation(item)
        }));
    }
    
    heavyComputation(item: any): any {
        // Heavy computation called frequently
        let result = 0;
        for (let i = 0; i < 100000; i++) {
            result += Math.sqrt(i) * Math.sin(i);
        }
        return result;
    }
    
    inefficientCaching(key: string, data: any) {
        // Inefficient caching without size limits
        this.dataCache[key] = data;
        // No cleanup, cache grows indefinitely
    }
    
    expensiveDOMOperations() {
        // Expensive DOM operations
        const elements = document.querySelectorAll('.item');
        elements.forEach((el, index) => {
            el.setAttribute('data-index', index.toString());
            el.classList.add('processed');
            el.style.backgroundColor = `hsl(${index * 10}, 50%, 50%)`;
        });
    }
    
    inefficientEventHandling() {
        // Inefficient event handling
        document.addEventListener('scroll', () => {
            this.expensiveComputation();
        });
        
        document.addEventListener('resize', () => {
            this.anotherExpensiveComputation();
        });
    }
    
    expensiveAsyncOperations() {
        // Expensive async operations without proper management
        for (let i = 0; i < 50; i++) {
            this.http.get(`/api/data/${i}`).subscribe(data => {
                this.processData(data);
            });
        }
    }
    
    processData(data: any) {
        // Inefficient data processing
        const processed = [];
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data.length; j++) {
                if (data[i].id === data[j].id && i !== j) {
                    processed.push(data[i]);
                }
            }
        }
        return processed;
    }
    
    inefficientChangeDetection() {
        // Triggering change detection unnecessarily
        setInterval(() => {
            this.items = [...this.items];
        }, 100);
    }
    
    expensiveSorting(data: any[]) {
        // Inefficient sorting with complex comparison
        return data.sort((a, b) => {
            const aValue = this.computeComplexValue(a);
            const bValue = this.computeComplexValue(b);
            return aValue - bValue;
        });
    }
    
    computeComplexValue(item: any): number {
        // Complex computation for sorting
        let value = 0;
        for (let i = 0; i < 1000; i++) {
            value += Math.pow(item.id, i) * Math.cos(i);
        }
        return value;
    }
    
    inefficientObservableUsage() {
        // Inefficient Observable usage
        const source$ = interval(100);
        source$.subscribe(() => {
            this.http.get('/api/status').subscribe();
        });
        
        // Multiple subscriptions to the same Observable
        source$.subscribe(() => {
            this.http.get('/api/status').subscribe();
        });
    }
    
    expensiveTemplateExpressions() {
        // Expensive expressions in template
        return this.items.filter(item => 
            this.complexFilter(item)
        ).map(item => 
            this.complexTransform(item)
        );
    }
    
    complexFilter(item: any): boolean {
        // Complex filtering logic
        let result = false;
        for (let i = 0; i < 1000; i++) {
            result = result || (item.id % i === 0);
        }
        return result;
    }
    
    complexTransform(item: any): any {
        // Complex transformation logic
        let transformed = { ...item };
        for (let i = 0; i < 1000; i++) {
            transformed[`prop${i}`] = Math.pow(item.id, i);
        }
        return transformed;
    }
    
    inefficientMemoryUsage() {
        // Inefficient memory usage patterns
        const largeArray = new Array(1000000).fill(0);
        this.memoryLeak.push(largeArray);
        
        // Creating closures that capture large objects
        const closure = () => {
            return largeArray;
        };
        
        // Storing closures in memory
        this.memoryLeak.push(closure);
    }
    
    expensiveNetworkRequests() {
        // Expensive network requests without proper management
        for (let i = 0; i < 100; i++) {
            this.http.get(`/api/users/${i}/posts/${i}/comments/${i}`).subscribe();
        }
    }
    
    inefficientRendering() {
        // Inefficient rendering patterns
        this.items.forEach(item => {
            const element = document.createElement('div');
            element.innerHTML = this.generateComplexHTML(item);
            document.body.appendChild(element);
        });
    }
    
    generateComplexHTML(item: any): string {
        // Complex HTML generation
        let html = '';
        for (let i = 0; i < 100; i++) {
            html += `<div class="item-${i}" data-id="${item.id}">${item.name}</div>`;
        }
        return html;
    }
} 