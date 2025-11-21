// ========================================================================
// WORKER CONSOLE SCRIPT: Convert ALL 365 teams to real NCAA names
// ========================================================================
// INSTRUCTIONS:
// 1. Go to Tools > Danger Zone in the game
// 2. Enable God Mode
// 3. Open Worker Console
// 4. Copy and paste this ENTIRE script
// 5. Click "Run code"
// 6. Wait for completion message
// 7. Refresh the page to see real NCAA names!
// ========================================================================

// Conference name mapping (generic → real NCAA)
const conferenceMapping = {
  'Atlantic Coast': 'ACC',
  'Great Lakes': 'Big Ten',
  'Central Plains': 'Big 12',
  'Southeastern': 'SEC',
  'Eastern Athletic': 'Big East',
  'Atlantic League': 'Atlantic 10',
  'Northeast': 'America East',
  'American': 'American Athletic',
  'Atlantic Sun': 'ASUN',
  'Mountain Sky': 'Big Sky',
  'Western': 'Big West',
  'Colonial': 'Colonial Athletic',
  'United States': 'Conference USA',
  'Horizon': 'Horizon League',
  'Ivy': 'Ivy League',
  'Metro Atlantic': 'MAAC',
  'Mid-American': 'MAC',
  'Mid-Eastern': 'MEAC',
  'Mississippi Valley': 'Missouri Valley',
  'Rocky Mountain': 'Mountain West',
  'New England': 'NEC',
  'Ohio River': 'Ohio Valley',
  'Patriot': 'Patriot League',
  'Southern': 'Southern',
  'Southland': 'Southland',
  'Summit': 'The Summit',
  'Sun Belt': 'Sun Belt',
  'Southwestern': 'SWAC',
  'Western Athletic': 'WAC',
  'Pacific Coast': 'West Coast',
  'South Atlantic': 'Big South',
};

