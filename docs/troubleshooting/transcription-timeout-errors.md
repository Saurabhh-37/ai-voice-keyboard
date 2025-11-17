# Troubleshooting Transcription Errors for Long Recordings

If you're getting 500 errors when dictation exceeds 5 seconds, this guide will help you fix it.

## Common Causes

### 1. Railway Request Timeout
Railway has default timeouts for API routes. The transcription API route is now configured with `maxDuration = 60` seconds to handle longer audio files.

### 2. Audio File Size Limits
- OpenAI Whisper API has a **25MB file size limit**
- Each 5-second chunk should be well under this limit (~50-200KB typically)
- If chunks are too large, check audio quality settings

### 3. Network/API Timeout
- OpenAI API can take 5-30 seconds for transcription
- The route now has a 60-second timeout with proper error handling

---

## What Was Fixed

### Enhanced Error Handling
1. ✅ **File size validation** - Checks if audio file exceeds 25MB limit
2. ✅ **Timeout handling** - 60-second timeout with proper error messages
3. ✅ **Better error logging** - Logs file size and type for debugging
4. ✅ **Route configuration** - `maxDuration = 60` seconds for Railway

### Code Changes
- Added `maxDuration = 60` export to handle longer requests
- Added file size validation (25MB limit)
- Added 60-second timeout for OpenAI API calls
- Improved error messages for timeout and file size issues

---

## How to Debug

### Step 1: Check Railway Logs

1. Go to Railway → Your service → **Deployments**
2. Click latest deployment → **Logs** tab
3. Look for:
   - `"Transcribing audio:"` - Shows file size
   - `"Error in /api/transcribe:"` - Shows detailed error info

### Step 2: Check File Sizes

The logs will show:
```
Transcribing audio: {
  size: "125.50 KB",
  type: "audio/webm",
  name: "audio.webm"
}
```

**Normal sizes:**
- 5 seconds: ~50-150 KB
- 10 seconds: ~100-300 KB
- 30 seconds: ~300-900 KB

If sizes are much larger, there might be an audio quality issue.

### Step 3: Check Error Messages

Common error messages:

#### "Audio file is too large"
- **Cause**: File exceeds 25MB
- **Fix**: This shouldn't happen with 5-second chunks. Check if chunks are being merged incorrectly.

#### "Transcription request timed out"
- **Cause**: OpenAI API took longer than 60 seconds
- **Fix**: 
  - Check OpenAI API status
  - Try again (might be temporary)
  - Check if audio file is corrupted

#### "OPENAI_API_KEY is not configured"
- **Cause**: Missing environment variable
- **Fix**: Add `OPENAI_API_KEY` to Railway variables

---

## Verification

After deploying the fix:

1. **Test with 5-second recording** - Should work
2. **Test with 10-second recording** - Should work (2 chunks)
3. **Test with 30-second recording** - Should work (6 chunks)

Each chunk should process independently without errors.

---

## If Still Failing

1. **Check Railway logs** for the exact error message
2. **Verify environment variables** are set correctly
3. **Check OpenAI API status** at https://status.openai.com
4. **Test with shorter recordings** to isolate the issue

The enhanced error logging will show exactly what's failing!

