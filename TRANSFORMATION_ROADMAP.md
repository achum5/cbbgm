# College Basketball Transformation - Implementation Roadmap

## Overview
Transform the professional basketball simulation into a college basketball game by modifying configuration, phases, player acquisition, and league structure. The core architecture can remain mostly intact.

---

## PHASE 1: FOUNDATION & CONFIGURATION (Week 1-2)

### 1.1 Update Core Constants
**Files:** `src/common/constants.basketball.ts`, `src/common/defaultGameAttributes.ts`

**Changes:**
- Reduce `numGames` from 82 to 30-38 (typical college season)
- Update `draftAges` from [19, 22] to [18, 22] (HS to college age range)
- Add career length limit (4 years max, vs 15+ in pro)
- Update `foulsNeededToFoulOut` from 6 to 5 (college rules)
- Update `foulsUntilBonus` from [5, 4, 2] to college values
- Change `quarterLength` to match NCAA (20 minutes per half, not 12-minute quarters)

**Configuration to Remove:**
- Remove salary cap mechanics (`salaryCap`, `minPayroll`, `luxuryPayroll`, `luxuryTax`)
- Remove free agency configuration
- Remove luxury tax references

### 1.2 Update Player Salary/Contract to Scholarships
**Files:** `src/common/types.ts`, `src/common/defaultGameAttributes.ts`

**Changes:**
- Replace `contract: {amount, exp}` with `scholarship: boolean` (has scholarship or not)
- Add `scholarshipYear: number` (1-4, freshman to senior)
- Remove `minContract`, `maxContract`, `minContractLength`, `maxContractLength`
- Add `scholarships: number` to team config (e.g., 15 per team)
- Replace `salaryCapType` with `scholarshipSystem: "strict"` (must enforce limits)

### 1.3 Define NCAA Teams
**Files:** `src/common/teamInfos.ts`

**Changes:**
- Replace 30 NBA teams with 350+ NCAA teams
- Structure: organize by conference (ACC, Big Ten, Pac-12, Big 12, SEC, AAC, etc.)
- Keep existing team name/color structure
- Add `conference: string` field to team definition
- Example format:
  ```
  DUKE: { region: "Durham", name: "Blue Devils", conference: "ACC", ... }
  ```

### 1.4 Create Conference Structure
**Files:** `src/common/defaultGameAttributes.ts`

**Changes:**
- Update `DEFAULT_CONFS` to NCAA conferences:
  - ACC (14 teams)
  - Big Ten (16 teams)
  - Big 12 (12 teams)
  - SEC (16 teams)
  - Pac-12 (12 teams)
  - American (12 teams)
  - Mountain West (12 teams)
  - etc.
- Update `DEFAULT_DIVS` to conference-based groupings
- Configure `numGamesConf` based on conference size

---

## PHASE 2: SEASON STRUCTURE & PHASES (Week 2-3)

### 2.1 Redesign Phase System
**Files:** `src/worker/core/phase/`

**Current College Phases:**
- Phase -1: FANTASY_DRAFT (keep for custom leagues)
- Phase 0: PRESEASON (exhibition, optional)
- Phase 1: REGULAR_SEASON (30-38 games)
- Phase 2: CONFERENCE_TOURNAMENT (new)
- Phase 3: NCAA_TOURNAMENT (March Madness equivalent)
- Phase 4: RECRUITING (new) - replaces draft lottery
- Phase 5: DRAFT (Entry draft - only 1 round, 60 picks)
- Phase 6: RECRUITING_PERIOD (new) - replace free agency

**Remove Phases:**
- AFTER_TRADE_DEADLINE (not applicable)
- PLAYOFFS (replaced with tournament)
- RESIGN_PLAYERS (no contracts to resign)
- FREE_AGENCY (replaced with recruiting)

### 2.2 Update Phase Transition Logic
**Files:** `src/worker/core/phase/newPhase.ts`

**Changes:**
- Create `newPhaseConferenceTournament.ts`
- Create `newPhaseNCAATournament.ts`
- Create `newPhaseRecruiting.ts` (replaces free agency)
- Remove `newPhaseFreeAgency.ts` logic (or modify heavily)
- Remove trade deadline phase transition

### 2.3 Update Season Schedule Generation
**Files:** `src/worker/core/season/newSchedule.ts`

**Changes:**
- Reduce games from 82 to 30-38
- Create conference schedule (each team plays every conference opponent multiple times)
- Add non-conference games
- Generate conference tournament schedule (12-16 teams per conference)
- Generate NCAA tournament bracket (single elimination)

---

## PHASE 3: PLAYER ACQUISITION SYSTEM (Week 3-4)

### 3.1 Create Recruiting System
**Files:** New: `src/worker/core/recruiting/`

**New Files Needed:**
- `recruiting/index.ts` - Main module
- `recruiting/generateRecruits.ts` - Create HS player pool each year
- `recruiting/recruitPlayer.ts` - Team recruits a player
- `recruiting/transferPortal.ts` - Handle mid-career transfers (optional)
- `recruiting/commitmentTracking.ts` - Track recruiting commitments

