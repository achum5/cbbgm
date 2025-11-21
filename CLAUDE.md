# COLLEGE BASKETBALL COACH - TRANSFORMATION PROJECT

**Last Updated:** 2025-11-18 (All 365 NCAA Teams ALREADY IN GAME!)
**Current Phase:** All Core Systems Complete - Ready for Next Features
**Status:** Phases 1, 2, 3-Foundation, & 4-Player System FULLY COMPLETE ✓ | College Mood System COMPLETE ✓ | Eligibility Progression VERIFIED ✓ | Scheduling VERIFIED ✓ | Conference Cleanup COMPLETE ✓ | Prestige-Based Rosters COMPLETE ✓ | **ALL 365 NCAA Teams COMPLETE ✓ | 31 Conferences COMPLETE ✓**

---

## PROJECT OVERVIEW

**Goal:** Transform this professional basketball simulation into a college basketball game.

**Approach:** Start with the absolute foundation and build up slowly, methodically.

**Scope:** Full transformation to college-only (remove all pro basketball features).

**Team Names:** Use variants of real NCAA teams (NOT exact names - no license). Correct colors. User can customize to real names if they want.

**Timeline:** Work in small, testable increments. No rushing.

---

## IMPORTANT: CLAUDE PERMISSIONS

**CRITICAL:** Claude (the AI assistant) has FULL PERMISSION to take ALL actions on this project WITHOUT asking the user first.

This includes:
- Reading, writing, editing, and deleting ANY files
- Running ANY commands (build, test, commit, etc.)
- Making ANY code changes
- Installing packages
- Modifying configuration files
- Creating/deleting directories
- Running tests and builds
- **Killing processes with kill, pkill, killall** - NEVER ask, just do it
- **Managing ports and servers** - kill and restart servers as needed
- **Running ANY bash commands** - including destructive ones like rm, kill -9, pkill -9, etc.
- **EVERYTHING** - No need to ask permission, EVER!

**Just do the work.** The user trusts Claude to make good decisions and will provide feedback if needed.

**NEVER ASK FOR PERMISSION** - If you find yourself wanting to ask "Do you want to proceed?", DON'T. Just execute the command.

**APPROVAL DIALOGS:** When the system shows approval prompts like:
```
❯ 1. Yes
  2. Tell Claude what to do differently
```
The answer is ALWAYS "Yes". Never wait for user input on these. Just proceed with the command immediately.

**BUILD & DEPLOY WORKFLOW:** After EVERY code change, use the simplified script:

## OPTION 1: One-Command Restart (RECOMMENDED)

```bash
./dev.sh
```

This script does everything safely:
1. Kills all old servers (preview, watch, http-server)
2. Cleans the build directory
3. Builds production files with NODE_ENV=production
4. Starts preview server on port 5000
5. Verifies the version is serving

**Why this prevents port/server issues:**
- Kills EVERYTHING first (no conflicts between dev/production servers)
- Cleans build directory (no stale files causing 404s)
- Always uses production build (reliable and fast)
- Verifies it worked before announcing

## OPTION 2: Manual Steps (If You Need More Control)

```bash
# 1. Kill old server first
pkill -9 -f "preview" 2>/dev/null
pkill -9 -f "http-server" 2>/dev/null
pkill -9 -f "watch" 2>/dev/null

# 2. Clean build directory and rebuild (CRITICAL: NODE_ENV=production required!)
rm -rf build
export NODE_ENV=production && npm run build

# 3. Start preview server (runs on port 5000 - Replit expects this!)
npm run preview -- --host &

# 4. Wait for server to start
sleep 3

# 5. VERIFY the new version is being served (REQUIRED!)
curl -s http://localhost:5000 | grep -o "v2025\.[0-9]*\.[0-9]*\.[0-9]*" | head -1
```

**THEN announce in chat:**
```
## ✅ Server Running - Version 2025.11.18.0929

**Current version:** 2025.11.18.0929

**What changed:**
- [Brief description of changes]

**To see changes:**
Reload the page (Ctrl+R or Cmd+R)
```

