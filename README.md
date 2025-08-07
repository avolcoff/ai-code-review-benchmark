# AI Code Review Benchmark - Real Code Edition

This repository contains a mix of good and bad code to benchmark AI code review tools like CodeRabbit and Greptile against real critical issues.

## 🎯 Purpose

Test how well AI code review tools can identify:
- **Critical Security Vulnerabilities**
- **Performance Issues**
- **Code Quality Problems**
- **Best Practice Violations**

## 📁 Repository Structure

```
src/
├── good-code/
│   └── user-service.js          # Well-written, secure code
└── bad-code/
    ├── security-vulnerabilities.js  # Critical security issues
    └── performance-issues.js        # Performance problems
```

## 🔍 Critical Issues to Detect

### Security Vulnerabilities (`src/bad-code/security-vulnerabilities.js`)

1. **SQL Injection**
   - Line 25: `const query = \`SELECT * FROM users WHERE id = ${userId}\`;`
   - Line 32: `const query = \`SELECT * FROM users WHERE name LIKE '%${searchTerm}%'\`;`

2. **Weak Password Hashing**
   - Line 40: Using MD5 instead of bcrypt

3. **Command Injection**
   - Line 58: `const command = \`convert ${imagePath} output.jpg\`;`

4. **Path Traversal**
   - Line 65: `return fs.readFileSync(filePath, 'utf8');`

5. **XSS Vulnerability**
   - Line 75: Direct user input in HTML output

6. **Insecure JWT Implementation**
   - Line 95: Including password in JWT payload
   - Line 100: Weak JWT secret

7. **Hardcoded Credentials**
   - Line 8: Database credentials in code
   - Line 15: Admin password in code

8. **Insecure Deserialization**
   - Line 165: Using `eval()` for deserialization

### Performance Issues (`src/bad-code/performance-issues.js`)

1. **N+1 Query Problem**
   - Line 12: Database query inside loop

2. **Memory Leaks**
   - Line 30: Unbounded cache in global variable

3. **Synchronous Operations**
   - Line 40: `fs.readFileSync()` in async function

4. **Inefficient Database Usage**
   - Line 50: Loading all users to find one by email

5. **Blocking Operations**
   - Line 60: CPU-intensive loop blocking event loop

## ✅ Good Code Examples (`src/good-code/user-service.js`)

- Proper input validation
- Secure password hashing with bcrypt
- Parameterized queries
- Proper error handling
- JWT with secure implementation
- Authorization checks
- Input sanitization

## 🚀 How to Benchmark

### 1. Setup GitHub Repository

1. Fork this repository
2. Install CodeRabbit and Greptile GitHub apps
3. Enable them on your fork

### 2. Create Test Pull Requests

Create separate PRs for each file to test the tools:

```bash
# Test security vulnerabilities
git checkout -b test-security-vulnerabilities
git add src/bad-code/security-vulnerabilities.js
git commit -m "Add security vulnerability test file"
git push origin test-security-vulnerabilities

# Test performance issues
git checkout -b test-performance-issues
git add src/bad-code/performance-issues.js
git commit -m "Add performance issues test file"
git push origin test-performance-issues

# Test good code (should have minimal issues)
git checkout -b test-good-code
git add src/good-code/user-service.js
git commit -m "Add good code example"
git push origin test-good-code
```

### 3. Evaluate Results

For each PR, check:

**CodeRabbit Analysis:**
- How many critical issues were detected?
- Were false positives reported?
- Quality of suggestions provided?

**Greptile Analysis:**
- How many critical issues were detected?
- Were false positives reported?
- Quality of suggestions provided?

## 📊 Benchmark Metrics

### Security Detection
- **SQL Injection**: Should be detected as critical
- **Command Injection**: Should be detected as critical
- **XSS**: Should be detected as critical
- **Hardcoded Credentials**: Should be detected as high/critical
- **Weak Hashing**: Should be detected as high/critical

### Performance Detection
- **N+1 Queries**: Should be detected as performance issue
- **Memory Leaks**: Should be detected as potential issue
- **Blocking Operations**: Should be detected as performance concern

### False Positive Rate
- Good code should have minimal issues flagged
- Tools should distinguish between real issues and acceptable patterns

## 🎯 Expected Results

### CodeRabbit Should Detect:
- SQL injection vulnerabilities
- Command injection
- Hardcoded credentials
- Weak password hashing
- XSS vulnerabilities

### Greptile Should Detect:
- Similar security issues
- Performance problems
- Code quality issues

## 📈 Scoring Criteria

| Issue Type | Critical | High | Medium | Low |
|------------|----------|------|--------|-----|
| SQL Injection | ✅ | | | |
| Command Injection | ✅ | | | |
| XSS | ✅ | | | |
| Hardcoded Credentials | ✅ | | | |
| Weak Hashing | ✅ | | | |
| N+1 Queries | | ✅ | | |
| Memory Leaks | | ✅ | | |
| Inefficient Operations | | | ✅ | |

## 🔧 Customization

You can add more test files with different types of issues:

- **Authentication Bypass**
- **Authorization Issues**
- **Data Exposure**
- **Insecure Dependencies**
- **Logging Vulnerabilities**

## 📝 Reporting

After testing, document:

1. **Issues Detected**: List all issues found by each tool
2. **False Positives**: Issues flagged that aren't actually problems
3. **Missed Issues**: Critical issues that weren't detected
4. **Suggestion Quality**: How helpful were the suggested fixes
5. **Response Time**: How quickly did the tools provide analysis

## 🤝 Contributing

Feel free to add more test cases or improve existing ones. The goal is to create a comprehensive benchmark that reflects real-world scenarios.

## 📄 License

MIT License - feel free to use this for your own benchmarking needs. 