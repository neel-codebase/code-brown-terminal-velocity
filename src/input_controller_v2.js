/**
 * @file input_controller_v2.js
 * @version 2.1.0
 * @description Unified Input Adapter for v2.1:
 *   - Automatic Computer Detection (WASD / Arrow Keys active immediately; hides screen radials on PC!)
 *   - Mobile/Tablet Touch Ergonomics (Portrait Center Dial + Landscape (L) Stick & (R) 4-Buttons)
 *   - BUG-03 Fix: Strict pointerId tracking so right-hand button taps never cancel left-thumb stick
 *   - Desktop Click-to-Interact / Inspect & Pause shortcut ([P] / [Esc])
 */

import { detectInitialDeviceClass } from "./tenant_classifier_v2.js";

export function createInputController(canvas, getGameState, actions) {
  const initialDevice = detectInitialDeviceClass();

  const dial = {
    active: false,
    pointerId: null, // BUG-03 FIX: Tracks dedicated thumb pointer ID
    homeX: 220,
    homeY: 700,
    ox: 220,
    oy: 700,
    cx: 220,
    cy: 700,
    maxR: 54,
    vx: 0,
    vy: 0,
    mag: 0,
    tier: "stop",
    lastTapMs: 0,
    inputSource: initialDevice === "desktop_computer" ? "keyboard" : "touch",
    hideTouchOverlay: initialDevice === "desktop_computer",
    sprintToggle: false
  };

  const keysDown = new Set();
  let prevGamepadBtns = [false, false, false, false];

  function syncHomePosition(orientationMode) {
    if (orientationMode === "landscape") {
      dial.homeX = 76;
      dial.homeY = canvas.height - 74;
      dial.maxR = 50;
    } else {
      dial.homeX = canvas.width * 0.5;
      dial.homeY = canvas.height - 92;
      dial.maxR = 54;
    }
    if (!dial.active) {
      dial.ox = dial.homeX;
      dial.oy = dial.homeY;
      dial.cx = dial.homeX;
      dial.cy = dial.homeY;
    }
  }

  function updateDialVector(px, py) {
    const dx = px - dial.ox;
    const dy = py - dial.oy;
    const dist = Math.hypot(dx, dy);
    const clamped = Math.min(dist, dial.maxR);
    const ang = Math.atan2(dy, dx);
    dial.cx = dial.ox + Math.cos(ang) * clamped;
    dial.cy = dial.oy + Math.sin(ang) * clamped;
    dial.mag = clamped / dial.maxR;

    if (dial.mag < 0.15) {
      dial.vx = 0;
      dial.vy = 0;
      dial.tier = "stop";
    } else {
      dial.vx = Math.cos(ang);
      dial.vy = Math.sin(ang);
      dial.tier = dial.mag < 0.65 ? "walk" : "sprint";
    }
  }

  // --- MULTI-TOUCH SAFE POINTER LISTENERS (BUG-03 FIXED + DESKTOP CLICK-TO-INSPECT) ---
  canvas.addEventListener("pointerdown", (e) => {
    if (actions.onUnlockAudio) actions.onUnlockAudio();
    const st = getGameState();
    if (st.state !== "playing") return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // If on Desktop Computer using a Mouse (pointerType === "mouse"), clicking canvas
    // inspects / triggers nearby objects instead of popping up a mobile thumb radial!
    if (e.pointerType === "mouse" && dial.hideTouchOverlay) {
      if (actions.onCanvasWorldClick) {
        actions.onCanvasWorldClick(x, y);
      }
      return;
    }

    // Touch input detected -> enable mobile touch overlays
    if (e.pointerType === "touch" || e.pointerType === "pen") {
      dial.hideTouchOverlay = false;
      dial.inputSource = "touch";
      if (actions.onInputModeChanged) actions.onInputModeChanged("touch", false);
      if (actions.onInputModeChange) actions.onInputModeChange("touch", false);
    }

    // Ignore touches in the compact top HUD bar
    if (y < 64) return;

    // In Landscape mode, right 35% of screen is reserved for the action buttons
    if (st.orientationMode === "landscape" && x > canvas.width * 0.64) {
      return;
    }

    // BUG-03 FIX: If a joystick pointer is already active, ignore additional fingers
    if (dial.active && dial.pointerId !== null && dial.pointerId !== e.pointerId) {
      return;
    }

    const now = performance.now();
    if (now - dial.lastTapMs < 250) {
      actions.onClenchB();
    }
    dial.lastTapMs = now;

    dial.active = true;
    dial.pointerId = e.pointerId;

    if (st.orientationMode === "landscape") {
      dial.ox = Math.max(54, Math.min(canvas.width * 0.35, x));
      dial.oy = Math.max(canvas.height * 0.4, Math.min(canvas.height - 54, y));
    } else {
      dial.ox = Math.max(60, Math.min(canvas.width - 130, x));
      dial.oy = Math.max(canvas.height * 0.5, Math.min(canvas.height - 60, y));
    }
    dial.cx = x;
    dial.cy = y;

    try {
      canvas.setPointerCapture(e.pointerId);
    } catch (_) {}

    updateDialVector(x, y);
  });

  window.addEventListener("pointermove", (e) => {
    if (!dial.active || e.pointerId !== dial.pointerId) return;
    const rect = canvas.getBoundingClientRect();
    updateDialVector(e.clientX - rect.left, e.clientY - rect.top);
  });

  function handlePointerRelease(e) {
    if (!dial.active || e.pointerId !== dial.pointerId) return;
    dial.active = false;
    dial.pointerId = null;
    dial.vx = 0;
    dial.vy = 0;
    dial.mag = 0;
    dial.tier = "stop";
    dial.ox = dial.homeX;
    dial.oy = dial.homeY;
    dial.cx = dial.homeX;
    dial.cy = dial.homeY;
  }

  window.addEventListener("pointerup", handlePointerRelease);
  window.addEventListener("pointercancel", handlePointerRelease);

  // --- KEYBOARD & HARDWARE GAMEPAD POLLING (AUTOMATIC COMPUTER MODE) ---
  window.addEventListener("keydown", (e) => {
    if (actions.onUnlockAudio) actions.onUnlockAudio();
    const st = getGameState();
    const k = e.key.toLowerCase();

    // Pause / Tactical Guide shortcut works during playing or paused
    if (k === "p" || k === "escape") {
      if (st.state === "playing" || st.state === "paused") {
        e.preventDefault();
        if (actions.onTogglePause) actions.onTogglePause();
        return;
      }
    }

    if (st.state !== "playing") return;

    // Automatically switch to clean Desktop Keyboard Mode (hiding mobile radials)
    if (!dial.hideTouchOverlay) {
      dial.hideTouchOverlay = true;
      dial.inputSource = "keyboard";
      if (actions.onInputModeChanged) actions.onInputModeChanged("keyboard", true);
      if (actions.onInputModeChange) actions.onInputModeChange("keyboard", true);
    }

    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) {
      e.preventDefault();
    }

    keysDown.add(k);

    if (k === "e" || k === "enter") {
      e.preventDefault();
      actions.onActionA();
    } else if (k === " ") {
      e.preventDefault();
      actions.onClenchB();
    } else if (k === "q") {
      e.preventDefault();
      actions.onPokerX();
    } else if (k === "f") {
      e.preventDefault();
      actions.onDashY();
    }
  });

  window.addEventListener("keyup", (e) => {
    keysDown.delete(e.key.toLowerCase());
  });

  function pollKeyboardAndGamepad() {
    if (dial.active && dial.pointerId !== null) return;

    // 1. Check Keyboard WASD / Arrow Keys
    let kx = 0;
    let ky = 0;
    if (keysDown.has("a") || keysDown.has("arrowleft")) kx -= 1;
    if (keysDown.has("d") || keysDown.has("arrowright")) kx += 1;
    if (keysDown.has("w") || keysDown.has("arrowup")) ky -= 1;
    if (keysDown.has("s") || keysDown.has("arrowdown")) ky += 1;

    if (kx !== 0 || ky !== 0) {
      const len = Math.hypot(kx, ky);
      dial.vx = kx / len;
      dial.vy = ky / len;
      // On Computer: WASD/Arrows walk smoothly by default; holding Shift sprints!
      const isSprintKey = keysDown.has("shift");
      dial.tier = isSprintKey ? "sprint" : "walk";
      dial.mag = isSprintKey ? 0.92 : 0.52;
      dial.cx = dial.ox + dial.vx * dial.maxR * dial.mag;
      dial.cy = dial.oy + dial.vy * dial.maxR * dial.mag;
      dial.inputSource = "keyboard";
      dial.hideTouchOverlay = true;
      return;
    }

    // 2. Check HTML5 Gamepad API (navigator.getGamepads)
    if (typeof navigator.getGamepads === "function") {
      const pads = navigator.getGamepads();
      const pad = pads && pads[0];
      if (pad) {
        const gx = pad.axes[0] || 0;
        const gy = pad.axes[1] || 0;
        const gMag = Math.min(1, Math.hypot(gx, gy));
        if (gMag > 0.16) {
          const ang = Math.atan2(gy, gx);
          dial.vx = Math.cos(ang);
          dial.vy = Math.sin(ang);
          dial.mag = gMag;
          dial.tier = gMag < 0.65 ? "walk" : "sprint";
          dial.cx = dial.ox + dial.vx * dial.maxR * gMag;
          dial.cy = dial.oy + dial.vy * dial.maxR * gMag;
          dial.inputSource = "gamepad";
          dial.hideTouchOverlay = true;
        } else if (dial.inputSource === "gamepad") {
          dial.vx = 0;
          dial.vy = 0;
          dial.mag = 0;
          dial.tier = "stop";
          dial.cx = dial.ox;
          dial.cy = dial.oy;
        }

        const b0 = !!(pad.buttons[0] && pad.buttons[0].pressed);
        const b1 = !!(pad.buttons[1] && pad.buttons[1].pressed);
        const b2 = !!(pad.buttons[2] && pad.buttons[2].pressed);
        const b3 = !!(pad.buttons[3] && pad.buttons[3].pressed);
        if (b0 && !prevGamepadBtns[0]) actions.onActionA();
        if (b1 && !prevGamepadBtns[1]) actions.onClenchB();
        if (b2 && !prevGamepadBtns[2]) actions.onPokerX();
        if (b3 && !prevGamepadBtns[3]) actions.onDashY();
        prevGamepadBtns = [b0, b1, b2, b3];
        if (gMag > 0.16) return;
      }
    }

    if (!dial.active) {
      dial.vx = 0;
      dial.vy = 0;
      dial.mag = 0;
      dial.tier = "stop";
      dial.cx = dial.ox;
      dial.cy = dial.oy;
    }
  }

  return {
    dial,
    syncHomePosition,
    pollKeyboardAndGamepad
  };
}
