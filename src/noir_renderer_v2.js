/**
 * @file noir_renderer_v2.js
 * @version 2.2.0
 * @description Enriched Procedural Architectural Tile Renderer, Articulated Sprites,
 * 36px In-World Johnny Rocketfingers Head, Compact Non-Blocking Speech Bubbles,
 * Ultra-Wide Camera Zoom + Compact Mini-Map Radar, Tutorial Visual Clues,
 * and Automatic Hiding of Touch Radials on Desktop Computers.
 */

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

export function getWorldScale(sim, canvas) {
  const isSmallScreen = Math.min(canvas.width, canvas.height) < 500;
  if (sim.zoomPreset === "wide") {
    return isSmallScreen ? 11.6 : 13.6; // Ultra-wide view for maximum screen real estate
  }
  return isSmallScreen ? 14.8 : 16.8;
}

// ============================================================================
// 1. PROCEDURAL JOHNNY ROCKETFINGERS 10-EXPRESSION RENDERER
// ============================================================================
export function drawJohnnyExpression(targetCtx, w, h, exprId, t) {
  targetCtx.clearRect(0, 0, w, h);
  const cx = w * 0.5;
  const cy = h * 0.54;
  const r = Math.min(w, h) * 0.37;

  targetCtx.fillStyle =
    exprId === "panic_stare" || exprId === "clenched_grimace"
      ? "#fed7d7"
      : exprId === "iron_clench"
      ? "#e9d8fd"
      : exprId === "smirk_sweat"
      ? "#c6f6d5"
      : "#f7f2e4";
  targetCtx.fillRect(0, 0, w, h);

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

  // Slicked-back Johnny Rocketfingers noir hair tuft
  targetCtx.fillStyle = "#141413";
  targetCtx.beginPath();
  targetCtx.moveTo(hx - r * 0.7, hy - r * 0.65);
  targetCtx.quadraticCurveTo(hx, hy - r * 1.18, hx + r * 0.78, hy - r * 0.62);
  targetCtx.quadraticCurveTo(hx + r * 0.2, hy - r * 0.82, hx - r * 0.7, hy - r * 0.65);
  targetCtx.fill();

  const eyeY = hy - r * 0.14;
  const eyeSep = r * 0.42;

  if (exprId === "clenched_grimace" || exprId === "iron_clench") {
    targetCtx.strokeStyle = "#c53030";
    targetCtx.lineWidth = 2.0;
    targetCtx.beginPath();
    targetCtx.moveTo(hx - r * 0.55, hy - r * 0.52);
    targetCtx.lineTo(hx - r * 0.34, hy - r * 0.38);
    targetCtx.lineTo(hx - r * 0.48, hy - r * 0.24);
    targetCtx.stroke();
  }

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

  if (
    ["sweating_squint", "clenched_grimace", "panic_stare", "awkward_smile", "smirk_sweat"].includes(
      exprId
    )
  ) {
    const dropY = hy - r * 0.35 + ((t * 18) % (r * 0.65));
    targetCtx.fillStyle = "#63b3ed";
    targetCtx.beginPath();
    targetCtx.arc(hx + r * 0.68, dropY, 2.7, 0, Math.PI * 2);
    targetCtx.fill();
  }
}

