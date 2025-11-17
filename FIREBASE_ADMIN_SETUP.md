# How to Add Firebase Admin SDK to Railway

This guide will walk you through getting your Firebase Admin SDK credentials and adding them to Railway.

## Step 1: Get Firebase Admin SDK Credentials

1. **Go to Firebase Console**
   - Visit [https://console.firebase.google.com](https://console.firebase.google.com)
   - Select your project

2. **Navigate to Service Accounts**
   - Click the gear icon (⚙️) next to "Project Overview"
   - Select **"Project settings"**
   - Go to the **"Service accounts"** tab

3. **Generate Private Key**
   - Click **"Generate new private key"** button
   - A confirmation dialog will appear
   - Click **"Generate key"**
   - A JSON file will be downloaded (e.g., `your-project-firebase-adminsdk-xxxxx.json`)

4. **Open the JSON File**
   - Open the downloaded JSON file in a text editor
   - It will look like this:
   ```json
   {
     "type": "service_account",
     "project_id": "your-project-id",
     "private_key_id": "abc123...",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
     "client_id": "123456789",
     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
     "token_uri": "https://oauth2.googleapis.com/token",
     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
   }
   ```

## Step 2: Format for Railway

Railway requires the JSON to be a **single-line string**. You have two options:

### Option A: Use Railway's Environment Variable Editor (Recommended)

Railway's editor handles JSON formatting automatically, so you can paste the JSON directly.

### Option B: Convert to Single-Line Manually

If you need to convert it manually:

1. **Remove all line breaks and extra spaces**
2. **Keep it as valid JSON** (no trailing commas, proper quotes)
3. **Escape any quotes inside the JSON** (though Firebase Admin SDK JSON shouldn't have this issue)

Example of single-line format:
```json
{"type":"service_account","project_id":"your-project-id","private_key_id":"abc123...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/..."}
```

## Step 3: Add to Railway

### Method 1: Railway Dashboard (Easiest)

1. **Go to Railway Dashboard**
   - Visit [https://railway.app](https://railway.app)
   - Log in to your account

2. **Select Your Project**
   - Click on your project
   - Click on your **Next.js service** (not the PostgreSQL database)

3. **Open Variables Tab**
   - Click on the **"Variables"** tab in the service settings
   - Or click **"New Variable"** button

4. **Add the Variable**
   - **Variable Name**: `FIREBASE_ADMIN_SDK`
   - **Variable Value**: Paste the entire JSON content (Railway will handle formatting)
   
   You can paste it in either format:
   - Multi-line JSON (Railway will convert it)
   - Single-line JSON string

5. **Save**
   - Click **"Add"** or **"Save"**
   - Railway will automatically redeploy your service

### Method 2: Railway CLI

1. **Install Railway CLI** (if not already installed):
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Link Your Project**:
   ```bash
   railway link
   ```

4. **Set the Variable**:
   ```bash
   # For single-line JSON (replace with your actual JSON)
   railway variables set FIREBASE_ADMIN_SDK='{"type":"service_account","project_id":"..."}'
   
   # Or read from file
   railway variables set FIREBASE_ADMIN_SDK="$(cat path/to/your-service-account.json)"
   ```

## Step 4: Verify It's Set Correctly

1. **Check in Railway Dashboard**
   - Go to Variables tab
   - Verify `FIREBASE_ADMIN_SDK` is listed
   - The value should show (masked for security)

2. **Check Logs After Deployment**
   - After Railway redeploys, check the logs
   - You should NOT see: `"FIREBASE_ADMIN_SDK not set. Server-side auth verification disabled."`
   - If you see that warning, the variable wasn't set correctly

3. **Test Authentication**
   - Try logging in to your app
   - Check that API calls work (create a transcript, etc.)
   - If you get "Unauthorized" errors, the Firebase Admin SDK might not be configured correctly

## Common Issues & Solutions

### Issue 1: "FIREBASE_ADMIN_SDK not set" Warning

**Problem**: The environment variable isn't being read correctly.

**Solutions**:
- Make sure the variable name is exactly `FIREBASE_ADMIN_SDK` (case-sensitive)
- Verify the variable is set in the correct service (your Next.js app, not the database)
- Check that the JSON is valid (no syntax errors)
- Redeploy the service after adding the variable

### Issue 2: "Error parsing Firebase Admin SDK"

**Problem**: The JSON format is incorrect.

**Solutions**:
- Ensure the JSON is valid (use a JSON validator)
- Make sure there are no extra commas or missing quotes
- If you converted to single-line, verify it's still valid JSON
- Try pasting the original multi-line JSON in Railway (it handles it automatically)

### Issue 3: "Unauthorized" Errors

**Problem**: Firebase Admin SDK can't verify tokens.

**Solutions**:
- Verify the service account has the correct permissions in Firebase
- Check that the `client_email` in the JSON matches your Firebase project
- Ensure the `project_id` matches your Firebase project ID
- Verify the private key is complete (includes `\n` characters for line breaks)

### Issue 4: Private Key Format Issues

**Problem**: The private key in the JSON has line breaks that need to be preserved.

**Solution**: The private key should include `\n` characters:
```json
"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

Railway will preserve these `\n` characters when you paste the JSON.

## Quick Reference

### Variable Name
```
FIREBASE_ADMIN_SDK
```

### Variable Value Format
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

### Where to Get It
1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Copy the entire contents

### Where to Add It
Railway Dashboard → Your Service → Variables Tab → Add `FIREBASE_ADMIN_SDK`

## Security Notes

⚠️ **Important Security Reminders**:

1. **Never commit the service account JSON to Git**
   - It's already in `.gitignore` (should be)
   - Only add it as a Railway environment variable

2. **Keep the JSON file secure**
   - Don't share it publicly
   - Don't commit it to version control
   - Delete the downloaded file after adding to Railway

3. **Rotate keys if compromised**
   - If you suspect the key is compromised, generate a new one in Firebase
   - Update Railway with the new key
   - Delete the old service account key

4. **Use Railway's variable masking**
   - Railway automatically masks sensitive variables in the UI
   - Only authorized team members can view/edit variables

## Testing

After adding the variable:

1. **Redeploy your service** (Railway does this automatically)
2. **Check the logs** for any Firebase Admin initialization errors
3. **Test authentication**:
   - Sign up/login
   - Create a transcript
   - Check that API calls work

If everything works, your Firebase Admin SDK is configured correctly! 🎉

