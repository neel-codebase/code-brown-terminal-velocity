/**
 * @file maps_v2.js
 * @version 2.1.0
 * @description Isolated ES Module containing:
 *   0. TUTORIAL_LEVEL_V2 (Gate 00: 30s Interactive Onboarding & Playable Ad Demo)
 *   1..5. LEVELS_V2 (3.5x Expanded 4-Wing Multi-Concourse Airport Layouts)
 */

export const TUTORIAL_LEVEL_V2 = {
  id: "level_00_tutorial",
  num: 0,
  isTutorial: true,
  iata: "GATE 00",
  name: "Express Layover (30s Interactive Tutorial)",
  sub: "Learn to walk past security, clench through cramps, and lure the janitor in 30 seconds!",
  parSec: 75,
  pathMeters: 42,
  crampInterval: 18,
  spawnBark: "spawn_tutorial",
  world: { w: 28, h: 36 },
  spawn: { x: 14.0, y: 31.5 },
  secLineY: 22.0,
  restroomWingY: 10.0,
  waterfallZone: null,
  shuttleGateY: null,
  bidetBoss: false,
  wings: [
    { id: "T1", yMin: 24, yMax: 36, label: "STEP 1: MOVE UP THE CONCOURSE", dirArrow: "⬆ WALK NORTH TO START" },
    { id: "T2", yMin: 16, yMax: 24, label: "STEP 2: WALK CALMLY PAST SECURITY", dirArrow: "⬆ STEALTH WALK OR [X] POKER FACE" },
    { id: "T3", yMin: 10, yMax: 16, label: "STEP 3 & 4: CLENCH & LURE JANITOR", dirArrow: "⬆ KICK TRASH BIN OR GRAB MINTS" },
    { id: "T4", yMin: 0,  yMax: 10, label: "STEP 5: REACH THE OPEN THRONE!", dirArrow: "🚽 CHECK THE STALL DOORS!" }
  ],
  palms: [
    { x: 4.0, y: 32.0 }, { x: 24.0, y: 32.0 }, { x: 4.0, y: 13.0 }, { x: 24.0, y: 13.0 }
  ],
  walls: [
    { x: 0, y: 0, w: 28, h: 1.2, label: "" },
    { x: 0, y: 34.8, w: 28, h: 1.2, label: "" },
    { x: 0, y: 0, w: 1.2, h: 36, label: "" },
    { x: 26.8, y: 0, w: 1.2, h: 36, label: "" },
    // Gentle side guide rails
    { x: 1.2, y: 22.0, w: 6.8, h: 1.4, label: "SECURITY STANCHION", isStanchion: true },
    { x: 20.0, y: 22.0, w: 6.8, h: 1.4, label: "X-RAY ARCH", isXray: true },
    // Restroom Sanctuary Partition (y = 9.5, doorway at x = 11.2..16.8)
    { x: 1.2, y: 9.2, w: 10.0, h: 1.4, label: "RESTROOM WALL" },
    { x: 16.8, y: 9.2, w: 10.0, h: 1.4, label: "RESTROOM WALL" }
  ],
  wetZones: [
    { x: 4.0, y: 26.0, w: 4.5, h: 3.2, label: "WET PUDDLE" }
  ],
  walkways: [],
  crowds: [],
  props: [
    { id: "p_tut_shoes", type: "footwear", x: 6.2, y: 30.5, r: 2.1, used: false, label: "🩴 FREE GRIP FLIP-FLOPS" },
    { id: "p_tut_mints", type: "bribe", x: 7.5, y: 13.5, r: 2.2, used: false, label: "🍬 SPEARMINT TIN (BRIBE)" },
    { id: "p_tut_bin", type: "distract", target: "j_mop_tut", x: 20.5, y: 13.0, r: 2.3, used: false, label: "🗑️ KICK TRASH BIN (LURE JANITOR)" }
  ],
  hazards: [
    {
      id: "j_mop_tut",
      x: 14.0, y: 9.9, w: 5.4, h: 1.8,
      homeX: 14.0, homeY: 9.9,
      lureX: 20.5, lureY: 13.2,
      cleared: false,
      label: "🚧 JANITOR MOP CART"
    }
  ],
  guards: [
    {
      id: "g_tut_1",
      x: 10.0, y: 20.0,
      ax: 6.0, ay: 20.0, bx: 22.0, by: 20.0,
      spd: 1.8, range: 6.8, fovDeg: 50,
      angle: 0, dir: 1, label: "SLEEPY GATE GUARD"
    }
  ],
  stalls: [
    { id: "s_tut_1", x: 7.5,  y: 2.4, w: 4.6, h: 3.0, open: false, inspected: false, label: "STALL #1" },
    { id: "s_tut_2", x: 15.9, y: 2.4, w: 4.6, h: 3.0, open: true,  inspected: false, label: "STALL #2" }
  ]
};

