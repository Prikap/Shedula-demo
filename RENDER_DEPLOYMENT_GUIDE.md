# Shedula Demo - Render Deployment Guide

## 🚀 Quick Deploy on Render

### Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### Step 2: Create Render Account

1. **Visit** [render.com](https://render.com)
2. **Sign up** with your GitHub account
3. **Verify your email** address

### Step 3: Deploy Backend (API Server)

1. **Click "New +"** in Render dashboard
2. **Select "Web Service"**
3. **Connect your GitHub repository**

**Configuration:**
- **Name**: `shedula-api`
- **Environment**: `Node`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Build Command**: `npm install`
- **Start Command**: `npm run server`
- **Health Check Path**: `/api/health`

**Environment Variables:**
- `PORT`: `10000`
- `NODE_ENV`: `production`
- `CORS_ORIGIN`: `https://shedula-frontend.onrender.com` (update after frontend deployment)

### Step 4: Deploy Frontend (Static Site)

1. **Click "New +"** again
2. **Select "Static Site"**
3. **Connect the same GitHub repository**

**Configuration:**
- **Name**: `shedula-frontend`
- **Branch**: `main`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

**Environment Variables:**
- `VITE_API_URL`: `https://shedula-api.onrender.com/api`

### Step 5: Update CORS Settings

After both services are deployed, update the backend CORS origin in Render dashboard:
- Go to your backend service
- Edit environment variables
- Update `CORS_ORIGIN` to your frontend URL

### Step 6: Test Your Deployment

1. **Test Backend**: Visit `https://shedula-api.onrender.com/api/health`
2. **Test Frontend**: Visit `https://shedula-frontend.onrender.com`
3. **Test Login**: Use demo credentials (`demo@example.com` / `password123`)

## 🔧 Alternative: Vercel + Railway

### Frontend on Vercel
```bash
npm install -g vercel
vercel
```

### Backend on Railway
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

## 🎯 Your App URLs

After deployment, your app will be available at:
- **Frontend**: `https://shedula-frontend.onrender.com`
- **Backend**: `https://shedula-api.onrender.com`

## 📞 Need Help?

If you encounter any issues:
1. Check the logs in Render dashboard
2. Verify environment variables are set correctly
3. Test the health check endpoint
4. Ensure CORS is configured properly

## 🎉 Success!

Once deployed, you'll have a fully functional medical appointment booking system with:
- ✅ User authentication (login/signup)
- ✅ Doctor browsing and search
- ✅ Appointment booking
- ✅ Real-time slot management
- ✅ Responsive design
- ✅ Demo credentials for testing 