**Logic:**
- Generate high school prospects annually (2000+ per year)
- Teams visit prospects and make offers
- Prospects commit to teams (like draft picks, but competitive)
- All recruits are freshmen starting at age 18
- Players leave after 4 years (or early entry to NBA)

### 3.2 Modify Draft System
**Files:** `src/worker/core/draft/`

**Changes:**
- Reduce to 1 round only (60 picks)
- Only available players are uncommitted HS prospects
- No lottery - reverse order based on previous season record
- Remove draft lottery system
- Simplify draft to basic pick selection

### 3.3 Remove Free Agency System
**Files:** `src/worker/core/freeAgents/`

**Changes:**
- Remove free agency phase entirely
- Replace with limited recruiting period
- No contract negotiations
- No "best available" free agents

### 3.4 Update Player Generation
**Files:** `src/worker/core/league/create/createRandomPlayers.ts`

**Changes:**
- Generate players with age 18-22 only
- All new players start at age 18 (freshmen)
- Career length max 4 years
- Much steeper rating progression during college years
- Players retire at 22 if not drafted to NBA

---

## PHASE 4: FINANCIAL SYSTEM OVERHAUL (Week 4)

### 4.1 Remove Salary Cap Logic
**Files:** `src/worker/core/finances/`

**Changes:**
- Remove `assessPayrollMinLuxury.ts`
- Remove `getLuxuryTaxAmount.ts`
- Remove `getMinPayrollAmount.ts`
- Remove salary calculations from team finances
- Remove contract salary updates

### 4.2 Create Scholarship Budget System
**Files:** New: `src/worker/core/scholarships/`

**New Files:**
- `scholarships/index.ts`
- `scholarships/scholarshipAllocation.ts` - Manage available scholarships
- `scholarships/validateScholarships.ts` - Ensure team doesn't exceed limits

**Logic:**
- Each team has fixed number of scholarships (e.g., 15)
- Recruiting fills scholarships
- No financial tracking beyond scholarship count
- No payroll, no luxury tax, no minimum payroll

---

## PHASE 5: AWARDS & RECOGNITION SYSTEM (Week 4-5)

### 5.1 Update Awards Structure
**Files:** `src/worker/core/season/doAwards.basketball.ts`

**Changes:**
- Keep: MVP, All-Conference Team (1st, 2nd, 3rd teams)
- Remove: Finals MVP (no championship MVP format)
- Add: Conference Player of the Year
- Add: All-NCAA Team (top players across all teams)
- Add: NCAA Tournament MVP (champions only)
- Modify All-Freshman Team to only include freshmen
- Keep: Defensive Player of Year, Most Improved Player

### 5.2 Add Conference-Specific Awards
**Files:** New files in `src/worker/core/season/`

**Changes:**
- Create `doConferenceAwards.ts`
- Award All-Conference teams per conference
- Award Conference Coach of the Year
- Award Conference Tournament MVP
- Award NCAA Tournament MVP

---

## PHASE 6: PLAYOFF/TOURNAMENT SYSTEM (Week 5-6)

### 6.1 Create Conference Tournament Logic
**Files:** New: `src/worker/core/tournament/`

**New Files:**
- `tournament/index.ts`
- `tournament/generateConferenceTournament.ts`
- `tournament/runConferenceTournament.ts`

**Logic:**
- Each conference holds tournament (usually 12-16 teams)
- Single elimination format
- Top seeds get byes based on regular season record
- Winner gets automatic NCAA tournament bid

### 6.2 Create NCAA Tournament Logic
**Files:** `src/worker/core/tournament/ncaaTournament.ts` (new)

**Logic:**
- 68 teams selected (32 conference champs + 36 at-large)
- Single elimination bracket
- 6 rounds (play-in, first four, round of 64, 32, sweet 16, elite 8, final four, championship)
- Conference tournaments determine automatic qualifiers

### 6.3 Remove Playoff Series Logic
**Files:** Modify or remove `src/worker/core/season/genPlayoffSeries.ts`

**Changes:**
- Replace with tournament bracket generation
- No best-of-7 series
- All tournament games are single games (except finals)

---

## PHASE 7: PLAYER DEVELOPMENT & RATINGS (Week 6-7)

### 7.1 Modify Player Rating Progression
**Files:** `src/worker/core/player/develop.ts`

**Changes:**
- College players improve much faster (especially years 1-2)
- Steeper progression curves during college years
- Players that don't get recruited development slowly
- After 4 years, players either go to NBA or become free agents
- Add "NBA draft interest" rating (determines if early entry happens)

### 7.2 Update Position System (Optional)
**Files:** `src/common/constants.basketball.ts`

**Possible Change:**
- Keep 9 positions or simplify to:
  - PG (Point Guard)
  - SG (Shooting Guard)  
  - SF (Small Forward)
  - PF (Power Forward)
  - C (Center)

---

## PHASE 8: UI UPDATES (Week 7-8)

### 8.1 Update Views for College Format
**Files:** `src/ui/views/` - Multiple files

