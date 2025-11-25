# Alice AI - Deployment Guide

## 🚀 Quick Deployment (Free)

### Step 1: MongoDB Atlas Setup (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create free account
3. Create a FREE cluster (M0 Sandbox - 512MB)
4. Click "Connect" → "Connect your application"
5. Copy connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Save this for later

### Step 2: Backend Deployment (Render)

1. Go to [Render](https://render.com/) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repo (or upload code)
4. Settings:
   - **Name**: alice-ai-backend
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `backend`

5. Add Environment Variables:
   ```
   GROQ_API_KEY=your_groq_api_key
   MONGODB_URL=your_mongodb_atlas_connection_string
   DATABASE_NAME=alice_ai_db
   ```

6. Click "Create Web Service"
7. Copy your backend URL (e.g., `https://alice-ai-backend.onrender.com`)

### Step 3: Frontend Deployment (Vercel)

1. Go to [Vercel](https://vercel.com/) and sign up
2. Click "Add New" → "Project"
3. Import your GitHub repo
4. Settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

6. Click "Deploy"

### Step 4: Update Frontend API URL

Update `frontend/src/App.jsx`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
```

### Step 5: Update Backend CORS

Update `backend/main.py` CORS to allow your Vercel domain:
```python
allow_origins=["https://your-app.vercel.app"]
```

## 🎉 Done!

Your Alice AI is now live at: `https://your-app.vercel.app`

---

## Alternative: Deploy Everything on Render

If you want everything on one platform:

1. Deploy backend as Web Service (as above)
2. Deploy frontend as Static Site:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Publish Directory: `dist`

---

## Cost Breakdown

- **MongoDB Atlas**: FREE (512MB)
- **Render Backend**: FREE (750 hours/month, sleeps after 15 min inactivity)
- **Vercel Frontend**: FREE (100GB bandwidth)

**Total Cost: $0/month** 🎉

---

## Notes

- Render free tier sleeps after 15 min inactivity (first request takes ~30 seconds to wake up)
- For production, consider paid plans for better performance
- Keep your API keys secure in environment variables
