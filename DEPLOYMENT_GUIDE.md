# EchoVerse Deployment Guide

## Summary of Changes Made

### 🔧 **API Configuration Centralization**
- **Fixed hardcoded localhost URLs**: All components now use centralized API configuration
- **Updated Files**: 
  - `EchoVerse.js` - Main application logic
  - `StudentMaterialsPage.js` - Study materials upload
  - `DownloadsPage.js` - Download history
  - `VoiceInfo.js` - Voice debugging
  - `LoginPage.js` - User authentication
  - `RegisterPage.js` - User registration
  - `AdminLogin.js` - Admin authentication

### 🌐 **Environment Variables Setup**
- **Frontend (.env)**:
  ```
  REACT_APP_API_URL=https://echoverse-backend-dpza.onrender.com
  REACT_APP_ENV=production
  ```
- **Backend (.env)**:
  ```
  FLASK_ENV=production  # Set to 'production' for deployment
  ```

### 🔒 **CORS Configuration**
- **Production CORS**: Restricted to specific frontend URLs
- **Development CORS**: Allows all origins for local development
- **Auto-detection**: Based on `FLASK_ENV` environment variable

### 📦 **Deployment Files Created**
- `backend/requirements.txt` - Python dependencies
- `backend/Procfile` - Heroku/Render process definition
- `backend/render.yaml` - Render-specific configuration

## 🚀 Deployment Steps

### **1. Backend Deployment (Render/Heroku)**

#### **For Render:**
1. Create new Web Service on Render
2. Connect your GitHub repository
3. Set these environment variables:
   ```
   FLASK_ENV=production
   PORT=10000
   DB_HOST=your-database-host
   DB_USERNAME=your-db-username
   DB_PASSWORD=your-db-password
   DB_DATABASE=your-db-name
   HUGGINGFACE_API_TOKEN=your-hf-token
   ```
4. Deploy from `backend/` folder
5. Use build command: `pip install -r requirements.txt`
6. Use start command: `gunicorn app:app --bind 0.0.0.0:$PORT`

#### **For Heroku:**
1. Install Heroku CLI
2. Run these commands:
   ```bash
   cd backend
   heroku create your-app-name
   heroku config:set FLASK_ENV=production
   heroku config:set DB_HOST=your-database-host
   # Add other environment variables
   git push heroku main
   ```

### **2. Frontend Deployment**

#### **Update Environment Variables:**
1. Update `.env` with your deployed backend URL:
   ```
   REACT_APP_API_URL=https://your-backend-app.onrender.com
   REACT_APP_ENV=production
   ```

#### **For Netlify/Vercel:**
1. Build the app: `npm run build`
2. Deploy the `build/` folder
3. Set environment variables in deployment platform

#### **For Render (Static Site):**
1. Create new Static Site
2. Connect repository
3. Set publish directory: `build`
4. Set build command: `npm run build`

### **3. Database Setup**
- Use cloud database (MySQL on PlanetScale, AWS RDS, etc.)
- Update connection strings in backend environment variables
- Run database migrations if needed

## 🔧 Troubleshooting Network Issues

### **Common Issues & Solutions:**

1. **CORS Errors:**
   - Ensure frontend URL is added to CORS origins in backend
   - Check browser dev tools for specific CORS errors

2. **API Connection Failures:**
   - Verify `REACT_APP_API_URL` points to correct backend URL
   - Ensure backend is running and accessible
   - Check if backend URL requires HTTPS

3. **Environment Variables Not Loading:**
   - Restart development server after changing `.env`
   - Ensure `.env` file is in project root
   - Check if hosting platform loaded environment variables

4. **Mixed Content Errors (HTTP/HTTPS):**
   - Ensure both frontend and backend use HTTPS in production
   - Update API URLs to use `https://` protocol

### **Testing Deployment:**
1. **Local Testing:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   FLASK_ENV=production python app.py

   # Terminal 2 - Frontend
   npm run build
   npx serve -s build
   ```

2. **Production Testing:**
   - Test all features (login, audio generation, file upload)
   - Check browser dev tools for network errors
   - Verify audio files play correctly

## 📊 **Monitoring & Logs**

### **Backend Logs:**
- Check Render/Heroku logs for API errors
- Monitor database connection issues
- Watch for file upload errors

### **Frontend Debugging:**
- Use browser dev tools Network tab
- Check Console for JavaScript errors
- Verify API calls use correct URLs

## 🎯 **Performance Optimization**

1. **Frontend:**
   - Build creates optimized production bundle
   - Images and assets are compressed
   - Code splitting implemented

2. **Backend:**
   - Use production WSGI server (gunicorn)
   - Disable debug mode in production
   - Implement request logging

## 🔐 **Security Considerations**

1. **Environment Variables:**
   - Never commit `.env` files to git
   - Use platform-specific environment variable settings
   - Rotate API keys regularly

2. **CORS:**
   - Production CORS only allows specific origins
   - Update allowed origins when deploying to new URLs

3. **HTTPS:**
   - Both frontend and backend should use HTTPS
   - Most hosting platforms provide SSL certificates

---

## 🚨 **Next Steps After Deployment**

1. **Test all features thoroughly on live deployment**
2. **Monitor logs for any production issues**
3. **Set up domain names for both frontend and backend**
4. **Configure CDN for better performance**
5. **Set up monitoring and alerting**

Your EchoVerse application is now ready for production deployment! 🎉
