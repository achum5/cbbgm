# Basketball Codebase Exploration Summary

## Executive Summary

This is a **multi-sport, browser-based sports management simulation** built with TypeScript, React, and IndexedDB. The codebase is designed to support multiple sports (Basketball, Football, Baseball, Hockey) with shared architecture and sport-specific configurations.

**Key Finding:** The architecture is flexible and modular enough to support a college basketball transformation with minimal core refactoring. Most changes would be configuration-based and feature-layer modifications.

---

## What This Codebase Does

### Core Gameplay Loop
1. **Create League** - Initialize with teams, players, conferences
2. **Manage Team** - Draft players, sign free agents, set rosters
3. **Play Season** - Regular season games (82 games), schedule management
4. **Trade/Negotiate** - Trade players, negotiate contracts, manage finances
5. **Playoffs** - Best-of-7 series tournament (4 rounds)
6. **Off-Season** - Draft lottery, entry draft, free agency period
7. **Track Stats** - Detailed player/team statistics, awards, hall of fame

### Multi-Sport Support
- **Basketball:** NBA-style (82 games, 4 quarters, 6 fouls, 2 rounds draft)
- **Football:** NFL-style (17 games, 4 quarters, 7 draft rounds)
- **Baseball:** MLB-style (162 games, 9 innings, 5 draft rounds)
- **Hockey:** NHL-style (82 games, 3 periods, 4 draft rounds)

---

## Architecture Overview

### Client-Side Architecture
```
Browser (UI Process)
  |
  +-- React Components (/src/ui/)
  |   +-- Views (Dashboard, Roster, Draft, etc.)
  |   +-- Components (NavBar, GameLinks, etc.)
  |   +-- Hooks/Utilities
  |
  +-- Shared Worker (Game Engine)
      |
      +-- Core Game Logic (/src/worker/core/)
      |   +-- Phase System (Season progression)
      |   +-- Draft System (Player selection)
      |   +-- Free Agency (Player signings)
      |   +-- Game Simulation (Match engine)
      |   +-- Finance System (Salary cap)
      |   +-- Team Management
      |   +-- Season/Awards
      |   +-- Playoffs
      |
      +-- Database Layer (/src/worker/db/)
          +-- IndexedDB (Persistent storage)
          +-- Cache (In-memory performance)
```

### Data Flow
1. **UI sends actions** → Worker (via toWorker)
2. **Worker processes** → Modifies database cache
3. **Worker updates UI** → Sends via toUI
4. **IndexedDB persisted** → For offline access

---

## Core Systems Breakdown

### 1. PHASE SYSTEM (Season Flow)
Controls progression through different parts of season:

```
Draft Lottery → Draft → After Draft → 
Re-sign Players → Free Agency → Preseason → 
Regular Season → Trade Deadline → Playoffs
```

**Files:** `src/worker/core/phase/newPhase.ts`, phase transition handlers

### 2. DRAFT SYSTEM
Entry draft for new players:

**Files:** `src/worker/core/draft/`
- Generate draft order (lottery system with weighted odds)
- Generate player pool (genPlayers.ts creates talent)
- Run draft (teams select players in order)
- Apply contracts (rookie scale salaries)

**Configuration:**
- Lottery odds by draft position
- Number of rounds
- Rookie salary amounts
- Contract lengths

### 3. FREE AGENCY SYSTEM
Player signings in off-season:

**Files:** `src/worker/core/freeAgents/`
- Auto-sign available players to fill rosters
- Manage contract demands
- Track available free agents

**Trigger:** Phase 8 (FREE_AGENCY)

### 4. FINANCIAL SYSTEM
Team budgets and salary cap:

**Files:** `src/worker/core/finances/`
- Salary cap enforcement (soft/hard/none)
- Minimum payroll penalties
- Luxury tax calculations
- Team cash/payroll tracking

**Scope:** Basketball has soft salary cap of $150M

### 5. GAME SIMULATION
Match engine that determines results:

**Files:** `src/worker/core/GameSim.basketball/`
- Simulates plays (shots, fouls, turnovers, rebounds)
- Applies player ratings to probabilities
- Tracks individual player stats
- Generates box scores

**Configuration:** Pace, accuracy factors, foul rates, etc.

### 6. SEASON/AWARDS
End-of-season awards and recognition:

**Files:** `src/worker/core/season/`
- MVP, Rookie of Year, Defensive Player
- All-League teams
- All-Rookie teams
- Finals MVP

### 7. PLAYOFF SYSTEM
Post-season tournament:

**Files:** `src/worker/core/season/`
- Seed teams 1-8 per conference
- Best-of-7 series (first to 4 wins)
- 4 rounds total

