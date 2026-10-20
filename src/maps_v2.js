/**
 * @file maps_v2.js
 * @version 2.2.0
 * @description Progressive Campaign Level Design (v2.2.0 "Fun & Focus Cut"):
 *   - Gate 00 (Tutorial / Playable Ad): Pure movement, 1 guard, 1 cramp clench, 3 Mystery Stalls (no barricades!).
 *   - Level 1 (GOI — Practice Map 1): Wet puddles (🩴 Flip-Flops) + Security Frisk (🎫 VIP Pass) + 5 Mystery Stalls (no janitor barricades!).
 *   - Level 2 (JFK — Practice Map 2): Introduces Bribing the Janitor (🍬 Mints / 🗑️ Trash Bin) + 📋 Clipboard + 6 Mystery Stalls.
 *   - Level 3 (LHR — Practice Map 3): Introduces Moving Walkways (>>>) + Timed Shuttle Doors + Fickle Custodian + 6 Mystery Stalls.
 *   - Level 4 (SIN — Advanced): Introduces Rain Vortex (1.5x Cramps) + 🌶️ Spicy Turbo + Dual Barricades + Robo-Scrubbers + 7 Mystery Stalls.
 *   - Level 5 (DXB➔HND — Packed Finale): Perfume Spritzers + APM Train + Dual Barricades + 8 Mystery Stalls + 12-Button Washlet Boss!
 */

export const TUTORIAL_LEVEL_V2 = {
  id: "level_00_tutorial",
  num: 0,
  isTutorial: true,
  iata: "GATE 00",
  tierBadge: "🎓 20s WARM-UP",
  newMechanics: "Move • [X] Poker Face • [B] Clench • 3 Mystery Stalls",
  name: "Express Layover (Quick Warm-Up)",
  sub: "Fast 20-second warm-up! Sneak past 1 sleepy guard, clench through 1 rumble, and test 3 Mystery Stalls.",
  parSec: 45,
  pathMeters: 38,
  crampInterval: 14,
  spawnBark: "spawn_tutorial",
  world: { w: 28, h: 34 },
  spawn: { x: 14.0, y: 29.8 },
  secLineY: 20.5,
  restroomWingY: 9.5,
  waterfallZone: null,
  shuttleGateY: null,
  bidetBoss: false,
  wings: [
    { id: "T1", yMin: 21, yMax: 34, label: "STEP 1: WALK NORTH & GRAB 🩴 FLIP-FLOPS", dirArrow: "⬆ MOVE NORTH" },
    { id: "T2", yMin: 10, yMax: 21, label: "STEP 2: WALK PAST GUARD (OR [X]/[Q] POKER FACE)", dirArrow: "⬆ EASY PAST GUARD" },
    { id: "T3", yMin: 0,  yMax: 10, label: "STEP 3: CHECK THE 3 MYSTERY STALLS!", dirArrow: "🚽 FIND THE OPEN DOOR!" }
  ],
  palms: [
    { x: 4.0, y: 30.0 }, { x: 24.0, y: 30.0 }, { x: 4.0, y: 12.0 }, { x: 24.0, y: 12.0 }
  ],
  walls: [
    { x: 0, y: 0, w: 28, h: 1.2, label: "" },
    { x: 0, y: 32.8, w: 28, h: 1.2, label: "" },
    { x: 0, y: 0, w: 1.2, h: 34, label: "" },
    { x: 26.8, y: 0, w: 1.2, h: 34, label: "" },
    { x: 1.2, y: 20.5, w: 7.2, h: 1.4, label: "SECURITY STANCHION", isStanchion: true },
    { x: 19.6, y: 20.5, w: 7.2, h: 1.4, label: "X-RAY ARCH", isXray: true },
    { x: 1.2, y: 9.0, w: 9.5, h: 1.4, label: "RESTROOM WALL" },
    { x: 17.3, y: 9.0, w: 9.5, h: 1.4, label: "RESTROOM WALL" }
  ],
  wetZones: [
    { x: 5.0, y: 24.5, w: 5.0, h: 3.2, label: "WET PUDDLE" }
  ],
  walkways: [],
  crowds: [],
  props: [
    { id: "p_tut_shoes", type: "footwear", x: 7.5, y: 28.5, r: 2.2, used: false, label: "🩴 GRIP FLIP-FLOPS" }
  ],
  hazards: [],
  guards: [
    {
      id: "g_tut_1",
      x: 10.0, y: 16.5,
      ax: 6.0, ay: 16.5, bx: 22.0, by: 16.5,
      spd: 2.0, range: 6.5, fovDeg: 48,
      angle: 0, dir: 1, label: "SLEEPY GATE GUARD"
    }
  ],
  stalls: [
    { id: "s_tut_1", x: 5.5,  y: 2.2, w: 4.4, h: 3.0, open: false, inspected: false, label: "STALL #1" },
    { id: "s_tut_2", x: 11.8, y: 2.2, w: 4.4, h: 3.0, open: true,  inspected: false, label: "STALL #2" },
    { id: "s_tut_3", x: 18.1, y: 2.2, w: 4.4, h: 3.0, open: false, inspected: false, label: "STALL #3" }
  ]
};

