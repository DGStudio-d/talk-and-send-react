# Frontend Deployment Guide

## Build Completed Successfully! ✅

Your React frontend has been built and is ready for deployment.

## Build Output

- **Location:** `talk-and-send-react/dist/`
- **Total Size:** ~1.5 MB (compressed: ~350 KB)
- **Build Time:** ~36 seconds
- **Status:** ✅ Production-ready

## Deployment Options

### Option 1: Hostinger/cPanel (Recommended)

#### Step 1: Upload Files
1. Login to your Hostinger/cPanel
2. Go to **File Manager**
3. Navigate to your domain folder (e.g., `public_html`)
4. Upload all files from the `dist/` folder
5. Make sure the files are in the root of your domain folder

#### Step 2: Configure .htaccess
Create or update `.htaccess` in your domain root:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Redirect HTTP to HTTPS
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  
  # Handle React Router
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType text/x-javascript "access plus 1 month"
</IfModule>
```

#### Step 3: Verify Deployment
Visit your domain: `https://learnaccademy.com`

### Option 2: Netlify (Alternative)

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   cd talk-and-send-react
   netlify deploy --prod --dir=dist
   ```

3. Configure redirects by creating `dist/_redirects`:
   ```
   /*    /index.html   200
   ```

### Option 3: Vercel (Alternative)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd talk-and-send-react
   vercel --prod
   ```

## Environment Configuration

### Production Environment Variables

The build uses `.env.production`:
```env
VITE_API_BASE_URL=https://api.learnaccademy.com/api
```

### To Change API URL

1. Edit `.env.production`
2. Rebuild:
   ```bash
   npm run build
   ```
3. Re-upload `dist/` folder

## File Structure After Upload

```
public_html/ (or your domain folder)
├── index.html
├── favicon.ico
├── favicon.svg
├── site.webmanifest
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other chunks]
├── locales/
│   ├── en/
│   ├── ar/
│   └── es/
└── .htaccess (create this)
```

## DNS Configuration

Ensure your domain DNS is configured:

### For Hostinger:
1. Go to **Domains** → **DNS Zone Editor**
2. Add/Update A Record:
   - **Type:** A
   - **Name:** @ (or www)
   - **Points to:** Your server IP
   - **TTL:** 14400

3. Add CNAME for www (if needed):
   - **Type:** CNAME
   - **Name:** www
   - **Points to:** learnaccademy.com
   - **TTL:** 14400

## SSL Certificate

### Using Hostinger:
1. Go to **SSL/TLS**
2. Select your domain
3. Click **Install SSL Certificate**
4. Choose **Let's Encrypt** (Free)
5. Wait for installation (5-10 minutes)

### Verify SSL:
Visit: `https://learnaccademy.com`

## Testing Checklist

After deployment, test:

- [ ] Homepage loads: `https://learnaccademy.com`
- [ ] Login page works: `https://learnaccademy.com/login`
- [ ] Register page works: `https://learnaccademy.com/register`
- [ ] API connection works (check browser console)
- [ ] Language switching works
- [ ] All routes work (no 404 errors)
- [ ] Images load correctly
- [ ] Favicon appears in browser tab
- [ ] Mobile responsive design
- [ ] HTTPS is enforced (no mixed content)

## Performance Optimization

### Already Implemented:
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Asset compression
- ✅ Tree shaking
- ✅ Minification

### Additional Optimizations:
1. Enable Gzip compression (via .htaccess)
2. Enable browser caching (via .htaccess)
3. Use CDN for static assets (optional)
4. Enable HTTP/2 on server

## Troubleshooting

### Issue 1: Blank Page
**Solution:**
- Check browser console for errors
- Verify API URL in `.env.production`
- Check `.htaccess` configuration
- Clear browser cache

### Issue 2: 404 on Refresh
**Solution:**
- Ensure `.htaccess` is configured correctly
- Check if mod_rewrite is enabled
- Verify RewriteBase is correct

### Issue 3: API Connection Failed
**Solution:**
- Check CORS configuration on backend
- Verify API URL is correct
- Check if backend is accessible
- Review browser console for CORS errors

### Issue 4: Assets Not Loading
**Solution:**
- Check file paths in browser console
- Verify all files uploaded correctly
- Check file permissions (755 for folders, 644 for files)
- Clear browser cache

### Issue 5: Slow Loading
**Solution:**
- Enable Gzip compression
- Enable browser caching
- Check server resources
- Use CDN for assets

## Updating the Frontend

### For Future Updates:

1. **Make changes to code**
2. **Rebuild:**
   ```bash
   cd talk-and-send-react
   npm run build
   ```
3. **Upload new dist/ folder**
4. **Clear browser cache**
5. **Test thoroughly**

### Quick Update Script:
```bash
# Build
npm run build

# Upload via FTP (example using lftp)
lftp -u username,password ftp.yourdomain.com -e "mirror -R dist/ public_html/; quit"
```

## Monitoring

### Check These Regularly:
- Google Analytics (if configured)
- Server error logs
- Browser console errors
- Page load speed
- Mobile responsiveness
- SSL certificate expiry

## Backup Strategy

### Before Each Deployment:
1. Backup current `dist/` folder locally
2. Backup server files
3. Document changes made
4. Test in staging (if available)

## Security Best Practices

- ✅ HTTPS enforced
- ✅ Security headers configured
- ✅ XSS protection enabled
- ✅ CORS properly configured
- ✅ No sensitive data in frontend code
- ✅ Environment variables used for API URLs

## Support

**Need Help?**
- Check browser console for errors
- Review server error logs
- Contact: zakariiptv90@gmail.com

---

## Quick Deployment Checklist

- [ ] Build completed successfully
- [ ] `.env.production` configured
- [ ] Files uploaded to server
- [ ] `.htaccess` created/configured
- [ ] DNS configured correctly
- [ ] SSL certificate installed
- [ ] Domain accessible via HTTPS
- [ ] All pages tested
- [ ] API connection verified
- [ ] Mobile tested
- [ ] Performance checked

**Your frontend is ready to deploy! 🚀**

Upload the `dist/` folder contents to your server and you're done!
