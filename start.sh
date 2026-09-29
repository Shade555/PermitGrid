#!/usr/bin/env bash
# Start FastAPI backend in the background
cd backend
uvicorn main:app --host 127.0.0.1 --port 8000 &
cd ..

# Start Next.js frontend in the foreground
# Next.js will automatically bind to the PORT environment variable provided by Render (default 3000)
npm run start