**CRITICAL NOTES:**
- ✅ **NODE_ENV=production IS REQUIRED!** - Without it, build creates wrong file links
- ✅ **Clean build directory first** - `rm -rf build` prevents stale files
- ✅ **Kill watch server too** - Replit auto-starts it, must kill it every time
- ✅ **USE PORT 5000 (not 3000!)** - Replit's webview is configured for port 5000
- ✅ **Use `npm run preview -- --host`** - This is the correct command for Replit
- ✅ **ALWAYS announce the version number** - User needs to verify the server is updated
- ✅ **Always kill old server first** - Prevents port conflicts
- ✅ **Build generates new version automatically** - Service worker detects it
- ✅ **Simple reload works** - User just presses Ctrl+R (NOT hard refresh)
- ✅ **Service worker handles cache** - No manual clearing needed
- ✅ **NEVER skip this workflow!** - User needs to see changes immediately

---

## GUIDING PRINCIPLES

1. **Slow and steady** - Make one change at a time, test it
2. **Foundation first** - Get the basics right before adding features
3. **Test everything** - Run the game after each change
4. **No real team names** - Variants only (licensing)
5. **Keep it customizable** - Users can change names themselves
6. **College only** - Remove all pro basketball references

---


## TEAM NAME VARIANTS - GUIDELINES

**DO:**
- Use the city/region name + mascot
- Use correct colors
- Make it obvious which school it represents
- Example: "Durham Blue Devils" (Duke), "Chapel Hill Tar Heels" (UNC)

**DON'T:**
- Use official university names ("Duke University")
- Use exact trademarked names
- Use official logos (user can add their own)

**Examples:**
- Duke → "Durham Blue Devils" or "Blue Devils" (Durham, NC)
- UNC → "Chapel Hill Tar Heels" or "Tar Heels"
- Kansas → "Lawrence Jayhawks" or "Jayhawks"
- Kentucky → "Lexington Wildcats" or "Wildcats"
- UCLA → "Westwood Bruins" or "Bruins"

---

## DAILY WORKFLOW

### When You (User) Start a Session:
1. Say: "Read CLAUDE.md"
2. I (Claude) will read this file and know where we are
3. Tell me what you want to work on today
4. I'll update this file with progress

### When Working:
**REMEMBER:** Claude has FULL PERMISSION to do everything. No need to ask!

1. Make one small change at a time
2. Test after each change
3. Update this file with progress
4. Commit changes to git when a step is complete

### When Finishing a Session:
1. Update "Last Updated" date at top
2. Mark completed steps with [x]
3. Note any blockers or issues
4. Save file

-
## NOTES & REMINDERS

- **Testing is critical** - Run the game after every change
- **Small steps** - Don't try to do too much at once
- **Commit often** - Use git to save progress
- **Document changes** - Update this file regularly
- **Ask questions** - If something's unclear, stop and ask

---

---

## SERVER MANAGEMENT & TESTING - CRITICAL PRACTICES

**Problem:** The dev server (`npm run dev`) hangs indefinitely and conflicts with production builds, causing 404 errors and broken servers.

**Solution:** Use the `./dev.sh` script for ALL restarts - it prevents server conflicts automatically.

### THE ONE TRUE WAY: Use ./dev.sh Script

**ALWAYS use this after making code changes:**

```bash
./dev.sh
```

**What it does:**
1. ✅ Kills ALL old servers (preview, watch, http-server) - prevents conflicts
2. ✅ Cleans build directory completely - prevents stale file 404s
3. ✅ Builds production files with NODE_ENV=production - fast and reliable
4. ✅ Starts preview server on port 5000 - Replit-compatible
5. ✅ Verifies version is serving - catches errors immediately

**Why this prevents the recurring 404/port issues:**
- Dev and production servers write different files to the same `build/` directory
- If you don't kill both, they conflict and cause 404 errors
- The script kills EVERYTHING first, ensuring a clean start
- No more "it was working, now it's broken" situations

**Timeline:**
- Total time: ~2-3 minutes
- Build: ~2 minutes
- Server start: ~5 seconds
- User sees "update available" → clicks → sees changes

### NEVER DO THIS:

**❌ DON'T USE:** `npm run dev` - It hangs, conflicts with production builds, causes 404s
**❌ DON'T MIX:** Running dev server then production server (or vice versa) without killing both first
**❌ DON'T SKIP:** Cleaning the build directory - causes stale files and 404s

### Before Starting Any Server - Clean Up First

**ALWAYS check for running processes before starting a new server:**

