# Complete Logic Flow Documentation

This document provides a comprehensive overview of all functionalities and their implementation details.

---

## Table of Contents

1. [Authentication Flow](#1-authentication-flow)
2. [Recording & Transcription Flow](#2-recording--transcription-flow)
3. [Dictionary Management Flow](#3-dictionary-management-flow)
4. [Transcript Management Flow](#4-transcript-management-flow)
5. [Settings Management Flow](#5-settings-management-flow)
6. [Navigation & Route Protection Flow](#6-navigation--route-protection-flow)
7. [Database Schema & Relationships](#7-database-schema--relationships)

---

## 1. Authentication Flow

### 1.1 User Sign Up

**Location**: `app/(auth)/signup/page.tsx`, `lib/auth.ts`

**Steps**:
1. User enters name, email, and password on signup page
2. Form validation (client-side)
3. Call `signUp()` from `lib/auth.ts`:
   - `createUserWithEmailAndPassword(auth, email, password)` - Firebase Auth
   - `updateProfile(user, { displayName: name })` - Set display name
4. On success:
   - Firebase creates user account
   - User profile updated with display name
   - `AuthContext` detects auth state change via `onAuthStateChanged`
   - User redirected to home page (or returnUrl if specified)
5. On error:
   - Error message displayed (user-friendly from `getAuthErrorMessage()`)

**Implementation Details**:
- Uses Firebase Authentication (Email/Password)
- Error handling with user-friendly messages
- Automatic profile update with display name

---

### 1.2 User Login

**Location**: `app/(auth)/login/page.tsx`, `lib/auth.ts`

**Steps**:
1. User enters email and password on login page
2. Form validation (client-side)
3. Call `signIn()` from `lib/auth.ts`:
   - `signInWithEmailAndPassword(auth, email, password)` - Firebase Auth
4. On success:
   - Firebase authenticates user
   - `AuthContext` detects auth state change
   - User redirected to home page (or returnUrl from query params)
5. On error:
   - Error message displayed (user-friendly)

**Implementation Details**:
- Supports return URL for post-login redirection
- Error handling for invalid credentials, network errors, etc.

---

### 1.3 User Logout

**Location**: `components/Sidebar.tsx`, `lib/auth.ts`

**Steps**:
1. User clicks logout button in sidebar
2. Call `signOutUser()` from `lib/auth.ts`:
   - `signOut(auth)` - Firebase Auth
3. On success:
   - Firebase signs out user
   - `AuthContext` detects auth state change
   - User redirected to landing page (`/`)

**Implementation Details**:
- Silent error handling (doesn't show errors to user)
- Automatic redirect on logout

---

### 1.4 Auth State Management

**Location**: `contexts/AuthContext.tsx`

**Steps**:
1. `AuthProvider` wraps the app in `app/layout.tsx`
2. On mount:
   - Subscribe to `onAuthStateChanged(auth, callback)`
   - Callback updates `user` state and `loading` state
3. Components use `useAuth()` hook to access:
   - `user`: Current Firebase user object (or null)
   - `loading`: Boolean indicating if auth check is in progress
4. On unmount:
   - Unsubscribe from auth state changes

**Implementation Details**:
- Global auth state available to all components
- Loading state prevents flash of unauthenticated content
- Automatic cleanup on unmount

---

### 1.5 Server-Side Token Verification

**Location**: `lib/api-helpers.ts`

**Steps**:
1. API route receives request with `Authorization: Bearer <token>` header
2. `getUserInfoFromRequest()` extracts token from header
3. Firebase Admin SDK verifies token:
   - `getAuth(firebaseAdmin).verifyIdToken(idToken)`
4. Returns user info:
   - `userId`: Firebase UID
   - `email`: User email
   - `name`: Display name (if available)
5. On error:
   - Returns `null` (unauthorized)

**Implementation Details**:
- Firebase Admin SDK initialized from `FIREBASE_ADMIN_SDK` env var
- Token verification happens on every API request
- Used by all protected API routes

---

## 2. Recording & Transcription Flow

### 2.1 Start Recording

**Location**: `app/(main)/home/page.tsx`, `hooks/useRecorder.ts`

**Steps**:
1. User clicks record button
2. `handleRecordClick()` calls `startRecording()` from `useRecorder` hook
3. `useRecorder.startRecording()`:
   - Request microphone access: `navigator.mediaDevices.getUserMedia({ audio: true })`
   - Check MediaRecorder support: `MediaRecorder.isTypeSupported("audio/webm")`
   - Create MediaRecorder: `new MediaRecorder(stream, { mimeType: "audio/webm" })`
   - Set up event handlers:
     - `ondataavailable`: Fires every 5 seconds (timeslice: 5000ms)
     - `onerror`: Handle recording errors
     - `onstop`: Clean up media stream
   - Start recording: `mediaRecorder.start(5000)`
   - Update state: `isRecording = true`
4. Audio chunks collected:
   - Every 5 seconds, `ondataavailable` fires
   - Chunk added to `audioChunksRef.current` array
   - State updated: `setAudioChunks([...audioChunksRef.current])`

**Implementation Details**:
- 5-second timeslice for incremental processing
- Audio format: `audio/webm`
- Error handling for microphone permissions, unsupported formats
- Automatic cleanup on stop/error

---

### 2.2 Process Audio Chunks (During Recording)

**Location**: `app/(main)/home/page.tsx`

**Steps**:
1. `useEffect` watches `audioChunks` array
2. When new chunk arrives:
   - Check if chunk already processed (using `processedChunksRef`)
   - Mark chunk as processed
   - **Accumulate all chunks** up to this point:
     ```typescript
     const accumulatedChunks = audioChunks.slice(0, latestChunkIndex + 1);
     const mergedBlob = new Blob(accumulatedChunks, { type: "audio/webm" });
     ```
3. Send accumulated audio to API:
   - `api.transcribeAudio(mergedBlob, false)` - `isFinal: false`
4. API response:
   - Returns complete transcript of all accumulated chunks
   - Client replaces `liveText` with API response (no merging needed)
5. Display:
   - `LiveTranscript` component shows real-time text
   - `Waveform` component shows recording animation

**Implementation Details**:
- **Key Point**: Accumulated chunks are sent (not individual chunks)
- MediaRecorder chunks after the first are continuation chunks without headers
- Merging all chunks creates a valid standalone WebM file
- API returns complete transcript (no client-side merging needed)

---

### 2.3 Stop Recording & Final Transcription

**Location**: `app/(main)/home/page.tsx`, `hooks/useRecorder.ts`

**Steps**:
1. User clicks stop button
2. `handleRecordClick()` calls `stopRecording()` from `useRecorder` hook
3. `useRecorder.stopRecording()`:
   - Stop MediaRecorder: `mediaRecorder.stop()`
   - Stop all media tracks: `stream.getTracks().forEach(track => track.stop())`
   - Update state: `isRecording = false`, `isProcessing = false`
   - Final `ondataavailable` event fires (last chunk)
4. `useEffect` detects recording stopped:
   - Check: `wasRecordingRef.current && !isRecording && !isProcessing`
   - Wait 300ms for final chunk to arrive
   - **Merge all chunks** into final blob:
     ```typescript
     const finalBlob = new Blob(audioChunks, { type: "audio/webm" });
     ```
5. Send final audio to API:
   - `api.transcribeAudio(finalBlob, true)` - `isFinal: true`
6. API response:
   - Returns final transcript
   - Saves transcript to database
   - Returns `transcriptId`
7. Client updates:
   - Replace `liveText` with final transcript
   - Refresh recent transcripts list
   - Clear `liveText` after 2 seconds (visual feedback)
   - Clear processed chunks tracking

**Implementation Details**:
- Final chunk includes all accumulated audio
- API saves to database only when `isFinal: true`
- Visual feedback: transcript shown briefly before clearing

---

### 2.4 Transcription API Processing

**Location**: `app/api/transcribe/route.ts`

**Steps**:
1. Receive POST request with FormData:
   - `audio`: File blob (accumulated audio chunks)
   - `final`: boolean string ("true" or "false")
2. Authentication:
   - Extract token from `Authorization` header
   - Verify with Firebase Admin SDK
   - Get user info: `userId`, `email`, `name`
3. User sync:
   - `syncUserToDatabase()` - Ensure user exists in PostgreSQL
   - Uses caching (5-minute TTL) to avoid redundant queries
4. Audio processing:
   - Convert File to Blob with clean MIME type (`audio/webm`)
   - Validate file size (max 25MB for OpenAI)
5. Transcription:
   - Send to OpenAI Whisper API:
     - Endpoint: `https://api.openai.com/v1/audio/transcriptions`
     - Model: `whisper-1`
     - Language: `en`
     - Timeout: 60 seconds
   - Receive raw transcription text
6. Dictionary corrections:
   - Fetch user's dictionary words from database
   - Apply corrections using `applyDictionaryCorrections()`:
     - Case-insensitive regex replacement
     - Sorted by phrase length (longest first)
7. Return response:
   - **For partial (`isFinal: false`)**: Return `correctedText` directly
   - **For final (`isFinal: true`)**:
     - Save transcript to database
     - Return `correctedText` with `transcriptId`

**Implementation Details**:
- **Key Point**: No merging with existing partials (accumulated audio is already complete)
- Dictionary corrections applied to all transcriptions
- Error handling for OpenAI API (quota, rate limit, invalid key, timeout)
- Database operations are non-blocking (errors logged but don't fail transcription)

---

### 2.5 Dictionary Corrections

**Location**: `app/api/transcribe/route.ts` (function: `applyDictionaryCorrections`)

**Steps**:
1. Fetch user's dictionary words:
   - Query: `prisma.dictionaryWord.findMany({ where: { userId } })`
   - Limit: 1000 words (prevent excessive memory)
2. Sort by phrase length (longest first):
   - Ensures multi-word phrases are matched before single words
   - Example: "New York" matched before "New" or "York"
3. Apply corrections:
   - For each dictionary entry:
     - Create case-insensitive regex: `new RegExp(phrase, 'gi')`
     - Replace in text: `text.replace(regex, correction)`
4. Return corrected text

**Implementation Details**:
- Case-insensitive matching
- Longest phrase first (prevents partial matches)
- Applied to all transcriptions (partial and final)

---

## 3. Dictionary Management Flow

### 3.1 List Dictionary Words

**Location**: `app/(main)/dictionary/page.tsx`, `app/api/dictionary/route.ts`

**Steps**:
1. Page loads, `useEffect` triggers
2. Client calls: `api.getDictionaryWords()`
3. API route (`GET /api/dictionary`):
   - Verify authentication (Firebase token)
   - Sync user to database
   - Query: `prisma.dictionaryWord.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })`
   - Return array of dictionary words
4. Client updates state:
   - `setEntries(data)`
5. Display:
   - `DictionaryTable` component renders entries

**Implementation Details**:
- User-scoped (only shows current user's words)
- Ordered by creation date (newest first)
- Loading and error states handled

---

### 3.2 Create Dictionary Word

**Location**: `app/(main)/dictionary/page.tsx`, `app/api/dictionary/route.ts`

**Steps**:
1. User clicks "Add Word" button
2. `AddWordDialog` opens
3. User enters phrase and correction
4. On submit, `handleAdd()` called:
   - Client calls: `api.createDictionaryWord(phrase, correction)`
5. API route (`POST /api/dictionary`):
   - Verify authentication
   - Validate input (phrase and correction required)
   - Check if word already exists:
     - Query: `prisma.dictionaryWord.findUnique({ where: { userId_phrase } })`
   - If exists: Update existing word (prevent duplicates)
   - If not exists: Create new word
   - Return created/updated word
6. Client updates state:
   - Add new entry to `entries` array (prepend for newest first)
7. Dialog closes, table updates

**Implementation Details**:
- Prevents duplicate phrases (updates existing if phrase matches)
- User-scoped (unique constraint on `userId_phrase`)
- Optimistic UI update (adds to list immediately)

---

### 3.3 Update Dictionary Word

**Location**: `app/(main)/dictionary/page.tsx`, `app/api/dictionary/[id]/route.ts`

**Steps**:
1. User clicks edit button on dictionary entry
2. `handleEdit()` sets `editingEntry` and opens `EditWordDialog`
3. User modifies phrase or correction
4. On save, `handleSave()` called:
   - Client calls: `api.updateDictionaryWord(id, phrase, correction)`
5. API route (`PUT /api/dictionary/[id]`):
   - Verify authentication
   - Verify word belongs to user
   - Validate input
   - Update: `prisma.dictionaryWord.update({ where: { id }, data: { phrase, correction } })`
   - Return updated word
6. Client updates state:
   - Replace entry in `entries` array
7. Dialog closes, table updates

**Implementation Details**:
- User ownership verification (prevents editing other users' words)
- Optimistic UI update

---

### 3.4 Delete Dictionary Word

**Location**: `app/(main)/dictionary/page.tsx`, `app/api/dictionary/[id]/route.ts`

**Steps**:
1. User clicks delete button on dictionary entry
2. Confirmation dialog: "Are you sure you want to delete this dictionary word?"
3. On confirm, `handleDelete()` called:
   - Client calls: `api.deleteDictionaryWord(id)`
4. API route (`DELETE /api/dictionary/[id]`):
   - Verify authentication
   - Verify word belongs to user
   - Delete: `prisma.dictionaryWord.delete({ where: { id } })`
5. Client updates state:
   - Remove entry from `entries` array
6. Table updates

**Implementation Details**:
- User ownership verification
- Confirmation dialog prevents accidental deletion
- Optimistic UI update

---

## 4. Transcript Management Flow

### 4.1 List Transcripts (Library Page)

**Location**: `app/(main)/library/page.tsx`, `app/api/transcripts/route.ts`

**Steps**:
1. Page loads, `useEffect` triggers
2. Client calls: `api.getTranscripts()`
3. API route (`GET /api/transcripts`):
   - Verify authentication
   - Sync user to database
   - Query: `prisma.transcription.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })`
   - Return array of transcripts
4. Client updates state:
   - `setTranscripts(data)`
5. Format dates:
   - `useMemo` formats `createdAt` to readable format: "MMM d • h:mm a"
6. Search filtering:
   - `useMemo` filters transcripts based on `searchQuery`
   - Case-insensitive text search
7. Display:
   - `TranscriptList` component renders filtered transcripts

**Implementation Details**:
- User-scoped (only shows current user's transcripts)
- Ordered by creation date (newest first)
- Real-time search filtering
- Loading and error states handled

---

### 4.2 View Transcript Detail

**Location**: `app/(main)/transcript/[id]/page.tsx`, `app/api/transcripts/[id]/route.ts`

**Steps**:
1. User clicks transcript card in Library
2. Navigate to `/library/transcript/[id]`
3. Page loads, `useEffect` triggers
4. Extract `id` from URL params
5. Client calls: `api.getTranscript(id)`
6. API route (`GET /api/transcripts/[id]`):
   - Verify authentication
   - Query: `prisma.transcription.findUnique({ where: { id } })`
   - Verify transcript belongs to user
   - Return transcript
7. Client updates state:
   - `setTranscript(data)`
8. Display:
   - Full transcript text
   - Created date
   - Copy button
   - Delete button

**Implementation Details**:
- User ownership verification
- Loading and error states handled
- Copy to clipboard functionality

---

### 4.3 Delete Transcript

**Location**: `app/(main)/transcript/[id]/page.tsx`, `app/api/transcripts/[id]/route.ts`

**Steps**:
1. User clicks delete button on transcript detail page
2. Confirmation dialog: "Are you sure you want to delete this transcript?"
3. On confirm, `handleDelete()` called:
   - Client calls: `api.deleteTranscript(id)`
4. API route (`DELETE /api/transcripts/[id]`):
   - Verify authentication
   - Verify transcript belongs to user
   - Delete: `prisma.transcription.delete({ where: { id } })`
5. Client redirects:
   - Navigate to `/library` page

**Implementation Details**:
- User ownership verification
- Confirmation dialog prevents accidental deletion
- Automatic redirect after deletion

---

### 4.4 Copy Transcript to Clipboard

**Location**: Multiple components (TranscriptCard, RecentTranscripts, Transcript detail page)

**Steps**:
1. User hovers over transcript card (or clicks copy button)
2. Copy button appears (opacity transition)
3. User clicks copy button
4. `handleCopy()` called:
   - `navigator.clipboard.writeText(text)`
5. Visual feedback:
   - Show checkmark icon
   - Show "Copied!" text
   - Reset after 2 seconds

**Implementation Details**:
- Uses Clipboard API
- Visual feedback for better UX
- Works on Library page, Home page (recent transcripts), and detail page

---

## 5. Settings Management Flow

### 5.1 Load Settings

**Location**: `app/(main)/settings/page.tsx`, `app/api/settings/route.ts`

**Steps**:
1. Page loads, `useEffect` triggers
2. Client calls: `api.getSettings()`
3. API route (`GET /api/settings`):
   - Verify authentication
   - Sync user to database
   - Query: `prisma.userSettings.findUnique({ where: { userId } })`
   - If not found, return defaults: `{ autoPunctuation: false }`
   - Return settings
4. Client updates state:
   - `setAutoPunctuation(settings.autoPunctuation)`
   - `setName(user.displayName)`
   - `setEmail(user.email)`

**Implementation Details**:
- Defaults used if settings don't exist
- User info from Firebase Auth context
- Loading state handled

---

### 5.2 Update Settings

**Location**: `app/(main)/settings/page.tsx`, `app/api/settings/route.ts`

**Steps**:
1. User toggles "Auto punctuation" setting
2. `handleAutoPunctuationChange()` called
3. Client calls: `api.updateSettings(autoPunctuation)`
4. API route (`PUT /api/settings`):
   - Verify authentication
   - Sync user to database
   - Upsert settings: `prisma.userSettings.upsert({ where: { userId }, update: { autoPunctuation }, create: { userId, autoPunctuation } })`
   - Return updated settings
5. Client updates state:
   - `setAutoPunctuation(value)`

**Implementation Details**:
- Uses upsert (create if not exists, update if exists)
- Optimistic UI update
- Error handling with user-friendly messages

---

## 6. Navigation & Route Protection Flow

### 6.1 Route Protection

**Location**: `components/auth/ProtectedRoute.tsx`, `app/(main)/layout.tsx`

**Steps**:
1. User navigates to protected route (e.g., `/home`)
2. `ProtectedRoute` component wraps all `(main)` routes
3. Check authentication:
   - `useAuth()` hook gets `user` and `loading` from `AuthContext`
4. If loading:
   - Show loading spinner
5. If not authenticated:
   - Store current path as `returnUrl` in query params
   - Redirect to `/login?returnUrl=<encoded-path>`
6. If authenticated:
   - Render protected content (children)

**Implementation Details**:
- All routes in `(main)` group are protected
- Return URL preserved for post-login redirection
- Loading state prevents flash of unauthenticated content

---

### 6.2 Sidebar Navigation

**Location**: `components/Sidebar.tsx`

**Steps**:
1. Sidebar renders navigation links:
   - Home (`/home`)
   - Library (`/library`)
   - Dictionary (`/dictionary`)
   - Settings (`/settings`)
   - Profile (`/profile`)
2. Active route highlighted:
   - `usePathname()` gets current path
   - Active link styled differently
3. Logout button:
   - Calls `signOutUser()` on click
   - Redirects to landing page

**Implementation Details**:
- Uses Next.js `usePathname()` for active route detection
- Clean, modern sidebar design
- Logout functionality integrated

---

## 7. Database Schema & Relationships

### 7.1 User Model

**Location**: `prisma/schema.prisma`

```prisma
model User {
  id        String   @id
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  transcriptions DictionaryWord[]
  dictionaryWords DictionaryWord[]
  settings       UserSettings?
}
```

**Relationships**:
- One-to-many with `Transcription`
- One-to-many with `DictionaryWord`
- One-to-one with `UserSettings`

---

### 7.2 Transcription Model

**Location**: `prisma/schema.prisma`

```prisma
model Transcription {
  id        String   @id @default(cuid())
  text      String
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Relationships**:
- Many-to-one with `User` (cascade delete)

---

### 7.3 DictionaryWord Model

**Location**: `prisma/schema.prisma`

```prisma
model DictionaryWord {
  id         String   @id @default(cuid())
  phrase     String
  correction String
  userId     String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([userId, phrase])
}
```

**Relationships**:
- Many-to-one with `User` (cascade delete)
- Unique constraint on `userId_phrase` (prevents duplicate phrases per user)

---

### 7.4 UserSettings Model

**Location**: `prisma/schema.prisma`

```prisma
model UserSettings {
  id              String   @id @default(cuid())
  userId          String   @unique
  autoPunctuation Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Relationships**:
- One-to-one with `User` (cascade delete)

---

## 8. Key Implementation Patterns

### 8.1 User Sync Pattern

**Location**: `lib/user-sync.ts`

**Purpose**: Sync Firebase user data to PostgreSQL database

**Steps**:
1. Check cache (5-minute TTL) to avoid redundant queries
2. Try `upsert` (single query):
   - If user exists: Update email/name
   - If user doesn't exist: Create with email/name
3. Handle email conflicts:
   - If email taken by another user: Create with placeholder email
   - If user exists but email conflicts: Update only name
4. Error handling:
   - Unique constraint errors handled gracefully
   - Logs errors only in production

**Optimization**:
- Caching reduces database queries
- Single `upsert` query instead of find + update/create
- Non-blocking (errors don't fail the operation)

---

### 8.2 API Authentication Pattern

**Location**: `lib/api-helpers.ts`

**Pattern**: All protected API routes use this pattern

**Steps**:
1. Extract token from `Authorization: Bearer <token>` header
2. Verify token with Firebase Admin SDK
3. Get user info: `userId`, `email`, `name`
4. Return `null` if unauthorized

**Usage**: Called at the start of every protected API route

---

### 8.3 Accumulated Audio Pattern

**Location**: `app/(main)/home/page.tsx`, `app/api/transcribe/route.ts`

**Purpose**: Handle MediaRecorder chunks correctly

**Key Insight**: MediaRecorder chunks after the first are continuation chunks without headers. They cannot be transcribed individually.

**Solution**:
1. Accumulate all chunks: `audioChunks.slice(0, latestChunkIndex + 1)`
2. Merge into single blob: `new Blob(accumulatedChunks, { type: "audio/webm" })`
3. Send accumulated blob to API
4. API transcribes complete audio (no merging needed)

**Why This Works**:
- Each request contains a complete, valid WebM file
- OpenAI Whisper can process the file correctly
- No duplication (API doesn't merge with existing partials)

---

### 8.4 Error Handling Pattern

**Location**: Throughout codebase

**Pattern**:
1. Try-catch blocks around async operations
2. User-friendly error messages
3. Production-only logging (errors logged only in production)
4. Non-blocking operations (database sync errors don't fail main operations)

**Example**:
```typescript
try {
  // Operation
} catch (error) {
  if (process.env.NODE_ENV === "production") {
    console.error("Error:", error instanceof Error ? error.message : "Unknown error");
  }
  // Continue or return error response
}
```

---

## 9. Environment Variables

### Required Variables

1. **Firebase Client Config** (`.env.local`):
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

2. **Firebase Admin SDK** (`.env.local`):
   - `FIREBASE_ADMIN_SDK` (JSON string)

3. **Database** (`.env.local`):
   - `DATABASE_URL` (PostgreSQL connection string)

4. **OpenAI API** (`.env.local`):
   - `OPENAI_API_KEY`

---

## 10. File Structure

```
app/
├── (auth)/              # Public routes (login, signup)
│   ├── login/
│   └── signup/
├── (main)/              # Protected routes (require auth)
│   ├── home/            # Recording & transcription
│   ├── library/         # Transcript list
│   ├── dictionary/      # Dictionary management
│   ├── settings/        # User settings
│   ├── profile/         # User profile
│   └── transcript/[id]/ # Transcript detail
├── api/                 # API routes
│   ├── transcribe/      # Transcription endpoint
│   ├── transcripts/      # Transcript CRUD
│   ├── dictionary/      # Dictionary CRUD
│   └── settings/        # Settings CRUD
└── page.tsx             # Landing page

components/
├── auth/                # Auth components
├── dictation/           # Recording components
├── dictionary/          # Dictionary components
├── landing/             # Landing page components
├── settings/            # Settings components
├── transcripts/         # Transcript components
└── ui/                  # ShadCN UI components

lib/
├── api-client.ts        # Client-side API helper
├── api-helpers.ts       # Server-side API helper
├── auth.ts              # Firebase auth functions
├── db.ts                # Prisma client
├── firebase.ts          # Firebase client config
└── user-sync.ts         # User sync utility

hooks/
└── useRecorder.ts       # Audio recording hook

contexts/
└── AuthContext.tsx      # Auth state management
```

---

## Summary

This application implements a complete voice-to-text transcription system with:

1. **Authentication**: Firebase Email/Password with protected routes
2. **Recording**: 5-second audio slicing with real-time transcription
3. **Transcription**: OpenAI Whisper API with dictionary corrections
4. **Storage**: PostgreSQL database with user-scoped data
5. **Management**: CRUD operations for transcripts and dictionary
6. **Settings**: User preferences with database persistence

All features are fully implemented, tested, and production-ready.

