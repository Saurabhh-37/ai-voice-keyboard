# AI Voice Keyboard - Complete Implementation Plan

## 📋 Overview
This document outlines the complete plan to build an AI voice keyboard application that transcribes speech to text using incremental audio slicing for real-time processing.

---

## 🎯 Phase 1: Project Setup & Dependencies

### 1.1 Install Core Dependencies
- **ShadCN UI**: Set up component library
  - Install shadcn/ui CLI
  - Configure components (Button, Input, Card, Sidebar, etc.)
- **Database**: PostgreSQL client (Prisma ORM recommended)
  - `@prisma/client` and `prisma`
- **Authentication**: NextAuth.js v5 (Auth.js)
  - `next-auth` or `@auth/prisma-adapter`
- **Audio Processing**: 
  - `@ffmpeg/ffmpeg` or native Web Audio API
  - Audio recording utilities
- **AI/LLM Integration**:
  - OpenAI SDK for Whisper API (`openai`)
  - Or alternative: Google Speech-to-Text, AssemblyAI
- **Utilities**:
  - `bcryptjs` for password hashing
  - `zod` for validation
  - `date-fns` for date formatting

### 1.2 Project Structure
```
app/
├── (auth)/
│   ├── login/
│   └── signup/
├── (dashboard)/
│   ├── dictation/
│   ├── dictionary/
│   ├── settings/
│   └── layout.tsx (with sidebar)
├── api/
│   ├── auth/
│   ├── transcriptions/
│   ├── dictionary/
│   └── audio/
├── components/
│   ├── ui/ (shadcn components)
│   ├── Sidebar.tsx
│   ├── TranscriptionCard.tsx
│   └── AudioRecorder.tsx
├── lib/
│   ├── db.ts (Prisma client)
│   ├── auth.ts
│   ├── audio-slicer.ts
│   └── whisper.ts
└── types/
    └── index.ts
```

### 1.3 Theme Configuration Setup
- **Tailwind Config**: Configure custom colors, spacing, typography, shadows, radius
  - Set up Inter font family
  - Define color palette (background, surface, borders, text, accent)
  - Configure spacing scale (4-64px)
  - Set border radius (12px)
  - Define shadow utilities
  - Configure animation timing and easing
- **Global CSS**: Set up base styles
  - Typography defaults (Inter font, line heights)
  - Base color variables
  - Reset and normalize styles
  - Animation utilities
- **ShadCN Theme**: Customize ShadCN components to match design theme
  - Override default colors
  - Adjust component styles (buttons, cards, inputs)
  - Ensure consistent spacing and radius

---

## 🗄️ Phase 2: Database Schema & Setup

### 2.1 Prisma Schema Design
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String    // hashed
  name          String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  transcriptions Transcription[]
  dictionaryWords DictionaryWord[]
}

model Transcription {
  id          String   @id @default(cuid())
  text        String   @db.Text
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  
  @@index([userId, createdAt])
}

