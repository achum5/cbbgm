# Basketball Codebase - Quick Reference Guide

## Essential Files to Know

### Configuration & Constants
```
src/common/
├── constants.basketball.ts       [Positions, awards, ratings, stats tables]
├── constants.ts                  [PHASE, PHASE_TEXT, DIFFICULTY, etc.]
├── defaultGameAttributes.ts      [Default league settings - KEY FILE]
├── teamInfos.ts                  [Team names, colors, regions]
└── types.ts / types.basketball.ts [Data structures]
```

### Core Game Systems
```
src/worker/core/
├── draft/                        [Draft lottery & player selection]
├── freeAgents/                   [Free agency (REMOVE for college)]
├── finances/                     [Salary cap (REMOVE for college)]
├── phase/                        [Season phase transitions]
├── season/                       [Playoffs, awards, schedule]
├── GameSim.basketball/           [Game simulation engine]
├── team/                         [Team management]
├── player/                       [Player development]
└── league/                       [League creation/management]
```

### Database
```
src/worker/db/
├── Cache.ts                      [In-memory cache layer]
└── index.ts                      [IndexedDB access patterns]
```

### UI
```
src/ui/
├── views/                        [Main pages: Roster, Draft, etc.]
├── components/                   [Reusable UI components]
└── api/                          [Worker communication]
```

---

## College Basketball Key Changes

### 1. Configuration Changes (Easiest)
**File:** `src/common/defaultGameAttributes.ts`

CHANGE FROM:
```typescript
numGames: 82
numPeriods: 4
quarterLength: 12
salaryCap: 150000
minPayroll: 95000
luxuryPayroll: 168000
draftAges: [19, 22]
numDraftRounds: 2
```

CHANGE TO:
```typescript
numGames: 34                      // Typical college season
numPeriods: 2                     // Halves instead of quarters
quarterLength: 20                 // 20-min halves = 40 min game
salaryCap: null                   // No salary cap
minPayroll: null                  // No minimum payroll
luxuryPayroll: null               // No luxury tax
draftAges: [18, 22]               // High school to college
numDraftRounds: 1                 // Single round (60 picks)
scholarships: 15                  // Add: scholarships per team
maxCareerLength: 4                // Add: max years in college
```

### 2. Phase System Changes (Complex)
**File:** `src/worker/core/phase/`

REMOVE:
- Phase 2: AFTER_TRADE_DEADLINE
- Phase 7: RESIGN_PLAYERS
- Phase 8: FREE_AGENCY

ADD:
- Phase 2: CONFERENCE_TOURNAMENT
- Phase 3: NCAA_TOURNAMENT
- Phase 4: RECRUITING (replaces draft lottery)
- Phase 8: RECRUITING_PERIOD (replaces free agency)

### 3. Team Data Changes (Moderate)
**File:** `src/common/teamInfos.ts`

REMOVE: 30 NBA teams
ADD: 350+ NCAA teams organized by conference

Example:
```typescript
DUKE: {
  region: "Durham",
  name: "Blue Devils",
  conference: "ACC",
  pop: 0.5,
  colors: ["#003366", "#ffffff", "#000000"],
  jersey: "college1"
}
```

### 4. New Systems to Create (Hard)

#### Recruiting System
**Location:** `src/worker/core/recruiting/` (NEW)

Files to create:
- `generateRecruits.ts` - Create HS prospect pool
- `recruitPlayer.ts` - Teams bid for recruits
- `commitmentTracking.ts` - Track who commits where

#### Tournament System
**Location:** `src/worker/core/tournament/` (NEW)

Files to create:
- `conferenceTournament.ts` - Conference tournament bracket
- `ncaaTournament.ts` - March Madness bracket
- `generateBracket.ts` - Single-elimination logic

#### Scholarship System
**Location:** `src/worker/core/scholarships/` (NEW)

Files to create:
- `validateScholarships.ts` - Enforce limits
- `scholarshipAllocation.ts` - Manage per-team scholarships

### 5. Systems to Remove/Disable

