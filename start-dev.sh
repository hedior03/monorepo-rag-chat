#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting development environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker and try again."
  exit 1
fi

# Check for .env files and create them from .env.example if needed
echo "🔍 Setting up environment files..."
if [ -f ".env.example" ]; then
  # Create .env files if they don't exist
  [ ! -f ".env" ] && cp .env.example .env
  [ ! -f "apps/api/.env" ] && cp .env.example apps/api/.env
  
  # Create web .env with only VITE_ variables
  if [ ! -f "apps/web/.env" ]; then
    grep "VITE_" .env.example > apps/web/.env
  fi
fi

# Parse command line arguments
FRESH=false
INSTALL=false

# Simple argument parsing
[[ "$*" == *"--fresh"* ]] && FRESH=true
[[ "$*" == *"--install"* ]] && INSTALL=true

# Database setup
if [ "$FRESH" = true ]; then
  echo "🧹 Performing a fresh database reset..."
  pnpm db:stop || true
  docker volume rm monorepo_postgres_data || true
  docker-compose up -d --force-recreate
else
  echo "🐳 Starting database..."
  pnpm db:start
fi

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Database schema and migrations
echo "🔄 Setting up database schema..."
pnpm db:generate || true
pnpm db:push || true
pnpm db:migrate || true

# Seed the database if using fresh start
if [ "$FRESH" = true ]; then
  echo "🌱 Seeding the database..."
  pnpm --filter api db:seed || true
fi

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ "$INSTALL" = true ]; then
  echo "📦 Installing dependencies..."
  pnpm install
fi

# Start the development server
echo "💻 Starting development server..."
pnpm dev

# Trap SIGINT to handle Ctrl+C gracefully
trap 'echo "🛑 Stopping development environment..."; pnpm db:stop; exit 0' SIGINT

# Keep the script running to allow for Ctrl+C to stop everything
wait 