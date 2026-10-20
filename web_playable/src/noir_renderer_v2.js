/**
 * @file noir_renderer_v2.js
 * @version 2.0.0
 * @description Enriched Procedural Architectural Tile Renderer, Articulated Multi-Part
 * Character Sprites, 36px In-World Johnny Rocketfingers Facial Expression Head (Section 5.2),
 * and High-Legibility 14px Comic Speech Bubbles with Viewport Edge Clamping (Section 7.2).
 */

const SCALE = 18.0; // pixels per world meter

// Offscreen 36x36 buffer for crisp in-world character head rendering without clipping transforms
let headOffscreenCanvas = null;
let headOffscreenCtx = null;

function getHeadBuffer(size) {
  if (!headOffscreenCanvas) {
    headOffscreenCanvas = document.createElement("canvas");
    headOffscreenCanvas.width = size;
    headOffscreenCanvas.height = size;
    headOffscreenCtx = headOffscreenCanvas.getContext("2d");
  }
  return { canvas: headOffscreenCanvas, ctx: headOffscreenCtx };
}

// ============================================================================
// 1. PROCEDURAL JOHNNY ROCKETFINGERS 10-EXPRESSION RENDERER
// ============================================================================
export function drawJohnnyExpression(targetCtx, w, h, exprId, t) {
  targetCtx.clearRect(0, 0, w, h);
  const cx = w * 0.5;
  const cy = h * 0.54;
  const r = Math.min(w, h) * 0.37;

  // Comic background tint
  targetCtx.fillStyle =
    exprId === "panic_stare" || exprId === "clenched_grimace"
      ? "#fed7d7"
      : exprId === "iron_clench"
      ? "#e9d8fd"
      : exprId === "smirk_sweat"
      ? "#c6f6d5"
      : "#f7f2e4";
  targetCtx.fillRect(0, 0, w, h);

  // Radial comic speed lines on intense expressions
  if (["panic_stare", "clenched_grimace", "bergamot_stun", "iron_clench"].includes(exprId)) {
    targetCtx.strokeStyle = "rgba(197, 48, 48, 0.24)";
    targetCtx.lineWidth = 1.5;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + t * 2;
      targetCtx.beginPath();
      targetCtx.moveTo(cx + Math.cos(a) * r * 0.9, cy + Math.sin(a) * r * 0.9);
      targetCtx.lineTo(cx + Math.cos(a) * r * 1.45, cy + Math.sin(a) * r * 1.45);
      targetCtx.stroke();
    }
  }

  const jitterX =
    exprId === "panic_stare" || exprId === "clenched_grimace" ? Math.sin(t * 36) * 1.3 : 0;
  const hx = cx + jitterX;
  const hy = cy;

  // Head circle
  targetCtx.fillStyle =
    exprId === "iron_clench"
      ? "#d6bcfa"
      : exprId === "freeze_frame_despair"
      ? "#cbd5e0"
      : "#fffdf9";
  targetCtx.strokeStyle = "#141413";
  targetCtx.lineWidth = 2.4;
  targetCtx.beginPath();
  targetCtx.arc(hx, hy, r, 0, Math.PI * 2);
  targetCtx.fill();
  targetCtx.stroke();

  // Slicked-back Johnny Rocketfingers noir hair tuft at top
  targetCtx.fillStyle = "#141413";
  targetCtx.beginPath();
  targetCtx.moveTo(hx - r * 0.7, hy - r * 0.65);
  targetCtx.quadraticCurveTo(hx, hy - r * 1.18, hx + r * 0.78, hy - r * 0.62);
  targetCtx.quadraticCurveTo(hx + r * 0.2, hy - r * 0.82, hx - r * 0.7, hy - r * 0.65);
  targetCtx.fill();

  const eyeY = hy - r * 0.14;
  const eyeSep = r * 0.42;

  // Throbbing crimson forehead vein on clenched_grimace / iron_clench
  if (exprId === "clenched_grimace" || exprId === "iron_clench") {
    targetCtx.strokeStyle = "#c53030";
    targetCtx.lineWidth = 2.0;
    targetCtx.beginPath();
    targetCtx.moveTo(hx - r * 0.55, hy - r * 0.52);
    targetCtx.lineTo(hx - r * 0.34, hy - r * 0.38);
    targetCtx.lineTo(hx - r * 0.48, hy - r * 0.24);
    targetCtx.stroke();
  }

  // Eyes & Brows
  targetCtx.strokeStyle = "#141413";
  targetCtx.fillStyle = "#141413";
  if (exprId === "bergamot_stun") {
    [-1, 1].forEach((dir) => {
      const ex = hx + dir * eyeSep;
      targetCtx.beginPath();
      for (let s = 0; s <= 18; s++) {
        const p = s / 18;
        const ang = p * Math.PI * 3.4 + t * 8 * dir;
        const rad = p * r * 0.25;
        const px = ex + Math.cos(ang) * rad;
        const py = eyeY + Math.sin(ang) * rad;
        if (s === 0) targetCtx.moveTo(px, py);
        else targetCtx.lineTo(px, py);
      }
      targetCtx.stroke();
    });
  } else if (exprId === "panic_stare" || exprId === "freeze_frame_despair") {
    [-1, 1].forEach((dir) => {
      const ex = hx + dir * eyeSep;
      targetCtx.fillStyle = "#ffffff";
      targetCtx.beginPath();
      targetCtx.arc(ex, eyeY, r * 0.25, 0, Math.PI * 2);
      targetCtx.fill();
      targetCtx.stroke();
      targetCtx.fillStyle = exprId === "panic_stare" ? "#c53030" : "#141413";
      targetCtx.beginPath();
      targetCtx.arc(ex + Math.sin(t * 20), eyeY, 2.0, 0, Math.PI * 2);
      targetCtx.fill();
    });
  } else if (exprId === "iron_clench") {
    [-1, 1].forEach((dir) => {
      const ex = hx + dir * eyeSep;
      targetCtx.lineWidth = 2.3;
      targetCtx.beginPath();
      targetCtx.moveTo(ex - dir * 4.5, eyeY - 3);
      targetCtx.lineTo(ex + dir * 2.8, eyeY);
      targetCtx.lineTo(ex - dir * 4.5, eyeY + 3);
      targetCtx.stroke();
    });
  } else {
    const shiftX = exprId === "awkward_smile" ? Math.sin(t * 4.5) * 3.0 : 0;
    [-1, 1].forEach((dir) => {
      const ex = hx + dir * eyeSep;
      if ((exprId === "sweating_squint" || exprId === "smirk_sweat") && dir === -1) {
        targetCtx.lineWidth = 2.2;
        targetCtx.beginPath();
        targetCtx.moveTo(ex - 4, eyeY);
        targetCtx.lineTo(ex + 4, eyeY);
        targetCtx.stroke();
      } else {
        targetCtx.fillStyle = "#141413";
        targetCtx.beginPath();
        targetCtx.arc(ex + shiftX, eyeY, 2.5, 0, Math.PI * 2);
        targetCtx.fill();
      }
    });
    // Eyebrows
    targetCtx.lineWidth = 2.3;
    const twitch =
      exprId === "twitching_eyebrow" ? -5.0 - Math.abs(Math.sin(t * 16)) * 3.2 : -2.5;
    targetCtx.beginPath();
    targetCtx.moveTo(hx - eyeSep - 4.5, eyeY - 3.5 + twitch);
    targetCtx.lineTo(hx - eyeSep + 4.5, eyeY - 4.5);
    targetCtx.moveTo(hx + eyeSep - 4.5, eyeY - 4.5);
    targetCtx.lineTo(hx + eyeSep + 4.5, eyeY - 5.5);
    targetCtx.stroke();
  }

  // Mouth
  const my = hy + r * 0.38;
  targetCtx.lineWidth = 2.1;
  if (exprId === "clenched_grimace" || exprId === "awkward_smile") {
    const mw = r * 0.98;
    const mh = r * 0.33;
    targetCtx.fillStyle = "#ffffff";
    targetCtx.fillRect(hx - mw * 0.5, my - mh * 0.5, mw, mh);
    targetCtx.strokeRect(hx - mw * 0.5, my - mh * 0.5, mw, mh);
    targetCtx.beginPath();
    for (let k = -1; k <= 1; k++) {
      targetCtx.moveTo(hx + k * (mw * 0.25), my - mh * 0.5);
      targetCtx.lineTo(hx + k * (mw * 0.25), my + mh * 0.5);
    }
    targetCtx.stroke();
  } else if (exprId === "panic_stare" || exprId === "freeze_frame_despair") {
    targetCtx.fillStyle = "#141413";
    targetCtx.beginPath();
    targetCtx.ellipse(hx, my, r * 0.31, r * 0.23, 0, 0, Math.PI * 2);
    targetCtx.fill();
  } else if (exprId === "smirk_sweat" || exprId === "noir_glare") {
    targetCtx.beginPath();
    targetCtx.moveTo(hx - r * 0.36, my + 1);
    targetCtx.quadraticCurveTo(hx, my + 3, hx + r * 0.42, my - 4);
    targetCtx.stroke();
    if (exprId === "noir_glare") {
      // Iconic Johnny Rocketfingers toothpick
      targetCtx.lineWidth = 1.6;
      targetCtx.beginPath();
      targetCtx.moveTo(hx + r * 0.32, my - 2);
      targetCtx.lineTo(hx + r * 0.72, my - 7);
      targetCtx.stroke();
    }
  } else {
    targetCtx.beginPath();
    targetCtx.moveTo(hx - r * 0.36, my);
    targetCtx.lineTo(hx + r * 0.36, my - 1.5);
    targetCtx.stroke();
  }

  // Animated sweat bead on stressed expressions
  if (["sweating_squint", "clenched_grimace", "panic_stare", "awkward_smile", "smirk_sweat"].includes(exprId)) {
    const dropY = hy - r * 0.35 + ((t * 18) % (r * 0.65));
    targetCtx.fillStyle = "#63b3ed";
    targetCtx.beginPath();
    targetCtx.arc(hx + r * 0.68, dropY, 2.7, 0, Math.PI * 2);
    targetCtx.fill();
  }
}