### 8. LEAGUE MANAGEMENT
Team data and league setup:

**Files:** `src/worker/core/league/`
- Create new leagues
- Load existing leagues
- Initialize teams and players
- Conference/division structure

---

## Team & Player Data

### Teams
**Location:** `src/common/teamInfos.ts`

**Current:** 50+ NBA teams with data:
- Region (e.g., "Los Angeles")
- Name (e.g., "Lowriders")
- Population factor
- Colors (RGB hex codes)
- Jersey style

**Database Storage:**
```typescript
Team {
  tid: number;              // Team ID (0-49)
  abbrev: string;           // Abbreviation
  region: string;           // Location
  name: string;             // Team name
  cid: number;              // Conference ID
  did: number;              // Division ID
  colors: [string, string, string];  // RGB colors
}
```

### Players
**Location:** `src/common/types.ts` and `src/common/types.basketball.ts`

**Player Attributes:**
```typescript
Player {
  pid: number;              // Player ID
  name: string;
  tid: number;              // Team ID (-1 = free agent)
  born: { year: number, loc: string };
  college: string;          // College attended
  ratings: {
    hgt, stre, spd, jmp, endu,
    ins, dnk, ft, fg, tp, oiq, diq, drb, pss, reb
  };
  contract: {
    amount: number;         // Thousands of dollars
    exp: number;            // Expiration year
    rookie?: boolean;
  };
  stats: PlayerStats[];     // Season stats
}
```

**Ratings:** 15 attributes drive performance (height, strength, speed, jumping, endurance, shooting accuracy, IQ, etc.)

---

## Key Configuration Files

### 1. Constants
**File:** `src/common/constants.basketball.ts`

**Defines:**
- Positions: PG, G, SG, GF, SF, F, PF, FC, C
- Awards: MVP, ROY, SMOY, DPOY, MIP, Finals MVP
- Player ratings and composite weights
- Statistics tables

### 2. Default Game Attributes
**File:** `src/common/defaultGameAttributes.ts`

**Controls:**
```typescript
numGames: 82                          // Games per season
numPeriods: 4                         // Quarters
quarterLength: 12                     // Minutes
numGamesPlayoffSeries: [7, 7, 7, 7]  // Best-of-7
salaryCap: 150000                     // Thousands
minPayroll: 95000
luxuryPayroll: 168000
luxuryTax: 1.5
foulsNeededToFoulOut: 6
draftType: "nba2019"                  // Lottery
draftAges: [19, 22]
numDraftRounds: 2
rookieContractLengths: [3, 2]
```

### 3. Team Information
**File:** `src/common/teamInfos.ts`

- 50+ teams with colors, regions, names
- Multi-sport jersey references
- Population factors for random generation

---

## Database Schema (IndexedDB)

### Main Tables
- **teams** - Team definitions
- **teamSeasons** - Season records, payroll, cash
- **players** - Player master data
- **playerStats** - Season/game statistics
- **games** - Game results and box scores
- **draftPicks** - Draft selections and future picks
- **awards** - Season awards
- **gameAttributes** - League settings with history
- **playoffs** - Playoff bracket data

### Key Pattern
- Historical tracking: Many tables store arrays with `{start, value}` for tracking changes over time
- Relationships via IDs: Foreign keys stored as numbers (tid, pid, cid, did)

---

## Important Design Patterns

### 1. Game Attributes with History
Many settings are stored with version history:
```typescript
gameAttribute: [
  { start: -Infinity, value: initialValue },
  { start: season5, value: newValue },
  ...
]
```

This allows rule changes mid-league while preserving history.

### 2. Sport-Specific Configuration
`bySport()` helper applies different values per sport:
```typescript
const numGames = bySport({
  basketball: 82,
  football: 17,
  baseball: 162,
  hockey: 82
});
```

### 3. Two-Layer Architecture
- **UI Process** - Displays data, handles user input
- **Shared Worker** - Runs simulations, manages state
- **Communication** - toUI/toWorker functions for messaging

### 4. Cache Pattern
IndexedDB is slow, so in-memory cache holds frequently accessed data. Mutations must manually write back:
```typescript
const player = await idb.cache.players.get(pid);
player.stats[0].pts = 25;  // Mutate
await idb.cache.players.put(player);  // Write back
```

---

## What Would Change for College Basketball

### Deletions/Removals
1. Free agency system (no FA in college)
2. Salary cap enforcement (no salaries)
3. Trade system (trades are rare in college)
4. Contract negotiations
5. Luxury tax system
6. Playoff best-of-7 series format