export const LEVELS_V2 = [
  // ===========================================================================
  // LEVEL 1: GOA DABOLIM INTERNATIONAL AIRPORT (GOI) — 48m x 62m (165m S-Curve)
  // ===========================================================================
  {
    id: "level_01_goi",
    num: 1,
    iata: "GOI",
    name: "Goa Dabolim International Airport",
    sub: "Goa Dabolim • Dodge surfboard tourists, slip past the frisk line, and bribe the janitor before boarding.",
    parSec: 68,
    pathMeters: 165,
    crampInterval: 15,
    spawnBark: "spawn_goi",
    world: { w: 48, h: 62 },
    spawn: { x: 6.5, y: 56.5 },
    secLineY: 36.0,
    restroomWingY: 11.5,
    waterfallZone: null,
    shuttleGateY: null,
    bidetBoss: false,
    wings: [
      { id: "W1", yMin: 46, yMax: 62, label: "WING 1: CURBSIDE & CHECK-IN HALL", dirArrow: "EAST TO SECURITY ➔" },
      { id: "W2", yMin: 31, yMax: 46, label: "WING 2: CISF SECURITY SERPENTINE", dirArrow: "⬅ WEST TO BAZAAR" },
      { id: "W3", yMin: 15, yMax: 31, label: "WING 3: DEPARTURE SPICE BAZAAR", dirArrow: "EAST TO RESTROOMS ➔" },
      { id: "W4", yMin: 0,  yMax: 15, label: "WING 4: RESTROOM SANCTUARY WING", dirArrow: "⬅ 🚽 SANCTUARY ENTRANCE" }
    ],
    palms: [
      { x: 4.2, y: 59.0 }, { x: 24.0, y: 59.0 }, { x: 44.0, y: 59.0 },
      { x: 5.0, y: 28.0 }, { x: 43.0, y: 28.0 }, { x: 14.0, y: 12.8 }, { x: 34.0, y: 12.8 }
    ],
    walls: [
      // Perimeter Bounds (48m x 62m)
      { x: 0, y: 0, w: 48, h: 1.2, label: "" },
      { x: 0, y: 60.8, w: 48, h: 1.2, label: "" },
      { x: 0, y: 0, w: 1.2, h: 62, label: "" },
      { x: 46.8, y: 0, w: 1.2, h: 62, label: "" },

      // Wing 1 -> Wing 2 Divider (y = 46, East Passage open at x = 39..46.8)
      { x: 1.2, y: 45.4, w: 37.8, h: 1.6, label: "CHECK-IN CONVEYOR DIVIDER (PASS EAST ➔)" },
      // Wing 1 Check-In Island Kiosks (creating serpentine baggage weave)
      { x: 11.5, y: 51.5, w: 7.5, h: 2.6, label: "GOA CHARTER DESK A", isKiosk: true },
      { x: 25.0, y: 53.5, w: 8.0, h: 2.6, label: "SURFBOARD OVERSIZE DROP", isKiosk: true },

      // Wing 2 -> Wing 3 Divider (y = 31, West Passage open at x = 1.2..9.0)
      { x: 9.0, y: 30.4, w: 37.8, h: 1.6, label: "CISF CHECKPOINT BARRIER (PASS WEST ⬅)" },
      // Wing 2 Stanchion & X-Ray Funnel (Choke point at x = 21..27, y = 36..41)
      { x: 9.0, y: 36.8, w: 12.0, h: 1.6, label: "VELVET STANCHION QUEUE", isStanchion: true },
      { x: 27.5, y: 36.8, w: 12.0, h: 1.6, label: "X-RAY TRAY CONVEYOR", isXray: true },

      // Wing 3 -> Wing 4 Divider (y = 15.2, East Turnstile Passage open at x = 39..46.8)
      { x: 1.2, y: 14.8, w: 37.8, h: 1.6, label: "GATE B12 CONCOURSE WALL (PASS EAST ➔)" },
      // Wing 3 Spice Bazaar & Duty-Free Kiosks
      { x: 13.0, y: 21.5, w: 8.5, h: 2.8, label: "CASHEW & FENI DUTY-FREE", isKiosk: true },
      { x: 28.0, y: 20.5, w: 7.5, h: 2.8, label: "GOAN SPICE & CHAI STALL", isKiosk: true },

      // Wing 4 Sealed Restroom Sanctuary Partition (y = 9.5, doorway at x = 21.5..26.5)
      { x: 1.2, y: 9.2, w: 20.3, h: 1.5, label: "RESTROOM SANCTUARY WALL" },
      { x: 26.5, y: 9.2, w: 20.3, h: 1.5, label: "RESTROOM SANCTUARY WALL" }
    ],
    wetZones: [
      { x: 17.5, y: 48.0, w: 7.0, h: 4.2, label: "WET TILE PUDDLE" },
      { x: 21.5, y: 17.0, w: 6.5, h: 3.8, label: "FRESHLY MOPPED CONCOURSE" }
    ],
    walkways: [
      { x: 12.0, y: 47.0, w: 18.0, h: 2.6, vx: 2.1, vy: 0, label: "CHECK-IN WALKWAY ➔" }
    ],
    crowds: [
      { x: 16.0, y: 56.5, ax: 8.0, ay: 56.5, bx: 36.0, by: 56.5, spd: 2.3, r: 0.95, label: "SURFBOARD TOURISTS" },
      { x: 32.0, y: 41.5, ax: 12.0, ay: 41.5, bx: 42.0, by: 41.5, spd: 2.1, r: 0.90, label: "CHARTER QUEUE" },
      { x: 22.0, y: 26.5, ax: 8.0, ay: 26.5, bx: 38.0, by: 26.5, spd: 2.5, r: 0.95, label: "SPICE BAZAAR SHOPPERS" }
    ],
    props: [
      { id: "p_news_goi", type: "cover", x: 9.5, y: 54.0, r: 1.8, used: false, label: "📰 NEWSPAPER RACK (HIDE)" },
      { id: "p_flipflops", type: "footwear", x: 35.5, y: 56.5, r: 1.8, used: false, label: "🩴 RUBBER FLIP-FLOPS" },
      { id: "p_vip_goi", type: "tsa_pass", x: 43.0, y: 42.0, r: 1.8, used: false, label: "🎫 VIP FAST-TRACK PASS" },
      { id: "p_frisk_goi", type: "security_frisk", x: 24.2, y: 37.5, r: 2.8, used: false, label: "🧤 CISF FRISK SCANNER" },
      { id: "p_pretzel_goi", type: "spicy_food", x: 10.5, y: 25.0, r: 1.8, used: false, label: "🌶️ VINDALOO SAMOSA (+SPD/-8s)" },
      { id: "p_mints_goi", type: "bribe", x: 31.5, y: 25.0, r: 1.8, used: false, label: "🍬 SPEARMINT TIN (BRIBE)" },
      { id: "p_clip_goi", type: "intel_clipboard", x: 42.5, y: 20.0, r: 1.8, used: false, label: "📋 JANITOR CLIPBOARD (MAP)" },
      { id: "p_bin_goi", type: "distract", target: "j_mop_goi", x: 35.0, y: 12.2, r: 2.0, used: false, label: "🗑️ TOPPLE TRASH BIN (LURE)" }
    ],
    hazards: [
      {
        id: "j_mop_goi",
        x: 24.0, y: 9.9, w: 5.4, h: 1.9,
        homeX: 24.0, homeY: 9.9,
        lureX: 35.0, lureY: 12.4,
        cleared: false,
        label: "🚧 MOP CART BARRICADE (WING SEALED)"
      }
    ],
    guards: [
      {
        id: "g_goi_1",
        x: 24.0, y: 49.5,
        ax: 10.0, ay: 49.5, bx: 38.0, by: 49.5,
        spd: 2.2, range: 8.8, fovDeg: 58,
        angle: 0, dir: 1, label: "CISF CONCOURSE PATROL"
      },
      {
        id: "g_goi_2",
        x: 18.0, y: 34.0,
        ax: 8.0, ay: 34.0, bx: 34.0, by: 34.0,
        spd: 2.4, range: 9.0, fovDeg: 60,
        angle: 0, dir: 1, label: "CHECKPOINT INSPECTOR"
      },
      {
        id: "g_goi_3",
        x: 24.0, y: 18.2,
        ax: 10.0, ay: 18.2, bx: 38.0, by: 18.2,
        spd: 2.5, range: 9.2, fovDeg: 60,
        angle: Math.PI, dir: -1, label: "GATE B12 SUPERVISOR"
      }
    ],
    stalls: [
      { id: "s1", x: 6.5,  y: 2.4, w: 4.2, h: 3.0, open: false, inspected: false, label: "STALL #1" },
      { id: "s2", x: 14.5, y: 2.4, w: 4.2, h: 3.0, open: false, inspected: false, label: "STALL #2" },
      { id: "s3", x: 22.5, y: 2.4, w: 4.2, h: 3.0, open: false, inspected: false, label: "STALL #3" },
      { id: "s4", x: 30.5, y: 2.4, w: 4.2, h: 3.0, open: true,  inspected: false, label: "STALL #4" },
      { id: "s5", x: 38.5, y: 2.4, w: 4.2, h: 3.0, open: false, inspected: false, label: "STALL #5" }
    ]
  },

  // ===========================================================================
  // LEVEL 2: NEW YORK JFK TERMINAL 4 — 54m x 70m (190m Concourse A/B Loop)
  // ===========================================================================
  {
    id: "level_02_jfk",
    num: 2,
    iata: "JFK",
    name: "New York JFK International (Terminal 4)",
    sub: "New York JFK T4 • Outsmart overlapping Segway patrols, clear two mop barricades, and survive the Hudson pretzel rush.",
    parSec: 75,
    pathMeters: 190,
    crampInterval: 14,
    spawnBark: "spawn_jfk",
    world: { w: 54, h: 70 },
    spawn: { x: 7.0, y: 64.0 },
    secLineY: 42.0,
    restroomWingY: 12.5,
    waterfallZone: null,
    shuttleGateY: null,
    bidetBoss: false,
    wings: [
      { id: "W1", yMin: 52, yMax: 70, label: "WING 1: T4 DEPARTURES CURBSIDE", dirArrow: "EAST TO TSA QUEUE ➔" },
      { id: "W2", yMin: 35, yMax: 52, label: "WING 2: TSA PRECHECK & STANCHION MAZE", dirArrow: "⬅ WEST TO CONCOURSE A" },
      { id: "W3", yMin: 17, yMax: 35, label: "WING 3: CONCOURSE A/B RETAIL LOOP", dirArrow: "EAST TO CONCOURSE B ➔" },
      { id: "W4", yMin: 0,  yMax: 17, label: "WING 4: T4 RESTROOM SANCTUARY", dirArrow: "⬅ 🚽 LAVATORY CORRIDOR" }
    ],
    palms: [
      { x: 5.0, y: 66.5 }, { x: 48.0, y: 66.5 }, { x: 16.0, y: 14.0 }, { x: 38.0, y: 14.0 }
    ],
    walls: [
      { x: 0, y: 0, w: 54, h: 1.2, label: "" },
      { x: 0, y: 68.8, w: 54, h: 1.2, label: "" },
      { x: 0, y: 0, w: 1.2, h: 70, label: "" },
      { x: 52.8, y: 0, w: 1.2, h: 70, label: "" },

      // Wing 1 -> Wing 2 Divider (y = 52, East passage x = 44..52.8)
      { x: 1.2, y: 51.4, w: 42.8, h: 1.6, label: "T4 TICKETING BARRIER (PASS EAST ➔)" },
      { x: 13.0, y: 58.0, w: 9.0, h: 2.8, label: "DELTA SKY PRIORITY DESK", isKiosk: true },
      { x: 30.0, y: 60.0, w: 9.0, h: 2.8, label: "HUDSON NEWS & BAGGAGE", isKiosk: true },

      // Wing 2 -> Wing 3 Divider (y = 35, West passage x = 1.2..10.0)
      { x: 10.0, y: 34.4, w: 42.8, h: 1.6, label: "TSA FULL-BODY SCANNER WALL (PASS WEST ⬅)" },
      { x: 10.0, y: 42.0, w: 14.0, h: 1.6, label: "TSA STANCHION LABYRINTH", isStanchion: true },
      { x: 31.0, y: 42.0, w: 14.0, h: 1.6, label: "MILLIMETER WAVE ARCH", isXray: true },

      // Wing 3 -> Wing 4 Divider (y = 17, East passage x = 44..52.8, guarded by Barricade #1!)
      { x: 1.2, y: 16.6, w: 42.8, h: 1.6, label: "CONCOURSE B BRIDGE WALL (PASS EAST ➔)" },
      { x: 14.0, y: 24.5, w: 9.5, h: 2.8, label: "FIFTH AVE LUXURY BOUTIQUE", isKiosk: true },
      { x: 31.0, y: 23.5, w: 9.5, h: 2.8, label: "BROOKLYN ARTISAN COFFEE", isKiosk: true },

      // Wing 4 Sealed Restroom Sanctuary Partition (y = 10.0, doorway at x = 24.0..29.5)
      { x: 1.2, y: 9.6, w: 22.8, h: 1.5, label: "RESTROOM SANCTUARY WALL" },
      { x: 29.5, y: 9.6, w: 23.3, h: 1.5, label: "RESTROOM SANCTUARY WALL" }
    ],
    wetZones: [
      { x: 21.0, y: 54.0, w: 7.5, h: 4.0, label: "SLUSHY TERMINAL PUDDLE" },
      { x: 22.0, y: 19.0, w: 8.0, h: 4.0, label: "FRESHLY WAXED CONCOURSE" }
    ],
    walkways: [
      { x: 14.0, y: 47.0, w: 22.0, h: 2.6, vx: -2.3, vy: 0, label: "⬅ EXPRESS TSA WALKWAY" },
      { x: 14.0, y: 29.5, w: 24.0, h: 2.6, vx: 2.5, vy: 0, label: "CONCOURSE B WALKWAY ➔" }
    ],
    crowds: [
      { x: 20.0, y: 64.0, ax: 9.0, ay: 64.0, bx: 44.0, by: 64.0, spd: 2.6, r: 0.95, label: "RED-EYE COMMUTERS" },
      { x: 28.0, y: 38.5, ax: 12.0, ay: 38.5, bx: 45.0, by: 38.5, spd: 2.4, r: 0.95, label: "TSA LINE CROWD" },
      { x: 26.0, y: 20.5, ax: 10.0, ay: 20.5, bx: 42.0, by: 20.5, spd: 2.8, r: 0.95, label: "DUTY-FREE TROLLEY" }
    ],
    props: [
      { id: "p_shoes_jfk", type: "footwear", x: 40.5, y: 64.0, r: 1.8, used: false, label: "🩴 GRIP SLIPPERS" },
      { id: "p_clear_jfk", type: "tsa_pass", x: 48.0, y: 47.5, r: 1.8, used: false, label: "🎫 CLEAR VIP BIOMETRIC PASS" },
      { id: "p_tsa_jfk", type: "security_frisk", x: 27.5, y: 42.5, r: 3.0, used: false, label: "🧤 TSA PAT-DOWN MAT" },
      { id: "p_pretzel_jfk", type: "spicy_food", x: 11.0, y: 28.0, r: 1.8, used: false, label: "🌶️ JALAPEÑO PRETZEL (+28% SPD/-8s)" },
      { id: "p_coffee_jfk", type: "distract", target: "j_mop_jfk_bridge", x: 36.5, y: 27.5, r: 2.0, used: false, label: "☕ SPILL ESPRESSO URN (UNSEAL BRIDGE)" },
      { id: "p_mints_jfk", type: "bribe", x: 18.0, y: 20.5, r: 1.8, used: false, label: "🍬 WINTERGREEN MINTS (BRIBE)" },
      { id: "p_clip_jfk", type: "intel_clipboard", x: 48.0, y: 22.0, r: 1.8, used: false, label: "📋 CUSTODIAN LOGBOOK" },
      { id: "p_kiosk_jfk", type: "distract", target: "j_mop_jfk_main", x: 39.0, y: 13.0, r: 2.0, used: false, label: "🎟️ DUMP COUPON KIOSK (LURE JANITOR)" }
    ],
    hazards: [
      // Dual Barricades! Bridge Barricade #1 + Restroom Sanctuary Barricade #2
      {
        id: "j_mop_jfk_bridge",
        x: 48.2, y: 17.3, w: 6.2, h: 1.9,
        homeX: 48.2, homeY: 17.3,
        lureX: 36.5, lureY: 26.5,
        cleared: false,
        label: "🚧 CONCOURSE B MOP CART #1"
      },
      {
        id: "j_mop_jfk_main",
        x: 26.8, y: 10.3, w: 5.8, h: 1.9,
        homeX: 26.8, homeY: 10.3,
        lureX: 39.0, lureY: 13.2,
        cleared: false,
        label: "🚧 RESTROOM MOP BARRICADE #2"
      }
    ],
    guards: [
      {
        id: "g_jfk_1",
        x: 26.0, y: 55.0,
        ax: 10.0, ay: 55.0, bx: 44.0, by: 55.0,
        spd: 2.8, range: 9.4, fovDeg: 62,
        angle: 0, dir: 1, isSegway: true, label: "SEGWAY PATROL ALPHA"
      },
      {
        id: "g_jfk_2",
        x: 25.0, y: 38.0,
        ax: 10.0, ay: 38.0, bx: 44.0, by: 38.0,
        spd: 2.5, range: 9.2, fovDeg: 60,
        angle: Math.PI, dir: -1, isSegway: false, label: "TSA SUPERVISOR"
      },
      {
        id: "g_jfk_3",
        x: 28.0, y: 21.5,
        ax: 10.0, ay: 21.5, bx: 43.0, by: 21.5,
        spd: 3.1, range: 9.6, fovDeg: 64,
        angle: 0, dir: 1, isSegway: true, label: "SEGWAY PATROL BRAVO"
      }
    ],
    stalls: [
      { id: "s1", x: 7.5,  y: 2.5, w: 4.3, h: 3.0, open: false, inspected: false, label: "STALL #1" },
      { id: "s2", x: 16.5, y: 2.5, w: 4.3, h: 3.0, open: true,  inspected: false, label: "STALL #2" },
      { id: "s3", x: 25.5, y: 2.5, w: 4.3, h: 3.0, open: false, inspected: false, label: "STALL #3" },
      { id: "s4", x: 34.5, y: 2.5, w: 4.3, h: 3.0, open: false, inspected: false, label: "STALL #4" },
      { id: "s5", x: 43.5, y: 2.5, w: 4.3, h: 3.0, open: false, inspected: false, label: "STALL #5" }
    ]
  },

  // ===========================================================================
  // LEVEL 3: LONDON HEATHROW TERMINAL 5 (LHR) — 56m x 74m (205m 3-Concourse)
  // ===========================================================================
  {
    id: "level_03_lhr",
    num: 3,
    iata: "LHR",
    name: "London Heathrow Airport (Terminal 5)",
    sub: "London Heathrow T5 • Ride the forward travelator, time the underground shuttle doors, and outfox the fickle Loo attendant.",
    parSec: 82,
    pathMeters: 205,
    crampInterval: 13,
    spawnBark: "spawn_lhr",
    world: { w: 56, h: 74 },
    spawn: { x: 7.0, y: 68.0 },
    secLineY: 45.0,
    restroomWingY: 13.0,
    waterfallZone: null,
    shuttleGateY: 36.8,
    bidetBoss: false,
    fickleCustodian: true,
    wings: [
      { id: "W1", yMin: 55, yMax: 74, label: "WING 1: T5A DEPARTURES & BAG DROP", dirArrow: "EAST TO LIQUID CHECK ➔" },
      { id: "W2", yMin: 37, yMax: 55, label: "WING 2: 100ML LIQUID CHECK & TRANSIT SHUTTLE", dirArrow: "⬅ WEST TO SHUTTLE PLATFORM" },
      { id: "W3", yMin: 18, yMax: 37, label: "WING 3: T5C REVERSING TRAVELATORS", dirArrow: "EAST TO BRITISH LOO ➔" },
      { id: "W4", yMin: 0,  yMax: 18, label: "WING 4: THE GREAT BRITISH LOO (6 STALLS)", dirArrow: "⬅ 🚽 LOO ENTRANCE" }
    ],
    palms: [
      { x: 6.0, y: 70.0 }, { x: 50.0, y: 70.0 }, { x: 14.0, y: 15.0 }, { x: 42.0, y: 15.0 }
    ],
    walls: [
      { x: 0, y: 0, w: 56, h: 1.2, label: "" },
      { x: 0, y: 72.8, w: 56, h: 1.2, label: "" },
      { x: 0, y: 0, w: 1.2, h: 74, label: "" },
      { x: 54.8, y: 0, w: 1.2, h: 74, label: "" },

      // Wing 1 -> Wing 2 Divider (y = 55, East passage x = 46..54.8)
      { x: 1.2, y: 54.4, w: 44.8, h: 1.6, label: "OYSTER & BAG DROP BARRIER (PASS EAST ➔)" },
      { x: 14.0, y: 61.5, w: 10.0, h: 2.8, label: "HARRODS TEA CONCESSION", isKiosk: true },
      { x: 32.0, y: 63.0, w: 10.0, h: 2.8, label: "HEATHROW EXPRESS KIOSK", isKiosk: true },

      // Wing 2 -> Wing 3 Divider (y = 36.8, West Timed Shuttle Gate at x = 4.0..12.0!)
      { x: 12.0, y: 36.2, w: 42.8, h: 1.6, label: "UNDERGROUND SHUTTLE TUNNEL WALL" },
      { x: 11.0, y: 45.0, w: 14.5, h: 1.6, label: "100ML PLASTIC BAGGIE QUEUE", isStanchion: true },
      { x: 32.0, y: 45.0, w: 14.5, h: 1.6, label: "UK BORDER X-RAY ARCH", isXray: true },

      // Wing 3 -> Wing 4 Divider (y = 18, East passage x = 46..54.8)
      { x: 1.2, y: 17.6, w: 44.8, h: 1.6, label: "CONCOURSE C GATE WALL (PASS EAST ➔)" },
      { x: 22.0, y: 25.5, w: 11.0, h: 2.6, label: "WHSMITH & PUB COUNTER", isKiosk: true },

      // Wing 4 Sealed British Loo Partition (y = 10.2, doorway at x = 25.0..31.0)
      { x: 1.2, y: 9.8, w: 23.8, h: 1.5, label: "BRITISH LOO SANCTUARY WALL" },
      { x: 31.0, y: 9.8, w: 23.8, h: 1.5, label: "BRITISH LOO SANCTUARY WALL" }
    ],
    wetZones: [
      { x: 24.0, y: 57.5, w: 8.0, h: 4.0, label: "SPILLED EARL GREY PUDDLE" },
      { x: 36.0, y: 20.5, w: 7.5, h: 4.0, label: "RAINY UMBRELLA DRIP ZONE" }
    ],
    walkways: [
      // Dual Reversing Travelators in Wing 3! Top boosts East (+2.6), Bottom pushes West (-2.4)
      { x: 10.0, y: 21.0, w: 32.0, h: 2.8, vx: 2.6,  vy: 0, label: "FORWARD TRAVELATOR (+2.6 m/s ➔)" },
      { x: 10.0, y: 30.5, w: 32.0, h: 2.8, vx: -2.4, vy: 0, label: "⬅ REVERSE TRAVELATOR (-2.4 m/s)" }
    ],
    crowds: [
      { x: 22.0, y: 68.0, ax: 10.0, ay: 68.0, bx: 46.0, by: 68.0, spd: 2.6, r: 0.95, label: "UMBRELLA COMMUTERS" },
      { x: 28.0, y: 41.0, ax: 12.0, ay: 41.0, bx: 46.0, by: 41.0, spd: 2.5, r: 0.95, label: "SHUTTLE QUEUE" },
      { x: 26.0, y: 14.0, ax: 10.0, ay: 14.0, bx: 44.0, by: 14.0, spd: 2.4, r: 0.90, label: "LOO QUEUE REGULARS" }
    ],
    props: [
      { id: "p_shoes_lhr", type: "footwear", x: 43.0, y: 68.0, r: 1.8, used: false, label: "🩴 WELLINGTON GRIP SOLES" },
      { id: "p_pass_lhr", type: "tsa_pass", x: 50.0, y: 50.0, r: 1.8, used: false, label: "🎫 FAST-TRACK GOLD CARD" },
      { id: "p_frisk_lhr", type: "security_frisk", x: 28.8, y: 45.5, r: 3.0, used: false, label: "🧤 100ML LIQUID INSPECTION" },
      { id: "p_pie_lhr", type: "spicy_food", x: 16.0, y: 26.5, r: 1.8, used: false, label: "🌶️ HOT VINDALOO PASTY (+SPD/-8s)" },
      { id: "p_mints_lhr", type: "bribe", x: 36.0, y: 26.5, r: 1.8, used: false, label: "🍬 PEPPERMINT LOZENGES (BRIBE)" },
      { id: "p_clip_lhr", type: "intel_clipboard", x: 50.0, y: 23.0, r: 1.8, used: false, label: "📋 LOO MAINTENANCE LOG" },
      { id: "p_alarm_lhr", type: "distract", target: "j_mop_lhr", x: 41.0, y: 13.5, r: 2.0, used: false, label: "🚨 RING TEA TROLLEY BELL (LURE)" }
    ],
    hazards: [
      {
        id: "j_mop_lhr",
        x: 28.0, y: 10.5, w: 6.2, h: 1.9,
        homeX: 28.0, homeY: 10.5,
        lureX: 41.0, lureY: 13.8,
        cleared: false,
        label: "🚧 LOO CUSTODIAN BARRICADE"
      }
    ],
    guards: [
      {
        id: "g_lhr_1",
        x: 28.0, y: 58.5,
        ax: 10.0, ay: 58.5, bx: 46.0, by: 58.5,
        spd: 2.7, range: 9.5, fovDeg: 62,
        angle: 0, dir: 1, label: "BORDER FORCE PATROL"
      },
      {
        id: "g_lhr_2",
        x: 26.0, y: 40.5,
        ax: 12.0, ay: 40.5, bx: 46.0, by: 40.5,
        spd: 2.8, range: 9.5, fovDeg: 62,
        angle: Math.PI, dir: -1, isSegway: true, label: "T5 SEGWAY OFFICER"
      },
      {
        id: "g_lhr_3",
        x: 28.0, y: 13.5,
        ax: 12.0, ay: 13.5, bx: 42.0, by: 13.5,
        spd: 2.5, range: 8.8, fovDeg: 60,
        angle: 0, dir: 1, label: "HEAD LOO ATTENDANT"
      }
    ],
    stalls: [
      { id: "s1", x: 5.5,  y: 2.5, w: 4.0, h: 3.0, open: false, inspected: false, label: "LOO #1" },
      { id: "s2", x: 13.5, y: 2.5, w: 4.0, h: 3.0, open: false, inspected: false, label: "LOO #2" },
      { id: "s3", x: 21.5, y: 2.5, w: 4.0, h: 3.0, open: false, inspected: false, label: "LOO #3" },
      { id: "s4", x: 29.5, y: 2.5, w: 4.0, h: 3.0, open: false, inspected: false, label: "LOO #4" },
      { id: "s5", x: 37.5, y: 2.5, w: 4.0, h: 3.0, open: true,  inspected: false, label: "LOO #5" },
      { id: "s6", x: 45.5, y: 2.5, w: 4.0, h: 3.0, open: false, inspected: false, label: "LOO #6" }
    ]
  },

  // ===========================================================================
  // LEVEL 4: SINGAPORE CHANGI JEWEL (SIN) — 60m x 78m (220m Circular Vortex Ring)
  // ===========================================================================
  {
    id: "level_04_sin",
    num: 4,
    iata: "SIN",
    name: "Singapore Changi Airport (Jewel Vortex)",
    sub: "Singapore Changi Jewel • Circle the roaring Rain Vortex (1.5x cramp speed!), dodge three Robo-Scrubbers, and unseal the Sanctuary.",
    parSec: 86,
    pathMeters: 220,
    crampInterval: 13,
    spawnBark: "spawn_sin",
    world: { w: 60, h: 78 },
    spawn: { x: 8.0, y: 72.0 },
    secLineY: 49.0,
    restroomWingY: 13.5,
    waterfallZone: { x: 15.0, y: 20.0, w: 30.0, h: 16.0, mult: 1.5, label: "🌊 HSBC RAIN VORTEX (1.5x CRAMP ZONE)" },
    shuttleGateY: null,
    bidetBoss: false,
    wings: [
      { id: "W1", yMin: 58, yMax: 78, label: "WING 1: JEWEL FOREST VALLEY ARRIVALS", dirArrow: "EAST TO IMMIGRATION ➔" },
      { id: "W2", yMin: 39, yMax: 58, label: "WING 2: AUTO-GATE & BIOMETRIC SCREENING", dirArrow: "⬅ WEST TO VORTEX DECK" },
      { id: "W3", yMin: 18, yMax: 39, label: "WING 3: RAIN VORTEX SKYBRIDGE (1.5x CRAMPS)", dirArrow: "EAST TO SANCTUARY ➔" },
      { id: "W4", yMin: 0,  yMax: 18, label: "WING 4: CHANGI ORCHID SANCTUARY LOUNGE", dirArrow: "⬅ 🚽 VIP SUITES" }
    ],
    palms: [
      { x: 6.0, y: 74.0 }, { x: 30.0, y: 74.0 }, { x: 54.0, y: 74.0 },
      { x: 12.0, y: 34.0 }, { x: 48.0, y: 34.0 }, { x: 12.0, y: 22.0 }, { x: 48.0, y: 22.0 },
      { x: 16.0, y: 15.0 }, { x: 44.0, y: 15.0 }
    ],
    walls: [
      { x: 0, y: 0, w: 60, h: 1.2, label: "" },
      { x: 0, y: 76.8, w: 60, h: 1.2, label: "" },
      { x: 0, y: 0, w: 1.2, h: 78, label: "" },
      { x: 58.8, y: 0, w: 1.2, h: 78, label: "" },

      // Wing 1 -> Wing 2 Divider (y = 58, East passage x = 49..58.8)
      { x: 1.2, y: 57.4, w: 47.8, h: 1.6, label: "FOREST TERRACE WALL (PASS EAST ➔)" },
      { x: 15.0, y: 64.5, w: 10.5, h: 2.8, label: "PANDAN CHIFFON CAFE", isKiosk: true },
      { x: 35.0, y: 66.5, w: 10.5, h: 2.8, label: "JEWEL CONCIERGE DESK", isKiosk: true },

      // Wing 2 -> Wing 3 Divider (y = 39, West passage x = 1.2..11.0)
      { x: 11.0, y: 38.4, w: 47.8, h: 1.6, label: "SKYBRIDGE GLASS BALUSTRADE (PASS WEST ⬅)" },
      { x: 12.0, y: 48.5, w: 15.5, h: 1.6, label: "BIOMETRIC STANCHION LANE", isStanchion: true },
      { x: 34.5, y: 48.5, w: 15.5, h: 1.6, label: "CHANGI X-RAY SCANNER", isXray: true },

      // Central Rain Vortex Core Obstacle inside Wing 3 (forcing curved path around it)
      { x: 25.0, y: 25.0, w: 10.0, h: 6.0, label: "🌊 VORTEX POOL BASIN", isKiosk: true },

      // Wing 3 -> Wing 4 Divider (y = 18, East passage x = 49..58.8)
      { x: 1.2, y: 17.6, w: 47.8, h: 1.6, label: "ORCHID LOUNGE PARTITION (PASS EAST ➔)" },

      // Wing 4 Sealed Sanctuary Partition (y = 10.2, doorway at x = 27.0..33.0)
      { x: 1.2, y: 9.8, w: 25.8, h: 1.5, label: "SANCTUARY LOUNGE WALL" },
      { x: 33.0, y: 9.8, w: 25.8, h: 1.5, label: "SANCTUARY LOUNGE WALL" }
    ],
    wetZones: [
      { x: 18.0, y: 32.0, w: 9.0, h: 3.8, label: "VORTEX MIST SPRAY ZONE" },
      { x: 33.0, y: 20.5, w: 9.0, h: 3.8, label: "ROBO-SCRUBBER FOAM TRAIL" }
    ],
    walkways: [
      { x: 14.0, y: 53.0, w: 28.0, h: 2.6, vx: -2.5, vy: 0, label: "⬅ SKYTRAIN LINK WALKWAY" }
    ],
    crowds: [
      { x: 24.0, y: 72.0, ax: 10.0, ay: 72.0, bx: 50.0, by: 72.0, spd: 2.7, r: 0.95, label: "SELFIE TOURIST GROUP" },
      { x: 30.0, y: 44.0, ax: 12.0, ay: 44.0, bx: 48.0, by: 44.0, spd: 2.6, r: 0.95, label: "TRANSIT TOURISTS" },
      { x: 30.0, y: 14.0, ax: 12.0, ay: 14.0, bx: 48.0, by: 14.0, spd: 2.5, r: 0.90, label: "LOUNGE GUESTS" }
    ],
    props: [
      { id: "p_shoes_sin", type: "footwear", x: 46.0, y: 72.0, r: 1.8, used: false, label: "🩴 ORCHID GRIP SANDALS" },
      { id: "p_pass_sin", type: "tsa_pass", x: 53.0, y: 53.0, r: 1.8, used: false, label: "🎫 CHANGI PRIORITY PASS" },
      { id: "p_frisk_sin", type: "security_frisk", x: 31.0, y: 49.0, r: 3.2, used: false, label: "🧤 SECURITY PAT-DOWN" },
      { id: "p_laksa_sin", type: "spicy_food", x: 10.0, y: 28.0, r: 1.8, used: false, label: "🌶️ SPICY LAKSA BOWL (+28% SPD/-8s)" },
      { id: "p_mints_sin", type: "bribe", x: 42.0, y: 34.0, r: 1.8, used: false, label: "🍬 JASMINE MINTS (BRIBE)" },
      { id: "p_clip_sin", type: "intel_clipboard", x: 53.0, y: 24.0, r: 1.8, used: false, label: "📋 SANCTUARY TABLET LOG" },
      { id: "p_sign_sin", type: "distract", target: "j_mop_sin", x: 44.0, y: 13.5, r: 2.0, used: false, label: "🪴 TOPPLE ORCHID DISPLAY (LURE)" }
    ],
    hazards: [
      {
        id: "j_mop_sin",
        x: 30.0, y: 10.5, w: 6.2, h: 1.9,
        homeX: 30.0, homeY: 10.5,
        lureX: 44.0, lureY: 13.8,
        cleared: false,
        label: "🚧 AUTO-MOP BARRICADE"
      }
    ],
    guards: [
      {
        id: "g_sin_1",
        x: 28.0, y: 61.0,
        ax: 10.0, ay: 61.0, bx: 50.0, by: 61.0,
        spd: 3.1, range: 9.2, fovDeg: 62,
        angle: 0, dir: 1, isRobo: true, label: "ROBO-SCRUBBER MK-I"
      },
      {
        id: "g_sin_2",
        x: 20.0, y: 35.0,
        ax: 8.0, ay: 35.0, bx: 50.0, by: 35.0,
        spd: 3.3, range: 9.4, fovDeg: 64,
        angle: Math.PI, dir: -1, isRobo: true, label: "ROBO-SCRUBBER MK-II"
      },
      {
        id: "g_sin_3",
        x: 36.0, y: 21.5,
        ax: 10.0, ay: 21.5, bx: 50.0, by: 21.5,
        spd: 3.4, range: 9.5, fovDeg: 65,
        angle: 0, dir: 1, isRobo: true, label: "ROBO-SCRUBBER MK-III"
      }
    ],
    stalls: [
      { id: "s1", x: 8.5,  y: 2.5, w: 4.4, h: 3.0, open: false, inspected: false, label: "SUITE #1" },
      { id: "s2", x: 18.5, y: 2.5, w: 4.4, h: 3.0, open: false, inspected: false, label: "SUITE #2" },
      { id: "s3", x: 28.5, y: 2.5, w: 4.4, h: 3.0, open: true,  inspected: false, label: "SUITE #3" },
      { id: "s4", x: 38.5, y: 2.5, w: 4.4, h: 3.0, open: false, inspected: false, label: "SUITE #4" },
      { id: "s5", x: 48.5, y: 2.5, w: 4.4, h: 3.0, open: false, inspected: false, label: "SUITE #5" }
    ]
  },

  // ===========================================================================
  // LEVEL 5: DUBAI (DXB T3) -> TOKYO HANEDA (HND T3) — 64m x 84m (240m Finale)
  // ===========================================================================
  {
    id: "level_05_dxb_hnd",
    num: 5,
    iata: "DXB➔HND",
    name: "Dubai Concourse A ➔ Tokyo Haneda Finale",
    sub: "Dubai T3 to Tokyo Haneda • Evade four Perfume Spritzers, board the People Mover train, and crack the 12-button Washlet Boss!",
    parSec: 90,
    pathMeters: 240,
    crampInterval: 12,
    spawnBark: "spawn_dxb",
    world: { w: 64, h: 84 },
    spawn: { x: 8.0, y: 78.0 },
    secLineY: 52.0,
    restroomWingY: 14.0,
    waterfallZone: null,
    shuttleGateY: 41.5,
    bidetBoss: true,
    wings: [
      { id: "W1", yMin: 62, yMax: 84, label: "ACT 1A (DXB): GOLD SOUK & PERFUME GAUNTLET", dirArrow: "EAST TO APM TRAIN ➔" },
      { id: "W2", yMin: 42, yMax: 62, label: "ACT 1B (DXB): CUSTOMS & PEOPLE MOVER TRAIN", dirArrow: "⬅ BOARD HANEDA EXPRESS" },
      { id: "W3", yMin: 19, yMax: 42, label: "ACT 2A (HND): TOKYO TRANSIT & VIP GALLERY", dirArrow: "EAST TO WASHLET WING ➔" },
      { id: "W4", yMin: 0,  yMax: 19, label: "ACT 2B (HND): WASHLET-9000 SANCTUARY (6 STALLS)", dirArrow: "⬅ 🚽 ROBO-THRONE BOSS" }
    ],
    palms: [
      { x: 6.0, y: 80.0 }, { x: 32.0, y: 80.0 }, { x: 58.0, y: 80.0 },
      { x: 14.0, y: 15.5 }, { x: 50.0, y: 15.5 }
    ],
    walls: [
      { x: 0, y: 0, w: 64, h: 1.2, label: "" },
      { x: 0, y: 82.8, w: 64, h: 1.2, label: "" },
      { x: 0, y: 0, w: 1.2, h: 84, label: "" },
      { x: 62.8, y: 0, w: 1.2, h: 84, label: "" },

      // Wing 1 -> Wing 2 Divider (y = 62, East passage x = 52..62.8)
      { x: 1.2, y: 61.4, w: 50.8, h: 1.6, label: "DXB GOLD SOUK ARCHWAY (PASS EAST ➔)" },
      { x: 15.0, y: 69.5, w: 11.0, h: 2.8, label: "OUD & BERGAMOT EMPORIUM", isKiosk: true },
      { x: 36.0, y: 71.0, w: 11.0, h: 2.8, label: "DUBAI DUTY-FREE BULLION", isKiosk: true },

      // Wing 2 -> Wing 3 Divider (y = 41.5, West APM Train Doors at x = 4.0..12.5)
      { x: 12.5, y: 41.0, w: 50.3, h: 1.6, label: "APM PEOPLE MOVER PLATFORM WALL" },
      { x: 13.0, y: 52.0, w: 16.5, h: 1.6, label: "INTERNATIONAL TRANSIT QUEUE", isStanchion: true },
      { x: 37.0, y: 52.0, w: 16.5, h: 1.6, label: "CUSTOMS X-RAY GATE", isXray: true },

      // Wing 3 -> Wing 4 Divider (y = 19, East passage x = 52..62.8)
      { x: 1.2, y: 18.6, w: 50.8, h: 1.6, label: "HANEDA CONCOURSE DIVIDER (PASS EAST ➔)" },
      { x: 16.0, y: 27.5, w: 11.5, h: 2.8, label: "TOKYO RAMEN & WASABI BAR", isKiosk: true },
      { x: 36.0, y: 26.5, w: 11.5, h: 2.8, label: "ELECTRONIC DUTY-FREE PLAZA", isKiosk: true },

      // Wing 4 Sealed Washlet Sanctuary Partition (y = 10.5, doorway at x = 29.0..35.0)
      { x: 1.2, y: 10.0, w: 27.8, h: 1.5, label: "WASHLET SANCTUARY WALL" },
      { x: 35.0, y: 10.0, w: 27.8, h: 1.5, label: "WASHLET SANCTUARY WALL" }
    ],
    wetZones: [
      { x: 24.0, y: 64.5, w: 8.5, h: 4.0, label: "POLISHED GOLD MARBLE PUDDLE" },
      { x: 24.0, y: 21.5, w: 8.5, h: 4.0, label: "SANITIZED HANEDA CORRIDOR" }
    ],
    walkways: [
      { x: 14.0, y: 56.5, w: 32.0, h: 2.6, vx: -2.6, vy: 0, label: "⬅ DXB APM EXPRESS WALKWAY" },
      { x: 14.0, y: 33.5, w: 32.0, h: 2.6, vx: 2.8,  vy: 0, label: "HANEDA HIGH-SPEED WALKWAY ➔" }
    ],
    crowds: [
      { x: 25.0, y: 78.0, ax: 10.0, ay: 78.0, bx: 54.0, by: 78.0, spd: 2.8, r: 0.95, label: "LUXURY SHOPPERS" },
      { x: 32.0, y: 46.5, ax: 12.0, ay: 46.5, bx: 52.0, by: 46.5, spd: 2.7, r: 0.95, label: "APM TRAIN PASSENGERS" },
      { x: 30.0, y: 14.8, ax: 12.0, ay: 14.8, bx: 50.0, by: 14.8, spd: 2.6, r: 0.95, label: "HANEDA BUSINESS TRAVELERS" }
    ],
    props: [
      { id: "p_shoes_dxb", type: "footwear", x: 49.0, y: 78.0, r: 1.8, used: false, label: "🩴 SILK GRIP SLIPPERS" },
      { id: "p_perf_1", type: "perfume_ambush", x: 13.0, y: 74.5, r: 2.4, used: false, label: "🌸 PERFUME SPRITZER #1" },
      { id: "p_perf_2", type: "perfume_ambush", x: 29.5, y: 67.5, r: 2.4, used: false, label: "🌸 PERFUME SPRITZER #2" },
      { id: "p_perf_3", type: "perfume_ambush", x: 43.0, y: 75.0, r: 2.4, used: false, label: "🌸 PERFUME SPRITZER #3" },
      { id: "p_perf_4", type: "perfume_ambush", x: 21.0, y: 48.0, r: 2.4, used: false, label: "🌸 PERFUME SPRITZER #4" },
      { id: "p_pass_dxb", type: "tsa_pass", x: 56.0, y: 56.0, r: 1.8, used: false, label: "🎫 EMIRATES FIRST-CLASS PASS" },
      { id: "p_frisk_dxb", type: "security_frisk", x: 33.2, y: 52.5, r: 3.2, used: false, label: "🧤 CUSTOMS PAT-DOWN" },
      { id: "p_wasabi_hnd", type: "spicy_food", x: 12.0, y: 29.0, r: 1.8, used: false, label: "🌶️ WASABI RAMEN SHOT (+28% SPD/-8s)" },
      { id: "p_mints_hnd", type: "bribe", x: 32.0, y: 29.0, r: 1.8, used: false, label: "🍬 MATCHA MINTS (BRIBE)" },
      { id: "p_clip_hnd", type: "intel_clipboard", x: 56.0, y: 25.0, r: 1.8, used: false, label: "📋 WASHLET SERVICE MANIFEST" },
      { id: "p_tower_hnd", type: "distract", target: "j_mop_hnd", x: 47.0, y: 14.2, r: 2.0, used: false, label: "🍾 KNOCK OVER CHAMPAGNE DISPLAY" }
    ],
    hazards: [
      {
        id: "j_mop_hnd",
        x: 32.0, y: 10.8, w: 6.4, h: 1.9,
        homeX: 32.0, homeY: 10.8,
        lureX: 47.0, lureY: 14.5,
        cleared: false,
        label: "🚧 HANEDA CUSTODIAN BARRICADE"
      }
    ],
    guards: [
      {
        id: "g_dxb_1",
        x: 28.0, y: 65.0,
        ax: 10.0, ay: 65.0, bx: 52.0, by: 65.0,
        spd: 3.1, range: 9.6, fovDeg: 64,
        angle: 0, dir: 1, isSegway: true, label: "DXB CONCOURSE SEGWAY"
      },
      {
        id: "g_dxb_2",
        x: 30.0, y: 44.5,
        ax: 14.0, ay: 44.5, bx: 54.0, by: 44.5,
        spd: 3.0, range: 9.5, fovDeg: 64,
        angle: Math.PI, dir: -1, label: "TRANSIT SECURITY"
      },
      {
        id: "g_hnd_3",
        x: 30.0, y: 22.5,
        ax: 10.0, ay: 22.5, bx: 52.0, by: 22.5,
        spd: 3.3, range: 9.8, fovDeg: 66,
        angle: 0, dir: 1, isSegway: true, label: "HANEDA VIP GUARD"
      }
    ],
    stalls: [
      { id: "s1", x: 6.5,  y: 2.5, w: 4.3, h: 3.0, open: false, inspected: false, label: "WASHLET #1" },
      { id: "s2", x: 15.5, y: 2.5, w: 4.3, h: 3.0, open: false, inspected: false, label: "WASHLET #2" },
      { id: "s3", x: 24.5, y: 2.5, w: 4.3, h: 3.0, open: false, inspected: false, label: "WASHLET #3" },
      { id: "s4", x: 33.5, y: 2.5, w: 4.3, h: 3.0, open: false, inspected: false, label: "WASHLET #4" },
      { id: "s5", x: 42.5, y: 2.5, w: 4.3, h: 3.0, open: false, inspected: false, label: "WASHLET #5" },
      { id: "s6", x: 51.5, y: 2.5, w: 4.3, h: 3.0, open: true,  inspected: false, label: "WASHLET #6" }
    ]
  }
];
