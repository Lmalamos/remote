// ============================================
// CUSTOM PLAYWRIGHT REPORTER
// ============================================
import {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult,
} from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface TestStats {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
  duration: number;
}

interface TagStats {
  [tag: string]: {
    total: number;
    passed: number;
    failed: number;
  };
}

class CustomReporter implements Reporter {
  private stats: TestStats = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    flaky: 0,
    duration: 0,
  };

  private tagStats: TagStats = {};
  private failedTests: Array<{ title: string; error: string; project: string }> = [];
  private slowTests: Array<{ title: string; duration: number; project: string }> = [];
  private startTime: number = 0;

  onBegin(config: FullConfig, suite: Suite) {
    this.startTime = Date.now();
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║        PLAYWRIGHT TEST EXECUTION STARTED             ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    console.log(`Environment: ${process.env.TEST_ENV || 'stage'}`);
    console.log(`Workers: ${config.workers}`);
    console.log(`Timeout: ${config.timeout}ms`);
    console.log(`Total tests: ${suite.allTests().length}\n`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    this.stats.total++;
    this.stats.duration += result.duration;

    // Track test status
    if (result.status === 'passed') {
      this.stats.passed++;
    } else if (result.status === 'failed') {
      this.stats.failed++;
      this.failedTests.push({
        title: test.title,
        error: result.error?.message || 'Unknown error',
        project: test.parent.project()?.name || 'unknown',
      });
    } else if (result.status === 'skipped') {
      this.stats.skipped++;
    } else if (result.status === 'timedOut') {
      this.stats.failed++;
      this.failedTests.push({
        title: test.title,
        error: 'Test timed out',
        project: test.parent.project()?.name || 'unknown',
      });
    }

    // Track flaky tests
    if (result.retry > 0 && result.status === 'passed') {
      this.stats.flaky++;
    }

    // Track slow tests (> 30 seconds)
    if (result.duration > 30000) {
      this.slowTests.push({
        title: test.title,
        duration: result.duration,
        project: test.parent.project()?.name || 'unknown',
      });
    }

    // Track tag statistics
    const tags = this.extractTags(test.title);
    tags.forEach(tag => {
      if (!this.tagStats[tag]) {
        this.tagStats[tag] = { total: 0, passed: 0, failed: 0 };
      }
      this.tagStats[tag].total++;
      if (result.status === 'passed') {
        this.tagStats[tag].passed++;
      } else if (result.status === 'failed') {
        this.tagStats[tag].failed++;
      }
    });
  }

  onEnd(result: FullResult) {
    const endTime = Date.now();
    const totalDuration = endTime - this.startTime;

    console.log('\n\n╔════════════════════════════════════════════════════════╗');
    console.log('║            TEST EXECUTION SUMMARY                     ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    // Overall statistics
    console.log('📊 Overall Statistics:');
    console.log(`   Total Tests: ${this.stats.total}`);
    console.log(`   ✅ Passed: ${this.stats.passed} (${this.percentage(this.stats.passed, this.stats.total)}%)`);
    console.log(`   ❌ Failed: ${this.stats.failed} (${this.percentage(this.stats.failed, this.stats.total)}%)`);
    console.log(`   ⏭️  Skipped: ${this.stats.skipped}`);
    console.log(`   🔄 Flaky: ${this.stats.flaky}`);
    console.log(`   ⏱️  Duration: ${this.formatDuration(totalDuration)}`);
    console.log(`   📈 Success Rate: ${this.percentage(this.stats.passed, this.stats.total - this.stats.skipped)}%\n`);

    // Failed tests
    if (this.failedTests.length > 0) {
      console.log('❌ Failed Tests:');
      this.failedTests.forEach((test, index) => {
        console.log(`   ${index + 1}. [${test.project}] ${test.title}`);
        console.log(`      Error: ${test.error.split('\n')[0]}`);
      });
      console.log('');
    }

    // Slow tests
    if (this.slowTests.length > 0) {
      console.log('🐢 Slow Tests (>30s):');
      this.slowTests
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 5)
        .forEach((test, index) => {
          console.log(`   ${index + 1}. [${test.project}] ${test.title} - ${this.formatDuration(test.duration)}`);
        });
      console.log('');
    }

    // Tag statistics
    if (Object.keys(this.tagStats).length > 0) {
      console.log('🏷️  Tag Statistics:');
      Object.entries(this.tagStats)
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, 10)
        .forEach(([tag, stats]) => {
          const passRate = this.percentage(stats.passed, stats.total);
          console.log(`   ${tag}: ${stats.total} tests (${passRate}% pass rate)`);
        });
      console.log('');
    }

    // Generate JSON report
    this.generateJSONReport(result, totalDuration);

    // Generate HTML summary
    this.generateHTMLSummary(result, totalDuration);

    // Final status
    if (result.status === 'passed') {
      console.log('✅ Test run completed successfully!\n');
    } else {
      console.log('❌ Test run completed with failures.\n');
    }
  }

  private extractTags(title: string): string[] {
    const tagRegex = /@[\w-]+/g;
    return title.match(tagRegex) || [];
  }

  private percentage(value: number, total: number): string {
    if (total === 0) return '0.00';
    return ((value / total) * 100).toFixed(2);
  }

  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  private generateJSONReport(result: FullResult, totalDuration: number) {
    const report = {
      timestamp: new Date().toISOString(),
      environment: process.env.TEST_ENV || 'stage',
      status: result.status,
      duration: totalDuration,
      stats: this.stats,
      tagStats: this.tagStats,
      failedTests: this.failedTests,
      slowTests: this.slowTests,
    };

    const reportDir = 'test-results';
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(reportDir, 'custom-report.json'),
      JSON.stringify(report, null, 2)
    );
  }

  private generateHTMLSummary(result: FullResult, totalDuration: number) {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Test Report Summary</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
    .stat-card { background: #f9f9f9; padding: 15px; border-radius: 4px; border-left: 4px solid #4CAF50; }
    .stat-card.failed { border-left-color: #f44336; }
    .stat-card.warning { border-left-color: #ff9800; }
    .stat-label { font-size: 12px; color: #666; text-transform: uppercase; }
    .stat-value { font-size: 32px; font-weight: bold; color: #333; }
    .failed-tests { background: #fff3f3; padding: 15px; border-radius: 4px; margin: 20px 0; }
    .test-item { margin: 10px 0; padding: 10px; background: white; border-left: 3px solid #f44336; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎭 Test Execution Report</h1>
    <p>Generated: ${new Date().toLocaleString()}</p>
    <p>Environment: ${process.env.TEST_ENV || 'stage'}</p>

    <div class="stats">
      <div class="stat-card">
        <div class="stat-label">Total Tests</div>
        <div class="stat-value">${this.stats.total}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Passed</div>
        <div class="stat-value" style="color: #4CAF50;">${this.stats.passed}</div>
      </div>
      <div class="stat-card failed">
        <div class="stat-label">Failed</div>
        <div class="stat-value" style="color: #f44336;">${this.stats.failed}</div>
      </div>
      <div class="stat-card warning">
        <div class="stat-label">Flaky</div>
        <div class="stat-value" style="color: #ff9800;">${this.stats.flaky}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Success Rate</div>
        <div class="stat-value">${this.percentage(this.stats.passed, this.stats.total - this.stats.skipped)}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Duration</div>
        <div class="stat-value" style="font-size: 24px;">${this.formatDuration(totalDuration)}</div>
      </div>
    </div>

    ${this.failedTests.length > 0 ? `
    <div class="failed-tests">
      <h2>❌ Failed Tests</h2>
      ${this.failedTests.map(test => `
        <div class="test-item">
          <strong>[${test.project}] ${test.title}</strong><br>
          <span style="color: #666;">${test.error.split('\n')[0]}</span>
        </div>
      `).join('')}
    </div>
    ` : ''}
  </div>
</body>
</html>
    `;

    const reportDir = 'test-results';
    fs.writeFileSync(path.join(reportDir, 'summary.html'), html);
  }
}

export default CustomReporter;
