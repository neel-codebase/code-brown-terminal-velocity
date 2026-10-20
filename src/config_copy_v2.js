/**
 * @file config_copy_v2.js
 * @version 2.0.0
 * @description Isolated ES Module for Human-First UI Copy (Section 3.1),
 * the 10-Expression Gameplay Dynamics Matrix (Section 5.3), and Johnny Rocketfingers
 * Comic Monologues & Speech Bubbles.
 */

export const UI_COPY_V2 = {
  topTag: "BOARDING PASS • PRIORITY LAVATORY ACCESS",
  titleExplicit: "I Need to Take a Sh!t: Airport Dash",
  titleSafe: "Code Brown: Terminal Velocity",
  homeSubtitle:
    "Bad airport food. Five international terminals. Zero unlocked stalls in sight. Keep a poker face past security and reach a working throne before gravity wins.",
  mirrorBtnLabel: "PRACTICE POKER FACE 🎭",
  v1ArchiveLabel: "🕹️ Play Classic v1.0 (Portrait Archive)",
  difficultyHeading: "HOW RISKY WAS YOUR IN-FLIGHT MEAL?",
  difficulties: {
    casual: {
      id: "casual",
      title: "MILD TRAVEL TUMMY",
      sub: "Relaxed Clock",
      timerMult: 1.30,
      suspMult: 0.78,
      crampMult: 0.85,
      chaseMult: 0.90
    },
    standard: {
      id: "standard",
      title: "AIRPORT CURRY CRISIS",
      sub: "Standard Rush",
      timerMult: 1.00,
      suspMult: 1.00,
      crampMult: 1.00,
      chaseMult: 1.00
    },
    nightmare: {
      id: "nightmare",
      title: "STREET VENDOR REVENGE",
      sub: "Panic Speed",
      timerMult: 0.82,
      suspMult: 1.25,
      crampMult: 1.22,
      chaseMult: 1.15
    }
  },
  hudObjectives: {
    stage1:
      "💡 Tip: Get past the Security Checkpoint! (Grab a Fast-Track Pass to skip the pat-down)",
    stage2:
      "💡 Tip: The janitor taped off the restrooms! Bribe him with mints or cause a mess to lure him away.",
    stage3:
      "💡 Tip: You're in! Check the stall doors—or peek at the janitor's clipboard—to find an unlocked toilet!"
  }
};

/**
 * 10-State Johnny Rocketfingers Facial Expression Catalog & Mirror Check Copy
 * (Replaces developer debug strings with in-universe player copy & perks)
 */
export const EXPRESSION_META = [
  {
    id: "noir_glare",
    label: "COOL & COLLECTED",
    mirrorTitle: "MIRROR CHECK: COOL & COLLECTED",
    mirrorDesc:
      "\"Act natural. Nobody suspects a guy chewing a toothpick.\" (Guards notice you 25% slower — 50% slower with [X] Poker Face!)"
  },
  {
    id: "sweating_squint",
    label: "NERVOUS SQUINT",
    mirrorTitle: "MIRROR CHECK: NERVOUS SQUINT",
    mirrorDesc:
      "\"Don't make eye contact with the duty-free clerk.\" (+5% brisk walk hustle as your palms start sweating)"
  },
  {
    id: "clenched_grimace",
    label: "TEETH GRITTED",
    mirrorTitle: "MIRROR CHECK: TEETH GRITTED",
    mirrorDesc:
      "\"Smile for the boarding gate camera... wait, that's a grimace.\" (Gritting teeth cuts extra sprint timer drain by 15%)"
  },
  {
    id: "panic_stare",
    label: "FULL PANIC EYES",
    mirrorTitle: "MIRROR CHECK: FULL PANIC EYES",
    mirrorDesc:
      "\"Out of the way! Emergency coming through!\" (+18% sprint speed & terrified tourists automatically part out of your path!)"
  },
  {
    id: "twitching_eyebrow",
    label: "DEADPAN DISBELIEF",
    mirrorTitle: "MIRROR CHECK: DEADPAN DISBELIEF",
    mirrorDesc:
      "\"Locked?! Every stall in this wing is locked?!\" (Frantic door-rattling makes your next stall check 3.5x faster!)"
  },
  {
    id: "awkward_smile",
    label: "GUILTY GRIN",
    mirrorTitle: "MIRROR CHECK: GUILTY GRIN",
    mirrorDesc:
      "\"Lovely weather inside Terminal 4, Officer!\" (Nervous smile delays guard chase threshold from 35% to 55% suspicion)"
  },
  {
    id: "smirk_sweat",
    label: "SLY WINK",
    mirrorTitle: "MIRROR CHECK: SLY WINK",
    mirrorDesc:
      "\"Nothing a tin of spearmint and a little chaos can't fix.\" (1.5x faster sabotage/bribes & +0.4m reach for 4 seconds)"
  },
  {
    id: "iron_clench",
    label: "IRON CLENCH",
    mirrorTitle: "MIRROR CHECK: IRON CLENCH",
    mirrorDesc:
      "\"Hold the line! Mind over digestive matter!\" (Freezes bowel countdown & grants 100% Cramp Wave immunity)"
  },
  {
    id: "bergamot_stun",
    label: "PERFUME DIZZY",
    mirrorTitle: "MIRROR CHECK: PERFUME DIZZY",
    mirrorDesc:
      "\"My eyes! Why does duty-free cologne burn like pepper spray?!\" (Dizzy steering sway — press [Y] Elbow Dash to shake it off!)"
  },
  {
    id: "freeze_frame_despair",
    label: "UTTER DESPAIR",
    mirrorTitle: "MIRROR CHECK: UTTER DESPAIR",
    mirrorDesc:
      "\"So this is how my frequent-flyer status ends.\" (Noir spotlight vignette when the clock or security catches up)"
  }
];

