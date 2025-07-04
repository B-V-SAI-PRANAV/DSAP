#!/bin/bash

echo "🚀 Starting DSA PathRecommender Deployment..."

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Git working directory is not clean. Please commit all changes first."
    exit 1
fi

echo "✅ Git working directory is clean"

# Build frontend
echo "📦 Building frontend..."
cd client-final
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi
cd ..

echo "✅ Frontend built successfully"

# Build backend
echo "🔧 Building backend..."
cd server
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Backend build failed"
    exit 1
fi
cd ..

echo "✅ Backend built successfully"

# Push to git
echo "📤 Pushing to git..."
git push origin master

echo "✅ Code pushed to repository"

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Deploy frontend to Vercel:"
echo "   - Connect your GitHub repo to Vercel"
echo "   - Set environment variables in Vercel dashboard"
echo "   - Deploy from main branch"
echo ""
echo "2. Deploy backend to Railway:"
echo "   - Connect your GitHub repo to Railway"
echo "   - Set environment variables in Railway dashboard"
echo "   - Deploy from main branch"
echo ""
echo "3. Set up Neo4j database:"
echo "   - Create Neo4j AuraDB instance"
echo "   - Update backend environment variables"
echo "   - Run database initialization scripts"
echo ""
echo "4. Update frontend API URL:"
echo "   - Set REACT_APP_API_BASE_URL to your backend URL"
echo ""
echo "📚 See DEPLOYMENT_GUIDE.md for detailed instructions" 