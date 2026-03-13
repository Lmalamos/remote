#!/bin/bash
# ============================================
# TEST EXECUTION HELPER SCRIPTS
# ============================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🎭 Playwright Test Runner"
echo "========================"

# Function to run tests with specific tags
run_tagged_tests() {
    local tags=$1
    local name=$2
    echo -e "${GREEN}Running ${name} tests...${NC}"
    npx playwright test --grep "$tags"
}

# Function to run tests on specific project
run_project_tests() {
    local project=$1
    echo -e "${GREEN}Running tests on ${project}...${NC}"
    npx playwright test --project="$project"
}

# Parse command line arguments
case "$1" in
    smoke)
        echo "🔥 Running smoke tests..."
        run_tagged_tests "@smoke" "smoke"
        ;;
    regression)
        echo "🔄 Running regression tests..."
        run_tagged_tests "@regression" "regression"
        ;;
    api)
        echo "🌐 Running API tests..."
        run_tagged_tests "@api" "API"
        ;;
    visual)
        echo "👁️ Running visual regression tests..."
        run_tagged_tests "@visual" "visual"
        ;;
    fast)
        echo "⚡ Running fast tests only..."
        run_tagged_tests "@fast" "fast"
        ;;
    critical)
        echo "🔴 Running critical (P0) tests..."
        run_tagged_tests "@p0" "P0"
        ;;
    chrome)
        echo "🌐 Running tests on Chrome..."
        run_project_tests "chromium"
        ;;
    firefox)
        echo "🦊 Running tests on Firefox..."
        run_project_tests "firefox"
        ;;
    webkit)
        echo "🧭 Running tests on WebKit..."
        run_project_tests "webkit"
        ;;
    all)
        echo "🚀 Running all tests..."
        npx playwright test
        ;;
    ci)
        echo "🤖 Running CI test suite..."
        export CI=true
        npx playwright test --project=chromium --grep "@smoke|@p0"
        ;;
    parallel)
        echo "⚡ Running tests in parallel with sharding..."
        npx playwright test --shard=1/4 &
        npx playwright test --shard=2/4 &
        npx playwright test --shard=3/4 &
        npx playwright test --shard=4/4 &
        wait
        ;;
    report)
        echo "📊 Opening test report..."
        npx playwright show-report
        ;;
    *)
        echo "Usage: $0 {smoke|regression|api|visual|fast|critical|chrome|firefox|webkit|all|ci|parallel|report}"
        echo ""
        echo "Examples:"
        echo "  $0 smoke     - Run smoke tests"
        echo "  $0 api       - Run API tests"
        echo "  $0 chrome    - Run tests on Chrome"
        echo "  $0 ci        - Run CI test suite"
        echo "  $0 report    - Open test report"
        exit 1
        ;;
esac

exit_code=$?

if [ $exit_code -eq 0 ]; then
    echo -e "${GREEN}✅ Tests completed successfully!${NC}"
else
    echo -e "${RED}❌ Tests failed!${NC}"
fi

exit $exit_code
