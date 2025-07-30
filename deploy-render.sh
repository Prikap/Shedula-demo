#!/bin/bash

# Shedula Demo - Render Deployment Script
# This script helps prepare and deploy the application to Render

echo "🚀 Shedula Demo - Render Deployment Script"
echo "=========================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git repository not found!"
    echo "Please initialize git and push your code to GitHub first."
    exit 1
fi

# Check if all required files exist
echo "📋 Checking required files..."

required_files=(
    "package.json"
    "server/index.js"
    "src/App.tsx"
    "render.yaml"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Error: Required file $file not found!"
        exit 1
    fi
done

echo "✅ All required files found!"

# Check if code is pushed to GitHub
echo "🔍 Checking if code is pushed to GitHub..."
if ! git ls-remote --exit-code origin >/dev/null 2>&1; then
    echo "❌ Error: No remote repository found!"
    echo "Please push your code to GitHub first:"
    echo "  git remote add origin <your-github-repo-url>"
    echo "  git push -u origin main"
    exit 1
fi

echo "✅ GitHub repository found!"

# Build test
echo "🔨 Testing build process..."
if ! npm run build; then
    echo "❌ Error: Build failed!"
    echo "Please fix build issues before deploying."
    exit 1
fi

echo "✅ Build test successful!"

# Display deployment instructions
echo ""
echo "🎯 Render Deployment Instructions"
echo "================================"
echo ""
echo "1. Visit https://render.com and sign up"
echo "2. Connect your GitHub repository"
echo "3. Create two services:"
echo ""
echo "   BACKEND (Web Service):"
echo "   - Name: shedula-api"
echo "   - Environment: Node"
echo "   - Build Command: npm install"
echo "   - Start Command: npm run server"
echo "   - Health Check Path: /api/health"
echo ""
echo "   FRONTEND (Static Site):"
echo "   - Name: shedula-frontend"
echo "   - Build Command: npm install && npm run build"
echo "   - Publish Directory: dist"
echo ""
echo "4. Set environment variables:"
echo ""
echo "   Backend Variables:"
echo "   - PORT: 10000"
echo "   - NODE_ENV: production"
echo "   - CORS_ORIGIN: https://shedula-frontend.onrender.com"
echo ""
echo "   Frontend Variables:"
echo "   - VITE_API_URL: https://shedula-api.onrender.com/api"
echo ""
echo "5. Deploy both services"
echo "6. Test the application"
echo ""
echo "🌐 Your app will be available at:"
echo "   Frontend: https://shedula-frontend.onrender.com"
echo "   Backend: https://shedula-api.onrender.com"
echo ""
echo "📚 For detailed instructions, see RENDER_DEPLOYMENT_GUIDE.md"
echo ""
echo "🎉 Good luck with your deployment!" 