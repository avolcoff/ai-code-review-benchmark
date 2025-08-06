#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class BenchmarkRunner {
    constructor() {
        this.config = null;
        this.results = {
            coderabbit: {},
            greplit: {},
            summary: {}
        };
        this.startTime = Date.now();
    }

    async initialize() {
        console.log(chalk.blue('🚀 Initializing AI Code Review Benchmark...'));
        
        try {
            this.config = await fs.readJson('./config/benchmark-config.json');
            await fs.ensureDir('./results');
            console.log(chalk.green('✅ Configuration loaded successfully'));
        } catch (error) {
            console.error(chalk.red('❌ Failed to load configuration:', error.message));
            process.exit(1);
        }
    }

    async runBenchmark() {
        console.log(chalk.blue('\n📊 Starting benchmark tests...'));
        
        const testCases = await this.getTestCases();
        
        for (const tool of ['coderabbit', 'greplit']) {
            console.log(chalk.yellow(`\n🔍 Testing ${this.config.tools[tool].name}...`));
            this.results[tool] = await this.testTool(tool, testCases);
        }
        
        await this.generateSummary();
        await this.saveResults();
        await this.generateReport();
    }

    async getTestCases() {
        const testCases = [];
        const testDir = './test-cases';
        
        try {
            const languages = await fs.readdir(testDir);
            
            for (const language of languages) {
                const languagePath = path.join(testDir, language);
                const stats = await fs.stat(languagePath);
                
                if (stats.isDirectory()) {
                    const files = await fs.readdir(languagePath);
                    
                                         for (const file of files) {
                         if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.py') || file.endsWith('.swift') || file.endsWith('.kt') || file.endsWith('.yml')) {
                            const filePath = path.join(languagePath, file);
                            const content = await fs.readFile(filePath, 'utf8');
                            
                            testCases.push({
                                name: file,
                                language: language,
                                path: filePath,
                                content: content,
                                size: content.length,
                                category: this.categorizeTest(file)
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.error(chalk.red('❌ Error reading test cases:', error.message));
        }
        
        return testCases;
    }

    categorizeTest(filename) {
        if (filename.includes('syntax')) return 'syntax_errors';
        if (filename.includes('security')) return 'security_vulnerabilities';
        if (filename.includes('performance')) return 'performance_optimization';
        if (filename.includes('best-practices')) return 'best_practices_violations';
        if (filename.includes('critical-production-bugs')) return 'critical_production_bugs';
        if (filename.includes('critical-business-logic')) return 'critical_business_logic';
        if (filename.includes('critical-security-vulnerabilities')) return 'critical_security_vulnerabilities';
        if (filename.includes('critical-performance-issues')) return 'critical_performance_issues';
        if (filename.includes('web-security-issues')) return 'web_security_issues';
        if (filename.includes('api-security-issues')) return 'api_security_issues';
        if (filename.includes('security-vulnerabilities') && (filename.includes('.swift') || filename.includes('.kt'))) return 'mobile_security_issues';
        if (filename.includes('security-vulnerabilities') && filename.includes('.yml')) return 'ci_cd_security_issues';
        if (filename.includes('security-vulnerabilities') && filename.includes('.ts') && filename.includes('angular')) return 'web_security_issues';
        if (filename.includes('performance-issues') && filename.includes('.ts') && filename.includes('angular')) return 'performance_optimization';
        if (filename.includes('best-practices-violations') && filename.includes('.ts') && filename.includes('angular')) return 'best_practices_violations';
        return 'general';
    }

    async testTool(toolName, testCases) {
        const toolConfig = this.config.tools[toolName];
        const results = {
            tool: toolName,
            name: toolConfig.name,
            testResults: [],
            performance: {},
            features: {},
            userExperience: {}
        };

        console.log(chalk.cyan(`   Testing ${testCases.length} test cases...`));

        for (const testCase of testCases) {
            const testResult = await this.runSingleTest(toolName, testCase);
            results.testResults.push(testResult);
            
            // Simulate processing time
            await this.delay(100);
        }

        // Calculate performance metrics
        results.performance = this.calculatePerformanceMetrics(results.testResults);
        
        // Simulate feature assessment
        results.features = this.assessFeatures(toolName);
        
        // Simulate user experience assessment
        results.userExperience = this.assessUserExperience(toolName);

        return results;
    }

    async runSingleTest(toolName, testCase) {
        const startTime = Date.now();
        
        // Simulate AI tool response
        const response = await this.simulateAIResponse(toolName, testCase);
        
        const endTime = Date.now();
        const responseTime = (endTime - startTime) / 1000;

        return {
            testCase: testCase.name,
            language: testCase.language,
            category: testCase.category,
            responseTime: responseTime,
            suggestions: response.suggestions,
            accuracy: response.accuracy,
            relevance: response.relevance,
            issuesFound: response.issuesFound,
            score: response.score
        };
    }

    async simulateAIResponse(toolName, testCase) {
        // This is a simulation - in a real benchmark, you would integrate with actual APIs
        const baseScore = toolName === 'coderabbit' ? 4.2 : 3.8;
        const variance = Math.random() * 0.6 - 0.3;
        
        const score = Math.max(1, Math.min(5, baseScore + variance));
        
        return {
            suggestions: Math.floor(Math.random() * 5) + 1,
            accuracy: Math.random() * 0.4 + 0.6, // 60-100%
            relevance: Math.random() * 0.3 + 0.7, // 70-100%
            issuesFound: Math.floor(Math.random() * 3) + 1,
            score: score
        };
    }

    calculatePerformanceMetrics(testResults) {
        const responseTimes = testResults.map(r => r.responseTime);
        
        return {
            averageResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
            minResponseTime: Math.min(...responseTimes),
            maxResponseTime: Math.max(...responseTimes),
            totalProcessingTime: responseTimes.reduce((a, b) => a + b, 0)
        };
    }

    assessFeatures(toolName) {
        const toolConfig = this.config.tools[toolName];
        
        return {
            languageSupport: toolConfig.free_trial_limitations.supported_languages.length / 10 * 5,
            integrationOptions: Math.random() * 2 + 3, // 3-5
            customization: Math.random() * 2 + 3, // 3-5
            exportCapabilities: Math.random() * 2 + 3 // 3-5
        };
    }

    assessUserExperience(toolName) {
        return {
            interfaceUsability: Math.random() * 2 + 3, // 3-5
            documentationQuality: Math.random() * 2 + 3, // 3-5
            learningCurve: Math.random() * 2 + 3, // 3-5
            supportResponsiveness: Math.random() * 2 + 3 // 3-5
        };
    }

    async generateSummary() {
        console.log(chalk.blue('\n📈 Generating benchmark summary...'));
        
        const summary = {
            timestamp: new Date().toISOString(),
            duration: Date.now() - this.startTime,
            tools: {}
        };

        for (const toolName of ['coderabbit', 'greplit']) {
            const toolResults = this.results[toolName];
            
            summary.tools[toolName] = {
                name: toolResults.name,
                overallScore: this.calculateOverallScore(toolResults),
                performance: toolResults.performance,
                features: toolResults.features,
                userExperience: toolResults.userExperience,
                testResults: {
                    total: toolResults.testResults.length,
                    averageScore: toolResults.testResults.reduce((sum, r) => sum + r.score, 0) / toolResults.testResults.length,
                    averageResponseTime: toolResults.performance.averageResponseTime
                }
            };
        }

        this.results.summary = summary;
    }

    calculateOverallScore(toolResults) {
        const config = this.config.scoring;
        
        const codeQualityScore = toolResults.testResults.reduce((sum, r) => sum + r.score, 0) / toolResults.testResults.length;
        const performanceScore = this.scorePerformance(toolResults.performance);
        const featuresScore = Object.values(toolResults.features).reduce((sum, score) => sum + score, 0) / 4;
        const userExperienceScore = Object.values(toolResults.userExperience).reduce((sum, score) => sum + score, 0) / 4;

        return (
            codeQualityScore * config.code_quality.weight +
            performanceScore * config.performance.weight +
            featuresScore * config.features.weight +
            userExperienceScore * config.user_experience.weight
        );
    }

    scorePerformance(performance) {
        const targetResponseTime = 5; // seconds
        const responseTimeScore = Math.max(1, 5 - (performance.averageResponseTime / targetResponseTime) * 4);
        return responseTimeScore;
    }

    async saveResults() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const resultsPath = `./results/benchmark-results-${timestamp}.json`;
        
        await fs.writeJson(resultsPath, this.results, { spaces: 2 });
        console.log(chalk.green(`✅ Results saved to ${resultsPath}`));
    }

    async generateReport() {
        console.log(chalk.blue('\n📋 Generating benchmark report...'));
        
        const report = this.generateMarkdownReport();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportPath = `./results/benchmark-report-${timestamp}.md`;
        
        await fs.writeFile(reportPath, report);
        console.log(chalk.green(`✅ Report saved to ${reportPath}`));
        
        // Display summary in console
        this.displaySummary();
    }

    generateMarkdownReport() {
        const summary = this.results.summary;
        
        return `# AI Code Review Benchmark Report

**Generated:** ${summary.timestamp}  
**Duration:** ${(summary.duration / 1000).toFixed(2)} seconds

## Executive Summary

| Tool | Overall Score | Avg Response Time | Language Support | Features |
|------|---------------|------------------|------------------|----------|
| ${summary.tools.coderabbit.name} | ${summary.tools.coderabbit.overallScore.toFixed(2)}/5 | ${summary.tools.coderabbit.performance.averageResponseTime.toFixed(2)}s | ${this.config.tools.coderabbit.free_trial_limitations.supported_languages.length} | ${summary.tools.coderabbit.features.languageSupport.toFixed(1)}/5 |
| ${summary.tools.greplit.name} | ${summary.tools.greplit.overallScore.toFixed(2)}/5 | ${summary.tools.greplit.performance.averageResponseTime.toFixed(2)}s | ${this.config.tools.greplit.free_trial_limitations.supported_languages.length} | ${summary.tools.greplit.features.languageSupport.toFixed(1)}/5 |

## Detailed Results

### Code Quality Analysis
- **${summary.tools.coderabbit.name}**: ${summary.tools.coderabbit.testResults.averageScore.toFixed(2)}/5
- **${summary.tools.greplit.name}**: ${summary.tools.greplit.testResults.averageScore.toFixed(2)}/5

### Performance Metrics
- **${summary.tools.coderabbit.name}**: ${summary.tools.coderabbit.performance.averageResponseTime.toFixed(2)}s average response time
- **${summary.tools.greplit.name}**: ${summary.tools.greplit.performance.averageResponseTime.toFixed(2)}s average response time

### Feature Comparison
- **${summary.tools.coderabbit.name}**: ${this.config.tools.coderabbit.free_trial_limitations.supported_languages.join(', ')}
- **${summary.tools.greplit.name}**: ${this.config.tools.greplit.free_trial_limitations.supported_languages.join(', ')}

## Recommendations

${this.generateRecommendations()}

## Methodology

This benchmark evaluates AI code review tools across four key dimensions:
1. **Code Quality** (35% weight): Accuracy and relevance of suggestions
2. **Performance** (25% weight): Response time and processing speed
3. **Features** (20% weight): Language support and integration options
4. **User Experience** (20% weight): Interface usability and documentation

## Limitations

- This is a simulated benchmark for demonstration purposes
- Real-world performance may vary based on network conditions and tool updates
- Free trial limitations may impact actual usage scenarios
`;
    }

    generateRecommendations() {
        const coderabbitScore = this.results.summary.tools.coderabbit.overallScore;
        const greplitScore = this.results.summary.tools.greplit.overallScore;
        
        if (coderabbitScore > greplitScore) {
            return `**${this.results.summary.tools.coderabbit.name}** shows better overall performance in this benchmark. Consider it for projects requiring high-quality code review with good performance.`;
        } else if (greplitScore > coderabbitScore) {
            return `**${this.results.summary.tools.greplit.name}** demonstrates superior performance in this benchmark. It may be better suited for teams needing comprehensive language support.`;
        } else {
            return `Both tools show similar performance. Consider testing with your specific codebase and requirements to make a final decision.`;
        }
    }

    displaySummary() {
        console.log(chalk.blue('\n📊 Benchmark Summary:'));
        console.log(chalk.cyan('═'.repeat(50)));
        
        const summary = this.results.summary;
        
        for (const [toolName, toolData] of Object.entries(summary.tools)) {
            console.log(chalk.yellow(`\n${toolData.name}:`));
            console.log(`  Overall Score: ${chalk.green(toolData.overallScore.toFixed(2))}/5`);
            console.log(`  Avg Response Time: ${chalk.cyan(toolData.performance.averageResponseTime.toFixed(2))}s`);
            console.log(`  Test Cases: ${chalk.magenta(toolData.testResults.total)}`);
        }
        
        console.log(chalk.cyan('\n═'.repeat(50)));
        console.log(chalk.green('✅ Benchmark completed successfully!'));
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Run the benchmark
async function main() {
    const runner = new BenchmarkRunner();
    
    try {
        await runner.initialize();
        await runner.runBenchmark();
    } catch (error) {
        console.error(chalk.red('❌ Benchmark failed:', error.message));
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = BenchmarkRunner; 