// Team mapping: current abbrev → real NCAA data (ALL 365 TEAMS)
const teamMapping = {
  // ACC (18 teams)
  'DUR': { region: 'Duke', name: 'Blue Devils', abbrev: 'DUKE' },
  'NCI': { region: 'North Carolina', name: 'Tar Heels', abbrev: 'UNC' },
  'CHA': { region: 'Virginia', name: 'Cavaliers', abbrev: 'UVA' },
  'SYR': { region: 'Syracuse', name: 'Orange', abbrev: 'SYR' },
  'LOU': { region: 'Louisville', name: 'Cardinals', abbrev: 'LOU' },
  'PAT': { region: 'Pittsburgh', name: 'Panthers', abbrev: 'PITT' },
  'MAI': { region: 'Boston College', name: 'Eagles', abbrev: 'BC' },
  'CLE': { region: 'Clemson', name: 'Tigers', abbrev: 'CLEM' },
  'TAL': { region: 'Florida State', name: 'Seminoles', abbrev: 'FSU' },
  'ATL': { region: 'Georgia Tech', name: 'Yellow Jackets', abbrev: 'GT' },
  'CGA': { region: 'Miami', name: 'Hurricanes', abbrev: 'MIA' },
  'RAL': { region: 'NC State', name: 'Wolfpack', abbrev: 'NCST' },
  'SBE': { region: 'Notre Dame', name: 'Fighting Irish', abbrev: 'ND' },
  'BLA': { region: 'Virginia Tech', name: 'Hokies', abbrev: 'VT' },
  'WIN': { region: 'Wake Forest', name: 'Demon Deacons', abbrev: 'WAKE' },
  'STA': { region: 'Stanford', name: 'Cardinal', abbrev: 'STAN' },
  'BER': { region: 'California', name: 'Golden Bears', abbrev: 'CAL' },
  'DAL': { region: 'SMU', name: 'Mustangs', abbrev: 'SMU' },

  // Big Ten (18 teams)
  'AAR': { region: 'Michigan', name: 'Wolverines', abbrev: 'MICH' },
  'ELA': { region: 'Michigan State', name: 'Spartans', abbrev: 'MSU' },
  'BLO': { region: 'Indiana', name: 'Hoosiers', abbrev: 'IU' },
  'COL': { region: 'Ohio State', name: 'Buckeyes', abbrev: 'OSU' },
  'ILA': { region: 'Illinois', name: 'Fighting Illini', abbrev: 'ILL' },
  'ICI': { region: 'Iowa', name: 'Hawkeyes', abbrev: 'IOWA' },
  'CPA': { region: 'Maryland', name: 'Terrapins', abbrev: 'MD' },
  'MIN': { region: 'Minnesota', name: 'Golden Gophers', abbrev: 'MINN' },
  'LIN': { region: 'Nebraska', name: 'Cornhuskers', abbrev: 'NEB' },
  'EVA': { region: 'Northwestern', name: 'Wildcats', abbrev: 'NW' },
  'SCO': { region: 'Penn State', name: 'Nittany Lions', abbrev: 'PSU' },
  'WLA': { region: 'Purdue', name: 'Boilermakers', abbrev: 'PUR' },
  'PIS': { region: 'Rutgers', name: 'Scarlet Knights', abbrev: 'RU' },
  'MAD': { region: 'Wisconsin', name: 'Badgers', abbrev: 'WISC' },
  'EUG': { region: 'Oregon', name: 'Ducks', abbrev: 'ORE' },
  'SEA': { region: 'Washington', name: 'Huskies', abbrev: 'WASH' },
  'LAN': { region: 'USC', name: 'Trojans', abbrev: 'USC' },
  'WES': { region: 'UCLA', name: 'Bruins', abbrev: 'UCLA' },

  // Big 12 (16 teams)
  'LAW': { region: 'Kansas', name: 'Jayhawks', abbrev: 'KU' },
  'WAC': { region: 'Baylor', name: 'Bears', abbrev: 'BAY' },
  'AUS': { region: 'Texas', name: 'Longhorns', abbrev: 'TEX' },
  'LUB': { region: 'Texas Tech', name: 'Red Raiders', abbrev: 'TTU' },
  'FWO': { region: 'TCU', name: 'Horned Frogs', abbrev: 'TCU' },
  'STI': { region: 'Oklahoma State', name: 'Cowboys', abbrev: 'OKST' },
  'MAN': { region: 'Kansas State', name: 'Wildcats', abbrev: 'KSU' },
  'AME': { region: 'Iowa State', name: 'Cyclones', abbrev: 'ISU' },
  'MOR': { region: 'West Virginia', name: 'Mountaineers', abbrev: 'WVU' },
  'BOU': { region: 'Colorado', name: 'Buffaloes', abbrev: 'COLO' },
  'SLC': { region: 'Utah', name: 'Utes', abbrev: 'UTAH' },
  'TEM': { region: 'Arizona State', name: 'Sun Devils', abbrev: 'ASU' },
  'TUC': { region: 'Arizona', name: 'Wildcats', abbrev: 'ARIZ' },
  'PRO': { region: 'BYU', name: 'Cougars', abbrev: 'BYU' },
  'HOU': { region: 'Houston', name: 'Cougars', abbrev: 'HOU' },
  'CIN': { region: 'Cincinnati', name: 'Bearcats', abbrev: 'CIN' },

  // SEC (16 teams)
  'LEX': { region: 'Kentucky', name: 'Wildcats', abbrev: 'UK' },
  'TUS': { region: 'Alabama', name: 'Crimson Tide', abbrev: 'ALA' },
  'AUB': { region: 'Auburn', name: 'Tigers', abbrev: 'AUB' },
  'FAY': { region: 'Arkansas', name: 'Razorbacks', abbrev: 'ARK' },
  'GAI': { region: 'Florida', name: 'Gators', abbrev: 'UF' },
  'ATH': { region: 'Georgia', name: 'Bulldogs', abbrev: 'UGA' },
  'LAO': { region: 'LSU', name: 'Tigers', abbrev: 'LSU' },
  'OXF': { region: 'Ole Miss', name: 'Rebels', abbrev: 'MISS' },
  'MSA': { region: 'Mississippi State', name: 'Bulldogs', abbrev: 'MSST' },
  'MOL': { region: 'Missouri', name: 'Tigers', abbrev: 'MIZ' },
  'SCL': { region: 'South Carolina', name: 'Gamecocks', abbrev: 'SC' },
  'KNO': { region: 'Tennessee', name: 'Volunteers', abbrev: 'TENN' },
  'CST': { region: 'Texas A&M', name: 'Aggies', abbrev: 'TAMU' },
  'NAS': { region: 'Vanderbilt', name: 'Commodores', abbrev: 'VANDY' },
  'NOR': { region: 'Oklahoma', name: 'Sooners', abbrev: 'OU' },
  'MEM': { region: 'Memphis', name: 'Tigers', abbrev: 'MEM' },

  // Big East (11 teams)
  'VIL': { region: 'Villanova', name: 'Wildcats', abbrev: 'NOVA' },
  'DCS': { region: 'Georgetown', name: 'Hoyas', abbrev: 'GTWN' },
  'STO': { region: 'UConn', name: 'Huskies', abbrev: 'CONN' },
  'OMA': { region: 'Creighton', name: 'Bluejays', abbrev: 'CREI' },
  'ILI': { region: 'DePaul', name: 'Blue Demons', abbrev: 'DEP' },
  'MIL': { region: 'Marquette', name: 'Golden Eagles', abbrev: 'MARQ' },
  'RIO': { region: 'Providence', name: 'Friars', abbrev: 'PROV' },
  'NEW': { region: 'Seton Hall', name: 'Pirates', abbrev: 'SH' },
  'QUE': { region: 'St. John\'s', name: 'Red Storm', abbrev: 'SJU' },
  'OHN': { region: 'Xavier', name: 'Musketeers', abbrev: 'XAV' },
  'IND': { region: 'Butler', name: 'Bulldogs', abbrev: 'BUT' },

  // Gonzaga (WCC power)
  'SPO': { region: 'Gonzaga', name: 'Bulldogs', abbrev: 'GONZ' },

  // Atlantic 10 (14 teams)
  'DAV': { region: 'Davidson', name: 'Wildcats', abbrev: 'DAV' },
  'DAY': { region: 'Dayton', name: 'Flyers', abbrev: 'DAY' },
  'DUQ': { region: 'Duquesne', name: 'Dukes', abbrev: 'DUQ' },
  'BRO': { region: 'Fordham', name: 'Rams', abbrev: 'FOR' },
  'FAI': { region: 'George Mason', name: 'Patriots', abbrev: 'GMU' },
  'GWU': { region: 'George Washington', name: 'Revolutionaries', abbrev: 'GW' },
  'PHI': { region: 'La Salle', name: 'Explorers', abbrev: 'LAS' },
  'LOY': { region: 'Loyola Chicago', name: 'Ramblers', abbrev: 'LUC' },
  'KIN': { region: 'Rhode Island', name: 'Rams', abbrev: 'URI' },
  'RIC': { region: 'Richmond', name: 'Spiders', abbrev: 'RICH' },
  'OLE': { region: 'St. Bonaventure', name: 'Bonnies', abbrev: 'SBU' },
  'PAI': { region: 'Saint Joseph\'s', name: 'Hawks', abbrev: 'SJU' },
  'SLO': { region: 'Saint Louis', name: 'Billikens', abbrev: 'SLU' },
  'VAC': { region: 'VCU', name: 'Rams', abbrev: 'VCU' },

  // WCC (West Coast Conference - 11 teams)
  'CAN': { region: 'Loyola Marymount', name: 'Lions', abbrev: 'LMU' },
  'MAL': { region: 'Pepperdine', name: 'Waves', abbrev: 'PEPP' },
  'POR': { region: 'Portland', name: 'Pilots', abbrev: 'PORT' },
  'CAR': { region: 'Saint Mary\'s', name: 'Gaels', abbrev: 'SMC' },
  'SDI': { region: 'San Diego', name: 'Toreros', abbrev: 'USD' },
  'SFR': { region: 'San Francisco', name: 'Dons', abbrev: 'USF' },
  'CAL': { region: 'Santa Clara', name: 'Broncos', abbrev: 'SCU' },
  'WAA': { region: 'Seattle', name: 'Redhawks', abbrev: 'SEA' },
  'COR': { region: 'Oregon State', name: 'Beavers', abbrev: 'ORST' },
  'CAO': { region: 'Pacific', name: 'Tigers', abbrev: 'PAC' },
  'PUL': { region: 'Washington State', name: 'Cougars', abbrev: 'WSU' },

  // American Athletic Conference (14 teams)
  'ORL': { region: 'UCF', name: 'Knights', abbrev: 'UCF' },
  'GRE': { region: 'East Carolina', name: 'Pirates', abbrev: 'ECU' },
  'BRA': { region: 'Florida Atlantic', name: 'Owls', abbrev: 'FAU' },
  'DEN': { region: 'North Texas', name: 'Mean Green', abbrev: 'UNT' },
  'TXU': { region: 'Rice', name: 'Owls', abbrev: 'RICE' },
  'TAM': { region: 'South Florida', name: 'Bulls', abbrev: 'USF' },
  'PH2': { region: 'Temple', name: 'Owls', abbrev: 'TEM' },
  'BIR': { region: 'UAB', name: 'Blazers', abbrev: 'UAB' },
  'SAN': { region: 'UTSA', name: 'Roadrunners', abbrev: 'UTSA' },
  'LAR': { region: 'Tulane', name: 'Green Wave', abbrev: 'TUL' },
  'TUL': { region: 'Tulsa', name: 'Golden Hurricane', abbrev: 'TLSA' },
  'WIC': { region: 'Wichita State', name: 'Shockers', abbrev: 'WICH' },
  'NCA': { region: 'Charlotte', name: '49ers', abbrev: 'CHAR' },

  // Missouri Valley Conference (12 teams)
  'TNS': { region: 'Belmont', name: 'Bruins', abbrev: 'BEL' },
  'PEO': { region: 'Bradley', name: 'Braves', abbrev: 'BRAD' },
  'DMO': { region: 'Drake', name: 'Bulldogs', abbrev: 'DRKE' },
  'INA': { region: 'Evansville', name: 'Purple Aces', abbrev: 'EVAN' },
  'ILR': { region: 'Illinois State', name: 'Redbirds', abbrev: 'ILST' },
  'THA': { region: 'Indiana State', name: 'Sycamores', abbrev: 'INST' },
  'MUR': { region: 'Murray State', name: 'Racers', abbrev: 'MURR' },
  'CFA': { region: 'Northern Iowa', name: 'Panthers', abbrev: 'UNI' },
  'CA2': { region: 'Southern Illinois', name: 'Salukis', abbrev: 'SIU' },
  'CH2': { region: 'UIC', name: 'Flames', abbrev: 'UIC' },
  'VAL': { region: 'Valparaiso', name: 'Beacons', abbrev: 'VALP' },

  // Mountain West Conference (11 teams)
  'CSP': { region: 'Air Force', name: 'Falcons', abbrev: 'AF' },
  'BOI': { region: 'Boise State', name: 'Broncos', abbrev: 'BSU' },
  'FCO': { region: 'Colorado State', name: 'Rams', abbrev: 'CSU' },
  'FRE': { region: 'Fresno State', name: 'Bulldogs', abbrev: 'FRES' },
  'REN': { region: 'Nevada', name: 'Wolf Pack', abbrev: 'NEV' },
  'ALB': { region: 'New Mexico', name: 'Lobos', abbrev: 'UNM' },
  'CAI': { region: 'San Diego State', name: 'Aztecs', abbrev: 'SDSU' },
  'SJO': { region: 'San Jose State', name: 'Spartans', abbrev: 'SJSU' },
  'LVE': { region: 'UNLV', name: 'Runnin\' Rebels', abbrev: 'UNLV' },
  'LOG': { region: 'Utah State', name: 'Aggies', abbrev: 'USU' },
  'WYR': { region: 'Wyoming', name: 'Cowboys', abbrev: 'WYO' },

  // Conference USA (13 teams)
  'PHO': { region: 'Grand Canyon', name: 'Antelopes', abbrev: 'GCU' },
  'DEW': { region: 'Delaware', name: 'Fightin\' Blue Hens', abbrev: 'DEL' },
  'MIA': { region: 'Florida International', name: 'Panthers', abbrev: 'FIU' },
  'JAC': { region: 'Jacksonville State', name: 'Gamecocks', abbrev: 'JAXST' },
  'KEN': { region: 'Kennesaw State', name: 'Owls', abbrev: 'KENN' },
  'LYN': { region: 'Liberty', name: 'Flames', abbrev: 'LIB' },
  'RUS': { region: 'Louisiana Tech', name: 'Bulldogs', abbrev: 'LT' },
  'TNR': { region: 'Middle Tennessee', name: 'Blue Raiders', abbrev: 'MTSU' },
  'SPR': { region: 'Missouri State', name: 'Bears', abbrev: 'MOST' },
  'LCR': { region: 'New Mexico State', name: 'Aggies', abbrev: 'NMSU' },
  'HUN': { region: 'Sam Houston', name: 'Bearkats', abbrev: 'SHSU' },
  'EPA': { region: 'UTEP', name: 'Miners', abbrev: 'UTEP' },
  'BGR': { region: 'Western Kentucky', name: 'Hilltoppers', abbrev: 'WKU' },

  // ASUN (12 teams)
  'BEL': { region: 'Bellarmine', name: 'Knights', abbrev: 'BELL' },
  'EKU': { region: 'Eastern Kentucky', name: 'Colonels', abbrev: 'EKU' },
  'QUC': { region: 'Queens', name: 'Royals', abbrev: 'QUNS' },
  'CLA': { region: 'Austin Peay', name: 'Governors', abbrev: 'APSU' },
  'KYU': { region: 'Bellarmine', name: 'Knights', abbrev: 'BELL' },
  'ARN': { region: 'Central Arkansas', name: 'Bears', abbrev: 'UCA' },
  'KYC': { region: 'Eastern Kentucky', name: 'Colonels', abbrev: 'EKU' },
  'FMY': { region: 'Florida Gulf Coast', name: 'Eagles', abbrev: 'FGCU' },
  'FLC': { region: 'North Florida', name: 'Dolphins', abbrev: 'UNF' },
  'NA3': { region: 'Lipscomb', name: 'Bisons', abbrev: 'LIP' },
  'FLO': { region: 'North Alabama', name: 'Lions', abbrev: 'UNA' },
  'JA2': { region: 'Jacksonville', name: 'Ospreys', abbrev: 'JAX' },

  // CAA (Colonial Athletic Association - 14 teams)
  'DRE': { region: 'Drexel', name: 'Dragons', abbrev: 'DREX' },
  'BCR': { region: 'Campbell', name: 'Fighting Camels', abbrev: 'CAMP' },
  'SCA': { region: 'Charleston', name: 'Cougars', abbrev: 'CHS' },
  'PH3': { region: 'Delaware', name: 'Dragons', abbrev: 'DEL' },
  'ELO': { region: 'Elon', name: 'Phoenix', abbrev: 'ELON' },
  'HAM': { region: 'Hampton', name: 'Pirates', abbrev: 'HAMP' },
  'HEM': { region: 'Hofstra', name: 'Pride', abbrev: 'HOF' },
  'WLB': { region: 'Monmouth', name: 'Hawks', abbrev: 'MONM' },
  'NCE': { region: 'North Carolina A&T', name: 'Aggies', abbrev: 'NCAT' },
  'BOS': { region: 'Northeastern', name: 'Huskies', abbrev: 'NEU' },
  'SBR': { region: 'Stony Brook', name: 'Seawolves', abbrev: 'SBRO' },
  'TOW': { region: 'Towson', name: 'Tigers', abbrev: 'TOWS' },
  'WIL': { region: 'UNC Wilmington', name: 'Seahawks', abbrev: 'UNCW' },
  'WI2': { region: 'William & Mary', name: 'Tribe', abbrev: 'W&M' },

  // Horizon League (11 teams)
  'OHE': { region: 'Cleveland State', name: 'Vikings', abbrev: 'CLEV' },
  'DET': { region: 'Detroit Mercy', name: 'Titans', abbrev: 'DET' },
  'IN2': { region: 'IUPUI', name: 'Jaguars', abbrev: 'IUPUI' },
  'MI2': { region: 'Milwaukee', name: 'Panthers', abbrev: 'UWM' },
  'HHE': { region: 'Northern Kentucky', name: 'Norse', abbrev: 'NKU' },
  'ROC': { region: 'Oakland', name: 'Golden Grizzlies', abbrev: 'OAK' },
  'FWA': { region: 'Purdue Fort Wayne', name: 'Mastodons', abbrev: 'PFW' },
  'MTO': { region: 'Robert Morris', name: 'Colonials', abbrev: 'RMU' },
  'GBA': { region: 'Green Bay', name: 'Phoenix', abbrev: 'GRBAY' },
  'OHY': { region: 'Wright State', name: 'Raiders', abbrev: 'WRST' },
  'YOU': { region: 'Youngstown State', name: 'Penguins', abbrev: 'YSU' },

  // Ivy League (8 teams)
  'PR2': { region: 'Brown', name: 'Bears', abbrev: 'BRWN' },
  'NYO': { region: 'Columbia', name: 'Lions', abbrev: 'CLMB' },
  'ITH': { region: 'Cornell', name: 'Big Red', abbrev: 'COR' },
  'HAN': { region: 'Dartmouth', name: 'Big Green', abbrev: 'DART' },
  'CAM': { region: 'Harvard', name: 'Crimson', abbrev: 'HARV' },
  'PH4': { region: 'Penn', name: 'Quakers', abbrev: 'PENN' },
  'PRI': { region: 'Princeton', name: 'Tigers', abbrev: 'PRIN' },
  'NHA': { region: 'Yale', name: 'Bulldogs', abbrev: 'YALE' },

  // MAAC (Metro Atlantic Athletic Conference - 13 teams)
  'BUF': { region: 'Canisius', name: 'Golden Griffins', abbrev: 'CAN' },
  'CTI': { region: 'Fairfield', name: 'Stags', abbrev: 'FAIR' },
  'NRO': { region: 'Iona', name: 'Gaels', abbrev: 'IONA' },
  'BR2': { region: 'Manhattan', name: 'Jaspers', abbrev: 'MANH' },
  'POU': { region: 'Marist', name: 'Red Foxes', abbrev: 'MAR' },
  'NAN': { region: 'Merrimack', name: 'Warriors', abbrev: 'MERR' },
  'EMM': { region: 'Mount St. Mary\'s', name: 'Mountaineers', abbrev: 'MSMU' },
  'LEW': { region: 'Niagara', name: 'Purple Eagles', abbrev: 'NIAG' },
  'CTM': { region: 'Quinnipiac', name: 'Bobcats', abbrev: 'QUIN' },
  'NJW': { region: 'Rider', name: 'Broncs', abbrev: 'RID' },
  'FA2': { region: 'Sacred Heart', name: 'Pioneers', abbrev: 'SHU' },
  'JCI': { region: 'Saint Peter\'s', name: 'Peacocks', abbrev: 'SPU' },
  'NYU': { region: 'Siena', name: 'Saints', abbrev: 'SIEN' },

  // MAC (Mid-American Conference - 13 teams)
  'AKR': { region: 'Akron', name: 'Zips', abbrev: 'AKR' },
  'MUN': { region: 'Ball State', name: 'Cardinals', abbrev: 'BALL' },
  'OHR': { region: 'Bowling Green', name: 'Falcons', abbrev: 'BGSU' },
  'NYF': { region: 'Buffalo', name: 'Bulls', abbrev: 'BUFF' },
  'MPL': { region: 'Central Michigan', name: 'Chippewas', abbrev: 'CMU' },
  'YPS': { region: 'Eastern Michigan', name: 'Eagles', abbrev: 'EMU' },
  'KE2': { region: 'Kent State', name: 'Golden Flashes', abbrev: 'KENT' },
  'AMH': { region: 'UMass', name: 'Minutemen', abbrev: 'UMASS' },
  'OHF': { region: 'Miami (OH)', name: 'RedHawks', abbrev: 'MIA' },
  'DEK': { region: 'Northern Illinois', name: 'Huskies', abbrev: 'NIU' },
  'OHH': { region: 'Ohio', name: 'Bobcats', abbrev: 'OHIO' },
  'TOL': { region: 'Toledo', name: 'Rockets', abbrev: 'TOL' },
  'KAL': { region: 'Western Michigan', name: 'Broncos', abbrev: 'WMU' },

  // MEAC (Mid-Eastern Athletic Conference - 8 teams)
  'BAL': { region: 'Coppin State', name: 'Eagles', abbrev: 'COPP' },
  'DOV': { region: 'Delaware State', name: 'Hornets', abbrev: 'DSU' },
  'WA2': { region: 'Howard', name: 'Bison', abbrev: 'HOW' },
  'PAN': { region: 'Maryland Eastern Shore', name: 'Hawks', abbrev: 'UMES' },
  'MDL': { region: 'Morgan State', name: 'Bears', abbrev: 'MORG' },
  'VAR': { region: 'Norfolk State', name: 'Spartans', abbrev: 'NSU' },
  'NCR': { region: 'North Carolina Central', name: 'Eagles', abbrev: 'NCCU' },
  'ORA': { region: 'South Carolina State', name: 'Bulldogs', abbrev: 'SCSU' },

  // NEC (Northeast Conference - 10 teams)
  'NBR': { region: 'Central Connecticut', name: 'Blue Devils', abbrev: 'CCSU' },
  'CH3': { region: 'Chicago State', name: 'Cougars', abbrev: 'CHST' },
  'TEA': { region: 'Fairleigh Dickinson', name: 'Knights', abbrev: 'FDU' },
  'NYR': { region: 'Le Moyne', name: 'Dolphins', abbrev: 'LEM' },
  'BR3': { region: 'LIU', name: 'Sharks', abbrev: 'LIU' },
  'ERI': { region: 'Mercyhurst', name: 'Lakers', abbrev: 'MERC' },
  'WHA': { region: 'New Haven', name: 'Chargers', abbrev: 'NHAV' },
  'LOR': { region: 'St. Francis', name: 'Red Flash', abbrev: 'SFU' },
  'EAS': { region: 'Stonehill', name: 'Skyhawks', abbrev: 'STON' },
  'SIS': { region: 'Wagner', name: 'Seahawks', abbrev: 'WAG' },

  // OVC (Ohio Valley Conference - 11 teams)
  'CH4': { region: 'Eastern Illinois', name: 'Panthers', abbrev: 'EIU' },
  'SCH': { region: 'Lindenwood', name: 'Lions', abbrev: 'LIND' },
  'LRO': { region: 'Little Rock', name: 'Trojans', abbrev: 'UALR' },
  'KYR': { region: 'Morehead State', name: 'Eagles', abbrev: 'MORE' },
  'CGI': { region: 'SE Missouri State', name: 'Redhawks', abbrev: 'SEMO' },
  'EDW': { region: 'SIU Edwardsville', name: 'Cougars', abbrev: 'SIUE' },
  'EV2': { region: 'Southern Indiana', name: 'Screaming Eagles', abbrev: 'USI' },
  'MAR': { region: 'Tennessee Martin', name: 'Skyhawks', abbrev: 'UTM' },
  'NA2': { region: 'Tennessee State', name: 'Tigers', abbrev: 'TNST' },
  'COO': { region: 'Tennessee Tech', name: 'Golden Eagles', abbrev: 'TTU' },
  'MAC': { region: 'Western Illinois', name: 'Leathernecks', abbrev: 'WIU' },

  // Patriot League (10 teams)
  'WA3': { region: 'American', name: 'Eagles', abbrev: 'AMER' },
  'WPO': { region: 'Army', name: 'Black Knights', abbrev: 'ARMY' },
  'MAS': { region: 'Boston University', name: 'Terriers', abbrev: 'BU' },
  'PAW': { region: 'Bucknell', name: 'Bison', abbrev: 'BUCK' },
  'NYM': { region: 'Colgate', name: 'Raiders', abbrev: 'COLG' },
  'WOR': { region: 'Holy Cross', name: 'Crusaders', abbrev: 'HC' },
  'PAS': { region: 'Lafayette', name: 'Leopards', abbrev: 'LAF' },
  'BET': { region: 'Lehigh', name: 'Mountain Hawks', abbrev: 'LEH' },
  'BA2': { region: 'Loyola Maryland', name: 'Greyhounds', abbrev: 'LMD' },
  'ANN': { region: 'Navy', name: 'Midshipmen', abbrev: 'NAVY' },

  // Southern Conference (10 teams)
  'TNA': { region: 'Chattanooga', name: 'Mocs', abbrev: 'CHAT' },
  'CH5': { region: 'The Citadel', name: 'Bulldogs', abbrev: 'CIT' },
  'TNI': { region: 'East Tennessee State', name: 'Buccaneers', abbrev: 'ETSU' },
  'SCE': { region: 'Furman', name: 'Paladins', abbrev: 'FUR' },
  'GAC': { region: 'Mercer', name: 'Bears', abbrev: 'MER' },
  'ALR': { region: 'Samford', name: 'Bulldogs', abbrev: 'SAM' },
  'GR2': { region: 'UNC Greensboro', name: 'Spartans', abbrev: 'UNCG' },
  'VAX': { region: 'VMI', name: 'Keydets', abbrev: 'VMI' },
  'CUL': { region: 'Western Carolina', name: 'Catamounts', abbrev: 'WCU' },
  'SPA': { region: 'Wofford', name: 'Terriers', abbrev: 'WOF' },

  // Southland Conference (12 teams)
  'COM': { region: 'East Texas A&M', name: 'Lions', abbrev: 'ETAM' },
  'HO2': { region: 'Houston Christian', name: 'Huskies', abbrev: 'HCU' },
  'TXN': { region: 'Incarnate Word', name: 'Cardinals', abbrev: 'UIW' },
  'BEA': { region: 'Lamar', name: 'Cardinals', abbrev: 'LAM' },
  'LCH': { region: 'McNeese', name: 'Cowboys', abbrev: 'MCNE' },
  'NO2': { region: 'New Orleans', name: 'Privateers', abbrev: 'UNO' },
  'THI': { region: 'Nicholls', name: 'Colonels', abbrev: 'NICH' },
  'NAT': { region: 'Northwestern State', name: 'Demons', abbrev: 'NWST' },
  'LAM': { region: 'Southeastern Louisiana', name: 'Lions', abbrev: 'SELA' },
  'NAC': { region: 'Stephen F. Austin', name: 'Lumberjacks', abbrev: 'SFA' },
  'CCH': { region: 'Texas A&M-Corpus Christi', name: 'Islanders', abbrev: 'AMCC' },
  'EDI': { region: 'UTRGV', name: 'Vaqueros', abbrev: 'UTRGV' },

  // SWAC (Southwestern Athletic Conference - 12 teams)
  'ALN': { region: 'Alabama A&M', name: 'Bulldogs', abbrev: 'AAMU' },
  'MON': { region: 'Alabama State', name: 'Hornets', abbrev: 'ALST' },
  'MSR': { region: 'Alcorn State', name: 'Braves', abbrev: 'ALCN' },
  'PBL': { region: 'Arkansas-Pine Bluff', name: 'Golden Lions', abbrev: 'UAPB' },
  'DBE': { region: 'Bethune-Cookman', name: 'Wildcats', abbrev: 'BCU' },
  'FLL': { region: 'Florida A&M', name: 'Rattlers', abbrev: 'FAMU' },
  'GRA': { region: 'Grambling', name: 'Tigers', abbrev: 'GRAM' },
  'MSC': { region: 'Jackson State', name: 'Tigers', abbrev: 'JKST' },
  'IBE': { region: 'Mississippi Valley State', name: 'Delta Devils', abbrev: 'MVSU' },
  'PVI': { region: 'Prairie View A&M', name: 'Panthers', abbrev: 'PVAM' },
  'BR4': { region: 'Southern', name: 'Jaguars', abbrev: 'SOU' },
  'HO3': { region: 'Texas Southern', name: 'Tigers', abbrev: 'TXSO' },

  // Summit League (9 teams)
  'CON': { region: 'Denver', name: 'Pioneers', abbrev: 'DEN' },
  'KCI': { region: 'Kansas City', name: 'Roos', abbrev: 'UMKC' },
  'GFO': { region: 'North Dakota', name: 'Fighting Hawks', abbrev: 'UND' },
  'FAR': { region: 'North Dakota State', name: 'Bison', abbrev: 'NDSU' },
  'NEA': { region: 'Omaha', name: 'Mavericks', abbrev: 'UNO' },
  'OKL': { region: 'Oral Roberts', name: 'Golden Eagles', abbrev: 'ORU' },
  'MNA': { region: 'St. Thomas', name: 'Tommies', abbrev: 'STTM' },
  'VER': { region: 'South Dakota', name: 'Coyotes', abbrev: 'USD' },
  'SDO': { region: 'South Dakota State', name: 'Jackrabbits', abbrev: 'SDSU' },

  // Sun Belt Conference (14 teams)
  'BOO': { region: 'Appalachian State', name: 'Mountaineers', abbrev: 'APP' },
  'JON': { region: 'Arkansas State', name: 'Red Wolves', abbrev: 'ARST' },
  'SCN': { region: 'Coastal Carolina', name: 'Chanticleers', abbrev: 'CCU' },
  'GAA': { region: 'Georgia Southern', name: 'Eagles', abbrev: 'GASO' },
  'GAL': { region: 'Georgia State', name: 'Panthers', abbrev: 'GAST' },
  'HAR': { region: 'James Madison', name: 'Dukes', abbrev: 'JMU' },
  'LAF': { region: 'Louisiana', name: 'Ragin\' Cajuns', abbrev: 'ULL' },
  'MO2': { region: 'Louisiana-Monroe', name: 'Warhawks', abbrev: 'ULM' },
  'WVN': { region: 'Marshall', name: 'Thundering Herd', abbrev: 'MRSH' },
  'NO3': { region: 'Old Dominion', name: 'Monarchs', abbrev: 'ODU' },
  'MOB': { region: 'South Alabama', name: 'Jaguars', abbrev: 'USA' },
  'HAT': { region: 'Southern Miss', name: 'Golden Eagles', abbrev: 'USM' },
  'SMA': { region: 'Texas State', name: 'Bobcats', abbrev: 'TXST' },
  'TRO': { region: 'Troy', name: 'Trojans', abbrev: 'TROY' },

  // WAC (Western Athletic Conference - 7 teams)
  'ABI': { region: 'Abilene Christian', name: 'Wildcats', abbrev: 'ACU' },
  'RIV': { region: 'Cal Baptist', name: 'Lancers', abbrev: 'CBU' },
  'CCI': { region: 'Southern Utah', name: 'Thunderbirds', abbrev: 'SUU' },
  'STE': { region: 'Tarleton State', name: 'Texans', abbrev: 'TLTN' },
  'SGE': { region: 'Utah Tech', name: 'Trailblazers', abbrev: 'UTCH' },
  'ORE': { region: 'Utah Valley', name: 'Wolverines', abbrev: 'UVU' },
  'ARL': { region: 'UT Arlington', name: 'Mavericks', abbrev: 'UTA' },

  // Big Sky Conference (11 teams)
  'CHE': { region: 'Eastern Washington', name: 'Eagles', abbrev: 'EWU' },
  'MOS': { region: 'Idaho', name: 'Vandals', abbrev: 'IDA' },
  'POC': { region: 'Idaho State', name: 'Bengals', abbrev: 'IDST' },
  'MIS': { region: 'Montana', name: 'Grizzlies', abbrev: 'MONT' },
  'BOZ': { region: 'Montana State', name: 'Bobcats', abbrev: 'MTST' },
  'FLA': { region: 'Northern Arizona', name: 'Lumberjacks', abbrev: 'NAU' },
  'COE': { region: 'Northern Colorado', name: 'Bears', abbrev: 'UNC' },
  'ORR': { region: 'Portland State', name: 'Vikings', abbrev: 'PSU' },
  'SAC': { region: 'Sacramento State', name: 'Hornets', abbrev: 'SAC' },
  'OGD': { region: 'Weber State', name: 'Wildcats', abbrev: 'WEB' },

  // Big South Conference (9 teams)
  'CH6': { region: 'Charleston Southern', name: 'Buccaneers', abbrev: 'CHSO' },
  'BSP': { region: 'Gardner-Webb', name: 'Runnin\' Bulldogs', abbrev: 'GWEB' },
  'HPO': { region: 'High Point', name: 'Panthers', abbrev: 'HP' },
  'FA3': { region: 'Longwood', name: 'Lancers', abbrev: 'LONG' },
  'CLI': { region: 'Presbyterian', name: 'Blue Hose', abbrev: 'PC' },
  'RAD': { region: 'Radford', name: 'Highlanders', abbrev: 'RAD' },
  'ASH': { region: 'UNC Asheville', name: 'Bulldogs', abbrev: 'UNCA' },
  'SP2': { region: 'USC Upstate', name: 'Spartans', abbrev: 'USCU' },
  'RHI': { region: 'Winthrop', name: 'Eagles', abbrev: 'WIN' },

  // Big West Conference (11 teams)
  'SL2': { region: 'Cal Poly', name: 'Mustangs', abbrev: 'CP' },
  'BAK': { region: 'CSU Bakersfield', name: 'Roadrunners', abbrev: 'CSUB' },
  'FUL': { region: 'CSU Fullerton', name: 'Titans', abbrev: 'CSUF' },
  'NO4': { region: 'CSU Northridge', name: 'Matadors', abbrev: 'CSUN' },
  'HON': { region: 'Hawaii', name: 'Rainbow Warriors', abbrev: 'HAW' },
  'LBE': { region: 'Long Beach State', name: 'The Beach', abbrev: 'LBSU' },
  'CAV': { region: 'UC Davis', name: 'Aggies', abbrev: 'UCD' },
  'IRV': { region: 'UC Irvine', name: 'Anteaters', abbrev: 'UCI' },
  'RI2': { region: 'UC Riverside', name: 'Highlanders', abbrev: 'UCR' },
  'SD2': { region: 'UC San Diego', name: 'Tritons', abbrev: 'UCSD' },
  'SBA': { region: 'UC Santa Barbara', name: 'Gauchos', abbrev: 'UCSB' },

  // America East Conference (9 teams)
  'NYB': { region: 'Albany', name: 'Great Danes', abbrev: 'ALB' },
  'BIN': { region: 'Binghamton', name: 'Bearcats', abbrev: 'BING' },
  'SMI': { region: 'Bryant', name: 'Bulldogs', abbrev: 'BRY' },
  'ORO': { region: 'Maine', name: 'Black Bears', abbrev: 'ME' },
  'BA3': { region: 'UMBC', name: 'Retrievers', abbrev: 'UMBC' },
  'LOW': { region: 'UMass Lowell', name: 'River Hawks', abbrev: 'UML' },
  'NHR': { region: 'New Hampshire', name: 'Wildcats', abbrev: 'UNH' },
  'NE2': { region: 'NJIT', name: 'Highlanders', abbrev: 'NJIT' },
  'BUR': { region: 'Vermont', name: 'Catamounts', abbrev: 'VT' },
};

