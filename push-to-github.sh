#!/bin/bash
# Script to add, commit, and push all files to GitHub

cd /Users/mbedner/Documents/RestaurantLaborCalculator

# Check if git is working
if ! git --version > /dev/null 2>&1; then
    echo "Error: Git is not available. Please install Xcode command line tools first."
    echo "Run: xcode-select --install"
    exit 1
fi

# Check current status
echo "Current git status:"
git status --short

# Add all files
echo ""
echo "Adding all files..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "No changes to commit."
else
    # Commit changes
    echo ""
    echo "Committing changes..."
    git commit -m "Update repository with all current files"
    
    # Push to origin
    echo ""
    echo "Pushing to GitHub..."
    git push -u origin main
    
    echo ""
    echo "Done! Files have been pushed to GitHub."
fi


