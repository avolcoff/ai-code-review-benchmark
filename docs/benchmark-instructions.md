# Benchmark Instructions: CodeRabbit vs Greplit

This document provides step-by-step instructions for running a real benchmark test between CodeRabbit and Greplit free trials.

## Prerequisites

1. **Node.js** (v14 or higher)
2. **Git** for version control
3. **Accounts** for both CodeRabbit and Greplit free trials

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Free Trial Accounts

#### CodeRabbit
1. Visit [CodeRabbit](https://coderabbit.ai)
2. Sign up for a free trial account
3. Note your API key or access token
4. Review the free trial limitations

#### Greplit
1. Visit [Greplit](https://greplit.com)
2. Sign up for a free trial account
3. Note your API key or access token
4. Review the free trial limitations

### 3. Configure API Keys

Create a `.env` file in the root directory:

```env
# CodeRabbit Configuration
CODERABBIT_API_KEY=your_coderabbit_api_key_here
CODERABBIT_BASE_URL=https://api.coderabbit.ai

# Greplit Configuration
GREPLIT_API_KEY=your_greplit_api_key_here
GREPLIT_BASE_URL=https://api.greplit.com

# Benchmark Configuration
BENCHMARK_MODE=real
MAX_CONCURRENT_REQUESTS=2
REQUEST_TIMEOUT=30000
```

### 4. Review Test Cases

The benchmark includes test cases in the `test-cases/` directory:

- **JavaScript**: Syntax errors, security vulnerabilities
- **TypeScript**: Best practices violations
- **Python**: Performance issues
- **Java**: (Add your own test cases)

## Running the Benchmark

### Option 1: Run Simulation (Current)

```bash
npm start
```

This runs a simulated benchmark for demonstration purposes.

### Option 2: Run Real Benchmark (Requires API Integration)

To run a real benchmark, you'll need to modify the `index.js` file to integrate with actual APIs:

1. **Replace the `simulateAIResponse` method** with real API calls
2. **Add proper error handling** for API rate limits and failures
3. **Implement retry logic** for failed requests
4. **Add authentication** using your API keys

### Example API Integration

```javascript
async function callCodeRabbitAPI(testCase) {
    const response = await fetch(`${process.env.CODERABBIT_BASE_URL}/review`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.CODERABBIT_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: testCase.content,
            language: testCase.language,
            file_name: testCase.name
        })
    });
    
    return await response.json();
}
```

## Benchmark Categories

### 1. Code Quality Analysis
- **Syntax Error Detection**: Ability to identify and suggest fixes for syntax errors
- **Code Style Suggestions**: Recommendations for improving code formatting and style
- **Best Practices**: Suggestions for following language-specific best practices
- **Security Analysis**: Identification of potential security vulnerabilities

### 2. Performance Metrics
- **Response Time**: Time taken to provide code review suggestions
- **Processing Speed**: Number of files processed per minute
- **Concurrent Requests**: Ability to handle multiple simultaneous requests

### 3. Feature Comparison
- **Language Support**: Number and quality of supported programming languages
- **Integration Options**: Available integrations with IDEs and CI/CD pipelines
- **Customization**: Ability to customize review rules and preferences
- **Export Capabilities**: Options for exporting review results

### 4. User Experience
- **Interface Usability**: Ease of use and intuitiveness of the interface
- **Documentation Quality**: Clarity and comprehensiveness of documentation
- **Learning Curve**: Time required to become proficient with the tool
- **Support Responsiveness**: Quality and speed of customer support

## Scoring Methodology

Each test case is scored on a scale of 1-5:

- **1 (Poor)**: No useful suggestions or incorrect recommendations
- **2 (Fair)**: Some basic suggestions but missing important issues
- **3 (Good)**: Adequate suggestions with room for improvement
- **4 (Very Good)**: Comprehensive suggestions with few missed issues
- **5 (Excellent)**: Outstanding suggestions with high accuracy and relevance

## Weighted Scoring

The final score is calculated using weighted criteria:

- **Code Quality**: 35% of total score
- **Performance**: 25% of total score
- **Features**: 20% of total score
- **User Experience**: 20% of total score

## Interpreting Results

### Overall Score
- **4.0-5.0**: Excellent tool, highly recommended
- **3.0-3.9**: Good tool, suitable for most use cases
- **2.0-2.9**: Fair tool, consider alternatives
- **1.0-1.9**: Poor tool, not recommended

### Response Time
- **< 2 seconds**: Excellent performance
- **2-5 seconds**: Good performance
- **5-10 seconds**: Acceptable performance
- **> 10 seconds**: Poor performance

## Limitations and Considerations

### Free Trial Limitations
- **CodeRabbit**: 14-day trial, unlimited requests, 10MB file size limit
- **Greplit**: 14-day trial, 50 requests/day, 8MB file size limit

### Test Case Limitations
- Current test cases are synthetic and may not represent real-world complexity
- Results may vary based on codebase size and complexity
- Network conditions can affect performance metrics

### API Rate Limits
- Both tools may have rate limits that could affect benchmark results
- Consider running tests during off-peak hours
- Implement proper retry logic for rate-limited requests

## Customizing the Benchmark

### Adding New Test Cases
1. Create new files in the appropriate language directory
2. Include intentional issues for testing
3. Update the `categorizeTest` method in `index.js`
4. Add new categories to the configuration file

### Modifying Scoring Criteria
1. Edit `config/benchmark-config.json`
2. Adjust weights for different criteria
3. Add new scoring dimensions as needed

### Extending to Other Tools
1. Add new tool configuration to the config file
2. Implement API integration for the new tool
3. Update the benchmark runner to include the new tool

## Troubleshooting

### Common Issues
1. **API Key Errors**: Verify your API keys are correct and active
2. **Rate Limiting**: Implement delays between requests
3. **File Size Limits**: Ensure test files are within size limits
4. **Network Timeouts**: Increase timeout values for slow connections

### Getting Help
- Check the tool's official documentation
- Review API error messages for specific issues
- Contact tool support for account-related problems

## Next Steps

After running the benchmark:

1. **Review Results**: Analyze the detailed report in the `results/` directory
2. **Test with Your Codebase**: Run the tools on your actual project code
3. **Consider Team Feedback**: Get input from team members who will use the tool
4. **Evaluate Cost**: Compare pricing plans beyond the free trial
5. **Make Decision**: Choose the tool that best fits your team's needs

## Contributing

To improve this benchmark:

1. Add more realistic test cases
2. Implement real API integrations
3. Add more comprehensive scoring criteria
4. Include additional tools for comparison
5. Improve error handling and reliability 