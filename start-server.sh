#!/bin/bash
echo "Killing old processes..."
pkill -9 node 2>/dev/null
pkill -9 -f preview 2>/dev/null
pkill -9 -f http-server 2>/dev/null

echo "Cleaning build..."
rm -rf build

echo "Building (this takes ~2 minutes)..."
NODE_ENV=production npm run build

echo "Starting preview server on port 5000..."
npm run preview -- --host &

echo "Waiting for server..."
sleep 5

echo "Checking version..."
curl -s http://localhost:5000 | grep -o "v2025\.[0-9]*\.[0-9]*\.[0-9]*" | head -1

echo "Server should be running on port 5000!"