/**
 * Section 5.3: 10-Expression Active Gameplay Dynamics Matrix
 * Every facial expression actively modifies physics, stealth, crowd parting, and interactions.
 */
export const EXPRESSION_DYNAMICS = {
  noir_glare: {
    walkMult: 1.00,
    sprintMult: 1.00,
    suspRateMult: 0.75,        // Passive 25% slower suspicion build
    pokerSuspRateMult: 0.50,   // [X] Poker Face active: 50% slower suspicion build!
    interactSpeedMult: 1.20,   // 1.2x faster interaction
    reachBonus: 0.0,
    sprintExtraDrainMult: 1.0,
    chaseThreshold: 35,
    terrifiesCrowds: false,
    stallInspectSec: 0.55,
    turnAgility: 1.0,
    swayRadians: 0.0
  },
  sweating_squint: {
    walkMult: 1.05,            // +5% nervous walk hustle
    sprintMult: 1.00,
    suspRateMult: 1.10,
    pokerSuspRateMult: 0.50,
    interactSpeedMult: 1.00,
    reachBonus: 0.0,
    sprintExtraDrainMult: 1.0,
    chaseThreshold: 35,
    terrifiesCrowds: false,
    stallInspectSec: 0.55,
    turnAgility: 1.0,
    swayRadians: 0.0
  },
  clenched_grimace: {
    walkMult: 1.00,
    sprintMult: 1.00,
    suspRateMult: 1.12,
    pokerSuspRateMult: 0.50,
    interactSpeedMult: 1.00,
    reachBonus: 0.0,
    sprintExtraDrainMult: 0.85, // Gritting teeth cuts extra sprint drain
    chaseThreshold: 35,
    terrifiesCrowds: false,
    stallInspectSec: 0.50,
    turnAgility: 0.92,
    swayRadians: 0.0
  },
  panic_stare: {
    walkMult: 1.08,
    sprintMult: 1.18,          // 1.18x Sprint Speed (6.5 m/s)
    suspRateMult: 1.35,
    pokerSuspRateMult: 0.50,
    interactSpeedMult: 1.10,
    reachBonus: 0.0,
    sprintExtraDrainMult: 1.0,
    chaseThreshold: 35,
    terrifiesCrowds: true,     // Tourists within 2.2m step aside automatically!
    stallInspectSec: 0.42,
    turnAgility: 1.0,
    swayRadians: 0.0
  },
  awkward_smile: {
    walkMult: 1.00,
    sprintMult: 1.00,
    suspRateMult: 0.95,
    pokerSuspRateMult: 0.50,
    interactSpeedMult: 1.00,
    reachBonus: 0.0,
    sprintExtraDrainMult: 1.0,
    chaseThreshold: 55,        // Delays Guard Chase threshold from 35% to 55%!
    terrifiesCrowds: false,
    stallInspectSec: 0.55,
    turnAgility: 1.0,
    swayRadians: 0.0,
    miniBubble: "Hehe... lovely terminal!"
  },
  smirk_sweat: {
    walkMult: 1.04,
    sprintMult: 1.04,
    suspRateMult: 0.90,
    pokerSuspRateMult: 0.50,
    interactSpeedMult: 1.50,   // 1.5x faster interaction & sabotage speed!
    reachBonus: 0.40,          // +0.4m interaction reach (2.05m radius)
    sprintExtraDrainMult: 1.0,
    chaseThreshold: 35,
    terrifiesCrowds: false,
    stallInspectSec: 0.32,
    turnAgility: 1.0,
    swayRadians: 0.0
  },
  twitching_eyebrow: {
    walkMult: 1.02,
    sprintMult: 1.06,
    suspRateMult: 1.00,
    pokerSuspRateMult: 0.50,
    interactSpeedMult: 1.45,
    reachBonus: 0.20,
    sprintExtraDrainMult: 1.0,
    chaseThreshold: 35,
    terrifiesCrowds: false,
    stallInspectSec: 0.15,     // Next Mystery Stall check takes 0.15s instead of 0.55s!
    turnAgility: 1.0,
    swayRadians: 0.0
  },
  iron_clench: {
    walkMult: 0.0,
    sprintMult: 0.0,
    suspRateMult: 0.60,
    pokerSuspRateMult: 0.50,
    interactSpeedMult: 1.00,
    reachBonus: 0.0,
    sprintExtraDrainMult: 0.0,
    timerDrainMult: 0.0,       // 0.0x Bowel Timer Drain & 100% Cramp Immunity
    crampImmune: true,
    chaseThreshold: 35,
    terrifiesCrowds: false,
    stallInspectSec: 0.55,
    turnAgility: 0.0,
    swayRadians: 0.0
  },
  bergamot_stun: {
    walkMult: 0.78,
    sprintMult: 0.78,
    suspRateMult: 1.20,
    pokerSuspRateMult: 0.50,
    interactSpeedMult: 0.80,
    reachBonus: 0.0,
    sprintExtraDrainMult: 1.0,
    chaseThreshold: 35,
    terrifiesCrowds: false,
    stallInspectSec: 0.65,
    turnAgility: 0.68,
    swayRadians: 0.35          // +0.35 rad drunken steering wobble (cleared by [Y] Elbow Dash)
  },
  freeze_frame_despair: {
    walkMult: 0.0,
    sprintMult: 0.0,
    suspRateMult: 1.0,
    pokerSuspRateMult: 1.0,
    interactSpeedMult: 0.0,
    reachBonus: 0.0,
    sprintExtraDrainMult: 1.0,
    timerDrainMult: 0.0,
    chaseThreshold: 35,
    terrifiesCrowds: false,
    stallInspectSec: 0.55,
    turnAgility: 0.0,
    swayRadians: 0.0
  }
};

