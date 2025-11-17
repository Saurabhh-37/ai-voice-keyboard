# AI Voice Keyboard

A premium, Apple-grade voice-to-text application built with Next.js, Firebase, and modern web technologies. Transform your voice into clean, well-formatted text with real-time transcription.

## Features

- 🎤 **Real-time Voice Transcription** - Convert speech to text instantly
- 📚 **Personal Dictionary** - Custom word corrections for accurate transcriptions
- 📖 **Transcript Library** - Access all your transcriptions
- 🔐 **Secure Authentication** - Firebase email/password authentication
- 🎨 **Premium UI** - Calm, minimal, Apple-inspired design
- 📱 **Responsive Design** - Works seamlessly on all devices

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI
- **Authentication**: Firebase Auth
- **Database**: PostgreSQL (via Prisma - planned)
- **Icons**: Lucide React
- **Deployment**: Vercel/Railway (planned)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Saurabhh-37/ai-voice-keyboard.git
cd ai-voice-keyboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Email/Password authentication
   - Copy your Firebase config (see `FIREBASE_SETUP.md` for details)

4. Create `.env.local` file:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
ai-voice-keyboard/
├── app/
│   ├── (auth)/          # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── (main)/          # Protected main app pages
│   │   ├── home/        # Dictation interface
│   │   ├── library/     # Transcript library
│   │   ├── dictionary/  # Custom dictionary
│   │   ├── settings/    # User settings
│   │   ├── profile/     # User profile
│   │   └── transcript/  # Individual transcripts
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── dictation/      # Voice recording components
│   ├── dictionary/     # Dictionary management
│   ├── landing/        # Landing page sections
│   ├── profile/        # Profile components
│   ├── settings/       # Settings components
│   ├── transcripts/    # Transcript components
│   └── ui/             # ShadCN UI components
├── contexts/           # React contexts (Auth)
├── lib/                # Utilities and Firebase config
└── middleware.ts       # Next.js middleware
```

## Design Philosophy

The app follows a **"Calm. Confident. Effortless. Precise."** design philosophy:

- **Minimal Color Palette** - Whites, grays, and a single accent color
- **Generous Spacing** - Premium, airy layouts
- **Soft Shadows** - Ultra-subtle depth
- **Smooth Animations** - Gentle micro-interactions
- **Typography First** - Inter font with careful weight hierarchy
- **Consistent Radius** - 12px rounded corners throughout

## Documentation

All documentation is organized in the [`docs/`](./docs/) directory:

- **[Setup Guides](docs/setup/)** - Firebase, database, and configuration setup
- **[Implementation Guides](docs/implementation/)** - Technical implementation details
- **[Deployment Guides](docs/deployment/)** - Railway deployment and deployment checklist
- **[Troubleshooting](docs/troubleshooting/)** - Common issues and solutions
- **[Verification](docs/verification/)** - Requirements and status verification
- **[Cleanup](docs/cleanup/)** - Code cleanup documentation

See [docs/README.md](./docs/README.md) for a complete index of all documentation.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Roadmap

- [ ] Real-time audio recording and transcription
- [ ] OpenAI Whisper API integration
- [ ] PostgreSQL database setup with Prisma
- [ ] Incremental audio slicing for long recordings
- [ ] User profile management
- [ ] Transcript export functionality
- [ ] Advanced dictionary features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

## Author

Built with ❤️ by Saurabh
