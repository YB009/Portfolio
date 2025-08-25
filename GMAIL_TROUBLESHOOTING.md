# Gmail SMTP Troubleshooting Guide

## 🚨 Common Issues on Render

### 1. Gmail App Password Issues
- **App passwords expire** - Generate a new one
- **2FA not enabled** - Must be enabled for app passwords
- **Wrong password** - Double-check the app password

### 2. Gmail Security Settings
- **Less secure app access** - No longer supported by Google
- **Account security** - Gmail might block connections from cloud providers

### 3. Network/Firewall Issues
- **Port blocking** - Some cloud providers block SMTP ports
- **IP restrictions** - Gmail might block Render's IP ranges

## 🔧 Troubleshooting Steps

### Step 1: Generate New Gmail App Password
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. Scroll down to **App passwords**
4. Generate a new app password for "Mail"
5. Update the `SMTP_PASS` environment variable in Render

### Step 2: Test Email Configuration
After deploying, test the email configuration:
```
https://your-service-name.onrender.com/api/test-email
```

### Step 3: Check Render Logs
Look for these specific error messages:
- `EAUTH` - Authentication failed (wrong password)
- `ETIMEDOUT` - Connection timeout
- `ECONNREFUSED` - Connection refused
- `Greeting never received` - SMTP handshake failed

### Step 4: Alternative Solutions

#### Option A: Use Gmail API (More Reliable)
Replace SMTP with Gmail API for better reliability.

#### Option B: Use Alternative Email Service
Consider using:
- **Resend** (recommended for cloud deployments)
- **SendGrid**
- **Mailgun**

#### Option C: Use Gmail with Different Settings
Try these alternative Gmail settings:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
```

## 📝 Quick Fix Checklist

- [ ] Generate new Gmail app password
- [ ] Enable 2FA on Google account
- [ ] Update `SMTP_PASS` in Render environment variables
- [ ] Test with `/api/test-email` endpoint
- [ ] Check Render logs for specific error messages
- [ ] Consider alternative email service if Gmail continues to fail

## 🆘 If Gmail Still Fails

The most reliable solution is to switch to a dedicated email service like **Resend** which is specifically designed for cloud deployments and has much better reliability than Gmail SMTP.
