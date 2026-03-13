#!/usr/bin/env node
// ============================================
// TEST HEALTH CHECK SCRIPT
// Analyzes test results and provides health metrics
// ============================================

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

class TestHealthChecker {
  constructor() {
    this.reportPath = path.join(__dirname, '../test-results/custom-report.json');
    this.thresholds = {
      passRate: 95,      // Minimum pass rate %
      flakyRate: 5,      // Maximum flaky rate %
      avgDuration: 30000, // Maximum avg test duration (ms)
      slowTestLimit: 30000, // Tests slower than this are flagged (ms)
    };
  }

  /**
   * Load test report
   */
  loadReport() {
    if (!fs.existsSync(this.reportPath)) {
      console.error(`${colors.red}❌ Report not found at: ${this.reportPath}${colors.reset}`);
      console.log('Run tests first: npm run test');
      process.exit(1);
    }

    const reportContent = fs.readFileSync(this.reportPath, 'utf8');
    return JSON.parse(reportContent);
  }

  /**
   * Calculate pass rate
   */
  calculatePassRate(stats) {
    const total = stats.total - stats.skipped;
    if (total === 0) return 100;
    return ((stats.passed / total) * 100).toFixed(2);
  }

  /**
   * Calculate flaky rate
   */
  calculateFlakyRate(stats) {
    if (stats.total === 0) return 0;
    return ((stats.flaky / stats.total) * 100).toFixed(2);
  }

  /**
   * Calculate average test duration
   */
  calculateAvgDuration(stats) {
    if (stats.total === 0) return 0;
    return Math.round(stats.duration / stats.total);
  }