model DictionaryWord {
  id          String   @id @default(cuid())
  word        String
  spelling    String   // custom spelling
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([userId, word])
  @@index([userId])
}
```

### 2.2 Database Setup
- Create Prisma schema file
- Set up Railway PostgreSQL database
- Configure connection string in `.env`
- Run migrations
- Seed initial data if needed

---

## 🔐 Phase 3: Authentication System

### 3.1 NextAuth.js Configuration
- Configure NextAuth.js with credentials provider
- Set up Prisma adapter
- Create login/signup API routes
- Implement password hashing with bcryptjs
- Session management

### 3.2 Auth Pages
- **Sign Up Page** (`/signup`):
  - Email, password, name fields
  - Form validation with Zod
  - Error handling
  - Redirect to dashboard on success
  
- **Login Page** (`/login`):
  - Email and password fields
  - Form validation
  - Error handling
  - Redirect to dashboard on success

### 3.3 Auth Middleware
- Protect dashboard routes
- Redirect unauthenticated users to login
- Session validation

---

## 🎤 Phase 4: Core Transcription Feature

### 4.1 Audio Recording Component
- **AudioRecorder Component**:
  - Start/Stop recording button
  - Visual feedback (recording indicator, waveform)
  - Microphone permission handling
  - Use MediaRecorder API or Web Audio API
  - Real-time audio level visualization

### 4.2 Audio Slicing Implementation
- **Audio Slicer Service** (`lib/audio-slicer.ts`):
  - Slice audio into 5-second chunks with buffer
  - Maintain buffer for smooth transitions
  - Convert audio to format compatible with Whisper API (MP3/WAV)
  - Handle audio format conversion (if needed)

### 4.3 Whisper API Integration
- **Whisper Service** (`lib/whisper.ts`):
  - API route handler for transcription
  - Process audio slices incrementally
  - Merge transcription results intelligently
  - Include dictionary words in prompt
  - Error handling and retry logic
  - Rate limiting considerations

### 4.4 Transcription API Route
- **POST `/api/transcriptions/process`**:
  - Accept audio blob/chunks
  - Process through audio slicer
  - Call Whisper API with custom prompt
  - Merge results from previous slices
  - Return incremental transcription
  - Store final transcription in database

### 4.5 Transcription Display
- **Transcription List Component**:
  - Display all transcriptions (latest first)
  - Show timestamp, preview text
  - Hover effect for copy functionality
  - One-click copy to clipboard
  - Smooth animations/transitions
  - Loading states during processing

---

## 📚 Phase 5: Dictionary Feature

### 5.1 Dictionary API Routes
- **GET `/api/dictionary`**: List all user's dictionary words
- **POST `/api/dictionary`**: Create new dictionary word
- **PUT `/api/dictionary/[id]`**: Update dictionary word
- **DELETE `/api/dictionary/[id]`**: Delete dictionary word

### 5.2 Dictionary Page UI
- **Dictionary Page** (`/dictionary`):
  - Table/list of dictionary words
  - Add new word form (word + custom spelling)
  - Edit existing words
  - Delete with confirmation
  - Search/filter functionality
  - Empty state

### 5.3 Dictionary Integration
- Include dictionary words in Whisper API prompt
- Format: "Please use these spellings: word1 -> spelling1, word2 -> spelling2"
- Update prompt dynamically based on user's dictionary

---

## 🎨 Phase 6: UI/UX Implementation

### 6.1 Design Philosophy & Theme
**Core DNA: Calm. Confident. Effortless. Precise.**

The interface must disappear and let the experience shine. Apple-grade feel with:
- Intentional whitespace
- Impeccable alignment
- Soft but deliberate micro-interactions
- Extremely consistent rhythm and spacing
- Typography as the centerpiece
- Minimal color usage
- Visual silence
- Weightless, frictionless interactions

**Design Style Blend:**
1. **Apple's "Calm Precision"**: Light background, minimal color, soft shadows, rounded corners, airy spacing
2. **Linear's "Refined Minimalism"**: Clean grayscale, sharp typography, crisp micro-interactions
3. **Modern Productivity Tools**: Flat, friendly, geometric, soft neutrals, high-contrast typography

**Theme Implementation:**
- **Colors**: Background (#F9FAFB), Surface (#FFFFFF), Border (#E5E7EB), Text Primary (#111827), Text Secondary (#6B7280)
- **Accent**: Single accent color (#3B82F6 blue) - used only for primary actions, record button, focus indicators, active navigation
- **Typography**: Inter font (weights: 300, 400, 500, 600), spacious line heights (1.4-1.5)
- **Spacing**: Consistent scale (4, 8, 12, 16, 20, 24, 32, 40, 48, 64px)
- **Radius**: 12px everywhere (consistent harmony)
- **Shadows**: Ultra-soft (0px 4px 14px rgba(0,0,0,0.05))
- **Animations**: 120-180ms, cubic-bezier(0.22, 0.61, 0.36, 1), subtle transforms (scale 0.98 on press)

**Design Principles:**
1. Simplicity over cleverness
2. Clarity before personality
3. Reduce visual noise (no heavy borders, loud colors, clutter)
4. Make primary action obvious (record button is king)
5. Every pixel matters (perfect alignment, spacing, typography)
6. Calm interfaces feel premium (avoid urgency, aggressive motion)
7. One accent color everywhere
8. Trust white space

### 6.2 Sidebar Navigation
- **Sidebar Component**:
  - Minimal logo/branding
  - Clean navigation links:
    - Dictation (home)
    - Dictionary
    - Settings
    - Logout
  - User profile section (subtle)
  - Responsive design (mobile drawer)
  - Active route highlighting (accent color)
  - Smooth, gentle transitions
  - Generous spacing, no visual clutter

### 6.3 Dashboard Layout
- **Dashboard Layout** (`app/(dashboard)/layout.tsx`):
  - Sidebar + main content area
  - Responsive grid layout
  - Consistent spacing using theme scale
  - Typography hierarchy from theme
  - Intentional whitespace throughout
  - Clean, minimal aesthetic

### 6.4 Dictation Page
- **Main Dictation Interface**:
  - Large, prominent record button (accent color, soft pulse animation)
  - Visual feedback during recording (subtle, calm)
  - Real-time transcription preview (as slices complete)
  - Final transcription display (typography as centerpiece)
  - Copy button (one-click, hover effect)
  - History section below (clean cards, generous spacing)
  - Center major CTA with plenty of breathing space

### 6.5 Design System Components
- Use ShadCN components as base, customize to match theme
- Custom color scheme (theme colors)
- Typography hierarchy (display, h1, h2, body, caption)
- Spacing system (consistent scale)
- Button styles (primary uses accent, secondary is minimal)
- Card components (soft shadow, 12px radius, white surface)
- Form inputs (clean, minimal borders, focus uses accent)
- Loading states (subtle, calm animations)
- Error states (gentle, helpful)
- Empty states (spacious, clear messaging)

---

## ⚙️ Phase 7: Settings Page

### 7.1 Settings Features
- User profile information display
- Edit name
- Account settings
- Audio settings (if applicable)
- Theme preferences (optional)

### 7.2 Settings API
- **PUT `/api/settings`**: Update user settings
- Validation and error handling

---

## 🚀 Phase 8: Performance & Optimization

### 8.1 Audio Processing Optimization
- Efficient audio slicing algorithm
- Minimize buffer overhead
- Optimize audio format conversion
- Stream processing where possible

### 8.2 API Optimization
- Batch dictionary word lookups
- Efficient database queries (indexes)
- Caching where appropriate
- Error handling and retries

### 8.3 Frontend Optimization
- Code splitting
- Lazy loading components
- Optimistic UI updates
- Debouncing where needed
- Efficient re-renders

---

## 🧪 Phase 9: Testing & Quality Assurance

### 9.1 Functionality Testing
- Authentication flows
- Recording and transcription
- Dictionary CRUD operations
- Copy to clipboard
- Error scenarios

### 9.2 UI/UX Testing
- Responsive design (mobile, tablet, desktop)
- Cross-browser compatibility
- Accessibility (keyboard navigation, screen readers)
- Visual polish and animations
- Loading states

### 9.3 Performance Testing
- Test with 1-minute+ dictation sessions
- Measure latency
- Test with multiple dictionary words
- Database query performance

---

## 🚢 Phase 10: Deployment

### 10.1 Railway Setup
- Create Railway account
- Set up PostgreSQL database on Railway
- Configure environment variables:
  - `DATABASE_URL`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`
  - `OPENAI_API_KEY` (or alternative)
