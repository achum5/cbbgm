# Basketball Codebase Architecture Overview - Professional to College Basketball Transformation

## 1. MAIN GAME SYSTEMS AND FEATURES

### Core Systems Identified
1. **Season/Phase System** - Controls game flow through distinct phases
2. **Draft System** - Lottery and player selection
3. **Free Agency System** - Player negotiations and signings
4. **Contract Management** - Player salary contracts
5. **Financial System** - Salary cap, luxury tax, minimum payroll
6. **Team Management** - Rosters, transactions, trades
7. **Game Simulation** - Match outcomes and statistics
8. **Awards System** - MVP, ROY, All-League, etc.
9. **Playoff System** - Series structure and seeding
10. **Real Rosters** - Historical/current team data

---

## 2. SEASON/PHASE STRUCTURE (src/common/constants.ts)

**Current Pro Basketball Phases:**
- **Phase -2:** EXPANSION_DRAFT (team expansion/relocation)
- **Phase -1:** FANTASY_DRAFT (custom league setup draft)
- **Phase 0:** PRESEASON (exhibition games)
- **Phase 1:** REGULAR_SEASON (82 games default)
- **Phase 2:** AFTER_TRADE_DEADLINE (post-deadline period)
- **Phase 3:** PLAYOFFS (best-of-7 series × 4 rounds)
- **Phase 4:** DRAFT_LOTTERY (lottery drawing)
- **Phase 5:** DRAFT (entry draft)
- **Phase 6:** AFTER_DRAFT (post-draft signings)
- **Phase 7:** RESIGN_PLAYERS (re-sign expiring contracts)
- **Phase 8:** FREE_AGENCY (open free agency)

**Configuration (src/common/defaultGameAttributes.ts):**
- `numGames: 82` (per season)
- `numPeriods: 4` (quarters)
- `quarterLength: 12` (minutes)
- `overtimeLength: 5` (minutes)
- `numGamesPlayoffSeries: [7, 7, 7, 7]` (best-of-7)
- `numPlayoffByes: 0`
- `foulsNeededToFoulOut: 6`
- `foulsUntilBonus: [5, 4, 2]`

---

## 3. TEAM DATA STRUCTURE

### Team Information Location
**File:** `/home/runner/workspace/src/common/teamInfos.ts`

**Team Definition:**
```typescript
{
  region: string;           // "Los Angeles", "Boston", etc.
  name: string;             // "Lowriders", "Massacre"
  pop: number;              // Population factor (0.001 to 37.3)
  colors: [string, string, string];  // Team colors (RGB hex)
  jersey: string;           // Jersey style reference
}
```

**Examples:**
- BOS: Boston Massacre
- LAL: Los Angeles Lowriders  
- MIA: Miami Cyclones
- CHI: Chicago Whirlwinds
- (50+ total teams defined, expandable)

### Team Data in Database
- Teams stored in IndexedDB with: tid, cid (conference), did (division), abbrev, etc.
- Team seasons tracked separately with win/loss records, payroll, cash
- Conference/Division structure fully configurable

---

## 4. PLAYER DATA STRUCTURE

**Player Attributes (src/common/types.basketball.ts):**
- Basic: pid, name, tid (team id), born
- **College:** college name (for recruiting history)
- Contract: amount (in thousands), exp (expiration year)
- Ratings: hgt, stre, spd, jmp, endu, ins, dnk, ft, fg, tp, oiq, diq, drb, pss, reb
- Skills: Dynamically calculated from ratings

**Player Draft Positions:**
- Defined by age: draftAges: [19, 22] (NBA default)
- 2 rounds × number of teams = draft picks per year

---

## 5. DRAFT SYSTEM (src/worker/core/draft/)

### Files:
- `genOrder.ts` - Generate draft order (lottery)
- `genPicks.ts` - Generate draft picks for all teams
- `genPlayers.ts` - Generate player talent pool
- `runPicks.ts` - Execute draft selections
- `getRookieSalaries.ts` - Apply rookie scale salaries
- `getRookieContractLength.ts` - Rookie contract terms

