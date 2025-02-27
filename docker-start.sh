#!/bin/bash

# Stop and remove existing containers
echo "Stopping existing containers..."
docker-compose down

# Build and start containers
echo "Building and starting containers..."
docker-compose up --build -d

# Wait for services to start
echo "Waiting for services to start..."
sleep 5

# Show running containers
echo "Running containers:"
docker-compose ps

echo ""
echo "Services are available at:"
echo "- API and Web UI: http://localhost:3000"
echo "- PgAdmin: http://localhost:5050 (login with admin@admin.com / admin)"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down" 