#!/bin/bash

# Script to deploy the GitHub Pages demo

echo "Building GitHub Pages demo..."
npm run build:demo

# Check if the build was successful
if [ $? -ne 0 ]; then
  echo "Error: Build failed"
  exit 1
fi

echo "Deploying to GitHub Pages..."
npm run deploy:demo

echo "Done! The demo should be available at https://calumk.github.io/vue-progress-status/" 