### Draft Configuration (defaultGameAttributes):
```typescript
draftType: "nba2019"          // Lottery format
draftLotteryCustomChances: [  // Odds by worst record
  140, 140, 140, 125, 105, 90, 75, 60, 45, 30, 20, 15, 10, 5
]
draftLotteryCustomNumPicks: 4 // Number of lottery picks
numDraftRounds: 2              // Number of rounds
draftAges: [19, 22]            // Age range of players
rookieContractLengths: [3, 2]  // Contract length options
draftPickAutoContract: true    // Auto-sign picks
draftPickAutoContractPercent: 25
draftPickAutoContractRounds: 1
```

### Draft Types Supported:
- "nba2019" - NBA lottery system
- "nhl2021" - NHL lottery system
- "mlb2022" - MLB reverse order
- "noLottery" - Reverse order of finish
- "random" - Random order
- "freeAgents" - No draft, all free agents

---

## 6. FREE AGENCY SYSTEM (src/worker/core/freeAgents/)

### Files:
- `autoSign.ts` - Auto-sign qualifying free agents
- `decreaseDemands.ts` - Lower contract demands over time
- `ensureEnoughPlayers.ts` - Fill rosters with FA signings
- `getBest.ts` - Find best available free agents
- `normalizeContractDemands.ts` - AI contract demands

### Phases:
1. **RE-SIGN PLAYERS** (Phase 7): Teams re-sign own expiring contracts
2. **FREE AGENCY** (Phase 8): Open market signing period

### Configuration:
```typescript
playersRefuseToNegotiate: true
minContract: 1200            // Thousands of dollars
maxContract: 50000
minContractLength: 1
maxContractLength: 5
```

---

## 7. FINANCIAL SYSTEM (src/worker/core/finances/)

### Payroll/Salary Cap:
```typescript
salaryCap: 150000            // Hard cap ceiling (thousands)
minPayroll: 95000            // Minimum team payroll
luxuryPayroll: 168000        // Luxury tax threshold
luxuryTax: 1.5               // Tax multiplier on excess payroll
salaryCapType: "soft"        // "soft", "hard", or "none"
```

### Team Finance Tracking:
- `teamSeasons` table: win/loss, cash, expenses
- Expenses tracked: salary, minTax, luxuryTax, etc.
- Payroll assessment happens at end of season

### Salary Cap Logic:
- Soft cap: Can exceed, but pay luxury tax
- Hard cap: Cannot exceed total payroll
- None: No salary restrictions (baseball)

---

## 8. AWARDS SYSTEM (src/worker/core/season/doAwards.basketball.ts)

### Awards Structure:
```typescript
{
  season: number;
  bestRecord: Team;
  bestRecordConfs: Team[];
  mvp: Player;               // Most Valuable Player
  roy: Player;               // Rookie of the Year
  smoy: Player;              // Sixth Man of the Year
  dpoy: Player;              // Defensive Player of the Year
  mip: Player;               // Most Improved Player
  finalsMvp: Player;         // Finals MVP
  sfmvp: Player[];           // Semifinals MVP (if applicable)
  allLeague: [FirstTeam, SecondTeam, ThirdTeam];
  allDefensive: [FirstTeam, SecondTeam, ThirdTeam];
  allRookie: Player[];
}
```

### Award Positions:
- All-League: 5 players per team (15 total)
- All-Defensive: 5 players per team (15 total)
- All-Rookie: Variable count

---

## 9. LEAGUE STRUCTURE

### Conferences and Divisions:
**Default Pro Basketball:**
```typescript
const DEFAULT_CONFS = [
  { cid: 0, name: "Eastern Conference" },
  { cid: 1, name: "Western Conference" }
];

const DEFAULT_DIVS = [
  { did: 0, cid: 0, name: "Atlantic" },
  { did: 1, cid: 0, name: "Central" },
  { did: 2, cid: 0, name: "Southeast" },
  { did: 3, cid: 1, name: "Southwest" },
  { did: 4, cid: 1, name: "Northwest" },
  { did: 5, cid: 1, name: "Pacific" }
];
```

