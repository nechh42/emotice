#!/bin/bash
# Production deployment script

echo " EMOTICE Production Deployment"

# Build
echo " Building application..."
npm run build

# Test build
echo " Testing build..."
npm run preview &
PREVIEW_PID=\$!
sleep 5
curl -f http://localhost:3000 || { echo " Build test failed"; kill \; exit 1; }
kill \

# Deploy
echo " Deploying to production..."
# Add your deployment commands here

echo " Deployment complete!"
echo " Live at: https://emotice.surge.sh"
