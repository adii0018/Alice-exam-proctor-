# 🚀 GitHub Upload Commands

## After Installing Git, run these commands:

```bash
# 1. Initialize git repository
git init

# 2. Add your GitHub username and email (one time setup)
git config --global user.name "Your GitHub Username"
git config --global user.email "your-email@example.com"

# 3. Add all files to git
git add .

# 4. Create first commit
git commit -m "🚀 Initial commit: Alice Exam Proctor System"

# 5. Add your GitHub repository URL (replace with your actual repo URL)
git remote add origin https://github.com/yourusername/your-repo-name.git

# 6. Push to GitHub
git branch -M main
git push -u origin main
```

## Alternative: GitHub Desktop Method (Easier)

1. Open GitHub Desktop
2. Click "Add an Existing Repository from your hard drive"
3. Select your project folder
4. Click "Publish repository"
5. Choose repository name and make it public/private
6. Click "Publish repository"

## Your Repository URL Format:
```
https://github.com/yourusername/alice-exam-proctor
```

## Files that will be uploaded:
✅ All source code (src/, django_backend/)
✅ Configuration files (package.json, vite.config.js, etc.)
✅ Documentation (README.md, all .md files)
✅ Deployment configs (netlify.toml, _redirects)

## Files that WON'T be uploaded (automatically excluded):
❌ node_modules/ (too large)
❌ .env files (sensitive data)
❌ dist/ (build output)
❌ .vscode/ (IDE settings)

## After Upload - Deployment:

### Frontend (Netlify):
1. Go to netlify.com
2. Connect GitHub repository
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy!

### Backend (Railway/Heroku):
1. Connect GitHub repository
2. Select django_backend folder
3. Add environment variables
4. Deploy!

## Environment Variables to Set (After Deployment):
- GROQ_API_KEY=your_groq_api_key
- MONGODB_URI=your_mongodb_connection_string
- JWT_SECRET_KEY=your_jwt_secret
- DJANGO_SECRET_KEY=your_django_secret