# 🚀 Vercel Deployment Guide

## **Prerequisites**

- Vercel account
- GitHub repository with your code

## **Step 1: Deploy to Vercel**

1. **Connect to Vercel:**

   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

2. **Or use Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings

## **Step 2: Set up Vercel Postgres**

1. **Add Vercel Postgres:**
   - Go to your Vercel project dashboard
   - Click "Storage" tab
   - Add "Postgres" database
   - Copy the connection string

2. **Environment Variables:**
   Add these to your Vercel project settings:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

   # JWT Secrets (Generate strong secrets)
   JWT_SECRET="your-super-secure-jwt-secret-key-here"
   JWT_REFRESH_SECRET="your-super-secure-refresh-secret-key-here"
   JWT_EXPIRES_IN="15m"
   JWT_REFRESH_EXPIRES_IN="7d"

   # NextAuth
   NEXTAUTH_SECRET="your-nextauth-secret-here"
   NEXTAUTH_URL="https://your-app.vercel.app"

   # API Configuration
   NEXT_PUBLIC_API_URL="https://your-app.vercel.app/api"

   # Environment
   NODE_ENV="production"

   # Security
   BCRYPT_ROUNDS="12"
   CORS_ORIGIN="https://your-app.vercel.app"

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS="900000"
   RATE_LIMIT_MAX_REQUESTS="100"

   # File Upload
   MAX_FILE_SIZE="5242880"
   UPLOAD_DIR="uploads"

   # Logging
   LOG_LEVEL="info"
   ENABLE_SECURITY_HEADERS="true"
   ENABLE_CSRF_PROTECTION="true"
   ENABLE_RATE_LIMITING="true"
   ENABLE_REQUEST_LOGGING="true"
   ENABLE_SECURITY_LOGGING="true"
   ```

## **Step 3: Deploy Database Schema**

After deployment, run these commands in Vercel CLI:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to production database
npx prisma db push

# Seed the database
npx prisma db seed
```

## **Step 4: Test Your Deployment**

1. **Visit your app:** `https://your-app.vercel.app`
2. **Test login:** Use the seeded admin credentials:
   - Email: `admin@upmenu.com`
   - Password: `admin123`
3. **Test menu:** Check if menu items are loading
4. **Test admin panel:** Try adding/editing menu items

## **Demo Credentials**

- **Admin:** `admin@upmenu.com` / `admin123`
- **Manager:** `manager@upmenu.com` / `manager123`

## **Production Checklist**

- ✅ Environment variables set
- ✅ Database connected
- ✅ Schema deployed
- ✅ Data seeded
- ✅ Authentication working
- ✅ Menu items loading
- ✅ Admin panel functional

## **Troubleshooting**

### **Build Errors:**

- Check environment variables
- Ensure Prisma client is generated
- Verify all dependencies are installed

### **Database Errors:**

- Check DATABASE_URL format
- Ensure database is accessible
- Run `npx prisma db push` to sync schema

### **Authentication Errors:**

- Verify JWT secrets are set
- Check NEXTAUTH_URL matches your domain
- Ensure CORS_ORIGIN is correct

## **Performance Optimization**

- Enable Vercel Analytics
- Use Vercel Edge Functions for API routes
- Optimize images with Next.js Image component
- Enable caching headers

## **Security Checklist**

- ✅ Strong JWT secrets
- ✅ HTTPS enabled
- ✅ CORS configured
- ✅ Rate limiting enabled
- ✅ Input validation
- ✅ SQL injection protection
- ✅ XSS protection

---

**🎉 Your production-ready menu application is now live on Vercel!**
