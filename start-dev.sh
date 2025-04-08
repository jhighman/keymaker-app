#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up KeyMaker development environment...${NC}"

# Install frontend dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo -e "${BLUE}Installing frontend dependencies...${NC}"
  npm install
fi

# Install backend dependencies if backend/node_modules doesn't exist
if [ ! -d "backend/node_modules" ]; then
  echo -e "${BLUE}Installing backend dependencies...${NC}"
  cd backend
  npm install
  cd ..
fi

# Start backend server in the background
echo -e "${BLUE}Starting backend server...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo -e "${BLUE}Waiting for backend to start...${NC}"
sleep 3

# Start frontend server
echo -e "${BLUE}Starting frontend server...${NC}"
npm run dev

# When frontend is stopped, also stop the backend
echo -e "${BLUE}Stopping backend server...${NC}"
kill $BACKEND_PID