// ============================================================================
// 2. SECTION 7.2: HIGH-LEGIBILITY COMIC SPEECH BUBBLES (14px BOLD + TAIL)
// ============================================================================
export function drawComicSpeechBubble(
  ctx,
  worldX,
  worldY,
  text,
  speakerType = "player",
  camX,
  camY,
  viewW
) {
  ctx.save();
  ctx.font = "900 14px 'Courier New', monospace"; // Upgraded to 14px bold!
  const paddingX = 12;
  const paddingY = 8;
  const maxBubbleWidth = Math.min(250, viewW - 28);

  // Word-wrap into 1-2 crisp lines
  const words = String(text).split(" ");
  const lines = [];
  let currentLine = words[0] || "";
  for (let i = 1; i < words.length; i++) {
    const testLine = currentLine + " " + words[i];
    if (ctx.measureText(testLine).width < maxBubbleWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);

  const lineHeight = 17;
  const textWidth = Math.max(...lines.map((l) => ctx.measureText(l).width), 40);
  const boxW = textWidth + paddingX * 2;
  const boxH = lines.length * lineHeight + paddingY * 2;

  const screenWorldX = worldX * SCALE;
  const screenWorldY = worldY * SCALE;

  // Clamp X so bubble never clips off the left/right edges of the phone screen
  const minWorldX = -camX + boxW * 0.5 + 8;
  const maxWorldX = -camX + viewW - boxW * 0.5 - 8;
  const bx = Math.max(minWorldX, Math.min(maxWorldX, screenWorldX));
  const by = screenWorldY - boxH - 36;

  // Drop shadow
  ctx.fillStyle = "rgba(20, 20, 19, 0.86)";
  ctx.beginPath();
  ctx.roundRect(bx - boxW * 0.5 + 4, by + 4, boxW, boxH, 9);
  ctx.fill();

  // Bubble fill & thick comic ink border
  ctx.fillStyle = speakerType === "alert" ? "#fff5f5" : "#fffdf8";
  ctx.strokeStyle = speakerType === "alert" ? "#c53030" : "#141413";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(bx - boxW * 0.5, by, boxW, boxH, 9);
  ctx.fill();
  ctx.stroke();

  // Triangular speech tail pointing down to the character's head
  const tailX = Math.max(bx - boxW * 0.35, Math.min(bx + boxW * 0.35, screenWorldX));
  ctx.beginPath();
  ctx.moveTo(tailX - 7, by + boxH - 1);
  ctx.lineTo(screenWorldX, screenWorldY - 22);
  ctx.lineTo(tailX + 7, by + boxH - 1);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Render crisp 14px text
  ctx.fillStyle = speakerType === "alert" ? "#9b2c2c" : "#141413";
  ctx.textAlign = "center";
  lines.forEach((line, idx) => {
    ctx.fillText(line, bx, by + paddingY + 13 + idx * lineHeight);
  });
  ctx.restore();
}

// ============================================================================
// 3. ENRICHED ARCHITECTURAL TERMINAL & ARTICULATED SPRITE RENDERER
// ============================================================================
export function renderWorldV2(ctx, canvas, sim, dial) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const lvl = sim.activeLvl;
  if (!lvl) return;

  const p = sim.player;
  const shakeX = sim.screenShakeTimer > 0 ? (Math.random() - 0.5) * 10 : 0;
  const shakeY = sim.screenShakeTimer > 0 ? (Math.random() - 0.5) * 10 : 0;

  const camX = canvas.width * 0.5 - p.x * SCALE + shakeX;
  const camY = canvas.height * 0.52 - p.y * SCALE + shakeY;

  ctx.save();
  ctx.translate(camX, camY);

  const worldW = lvl.world.w * SCALE;
  const worldH = lvl.world.h * SCALE;

  // --- A. ARCHITECTURAL TERMINAL SURFACES (SECTION 7.1) ---
  // 1. Base Terrazzo Terminal Floor
  ctx.fillStyle = "#e2ddd2";
  ctx.fillRect(0, 0, worldW, worldH);

  // 2. Restroom Sanctuary Checkered Mint/Ivory Ceramic Flooring (Wing 4)
  const sanctH = lvl.restroomWingY * SCALE;
  ctx.fillStyle = "#d5ebe1";
  ctx.fillRect(0, 0, worldW, sanctH);
  const checkTile = 34;
  ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
  for (let gx = 0; gx < worldW; gx += checkTile) {
    for (let gy = 0; gy < sanctH; gy += checkTile) {
      if (((gx / checkTile) + (gy / checkTile)) % 2 === 0) {
        ctx.fillRect(gx, gy, checkTile, checkTile);
      }
    }
  }

  // 3. Beveled Terrazzo Concourse Tiles (68px x 68px) with specular grout lines
  ctx.strokeStyle = "rgba(20, 20, 19, 0.08)";
  ctx.lineWidth = 1.2;
  const tileStep = 68;
  for (let gx = 0; gx <= worldW; gx += tileStep) {
    ctx.beginPath();
    ctx.moveTo(gx, sanctH);
    ctx.lineTo(gx, worldH);
    ctx.stroke();
  }
  for (let gy = sanctH; gy <= worldH; gy += tileStep) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(worldW, gy);
    ctx.stroke();
  }

  // 4. Painted Concourse Wing Signage & Directional Floor Arrows
  if (lvl.wings) {
    lvl.wings.forEach((wg) => {
      const midY = ((wg.yMin + wg.yMax) * 0.5) * SCALE;
      ctx.save();
      ctx.fillStyle = "rgba(20, 20, 19, 0.24)";
      ctx.font = "900 13px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.fillText(wg.label, worldW * 0.5, midY - 8);
      ctx.fillStyle = "rgba(197, 48, 48, 0.34)";
      ctx.font = "900 12px 'Courier New', monospace";
      ctx.fillText(wg.dirArrow, worldW * 0.5, midY + 10);
      ctx.restore();
    });
  }

  // 5. Security Checkpoint Floor Striping
  const secY = lvl.secLineY * SCALE;
  ctx.fillStyle = "rgba(214, 158, 46, 0.16)";
  ctx.fillRect(0, secY - 26, worldW, 52);
  ctx.strokeStyle = "#d69e2e";
  ctx.setLineDash([10, 8]);
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(0, secY);
  ctx.lineTo(worldW, secY);
  ctx.stroke();
  ctx.setLineDash([]);

  // 6. Changi Rain Vortex Acoustic Zone (Level 4)
  if (lvl.waterfallZone) {
    const wz = lvl.waterfallZone;
    ctx.fillStyle = "rgba(49, 130, 206, 0.20)";
    ctx.fillRect(wz.x * SCALE, wz.y * SCALE, wz.w * SCALE, wz.h * SCALE);
    // Concentric animated water ripples
    const vcx = (wz.x + wz.w * 0.5) * SCALE;
    const vcy = (wz.y + wz.h * 0.5) * SCALE;
    ctx.strokeStyle = "rgba(49, 130, 206, 0.45)";
    ctx.lineWidth = 2;
    for (let ring = 1; ring <= 4; ring++) {
      const rr = ((sim.worldClock * 28 + ring * 32) % 130) + 20;
      ctx.beginPath();
      ctx.arc(vcx, vcy, rr, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = "#1e4e8c";
    ctx.font = "900 12px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText(wz.label, vcx, wz.y * SCALE + 18);
  }

  // 7. Timed Shuttle Gate (Levels 3 & 5)
  if (lvl.shuttleGateY !== null) {
    const sy = lvl.shuttleGateY * SCALE;
    ctx.fillStyle = sim.shuttleOpen ? "rgba(47, 133, 90, 0.32)" : "rgba(197, 48, 48, 0.86)";
    ctx.fillRect(1.2 * SCALE, sy - 11, 11.5 * SCALE, 22);
    ctx.strokeStyle = "#141413";
    ctx.lineWidth = 2;
    ctx.strokeRect(1.2 * SCALE, sy - 11, 11.5 * SCALE, 22);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 11px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      sim.shuttleOpen ? "🟢 SHUTTLE DOORS OPEN — CROSS NOW!" : "🔴 SHUTTLE DOORS LOCKED (WAIT)",
      7.0 * SCALE,
      sy + 4
    );
  }

  // 8. Moving Walkways / Reversing Travelators
  lvl.walkways.forEach((wk) => {
    const wx = wk.x * SCALE;
    const wy = wk.y * SCALE;
    const ww = wk.w * SCALE;
    const wh = wk.h * SCALE;
    ctx.fillStyle = wk.vx >= 0 ? "rgba(47, 133, 90, 0.22)" : "rgba(197, 48, 48, 0.20)";
    ctx.fillRect(wx, wy, ww, wh);
    ctx.strokeStyle = wk.vx >= 0 ? "#2f855a" : "#c53030";
    ctx.lineWidth = 2;
    ctx.strokeRect(wx, wy, ww, wh);
    ctx.fillStyle = "#141413";
    ctx.font = "900 11px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText(wk.label, wx + ww * 0.5, wy + wh * 0.5 + 4);
  });

  // 9. Shimmering Cyan Wet Floor Puddles + Yellow A-Frame "⚠ WET FLOOR" Cones
  lvl.wetZones.forEach((wz) => {
    const x = wz.x * SCALE;
    const y = wz.y * SCALE;
    const w = wz.w * SCALE;
    const h = wz.h * SCALE;
    ctx.fillStyle = "rgba(56, 178, 172, 0.34)";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 14);
    ctx.fill();
    ctx.strokeStyle = "#2b6cb0";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Yellow A-frame caution cone in center of puddle
    const cx = x + w * 0.5;
    const cy = y + h * 0.5;
    ctx.fillStyle = "#ecc94b";
    ctx.strokeStyle = "#141413";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 12);
    ctx.lineTo(cx - 10, cy + 8);
    ctx.lineTo(cx + 10, cy + 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#1a365d";
    ctx.font = "900 10.5px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText("⚠ WET FLOOR", cx, cy + 21);
  });

  // 10. 3D-Extruded Walls, Velvet Stanchions, X-Ray Archways & Check-In Kiosks
  lvl.walls.forEach((w) => {
    const wx = w.x * SCALE;
    const wy = w.y * SCALE;
    const ww = w.w * SCALE;
    const wh = w.h * SCALE;

    if (w.isKiosk) {
      // 3D-Extruded Airport Counter / Duty-Free Kiosk
      ctx.fillStyle = "#141413";
      ctx.fillRect(wx + 4, wy + 5, ww, wh);
      ctx.fillStyle = "#2d3748";
      ctx.fillRect(wx, wy, ww, wh);
      ctx.fillStyle = "#d69e2e";
      ctx.fillRect(wx, wy, ww, 6);
      ctx.strokeStyle = "#141413";
      ctx.lineWidth = 2.2;
      ctx.strokeRect(wx, wy, ww, wh);
    } else if (w.isStanchion) {
      // Red/Black Retractable Velvet Stanchion Queue
      ctx.fillStyle = "#742a2a";
      ctx.fillRect(wx, wy + wh * 0.25, ww, wh * 0.5);
      for (let px = wx; px <= wx + ww; px += 36) {
        ctx.fillStyle = "#141413";
        ctx.beginPath();
        ctx.arc(px, wy + wh * 0.5, 5.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (w.isXray) {
      // Gray X-Ray Scanner Archway with Glowing LEDs
      ctx.fillStyle = "#4a5568";
      ctx.fillRect(wx, wy, ww, wh);
      ctx.strokeStyle = "#141413";
      ctx.lineWidth = 2.2;
      ctx.strokeRect(wx, wy, ww, wh);
      // Glowing green/amber scanner LEDs
      ctx.fillStyle = "#48bb78";
      ctx.beginPath();
      ctx.arc(wx + 12, wy + wh * 0.5, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ecc94b";
      ctx.beginPath();
      ctx.arc(wx + 24, wy + wh * 0.5, 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Architectural Structural Partition Wall
      ctx.fillStyle = "#1c1c1b";
      ctx.fillRect(wx, wy, ww, wh);
      ctx.strokeStyle = "#3a3a38";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(wx, wy, ww, wh);
    }

    if (w.label) {
      ctx.fillStyle = "#fefcbf";
      ctx.font = "900 10.5px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.fillText(w.label, wx + ww * 0.5, wy + wh * 0.5 + 4);
    }
  });

  // 11. Potted Tropical Palms (GOI, SIN, etc.)
  if (lvl.palms) {
    lvl.palms.forEach((pm) => {
      const px = pm.x * SCALE;
      const py = pm.y * SCALE;
      // Terracotta pot
      ctx.fillStyle = "#9c4221";
      ctx.strokeStyle = "#141413";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // 5 green palm fronds
      ctx.strokeStyle = "#2f855a";
      ctx.lineWidth = 3.2;
      for (let f = 0; f < 5; f++) {
        const a = (f / 5) * Math.PI * 2 + 0.3;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(a) * 14, py + Math.sin(a) * 14);
        ctx.stroke();
      }
    });
  }

  // 12. Mystery Stalls with Swinging Doors & Occupancy Bolt Indicators (Section 7.1)
  lvl.stalls.forEach((st) => {
    const sx = st.x * SCALE;
    const sy = st.y * SCALE;
    const sw = st.w * SCALE;
    const sh = st.h * SCALE;

    // Stall booth interior
    ctx.fillStyle = !st.inspected ? "#553c9a" : st.open ? "#276749" : "#9b2c2c";
    ctx.strokeStyle = "#141413";
    ctx.lineWidth = 3;
    ctx.fillRect(sx, sy, sw, sh);
    ctx.strokeRect(sx, sy, sw, sh);

    // Ceramic toilet bowl silhouette inside stall
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.beginPath();
    ctx.ellipse(sx + sw * 0.5, sy + sh * 0.42, 11, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Door & Occupancy Bolt Indicator on Bottom Edge
    const boltColor = !st.inspected ? "#b794f4" : st.open ? "#68d391" : "#fc8181";
    ctx.fillStyle = boltColor;
    ctx.fillRect(sx + 6, sy + sh - 9, sw - 12, 8);
    ctx.strokeRect(sx + 6, sy + sh - 9, sw - 12, 8);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 11px 'Courier New', monospace";
    ctx.textAlign = "center";
    const topTag = !st.inspected ? "🚽 MYSTERY [?]" : st.open ? "✅ VACANT!" : "🔒 OCCUPIED";
    ctx.fillText(topTag, sx + sw * 0.5, sy + sh * 0.46);
    ctx.fillText(st.label, sx + sw * 0.5, sy + sh * 0.72);
  });

  // 13. Interactable Props with High-Legibility Badges
  lvl.props.forEach((pr) => {
    if (pr.used) return;
    const px = pr.x * SCALE;
    const py = pr.y * SCALE;
    ctx.fillStyle =
      pr.type === "spicy_food" || pr.type === "perfume_ambush"
        ? "#c53030"
        : pr.type === "intel_clipboard"
        ? "#2f855a"
        : "#d69e2e";
    ctx.strokeStyle = "#141413";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(px, py, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Label pill
    ctx.font = "900 11px 'Courier New', monospace";
    const tw = ctx.measureText(pr.label).width + 12;
    ctx.fillStyle = "rgba(20, 20, 19, 0.9)";
    ctx.fillRect(px - tw * 0.5, py - 29, tw, 16);
    ctx.fillStyle = "#fefcbf";
    ctx.textAlign = "center";
    ctx.fillText(pr.label, px, py - 17);
  });

  // 14. Articulated Custodians & Mop Cart Barricades
  lvl.hazards.forEach((hz) => {
    const drawX = (hz.cleared ? hz.lureX : hz.x) * SCALE;
    const drawY = (hz.cleared ? hz.lureY : hz.y) * SCALE;
    const w = hz.w * SCALE;
    const h = hz.h * SCALE;

    if (!hz.cleared) {
      // Yellow/Black Caution Tape across Sealed Restroom Wing Doorway
      ctx.fillStyle = "#ecc94b";
      ctx.strokeStyle = "#141413";
      ctx.lineWidth = 2.8;
      ctx.fillRect(drawX - w * 0.5, drawY - h * 0.5, w, h);
      ctx.strokeRect(drawX - w * 0.5, drawY - h * 0.5, w, h);

      // Rolling Yellow Mop Bucket + Wringer Handle
      ctx.fillStyle = "#f6e05e";
      ctx.fillRect(drawX - 18, drawY - 12, 16, 14);
      ctx.strokeRect(drawX - 18, drawY - 12, 16, 14);

      // Articulated Custodian in High-Vis Vest
      ctx.fillStyle = "#d69e2e";
      ctx.beginPath();
      ctx.arc(drawX + 12, drawY - 4, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#141413";
      ctx.font = "900 10.5px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.fillText("⚠ CLEANING: DO NOT ENTER", drawX, drawY - h * 0.5 - 6);
    } else {
      ctx.fillStyle = "rgba(47, 133, 90, 0.88)";
      ctx.fillRect(drawX - 54, drawY - 11, 108, 22);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 10.5px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.fillText("🧹 JANITOR LURED AWAY", drawX, drawY + 4);
    }
  });

  // 15. Articulated Passenger Crowds (Suitcases & Surfboards)
  lvl.crowds.forEach((c) => {
    const cx = c.x * SCALE;
    const cy = c.y * SCALE;
    const r = c.r * SCALE;

    // Wheeled suitcase beside traveler
    ctx.fillStyle = "#2d3748";
    ctx.strokeStyle = "#141413";
    ctx.lineWidth = 2;
    ctx.fillRect(cx + r * 0.65, cy - 6, 10, 14);
    ctx.strokeRect(cx + r * 0.65, cy - 6, 10, 14);

    // Traveler shoulders & head
    ctx.fillStyle = c.partedTimer > 0 ? "#48bb78" : "#805ad5";
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 10.5px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      c.partedTimer > 0 ? "😱 STEPPING ASIDE!" : c.label,
      cx,
      cy - r - 5
    );
  });

  // 16. Articulated Security Guards, Segway Supervisors & Robo-Scrubbers
  lvl.guards.forEach((g) => {
    const gx = g.x * SCALE;
    const gy = g.y * SCALE;
    const rangePx = g.range * SCALE;
    const halfRad = (g.fovDeg * Math.PI) / 360;

    // Vision Cone
    ctx.fillStyle =
      sim.suspicion > 45 ? "rgba(197, 48, 48, 0.30)" : "rgba(214, 158, 46, 0.20)";
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.arc(gx, gy, rangePx, g.angle - halfRad, g.angle + halfRad);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#141413";
    ctx.lineWidth = 2.2;

    if (g.isRobo) {
      // Autonomous Changi Robo-Scrubber Droid
      ctx.fillStyle = "#319795";
      ctx.beginPath();
      ctx.arc(gx, gy, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#81e6d9";
      ctx.beginPath();
      ctx.arc(gx, gy, 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (g.isSegway) {
      // Segway Supervisor with 2 wheels + handlebars
      ctx.fillStyle = "#141413";
      ctx.fillRect(gx - 13, gy - 11, 5, 22);
      ctx.fillRect(gx + 8, gy - 11, 5, 22);
      ctx.fillStyle = "#2b6cb0";
      ctx.beginPath();
      ctx.arc(gx, gy, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      // Articulated TSA / CISF Guard with Navy Shoulders, Gold Badge & Peaked Cap
      ctx.fillStyle = "#1a365d";
      ctx.beginPath();
      ctx.ellipse(gx, gy + 2, 13, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Gold badge glint
      ctx.fillStyle = "#ecc94b";
      ctx.fillRect(gx + 3, gy - 1, 4, 4);
      // Peaked security cap
      ctx.fillStyle = "#c53030";
      ctx.beginPath();
      ctx.arc(gx, gy - 2, 8.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.fillStyle = "#141413";
    ctx.font = "900 10px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText(g.label, gx, gy - 16);
  });

  // --- B. PROTAGONIST WITH 36PX IN-WORLD EXPRESSIVE HEAD (SECTION 5.2) ---
  const px = p.x * SCALE;
  const py = p.y * SCALE;
  const skew = dial.tier !== "stop" ? Math.sin(p.waddlePhase) * 4.5 : 0;

  // Active Ability / Hazard Auras
  if (p.clenchActive > 0) {
    ctx.strokeStyle = "#3182ce";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(px, py, 24, 0, Math.PI * 2);
    ctx.stroke();
  } else if (p.pokerFaceTimer > 0) {
    ctx.strokeStyle = "#d69e2e";
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    ctx.arc(px, py, 23, 0, Math.PI * 2);
    ctx.stroke();
  } else if (p.elbowDashTimer > 0) {
    ctx.strokeStyle = "#c53030";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(px - p.dashDirX * 14, py - p.dashDirY * 14, 18, 0, Math.PI * 2);
    ctx.stroke();
  } else if (sim.crampActiveSec > 0) {
    ctx.strokeStyle = "#c53030";
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    ctx.arc(px, py, 22, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Articulated Legs & Flip-Flops
  ctx.strokeStyle = "#141413";
  ctx.lineWidth = 3.4;
  const crouchY = dial.tier === "sprint" || sim.crampActiveSec > 0 ? 3 : 0;
  ctx.beginPath();
  // Torso in linen travel jacket
  ctx.fillStyle = "#f7fafc";
  ctx.beginPath();
  ctx.roundRect(px - 7 + skew * 0.2, py - 4 + crouchY, 14, 15, 4);
  ctx.fill();
  ctx.stroke();

  // Swinging Arms & Legs
  ctx.beginPath();
  ctx.moveTo(px - 7, py - 1 + crouchY);
  ctx.lineTo(px - 14 - skew * 0.6, py + 7);
  ctx.moveTo(px + 7, py - 1 + crouchY);
  ctx.lineTo(px + 14 + skew * 0.6, py + 7);
  ctx.moveTo(px - 4, py + 11);
  ctx.lineTo(px - 8 + skew, py + 21);
  ctx.moveTo(px + 4, py + 11);
  ctx.lineTo(px + 8 - skew, py + 21);
  ctx.stroke();

  // Equipped Rubber Flip-Flops
  if (p.flipFlops) {
    ctx.fillStyle = "#38a169";
    ctx.fillRect(px - 12 + skew, py + 19, 8, 4);
    ctx.fillRect(px + 4 - skew, py + 19, 8, 4);
  }

  // SECTION 5.2: Render 36px Expressive Johnny Rocketfingers Head Directly on Protagonist!
  const headSize = 36;
  const { canvas: hCanvas, ctx: hCtx } = getHeadBuffer(headSize);
  drawJohnnyExpression(hCtx, headSize, headSize, sim.activeExpression, sim.worldClock);

  ctx.save();
  ctx.translate(px + skew * 0.45, py - 20 + crouchY);
  ctx.rotate(skew * 0.035);
  ctx.beginPath();
  ctx.arc(0, 0, headSize * 0.48, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(hCanvas, -headSize * 0.5, -headSize * 0.5, headSize, headSize);
  ctx.restore();

  // Crisp comic ink outline around the 36px in-world head
  ctx.strokeStyle = "#141413";
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.arc(px + skew * 0.45, py - 20 + crouchY, headSize * 0.48, 0, Math.PI * 2);
  ctx.stroke();

  // Awkward smile nervous mini-tag when spotted walking
  if (sim.activeExpression === "awkward_smile" && sim.speechBubbles.length === 0) {
    drawComicSpeechBubble(
      ctx,
      p.x,
      p.y,
      "Hehe... nice terminal, Officer!",
      "player",
      camX,
      camY,
      canvas.width
    );
  }

  // --- C. RENDER HIGH-LEGIBILITY 14PX COMIC SPEECH BUBBLES (SECTION 7.2) ---
  sim.speechBubbles.forEach((b) => {
    drawComicSpeechBubble(ctx, b.x, b.y, b.text, b.speakerType, camX, camY, canvas.width);
  });

  ctx.restore();

  // --- D. PINK BERGAMOT PERFUME MIST OVERLAY ---
  if (sim.perfumeFlashTimer > 0) {
    ctx.fillStyle = `rgba(237, 100, 166, ${Math.min(0.42, sim.perfumeFlashTimer * 0.22)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // --- E. VIRTUAL JOYSTICK / THUMB DIAL OVERLAY ---
  if (sim.state === "playing") {
    ctx.save();
    ctx.fillStyle = "rgba(20, 20, 19, 0.48)";
    ctx.strokeStyle = "rgba(243, 239, 230, 0.72)";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(dial.ox, dial.oy, dial.maxR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner walk/sprint threshold ring
    ctx.strokeStyle = "rgba(214, 158, 46, 0.42)";
    ctx.beginPath();
    ctx.arc(dial.ox, dial.oy, dial.maxR * 0.65, 0, Math.PI * 2);
    ctx.stroke();

    // Thumb knob
    ctx.fillStyle =
      dial.tier === "sprint" ? "#c53030" : dial.tier === "walk" ? "#d69e2e" : "#f3efe6";
    ctx.beginPath();
    ctx.arc(dial.cx, dial.cy, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#141413";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = "rgba(243, 239, 230, 0.85)";
    ctx.font = "900 9.5px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      sim.orientationMode === "landscape" ? "(L) MOVE / SPRINT" : "DRAG: MOVE • 2x TAP: CLENCH",
      dial.ox,
      dial.oy + dial.maxR + 13
    );
    ctx.restore();
  }
}
