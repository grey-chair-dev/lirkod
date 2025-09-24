#!/bin/bash

echo "🚀 Lirkod Backend Deployment Helper"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📋 Deployment Checklist:"
echo "1. ✅ Database (Neon) - Already configured"
echo "2. 🔄 Backend deployment to Render"
echo "3. 🔄 Redis setup (optional)"
echo "4. 🔄 Environment variables"
echo ""

echo "📖 Next Steps:"
echo "1. Go to https://render.com and create a new Web Service"
echo "2. Connect your GitHub repository: grey-chair-dev/lirkod"
echo "3. Set Root Directory to: backend"
echo "4. Use these settings:"
echo "   - Build Command: npm install && npm run build"
echo "   - Start Command: npm start"
echo "   - Instance Type: Free"
echo ""
echo "5. Add environment variables (see RENDER_DEPLOYMENT.md)"
echo "6. Deploy and get your backend URL"
echo "7. Update Vercel with your backend URL"
echo ""

echo "🔗 Useful Links:"
echo "- Render Dashboard: https://dashboard.render.com"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- Neon Dashboard: https://console.neon.tech"
echo ""

echo "📚 Documentation:"
echo "- Backend Deployment: RENDER_DEPLOYMENT.md"
echo "- Redis Setup: REDIS_SETUP.md"
echo ""

# Check if backend builds successfully
echo "🔨 Testing backend build..."
cd backend
if npm run build; then
    echo "✅ Backend builds successfully!"
else
    echo "❌ Backend build failed. Please fix errors before deploying."
    exit 1
fi

echo ""
echo "🎉 Ready for deployment! Follow the steps above to deploy to Render."
