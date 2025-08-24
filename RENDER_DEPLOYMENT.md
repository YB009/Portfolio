# Render Deployment Guide - Single Service

## 🚨 Current Issue
Your frontend is trying to connect to `localhost:3001` even when deployed on Render. This is why you're getting the "Something went wrong" error.

## ✅ Solution Steps

### Step 1: Deploy as Single Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `your-portfolio` (or any name)
   - **Root Directory**: Leave empty (use root)
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node.js 18+

### Step 2: Set Environment Variables
In your service settings, add these environment variables:
```
PORT=3001
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=owohdaniel09@gmail.com
SMTP_PASS=ydvawtarycegbifg
MAIL_TO=owohdaniel09@gmail.com
VITE_API_URL=https://your-service-name.onrender.com
```

### Step 3: Server Configuration
Your server is already perfectly configured to serve both the API and the built frontend files. It will:
- Serve API endpoints at `/api/*`
- Serve the React app for all other routes
- Handle SPA routing automatically

### Step 4: Test the Deployment
1. Wait for the service to deploy (green status)
2. Visit your service URL
3. Try the contact form
4. Check the browser console for any errors

## 🔧 Troubleshooting

### If you still get errors:
1. **Check Browser Console**: Open DevTools (F12) and look for network errors
2. **Check Render Logs**: Go to your service logs in Render dashboard
3. **Test Backend Directly**: Try visiting `https://your-service-name.onrender.com/api/health`

### Common Issues:
- **CORS Errors**: The backend should already handle this
- **Environment Variables**: Make sure they're set correctly in Render
- **Build Issues**: Check if the build command is working properly

## 📝 Example URL
After deployment, you'll have:
- Single Service: `https://your-portfolio.onrender.com`

The frontend will automatically use the correct backend URL based on the `VITE_API_URL` environment variable.
