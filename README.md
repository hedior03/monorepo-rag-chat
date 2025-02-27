# Chat RAG Monorepo

A monorepo with Hono API and Tanstack Router SPA for a RAG (Retrieval-Augmented Generation) chat application.

## Project Structure

- `apps/api`: Backend API built with Hono
- `apps/web`: Frontend SPA built with Tanstack Router
- Docker setup for PostgreSQL with pgvector for vector storage

## Prerequisites

- Node.js (v20+)
- pnpm
- Docker and Docker Compose

## Getting Started

1. Clone the repository
2. Make sure Docker is running
3. Run the development script:

```bash
./start-dev.sh
```

This script will:
- Set up environment files from `.env.example`
- Start the PostgreSQL database
- Set up the database schema and run migrations
- Install dependencies if needed
- Start the development server

## Environment Setup

The project uses environment variables for configuration. A `.env.example` file is provided in the root directory with placeholder values. The development script will automatically create the necessary `.env` files if they don't exist.

**Important**: You need to replace the placeholder API keys with your actual keys in the `.env` files.

## Script Options

The `start-dev.sh` script supports the following options:

- `--install`: Force reinstallation of dependencies
- `--fresh`: Perform a fresh start by resetting the database and seeding it with sample data

Examples:
```bash
# Normal start
./start-dev.sh

# Force reinstall dependencies
./start-dev.sh --install

# Fresh start with database reset
./start-dev.sh --fresh

# Fresh start with dependency reinstall
./start-dev.sh --fresh --install
```

## Development

- API runs on: http://localhost:3000
- Web app runs on: http://localhost:5173
- PgAdmin runs on: http://localhost:5050 (login: admin@admin.com / admin)

## Troubleshooting

If you encounter database errors or issues with the application, try running with the `--fresh` flag to reset the database:

```bash
./start-dev.sh --fresh
```

This will:
1. Stop any running containers
2. Remove the database volume
3. Recreate the database
4. Set up the schema and run migrations
5. Seed the database with sample data 