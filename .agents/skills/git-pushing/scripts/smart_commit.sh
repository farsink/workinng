#!/bin/bash
set -e

# Default commit message if none provided
MESSAGE="${1:-chore: update code}"

# Add all changes
git add .

# Commit with the provided message
if git commit -m "$MESSAGE"; then
    echo "✅ Committed changes: $MESSAGE"
else
    echo "⚠️ Nothing to commit or commit failed."
fi

# RUN BUILD CHECK
echo "🔍 Running build check in VueApp directory..."
if [ -d "VueApp" ]; then
    if (cd VueApp && npm run build); then
        echo "✅ Build successful!"
    else
        echo "❌ Build failed in VueApp! Aborting push."
        exit 1
    fi
else
    if npm run build; then
        echo "✅ Build successful!"
    else
        echo "❌ Build failed! Aborting push."
        exit 1
    fi
fi

# Get current branch name
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Push to remote, setting upstream if needed
git push -u origin "$BRANCH"

echo "✅ Successfully pushed to $BRANCH"