// ========================================================================
// EXECUTION CODE - Update all teams and conferences
// ========================================================================

console.log('🏀 Starting NCAA name conversion for all 365 teams...');
console.log('');

// Update teams
const teams = await idb.cache.teams.getAll();
let updated = 0;
let notFound = [];

for (const team of teams) {
  const mapping = teamMapping[team.abbrev];
  if (mapping) {
    team.region = mapping.region;
    team.name = mapping.name;
    team.abbrev = mapping.abbrev;
    await idb.cache.teams.put(team);
    updated++;
    console.log(`✓ ${mapping.abbrev}: ${mapping.region} ${mapping.name}`);
  } else {
    notFound.push(`${team.abbrev} (${team.region} ${team.name})`);
  }
}

console.log('');
console.log(`✅ Updated ${updated} teams`);

if (notFound.length > 0) {
  console.log(`⚠️  ${notFound.length} teams not found in mapping:`);
  for (const team of notFound) {
    console.log(`   - ${team}`);
  }
}

// Update conference names
console.log('');
console.log('🏆 Updating conference names...');

const gameAttributes = await idb.cache.gameAttributes.getAll();
let confUpdated = 0;
let divUpdated = 0;

for (const attr of gameAttributes) {
  if (attr.key === 'confs') {
    for (const conf of attr.value) {
      if (conferenceMapping[conf.name]) {
        const oldName = conf.name;
        conf.name = conferenceMapping[conf.name];
        console.log(`  ${oldName} → ${conf.name}`);
        confUpdated++;
      }
    }
    await idb.cache.gameAttributes.put(attr);
  }
  if (attr.key === 'divs') {
    for (const div of attr.value) {
      if (conferenceMapping[div.name]) {
        div.name = conferenceMapping[div.name];
        divUpdated++;
      }
    }
    await idb.cache.gameAttributes.put(attr);
  }
}

console.log('');
console.log(`✅ Updated ${confUpdated} conferences and ${divUpdated} divisions`);
console.log('');
console.log('========================================================================');
console.log('🎉 COMPLETE! All teams and conferences updated to real NCAA names!');
console.log('========================================================================');
console.log('');
console.log('📋 NEXT STEPS:');
console.log('1. Refresh the page (Ctrl+R or Cmd+R)');
console.log('2. Enjoy your game with real NCAA team names!');
console.log('');
console.log('NOTE: This only affects the current league in your browser.');
console.log('      New leagues will still use the generic names.');
console.log('========================================================================');
