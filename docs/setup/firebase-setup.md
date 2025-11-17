# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for the Voice Keyboard app.

## Prerequisites

1. A Firebase account (sign up at [firebase.google.com](https://firebase.google.com))
2. A Firebase project created

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

## Step 2: Enable Email/Password Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get started** (if first time)
3. Go to the **Sign-in method** tab
4. Click on **Email/Password**
5. Enable **Email/Password** (toggle ON)
6. Click **Save**

## Step 3: Get Your Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select **Project settings**
3. Scroll down to **Your apps** section
4. If you don't have a web app, click the **</>** (Web) icon to add one
5. Register your app with a nickname (e.g., "Voice Keyboard Web")
6. Copy the Firebase configuration object

## Step 4: Set Up Environment Variables

1. Create a `.env.local` file in the root of your project (if it doesn't exist)
2. Add your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3. Replace the placeholder values with your actual Firebase config values

## Step 5: Verify Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Try signing up a new user at `/signup`
3. Try logging in at `/login`

## Important Notes

- Never commit `.env.local` to version control (it's already in `.gitignore`)
- The `NEXT_PUBLIC_` prefix is required for Next.js to expose these variables to the browser
- Make sure your Firebase project has billing enabled if you plan to use it in production (Firebase has a free tier)

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure all environment variables are set in `.env.local`
- Restart your dev server after adding environment variables

### "Firebase: Error (auth/operation-not-allowed)"
- Make sure Email/Password authentication is enabled in Firebase Console
- Go to Authentication > Sign-in method and enable Email/Password

### Authentication not persisting
- Check browser console for errors
- Verify Firebase config values are correct
- Make sure you're using the correct Firebase project

## Security Rules (Future)

When you set up Firestore or Realtime Database, make sure to configure security rules to protect user data.