  /**
   * Format duration
   */
  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);

    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }

  /**
   * Get status color
   */
  getStatusColor(value, threshold, invert = false) {
    const pass = invert ? value < threshold : value >= threshold;
    return pass ? colors.green : colors.red;
  }

  /**
   * Generate health report
   */
  generateReport() {
    const report = this.loadReport();
    const { stats, tagStats, failedTests, slowTests } = report;

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║          TEST HEALTH CHECK REPORT                     ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    console.log(`Report Date: ${new Date(report.timestamp).toLocaleString()}`);
    console.log(`Environment: ${report.environment}\n`);

    // Overall Health Score
    const passRate = this.calculatePassRate(stats);
    const flakyRate = this.calculateFlakyRate(stats);
    const avgDuration = this.calculateAvgDuration(stats);

    const passRateColor = this.getStatusColor(passRate, this.thresholds.passRate);
    const flakyRateColor = this.getStatusColor(flakyRate, this.thresholds.flakyRate, true);
    const durationColor = this.getStatusColor(avgDuration, this.thresholds.avgDuration, true);

    console.log('📊 Overall Health:');
    console.log(`   Pass Rate: ${passRateColor}${passRate}%${colors.reset} (threshold: ${this.thresholds.passRate}%)`);
    console.log(`   Flaky Rate: ${flakyRateColor}${flakyRate}%${colors.reset} (threshold: <${this.thresholds.flakyRate}%)`);
    console.log(`   Avg Duration: ${durationColor}${this.formatDuration(avgDuration)}${colors.reset} (threshold: <${this.formatDuration(this.thresholds.avgDuration)})\n`);

    // Test Statistics
    console.log('📈 Test Statistics:');
    console.log(`   Total: ${stats.total}`);
    console.log(`   ${colors.green}✅ Passed: ${stats.passed}${colors.reset}`);
    console.log(`   ${colors.red}❌ Failed: ${stats.failed}${colors.reset}`);
    console.log(`   ${colors.yellow}⏭️  Skipped: ${stats.skipped}${colors.reset}`);
    console.log(`   ${colors.magenta}🔄 Flaky: ${stats.flaky}${colors.reset}\n`);

    // Failed Tests
    if (failedTests.length > 0) {
      console.log(`${colors.red}❌ Failed Tests (${failedTests.length}):${colors.reset}`);
      failedTests.slice(0, 5).forEach((test, i) => {
        console.log(`   ${i + 1}. [${test.project}] ${test.title}`);
      });
      if (failedTests.length > 5) {
        console.log(`   ... and ${failedTests.length - 5} more\n`);
      } else {
        console.log('');
      }
    }

    // Slow Tests
    if (slowTests.length > 0) {
      console.log(`${colors.yellow}🐢 Slow Tests (${slowTests.length} tests >${this.formatDuration(this.thresholds.slowTestLimit)}):${colors.reset}`);
      slowTests.slice(0, 5).forEach((test, i) => {
        console.log(`   ${i + 1}. [${test.project}] ${test.title} - ${this.formatDuration(test.duration)}`);
      });
      if (slowTests.length > 5) {
        console.log(`   ... and ${slowTests.length - 5} more\n`);
      } else {
        console.log('');
      }
    }

    // Tag Performance
    if (Object.keys(tagStats).length > 0) {
      console.log('🏷️  Tag Performance (Top 5):');
      Object.entries(tagStats)
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, 5)
        .forEach(([tag, stats]) => {
          const tagPassRate = ((stats.passed / stats.total) * 100).toFixed(1);
          const color = tagPassRate >= 95 ? colors.green : tagPassRate >= 80 ? colors.yellow : colors.red;
          console.log(`   ${tag}: ${stats.total} tests (${color}${tagPassRate}% pass${colors.reset})`);
        });
      console.log('');
    }

    // Recommendations
    console.log('💡 Recommendations:');
    const recommendations = this.generateRecommendations(report);
    if (recommendations.length === 0) {
      console.log(`   ${colors.green}✅ All metrics look good!${colors.reset}\n`);
    } else {
      recommendations.forEach(rec => {
        console.log(`   ${rec.icon} ${rec.message}`);
      });
      console.log('');
    }

    // Health Score
    const healthScore = this.calculateHealthScore(report);
    const scoreColor = healthScore >= 90 ? colors.green : healthScore >= 70 ? colors.yellow : colors.red;
    console.log(`${scoreColor}Overall Health Score: ${healthScore}/100${colors.reset}\n`);

    // Exit code based on health
    if (healthScore < 70) {
      console.log(`${colors.red}⚠️  Test health is poor. Immediate action needed!${colors.reset}\n`);
      process.exit(1);
    } else if (healthScore < 90) {
      console.log(`${colors.yellow}⚠️  Test health needs attention.${colors.reset}\n`);
    } else {
      console.log(`${colors.green}✅ Test health is excellent!${colors.reset}\n`);
    }
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(report) {
    const recommendations = [];
    const { stats, failedTests, slowTests } = report;

    const passRate = this.calculatePassRate(stats);
    const flakyRate = this.calculateFlakyRate(stats);
    const avgDuration = this.calculateAvgDuration(stats);

    if (passRate < this.thresholds.passRate) {
      recommendations.push({
        icon: '🔴',
        message: `Pass rate (${passRate}%) is below threshold (${this.thresholds.passRate}%). Investigate failed tests.`
      });
    }

    if (flakyRate > this.thresholds.flakyRate) {
      recommendations.push({
        icon: '🟡',
        message: `Flaky rate (${flakyRate}%) is above threshold (${this.thresholds.flakyRate}%). Stabilize flaky tests.`
      });
    }

    if (avgDuration > this.thresholds.avgDuration) {
      recommendations.push({
        icon: '🟡',
        message: `Avg duration (${this.formatDuration(avgDuration)}) exceeds threshold. Optimize slow tests.`
      });
    }

    if (failedTests.length > 5) {
      recommendations.push({
        icon: '🔴',
        message: `${failedTests.length} tests failing. Review and fix immediately.`
      });
    }

    if (slowTests.length > 10) {
      recommendations.push({
        icon: '🟡',
        message: `${slowTests.length} slow tests detected. Consider optimization or parallelization.`
      });
    }

    return recommendations;
  }

  /**
   * Calculate overall health score
   */
  calculateHealthScore(report) {
    const { stats } = report;
    const passRate = parseFloat(this.calculatePassRate(stats));
    const flakyRate = parseFloat(this.calculateFlakyRate(stats));

    // Weighted scoring
    let score = 0;

    // Pass rate: 50% weight
    score += (passRate / 100) * 50;

    // Flaky rate: 30% weight (inverted)
    score += ((100 - (flakyRate * 2)) / 100) * 30;

    // Failed tests: 20% weight
    const failRate = (stats.failed / stats.total) * 100;
    score += ((100 - (failRate * 2)) / 100) * 20;

    return Math.max(0, Math.min(100, Math.round(score)));
  }
}

// Run health check
const checker = new TestHealthChecker();
checker.generateReport();
