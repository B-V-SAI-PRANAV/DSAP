# 🚀 DSA PathRecommender - Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Application Status
- ✅ **Backend API** - Express server with TypeScript
- ✅ **Frontend React App** - React with TypeScript and Tailwind CSS
- ✅ **Database Integration** - Neo4j graph database
- ✅ **Authentication** - JWT-based authentication
- ✅ **Admin Dashboard** - Full CRUD operations
- ✅ **Security Features** - Rate limiting, CORS, Helmet
- ✅ **Error Handling** - Comprehensive error handling
- ✅ **Production Build** - Optimized build scripts

## 🌐 Deployment Options

### Option 1: Simple Deployment (Recommended for MVP)

#### Frontend: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd client-final
vercel --prod
```

#### Backend: Railway
```bash
# Connect your GitHub repo to Railway
# Railway will auto-deploy from your main branch
```

#### Database: Neo4j AuraDB
- Sign up at https://neo4j.com/cloud/platform/aura-graph-database/
- Create a free instance
- Get your connection string

### Option 2: Professional Deployment

#### Frontend: AWS S3 + CloudFront
```bash
# Build the app
cd client-final
npm run build:prod

# Upload to S3 bucket
aws s3 sync build/ s3://your-bucket-name --delete

# Configure CloudFront distribution
```

#### Backend: AWS EC2
```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js and PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# Clone and deploy
git clone your-repo
cd server
npm install
npm run build
pm2 start dist/server.js --name "dsa-backend"
```

## 🔧 Environment Configuration

### Backend Environment Variables (.env)
```bash
# Database
NEO4J_URI=bolt://your-neo4j-host:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your-secure-password

# Security
JWT_SECRET=your-super-secure-jwt-secret-key-here
NODE_ENV=production

# Server
PORT=5001

# CORS (comma-separated domains)
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment Variables (.env.local)
```bash
# API Configuration
REACT_APP_API_BASE_URL=https://your-backend-domain.com/api

# Optional: Analytics
REACT_APP_GA_TRACKING_ID=your-google-analytics-id
REACT_APP_ENABLE_ANALYTICS=true
```

## 📊 Database Setup

### 1. Create Production Database
```bash
# Connect to your Neo4j instance
# Run the initialization script
cd server
npm run init-neo4j
```

### 2. Seed Production Data
```bash
# Seed topics and resources
npm run seed-topics
npm run seed-resources

# Create admin user
npm run create-admin
```

### 3. Verify Data
```bash
# Check if data is properly seeded
# Access Neo4j Browser at your-database-url:7474
```

## 🔒 Security Configuration

### 1. Update JWT Secret
```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Configure CORS
```bash
# Update ALLOWED_ORIGINS in your .env file
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### 3. Enable HTTPS
```bash
# For production, ensure HTTPS is enabled
# Most hosting platforms provide this automatically
```

## 🚀 Deployment Steps

### Step 1: Prepare Your Code
```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 2: Set Environment Variables
- **Vercel**: Add environment variables in project settings
- **Railway**: Add environment variables in project settings
- **AWS**: Use AWS Systems Manager Parameter Store

### Step 3: Deploy Backend
```bash
# For Railway (automatic from GitHub)
# Just push to main branch

# For AWS EC2
cd server
npm install
npm run build
pm2 start dist/server.js --name "dsa-backend"
pm2 save
pm2 startup
```

### Step 4: Deploy Frontend
```bash
# For Vercel
cd client-final
vercel --prod

# For AWS S3
npm run build:prod
aws s3 sync build/ s3://your-bucket-name --delete
```

### Step 5: Configure Domain
- Point your domain to your hosting provider
- Enable SSL certificates
- Update CORS settings with your domain

## 📈 Monitoring & Maintenance

### Health Checks
```bash
# Backend health check
curl https://your-backend-domain.com/health

# Expected response:
# {"status":"OK","timestamp":"2025-07-04T19:30:00.000Z"}
```

### Logs
```bash
# For PM2 (AWS EC2)
pm2 logs dsa-backend

# For Railway
# Check logs in Railway dashboard

# For Vercel
# Check logs in Vercel dashboard
```

### Database Backup
```bash
# Neo4j AuraDB provides automatic backups
# For manual backup:
cypher-shell -u neo4j -p password -a bolt://localhost:7687 \
  "CALL apoc.export.csv.all('backup.csv', {})"
```

## 🔧 Troubleshooting

### Common Issues

#### 1. CORS Errors
```bash
# Check ALLOWED_ORIGINS in backend .env
# Ensure frontend domain is included
```

#### 2. Database Connection Issues
```bash
# Verify Neo4j connection string
# Check firewall settings
# Ensure database is running
```

#### 3. Build Failures
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. Environment Variables
```bash
# Verify all environment variables are set
# Check for typos in variable names
```

## 📞 Support

### Before Deployment
- ✅ Test all features locally
- ✅ Verify database connections
- ✅ Check environment variables
- ✅ Test authentication flow
- ✅ Verify admin dashboard

### After Deployment
- ✅ Monitor application logs
- ✅ Check database performance
- ✅ Verify all API endpoints
- ✅ Test user registration/login
- ✅ Verify admin functionality

## 🎯 Success Metrics

### Technical Metrics
- ✅ **Uptime**: 99.9%+
- ✅ **Response Time**: <200ms average
- ✅ **Error Rate**: <1%
- ✅ **Security**: No vulnerabilities

### User Metrics
- ✅ **User Registration**: Working
- ✅ **Login Flow**: Functional
- ✅ **Admin Dashboard**: Operational
- ✅ **Learning Paths**: Generating correctly

---

**Your application is now ready for production deployment! 🚀**

Choose your preferred hosting platform and follow the steps above. The application includes all necessary security features, error handling, and production optimizations. 