### Additions
1. **Recruiting System** - Replace free agency with recruiting from high school
2. **Scholarship Management** - Cap system based on scholarships
3. **Tournament Bracket** - NCAA tournament and conference tournaments
4. **Transfer Portal** - Mid-career player movement (optional)
5. **Coach System** - Coach management (optional)

### Modifications
1. **Phase System** - Add conference tournament and NCAA tournament phases
2. **Draft System** - Only 1 round, 60 picks (not 2+ rounds)
3. **Game Rules** - Adjust fouls, shot clock, 3-point line
4. **Player Ages** - Limit to 18-22 (not 19-40)
5. **Teams** - 350+ NCAA teams (not 30 NBA teams)
6. **Season Length** - 30-38 games (not 82)
7. **Conferences** - Power 5 + mid-majors (not East/West)

---

## Codebase Statistics

### Directory Structure
```
src/
├── common/          # Shared constants, types, utilities
│   ├── constants.basketball.ts
│   ├── defaultGameAttributes.ts
│   ├── teamInfos.ts
│   ├── types.ts
│   └── ... (80+ files)
├── worker/          # Game engine (Shared Worker)
│   ├── core/        # Core systems
│   │   ├── draft/
│   │   ├── freeAgents/
│   │   ├── finances/
│   │   ├── phase/
│   │   ├── season/
│   │   ├── league/
│   │   ├── team/
│   │   ├── player/
│   │   ├── game/
│   │   └── GameSim.basketball/
│   ├── db/          # IndexedDB access
│   └── util/        # Helper functions
└── ui/              # React UI
    ├── views/       # Page components
    ├── components/  # UI components
    └── util/        # Client-side utilities
```

### File Count
- **Total:** 500+ TypeScript files
- **Tests:** 50+ test files
- **Common:** ~80 files
- **Worker:** ~200 files
- **UI:** ~150+ files

---

## Development Approach

### Testing
- Unit tests via Vitest
- Integration tests for game mechanics
- E2E test: Creates league, simulates season
- Run: `npm run test`

### Build System
- TypeScript compilation
- ESLint for code standards
- Watch mode for development
- Output to browser bundles

### Local Development
```bash
node --run dev              # Start dev server (port 3000)
SPORT=football node --run dev  # Build for football
npm run test               # Run tests
npm run lint               # Check code
```

---

## Strengths of This Codebase

1. **Multi-Sport Framework** - Already supports 4 sports with shared architecture
2. **Flexible Configuration** - Game attributes can be customized per league
3. **Scalable Storage** - IndexedDB handles 1000+ players, 82-game seasons
4. **Modular Systems** - Each system (draft, FA, finances) is self-contained
5. **Historical Tracking** - Game attributes preserve change history
6. **Browser-Based** - No server needed, fully offline-capable
7. **Separation of Concerns** - UI and game logic cleanly separated
8. **Type Safety** - TypeScript prevents many bugs
9. **Real Data** - Includes real NBA rosters and historical data
10. **Extensible** - Easy to add new views, systems, configurations

---

## Potential Challenges

1. **Complex State Management** - Many interdependent game systems
2. **Performance at Scale** - 350+ teams requires optimization
3. **UI Complexity** - Need new views for recruiting, tournament bracket
4. **Breaking Changes** - Removing free agency/contracts affects many systems
5. **Data Migration** - Existing league saves won't work with college format
6. **Recruiting Logic** - No existing pattern to follow
7. **Tournament Bracket** - Single-elimination format is new

---

## Conclusion

This is a **well-architected, feature-complete sports simulation** that provides an excellent foundation for a college basketball game. The main work is not architectural refactoring, but rather:

1. Creating a recruiting system to replace free agency
2. Adding tournament mechanics for March Madness
3. Adjusting configurations (scholarships, season length, teams)
4. Updating UI to reflect college-specific needs

**Estimated Effort:** 8-12 weeks for full college basketball transformation (vs building from scratch: 6+ months)

**Key Success Factors:**
- Use existing phase system architecture
- Keep game simulation engine unchanged
- Leverage database/cache layers
- Build recruiting system as new module
- Test phase transitions thoroughly
- Optimize for 350+ team list rendering

**Recommendation:** Proceed with college basketball transformation. The foundation is solid, and the changes are mostly additive rather than disruptive.

---

## Files Provided

1. **CODEBASE_OVERVIEW_COLLEGE_BASKETBALL.md** - Detailed system breakdown (15 KB)
2. **TRANSFORMATION_ROADMAP.md** - Week-by-week implementation plan (12 KB)
3. **EXPLORATION_SUMMARY.md** - This file, executive summary (10 KB)

All files saved in `/home/runner/workspace/` for reference.
