#!/bin/bash

# C4ISR Military Tracking System v2.0.0 - Installation Script
# Enhanced Military-Grade Flight Tracking and Analysis Application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check system requirements
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Node.js
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        print_success "Node.js found: v$NODE_VERSION"
        
        # Check if version is >= 16.0.0
        if [ "$(printf '%s\n' "16.0.0" "$NODE_VERSION" | sort -V | head -n1)" = "16.0.0" ]; then
            print_success "Node.js version is compatible"
        else
            print_error "Node.js version $NODE_VERSION is too old. Please upgrade to 16.0.0 or higher."
            exit 1
        fi
    else
        print_error "Node.js not found. Please install Node.js 16.0.0 or higher."
        print_status "Visit: https://nodejs.org/"
        exit 1
    fi
    
    # Check npm
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        print_success "npm found: v$NPM_VERSION"
    else
        print_error "npm not found. Please install npm."
        exit 1
    fi
    
    # Check if we're in a web browser environment (for manual installation)
    if [ -z "$BROWSER" ]; then
        print_warning "This script is designed for server-side installation."
        print_status "For browser-only usage, simply open c4isr-v2.html in a modern web browser."
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ -f "package.json" ]; then
        npm install
        print_success "Dependencies installed successfully"
    else
        print_warning "package.json not found. Skipping npm dependencies."
        print_status "The application will use CDN-hosted libraries."
    fi
}

# Function to create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p js
    mkdir -p styles
    mkdir -p docs
    mkdir -p tests
    
    print_success "Directories created successfully"
}

# Function to check file structure
check_file_structure() {
    print_status "Checking file structure..."
    
    REQUIRED_FILES=(
        "c4isr-v2.html"
        "js/config.js"
        "js/app-v2.js"
        "js/data-sources-v2.js"
        "js/map-controller-v2.js"
        "README-v2.md"
        "package.json"
    )
    
    MISSING_FILES=()
    
    for file in "${REQUIRED_FILES[@]}"; do
        if [ ! -f "$file" ]; then
            MISSING_FILES+=("$file")
        fi
    done
    
    if [ ${#MISSING_FILES[@]} -eq 0 ]; then
        print_success "All required files found"
    else
        print_error "Missing required files:"
        for file in "${MISSING_FILES[@]}"; do
            echo "  - $file"
        done
        exit 1
    fi
}

# Function to set up development environment
setup_dev_environment() {
    print_status "Setting up development environment..."
    
    # Create .gitignore if it doesn't exist
    if [ ! -f ".gitignore" ]; then
        cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Grunt intermediate storage
.grunt

# Bower dependency directory
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons
build/Release

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs
*.log

# Temporary files
tmp/
temp/
EOF
        print_success ".gitignore created"
    fi
    
    # Create basic test structure
    if [ ! -f "tests/test.js" ]; then
        mkdir -p tests
        cat > tests/test.js << EOF
// Basic test file for C4ISR System
// Add your tests here

console.log('C4ISR System tests initialized');

// Example test
function testConfig() {
    console.log('Testing configuration...');
    // Add your test logic here
}

// Run tests
testConfig();
EOF
        print_success "Basic test structure created"
    fi
}

# Function to display installation summary
show_summary() {
    echo
    print_success "C4ISR Military Tracking System v2.0.0 installation completed!"
    echo
    echo "📁 Installation Directory: $(pwd)"
    echo "🌐 Main Application: c4isr-v2.html"
    echo "📚 Documentation: README-v2.md"
    echo
    echo "🚀 Quick Start Options:"
    echo "  1. Open c4isr-v2.html in a web browser"
    echo "  2. Run: npm start (for development server)"
    echo "  3. Run: npm run dev (for development with CORS)"
    echo
    echo "🔧 Development Commands:"
    echo "  npm start     - Start development server"
    echo "  npm run dev   - Start development server with CORS"
    echo "  npm run lint  - Run ESLint"
    echo "  npm run format - Format code with Prettier"
    echo
    echo "⚠️  Important Notes:"
    echo "  - This system is designed for military and defense applications"
    echo "  - Users are responsible for compliance with local laws and regulations"
    echo "  - GPS jamming features require proper authorization"
    echo
    echo "📖 For detailed documentation, see README-v2.md"
    echo "🆘 For support, check the documentation or create an issue"
}

# Function to start the application
start_application() {
    print_status "Starting C4ISR Military Tracking System..."
    
    if command_exists npm; then
        print_status "Starting development server..."
        npm start
    else
        print_warning "npm not available. Please open c4isr-v2.html in a web browser."
    fi
}

# Main installation function
main() {
    echo "🚀 C4ISR Military Tracking System v2.0.0 - Installation"
    echo "=================================================="
    echo
    
    # Check if user wants to start the application
    START_APP=false
    if [ "$1" = "--start" ]; then
        START_APP=true
    fi
    
    # Run installation steps
    check_requirements
    check_file_structure
    create_directories
    install_dependencies
    setup_dev_environment
    
    # Show summary
    show_summary
    
    # Start application if requested
    if [ "$START_APP" = true ]; then
        start_application
    fi
}

# Function to show help
show_help() {
    echo "C4ISR Military Tracking System v2.0.0 - Installation Script"
    echo
    echo "Usage: $0 [OPTIONS]"
    echo
    echo "Options:"
    echo "  --start    Install and start the application"
    echo "  --help     Show this help message"
    echo
    echo "Examples:"
    echo "  $0          # Install only"
    echo "  $0 --start  # Install and start"
    echo
    echo "For more information, see README-v2.md"
}

# Parse command line arguments
case "$1" in
    --help|-h)
        show_help
        exit 0
        ;;
    --start)
        main "$1"
        ;;
    "")
        main
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac