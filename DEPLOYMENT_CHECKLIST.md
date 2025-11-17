# Quick Deployment Checklist

Use this checklist when deploying to Railway.

## Pre-Deployment

- [ ] Code pushed to GitHub
- [ ] `.gitignore` includes `.env*` and Firebase Admin SDK files
- [ ] All features tested locally
- [ ] No console errors

## Railway Setup

- [ ] Railway account created
- [ ] Project created from GitHub repo
- [ ] PostgreSQL database added (or existing one connected)
- [ ] Next.js service added

## Environment Variables

- [ ] `DATABASE_URL` (from Railway PostgreSQL)
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `FIREBASE_ADMIN_SDK` (single-line JSON, no line breaks)
- [ ] `OPENAI_API_KEY`

## Build & Deploy

- [ ] Build completes successfully
- [ ] No build errors in logs
- [ ] App starts on Railway domain

## Database

- [ ] Migrations run (`npx prisma migrate deploy`)
- [ ] Database tables created
- [ ] Can connect to database

## Testing

- [ ] Landing page loads
- [ ] Sign up works
- [ ] Login works
- [ ] Home page accessible (protected route)
- [ ] Recording button works
- [ ] Microphone permission requested
- [ ] Transcription works (test with OpenAI)
- [ ] Transcripts save to database
- [ ] Library page shows transcripts
- [ ] Copy to clipboard works (hover on transcript)
- [ ] Dictionary CRUD works
- [ ] Settings page works

## Post-Deployment

- [ ] Public URL works
- [ ] No runtime errors in logs
- [ ] All features functional
- [ ] Ready for demo video

---

## Quick Commands

```bash
# Run migrations
railway run npx prisma migrate deploy

# View logs
railway logs

# Check environment variables
railway variables
```

---

## Common Issues

- **Build fails**: Check environment variables are set
- **"Unauthorized" errors**: Verify `FIREBASE_ADMIN_SDK` format
- **Database errors**: Check `DATABASE_URL` is correct
- **Transcription fails**: Verify `OPENAI_API_KEY` and quota

---

**Ready to deploy?** Follow `RAILWAY_DEPLOYMENT_GUIDE.md` for detailed steps.

