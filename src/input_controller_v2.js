/**
 * @file input_controller_v2.js
 * @version 2.0.0
 * @description Unified Input Adapter for v2.0 (Portrait Center Thumb Dial +
 * Landscape (L) Virtual Joystick & (R) 4-Button Arcade Diamond + Keyboard/Gamepad).
 * Includes BUG-03 Fix: Strict pointerId tracking so right-hand button taps never
 * cancel left-thumb joystick movement.
 */

export function createInputController(canvas, getGameState, actions) {
  const dial = {
    active: false,
    pointerId: null, // BUG-03 FIX: Tracks dedicated thumb pointer ID
    homeX: 220,
    homeY: 700,
    ox: 220,
    oy: 700,
    cx: 220,
    cy: 700,
    maxR: 64,
    vx: 0,
    vy: 0,
    mag: 0,
    tier: "stop",
    lastTapMs: 0,
    inputSource: "touch" // "touch" | "keyboard" | "gamepad"
  };

  const keysDown = new Set();
  let prevGamepadBtns = [false, false, false, false];

  function syncHomePosition(orientationMode) {
    if (orientationMode === "landscape") {
      // Bottom-left virtual analog joystick anchor (Section 4.1)
      dial.homeX = 88;
      dial.homeY = canvas.height - 84;
      dial.maxR = 58;
    } else {
      // Classic Portrait bottom-center ergonomic thumb dial
      dial.homeX = canvas.width * 0.5;
      dial.homeY = canvas.height - 102;
      dial.maxR = 64;
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

  // --- MULTI-TOUCH SAFE POINTER LISTENERS (BUG-03 FIXED) ---
  canvas.addEventListener("pointerdown", (e) => {
    const st = getGameState();
    if (st.state !== "playing") return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Ignore touches in the top HUD bar
    if (y < 118 && st.orientationMode === "portrait") return;
    if (y < 78 && st.orientationMode === "landscape") return;

    // In Landscape mode, right 35% of screen is reserved for the 4-button diamond
    if (st.orientationMode === "landscape" && x > canvas.width * 0.62) {
      return;
    }

    // If a joystick pointer is already active, ignore additional fingers
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
    dial.inputSource = "touch";

    // Floating re-center within ergonomics zone
    if (st.orientationMode === "landscape") {
      dial.ox = Math.max(58, Math.min(canvas.width * 0.36, x));
      dial.oy = Math.max(canvas.height * 0.42, Math.min(canvas.height - 58, y));
    } else {
      dial.ox = Math.max(66, Math.min(canvas.width - 145, x));
      dial.oy = Math.max(canvas.height * 0.52, Math.min(canvas.height - 64, y));
    }
    dial.cx = x;
    dial.cy = y;

    try {
      canvas.setPointerCapture(e.pointerId);
    } catch (_) {}

    updateDialVector(x, y);
  });

  window.addEventListener("pointermove", (e) => {
    // BUG-03 FIX: Only update if this event belongs to the joystick's pointerId
    if (!dial.active || e.pointerId !== dial.pointerId) return;
    const rect = canvas.getBoundingClientRect();
    updateDialVector(e.clientX - rect.left, e.clientY - rect.top);
  });

  function handlePointerRelease(e) {
    // BUG-03 FIX: Lifting right thumb off [A]/[B]/[X]/[Y] never resets left thumb stick!
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

  // --- KEYBOARD & HARDWARE GAMEPAD POLLING (V2 + V3 READY) ---
  window.addEventListener("keydown", (e) => {
    const st = getGameState();
    if (st.state !== "playing") return;
    const k = e.key.toLowerCase();
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
    if (dial.active && dial.pointerId !== null) return; // Touch stick has priority while held

    // 1. Check Keyboard WASD / Arrows
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
      const isWalkKey = keysDown.has("control") || keysDown.has("alt");
      const isSprintKey = keysDown.has("shift");
      dial.tier = isWalkKey ? "walk" : (isSprintKey ? "sprint" : "walk");
      dial.mag = dial.tier === "sprint" ? 0.92 : 0.48;
      dial.cx = dial.ox + dial.vx * dial.maxR * dial.mag;
      dial.cy = dial.oy + dial.vy * dial.maxR * dial.mag;
      dial.inputSource = "keyboard";
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
        } else if (dial.inputSource === "gamepad") {
          dial.vx = 0;
          dial.vy = 0;
          dial.mag = 0;
          dial.tier = "stop";
          dial.cx = dial.ox;
          dial.cy = dial.oy;
        }

        // Face buttons: [0]=A, [1]=B, [2]=X, [3]=Y
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

    // Reset if keyboard/gamepad released
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