/**
 * Johnny Rocketfingers Cynical Monologues (Verbatim barks preserved)
 * + Clean Player-Friendly Tactical Tips (No robotic EFFECT:/GOAL:/EXPR: tags)
 * + High-legibility 14px Comic Speech Bubble lines.
 */
export const DIALOGUES = {
  spawn_goi: {
    speaker: "INNER MONOLOGUE",
    expr: "sweating_squint",
    tip: "💡 TIP: Snake through Check-In & Security, then bribe or lure the janitor!",
    bubble: "Second prawn vindaloo was a mistake...",
    text: "That second prawn vindaloo by the beach was a tactical error. The restroom wing is taped off by a janitor—I need mints or a distraction!"
  },
  spawn_jfk: {
    speaker: "INNER MONOLOGUE",
    expr: "clenched_grimace",
    tip: "💡 TIP: Grab the Fast-Track Pass in Concourse A & clear both mop carts!",
    bubble: "JFK Terminal 4... colon at DEFCON 1!",
    text: "Terminal 4 is half a mile long, TSA is frisking everyone without a CLEAR pass, and my colon just declared DEFCON 1."
  },
  spawn_lhr: {
    speaker: "INNER MONOLOGUE",
    expr: "twitching_eyebrow",
    tip: "💡 TIP: Ride the forward walkway, time the shuttle doors, and watch the Loo janitor!",
    bubble: "Mind the gap—and my dignity!",
    text: "A lukewarm Heathrow steak-and-kidney pie has declared war on my lower intestine. Mind the gap—and my dignity."
  },
  spawn_sin: {
    speaker: "INNER MONOLOGUE",
    expr: "panic_stare",
    tip: "💡 TIP: The central waterfall speeds up cramps by 1.5x! Hug the outer skybridge!",
    bubble: "Why put a giant waterfall indoors?!",
    text: "Who puts a forty-meter roaring indoor waterfall inside a transit hub?! Even the ficus trees know I'm clenching."
  },
  spawn_dxb: {
    speaker: "INNER MONOLOGUE",
    expr: "noir_glare",
    tip: "💡 TIP: Dodge Perfume Spritzers, board the APM train, and unlock the 12-key Washlet!",
    bubble: "Perfume spritzers and a robo-toilet ahead!",
    text: "Duty-free perfume spritzers, an Automated People Mover train, and a 12-button Japanese robo-toilet standing between me and dishonor."
  },
  hit_wet_floor: {
    speaker: "WET MARBLE SLIP!",
    expr: "bergamot_stun",
    tip: "💡 TIP: Press [Y] Elbow Dash to recover instantly, or wear Rubber Flip-Flops!",
    bubble: "Whoa! Slippery mopped tiles!",
    text: "Mopped floor! Wet tiles! Without rubber flip-flops I'm a human curling stone of regret!"
  },
  saved_flipflops: {
    speaker: "FOOTWEAR UPGRADED",
    expr: "smirk_sweat",
    tip: "💡 TIP: Rubber Flip-Flops on! You can now sprint straight across wet puddles!",
    bubble: "Flip-flops on! Zero slip on wet marble!",
    text: "Duty-free rubber flip-flops equipped. Ugly as sin, grip wet terminal marble like snow tires."
  },
  spotted_waddling: {
    speaker: "SECURITY ALERT!",
    expr: "awkward_smile",
    tip: "💡 TIP: Tap [X] Poker Face, slow to a walk, or duck behind a kiosk!",
    bubble: "Act natural! Just stretching my calves, Officer!",
    text: "Act natural! Nothing says 'innocent traveler' like sweating through a linen shirt and crab-walking at 5.5 m/s."
  },
  locked_stall: {
    speaker: "OCCUPIED STALL!",
    expr: "twitching_eyebrow",
    tip: "💡 TIP: Door-rattle adrenaline active! Your next stall check is 3.5x faster!",
    bubble: "Locked?! Try the next door—fast!",
    text: "Locked! 'Occupied / Maintenance Required.' Brother, if I don't find the open door in ten seconds, you'll see real maintenance required."
  },
  bribe_pickup: {
    speaker: "POCKETED BREATH MINTS",
    expr: "smirk_sweat",
    tip: "💡 TIP: Walk up to the janitor's mop cart and press [A] to bribe him!",
    bubble: "Got spearmint! Time to bribe the janitor!",
    text: "Pocketed a tin of curiously strong mints. Now I can bribe the custodian taping off the restroom wing!"
  },
  bribe_mints: {
    speaker: "JANITOR BRIBED!",
    expr: "smirk_sweat",
    tip: "💡 TIP: The caution tape is down! Hurry into the Restroom Sanctuary!",
    bubble: "Keep the mints, mate—I need that stall!",
    text: "Slipped the custodian the imported spearmint tin. The yellow 'Cleaning in Progress' tape parts like the Red Sea!"
  },
  distract_triggered: {
    speaker: "CLEANUP ON AISLE 4!",
    expr: "noir_glare",
    tip: "💡 TIP: The janitor left his post to clean up your mess—the doorway is clear!",
    bubble: "Oops! Better go mop that up, pal!",
    text: "Chaos deployed! The custodian abandoned the restroom doorway with his mop bucket to clean up the mess!"
  },
  spicy_pretzel: {
    speaker: "JALAPEÑO RUSH!",
    expr: "panic_stare",
    tip: "💡 TIP: +28% turbo speed for 6s, but your stomach clock just lost 8s!",
    bubble: "Spicy pretzel! Turbo legs, angry colon!",
    text: "Free sample jalapeño pretzel?! Why did I chew that?! Adrenaline speed +28%, colon clock -8 seconds!"
  },
  tsa_patdown: {
    speaker: "RANDOM CHECKPOINT FRISK!",
    expr: "clenched_grimace",
    tip: "💡 TIP: Next run, grab the Fast-Track Pass in the lounge to skip the frisk!",
    bubble: "Watch the belt buckle, Officer!",
    text: "'Sir, step onto the mat and unbuckle your belt.' A 5-second pat-down AND he pressed right on my lower abdomen (-4s)!"
  },
  tsa_bypass: {
    speaker: "VIP FAST-TRACK PASS",
    expr: "smirk_sweat",
    tip: "💡 TIP: Diplomatic Pass equipped! Breeze through the security scanner with zero delay!",
    bubble: "Diplomatic Fast-Track! Step aside!",
    text: "Grabbed the forged Diplomatic Fast-Track pass. TSA won't lay a single latex glove on me now."
  },
  tsa_bypass_used: {
    speaker: "VIP LANE CLEARED!",
    expr: "smirk_sweat",
    tip: "💡 TIP: Skipped the 5-second pat-down! Keep moving toward the Concourse!",
    bubble: "VIP coming through—no pat-down today!",
    text: "Flashed the Fast-Track sticker at the scanner. The velvet rope dropped without a pat-down!"
  },
  waterfall_warn: {
    speaker: "ACOUSTIC TORTURE ZONE!",
    expr: "sweating_squint",
    tip: "💡 TIP: Roaring water triggers Cramp Waves 1.5x faster! Keep [B] Clench ready!",
    bubble: "That roaring waterfall is testing my willpower...",
    text: "SHHHHHH—fifty thousand gallons of cascading water per minute! Psychological torture is accelerating Cramp Waves by 1.5x!"
  },
  perfume_stun: {
    speaker: "DUTY-FREE AMBUSH!",
    expr: "bergamot_stun",
    tip: "💡 TIP: Blinded by bergamot! Tap [Y] Elbow Dash to clear the dizziness immediately!",
    bubble: "Gah! Bergamot right in the eyeballs!",
    text: "Ambush! Aggressive Eau de Cologne promoter spritzed my eyes! Blinded by bergamot for two seconds!"
  },
  crowd_jostle: {
    speaker: "LUGGAGE COLLISION!",
    expr: "clenched_grimace",
    tip: "💡 TIP: Tap [Y] Elbow Dash to barrel through crowds without losing stomach time!",
    bubble: "Watch that surfboard bag, buddy!",
    text: "Watch where you're swinging that surfboard bag, mate! Direct impact to the lower intestine (-2.0s)!"
  },
  clipboard_clue: {
    speaker: "JANITOR'S LOGBOOK",
    expr: "smirk_sweat",
    tip: "💡 TIP: The working toilet is now marked in bright green on your radar!",
    bubble: "Aha! Stall #4 is the unlocked throne!",
    text: "Checked the janitor's clipboard! I now know exactly which stall in the Restroom Wing is unlocked!"
  },
  cramp_hit_penalty: {
    speaker: "GUT CRAMP STRIKE!",
    expr: "panic_stare",
    tip: "💡 TIP: When the red warning bar flashes, slow to a walk or tap [B] Iron Clench!",
    bubble: "Oof! Caught sprinting during a cramp wave!",
    text: "Augh! Caught sprinting when the Cramp Wave hit! Lost 4.5 seconds—double-tap to Clench or walk when the warning flashes!"
  },
  poker_face_active: {
    speaker: "POKER FACE ENGAGED",
    expr: "noir_glare",
    tip: "💡 TIP: Whistling casually! Guards notice you 50% slower for 3.5 seconds!",
    bubble: "♪ Just whistling... totally relaxed...",
    text: "Locked in the toothpick glare. As long as I whistle lounge jazz, security thinks I'm just admiring the terminal ceiling."
  },
  elbow_dash_used: {
    speaker: "ELBOW DASH!",
    expr: "panic_stare",
    tip: "💡 TIP: Barrel through tourist crowds & shake off dizziness at 7.2 m/s!",
    bubble: "Coming through! Priority connection!",
    text: "Tucked the elbows and surged through the boarding queue like a duty-free bowling ball!"
  },
  loo_relocked: {
    speaker: "FICKLE LOO CUSTODIAN!",
    expr: "twitching_eyebrow",
    tip: "💡 TIP: The Heathrow attendant is fussing with the doors—lure him out first!",
    bubble: "Oi! Stop rattling the brass locks!",
    text: "The Heathrow attendant saw me checking doors and reshuffled the 'Out of Order' cones!"
  }
};

export const HANEDA_KEYS = [
  { k: "音姫", r: "OTOHIME", e: " Sound", win: false },
  { k: "おしり", r: "OSHIRI", e: "Rear Jet", win: false },
  { k: "ビデ", r: "BIDE", e: "Bidet", win: false },
  { k: "乾燥", r: "KANSOU", e: "Warm Air", win: false },
  { k: "水勢 +", r: "SUISEI+", e: "Max Pressure", win: false },
  { k: "温度", r: "ONDO", e: "Seat 42°C", win: false },
  { k: "脱臭", r: "DASSHUU", e: "Deodorizer", win: false },
  { k: "マッサージ", r: "MASSAJI", e: "Pulse", win: false },
  { k: "ノズル掃除", r: "NOZURU", e: "Nozzle Clean", win: false },
  { k: "止", r: "TOME", e: "Stop", win: false },
  { k: "流す", r: "NAGASU", e: "Flush", win: false },
  { k: "開 / OPEN", r: "HIRAKU", e: "UNLOCK LID!", win: true }
];
