#!/bin/bash

# Move into the backend directory
cd backend

# Install dependencies
npm install

# Build the project (creates the dist folder)
npm run build

# Initialize the database (SQLite)
npx prisma db push

# Start the application
npm start