**Games Calculation:**
```typescript
numGames: 82               // Total games per season
numGamesDiv: 16            // Against division opponents
numGamesConf: 36           // Against conference opponents
numGameDays: ?             // (numGames - div - conf remaining)
```

---

## 10. PLAYOFF SYSTEM

### Configuration:
```typescript
playoffsNumTeamsDiv: wrap(0)  // Teams per division in playoffs (0 = none)
playoffsReseed: false         // Reseed in later rounds
playIn: true                  // Play-in tournament
numPlayoffByes: 0             // Teams with first-round byes
numGamesPlayoffSeries: [7, 7, 7, 7]  // Games per round (4 rounds)
```

### Playoff Structures:
- **By Conference (default):** Top 8 teams per conference
- **Play-In:** 7th-10th seeds compete for 7th/8th spots
- **Reseed option:** Highest remaining seed vs lowest remaining seed
- **Byes:** Top seeds can skip early rounds

---

## 11. PLAYER GENERATION & RATINGS

### Player Ratings (15 attributes):
- hgt (height) - affects rebounding, defense, shot blocking
- stre (strength) - affects rebounding, defense
- spd (speed) - affects offense, defense, stealing
- jmp (jumping) - affects rebounding, shot blocking
- endu (endurance) - fatigue/condition
- ins (inside scoring) - low post offense
- dnk (dunking) - dunking ability
- ft (free throw) - FT shooting
- fg (field goal) - overall shooting
- tp (three pointer) - 3PT shooting
- oiq (offensive IQ) - decision-making, turnovers
- diq (defensive IQ) - defense, steals
- drb (dribbling) - ball handling
- pss (passing) - assist ability
- reb (rebounding) - rebounding

### Composite Skills (calculated):
- Pace, Usage, Dribbling, Passing, Turnovers
- Shooting (at rim, low post, mid-range, 3PT, FT)
- Rebounding, Stealing, Blocking, Fouling
- Defense (interior, perimeter), Endurance, Athleticism

### Player Positions:
`["PG", "G", "SG", "GF", "SF", "F", "PF", "FC", "C"]`

---

## 12. STATISTICS TRACKING

### Player Game Stats:
- Min, FG, FGA, FGP, TP, TPA, TPP, FT, FTA, FTP
- ORB, DRB, TRB, AST, TOV, STL, BLK, BA, PF, PTS, PM, GMSC

### Team Stats:
- FG, FGA, FGP, TP, TPA, TPP, FT, FTA, FTP
- ORB, DRB, TRB, AST, TOV, STL, BLK, PF, PTS, MOV
- Opponent versions of above
- Advanced: ORTG, DRTG, NRTG, PACE, TS%, EFG%, TOV%, ORB%, FTpFGA

---

## 13. GAME SIMULATION (src/worker/core/GameSim.basketball/)

### Game Configuration:
```typescript
threePointers: true
threePointTendencyFactor: 1
threePointAccuracyFactor: 1
twoPointAccuracyFactor: 1
ftAccuracyFactor: 1
blockFactor: 1
stealFactor: 1
turnoverFactor: 1
orbFactor: 1
assistFactor: 1
pace: 100                  // Possessions per game speed
foulRateFactor: 1
numPlayersOnCourt: 5       // Players per team on court
```

### Game Events:
- Fouls, personal/technical
- Injury probabilities
- Shot attempts with percentages
- Turnover rates
- Rebound opportunities
- Plus/minus tracking

---

## 14. REAL ROSTERS & DATA

### Location:
- `/home/runner/workspace/data/real-player-data.basketball.json`
- `/home/runner/workspace/data/real-player-stats.basketball.json`

### Features:
- Historical NBA rosters by season
- Player stats and achievements
- Real draft positions
- Career trajectories

### Legends Mode:
```typescript
const legendsInfo = {
  "1950s": { start: 1950, end: 1959 },
  "1960s": { start: 1960, end: 1969 },
  "1970s": { start: 1970, end: 1979 },
  // ... through "2020s"
  all: { start: -Infinity, end: MAX_SEASON }
}
```

---