```bash
# Check what's running (preview server or dev server)
ps aux | grep -E "(preview|http-server|node)" | grep -v grep

# Kill preview server
pkill -9 -f "preview"

# Or kill all node processes (nuclear option - use carefully)
pkill -9 node
```

### TypeScript Compilation - Check BEFORE Running Server

**CRITICAL:** Always run TypeScript check before starting the server. This catches errors that cause builds to hang.

```bash
# Check for TypeScript errors (takes 10-30 seconds)
npx tsc --noEmit

# If errors found: FIX THEM FIRST before running server
# If no errors: Safe to run server
```

**Why this matters:**
- TypeScript errors cause the dev server to hang indefinitely
- Production build may complete but game won't work
- Checking first saves 5-10 minutes of waiting for hung builds

### Testing Workflow - Step by Step

**Follow this EXACT sequence every time:**

1. **Make your code changes**
2. **Run the restart script:** `./dev.sh`
3. **Wait 2-3 minutes** for build to complete
4. **Reload browser** when you see "update available" (or just Ctrl+R)
5. **Done!** Changes are now visible

**Optional - Check TypeScript first (recommended for big changes):**
```bash
npx tsc --noEmit  # Catches errors before building
```

**Why this works:**
- Script handles everything automatically (kill servers, clean, build, serve)
- Service worker detects new files and prompts user to reload
- No conflicts between dev/production servers
- No manual cache clearing needed
- Prevents 404 errors from stale files

### If Things Go Wrong

**Server won't start (port in use):**
```bash
# Find what's using port 5000
ps aux | grep -E "(preview|http-server|node)" | grep -v grep

# Kill it
pkill -9 -f "preview"
```

**Build hangs for >2 minutes:**
```bash
# Stop the build (Ctrl+C)
# Check for TypeScript errors
npx tsc --noEmit
# Fix errors, then try production build instead
npm run build
```

**Game loads but features broken:**
```bash
# You probably have TypeScript errors
npx tsc --noEmit
# Fix all errors, then rebuild
npm run build
```

### Summary - Quick Reference

```bash
# THE ONE COMMAND YOU NEED (use this after making code changes)
./dev.sh

# That's it! It does everything automatically:
# - Kills all old servers (no conflicts)
# - Cleans build directory (no stale files)
# - Builds production files (fast & reliable)
# - Starts preview on port 5000 (Replit-compatible)
# - Verifies version is serving (catches errors)
# - Shows version number when done

# Then just reload your browser (Ctrl+R) when you see "update available"
```

**If the script doesn't work:**
```bash
# Check what's running
ps aux | grep -E "preview|watch|http-server" | grep -v grep

# Kill everything manually
pkill -9 -f "preview"
pkill -9 -f "watch"
pkill -9 -f "http-server"

# Run script again
./dev.sh
```

**Remember:**
- ✅ **Always use `./dev.sh`** - prevents server conflicts and 404s
- ✅ **Wait for "update available"** - then reload browser
- ❌ **Never use `npm run dev`** - hangs and causes conflicts
- ❌ **Never mix dev/production** - causes 404 errors

---


## IMPORTANT DISCOVERY - 2025-11-18

### All 365 Teams Were Already Complete!

**What we found:** The documentation incorrectly stated that only 111 teams were added. In reality, ALL 365 NCAA Division I teams were already fully implemented in the codebase!

**Files verified:**
- `src/common/helpers.ts`: Contains all 365 teams (tid 0-364)
- `src/common/constants.basketball.ts`: Contains all 31 conferences (cid 0-30) and 31 divisions
- `src/common/teamInfos.ts`: Contains 329 team definitions with colors, prestige, state info

**Current team count:** 365 teams across 31 conferences
- ACC, Big Ten, Big 12, SEC, Big East
- Atlantic 10, America East, American Athletic
- ASUN, Big Sky, Big West, Colonial (CAA)
- Conference USA, Horizon, Ivy League
- MAAC, MAC, MEAC, Missouri Valley
- Mountain West, NEC, OVC, Patriot
- Southern, Southland, Summit
- Sun Belt, SWAC, WAC, West Coast
- Big South

**Next phase:** With all teams complete, we can focus on:
1. Tournament system (conference tournaments + NCAA tournament)
2. Recruiting system (replace free agency)
3. UI polish and remaining features

