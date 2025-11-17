# Frontend Pages - PostgreSQL Connection Status

## ✅ Pages Connected to PostgreSQL

### 1. **Home Page** (`/home`)
- **Status**: ✅ **Fully Connected**
- **API Calls**:
  - `api.getTranscripts()` - Fetches recent transcripts on load
  - `api.createTranscript()` - Saves new transcript when recording stops
- **Database Tables**: `transcriptions`

---

### 2. **Library Page** (`/library`)
- **Status**: ✅ **Fully Connected**
- **API Calls**:
  - `api.getTranscripts()` - Fetches all user transcripts
- **Database Tables**: `transcriptions`

---

### 3. **Dictionary Page** (`/dictionary`)
- **Status**: ✅ **Fully Connected**
- **API Calls**:
  - `api.getDictionaryWords()` - Fetch all words
  - `api.createDictionaryWord()` - Add new word
  - `api.updateDictionaryWord()` - Update word
  - `api.deleteDictionaryWord()` - Delete word
- **Database Tables**: `dictionary_words`

---

### 4. **Settings Page** (`/settings`)
- **Status**: ✅ **Fully Connected**
- **API Calls**:
  - `api.getSettings()` - Fetch user settings
  - `api.updateSettings()` - Update settings
- **Database Tables**: `user_settings`

---

### 5. **Transcript Detail Page** (`/transcript/[id]`)
- **Status**: ✅ **Fully Connected**
- **API Calls**:
  - `api.getTranscript(id)` - Fetch single transcript
- **Database Tables**: `transcriptions`

---

## ⚠️ Pages NOT Connected (By Design)

### 6. **Profile Page** (`/profile`)
- **Status**: ⚠️ **Uses Firebase Only** (No direct database calls)
- **Reason**: Displays read-only profile information from Firebase
- **Note**: User data is automatically synced to PostgreSQL via `syncUserToDatabase()` when they access any other page that makes an API call
- **Database Tables**: User data synced to `users` table (indirectly)

---

## ❌ Pages That Don't Need Database

### 7. **Landing Page** (`/`)
- **Status**: ❌ **No Database Needed**
- **Reason**: Static marketing/landing page
- **Database**: Not applicable

---

### 8. **Login Page** (`/login`)
- **Status**: ❌ **No Database Needed**
- **Reason**: Only handles Firebase authentication
- **Database**: Not applicable
- **Note**: User gets synced to database on first API call after login

---

### 9. **Signup Page** (`/signup`)
- **Status**: ❌ **No Database Needed**
- **Reason**: Only handles Firebase account creation
- **Database**: Not applicable
- **Note**: User gets synced to database on first API call after signup

---

## Summary

### ✅ Connected Pages: **5 out of 9 pages**
- All pages that require database operations are connected
- All authenticated pages that display/save data use PostgreSQL

### ⚠️ Indirect Connection: **1 page**
- Profile page uses Firebase but user data syncs to DB automatically

### ❌ No Database Needed: **3 pages**
- Landing page (public, static)
- Login/Signup pages (authentication only)

---

## User Data Sync Flow

When a user signs up or logs in:
1. Account created in Firebase Authentication
2. User redirected to `/home` (or other protected page)
3. On first API call, `syncUserToDatabase()` automatically:
   - Creates user record in PostgreSQL `users` table
   - Links Firebase UID to database user ID
4. All subsequent API calls use the synced user data

---

## Conclusion

**✅ All pages that need PostgreSQL are properly connected.**

- **5 pages** directly use the database via API calls
- **1 page** (profile) uses Firebase but data syncs automatically
- **3 pages** (landing, login, signup) don't need database access

The architecture is correct: public/auth pages don't need database, and all authenticated data pages are fully connected to PostgreSQL.