**Changes:**
- Update rosters view (scholarship count instead of salaries)
- Create recruiting hub view
- Update schedule view (conference tournament)
- Update tournament bracket view
- Remove free agency view
- Update draft view (simpler, 1 round)
- Update awards view (conference-specific)
- Update team finances (scholarships, not salaries)

### 8.2 Update Navigation/Menus
**Files:** `src/ui/components/`, route configs

**Changes:**
- Add recruiting navigation
- Remove free agency navigation
- Add tournament bracket view
- Add conference page
- Simplify draft view

---

## PHASE 9: TESTING & BALANCE (Week 8-9)

### 9.1 Unit Tests
- Test scholarship allocation
- Test conference tournament generation
- Test NCAA tournament bracket generation
- Test recruiting mechanics
- Test player development curves

### 9.2 Integration Tests
- Run full season simulation
- Verify all phases transition correctly
- Check team rosters after recruiting
- Verify scholarship limits enforced
- Test tournament simulation

### 9.3 Balance Testing
- Verify competitive balance across conferences
- Test recruiting difficulty (should recruits choose teams)
- Test player development progression
- Verify no financial errors/exploits

---

## PHASE 10: COLLEGE ROSTER DATA (Week 9-10)

### 10.1 Create College Team Data
**Files:** `src/common/teamInfos.ts`, new data files

**Changes:**
- Populate full 350+ NCAA teams
- Organize by conference
- Assign colors/jerseys appropriate to actual colleges
- Create real roster data for starting season (optional)

### 10.2 Real Rosters (Optional)
**Files:** `src/worker/core/realRosters/` (modify for college)

**Changes:**
- Create college roster data file
- Load actual college teams/players for historical seasons
- Integrate with real rosters system

---

## OPTIONAL ENHANCEMENTS (Post-MVP)

### Optional 1: Transfer Portal
- Allow players to transfer schools mid-career
- Create free agency-lite system (limited transfers)
- Add transfer restrictions

### Optional 2: Coach Management
- Add coaching system
- Coach ratings affect recruiting/development
- Coach salaries (kept simple)

### Optional 3: Conference Realignment
- Allow conference changes
- Create dynamic conference system
- Historical conference changes

### Optional 4: NIL/Recruiting Rankings
- Add recruiting ranking system
- Track recruiting class rankings
- Add recruiting class budget

---

## IMPLEMENTATION TIPS

### 1. Database Migration
- College system will need schema updates
- Scholarship system replaces salary contracts
- Tournament structure replaces playoff series
- Plan database migration for existing saves

### 2. Backwards Compatibility
- Consider whether old leagues should auto-convert
- Or disable for college mode vs pro mode
- Use `bySport()` pattern for conditional logic if supporting both

### 3. Testing Approach
- Create test league with 10 teams (reduced scope)
- Run through multiple season simulations
- Verify no runtime errors
- Check for data consistency

### 4. UI Considerations
- College rosters are different (all ages 18-22)
- No contract/salary information to display
- Scholarship count replaces cap information
- Tournament bracket is new major feature

### 5. Performance Notes
- 350+ teams vs 30 pros - may impact performance
- Consider pagination in team lists
- Recruiting system adds complexity
- Monitor IndexedDB performance

---

## FILE COUNT ESTIMATES

### Files to Create (New): ~25-30
- Recruiting system (6-8)
- Tournament/March Madness (4-6)
- Scholarships (3-4)
- Awards/Conference (3-4)
- UI Views/Components (5-8)

### Files to Significantly Modify: ~30-40
- defaultGameAttributes.ts
- All phase files
- Draft files
- Team/League creation
- UI views
- Constants files

### Files to Delete/Disable: ~15-20
- Free agency system
- Salary cap system
- Contract negotiation
- Luxury tax system
- Trade system (optional)
- Some financial views

### Files to Keep Mostly Intact: ~50+
- Game simulation
- Database layer
- UI framework
- Player development (with modifications)
- Statistics system
- Views framework

---

## TIMELINE ESTIMATE

- **Weeks 1-2:** Configuration & foundation (constants, types)
- **Weeks 2-3:** Phase system overhaul
- **Weeks 3-4:** Recruiting system implementation
- **Week 4:** Financial system changes
- **Week 5:** Awards system updates
- **Weeks 5-6:** Tournament system
- **Weeks 6-7:** Player development modifications
- **Weeks 7-8:** UI updates
- **Weeks 8-9:** Testing & balance
- **Weeks 9-10:** Roster data (optional)

**Total: 10 weeks for full implementation** (can be done in parallel with multiple developers)

---

## CONCLUSION

The transformation is feasible because:
1. Core architecture is flexible and multi-sport capable
2. Main changes are configuration + new recruiting system
3. Game simulation, stats, database layers remain largely intact
4. Phase system is adaptable to tournament format
5. No major architectural refactoring needed

Key challenges:
1. Recruiting system is new (no existing pattern)
2. 350+ teams vs 30 requires UI optimization
3. Tournament bracket generation complexity
4. Player age restrictions (4-year max careers)
5. Scholarship allocation constraints
