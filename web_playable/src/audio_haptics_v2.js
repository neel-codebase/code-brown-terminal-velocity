/**
 * @file audio_haptics_v2.js
 * @version 2.1.0
 * @description Mobile-Unlocked Procedural WebAudio Synthesizer & Haptic Feedback Engine.
 * Fixes iOS Safari / Android Chrome silent audio by synchronously unlocking both an
 * HTML5 <audio> silent WAV bridge and a WebAudio AudioContext on first touch/pointer gesture.
 */

// 44-byte valid 1-sample silent PCM WAV for unlocking iOS Safari media channel
const SILENT_WAV_URI =
  "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

export function createAudioHapticsEngine() {
  let audioCtx = null;
  let unlocked = false;
  let muted = false;
  let htmlAudioBridge = null;
  let stepCooldown = 0;

  function ensureContext() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        audioCtx = new AC();
      }
    }
    return audioCtx;
  }

  /**
   * Synchronously called inside touchstart / touchend / pointerdown / click
   * so iOS WebKit and Android Chrome unlock hardware audio output immediately.
   */
  function unlockMobileAudio() {
    if (muted) return;
    try {
      const ctx = ensureContext();
      if (ctx && ctx.state === "suspended") {
        ctx.resume();
      }
      if (ctx && !unlocked) {
        // Play a 1-frame silent buffer through WebAudio
        const buf = ctx.createBuffer(1, 1, 22050);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(ctx.destination);
        src.start(0);
      }
      // Also unlock iOS media channel via inline <audio> element
      if (!htmlAudioBridge) {
        htmlAudioBridge = new Audio(SILENT_WAV_URI);
        htmlAudioBridge.setAttribute("playsinline", "true");
        htmlAudioBridge.volume = 0.01;
      }
      const p = htmlAudioBridge.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          unlocked = true;
        }).catch(() => {});
      }
      if (ctx && ctx.state === "running") {
        unlocked = true;
      }
    } catch (_) {}
  }

  // Bind global gesture unlock listeners for phones & tablets
  ["touchstart", "touchend", "pointerdown", "click", "keydown"].forEach((evt) => {
    window.addEventListener(evt, unlockMobileAudio, { passive: true, capture: true });
  });

  function vibrate(pattern) {
    try {
      if (navigator.vibrate && !muted) {
        navigator.vibrate(pattern);
      }
    } catch (_) {}
  }

  function playTone(freqStart, freqEnd, durationSec, type = "triangle", gainPeak = 0.16, delaySec = 0) {
    if (muted) return;
    try {
      const ctx = ensureContext();
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume();

      const now = ctx.currentTime + delaySec;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(Math.max(24, freqStart), now);
      if (freqEnd !== freqStart) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(24, freqEnd), now + durationSec);
      }

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(gainPeak, now + Math.min(0.02, durationSec * 0.25));
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + durationSec + 0.02);
    } catch (_) {}
  }

  return {
    get isMuted() {
      return muted;
    },
    get isUnlocked() {
      return unlocked;
    },
    unlockMobileAudio,
    unlock: unlockMobileAudio,
    toggleMute() {
      muted = !muted;
      if (!muted) {
        unlockMobileAudio();
        playTone(520, 780, 0.12, "sine", 0.14);
      }
      return muted;
    },
    playStep(dt, isSprint) {
      stepCooldown -= dt;
      if (stepCooldown <= 0) {
        stepCooldown = isSprint ? 0.16 : 0.28;
        playTone(isSprint ? 190 : 140, isSprint ? 110 : 85, 0.045, "triangle", 0.07);
      }
    },
    playPickup() {
      vibrate(25);
      playTone(523.25, 659.25, 0.09, "sine", 0.16, 0);
      playTone(659.25, 1046.5, 0.14, "sine", 0.18, 0.08);
    },
    playBribe() {
      vibrate([30, 40, 50]);
      playTone(440, 554.37, 0.1, "triangle", 0.16, 0);
      playTone(554.37, 659.25, 0.1, "triangle", 0.16, 0.09);
      playTone(659.25, 880, 0.18, "sine", 0.18, 0.18);
    },
    playTutorialDing() {
      vibrate([20, 30, 40]);
      playTone(587.33, 880, 0.11, "sine", 0.18, 0);
      playTone(880, 1174.66, 0.22, "sine", 0.20, 0.1);
    },
    playClench() {
      vibrate(45);
      playTone(220, 540, 0.16, "sine", 0.18, 0);
      playTone(540, 420, 0.12, "triangle", 0.14, 0.14);
    },
    playPokerWhistle() {
      vibrate(20);
      // Casual two-note lounge whistle
      playTone(740, 987.77, 0.16, "sine", 0.14, 0);
      playTone(987.77, 880, 0.22, "sine", 0.14, 0.18);
    },
    playDash() {
      vibrate(35);
      playTone(320, 140, 0.18, "sawtooth", 0.14, 0);
    },
    playSlip() {
      vibrate([40, 30, 60]);
      // Comic banana-peel slide whistle!
      playTone(380, 1120, 0.16, "sine", 0.17, 0);
      playTone(1120, 260, 0.24, "sine", 0.17, 0.16);
    },
    playCrampRumble() {
      vibrate([70, 40, 90]);
      playTone(92, 48, 0.35, "sawtooth", 0.20, 0);
      playTone(75, 42, 0.30, "triangle", 0.18, 0.15);
    },
    playAlert() {
      vibrate([50, 30, 50]);
      playTone(680, 880, 0.11, "square", 0.12, 0);
      playTone(680, 880, 0.13, "square", 0.12, 0.13);
    },
    playLockedDoor() {
      vibrate([45, 25, 45]);
      playTone(150, 95, 0.08, "square", 0.15, 0);
      playTone(135, 85, 0.09, "square", 0.15, 0.09);
    },
    playWinFanfare() {
      vibrate([40, 50, 120]);
      playTone(523.25, 523.25, 0.12, "triangle", 0.18, 0);
      playTone(659.25, 659.25, 0.12, "triangle", 0.18, 0.12);
      playTone(783.99, 783.99, 0.12, "triangle", 0.18, 0.24);
      playTone(1046.5, 1046.5, 0.38, "sine", 0.22, 0.36);
    },
    playCodeBrownFail() {
      vibrate([120, 60, 180]);
      // Sad noir trombone ("Wah-wah-waaah")
      playTone(293.66, 277.18, 0.22, "sawtooth", 0.15, 0);
      playTone(277.18, 261.63, 0.22, "sawtooth", 0.15, 0.24);
      playTone(261.63, 185.0, 0.55, "sawtooth", 0.17, 0.48);
    }
  };
}