export const LEVELS_V2 = [
  // ===========================================================================
  // LEVEL 1: GOA DABOLIM (GOI) — PRACTICE MAP 1 (Simple & Fun! No Barricades!)
  // Introduces: 🩴 Wet Floor Flip-Flops, 🎫 VIP Fast-Track Pass & 5 Decoy Stalls
  // ===========================================================================
  {
    id: "level_01_goi",
    num: 1,
    iata: "GOI",
    tierBadge: "🟢 PRACTICE MAP 1",
    newMechanics: "NEW: 🩴 Wet Floors, 🎫 VIP Security Pass & 5 Decoy Stalls",
    name: "Goa Dabolim International Airport",
    sub: "Practice Map 1 • Grab Flip-Flops for the puddles, slip past 2 guards, and test 5 Mystery Stalls before boarding!",
    parSec: 44,
    pathMeters: 155,
    crampInterval: 15,
    spawnBark: "spawn_goi",
    world: { w: 46, h: 58 },
    spawn: { x: 6.5, y: 52.5 },
    secLineY: 34.0,
    restroomWingY: 11.0,
    waterfallZone: null,
    shuttleGateY: null,
    bidetBoss: false,
    wings: [
      { id: "W1", yMin: 43, yMax: 58, label: "WING 1: CHECK-IN HALL (GRAB 🩴 FLIP-FLOPS)", dirArrow: "EAST TO SECURITY ➔" },
      { id: "W2", yMin: 29, yMax: 43, label: "WING 2: CISF SECURITY CHECKPOINT", dirArrow: "⬅ WEST TO CONCOURSE" },
      { id: "W3", yMin: 14, yMax: 29, label: "WING 3: GOAN SPICE BAZAAR", dirArrow: "EAST TO RESTROOMS ➔" },
      { id: "W4", yMin: 0,  yMax: 14, label: "WING 4: RESTROOM WING (5 MYSTERY STALLS)", dirArrow: "🚽 CHECK THE 5 STALLS!" }
    ],
    palms: [
      { x: 4.2, y: 55.0 }, { x: 42.0, y: 55.0 }, { x: 14.0, y: 12.2 }, { x: 32.0, y: 12.2 }
    ],
    walls: [
      { x: 0, y: 0, w: 46, h: 1.2, label: "" },
      { x: 0, y: 56.8, w: 46, h: 1.2, label: "" },
      { x: 0, y: 0, w: 1.2, h: 58, label: "" },
      { x: 44.8, y: 0, w: 1.2, h: 58, label: "" },

      // Wing 1 -> Wing 2 Divider (y = 43, East Passage x = 37..44.8)
      { x: 1.2, y: 42.4, w: 35.8, h: 1.5, label: "CHECK-IN DIVIDER (PASS EAST ➔)" },
      { x: 14.0, y: 48.5, w: 8.5, h: 2.5, label: "GOA CHARTER DESK", isKiosk: true },

      // Wing 2 -> Wing 3 Divider (y = 29, West Passage x = 1.2..9.0)
      { x: 9.0, y: 28.4, w: 35.8, h: 1.5, label: "SECURITY BARRIER (PASS WEST ⬅)" },
      { x: 9.0, y: 34.5, w: 11.5, h: 1.5, label: "VELVET STANCHION", isStanchion: true },
      { x: 26.5, y: 34.5, w: 11.5, h: 1.5, label: "X-RAY CONVEYOR", isXray: true },

      // Wing 3 -> Wing 4 Divider (y = 14, East Passage x = 37..44.8)
      { x: 1.2, y: 13.6, w: 35.8, h: 1.5, label: "GATE B12 WALL (PASS EAST ➔)" },
      { x: 18.0, y: 20.0, w: 9.5, h: 2.6, label: "CASHEW & FENI DUTY-FREE", isKiosk: true },

      // Wing 4 Open Restroom Partition (y = 9.0, wide open doorway x = 19.5..26.5)
      { x: 1.2, y: 8.8, w: 18.3, h: 1.4, label: "RESTROOM WALL" },
      { x: 26.5, y: 8.8, w: 18.3, h: 1.4, label: "RESTROOM WALL" }
    ],
    wetZones: [
      { x: 25.0, y: 45.5, w: 7.0, h: 4.0, label: "WET TILE PUDDLE" },
      { x: 20.0, y: 15.8, w: 6.5, h: 3.5, label: "MOPPED CONCOURSE" }
    ],
    walkways: [],
    crowds: [
      { x: 20.0, y: 52.5, ax: 10.0, ay: 52.5, bx: 34.0, by: 52.5, spd: 2.3, r: 0.9, label: "SURFBOARD TOURISTS" }
    ],
    props: [
      { id: "p_flipflops", type: "footwear", x: 33.5, y: 52.5, r: 2.0, used: false, label: "🩴 RUBBER FLIP-FLOPS" },
      { id: "p_vip_goi", type: "tsa_pass", x: 40.5, y: 39.0, r: 2.0, used: false, label: "🎫 VIP FAST-TRACK PASS" },
      { id: "p_frisk_goi", type: "security_frisk", x: 23.5, y: 35.0, r: 2.6, used: false, label: "🧤 CISF FRISK SCANNER" }
    ],
    hazards: [], // Practice Map 1 has NO janitor barricades — pure movement, stealth & decoy stalls!
    guards: [
      {
        id: "g_goi_1",
        x: 18.0, y: 32.0,
        ax: 8.0, ay: 32.0, bx: 33.0, by: 32.0,
        spd: 2.4, range: 8.4, fovDeg: 56,
        angle: 0, dir: 1, label: "CHECKPOINT OFFICER"
      },
      {
        id: "g_goi_2",
        x: 24.0, y: 17.2,
        ax: 10.0, ay: 17.2, bx: 36.0, by: 17.2,
        spd: 2.5, range: 8.6, fovDeg: 58,
        angle: Math.PI, dir: -1, label: "GATE B12 PATROL"
      }
    ],
    stalls: [
      { id: "s1", x: 5.5,  y: 2.2, w: 4.2, h: 3.0, open: false, inspected: false, label: "STALL #1" },
      { id: "s2", x: 13.2, y: 2.2, w: 4.2, h: 3.0, open: false, inspected: false, label: "STALL #2" },
      { id: "s3", x: 20.9, y: 2.2, w: 4.2, h: 3.0, open: false, inspected: false, label: "STALL #3" },
      { id: "s4", x: 28.6, y: 2.2, w: 4.2, h: 3.0, open: true,  inspected: false, label: "STALL #4" },
      { id: "s5", x: 36.3, y: 2.2, w: 4.2, h: 3.0, open: false, inspected: false, label: "STALL #5" }
    ]
  },

  // ===========================================================================
  // LEVEL 2: NEW YORK JFK T4 — PRACTICE MAP 2
  // Introduces: 🍬 Bribing the Janitor with Mints (or 🗑️ Trash Bin) & 📋 Clipboard
  // ===========================================================================
  {
    id: "level_02_jfk",
    num: 2,
    iata: "JFK",
    tierBadge: "🟢 PRACTICE MAP 2",
    newMechanics: "NEW: 🍬 Bribe Janitor with Mints (or 🗑️ Tip Bin) + 📋 Clipboard",
    name: "New York JFK International (Terminal 4)",
    sub: "Practice Map 2 • The janitor taped off the restrooms! Grab Duty-Free Mints to bribe him (or tip the trash bin) and check 6 Mystery Stalls.",
    parSec: 50,
    pathMeters: 175,
    crampInterval: 14,
    spawnBark: "spawn_jfk",
    world: { w: 50, h: 64 },
    spawn: { x: 7.0, y: 58.5 },
    secLineY: 38.5,
    restroomWingY: 11.5,
    waterfallZone: null,
    shuttleGateY: null,
    bidetBoss: false,
    wings: [
      { id: "W1", yMin: 47, yMax: 64, label: "WING 1: T4 DEPARTURES CURBSIDE", dirArrow: "EAST TO TSA QUEUE ➔" },
      { id: "W2", yMin: 32, yMax: 47, label: "WING 2: TSA PRECHECK LANE", dirArrow: "⬅ WEST TO RETAIL HALL" },
      { id: "W3", yMin: 15, yMax: 32, label: "WING 3: GRAB 🍬 MINTS OR 📋 CLIPBOARD", dirArrow: "EAST TO JANITOR CART ➔" },
      { id: "W4", yMin: 0,  yMax: 15, label: "WING 4: BRIBE JANITOR & CHECK 6 STALLS", dirArrow: "🍬 BRIBE CART OR TIP 🗑️ BIN" }
    ],
    palms: [
      { x: 5.0, y: 61.0 }, { x: 45.0, y: 61.0 }, { x: 14.0, y: 13.0 }, { x: 36.0, y: 13.0 }
    ],
    walls: [
      { x: 0, y: 0, w: 50, h: 1.2, label: "" },
      { x: 0, y: 62.8, w: 50, h: 1.2, label: "" },
      { x: 0, y: 0, w: 1.2, h: 64, label: "" },
      { x: 48.8, y: 0, w: 1.2, h: 64, label: "" },

      // Wing 1 -> Wing 2 Divider (y = 47, East passage x = 40..48.8)
      { x: 1.2, y: 46.4, w: 38.8, h: 1.5, label: "TICKETING BARRIER (PASS EAST ➔)" },
      { x: 16.0, y: 53.0, w: 10.0, h: 2.6, label: "HUDSON NEWS & BAGGAGE", isKiosk: true },

      // Wing 2 -> Wing 3 Divider (y = 32, West passage x = 1.2..9.5)
      { x: 9.5, y: 31.4, w: 39.3, h: 1.5, label: "TSA SCANNER WALL (PASS WEST ⬅)" },
      { x: 9.5, y: 38.5, w: 13.0, h: 1.5, label: "TSA STANCHION", isStanchion: true },
      { x: 28.5, y: 38.5, w: 13.0, h: 1.5, label: "WAVE SCANNER ARCH", isXray: true },

      // Wing 3 -> Wing 4 Divider (y = 15.5, East passage x = 40..48.8)
      { x: 1.2, y: 15.2, w: 38.8, h: 1.5, label: "CONCOURSE B WALL (PASS EAST ➔)" },
      { x: 18.0, y: 22.0, w: 11.0, h: 2.6, label: "FIFTH AVE DUTY-FREE (🍬 MINTS)", isKiosk: true },

      // Wing 4 Sealed Restroom Partition (y = 9.5, doorway at x = 22.0..28.0)
      { x: 1.2, y: 9.2, w: 20.8, h: 1.5, label: "RESTROOM SANCTUARY WALL" },
      { x: 28.0, y: 9.2, w: 20.8, h: 1.5, label: "RESTROOM SANCTUARY WALL" }
    ],
    wetZones: [
      { x: 20.0, y: 49.0, w: 7.0, h: 3.8, label: "SLUSHY PUDDLE" }
    ],
    walkways: [],
    crowds: [
      { x: 20.0, y: 58.5, ax: 9.0, ay: 58.5, bx: 40.0, by: 58.5, spd: 2.6, r: 0.92, label: "RED-EYE COMMUTERS" },
      { x: 24.0, y: 18.5, ax: 10.0, ay: 18.5, bx: 39.0, by: 18.5, spd: 2.7, r: 0.92, label: "DUTY-FREE SHOPPERS" }
    ],
    props: [
      { id: "p_shoes_jfk", type: "footwear", x: 37.5, y: 58.5, r: 2.0, used: false, label: "🩴 GRIP SLIPPERS" },
      { id: "p_clear_jfk", type: "tsa_pass", x: 44.0, y: 43.0, r: 2.0, used: false, label: "🎫 CLEAR VIP PASS" },
      { id: "p_tsa_jfk", type: "security_frisk", x: 25.5, y: 39.0, r: 2.8, used: false, label: "🧤 TSA PAT-DOWN MAT" },
      { id: "p_mints_jfk", type: "bribe", x: 14.0, y: 22.5, r: 2.1, used: false, label: "🍬 WINTERGREEN MINTS (BRIBE JANITOR)" },
      { id: "p_clip_jfk", type: "intel_clipboard", x: 44.0, y: 21.0, r: 2.0, used: false, label: "📋 CUSTODIAN CLIPBOARD (REVEALS OPEN STALL)" },
      { id: "p_kiosk_jfk", type: "distract", target: "j_mop_jfk_main", x: 37.0, y: 12.2, r: 2.1, used: false, label: "🗑️ TIP TRASH BIN (LURE JANITOR)" }
    ],
    hazards: [
      {
        id: "j_mop_jfk_main",
        x: 25.0, y: 9.9, w: 6.0, h: 1.9,
        homeX: 25.0, homeY: 9.9,
        lureX: 37.0, lureY: 12.5,
        cleared: false,
        label: "🚧 JANITOR MOP BARRICADE (BRIBE WITH 🍬 MINTS!)"
      }
    ],
    guards: [
      {
        id: "g_jfk_1",
        x: 24.0, y: 50.0,
        ax: 10.0, ay: 50.0, bx: 40.0, by: 50.0,
        spd: 2.7, range: 8.8, fovDeg: 58,
        angle: 0, dir: 1, isSegway: true, label: "SEGWAY PATROL"
      },
      {
        id: "g_jfk_2",
        x: 24.0, y: 35.0,
        ax: 10.0, ay: 35.0, bx: 40.0, by: 35.0,
        spd: 2.6, range: 8.8, fovDeg: 58,
        angle: Math.PI, dir: -1, isSegway: false, label: "TSA SUPERVISOR"
      }
    ],
    stalls: [
      { id: "s1", x: 4.5,  y: 2.2, w: 4.0, h: 3.0, open: false, inspected: false, label: "STALL #1" },
      { id: "s2", x: 11.8, y: 2.2, w: 4.0, h: 3.0, open: true,  inspected: false, label: "STALL #2" },
      { id: "s3", x: 19.1, y: 2.2, w: 4.0, h: 3.0, open: false, inspected: false, label: "STALL #3" },
      { id: "s4", x: 26.4, y: 2.2, w: 4.0, h: 3.0, open: false, inspected: false, label: "STALL #4" },
      { id: "s5", x: 33.7, y: 2.2, w: 4.0, h: 3.0, open: false, inspected: false, label: "STALL #5" },
      { id: "s6", x: 41.0, y: 2.2, w: 4.0, h: 3.0, open: false, inspected: false, label: "STALL #6" }
    ]
  },

  // ===========================================================================
  // LEVEL 3: LONDON HEATHROW T5 (LHR) — PRACTICE MAP 3
  // Introduces: >>> Reversing Travelators, Timed Shuttle Doors & Fickle Custodian
  // ===========================================================================
  {
    id: "level_03_lhr",
    num: 3,
    iata: "LHR",
    tierBadge: "🟡 PRACTICE MAP 3",
    newMechanics: "NEW: >>> Moving Walkways, Timed Shuttle Doors & Loo Attendant",
    name: "London Heathrow Airport (Terminal 5)",
    sub: "Practice Map 3 • Time the Underground Shuttle doors, ride the green Forward Travelator, and check 6 British Loos!",
    parSec: 56,
    pathMeters: 195,
    crampInterval: 13,
    spawnBark: "spawn_lhr",
    world: { w: 54, h: 70 },
    spawn: { x: 7.0, y: 64.0 },
    secLineY: 43.0,
    restroomWingY: 12.5,
    waterfallZone: null,
    shuttleGateY: 35.0,
    bidetBoss: false,
    fickleCustodian: true,
    wings: [
      { id: "W1", yMin: 52, yMax: 70, label: "WING 1: T5 DEPARTURES & BAG DROP", dirArrow: "EAST TO LIQUID CHECK ➔" },
      { id: "W2", yMin: 35, yMax: 52, label: "WING 2: 100ML CHECK & TIMED SHUTTLE GATE", dirArrow: "⬅ WEST TO SHUTTLE DOORS" },
      { id: "W3", yMin: 17, yMax: 35, label: "WING 3: RIDE THE TOP >>> FORWARD TRAVELATOR", dirArrow: "EAST TO BRITISH LOO ➔" },
      { id: "W4", yMin: 0,  yMax: 17, label: "WING 4: THE GREAT BRITISH LOO (6 STALLS)", dirArrow: "🚽 CHECK THE 6 LOOS!" }
    ],
    palms: [
      { x: 6.0, y: 66.0 }, { x: 48.0, y: 66.0 }, { x: 14.0, y: 14.0 }, { x: 40.0, y: 14.0 }
    ],
    walls: [
      { x: 0, y: 0, w: 54, h: 1.2, label: "" },
      { x: 0, y: 68.8, w: 54, h: 1.2, label: "" },
      { x: 0, y: 0, w: 1.2, h: 70, label: "" },
      { x: 52.8, y: 0, w: 1.2, h: 70, label: "" },

      // Wing 1 -> Wing 2 Divider (y = 52, East passage x = 44..52.8)
      { x: 1.2, y: 51.4, w: 42.8, h: 1.5, label: "BAG DROP BARRIER (PASS EAST ➔)" },
      { x: 18.0, y: 58.0, w: 11.0, h: 2.6, label: "HARRODS TEA CONCESSION", isKiosk: true },

      // Wing 2 -> Wing 3 Divider (y = 35.0, West Timed Shuttle Gate at x = 4.0..12.0!)
      { x: 12.0, y: 34.4, w: 40.8, h: 1.5, label: "SHUTTLE TUNNEL WALL (TIMED DOORS WEST ⬅)" },
      { x: 10.5, y: 43.0, w: 14.0, h: 1.5, label: "100ML BAGGIE QUEUE", isStanchion: true },
      { x: 30.5, y: 43.0, w: 14.0, h: 1.5, label: "UK BORDER X-RAY", isXray: true },

      // Wing 3 -> Wing 4 Divider (y = 17, East passage x = 44..52.8)
      { x: 1.2, y: 16.6, w: 42.8, h: 1.5, label: "CONCOURSE C WALL (PASS EAST ➔)" },

      // Wing 4 Sealed British Loo Partition (y = 9.8, doorway at x = 24.0..30.0)
      { x: 1.2, y: 9.5, w: 22.8, h: 1.5, label: "BRITISH LOO WALL" },
      { x: 30.0, y: 9.5, w: 22.8, h: 1.5, label: "BRITISH LOO WALL" }
    ],
    wetZones: [
      { x: 23.0, y: 54.0, w: 7.5, h: 3.8, label: "SPILLED EARL GREY PUDDLE" }
    ],
    walkways: [
      { x: 10.0, y: 20.5, w: 32.0, h: 2.8, vx: 3.2,  vy: 0, label: "FORWARD TRAVELATOR (+3.2 m/s ➔)" },
      { x: 10.0, y: 29.0, w: 32.0, h: 2.8, vx: -2.8, vy: 0, label: "⬅ REVERSE TRAVELATOR (-2.8 m/s)" }
    ],
    crowds: [
      { x: 22.0, y: 64.0, ax: 10.0, ay: 64.0, bx: 44.0, by: 64.0, spd: 2.6, r: 0.92, label: "UMBRELLA COMMUTERS" },
      { x: 26.0, y: 39.0, ax: 12.0, ay: 39.0, bx: 44.0, by: 39.0, spd: 2.6, r: 0.92, label: "SHUTTLE PASSENGERS" }
    ],
    props: [
      { id: "p_shoes_lhr", type: "footwear", x: 41.0, y: 64.0, r: 2.0, used: false, label: "🩴 WELLINGTON GRIP SOLES" },
      { id: "p_pass_lhr", type: "tsa_pass", x: 48.0, y: 47.0, r: 2.0, used: false, label: "🎫 FAST-TRACK GOLD CARD" },
      { id: "p_frisk_lhr", type: "security_frisk", x: 27.5, y: 43.5, r: 2.8, used: false, label: "🧤 100ML LIQUID INSPECTION" },
      { id: "p_mints_lhr", type: "bribe", x: 26.0, y: 25.0, r: 2.1, used: false, label: "🍬 PEPPERMINT TIN (BRIBE)" },
      { id: "p_clip_lhr", type: "intel_clipboard", x: 48.0, y: 21.5, r: 2.0, used: false, label: "📋 LOO MAINTENANCE LOG" },
      { id: "p_alarm_lhr", type: "distract", target: "j_mop_lhr", x: 39.5, y: 12.8, r: 2.1, used: false, label: "🔔 RING TEA TROLLEY BELL (LURE)" }
    ],
    hazards: [
      {
        id: "j_mop_lhr",
        x: 27.0, y: 10.2, w: 6.0, h: 1.9,
        homeX: 27.0, homeY: 10.2,
        lureX: 39.5, lureY: 13.0,
        cleared: false,
        label: "🚧 LOO CUSTODIAN BARRICADE"
      }
    ],
    guards: [
      {
        id: "g_lhr_1",
        x: 26.0, y: 55.0,
        ax: 10.0, ay: 55.0, bx: 44.0, by: 55.0,
        spd: 2.8, range: 9.0, fovDeg: 60,
        angle: 0, dir: 1, label: "BORDER FORCE PATROL"
      },
      {
        id: "g_lhr_2",
        x: 26.0, y: 38.5,
        ax: 12.0, ay: 38.5, bx: 44.0, by: 38.5,
        spd: 2.9, range: 9.0, fovDeg: 60,
        angle: Math.PI, dir: -1, isSegway: true, label: "T5 SEGWAY OFFICER"
      },
      {
        id: "g_lhr_3",
        x: 27.0, y: 13.0,
        ax: 12.0, ay: 13.0, bx: 40.0, by: 13.0,
        spd: 2.5, range: 8.5, fovDeg: 58,
        angle: 0, dir: 1, label: "FICKLE LOO ATTENDANT"
      }
    ],
    stalls: [
      { id: "s1", x: 5.0,  y: 2.2, w: 4.0, h: 3.0, open: false, inspected: false, label: "LOO #1" },
      { id: "s2", x: 12.8, y: 2.2, w: 4.0, h: 3.0, open: false, inspected: false, label: "LOO #2" },
      { id: "s3", x: 20.6, y: 2.2, w: 4.0, h: 3.0, open: false, inspected: false, label: "LOO #3" },
      { id: "s4", x: 28.4, y: 2.2, w: 4.0, h: 3.0, open: false, inspected: false, label: "LOO #4" },
      { id: "s5", x: 36.2, y: 2.2, w: 4.0, h: 3.0, open: true,  inspected: false, label: "LOO #5" },
      { id: "s6", x: 44.0, y: 2.2, w: 4.0, h: 3.0, open: false, inspected: false, label: "LOO #6" }
    ]
  },

  // ===========================================================================
  // LEVEL 4: SINGAPORE CHANGI JEWEL (SIN) — ADVANCED CHALLENGE
  // Introduces: 🌊 Rain Vortex (1.5x Cramps), 🌶️ Spicy Laksa Turbo, Dual Barricades & 7 Stalls
  // ===========================================================================
  {
    id: "level_04_sin",
    num: 4,
    iata: "SIN",
    tierBadge: "🟠 ADVANCED MAP 4",
    newMechanics: "NEW: 🌊 1.5x Cramp Waterfall, 🌶️ Laksa Turbo & Dual Barricades (7 Stalls)",
    name: "Singapore Changi Airport (Jewel Vortex)",
    sub: "Advanced Challenge • Survive the roaring Rain Vortex (1.5x cramps), clear 2 Janitor Barricades, and search 7 VIP Suites!",
    parSec: 62,
    pathMeters: 215,
    crampInterval: 12,
    spawnBark: "spawn_sin",
    world: { w: 58, h: 74 },
    spawn: { x: 8.0, y: 68.5 },
    secLineY: 46.5,
    restroomWingY: 13.0,
    waterfallZone: { x: 14.0, y: 19.0, w: 30.0, h: 15.0, mult: 1.5, label: "🌊 RAIN VORTEX (1.5x CRAMP ZONE)" },
    shuttleGateY: null,
    bidetBoss: false,
    wings: [
      { id: "W1", yMin: 55, yMax: 74, label: "WING 1: JEWEL FOREST VALLEY ARRIVALS", dirArrow: "EAST TO IMMIGRATION ➔" },
      { id: "W2", yMin: 37, yMax: 55, label: "WING 2: BIOMETRIC GATE & WALKWAY", dirArrow: "⬅ WEST TO VORTEX DECK" },
      { id: "W3", yMin: 17, yMax: 37, label: "WING 3: RAIN VORTEX (1.5x CRAMPS) & BARRICADE #1", dirArrow: "EAST TO SANCTUARY ➔" },
      { id: "W4", yMin: 0,  yMax: 17, label: "WING 4: ORCHID SANCTUARY (7 VIP SUITES)", dirArrow: "🚽 CHECK THE 7 SUITES!" }
    ],
    palms: [
      { x: 6.0, y: 70.5 }, { x: 29.0, y: 70.5 }, { x: 52.0, y: 70.5 },
      { x: 12.0, y: 32.0 }, { x: 46.0, y: 32.0 }, { x: 16.0, y: 14.5 }, { x: 42.0, y: 14.5 }
    ],
    walls: [
      { x: 0, y: 0, w: 58, h: 1.2, label: "" },
      { x: 0, y: 72.8, w: 58, h: 1.2, label: "" },
      { x: 0, y: 0, w: 1.2, h: 74, label: "" },
      { x: 56.8, y: 0, w: 1.2, h: 74, label: "" },

      // Wing 1 -> Wing 2 Divider (y = 55, East passage x = 47..56.8)
      { x: 1.2, y: 54.4, w: 45.8, h: 1.5, label: "FOREST TERRACE WALL (PASS EAST ➔)" },
      { x: 18.0, y: 61.5, w: 11.0, h: 2.6, label: "PANDAN CHIFFON CAFE", isKiosk: true },

      // Wing 2 -> Wing 3 Divider (y = 37, West passage x = 1.2..10.5)
      { x: 10.5, y: 36.4, w: 46.3, h: 1.5, label: "SKYBRIDGE BALUSTRADE (PASS WEST ⬅)" },
      { x: 11.5, y: 46.0, w: 15.0, h: 1.5, label: "BIOMETRIC STANCHION", isStanchion: true },
      { x: 33.5, y: 46.0, w: 15.0, h: 1.5, label: "CHANGI X-RAY", isXray: true },

      // Central Rain Vortex Basin
      { x: 24.0, y: 24.0, w: 10.0, h: 5.5, label: "🌊 VORTEX POOL BASIN", isKiosk: true },

      // Wing 3 -> Wing 4 Divider (y = 17, East passage x = 47..56.8 — guarded by Barricade #1)
      { x: 1.2, y: 16.6, w: 45.8, h: 1.5, label: "ORCHID LOUNGE PARTITION (PASS EAST ➔)" },

      // Wing 4 Sealed Sanctuary Partition (y = 9.8, doorway at x = 26.0..32.0 — guarded by Barricade #2)
      { x: 1.2, y: 9.5, w: 24.8, h: 1.5, label: "SANCTUARY WALL" },
      { x: 32.0, y: 9.5, w: 24.8, h: 1.5, label: "SANCTUARY WALL" }
    ],
    wetZones: [
      { x: 17.0, y: 30.5, w: 8.5, h: 3.6, label: "VORTEX MIST SPRAY" },
      { x: 32.0, y: 19.5, w: 8.5, h: 3.6, label: "SCRUBBER FOAM TRAIL" }
    ],
    walkways: [
      { x: 14.0, y: 50.0, w: 26.0, h: 2.6, vx: -2.8, vy: 0, label: "⬅ SKYTRAIN WALKWAY" }
    ],
    crowds: [
      { x: 24.0, y: 68.5, ax: 10.0, ay: 68.5, bx: 48.0, by: 68.5, spd: 2.8, r: 0.94, label: "SELFIE TOURIST MOB" },
      { x: 28.0, y: 41.5, ax: 12.0, ay: 41.5, bx: 46.0, by: 41.5, spd: 2.7, r: 0.94, label: "TRANSIT TOURISTS" }
    ],
    props: [
      { id: "p_shoes_sin", type: "footwear", x: 44.0, y: 68.5, r: 2.0, used: false, label: "🩴 ORCHID GRIP SANDALS" },
      { id: "p_pass_sin", type: "tsa_pass", x: 51.0, y: 50.0, r: 2.0, used: false, label: "🎫 CHANGI PRIORITY PASS" },
      { id: "p_frisk_sin", type: "security_frisk", x: 30.0, y: 46.5, r: 3.0, used: false, label: "🧤 SECURITY PAT-DOWN" },
      { id: "p_laksa_sin", type: "spicy_food", x: 10.0, y: 26.5, r: 2.0, used: false, label: "🌶️ SPICY LAKSA TURBO (+30% SPD/-6s)" },
      { id: "p_coffee_sin", type: "distract", target: "j_mop_sin_east", x: 38.0, y: 26.5, r: 2.1, used: false, label: "🗑️ TIP SATAY CART (UNSEAL BRIDGE #1)" },
      { id: "p_mints_sin", type: "bribe", x: 20.0, y: 20.0, r: 2.1, used: false, label: "🍬 JASMINE MINTS (BRIBE BARRICADE #2)" },
      { id: "p_clip_sin", type: "intel_clipboard", x: 51.0, y: 22.5, r: 2.0, used: false, label: "📋 SANCTUARY TABLET LOG" },
      { id: "p_sign_sin", type: "distract", target: "j_mop_sin", x: 42.0, y: 12.8, r: 2.1, used: false, label: "🪴 TOPPLE ORCHID POT (LURE #2)" }
    ],
    hazards: [
      {
        id: "j_mop_sin_east",
        x: 51.5, y: 17.2, w: 6.0, h: 1.9,
        homeX: 51.5, homeY: 17.2,
        lureX: 38.0, lureY: 26.5,
        cleared: false,
        label: "🚧 BRIDGE MOP BARRICADE #1"
      },
      {
        id: "j_mop_sin",
        x: 29.0, y: 10.2, w: 6.0, h: 1.9,
        homeX: 29.0, homeY: 10.2,
        lureX: 42.0, lureY: 13.0,
        cleared: false,
        label: "🚧 SANCTUARY BARRICADE #2"
      }
    ],
    guards: [
      {
        id: "g_sin_1",
        x: 26.0, y: 58.0,
        ax: 10.0, ay: 58.0, bx: 48.0, by: 58.0,
        spd: 3.2, range: 9.2, fovDeg: 62,
        angle: 0, dir: 1, isRobo: true, label: "ROBO-SCRUBBER MK-I"
      },
      {
        id: "g_sin_2",
        x: 20.0, y: 33.5,
        ax: 8.0, ay: 33.5, bx: 48.0, by: 33.5,
        spd: 3.4, range: 9.4, fovDeg: 64,
        angle: Math.PI, dir: -1, isRobo: true, label: "ROBO-SCRUBBER MK-II"
      },
      {
        id: "g_sin_3",
        x: 34.0, y: 20.5,
        ax: 10.0, ay: 20.5, bx: 46.0, by: 20.5,
        spd: 3.5, range: 9.4, fovDeg: 64,
        angle: 0, dir: 1, isRobo: true, label: "ROBO-SCRUBBER MK-III"
      }
    ],
    stalls: [
      { id: "s1", x: 4.2,  y: 2.2, w: 3.8, h: 3.0, open: false, inspected: false, label: "SUITE #1" },
      { id: "s2", x: 11.4, y: 2.2, w: 3.8, h: 3.0, open: false, inspected: false, label: "SUITE #2" },
      { id: "s3", x: 18.6, y: 2.2, w: 3.8, h: 3.0, open: false, inspected: false, label: "SUITE #3" },
      { id: "s4", x: 25.8, y: 2.2, w: 3.8, h: 3.0, open: true,  inspected: false, label: "SUITE #4" },
      { id: "s5", x: 33.0, y: 2.2, w: 3.8, h: 3.0, open: false, inspected: false, label: "SUITE #5" },
      { id: "s6", x: 40.2, y: 2.2, w: 3.8, h: 3.0, open: false, inspected: false, label: "SUITE #6" },
      { id: "s7", x: 47.4, y: 2.2, w: 3.8, h: 3.0, open: false, inspected: false, label: "SUITE #7" }
    ]
  },

  // ===========================================================================
  // LEVEL 5: DUBAI (DXB T3) -> TOKYO HANEDA (HND T3) — PACKED CLIMAX FINALE!
  // Combines: 🌸 Perfume Spritzers, APM Train Doors, Dual Barricades, 8 Stalls & Washlet Boss!
  // ===========================================================================
  {
    id: "level_05_dxb_hnd",
    num: 5,
    iata: "DXB➔HND",
    tierBadge: "🔴 PACKED FINALE",
    newMechanics: "ALL-OUT FINALE: 🌸 Perfume Spritzers, APM Train, 8 Stalls & 12-Key Bidet Boss!",
    name: "Dubai Concourse A ➔ Tokyo Haneda Finale",
    sub: "Packed Climax • Dash through 4 Perfume Spritzers, catch the APM Train, clear 2 Barricades, check 8 Stalls & crack the Washlet-9000!",
    parSec: 68,
    pathMeters: 235,
    crampInterval: 11,
    spawnBark: "spawn_dxb",
    world: { w: 62, h: 80 },
    spawn: { x: 8.0, y: 74.5 },
    secLineY: 50.0,
    restroomWingY: 13.5,
    waterfallZone: null,
    shuttleGateY: 39.5,
    bidetBoss: true,
    fickleCustodian: true,
    wings: [
      { id: "W1", yMin: 59, yMax: 80, label: "ACT 1A (DXB): GOLD SOUK & 🌸 PERFUME GAUNTLET", dirArrow: "EAST TO CUSTOMS ➔" },
      { id: "W2", yMin: 39.5, yMax: 59, label: "ACT 1B (DXB): CUSTOMS & APM EXPRESS TRAIN", dirArrow: "⬅ BOARD HANEDA TRAIN" },
      { id: "W3", yMin: 18, yMax: 39.5, label: "ACT 2A (HND): TOKYO HIGH-SPEED CONCOURSE", dirArrow: "EAST TO WASHLET WING ➔" },
      { id: "W4", yMin: 0,  yMax: 18, label: "ACT 2B (HND): 8 WASHLET STALLS + BIDET BOSS!", dirArrow: "🚽 FIND THE BOSS THRONE!" }
    ],
    palms: [
      { x: 6.0, y: 76.5 }, { x: 31.0, y: 76.5 }, { x: 56.0, y: 76.5 },
      { x: 14.0, y: 15.0 }, { x: 48.0, y: 15.0 }
    ],
    walls: [
      { x: 0, y: 0, w: 62, h: 1.2, label: "" },
      { x: 0, y: 78.8, w: 62, h: 1.2, label: "" },
      { x: 0, y: 0, w: 1.2, h: 80, label: "" },
      { x: 60.8, y: 0, w: 1.2, h: 80, label: "" },

      // Wing 1 -> Wing 2 Divider (y = 59, East passage x = 50..60.8)
      { x: 1.2, y: 58.4, w: 48.8, h: 1.5, label: "GOLD SOUK ARCHWAY (PASS EAST ➔)" },
      { x: 15.0, y: 66.0, w: 11.0, h: 2.6, label: "OUD & BERGAMOT EMPORIUM", isKiosk: true },
      { x: 35.0, y: 67.5, w: 11.0, h: 2.6, label: "DUBAI DUTY-FREE BULLION", isKiosk: true },

      // Wing 2 -> Wing 3 Divider (y = 39.5, West APM Train Doors at x = 4.0..12.5)
      { x: 12.5, y: 39.0, w: 48.3, h: 1.5, label: "APM TRAIN PLATFORM WALL" },
      { x: 12.5, y: 49.5, w: 16.0, h: 1.5, label: "TRANSIT QUEUE", isStanchion: true },
      { x: 35.5, y: 49.5, w: 16.0, h: 1.5, label: "CUSTOMS X-RAY", isXray: true },

      // Wing 3 -> Wing 4 Divider (y = 18, East passage x = 50..60.8 — guarded by Barricade #1)
      { x: 1.2, y: 17.6, w: 48.8, h: 1.5, label: "HANEDA CONCOURSE DIVIDER (PASS EAST ➔)" },
      { x: 16.0, y: 26.0, w: 11.0, h: 2.6, label: "TOKYO RAMEN & WASABI BAR", isKiosk: true },
      { x: 35.0, y: 25.0, w: 11.0, h: 2.6, label: "ELECTRONIC DUTY-FREE PLAZA", isKiosk: true },

      // Wing 4 Sealed Washlet Sanctuary Partition (y = 10.0, doorway at x = 28.0..34.0 — guarded by Barricade #2)
      { x: 1.2, y: 9.6, w: 26.8, h: 1.5, label: "WASHLET SANCTUARY WALL" },
      { x: 34.0, y: 9.6, w: 26.8, h: 1.5, label: "WASHLET SANCTUARY WALL" }
    ],
    wetZones: [
      { x: 23.0, y: 61.5, w: 8.5, h: 3.8, label: "GOLD MARBLE PUDDLE" },
      { x: 23.0, y: 20.5, w: 8.5, h: 3.8, label: "SANITIZED HANEDA FLOOR" }
    ],
    walkways: [
      { x: 14.0, y: 54.0, w: 30.0, h: 2.6, vx: -3.0, vy: 0, label: "⬅ DXB APM EXPRESS WALKWAY" },
      { x: 14.0, y: 31.5, w: 30.0, h: 2.6, vx: 3.2,  vy: 0, label: "HANEDA HIGH-SPEED WALKWAY ➔" }
    ],
    crowds: [
      { x: 25.0, y: 74.5, ax: 10.0, ay: 74.5, bx: 52.0, by: 74.5, spd: 2.9, r: 0.95, label: "LUXURY SHOPPERS" },
      { x: 30.0, y: 44.5, ax: 12.0, ay: 44.5, bx: 50.0, by: 44.5, spd: 2.8, r: 0.95, label: "APM TRAIN COMMUTERS" },
      { x: 30.0, y: 14.0, ax: 12.0, ay: 14.0, bx: 48.0, by: 14.0, spd: 2.8, r: 0.95, label: "TOKYO SALARYMEN" }
    ],
    props: [
      { id: "p_shoes_dxb", type: "footwear", x: 47.0, y: 74.5, r: 2.0, used: false, label: "🩴 SILK GRIP SLIPPERS" },
      { id: "p_perf_1", type: "perfume_ambush", x: 13.0, y: 71.0, r: 2.4, used: false, label: "🌸 PERFUME SPRITZER #1" },
      { id: "p_perf_2", type: "perfume_ambush", x: 29.0, y: 64.0, r: 2.4, used: false, label: "🌸 PERFUME SPRITZER #2" },
      { id: "p_perf_3", type: "perfume_ambush", x: 42.0, y: 71.5, r: 2.4, used: false, label: "🌸 PERFUME SPRITZER #3" },
      { id: "p_perf_4", type: "perfume_ambush", x: 21.0, y: 46.0, r: 2.4, used: false, label: "🌸 PERFUME SPRITZER #4" },
      { id: "p_pass_dxb", type: "tsa_pass", x: 54.0, y: 53.5, r: 2.0, used: false, label: "🎫 EMIRATES FIRST-CLASS PASS" },
      { id: "p_frisk_dxb", type: "security_frisk", x: 32.0, y: 50.0, r: 3.0, used: false, label: "🧤 CUSTOMS PAT-DOWN" },
      { id: "p_wasabi_hnd", type: "spicy_food", x: 12.0, y: 27.5, r: 2.0, used: false, label: "🌶️ WASABI RAMEN SHOT (+30% SPD/-6s)" },
      { id: "p_cart_hnd", type: "distract", target: "j_mop_hnd_east", x: 41.0, y: 28.0, r: 2.1, used: false, label: "🗑️ TIP BENTO CART (UNSEAL BRIDGE #1)" },
      { id: "p_mints_hnd", type: "bribe", x: 28.0, y: 27.5, r: 2.1, used: false, label: "🍬 MATCHA MINTS (BRIBE BARRICADE #2)" },
      { id: "p_clip_hnd", type: "intel_clipboard", x: 54.0, y: 23.5, r: 2.0, used: false, label: "📋 WASHLET SERVICE MANIFEST" },
      { id: "p_tower_hnd", type: "distract", target: "j_mop_hnd", x: 45.0, y: 13.5, r: 2.1, used: false, label: "🍾 TOPPLE SAKE DISPLAY (LURE #2)" }
    ],
    hazards: [
      {
        id: "j_mop_hnd_east",
        x: 54.5, y: 18.2, w: 6.0, h: 1.9,
        homeX: 54.5, homeY: 18.2,
        lureX: 41.0, lureY: 28.0,
        cleared: false,
        label: "🚧 CONCOURSE BARRICADE #1"
      },
      {
        id: "j_mop_hnd",
        x: 31.0, y: 10.2, w: 6.2, h: 1.9,
        homeX: 31.0, homeY: 10.2,
        lureX: 45.0, lureY: 13.8,
        cleared: false,
        label: "🚧 WASHLET CUSTODIAN BARRICADE #2"
      }
    ],
    guards: [
      {
        id: "g_dxb_1",
        x: 28.0, y: 62.0,
        ax: 10.0, ay: 62.0, bx: 50.0, by: 62.0,
        spd: 3.3, range: 9.5, fovDeg: 64,
        angle: 0, dir: 1, isSegway: true, label: "DXB CONCOURSE SEGWAY"
      },
      {
        id: "g_dxb_2",
        x: 29.0, y: 42.5,
        ax: 14.0, ay: 42.5, bx: 52.0, by: 42.5,
        spd: 3.2, range: 9.4, fovDeg: 64,
        angle: Math.PI, dir: -1, label: "TRANSIT SECURITY"
      },
      {
        id: "g_hnd_3",
        x: 29.0, y: 21.5,
        ax: 10.0, ay: 21.5, bx: 50.0, by: 21.5,
        spd: 3.5, range: 9.6, fovDeg: 66,
        angle: 0, dir: 1, isSegway: true, label: "HANEDA VIP GUARD"
      }
    ],
    stalls: [
      { id: "s1", x: 3.8,  y: 2.2, w: 3.6, h: 3.0, open: false, inspected: false, label: "WASHLET #1" },
      { id: "s2", x: 10.6, y: 2.2, w: 3.6, h: 3.0, open: false, inspected: false, label: "WASHLET #2" },
      { id: "s3", x: 17.4, y: 2.2, w: 3.6, h: 3.0, open: false, inspected: false, label: "WASHLET #3" },
      { id: "s4", x: 24.2, y: 2.2, w: 3.6, h: 3.0, open: false, inspected: false, label: "WASHLET #4" },
      { id: "s5", x: 31.0, y: 2.2, w: 3.6, h: 3.0, open: false, inspected: false, label: "WASHLET #5" },
      { id: "s6", x: 37.8, y: 2.2, w: 3.6, h: 3.0, open: true,  inspected: false, label: "WASHLET #6" },
      { id: "s7", x: 44.6, y: 2.2, w: 3.6, h: 3.0, open: false, inspected: false, label: "WASHLET #7" },
      { id: "s8", x: 51.4, y: 2.2, w: 3.6, h: 3.0, open: false, inspected: false, label: "WASHLET #8" }
    ]
  }
];
