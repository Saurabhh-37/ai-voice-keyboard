# Transcription API Setup (Step 4)

## ✅ What Was Built

### `/app/api/transcribe/route.ts`

A complete ASR (Automatic Speech Recognition) API endpoint that:

1. **Accepts audio blob slices** via FormData
2. **Verifies Firebase authentication** token
3. **Gets user from PostgreSQL** database
4. **Sends audio to OpenAI Whisper API** for transcription
5. **Applies dictionary corrections** from user's custom dictionary
6. **Merges partial outputs** across multiple 5-second slices
7. **Returns partial text** for real-time display
8. **Saves final transcript** to PostgreSQL when `final=true`

### Features:

- ✅ Real-time transcription (partial results every 5 seconds)
- ✅ Dictionary word corrections applied automatically
- ✅ Partial transcript merging across chunks
- ✅ Final transcript saved to database
- ✅ User-scoped and secure (Firebase auth required)

---

## 🔧 Setup Required

### Step 1: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-...`)

### Step 2: Add to Environment Variables

Add to your `.env.local` file:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

**Important**: 
- Never commit this to Git (already in `.gitignore`)
- Restart your dev server after adding: `npm run dev`

---

## 📡 API Endpoint Details

### `POST /api/transcribe`

**Request (FormData)**:
- `audio`: Blob (audio/webm format)
- `final`: boolean (string "true" or "false")

**Response (Partial)**:
```json
{
  "text": "Hello world",  // New chunk text only
  "partial": "Hello world how are you",  // Full merged text
  "isFinal": false
}
```

**Response (Final)**:
```json
{
  "text": "Hello world how are you today",
  "isFinal": true,
  "transcriptId": "clx1234567890"
}
```

---

## 🔄 How It Works

### Flow:

1. **User starts recording** → `useRecorder` hook captures audio
2. **Every 5 seconds** → Audio chunk is sent to `/api/transcribe` with `final=false`
3. **API transcribes chunk** → Sends to OpenAI Whisper API
4. **Dictionary corrections applied** → Replaces user's custom words/phrases
5. **Partial text returned** → Displayed in real-time on UI
6. **User stops recording** → Final chunk sent with `final=true`
7. **Final transcript saved** → Stored in PostgreSQL database

### Dictionary Corrections:

If user has dictionary entries like:
- `"gpt"` → `"GPT"`
- `"ai"` → `"AI"`
- `"next js"` → `"Next.js"`

These are automatically applied to all transcriptions.

---

## 💰 OpenAI Pricing

OpenAI Whisper API pricing (as of 2024):
- **$0.006 per minute** of audio
- Very affordable for most use cases
- Example: 1 hour of transcription = ~$0.36

**Alternative Services** (if you want to switch):
- **Deepgram**: $0.0043/minute (cheaper, faster)
- **AssemblyAI**: $0.00025/second (~$0.015/minute)
- **Google Speech-to-Text**: Pay-as-you-go

---

## 🧪 Testing

### Test the Endpoint:

1. **Start dev server**: `npm run dev`
2. **Navigate to `/home`** (must be logged in)
3. **Click Record button** → Grant microphone permission
4. **Speak for 5+ seconds**
5. **Check console** → Should see transcription logs
6. **Stop recording** → Final transcript saved to database

### Expected Console Logs:

```
📥 POST /api/transcribe - Request received
✅ POST /api/transcribe - User authenticated: abc123
🎙️ Transcribing audio slice: 80340 bytes, final: false
📝 Raw transcription: "Hello world"
📊 Partial transcript updated (length: 11)
```

---

## 🐛 Troubleshooting

### Error: "OPENAI_API_KEY is not configured"

**Solution**: Add `OPENAI_API_KEY` to `.env.local` and restart dev server.

### Error: "Insufficient quota" or "Invalid API key"

**Solution**: 
- Check your OpenAI account has credits
- Verify API key is correct
- Check API key hasn't been revoked

### Error: "Failed to transcribe audio"

**Possible causes**:
- Audio format not supported (should be webm)
- Audio file too large
- Network error reaching OpenAI API
- Check server logs for details

### Transcription quality issues:

- **Whisper works best with clear audio** (good mic, quiet environment)
- **Language detection**: Currently set to English (`language: "en"`)
- **Model**: Using `whisper-1` (latest stable)

---

## 🔐 Security

- ✅ All requests require Firebase authentication
- ✅ User can only access their own transcriptions
- ✅ Dictionary corrections are user-scoped
- ✅ API key stored server-side only (never exposed to client)

---

## 📝 Next Steps

### Step 5: Integrate Home Page with Recording Pipeline

Now that the API is ready, integrate it with the home page:
- Send each 5s chunk to `/api/transcribe`
- Display partial transcripts in real-time
- On stop, send final chunk and show saved transcript

---

## Files Created/Modified

### Created:
- `app/api/transcribe/route.ts` - Main transcription endpoint

### Modified:
- `lib/api-client.ts` - Added `transcribeAudio()` method

---

## Status: ✅ Step 4 Complete

The ASR Slice API endpoint is fully functional and ready for integration!

