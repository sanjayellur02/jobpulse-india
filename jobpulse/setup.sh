#!/bin/bash
# JobPulse India - Quick Setup Script
# This script automates the initial setup process

set -e

echo "🚀 JobPulse India - Quick Setup"
echo "================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Navigate to project
cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Check for .env.local
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found"
    echo "📋 Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Update .env.local with your Supabase credentials:"
    echo "   1. Go to https://supabase.com"
    echo "   2. Create a new project"
    echo "   3. Go to Settings > API"
    echo "   4. Copy URL and anon key into .env.local"
    echo ""
fi

# Run database setup check
echo "🗄️  Database Setup"
echo "=================="
echo ""
echo "To complete the database setup:"
echo "1. Open https://app.supabase.com/project/YOUR_PROJECT_ID/sql"
echo "2. Copy all SQL from database.sql file"
echo "3. Paste and execute in Supabase SQL Editor"
echo "4. Wait for all queries to complete"
echo ""

# Ready to start
echo "✅ Setup Complete!"
echo ""
echo "🎯 Next Steps:"
echo "1. Update .env.local with Supabase credentials"
echo "2. Run database migrations (see above)"
echo "3. Start dev server: npm run dev"
echo "4. Visit http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   - Setup Guide: SETUP.md"
echo "   - Database Schema: database.sql"
echo "   - Deployment: DEPLOYMENT.md"
echo ""
echo "Happy coding! 🎉"
