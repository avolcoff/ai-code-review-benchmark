# AI Code Review Benchmark: CodeRabbit vs Greplit

This project provides a structured benchmark test to compare the free trial offerings of CodeRabbit and Greplit for AI-powered code review capabilities.

## Overview

The benchmark evaluates both tools across multiple dimensions:
- **Code Review Quality**: Accuracy, relevance, and helpfulness of suggestions
- **Performance**: Response time and processing speed
- **Feature Set**: Available capabilities in free tier
- **User Experience**: Interface usability and workflow integration
- **Limitations**: Restrictions and constraints of free trials

## Project Structure

```
ai-code-review-benchmark/
├── test-cases/           # Sample code files for testing
├── results/             # Benchmark results and reports
├── scripts/             # Automation scripts
├── docs/               # Documentation and guidelines
└── config/             # Configuration files
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up test environment**:
   - Create accounts for both CodeRabbit and Greplit free trials
   - Configure API keys/access tokens if required
   - Review the test cases in `test-cases/` directory

3. **Run benchmark tests**:
   ```bash
   npm start
   ```

4. **Generate reports**:
   ```bash
   npm run generate-report
   ```

## Test Categories

### 1. Code Quality Analysis
- Syntax error detection
- Code style suggestions
- Best practices recommendations
- Security vulnerability identification
- **Critical production-blocking bugs** (Authentication bypass, SQL injection, memory leaks)
- **Critical business logic errors** (Financial calculation errors, data corruption)
- **Critical security vulnerabilities** (XSS, path traversal, command injection)
- **Critical performance issues** (Infinite loops, memory exhaustion, N+1 queries)

### 2. Performance Metrics
- Response time for code review
- Processing speed for different file sizes
- Concurrent request handling

### 3. Feature Comparison
- Supported programming languages
- Integration capabilities
- Customization options
- Export/import functionality

### 4. User Experience
- Interface intuitiveness
- Documentation quality
- Learning curve
- Support responsiveness

## Benchmark Methodology

Each test case is evaluated using a standardized scoring system:
- **Score 1-5**: Poor to Excellent
- **Response Time**: Measured in seconds
- **Accuracy**: Percentage of correct suggestions
- **Relevance**: How applicable the suggestions are

### Critical Bug Detection
The benchmark includes **production-blocking bugs** that would prevent deployment:
- **Authentication bypasses** that grant unauthorized access
- **SQL injection vulnerabilities** that could lead to data breaches
- **Memory leaks** that would crash production servers
- **Infinite loops** that block the main thread
- **Financial calculation errors** that could cause monetary losses
- **Security vulnerabilities** that could compromise the entire system

## Contributing

To add new test cases or improve the benchmark:
1. Add test files to `test-cases/`
2. Update scoring criteria in `config/benchmark-config.json`
3. Run tests and update documentation

## License

MIT License - feel free to use and modify for your own benchmarking needs. 