// ============================================================================
// 2. COMPACT HIGH-LEGIBILITY COMIC SPEECH BUBBLES (NON-OBSTRUCTING)
// ============================================================================
export function drawComicSpeechBubble(
  ctx,
  worldX,
  worldY,
  text,
  speakerType = "player",
  camX,
  camY,
  viewW,
  scale = 14.0
) {
  ctx.save();
  ctx.font = "900 12.5px 'Courier New', monospace";
  const paddingX = 9;
  const paddingY = 5;
  const maxBubbleWidth = Math.min(205, viewW - 36);

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

  const lineHeight = 14.5;
  const textWidth = Math.max(...lines.map((l) => ctx.measureText(l).width), 36);
  const boxW = textWidth + paddingX * 2;
  const boxH = lines.length * lineHeight + paddingY * 2;

  const screenWorldX = worldX * scale;
  const screenWorldY = worldY * scale;

  const minWorldX = -camX + boxW * 0.5 + 8;
  const maxWorldX = -camX + viewW - boxW * 0.5 - 8;
  const bx = Math.max(minWorldX, Math.min(maxWorldX, screenWorldX));
  const by = screenWorldY - boxH - 30;

  ctx.fillStyle = "rgba(20, 20, 19, 0.80)";
  ctx.beginPath();
  ctx.roundRect(bx - boxW * 0.5 + 3, by + 3, boxW, boxH, 7);
  ctx.fill();

  ctx.fillStyle = speakerType === "alert" ? "rgba(255, 245, 245, 0.94)" : "rgba(255, 253, 248, 0.94)";
  ctx.strokeStyle = speakerType === "alert" ? "#c53030" : "#141413";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.roundRect(bx - boxW * 0.5, by, boxW, boxH, 7);
  ctx.fill();
  ctx.stroke();

  const tailX = Math.max(bx - boxW * 0.35, Math.min(bx + boxW * 0.35, screenWorldX));
  ctx.beginPath();
  ctx.moveTo(tailX - 5, by + boxH - 1);
  ctx.lineTo(screenWorldX, screenWorldY - 19);
  ctx.lineTo(tailX + 5, by + boxH - 1);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = speakerType === "alert" ? "#9b2c2c" : "#141413";
  ctx.textAlign = "center";
  lines.forEach((line, idx) => {
    ctx.fillText(line, bx, by + paddingY + 11 + idx * lineHeight);
  });
  ctx.restore();
}

