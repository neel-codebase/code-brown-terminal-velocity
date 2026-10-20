/**
 * @file sim_engine_v2.js
 * @version 2.0.0
 * @description Pure Deterministic Simulation Engine for v2.0.
 * Fixes BUG-01 (Circle-vs-AABB Corner Sliding), BUG-02 (Guard Wall Collisions),
 * BUG-04 (Slow-Mo Detection Cooldown), and BUG-05 (LocalStorage Persistence).
 * Implements the 10-Expression Active Gameplay Dynamics Matrix (Section 5.3)
 * and the 4-Button Arcade Abilities ([A] Action, [B] Clench, [X] Poker Face, [Y] Elbow Dash).
 */

import { UI_COPY_V2, EXPRESSION_META, EXPRESSION_DYNAMICS, DIALOGUES } from "./config_copy_v2.js";
import { LEVELS_V2 } from "./maps_v2.js";

const SAVE_KEY_V2 = "code_brown_save_v2";

// ============================================================================
// BUG-01 FIX: TRUE CIRCLE-VS-AABB COLLISION & SMOOTH CORNER SLIDING
// ============================================================================
export function circleHitsAABB(cx, cy, r, rect) {
  const nearestX = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
  const nearestY = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
  const dx = cx - nearestX;
  const dy = cy - nearestY;
  return (dx * dx + dy * dy) < (r * r);
}

export function hitsAnyCollider(cx, cy, r, rects) {
  for (let i = 0; i < rects.length; i++) {
    if (circleHitsAABB(cx, cy, r, rects[i])) return rects[i];
  }
  return null;
}

/**
 * Moves a circular entity by (stepX, stepY) against AABB colliders.
 * If blocked on an axis near a wall corner, applies smooth perpendicular corner-slide
 * nudging so diagonal movement glides through 2.8m–4.5m doorways without snagging.
 */
export function moveEntityWithCornerSlide(entity, stepX, stepY, r, colliders, worldBounds) {
  const minX = 1.3 + r;
  const maxX = worldBounds.w - 1.3 - r;
  const minY = 1.3 + r;
  const maxY = worldBounds.h - 1.3 - r;

  // 1. Try X movement
  const targetX = Math.max(minX, Math.min(maxX, entity.x + stepX));
  const hitX = hitsAnyCollider(targetX, entity.y, r, colliders);
  if (!hitX) {
    entity.x = targetX;
  } else if (Math.abs(stepX) > 0.0001) {
    // Corner-slide nudge along Y if clipping top/bottom edge of hitX
    const centerRectY = hitX.y + hitX.h * 0.5;
    const distToTop = Math.abs(entity.y - hitX.y);
    const distToBot = Math.abs(entity.y - (hitX.y + hitX.h));
    if (Math.min(distToTop, distToBot) < r * 1.35) {
      const nudgeDir = entity.y < centerRectY ? -1 : 1;
      const nudgeY = entity.y + nudgeDir * Math.abs(stepX) * 0.55;
      if (!hitsAnyCollider(entity.x, nudgeY, r, colliders)) {
        entity.y = Math.max(minY, Math.min(maxY, nudgeY));
      }
    }
  }

  // 2. Try Y movement
  const targetY = Math.max(minY, Math.min(maxY, entity.y + stepY));
  const hitY = hitsAnyCollider(entity.x, targetY, r, colliders);
  if (!hitY) {
    entity.y = targetY;
  } else if (Math.abs(stepY) > 0.0001) {
    // Corner-slide nudge along X if clipping left/right edge of hitY
    const centerRectX = hitY.x + hitY.w * 0.5;
    const distToLeft = Math.abs(entity.x - hitY.x);
    const distToRight = Math.abs(entity.x - (hitY.x + hitY.w));
    if (Math.min(distToLeft, distToRight) < r * 1.35) {
      const nudgeDir = entity.x < centerRectX ? -1 : 1;
      const nudgeX = entity.x + nudgeDir * Math.abs(stepY) * 0.55;
      if (!hitsAnyCollider(nudgeX, entity.y, r, colliders)) {
        entity.x = Math.max(minX, Math.min(maxX, nudgeX));
      }
    }
  }
}

export function pointInRect(px, py, rect) {
  return px >= rect.x && px <= rect.x + rect.w && py >= rect.y && py <= rect.y + rect.h;
}