**Free Agency:**
- `src/worker/core/freeAgents/` - ENTIRE DIRECTORY DELETE

**Salary Cap:**
- `src/worker/core/finances/assessPayrollMinLuxury.ts` - DELETE
- `src/worker/core/finances/getLuxuryTaxAmount.ts` - DELETE
- `src/worker/core/finances/getMinPayrollAmount.ts` - DELETE

**Trade System:**
- `src/worker/core/trade/` - DISABLE or DELETE (optional)

---

## Development Workflow

### 1. Start Here
```bash
cd /home/runner/workspace
npm install
node --run dev              # Starts on http://localhost:3000
```

### 2. Make a Change
Edit a file, browser auto-reloads (usually within 5 seconds)

### 3. Run Tests
```bash
npm run test               # Unit tests
npm run test-e2e          # End-to-end (creates league, plays season)
npm run lint              # Code standards
```

### 4. Check Specific Sport
```bash
SPORT=football npm run test  # Tests for football
```

---

## Database Schema Overview

### Key Tables
| Table | Purpose | Key Fields |
|-------|---------|-----------|
| teams | Team definitions | tid, abbrev, region, name, cid, did |
| teamSeasons | Season records | tid, season, wins, losses, payroll |
| players | Player master | pid, name, tid, born, ratings |
| playerStats | Game/season stats | pid, season, gp, min, pts, ast, etc |
| gameAttributes | League settings | Various, with history tracking |
| games | Game results | gid, season, teams, scores, stats |
| draftPicks | Draft selections | Draft info, team, player, round |
| awards | Season awards | MVP, All-League, etc. |

---

## How Game Simulation Works

### The Game Sim Loop
```
1. Get home & away players
2. For each possession:
   - Decide action (shot, pass, TO, etc.) based on player ratings
   - Calculate success % based on ratings + game factors
   - Apply result to stats/score
3. Loop until game ends (40 min, ties broken in OT)
4. Save final box score
```

### Key Files
- `src/worker/core/GameSim.basketball/index.ts` - Main game loop
- `src/worker/core/GameSim.basketball/PlayByPlayLogger.ts` - Event tracking

### Ratings Impact
Higher ratings → higher success probability for actions
- `hgt, stre` = rebounding, defense, blocking
- `spd` = offense, defense, stealing
- `jmp` = jumping ability
- `fg, tp, ft` = shooting accuracy
- `oiq, diq` = decision making
- `drb, pss` = ball handling, passing

---

## Common Development Tasks

### Add a New Game Attribute
1. Add to `src/common/defaultGameAttributes.ts`
2. Add type to `src/common/types.ts`
3. Add to appropriate `gameAttributesKeys*` array
4. Reference via `g.get("myAttribute")`

### Modify a Phase
1. Edit `src/worker/core/phase/newPhase*.ts`
2. Ensure it calls `finalize()` at end
3. Test with: `npm run test-e2e`

### Add a New View
1. Create file in `src/ui/views/`
2. Export view function
3. Add route in `src/ui/util/routeInfos.ts`
4. Add navigation link

### Test Specific Functionality
```bash
npm run test -- draft          # Only draft tests
npm run test -- playoff        # Only playoff tests
npm run test -- player         # Only player tests
```

---

## Key Concepts to Understand

### Game Attributes with History
Settings can change mid-league while preserving history:
```typescript
// Salary cap increased in season 5
gameAttribute.salaryCap = [
  { start: -Infinity, value: 150000 },  // Seasons 1-4
  { start: 5, value: 160000 }           // Season 5+
]
```

### Phase System
Controls what happens each week of the game:
- Some phases are auto (schedule games, run playoffs)
- Some require user action (make draft picks, set lineups)
- Phases transition automatically or via user action

### Ratings vs Ovr
- **Ratings:** 15 specific attributes (hgt, spd, etc.)
- **Ovr (Overall):** Calculated composite rating (1-100)
- Game sim uses ratings; display often uses ovr