- Deploy Next.js app to Railway
- Configure build settings

### 10.2 Environment Configuration
- Production environment variables
- Development vs production configs
- Security best practices

### 10.3 Post-Deployment
- Test all features in production
- Monitor for errors
- Performance monitoring
- User acceptance testing

---

## 📝 Phase 11: Documentation & Demo

### 11.1 Code Documentation
- README with setup instructions
- API documentation
- Component documentation
- Environment variable documentation

### 11.2 Demo Video
- Record screen capture
- Demonstrate all features:
  - Sign up / Login
  - Start dictation
  - Show real-time transcription
  - Dictionary management
  - Copy functionality
  - Settings
- Highlight key features and UX

### 11.3 GitHub Repository
- Clean commit history
- Meaningful commit messages
- README with:
  - Project description
  - Setup instructions
  - Tech stack
  - Features
  - Deployment instructions
  - Demo video link

---

## 🎯 Implementation Priority Order

1. **Phase 1-2**: Setup & Database (Foundation)
2. **Phase 3**: Authentication (Required for all features)
3. **Phase 4**: Core Transcription (Main feature)
4. **Phase 6**: Basic UI/UX (Sidebar, Layout)
5. **Phase 5**: Dictionary Feature
6. **Phase 7**: Settings
7. **Phase 8**: Performance Optimization
8. **Phase 9**: Testing & QA
9. **Phase 10**: Deployment
10. **Phase 11**: Documentation & Demo

---

## 🔑 Key Technical Decisions

