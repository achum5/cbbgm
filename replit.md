# Overview

This is a sports simulation game engine that currently supports basketball, football, baseball, and hockey. The codebase is being transformed from a professional basketball simulation into a college basketball game. The application is a single-player browser-based game implemented entirely in client-side JavaScript/TypeScript, using IndexedDB for data persistence.

The engine features comprehensive game simulation, team management, player development, drafting, financial systems, and league progression through multiple phases (preseason, regular season, playoffs, draft, free agency, etc.). It's built with a multi-sport framework that allows sharing core logic across different sports while maintaining sport-specific customizations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Technology Stack:**
- React with TypeScript for UI components
- Bootstrap for styling with custom dark/light themes
- Service Workers (Workbox) for offline functionality and caching
- IndexedDB via idb wrapper library for client-side data persistence
- Rollup for bundling with code splitting

**Key Design Patterns:**
- Component-based UI with React hooks
- Worker-UI separation for non-blocking computations
- Virtual scrolling for large data tables using @tanstack/react-virtual
- Real-time updates via message passing between worker and UI threads

## Backend Architecture

**Core Engine (Web Worker):**
- All game logic runs in a Web Worker to keep UI responsive
- Implements comprehensive simulation systems for seasons, games, drafts, and player development
- Phase-based game progression system managing 11 distinct phases per season
- Event-driven architecture with message passing between worker and UI

**Data Layer:**
- IndexedDB for persistent storage with custom caching layer
- In-memory cache (Cache.ts) for frequently accessed data
- Schema version 69 with migration support
- Supports import/export of league files in JSON format

**Game Simulation:**
- Sport-specific simulation engines (GameSim.basketball, etc.)
- Statistical tracking for 40+ categories
- Player ratings system with 15+ attributes per sport
- Team chemistry and strategy systems

## Key Architectural Decisions

**Multi-Sport Design:**
- Sport-specific logic isolated in separate files (*.basketball.ts, *.football.ts, etc.)
- Shared core systems with sport-specific overrides via bySport() utility
- Build-time sport selection via environment variables
- Allows code reuse while maintaining sport-specific features

**College Basketball Transformation Strategy:**
- Replace free agency system with recruiting mechanics
- Convert contracts to scholarships (15 per team limit)
- Change from 30 NBA teams to 365+ NCAA teams organized by conferences
- Modify season structure (82 games → 30-38 games, quarters → halves)
- Remove salary cap and luxury tax systems
- Replace draft lottery with eligibility/graduation system
- Implement 4-year player career limits

**Phase System:**
- Manages game state transitions through season lifecycle
- Current phases: Expansion Draft, Fantasy Draft, Preseason, Regular Season, After Trade Deadline, Playoffs, Draft Lottery, Draft, After Draft, Resign Players, Free Agency
- For college: Will modify to remove free agency and draft lottery phases
- Add recruiting phase and player eligibility tracking

**Performance Optimizations:**
- Web Worker offloads heavy computation from UI thread
- Incremental IndexedDB reads/writes to avoid blocking
- Code splitting to reduce initial bundle size
- Service Worker caching for offline play and faster loads

## External Dependencies

**Core Libraries:**
- React 18 for UI framework
- TypeScript for type safety
- idb (@dumbmatter/idb) for IndexedDB wrapper
- Workbox for service worker management

**UI Components:**
- Bootstrap 5 for base styling
- @dnd-kit for drag-and-drop roster management
- @tanstack/react-virtual for virtualized lists
- @visx for data visualization charts
- @uiw/react-color for color pickers

**Development Tools:**
- Vitest for testing with browser and node modes
- Playwright for end-to-end testing
- ESLint with TypeScript support
- Prettier for code formatting
- pnpm for package management

**Data Processing:**
- d3-dsv for CSV parsing
- cheerio for web scraping (tools)
- statsmodels (Python) for analytics

**Build System:**
- Custom build tool using Rollup
- Supports multiple sports via environment variables
- Generates separate bundles for UI and worker
- CSS processing with PostCSS

**APIs and Services:**
- Bugsnag for error tracking
- Account API for user authentication (ACCOUNT_API_URL)
- No external databases - all data stored client-side in IndexedDB

**File Storage:**
- Real player data loaded from JSON files (real-player-data.basketball.json)
- Name generation data from JSON (names.json, names-female.json)
- Team logos and assets served statically

**Notable Absence:**
- No traditional backend server - fully client-side application
- No Postgres or SQL databases (though Drizzle may be added later for optional server features)
- No REST API (uses message passing instead)