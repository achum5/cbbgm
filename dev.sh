#!/bin/bash

# College Basketball Coach - Safe Development Server Restart
# This script ensures clean builds every time

echo "🏀 College Basketball Coach - Restarting Server"
echo ""

# Step 1: Kill all existing servers
echo "1️⃣ Killing old servers..."
pkill -9 -f "preview" 2>/dev/null
pkill -9 -f "watch" 2>/dev/null
pkill -9 -f "http-server" 2>/dev/null
sleep 1
echo "   ✅ Old servers killed"
echo ""

# Step 2: Clean build directory
echo "2️⃣ Cleaning build directory..."
rm -rf build
echo "   ✅ Build directory cleaned"
echo ""

# Step 3: Build production files
echo "3️⃣ Building production files..."
export NODE_ENV=production
npm run build
echo ""

# Step 4: Start preview server
echo "4️⃣ Starting preview server on port 5000..."
npm run preview -- --host &
sleep 3
echo ""

# Step 5: Verify version
echo "5️⃣ Server ready! Version:"
curl -s http://localhost:5000 | grep -o "v2025\.[0-9]*\.[0-9]*\.[0-9]*" | head -1
echo ""
echo "✅ DONE! Reload your browser (Ctrl+R or Cmd+R) to see changes"
echo ""