### Audio Processing
- **Approach**: Use MediaRecorder API for recording, slice into 5-second chunks with 1-2 second buffer
- **Format**: Convert to MP3 or WAV for Whisper API
- **Streaming**: Process slices incrementally, merge results

### AI Integration
- **Primary**: OpenAI Whisper API (best quality)
- **Alternative**: AssemblyAI or Google Speech-to-Text
- **Prompt Engineering**: Include dictionary words and context in system prompt

### State Management
- React Server Components where possible
- Client components for interactive features
- React hooks for local state
- Server actions for mutations

### Error Handling
- Comprehensive error boundaries
- User-friendly error messages
- Retry logic for API calls
- Graceful degradation

---

## ⚠️ Potential Challenges & Solutions

### Challenge 1: Audio Slicing Accuracy
- **Solution**: Use proper buffer overlap, handle edge cases in word boundaries

### Challenge 2: Real-time Transcription Latency
- **Solution**: Optimize slice size, parallel processing where possible, efficient merging

### Challenge 3: Dictionary Integration
- **Solution**: Format dictionary as prompt context, test with various word combinations

### Challenge 4: Cross-browser Audio Compatibility
- **Solution**: Feature detection, fallbacks, clear error messages

### Challenge 5: Railway Deployment Issues
- **Solution**: Test locally first, use Railway CLI, check logs, environment variables

---

## 📊 Success Criteria

✅ All required features implemented and working
✅ Beautiful, modern, minimalistic UI
✅ Smooth user experience with intuitive navigation
✅ Fast transcription (< 5 seconds after stopping for 1-minute session)
✅ Clean, maintainable codebase
✅ Successfully deployed on Railway
✅ Demo video showcasing all features
✅ Public GitHub repository with documentation

---

## 🎨 Design Theme Specifications

### Global Theme Implementation

**Typography:**
- Family: Inter (weights: 300, 400, 500, 600)
- Display: 42-56px (light weight)
- Headers: 24-32px (medium/semibold)
- Body: 16-18px (regular weight)
- Caption: 13-14px (regular weight)
- Line-height: 1.4-1.5 (spacious)

**Color Palette:**
- Background: `#F9FAFB` (subtle warm off-white)
- Surface/Card: `#FFFFFF` (high-purity white)
- Border: `#E5E7EB` (whisper-light gray)
- Text Primary: `#111827` (near-black with softness)
- Text Secondary: `#6B7280` (lower-contrast gray)
- Accent Primary: `#3B82F6` (deep blue) - used sparingly
- Accent Muted: Accent at 20% opacity
- Danger: `#EF4444`
- Success: `#10B981`

**Spacing Scale:**
- Consistent rhythm: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px
- Never cram content - prefer too much whitespace
- Center major CTAs with plenty of breathing space

**Border Radius:**
- 12px everywhere (buttons, cards, panels, inputs)
- Single consistent radius creates harmony

**Shadows:**
- Ultra-soft: `0px 4px 14px rgba(0, 0, 0, 0.05)`
- Never use heavy shadows
- Depth should feel like Apple's soft layering

**Animations:**
- Timing: 120-180ms
- Easing: `cubic-bezier(0.22, 0.61, 0.36, 1)`
- Button press: scale to 0.98
- Hover: fade in, not pop in
- Record button: soft pulse
- Modals: fade + slight slide

**Components:**
- ShadCN UI as base, heavily customized to match theme
- Icons: Lucide React (neutral gray)
- All interactions: smooth, subtle, gentle
- Visual silence - nothing screams or blinks

---

## 📅 Estimated Timeline

- **Phase 1-2**: 20 minutes (Setup)
- **Phase 3**: 30 minutes (Auth)
- **Phase 4**: 45 minutes (Core transcription - most complex)
- **Phase 5**: 20 minutes (Dictionary)
- **Phase 6**: 30 minutes (UI/UX)
- **Phase 7**: 15 minutes (Settings)
- **Phase 8**: 20 minutes (Optimization)
- **Phase 9**: 20 minutes (Testing)
- **Phase 10**: 15 minutes (Deployment)
- **Phase 11**: 15 minutes (Documentation)

**Total**: ~3.5 hours (with buffer for debugging and polish)

---

This plan provides a comprehensive roadmap for building the AI voice keyboard application. Each phase builds upon the previous one, ensuring a solid foundation and incremental progress toward a complete, production-ready application.

