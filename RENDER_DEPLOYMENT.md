# Deploy Lirkod Backend to Render

## Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Connect your GitHub repository

## Step 2: Deploy Backend Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `grey-chair-dev/lirkod`
3. Configure the service:
   - **Name**: `lirkod-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

## Step 3: Environment Variables
Add these environment variables in Render dashboard:

### Database
- `DATABASE_URL`: Your Neon database URL (from .env.example)
- `NODE_ENV`: `production`

### Authentication
- `JWT_SECRET`: Generate a random string (32+ characters)
- `JWT_REFRESH_SECRET`: Generate another random string (32+ characters)

### CORS
- `CORS_ORIGIN`: `https://lirkod.vercel.app`

### OAuth (Optional - for social login)
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
- `FACEBOOK_APP_ID`: Your Facebook app ID
- `FACEBOOK_APP_SECRET`: Your Facebook app secret

### Redis (Optional - will use memory cache if not provided)
- `REDIS_URL`: Your Redis connection string (or leave empty for memory cache)

## Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note the service URL (e.g., `https://lirkod-backend.onrender.com`)

## Step 5: Update Frontend
Update your Vercel environment variables:
- `NEXT_PUBLIC_API_URL`: `https://your-backend-url.onrender.com/api`

## Step 6: Test
1. Visit your Vercel frontend
2. Try to register/login
3. Check if API calls work

## Troubleshooting
- Check Render logs for any errors
- Ensure all environment variables are set
- Verify database connection
- Check CORS settings match your frontend URL