export function normalizeAngle(a) {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

function ccw(ax, ay, bx, by, cx, cy) {
  return (cy - ay) * (bx - ax) > (by - ay) * (cx - ax);
}

function segmentsIntersect(ax, ay, bx, by, cx, cy, dx, dy) {
  return ccw(ax, ay, cx, cy, dx, dy) !== ccw(bx, by, cx, cy, dx, dy) &&
         ccw(ax, ay, bx, by, cx, cy) !== ccw(ax, ay, bx, by, dx, dy);
}

export function segmentHitsRect(x1, y1, x2, y2, r) {
  if (pointInRect(x1, y1, r) || pointInRect(x2, y2, r)) return true;
  return (
    segmentsIntersect(x1, y1, x2, y2, r.x, r.y, r.x + r.w, r.y) ||
    segmentsIntersect(x1, y1, x2, y2, r.x + r.w, r.y, r.x + r.w, r.y + r.h) ||
    segmentsIntersect(x1, y1, x2, y2, r.x, r.y + r.h, r.x + r.w, r.y + r.h) ||
    segmentsIntersect(x1, y1, x2, y2, r.x, r.y, r.x, r.y + r.h)
  );
}

export function isGuardSeeingPlayer(g, px, py, walls) {
  const dx = px - g.x;
  const dy = py - g.y;
  const dist = Math.hypot(dx, dy);
  if (dist > g.range) return false;
  const dirToPlayer = Math.atan2(dy, dx);
  const diff = Math.abs(normalizeAngle(dirToPlayer - g.angle));
  if (diff > (g.fovDeg * Math.PI) / 360) return false;
  for (let i = 0; i < walls.length; i++) {
    if (segmentHitsRect(g.x, g.y, px, py, walls[i])) return false;
  }
  return true;
}

// ============================================================================
// SIMULATION STATE & PERSISTENCE FACTORY
// ============================================================================
export function createSimulationEngine(callbacks) {
  // BUG-05 FIX: Load persisted save state from localStorage safely
  let savedData = {};
  try {
    const raw = localStorage.getItem(SAVE_KEY_V2);
    if (raw) savedData = JSON.parse(raw) || {};
  } catch (_) {}

  const sim = {
    state: "menu", // "menu" | "playing" | "bidet" | "won" | "lost"
    difficulty: savedData.difficulty || "standard",
    orientationMode:
      savedData.orientationMode ||
      (window.innerWidth > window.innerHeight ? "landscape" : "portrait"),
    safeTitle: !!savedData.safeTitle,
    bestRecords: savedData.bestRecords || {},

    currentLevelIdx: 0,
    activeLvl: null,
    timerSec: 68,
    maxTimerSec: 68,
    suspicion: 0,
    crampClock: 0,
    crampActiveSec: 0,
    timeToNextCramp: 15,
    bidetClock: 5.0,
    worldClock: 0,
    shuttleOpen: true,
    shuttleTimer: 0,
    waterfallWarned: false,
    slowMoTimer: 0,
    bannerClock: 0,
    screenShakeTimer: 0,
    perfumeFlashTimer: 0,

    activeExpression: "noir_glare",
    overrideExpression: null,
    overrideExprTimer: 0,
    menuExprIdx: 0,

    speechBubbles: [], // High-legibility 14px comic speech bubbles (Section 7.2)
    nearestInteractable: null, // Exposed for [A] button pulsing & prompt

    player: {
      x: 6.5,
      y: 56.5,
      r: 0.42,
      flipFlops: false,
      item: null,
      tsaPass: false,
      clipboardRevealed: false,
      hiding: false,
      clenchActive: 0,
      clenchCd: 0,
      pokerFaceTimer: 0,
      pokerFaceCd: 0,
      elbowDashTimer: 0,
      elbowDashCd: 0,
      dashDirX: 0,
      dashDirY: -1,
      slipTimer: 0,
      slipVx: 0,
      slipVy: 0,
      friskTimer: 0,
      speedBoostTimer: 0,
      stunTimer: 0,
      crowdBumpCd: 0,
      spottedBarkCd: 0, // BUG-04 FIX: 14s cooldown so slow-mo never stutters repeatedly
      chasedOnceThisAlert: false,
      dwellPropId: null,
      dwellTime: 0,
      waddlePhase: 0,
      facingX: 0,
      facingY: -1
    }
  };

  function saveProgress() {
    try {
      localStorage.setItem(
        SAVE_KEY_V2,
        JSON.stringify({
          bestRecords: sim.bestRecords,
          difficulty: sim.difficulty,
          orientationMode: sim.orientationMode,
          safeTitle: sim.safeTitle
        })
      );
    } catch (_) {}
  }

  function spawnSpeechBubble(worldX, worldY, text, speakerType = "player", duration = 2.4) {
    // Keep at most 2 active bubbles so screen stays crisp and uncluttered
    if (sim.speechBubbles.length >= 2) {
      sim.speechBubbles.shift();
    }
    sim.speechBubbles.push({
      x: worldX,
      y: worldY,
      text,
      speakerType,
      life: duration,
      maxLife: duration,
      followPlayer: speakerType === "player" || speakerType === "alert"
    });
  }

  function triggerEventBark(key, withSlowMo = true) {
    const d = DIALOGUES[key];
    if (!d) return;
    sim.overrideExpression = d.expr;
    sim.overrideExprTimer = 3.6;
    sim.bannerClock = 4.6;
    if (withSlowMo) {
      sim.slowMoTimer = 1.35;
    }
    if (d.bubble && sim.activeLvl) {
      const bubbleType =
        d.expr === "panic_stare" || d.expr === "clenched_grimace" || d.expr === "bergamot_stun"
          ? "alert"
          : "player";
      spawnSpeechBubble(sim.player.x, sim.player.y, d.bubble, bubbleType, 2.7);
    }
    if (callbacks.onShowBanner) {
      callbacks.onShowBanner(d);
    }
  }

  function getDiffCfg() {
    return UI_COPY_V2.difficulties[sim.difficulty] || UI_COPY_V2.difficulties.standard;
  }

  function evaluateActiveExpression(dialTier, spottedNow) {
    const p = sim.player;
    const ratio = sim.timerSec / sim.maxTimerSec;

    if (p.clenchActive > 0) return "iron_clench";
    if (p.pokerFaceTimer > 0) return "noir_glare";
    if (p.stunTimer > 0 || p.slipTimer > 0) return "bergamot_stun";
    if (sim.overrideExprTimer > 0 && sim.overrideExpression) return sim.overrideExpression;
    if (spottedNow && dialTier === "walk") return "awkward_smile";
    if (spottedNow && dialTier === "sprint") return "panic_stare";
    if (sim.crampActiveSec > 0 || sim.timeToNextCramp <= 3.0) return "clenched_grimace";
    if (ratio < 0.18 || sim.suspicion >= 75) return "panic_stare";
    if (ratio < 0.35) return "clenched_grimace";
    if (ratio < 0.65) return "sweating_squint";
    return "noir_glare";
  }

  function startLevel(idx) {
    sim.currentLevelIdx = idx;
    sim.activeLvl = JSON.parse(JSON.stringify(LEVELS_V2[idx]));

    // Shuffle which Mystery Stall is the winning Open Throne
    const openIdx = Math.floor(Math.random() * sim.activeLvl.stalls.length);
    sim.activeLvl.stalls.forEach((s, i) => {
      s.open = i === openIdx;
      s.inspected = false;
    });

    const dCfg = getDiffCfg();
    sim.maxTimerSec = Math.round(sim.activeLvl.parSec * dCfg.timerMult);
    sim.timerSec = sim.maxTimerSec;
    sim.suspicion = 0;
    sim.crampClock = 0;
    sim.crampActiveSec = 0;
    sim.timeToNextCramp = sim.activeLvl.crampInterval;
    sim.shuttleOpen = true;
    sim.shuttleTimer = 0;
    sim.waterfallWarned = false;
    sim.slowMoTimer = 0;
    sim.bannerClock = 0;
    sim.screenShakeTimer = 0;
    sim.perfumeFlashTimer = 0;
    sim.speechBubbles = [];
    sim.nearestInteractable = null;

    Object.assign(sim.player, {
      x: sim.activeLvl.spawn.x,
      y: sim.activeLvl.spawn.y,
      flipFlops: false,
      item: null,
      tsaPass: false,
      clipboardRevealed: false,
      hiding: false,
      clenchActive: 0,
      clenchCd: 0,
      pokerFaceTimer: 0,
      pokerFaceCd: 0,
      elbowDashTimer: 0,
      elbowDashCd: 0,
      dashDirX: 0,
      dashDirY: -1,
      slipTimer: 0,
      slipVx: 0,
      slipVy: 0,
      friskTimer: 0,
      speedBoostTimer: 0,
      stunTimer: 0,
      crowdBumpCd: 0,
      spottedBarkCd: 0,
      chasedOnceThisAlert: false,
      dwellPropId: null,
      dwellTime: 0,
      waddlePhase: 0,
      facingX: 1,
      facingY: 0
    });

    sim.state = "playing";
    triggerEventBark(sim.activeLvl.spawnBark, false);
    if (callbacks.onStateChanged) callbacks.onStateChanged();
  }

  // ============================================================================
  // 4-BUTTON ARCADE ABILITIES ([A] ACTION, [B] CLENCH, [X] POKER, [Y] DASH)
  // ============================================================================
  function triggerClench() {
    const p = sim.player;
    if (sim.state !== "playing") return;
    if (p.clenchCd <= 0 && p.clenchActive <= 0) {
      p.clenchActive = 1.6;
      p.clenchCd = 11.0;
      sim.crampClock = Math.max(0, sim.crampClock - 5.0);
      sim.overrideExpression = "iron_clench";
      sim.overrideExprTimer = 1.6;
      spawnSpeechBubble(p.x, p.y, "IRON CLENCH! Clock frozen & cramp blocked!", "player", 1.8);
    }
  }

  function triggerPokerFace() {
    const p = sim.player;
    if (sim.state !== "playing") return;
    if (p.pokerFaceCd <= 0 && p.pokerFaceTimer <= 0) {
      p.pokerFaceTimer = 3.5;
      p.pokerFaceCd = 10.0;
      sim.overrideExpression = "noir_glare";
      sim.overrideExprTimer = 3.5;
      triggerEventBark("poker_face_active", false);
    }
  }

  function triggerElbowDash(dial) {
    const p = sim.player;
    if (sim.state !== "playing") return;
    if (p.elbowDashCd <= 0 && p.elbowDashTimer <= 0 && p.friskTimer <= 0) {
      p.elbowDashTimer = 0.6;
      p.elbowDashCd = 8.0;
      // Costs -1.0s stamina on the bowel clock, but clears stun/slip & parts crowds!
      sim.timerSec = Math.max(1.0, sim.timerSec - 1.0);
      p.stunTimer = 0;
      p.slipTimer = 0;
      sim.perfumeFlashTimer = 0;
      if (dial && dial.mag > 0.1) {
        p.dashDirX = dial.vx;
        p.dashDirY = dial.vy;
      } else {
        p.dashDirX = p.facingX || 0;
        p.dashDirY = p.facingY || -1;
      }
      triggerEventBark("elbow_dash_used", false);
    }
  }

  function executeContextInteraction(target) {
    const p = sim.player;
    const lvl = sim.activeLvl;
    if (!target || !lvl) return;

    if (target.kind === "prop") {
      const prop = target.ref;
      if (prop.type === "cover") {
        p.hiding = true;
        sim.suspicion = Math.max(0, sim.suspicion - 35);
        spawnSpeechBubble(p.x, p.y, "📰 Hiding behind the Financial Times...", "player", 1.8);
      } else if (prop.type === "footwear") {
        prop.used = true;
        p.flipFlops = true;
        triggerEventBark("saved_flipflops", true);
      } else if (prop.type === "bribe") {
        prop.used = true;
        p.item = "mints";
        triggerEventBark("bribe_pickup", true);
      } else if (prop.type === "tsa_pass") {
        prop.used = true;
        p.tsaPass = true;
        triggerEventBark("tsa_bypass", true);
      } else if (prop.type === "spicy_food") {
        prop.used = true;
        p.speedBoostTimer = 6.0;
        sim.timerSec = Math.max(0.5, sim.timerSec - 8.0);
        sim.screenShakeTimer = 0.4;
        triggerEventBark("spicy_pretzel", true);
      } else if (prop.type === "intel_clipboard") {
        prop.used = true;
        p.clipboardRevealed = true;
        lvl.stalls.forEach((s) => {
          if (s.open) s.inspected = true;
        });
        triggerEventBark("clipboard_clue", true);
      } else if (prop.type === "distract") {
        prop.used = true;
        const hz = lvl.hazards.find((h) => h.id === prop.target);
        if (hz) hz.cleared = true;
        triggerEventBark("distract_triggered", true);
      }
    } else if (target.kind === "hazard_bribe") {
      const hz = target.ref;
      hz.cleared = true;
      p.item = null;
      triggerEventBark("bribe_mints", true);
    } else if (target.kind === "stall") {
      const st = target.ref;
      st.inspected = true;
      if (st.open) {
        if (lvl.bidetBoss) {
          sim.state = "bidet";
          sim.bidetClock = 5.0;
          if (callbacks.onOpenBidetModal) callbacks.onOpenBidetModal();
        } else {
          finishRun(true, "THRONE SECURED IN TIME!");
        }
      } else {
        sim.timerSec = Math.max(0.2, sim.timerSec - 1.5);
        sim.screenShakeTimer = 0.28;
        triggerEventBark("locked_stall", true);
      }
    }
  }

  function triggerInstantAction() {
    if (sim.state !== "playing") return;
    if (sim.nearestInteractable) {
      executeContextInteraction(sim.nearestInteractable);
      sim.player.dwellTime = 0;
    } else {
      spawnSpeechBubble(
        sim.player.x,
        sim.player.y,
        "Move closer to an item, trash bin, janitor, or stall door!",
        "player",
        1.5
      );
    }
  }

  function finishRun(won, reason) {
    sim.state = won ? "won" : "lost";
    if (!won) {
      sim.activeExpression = "freeze_frame_despair";
    }
    if (won && sim.activeLvl) {
      const prev = sim.bestRecords[sim.activeLvl.id] || 0;
      if (sim.timerSec > prev) {
        sim.bestRecords[sim.activeLvl.id] = sim.timerSec;
        saveProgress();
      }
    }
    if (callbacks.onFinishRun) {
      callbacks.onFinishRun(won, reason);
    }
  }

  // ============================================================================
  // MAIN DETERMINISTIC TICK (60 FPS)
  // ============================================================================
  function updateSimulation(rawDt, dial) {
    sim.worldClock += rawDt;
    if (sim.bannerClock > 0) {
      sim.bannerClock -= rawDt;
      if (sim.bannerClock <= 0 && callbacks.onHideBanner) {
        callbacks.onHideBanner();
      }
    }
    if (sim.slowMoTimer > 0) sim.slowMoTimer = Math.max(0, sim.slowMoTimer - rawDt);
    if (sim.screenShakeTimer > 0) sim.screenShakeTimer = Math.max(0, sim.screenShakeTimer - rawDt);
    if (sim.perfumeFlashTimer > 0) sim.perfumeFlashTimer = Math.max(0, sim.perfumeFlashTimer - rawDt);
    if (sim.overrideExprTimer > 0) sim.overrideExprTimer = Math.max(0, sim.overrideExprTimer - rawDt);

    // Update speech bubbles in real time so players can always read them during slow-mo
    for (let i = sim.speechBubbles.length - 1; i >= 0; i--) {
      const b = sim.speechBubbles[i];
      b.life -= rawDt;
      if (b.followPlayer) {
        b.x = sim.player.x;
        b.y = sim.player.y;
      }
      if (b.life <= 0) sim.speechBubbles.splice(i, 1);
    }

    if (sim.state === "bidet") {
      sim.bidetClock -= rawDt;
      if (sim.bidetClock <= 0) {
        finishRun(false, "CODE BROWN: FAILED TO UNLOCK THE ELECTRONIC BIDET LID IN 5.0s!");
      }
      return;
    }

    if (sim.state !== "playing" || !sim.activeLvl) return;

    // Tactical Comedy Slow-Mo dilation (0.25x during dramatic cut-in)
    const dt = sim.slowMoTimer > 0 ? rawDt * 0.25 : rawDt;
    const p = sim.player;
    const lvl = sim.activeLvl;
    const dCfg = getDiffCfg();

    // Update ability cooldowns
    if (p.clenchActive > 0) p.clenchActive = Math.max(0, p.clenchActive - rawDt);
    if (p.clenchCd > 0) p.clenchCd = Math.max(0, p.clenchCd - rawDt);
    if (p.pokerFaceTimer > 0) p.pokerFaceTimer = Math.max(0, p.pokerFaceTimer - rawDt);
    if (p.pokerFaceCd > 0) p.pokerFaceCd = Math.max(0, p.pokerFaceCd - rawDt);
    if (p.elbowDashTimer > 0) p.elbowDashTimer = Math.max(0, p.elbowDashTimer - rawDt);
    if (p.elbowDashCd > 0) p.elbowDashCd = Math.max(0, p.elbowDashCd - rawDt);
    if (p.speedBoostTimer > 0) p.speedBoostTimer = Math.max(0, p.speedBoostTimer - dt);
    if (p.stunTimer > 0) p.stunTimer = Math.max(0, p.stunTimer - dt);
    if (p.friskTimer > 0) p.friskTimer = Math.max(0, p.friskTimer - dt);
    if (p.crowdBumpCd > 0) p.crowdBumpCd = Math.max(0, p.crowdBumpCd - dt);
    if (p.spottedBarkCd > 0) p.spottedBarkCd = Math.max(0, p.spottedBarkCd - rawDt);

    // Evaluate current expression & fetch its active gameplay modifiers (Section 5.3)
    const dyn = EXPRESSION_DYNAMICS[sim.activeExpression] || EXPRESSION_DYNAMICS.noir_glare;

    // Timed Shuttle Gate (Levels 3 & 5)
    if (lvl.shuttleGateY !== null) {
      sim.shuttleTimer += dt;
      sim.shuttleOpen = (sim.shuttleTimer % 9.5) < 6.2;
    }

    // Build active solid colliders (walls + sealed mop barricades + closed shuttle door)
    const colliders = [...lvl.walls];
    lvl.hazards.forEach((hz) => {
      if (!hz.cleared) {
        colliders.push({
          x: hz.x - hz.w * 0.5,
          y: hz.y - hz.h * 0.5,
          w: hz.w,
          h: hz.h,
          isHazard: true
        });
      }
    });
    if (lvl.shuttleGateY !== null && !sim.shuttleOpen) {
      colliders.push({ x: 1.2, y: lvl.shuttleGateY - 0.6, w: 12.0, h: 1.2 });
    }

    // --- 1. BOWEL PRESSURE & CRAMP WAVE SYSTEM ---
    let waterfallMult = 1.0;
    if (lvl.waterfallZone && pointInRect(p.x, p.y, lvl.waterfallZone)) {
      waterfallMult = lvl.waterfallZone.mult;
      if (!sim.waterfallWarned) {
        sim.waterfallWarned = true;
        triggerEventBark("waterfall_warn", true);
      }
    }

    sim.crampClock += dt * waterfallMult * dCfg.crampMult;
    sim.timeToNextCramp = Math.max(0, lvl.crampInterval - sim.crampClock);
    if (sim.crampClock >= lvl.crampInterval) {
      sim.crampClock = 0;
      sim.crampActiveSec = 2.0;
      sim.timeToNextCramp = lvl.crampInterval;
    }

    let crampPenalty = 0;
    if (sim.crampActiveSec > 0) {
      sim.crampActiveSec -= dt;
      if (dial.tier === "sprint" && p.clenchActive <= 0 && !dyn.crampImmune) {
        crampPenalty = 2.4;
        if (sim.screenShakeTimer <= 0) {
          sim.screenShakeTimer = 0.35;
          triggerEventBark("cramp_hit_penalty", false);
        }
      }
    }

    if (p.clenchActive <= 0 && dyn.timerDrainMult !== 0.0) {
      // Expression modifier: clenched_grimace reduces extra sprint drain by 15%
      const extraSprintDrain = 0.25 * (dyn.sprintExtraDrainMult ?? 1.0);
      const baseDrain = dial.tier === "sprint" ? 1.0 + extraSprintDrain : 1.0;
      sim.timerSec -= (baseDrain + crampPenalty) * dt;
    }

    if (sim.timerSec <= 0) {
      sim.timerSec = 0;
      finishRun(false, "CODE BROWN: BOWEL PRESSURE REACHED CRITICAL MASS!");
      return;
    }

    // --- 2. PLAYER MOVEMENT WITH EXPRESSION DYNAMICS & CORNER SLIDING ---
    let moveVx = 0;
    let moveVy = 0;

    if (p.friskTimer > 0 || p.clenchActive > 0) {
      moveVx = 0;
      moveVy = 0;
    } else if (p.elbowDashTimer > 0) {
      // [Y] ELBOW DASH: 7.2 m/s burst!
      moveVx = p.dashDirX * 7.2;
      moveVy = p.dashDirY * 7.2;
      p.waddlePhase += dt * 22;
    } else if (p.stunTimer > 0 && dial.tier === "stop") {
      moveVx = 0;
      moveVy = 0;
    } else if (p.slipTimer > 0) {
      p.slipTimer -= dt;
      moveVx = p.slipVx;
      moveVy = p.slipVy;
    } else if (dial.tier !== "stop") {
      p.hiding = false;
      let spd = dial.tier === "walk" ? 3.3 * dyn.walkMult : 5.6 * dyn.sprintMult;
      if (p.speedBoostTimer > 0) spd *= 1.28;
      if (sim.crampActiveSec > 0 && dial.tier === "sprint") spd *= 0.58;

      // Apply Bergamot Stun drunken steering sway (+0.35 rad sinusoidal wobble)
      let dirAngle = Math.atan2(dial.vy, dial.vx);
      if (dyn.swayRadians > 0) {
        dirAngle += Math.sin(sim.worldClock * 11.0) * dyn.swayRadians;
      }

      moveVx = Math.cos(dirAngle) * spd;
      moveVy = Math.sin(dirAngle) * spd;
      p.facingX = Math.cos(dirAngle);
      p.facingY = Math.sin(dirAngle);
      p.waddlePhase += dt * (dial.tier === "sprint" ? 18 : 9);
    }

    // Add Moving Walkway / Reversing Travelator velocity
    for (let i = 0; i < lvl.walkways.length; i++) {
      const wk = lvl.walkways[i];
      if (pointInRect(p.x, p.y, wk)) {
        moveVx += wk.vx;
        moveVy += wk.vy;
      }
    }

    // BUG-01 FIX: Use Circle-vs-AABB with smooth corner-slide nudging
    moveEntityWithCornerSlide(p, moveVx * dt, moveVy * dt, p.r, colliders, lvl.world);

    // Wet Floor Slip Check
    if (!p.flipFlops && p.slipTimer <= 0 && p.elbowDashTimer <= 0 && Math.hypot(moveVx, moveVy) > 1.2) {
      for (let i = 0; i < lvl.wetZones.length; i++) {
        if (pointInRect(p.x, p.y, lvl.wetZones[i])) {
          p.slipTimer = 1.8;
          const mag = Math.hypot(moveVx, moveVy) || 1;
          p.slipVx = (moveVx / mag) * 6.4;
          p.slipVy = (moveVy / mag) * 6.4;
          sim.screenShakeTimer = 0.25;
          triggerEventBark("hit_wet_floor", true);
          break;
        }
      }
    }

    // --- 3. MOVING PASSENGER CROWDS & PANIC_STARE CROWD PARTING ---
    lvl.crowds.forEach((c) => {
      if (c.dir === undefined) c.dir = 1;
      const tx = c.dir === 1 ? c.bx : c.ax;
      const ty = c.dir === 1 ? c.by : c.ay;
      const dx = tx - c.x;
      const dy = ty - c.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 0.35) {
        c.dir *= -1;
      } else {
        c.x += (dx / dist) * c.spd * dt;
        c.y += (dy / dist) * c.spd * dt;
      }

      const dPlayer = Math.hypot(p.x - c.x, p.y - c.y);

      // Section 5.3: panic_stare OR [Y] Elbow Dash causes tourist crowds within 2.3m to step aside!
      if ((dyn.terrifiesCrowds || p.elbowDashTimer > 0) && dPlayer < 2.35 && dPlayer > 0.01) {
        const pushAwayY = c.y < p.y ? -1 : 1;
        c.y = Math.max(2.2, Math.min(lvl.world.h - 2.2, c.y + pushAwayY * 3.8 * dt));
        c.partedTimer = 0.9;
      } else if (c.partedTimer > 0) {
        c.partedTimer -= dt;
      }

      // Crowd bump penalty (skipped if Elbow Dashing or crowd parted by panic_stare!)
      if (
        dPlayer < p.r + c.r &&
        p.crowdBumpCd <= 0 &&
        p.friskTimer <= 0 &&
        p.elbowDashTimer <= 0 &&
        !dyn.terrifiesCrowds
      ) {
        p.crowdBumpCd = 2.6;
        sim.timerSec = Math.max(0.5, sim.timerSec - 2.0);
        sim.screenShakeTimer = 0.3;
        const pushAng = Math.atan2(p.y - c.y, p.x - c.x);
        moveEntityWithCornerSlide(
          p,
          Math.cos(pushAng) * 0.9,
          Math.sin(pushAng) * 0.9,
          p.r,
          colliders,
          lvl.world
        );
        triggerEventBark("crowd_jostle", true);
      }
    });

    // --- 4. AUTOMATIC PROPS (TSA FRISK & PERFUME SPRITZERS) ---
    lvl.props.forEach((prop) => {
      if (prop.used) return;
      const d = Math.hypot(p.x - prop.x, p.y - prop.y);
      if (prop.type === "security_frisk" && d < prop.r) {
        prop.used = true;
        if (p.tsaPass) {
          triggerEventBark("tsa_bypass_used", false);
        } else {
          p.friskTimer = 4.5;
          sim.timerSec = Math.max(0.5, sim.timerSec - 4.0);
          sim.screenShakeTimer = 0.35;
          triggerEventBark("tsa_patdown", true);
        }
      } else if (prop.type === "perfume_ambush" && d < prop.r && p.elbowDashTimer <= 0) {
        prop.used = true;
        p.stunTimer = 2.0;
        sim.perfumeFlashTimer = 2.0;
        sim.screenShakeTimer = 0.25;
        triggerEventBark("perfume_stun", true);
      }
    });

    // --- 5. CONTEXTUAL INTERACTABLE SCAN & PASSIVE / [A] BUTTON TRIGGER ---
    let bestTarget = null;
    let bestDist = 1.85 + (dyn.reachBonus || 0);

    lvl.props.forEach((prop) => {
      if (prop.used || prop.type === "security_frisk" || prop.type === "perfume_ambush") return;
      const d = Math.hypot(p.x - prop.x, p.y - prop.y);
      if (d < bestDist) {
        bestDist = d;
        bestTarget = { kind: "prop", ref: prop, id: prop.id, label: prop.label };
      }
    });

    lvl.hazards.forEach((hz) => {
      if (!hz.cleared && p.item === "mints") {
        const d = Math.hypot(p.x - hz.x, p.y - hz.y);
        if (d < 2.8 + (dyn.reachBonus || 0)) {
          bestTarget = {
            kind: "hazard_bribe",
            ref: hz,
            id: hz.id,
            label: "🍬 BRIBE JANITOR WITH MINTS"
          };
        }
      }
    });

    lvl.stalls.forEach((st) => {
      const cx = st.x + st.w * 0.5;
      const cy = st.y + st.h;
      const d = Math.hypot(p.x - cx, p.y - cy);
      if (d < 2.3 + (dyn.reachBonus || 0)) {
        bestTarget = {
          kind: "stall",
          ref: st,
          id: st.id,
          label: st.inspected ? (st.open ? "🚽 ENTER OPEN THRONE!" : "🔒 LOCKED STALL") : "🚽 CHECK STALL DOOR"
        };
      }
    });

    sim.nearestInteractable = bestTarget;

    // Passive dwell interaction when thumb released (accelerated by expression modifiers!)
    if (bestTarget && dial.tier === "stop" && p.friskTimer <= 0) {
      if (p.dwellPropId !== bestTarget.id) {
        p.dwellPropId = bestTarget.id;
        p.dwellTime = 0;
      }
      p.dwellTime += dt * (dyn.interactSpeedMult || 1.0);
      const reqTime = bestTarget.kind === "stall" ? (dyn.stallInspectSec || 0.50) : 0.48;
      if (p.dwellTime >= reqTime) {
        executeContextInteraction(bestTarget);
        p.dwellTime = 0;
      }
    } else {
      p.dwellPropId = null;
      p.dwellTime = 0;
    }

    // --- 6. GUARD PATROL, CHASE AI (BUG-02 FIXED) & STEALTH SUSPICION ---
    let spottedByAny = false;
    const activeChaseThreshold = dyn.chaseThreshold || 35;

    lvl.guards.forEach((g) => {
      // BUG-02 FIX: Chasing guards use moveEntityWithCornerSlide against colliders!
      if (sim.suspicion >= activeChaseThreshold && !p.hiding) {
        const dx = p.x - g.x;
        const dy = p.y - g.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0.65) {
          const chaseSpd = g.spd * 1.18 * dCfg.chaseMult;
          const stepX = (dx / dist) * chaseSpd * dt;
          const stepY = (dy / dist) * chaseSpd * dt;
          const prevX = g.x;
          const prevY = g.y;
          moveEntityWithCornerSlide(g, stepX, stepY, 0.36, colliders, lvl.world);
          // If blocked on Y by a horizontal divider wall, slide horizontally toward nearest gap
          if (Math.hypot(g.x - prevX, g.y - prevY) < chaseSpd * dt * 0.25) {
            const slideSign = dx >= 0 ? 1 : -1;
            moveEntityWithCornerSlide(g, slideSign * chaseSpd * dt, 0, 0.36, colliders, lvl.world);
          }
          g.angle = Math.atan2(dy, dx);
        }
      } else {
        const tx = g.dir === 1 ? g.bx : g.ax;
        const ty = g.dir === 1 ? g.by : g.ay;
        const dx = tx - g.x;
        const dy = ty - g.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 0.28) {
          g.dir *= -1;
        } else {
          moveEntityWithCornerSlide(
            g,
            (dx / dist) * g.spd * dt,
            (dy / dist) * g.spd * dt,
            0.36,
            colliders,
            lvl.world
          );
          g.angle = Math.atan2(dy, dx);
        }
      }

      if (!p.hiding && isGuardSeeingPlayer(g, p.x, p.y, colliders)) {
        spottedByAny = true;

        // Level 3 Heathrow Fickle Custodian mechanic: relocks an inspected decoy if spotted in Wing 4
        if (lvl.fickleCustodian && g.id === "g_lhr_3" && p.y < 16 && p.spottedBarkCd <= 0) {
          p.spottedBarkCd = 14.0;
          triggerEventBark("loo_relocked", false);
        }
      }
    });

    if (spottedByAny) {
      let baseRate = dial.tier === "sprint" ? 36.0 : (dial.tier === "walk" ? 13.0 : 5.0);
      // Apply Expression Suspicion Modifier & [X] Poker Face 50% Reduction!
      const exprSuspMult =
        p.pokerFaceTimer > 0 ? dyn.pokerSuspRateMult : (dyn.suspRateMult || 1.0);
      sim.suspicion = Math.min(100, sim.suspicion + baseRate * dCfg.suspMult * exprSuspMult * dt);

      // BUG-04 FIX: Only trigger slow-mo spotted bark once per alert/cooldown (14s CD)
      if (dial.tier === "sprint" && sim.suspicion > 26 && p.spottedBarkCd <= 0) {
        p.spottedBarkCd = 14.0;
        const firstSightSlowMo = !p.chasedOnceThisAlert;
        p.chasedOnceThisAlert = true;
        triggerEventBark("spotted_waddling", firstSightSlowMo);
      }
    } else {
      sim.suspicion = Math.max(0, sim.suspicion - 15.0 * dt);
      if (sim.suspicion < 10) {
        p.chasedOnceThisAlert = false;
      }
    }

    if (sim.suspicion >= 100) {
      finishRun(false, "DETAINED BY AIRPORT SECURITY FOR SUSPICIOUS WADDLING!");
      return;
    }

    // Update active expression for HUD, in-world 36px head, and next-frame physics
    sim.activeExpression = evaluateActiveExpression(dial.tier, spottedByAny);
  }

  return {
    sim,
    saveProgress,
    startLevel,
    updateSimulation,
    triggerClench,
    triggerPokerFace,
    triggerElbowDash,
    triggerInstantAction,
    finishRun,
    spawnSpeechBubble
  };
}
