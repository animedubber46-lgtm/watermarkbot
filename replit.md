# Nexus Dashboard - Video Watermark Telegram Bot

## Overview

This is a Telegram bot application that adds watermarks to videos, paired with a cyberpunk-themed web dashboard for monitoring bot activity. Users interact with the bot via Telegram to upload videos and configure watermarks (text or image), while administrators can view stats, users, and job history through the React dashboard.

The system uses a hybrid database approach: MongoDB for bot-related data (users, jobs) and PostgreSQL with Drizzle ORM for schema definitions and type inference.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state with automatic refetching for real-time feel
- **Styling**: Tailwind CSS with custom cyberpunk/neon theme using CSS variables
- **UI Components**: shadcn/ui component library (New York style) built on Radix UI primitives
- **Animations**: Framer Motion for smooth transitions
- **Build Tool**: Vite with custom Replit plugins for development

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript with ES modules
- **Bot Framework**: GramJS (Telegram MTProto client) for the Telegram bot functionality
- **API Pattern**: Simple REST endpoints defined in `shared/routes.ts` with Zod validation

### Data Storage
- **Primary Storage**: MongoDB via Mongoose for bot users and job tracking
- **Schema Definition**: Drizzle ORM with PostgreSQL dialect for type-safe schema definitions
- **Connection Strategy**: MongoDB is the actual data store; PostgreSQL/Drizzle provides type inference and frontend compatibility

The choice to use MongoDB reflects the bot's document-oriented data needs (flexible job settings, user metadata), while Drizzle schemas ensure type safety across the full stack.

### Bot Functionality
- Receives video files from Telegram users
- Supports text and image watermarks
- Configurable watermark position, size, and opacity
- Uses FFmpeg for video processing
- Tracks jobs with status updates (pending, processing, completed, failed)

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components including shadcn/ui
    hooks/        # React Query hooks for data fetching
    pages/        # Page components (Dashboard, 404)
    lib/          # Utilities and query client
server/           # Express backend
  bot.ts          # Telegram bot logic
  mongo.ts        # MongoDB connection and models
  storage.ts      # Storage abstraction layer
  routes.ts       # API route registration
shared/           # Shared between frontend and backend
  schema.ts       # Drizzle schema definitions
  routes.ts       # API route definitions with Zod
```

## External Dependencies

### Database Services
- **MongoDB**: Primary data storage (requires `MONGODB_URI` environment variable)
- **PostgreSQL**: Schema definitions via Drizzle (requires `DATABASE_URL` environment variable)

### Telegram API
- **Telegram Bot API**: Requires `BOT_TOKEN`, `API_ID`, `API_HASH` environment variables
- **Optional**: `LOG_CHANNEL`, `OWNER_ID`, `STRING_SESSION` for advanced bot features

### Video Processing
- **FFmpeg**: Required for watermark operations (system dependency, not npm package)

### Key NPM Dependencies
- `telegram` (GramJS) - Telegram MTProto client
- `mongoose` - MongoDB ODM
- `drizzle-orm` + `drizzle-kit` - Type-safe ORM
- `@tanstack/react-query` - Server state management
- `framer-motion` - Animations
- `recharts` - Dashboard charts (listed in requirements)
- `lucide-react` - Icon library