### Salary/Contract System (to REPLACE)
Currently:
```typescript
contract: {
  amount: number;     // Thousands of dollars
  exp: number;        // Expiration year
  rookie?: boolean;
}
```

For college, replace with:
```typescript
scholarship: boolean;  // Has scholarship or not
scholarshipYear: number;  // 1-4 (freshman-senior)
```

---

## Important Code Patterns

### Getting Global Game State
```typescript
import { g } from "../../util/index.ts";

const season = g.get("season");
const phase = g.get("phase");
const teamId = g.get("userTid");
```

### Database Access
```typescript
import { idb } from "../../db/index.ts";

// Get player from cache
const player = await idb.cache.players.get(pid);

// Modify and save back
player.stats[0].pts = 25;
await idb.cache.players.put(player);

// Query multiple records
const teams = await idb.cache.teams.getAll();
```

### Logging Events
```typescript
import { logEvent } from "../../util/index.ts";

logEvent({
  type: "draft",
  text: `${player.name} selected by ${teamName}`,
  tids: [tid],
  showNotification: true,
});
```

---

## Performance Tips

### Avoid N+1 Queries
```typescript
// BAD: Queries player on each loop
for (const pid of playerIds) {
  const player = await idb.cache.players.get(pid);  // SLOW
}

// GOOD: Get all at once
const players = await idb.cache.players.getAll();
const byId = new Map(players.map(p => [p.pid, p]));
```

### Cache Locally
```typescript
// Get once, reuse many times
const season = g.get("season");
for (const player of players) {
  updatePlayerStats(player, season);
}
```

### Use Batch Operations
```typescript
// SLOW: One at a time
for (const player of players) {
  await idb.cache.players.put(player);
}

// FAST: Batch put
await idb.cache.players.putMultiple(players);
```

---

## Debugging

### Browser Developer Tools
- Open Chrome DevTools (F12)
- Network tab: See toWorker/toUI messages
- Console: `self.bbgm` gives access to internals

### Shared Worker Debugging
1. In Chrome, go to `chrome://inspect/#workers`
2. Click "Inspect" under the worker
3. This opens separate DevTools for worker

### Log from Worker
```typescript
console.log("My message"); // Shows in worker DevTools
```

### Log from UI
```typescript
console.log("My message"); // Shows in browser DevTools
```

---

## Quick Stats Reference

### Per-Game Stats Tracked
```
gs (games started), min (minutes), fg (field goals),
fga (FG attempts), fgp (FG%), tp (3-pointers), 
tpa (3P attempts), tpp (3P%), ft (free throws),
fta (FT attempts), ftp (FT%), orb (offensive rebounds),
drb (defensive rebounds), trb (total rebounds), ast (assists),
tov (turnovers), stl (steals), blk (blocks), ba (block attempts),
pf (personal fouls), pts (points), pm (plus/minus), gmsc (game score)
```

### Advanced Stats
```
PER (Player Efficiency Rating), TS% (True Shooting %),
EFG% (Effective FG%), TOV% (Turnover %), ORB% (Offensive Rebound %),
FT Rate, ORtg (Offensive Rating), DRtg (Defensive Rating),
Pace, WS (Win Shares), BPM (Box Plus-Minus), VORP (Value Over Replacement)
```

---

## Additional Resources

**In This Workspace:**
- `CODEBASE_OVERVIEW_COLLEGE_BASKETBALL.md` - Comprehensive system breakdown
- `TRANSFORMATION_ROADMAP.md` - Week-by-week implementation plan
- `EXPLORATION_SUMMARY.md` - Executive summary & architecture

**In Source Code:**
- `/src/README.md` (if exists) - Development documentation
- Comments in code - Inline documentation
- Tests in `*.test.ts` files - Usage examples

**External:**
- https://zengm.com/ - Live game (see features)
- https://github.com/zengm-games/zengm - Source repository

---

## Contact & Questions

For questions about implementation:
1. Check existing tests for usage patterns
2. Search codebase for similar functionality
3. Check type definitions for available methods
4. Review the transformation roadmap for guidance

Good luck with the college basketball transformation!