// ============================================================================
// 3. LIVE CORNER MINI-MAP RADAR (TUCKED UNDER SINGLE-LINE 36PX HUD)
// ============================================================================
function drawMiniMapRadar(ctx, canvas, sim) {
  const lvl = sim.activeLvl;
  if (!lvl) return;

  const mapW = 64;
  const mapH = Math.round(mapW * (lvl.world.h / lvl.world.w));
  const rx = canvas.width - mapW - 8;
  const ry = 42; // Tucked right under the single-line 34px HUD strip!

  ctx.save();
  ctx.fillStyle = "rgba(20, 20, 19, 0.78)";
  ctx.strokeStyle = "rgba(243, 239, 230, 0.75)";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(rx, ry, mapW, mapH, 6);
  ctx.fill();
  ctx.stroke();

  const sx = mapW / lvl.world.w;
  const sy = mapH / lvl.world.h;

  // Restroom Sanctuary zone highlight at top of radar
  ctx.fillStyle = "rgba(47, 133, 90, 0.32)";
  ctx.fillRect(rx + 2, ry + 2, mapW - 4, lvl.restroomWingY * sy);

  // Divider walls
  ctx.fillStyle = "rgba(243, 239, 230, 0.42)";
  lvl.walls.forEach((w) => {
    if (w.w > 8 || w.h > 8) {
      ctx.fillRect(rx + w.x * sx, ry + w.y * sy, Math.max(1.5, w.w * sx), Math.max(1.5, w.h * sy));
    }
  });

  // Stalls on radar
  lvl.stalls.forEach((st) => {
    ctx.fillStyle = !st.inspected ? "#b794f4" : st.open ? "#48bb78" : "#fc8181";
    ctx.fillRect(rx + st.x * sx, ry + st.y * sy, Math.max(3, st.w * sx), Math.max(3, st.h * sy));
  });

  // Mop barricades on radar
  lvl.hazards.forEach((hz) => {
    if (!hz.cleared) {
      ctx.fillStyle = "#ecc94b";
      ctx.fillRect(rx + (hz.x - 2) * sx, ry + (hz.y - 1) * sy, 5, 3);
    }
  });

  // Guards on radar
  ctx.fillStyle = "#f56565";
  lvl.guards.forEach((g) => {
    ctx.beginPath();
    ctx.arc(rx + g.x * sx, ry + g.y * sy, 2.2, 0, Math.PI * 2);
    ctx.fill();
  });

  // Player blinking beacon on radar
  ctx.fillStyle = "#63b3ed";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(rx + sim.player.x * sx, ry + sim.player.y * sy, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#fefcbf";
  ctx.font = "900 8px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText("RADAR", rx + mapW * 0.5, ry + mapH + 10);
  ctx.restore();
}

// ============================================================================
// 4. ENRICHED ARCHITECTURAL TERMINAL & ARTICULATED SPRITE RENDERER
// ============================================================================
export function renderWorldV2(ctx, canvas, sim, dial) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const lvl = sim.activeLvl;
  if (!lvl) return;

  const SCALE = getWorldScale(sim, canvas);
  const p = sim.player;
  const shakeX = sim.screenShakeTimer > 0 ? (Math.random() - 0.5) * 8 : 0;
  const shakeY = sim.screenShakeTimer > 0 ? (Math.random() - 0.5) * 8 : 0;

  // Offset camera slightly ahead of player's movement / Northward so upcoming corridor is maximally visible!
  const lookAheadY = 2.2 * SCALE;
  const camX = canvas.width * 0.5 - p.x * SCALE + shakeX;
  const camY = canvas.height * 0.58 - p.y * SCALE + lookAheadY + shakeY;

  ctx.save();
  ctx.translate(camX, camY);

  const worldW = lvl.world.w * SCALE;
  const worldH = lvl.world.h * SCALE;

  // 1. Base Terrazzo Terminal Floor
  ctx.fillStyle = "#e2ddd2";
  ctx.fillRect(0, 0, worldW, worldH);

  // 2. Restroom Sanctuary Checkered Mint/Ivory Ceramic Flooring
  const sanctH = lvl.restroomWingY * SCALE;
  ctx.fillStyle = "#d5ebe1";
  ctx.fillRect(0, 0, worldW, sanctH);
  const checkTile = Math.max(24, Math.round(SCALE * 1.9));
  ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
  for (let gx = 0; gx < worldW; gx += checkTile) {
    for (let gy = 0; gy < sanctH; gy += checkTile) {
      if ((Math.floor(gx / checkTile) + Math.floor(gy / checkTile)) % 2 === 0) {
        ctx.fillRect(gx, gy, checkTile, checkTile);
      }
    }
  }

  // 3. Beveled Terrazzo Concourse Tiles
  ctx.strokeStyle = "rgba(20, 20, 19, 0.08)";
  ctx.lineWidth = 1.1;
  const tileStep = Math.round(SCALE * 3.8);
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
      const midY = (wg.yMin + wg.yMax) * 0.5 * SCALE;
      ctx.save();
      ctx.fillStyle = "rgba(20, 20, 19, 0.22)";
      ctx.font = "900 11.5px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.fillText(wg.label, worldW * 0.5, midY - 6);
      ctx.fillStyle = "rgba(197, 48, 48, 0.34)";
      ctx.font = "900 11px 'Courier New', monospace";
      ctx.fillText(wg.dirArrow, worldW * 0.5, midY + 9);
      ctx.restore();
    });
  }

  // 4b. Interactive Tutorial Visual Clues ("Show, Don't Tell" Glowing Floor Chevrons)
  if (sim.isTutorial) {
    ctx.save();
    const pulse = 0.55 + Math.sin(sim.worldClock * 6) * 0.35;
    ctx.strokeStyle = `rgba(214, 158, 46, ${pulse})`;
    ctx.lineWidth = 3.5;
    for (let cy = 29; cy >= 11; cy -= 3.5) {
      const ax = 14.0 * SCALE;
      const ay = cy * SCALE;
      ctx.beginPath();
      ctx.moveTo(ax - 12, ay + 6);
      ctx.lineTo(ax, ay - 6);
      ctx.lineTo(ax + 12, ay + 6);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 5. Security Checkpoint Floor Striping
  const secY = lvl.secLineY * SCALE;
  ctx.fillStyle = "rgba(214, 158, 46, 0.16)";
  ctx.fillRect(0, secY - 20, worldW, 40);
  ctx.strokeStyle = "#d69e2e";
  ctx.setLineDash([8, 6]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, secY);
  ctx.lineTo(worldW, secY);
  ctx.stroke();
  ctx.setLineDash([]);

  // 6. Changi Rain Vortex Acoustic Zone
  if (lvl.waterfallZone) {
    const wz = lvl.waterfallZone;
    ctx.fillStyle = "rgba(49, 130, 206, 0.20)";
    ctx.fillRect(wz.x * SCALE, wz.y * SCALE, wz.w * SCALE, wz.h * SCALE);
    const vcx = (wz.x + wz.w * 0.5) * SCALE;
    const vcy = (wz.y + wz.h * 0.5) * SCALE;
    ctx.strokeStyle = "rgba(49, 130, 206, 0.45)";
    ctx.lineWidth = 2;
    for (let ring = 1; ring <= 3; ring++) {
      const rr = ((sim.worldClock * 24 + ring * 28) % 95) + 16;
      ctx.beginPath();
      ctx.arc(vcx, vcy, rr, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = "#1e4e8c";
    ctx.font = "900 10.5px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText(wz.label, vcx, wz.y * SCALE + 15);
  }

  // 7. Timed Shuttle Gate
  if (lvl.shuttleGateY !== null) {
    const sy = lvl.shuttleGateY * SCALE;
    ctx.fillStyle = sim.shuttleOpen ? "rgba(47, 133, 90, 0.34)" : "rgba(197, 48, 48, 0.86)";
    ctx.fillRect(1.2 * SCALE, sy - 9, 11.5 * SCALE, 18);
    ctx.strokeStyle = "#141413";
    ctx.lineWidth = 2;
    ctx.strokeRect(1.2 * SCALE, sy - 9, 11.5 * SCALE, 18);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 10px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      sim.shuttleOpen ? "🟢 SHUTTLE OPEN" : "🔴 SHUTTLE LOCKED",
      7.0 * SCALE,
      sy + 3.5
    );
  }

  // 8. Moving Walkways
  lvl.walkways.forEach((wk) => {
    const wx = wk.x * SCALE;
    const wy = wk.y * SCALE;
    const ww = wk.w * SCALE;
    const wh = wk.h * SCALE;
    ctx.fillStyle = wk.vx >= 0 ? "rgba(47, 133, 90, 0.22)" : "rgba(197, 48, 48, 0.20)";
    ctx.fillRect(wx, wy, ww, wh);
    ctx.strokeStyle = wk.vx >= 0 ? "#2f855a" : "#c53030";
    ctx.lineWidth = 1.8;
    ctx.strokeRect(wx, wy, ww, wh);
    ctx.fillStyle = "#141413";
    ctx.font = "900 10px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText(wk.label, wx + ww * 0.5, wy + wh * 0.5 + 3.5);
  });

  // 9. Wet Floor Puddles + Yellow Cones
  lvl.wetZones.forEach((wz) => {
    const x = wz.x * SCALE;
    const y = wz.y * SCALE;
    const w = wz.w * SCALE;
    const h = wz.h * SCALE;
    ctx.fillStyle = "rgba(56, 178, 172, 0.34)";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 10);
    ctx.fill();
    ctx.strokeStyle = "#2b6cb0";
    ctx.lineWidth = 1.8;
    ctx.stroke();

    const cx = x + w * 0.5;
    const cy = y + h * 0.5;
    ctx.fillStyle = "#ecc94b";
    ctx.strokeStyle = "#141413";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 9);
    ctx.lineTo(cx - 8, cy + 6);
    ctx.lineTo(cx + 8, cy + 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  // 10. Walls, Stanchions, X-Ray Archways & Check-In Kiosks
  lvl.walls.forEach((w) => {
    const wx = w.x * SCALE;
    const wy = w.y * SCALE;
    const ww = w.w * SCALE;
    const wh = w.h * SCALE;

    if (w.isKiosk) {
      ctx.fillStyle = "#141413";
      ctx.fillRect(wx + 3, wy + 4, ww, wh);
      ctx.fillStyle = "#2d3748";
      ctx.fillRect(wx, wy, ww, wh);
      ctx.fillStyle = "#d69e2e";
      ctx.fillRect(wx, wy, ww, 5);
      ctx.strokeStyle = "#141413";
      ctx.lineWidth = 2;
      ctx.strokeRect(wx, wy, ww, wh);
    } else if (w.isStanchion) {
      ctx.fillStyle = "#742a2a";
      ctx.fillRect(wx, wy + wh * 0.25, ww, wh * 0.5);
      for (let px = wx; px <= wx + ww; px += 30) {
        ctx.fillStyle = "#141413";
        ctx.beginPath();
        ctx.arc(px, wy + wh * 0.5, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (w.isXray) {
      ctx.fillStyle = "#4a5568";
      ctx.fillRect(wx, wy, ww, wh);
      ctx.strokeStyle = "#141413";
      ctx.lineWidth = 2;
      ctx.strokeRect(wx, wy, ww, wh);
      ctx.fillStyle = "#48bb78";
      ctx.beginPath();
      ctx.arc(wx + 10, wy + wh * 0.5, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = "#1c1c1b";
      ctx.fillRect(wx, wy, ww, wh);
      ctx.strokeStyle = "#3a3a38";
      ctx.lineWidth = 1.4;
      ctx.strokeRect(wx, wy, ww, wh);
    }

    if (w.label) {
      ctx.fillStyle = "#fefcbf";
      ctx.font = "900 9.5px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.fillText(w.label, wx + ww * 0.5, wy + wh * 0.5 + 3.5);
    }
  });

  // 11. Potted Tropical Palms
  if (lvl.palms) {
    lvl.palms.forEach((pm) => {
      const px = pm.x * SCALE;
      const py = pm.y * SCALE;
      ctx.fillStyle = "#9c4221";
      ctx.strokeStyle = "#141413";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(px, py, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "#2f855a";
      ctx.lineWidth = 2.8;
      for (let f = 0; f < 5; f++) {
        const a = (f / 5) * Math.PI * 2 + 0.3;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(a) * 11, py + Math.sin(a) * 11);
        ctx.stroke();
      }
    });
  }

  // 12. Mystery Stalls with Swinging Doors & Occupancy Bolt Indicators
  lvl.stalls.forEach((st) => {
    const sx = st.x * SCALE;
    const sy = st.y * SCALE;
    const sw = st.w * SCALE;
    const sh = st.h * SCALE;

    ctx.fillStyle = !st.inspected ? "#553c9a" : st.open ? "#276749" : "#9b2c2c";
    ctx.strokeStyle = "#141413";
    ctx.lineWidth = 2.6;
    ctx.fillRect(sx, sy, sw, sh);
    ctx.strokeRect(sx, sy, sw, sh);

    const boltColor = !st.inspected ? "#b794f4" : st.open ? "#68d391" : "#fc8181";
    ctx.fillStyle = boltColor;
    ctx.fillRect(sx + 5, sy + sh - 7, sw - 10, 6);
    ctx.strokeRect(sx + 5, sy + sh - 7, sw - 10, 6);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 9.5px 'Courier New', monospace";
    ctx.textAlign = "center";
    const topTag = !st.inspected ? "🚽 [?]" : st.open ? "✅ OPEN!" : "🔒 LOCKED";
    ctx.fillText(topTag, sx + sw * 0.5, sy + sh * 0.48);
    ctx.fillText(st.label, sx + sw * 0.5, sy + sh * 0.74);
  });

  // 13. Interactable Props with Compact Badges
  lvl.props.forEach((pr) => {
    if (pr.used) return;
    const px = pr.x * SCALE;
    const py = pr.y * SCALE;

    // Pulsing tutorial ring around props in tutorial
    if (sim.isTutorial) {
      ctx.strokeStyle = "rgba(214, 158, 46, 0.75)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(px, py, 14 + Math.sin(sim.worldClock * 7) * 3, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle =
      pr.type === "spicy_food" || pr.type === "perfume_ambush"
        ? "#c53030"
        : pr.type === "intel_clipboard"
        ? "#2f855a"
        : "#d69e2e";
    ctx.strokeStyle = "#141413";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(px, py, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.font = "900 10px 'Courier New', monospace";
    const tw = ctx.measureText(pr.label).width + 10;
    ctx.fillStyle = "rgba(20, 20, 19, 0.88)";
    ctx.fillRect(px - tw * 0.5, py - 24, tw, 14);
    ctx.fillStyle = "#fefcbf";
    ctx.textAlign = "center";
    ctx.fillText(pr.label, px, py - 14);
  });

  // 14. Articulated Custodians & Mop Cart Barricades
  lvl.hazards.forEach((hz) => {
    const drawX = (hz.cleared ? hz.lureX : hz.x) * SCALE;
    const drawY = (hz.cleared ? hz.lureY : hz.y) * SCALE;
    const w = hz.w * SCALE;
    const h = hz.h * SCALE;

    if (!hz.cleared) {
      ctx.fillStyle = "#ecc94b";
      ctx.strokeStyle = "#141413";
      ctx.lineWidth = 2.5;
      ctx.fillRect(drawX - w * 0.5, drawY - h * 0.5, w, h);
      ctx.strokeRect(drawX - w * 0.5, drawY - h * 0.5, w, h);

      ctx.fillStyle = "#141413";
      ctx.font = "900 9.5px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.fillText("⚠ JANITOR BARRICADE (🍬 BRIBE / 🗑️ LURE)", drawX, drawY - h * 0.5 - 5);
    } else {
      ctx.fillStyle = "rgba(47, 133, 90, 0.88)";
      ctx.fillRect(drawX - 54, drawY - 9, 108, 18);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 9.5px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.fillText("🧹 BRIBED / LURED", drawX, drawY + 3.5);
    }
  });

  // 15. Articulated Passenger Crowds
  lvl.crowds.forEach((c) => {
    const cx = c.x * SCALE;
    const cy = c.y * SCALE;
    const r = c.r * SCALE;

    ctx.fillStyle = "#2d3748";
    ctx.strokeStyle = "#141413";
    ctx.lineWidth = 1.8;
    ctx.fillRect(cx + r * 0.65, cy - 5, 8, 12);
    ctx.strokeRect(cx + r * 0.65, cy - 5, 8, 12);

    ctx.fillStyle = c.partedTimer > 0 ? "#48bb78" : "#805ad5";
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 9.5px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText(c.partedTimer > 0 ? "😱 ASIDE!" : c.label, cx, cy - r - 4);
  });

  // 16. Articulated Security Guards, Segway Supervisors & Robo-Scrubbers
  lvl.guards.forEach((g) => {
    const gx = g.x * SCALE;
    const gy = g.y * SCALE;
    const rangePx = g.range * SCALE;
    const halfRad = (g.fovDeg * Math.PI) / 360;

    ctx.fillStyle =
      sim.suspicion > 45 ? "rgba(197, 48, 48, 0.28)" : "rgba(214, 158, 46, 0.19)";
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.arc(gx, gy, rangePx, g.angle - halfRad, g.angle + halfRad);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#141413";
    ctx.lineWidth = 2;

    if (g.isRobo) {
      ctx.fillStyle = "#319795";
      ctx.beginPath();
      ctx.arc(gx, gy, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (g.isSegway) {
      ctx.fillStyle = "#141413";
      ctx.fillRect(gx - 11, gy - 9, 4, 18);
      ctx.fillRect(gx + 7, gy - 9, 4, 18);
      ctx.fillStyle = "#2b6cb0";
      ctx.beginPath();
      ctx.arc(gx, gy, 8.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillStyle = "#1a365d";
      ctx.beginPath();
      ctx.ellipse(gx, gy + 2, 11, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#c53030";
      ctx.beginPath();
      ctx.arc(gx, gy - 2, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.fillStyle = "#141413";
    ctx.font = "900 9px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText(g.label, gx, gy - 14);
  });

  // --- B. PROTAGONIST WITH 32PX IN-WORLD EXPRESSIVE HEAD ---
  const px = p.x * SCALE;
  const py = p.y * SCALE;
  const skew = dial.tier !== "stop" ? Math.sin(p.waddlePhase) * 4.0 : 0;

  if (p.clenchActive > 0) {
    ctx.strokeStyle = "#3182ce";
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.arc(px, py, 21, 0, Math.PI * 2);
    ctx.stroke();
  } else if (p.pokerFaceTimer > 0) {
    ctx.strokeStyle = "#d69e2e";
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.arc(px, py, 20, 0, Math.PI * 2);
    ctx.stroke();
  } else if (p.elbowDashTimer > 0) {
    ctx.strokeStyle = "#c53030";
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.arc(px - p.dashDirX * 12, py - p.dashDirY * 12, 16, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.strokeStyle = "#141413";
  ctx.lineWidth = 3.0;
  const crouchY = dial.tier === "sprint" || sim.crampActiveSec > 0 ? 2.5 : 0;
  ctx.fillStyle = "#f7fafc";
  ctx.beginPath();
  ctx.roundRect(px - 6 + skew * 0.2, py - 4 + crouchY, 12, 13, 3);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(px - 6, py - 1 + crouchY);
  ctx.lineTo(px - 12 - skew * 0.5, py + 6);
  ctx.moveTo(px + 6, py - 1 + crouchY);
  ctx.lineTo(px + 12 + skew * 0.5, py + 6);
  ctx.moveTo(px - 3.5, py + 9);
  ctx.lineTo(px - 7 + skew, py + 18);
  ctx.moveTo(px + 3.5, py + 9);
  ctx.lineTo(px + 7 - skew, py + 18);
  ctx.stroke();

  if (p.flipFlops) {
    ctx.fillStyle = "#38a169";
    ctx.fillRect(px - 10 + skew, py + 16, 7, 3.5);
    ctx.fillRect(px + 3 - skew, py + 16, 7, 3.5);
  }

  // 36px Expressive Johnny Rocketfingers Head rendered directly on protagonist
  const headSize = 36;
  const { canvas: hCanvas, ctx: hCtx } = getHeadBuffer(headSize);
  drawJohnnyExpression(hCtx, headSize, headSize, sim.activeExpression, sim.worldClock);

  const drawHeadR = 15.5;
  ctx.save();
  ctx.translate(px + skew * 0.4, py - 18 + crouchY);
  ctx.rotate(skew * 0.035);
  ctx.beginPath();
  ctx.arc(0, 0, drawHeadR, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(hCanvas, -drawHeadR, -drawHeadR, drawHeadR * 2, drawHeadR * 2);
  ctx.restore();

  ctx.strokeStyle = "#141413";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(px + skew * 0.4, py - 18 + crouchY, drawHeadR, 0, Math.PI * 2);
  ctx.stroke();

  // --- C. FLOATING REWARD & DECOY FLARES ---
  sim.rewardFlares.forEach((fl) => {
    const fx = fl.x * SCALE;
    const fy = fl.y * SCALE - 28;
    const isNegative = fl.label.startsWith("-") || fl.label.includes("LOCKED");
    ctx.save();
    ctx.font = "900 12px 'Courier New', monospace";
    const tw = ctx.measureText(fl.label).width + 14;
    ctx.fillStyle = isNegative ? "#c53030" : "#276749";
    ctx.strokeStyle = "#fefcbf";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(fx - tw * 0.5, fy - 14, tw, 20, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#fefcbf";
    ctx.textAlign = "center";
    ctx.fillText(fl.label, fx, fy);
    ctx.restore();
  });

  // --- D. COMPACT SPEECH BUBBLES ---
  sim.speechBubbles.forEach((b) => {
    drawComicSpeechBubble(ctx, b.x, b.y, b.text, b.speakerType, camX, camY, canvas.width, SCALE);
  });

  ctx.restore();

  // --- E. PINK BERGAMOT PERFUME MIST OVERLAY ---
  if (sim.perfumeFlashTimer > 0) {
    ctx.fillStyle = `rgba(237, 100, 166, ${Math.min(0.36, sim.perfumeFlashTimer * 0.2)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // --- F. LIVE CORNER MINI-MAP RADAR ---
  drawMiniMapRadar(ctx, canvas, sim);

  // --- G. TOUCH VIRTUAL JOYSTICK (HIDDEN AUTOMATICALLY ON COMPUTERS!) ---
  if (sim.state === "playing" && !dial.hideTouchOverlay) {
    ctx.save();
    ctx.fillStyle = "rgba(20, 20, 19, 0.42)";
    ctx.strokeStyle = "rgba(243, 239, 230, 0.65)";
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.arc(dial.ox, dial.oy, dial.maxR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "rgba(214, 158, 46, 0.38)";
    ctx.beginPath();
    ctx.arc(dial.ox, dial.oy, dial.maxR * 0.65, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle =
      dial.tier === "sprint" ? "#c53030" : dial.tier === "walk" ? "#d69e2e" : "#f3efe6";
    ctx.beginPath();
    ctx.arc(dial.cx, dial.cy, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#141413";
    ctx.lineWidth = 2.2;
    ctx.stroke();
    ctx.restore();
  }
}