## MAJOR DIFFERENCES: PRO VS COLLEGE BASKETBALL

### What NEEDS to Change:

1. **Salary/Contract System**
   - College: NO salaries, NO contracts, NO salary cap
   - Recruit instead of free agency/draft
   - Scholarship system (limited number per team)

2. **Draft System**
   - College: Entry draft is ONLY way to add players
   - Pro: Draft picks expire, free agency fills rosters
   - Remove free agency phase entirely

3. **League Structure**
   - College: Multiple distinct conferences (power 5, mid-majors)
   - May need many more teams (350+ vs 30)
   - Relegation/promotion possible

4. **Season Structure**
   - College: Shorter season (30-40 games vs 82)
   - Conference schedule very different
   - Tournament structure (March Madness)
   - More flexible playoffs (Conference/National tournaments)

5. **Player Ages**
   - College: 18-22 year old range (freshmen, sophomores, juniors, seniors)
   - Pro: 19+ year range with 10+ year careers
   - Different retirement ages (22 max vs 35+)

6. **Awards & Recognition**
   - College: Different award structures
   - Add conference-specific awards
   - Add NCAA tournament awards
   - Remove Finals MVP if no champion playoff format

7. **Recruiting System**
   - College: Recruit prospects from high school
   - Player development through college years
   - Transfer portal considerations
   - No free agency

8. **Player Rating Progression**
   - College: Much steeper progression during college years
   - Less variation between top/bottom players
   - New model for pre-college development

9. **Game Simulation**
   - Different game rules/regulations
   - Shot clock differences (35s vs 24s)
   - Foul limits and bonus rules different
   - No 3-second rule violations in some eras

10. **Team Management**
    - Team name/colors stay same (historical consistency)
    - No relocation logic
    - Conference realignment mechanics

---

## KEY FILES TO MODIFY

### High Priority:
1. `/src/common/defaultGameAttributes.ts` - Season length, phases, salaries
2. `/src/common/constants.basketball.ts` - Positions, awards, ratings
3. `/src/worker/core/phase/` - Phase logic (remove free agency, add recruiting)
4. `/src/worker/core/draft/` - Entry draft system modifications
5. `/src/worker/core/freeAgents/` - Replace with recruiting system
6. `/src/worker/core/finances/` - Remove salary cap logic
7. `/src/common/teamInfos.ts` - Update team list for college teams
8. `/src/worker/core/season/` - Tournament instead of playoffs

### Medium Priority:
1. `/src/worker/core/player/` - Player development curves
2. `/src/worker/core/league/create/` - League initialization
3. `/src/worker/core/GameSim.basketball/` - Game rules
4. `/src/worker/core/realRosters/` - College rosters
5. `/src/ui/views/` - UI for recruiting, etc.

### Lower Priority:
1. Team stats views
2. Player comparison tools
3. Historical data structures

---

## ARCHITECTURE NOTES

### Code Organization:
- **UI Layer:** `/src/ui/` - React components, uses hooks
- **Worker Layer:** `/src/worker/` - Core game logic, simulations
- **Common:** `/src/common/` - Shared types, constants, utilities
- **Database:** IndexedDB via cache in `/src/worker/db/`

### Key Patterns:
- Sport-specific variants using `bySport()` helper
- Game attributes with historical tracking
- Two-player architecture: UI process + Shared Worker
- All data stored in IndexedDB with in-memory cache

---

## SUMMARY

This is a **comprehensive, multi-sport simulation framework** that already handles:
- Multiple sports (Basketball, Football, Baseball, Hockey)
- Complex league structures with divisions/conferences
- Draft, free agency, contracts, finances
- Game simulation and statistics
- Awards and hall of fame
- Real roster data and historical leagues

**For college basketball transformation:**
- Keep the overall architecture intact
- Replace salary/contract with recruiting/scholarships
- Reduce season length
- Change playoff format to tournament-style
- Add conference realignment mechanics
- Modify player age/career progression
- Update team roster (NCAA teams instead of NBA)

The foundation is solid; the changes are primarily configuration and feature layer modifications rather than core architectural rewrites.
