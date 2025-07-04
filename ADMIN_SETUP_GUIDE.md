# Admin Dashboard Setup Guide

## 🚀 **Quick Setup**

### **1. Backend Setup**

First, make sure your backend is running:

```bash
cd server
npm install
npm run dev
```

### **2. Create Admin User**

Run the admin user creation script:

```bash
cd server
npm run create-admin
```

This will create an admin user with the following credentials:
- **Username**: `admin`
- **Email**: `admin@dsalearning.com`
- **Password**: `admin123`
- **Role**: `admin`

### **3. Frontend Setup**

Start the frontend application:

```bash
cd client-final
npm install
npm start
```

### **4. Access Admin Dashboard**

Navigate to: `http://localhost:3000/admin-dashboard`

Login with the admin credentials created in step 2.

## 🔧 **Troubleshooting Import Issues**

### **Issue: Cannot find module '../../services/adminApi'**

**Solution**: The import paths are correct. Make sure:

1. **File Structure Check**:
   ```
   client-final/src/
   ├── services/
   │   └── adminApi.ts ✅
   ├── components/
   │   └── Admin/
   │       ├── AdminTopicManager.tsx ✅
   │       ├── AdminResourceManager.tsx ✅
   │       ├── AdminAnalytics.tsx ✅
   │       ├── AdminSystemSettings.tsx ✅
   │       └── AdminUserTable.tsx ✅
   └── pages/
       └── admin/
           └── AdminDashboard.tsx ✅
   ```

2. **TypeScript Configuration**: Ensure `tsconfig.json` includes:
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "*": ["src/*"]
       }
     }
   }
   ```

3. **Restart Development Server**: Sometimes TypeScript needs a restart:
   ```bash
   # Stop the dev server (Ctrl+C)
   npm start
   ```

### **Issue: Backend Admin Routes Not Found**

**Solution**: Ensure admin routes are properly registered:

1. **Check `server/src/app.ts`**:
   ```typescript
   import adminRoutes from './routes/adminRoutes';
   // ...
   app.use('/api/admin', adminRoutes);
   ```

2. **Verify Admin Controller**: Ensure `adminController.ts` exists and exports all methods.

3. **Check Middleware**: Ensure `requireAdmin` middleware is properly implemented.

## 🔐 **Admin Authentication**

### **Admin User Creation**

The admin user is created with these properties:
- **Role**: `admin` (required for admin access)
- **Active**: `true`
- **Permissions**: Full access to admin dashboard

### **Login Process**

1. **Regular Login**: Use the normal login form with admin credentials
2. **Role Check**: The system checks if `user.role === 'admin'`
3. **Access Control**: Only admin users can access `/admin-dashboard`

### **Security Best Practices**

1. **Change Default Password**: Immediately change `admin123` to a strong password
2. **Use Environment Variables**: Store admin credentials in `.env` files
3. **Enable 2FA**: Consider implementing two-factor authentication
4. **Regular Updates**: Update admin credentials periodically

## 📋 **Admin Dashboard Features**

### **Available Tabs**

1. **Overview**: System statistics and user activity
2. **User Management**: View, activate/deactivate users
3. **Topic Management**: Create, edit, delete DSA topics and subtopics
4. **Resource Management**: Manage learning materials and problems
5. **Analytics**: User engagement and learning progress metrics
6. **System Settings**: Configure application behavior

### **Key Functions**

- **Topic Management**: Add new DSA topics with subtopics
- **Resource Management**: Upload and manage learning materials
- **User Analytics**: Monitor user progress and engagement
- **System Health**: Check database and server status
- **Content Curation**: Quality control for learning materials

## 🛠 **Development Commands**

### **Backend Commands**

```bash
# Start development server
npm run dev

# Create admin user
npm run create-admin

# Seed topics
npm run seed-topics

# Seed resources
npm run seed-resources

# Build for production
npm run build
```

### **Frontend Commands**

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🔍 **Debugging Tips**

### **Common Issues**

1. **Admin Access Denied**:
   - Check if user has `role: 'admin'` in database
   - Verify JWT token contains role information
   - Check `requireAdmin` middleware

2. **Import Errors**:
   - Restart TypeScript server
   - Check file paths are correct
   - Verify all components are exported

3. **API Errors**:
   - Check backend is running on correct port
   - Verify admin routes are registered
   - Check CORS configuration

4. **Database Issues**:
   - Ensure Neo4j is running
   - Check connection credentials
   - Verify database schema

### **Logs to Check**

1. **Backend Logs**: Check server console for API errors
2. **Frontend Logs**: Check browser console for import/API errors
3. **Database Logs**: Check Neo4j logs for connection issues

## 📞 **Support**

If you encounter issues:

1. **Check the logs** for specific error messages
2. **Verify all dependencies** are installed
3. **Ensure all services** are running (Neo4j, backend, frontend)
4. **Check file permissions** and paths
5. **Restart all services** if needed

## 🔄 **Updates and Maintenance**

### **Regular Tasks**

1. **Backup Database**: Use admin dashboard backup feature
2. **Monitor Analytics**: Check user engagement metrics
3. **Update Content**: Add new topics and resources
4. **Security Updates**: Keep dependencies updated
5. **Performance Monitoring**: Check system health regularly

### **Future Enhancements**

The admin dashboard is designed to be extensible. You can add:
- More analytics features
- Advanced content management
- User communication tools
- Automated reporting
- Integration with external services

---

**Note**: This admin dashboard provides comprehensive management capabilities for your DSA learning platform. Make sure to secure admin credentials and regularly backup your data. 