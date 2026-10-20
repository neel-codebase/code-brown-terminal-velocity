/**
 * @file tenant_classifier_v2.js
 * @version 2.1.0
 * @description Multi-Tenant Distribution & Live User Classification Engine.
 * Supports:
 *   1. Distribution Tenants (Direct Web Uncut, In-App Playable Ad MRAID/Embed,
 *      Apple/Google Store-Safe 12+, and Friends & Copilots VIP Playtest).
 *   2. Automatic Device/Input Detection (Desktop Computer WASD/Arrows vs Mobile Touch).
 *   3. Dynamic Player Behavioral Classification (Rookie, Stealth Tactician,
 *      Chaos Saboteur, Speedrun Daredevil) + Exportable Playtest Telemetry Report.
 */

const TELEMETRY_KEY = "code_brown_telemetry_v2";

export const TENANT_PROFILES = {
  indie_web: {
    id: "indie_web",
    name: "Direct Web (Uncut Comedy)",
    badge: "🌐 WEB UNCUT (17+)",
    forceSafeTitle: false,
    autoStartTutorial: false,
    isPlayableAd: false,
    ctaLabel: "NEXT TERMINAL ➔"
  },
  playable_ad: {
    id: "playable_ad",
    name: "In-App Playable Ad (30s Demo)",
    badge: "📲 PLAYABLE AD DEMO",
    forceSafeTitle: true,
    autoStartTutorial: true,
    isPlayableAd: true,
    ctaLabel: "🔥 PLAY FULL GAME NOW (5 TERMINALS) ➔"
  },
  app_store_safe: {
    id: "app_store_safe",
    name: "App Store / Play Store (12+ Safe)",
    badge: "🛡️ STORE-SAFE (12+)",
    forceSafeTitle: true,
    autoStartTutorial: false,
    isPlayableAd: false,
    ctaLabel: "NEXT TERMINAL ➔"
  },
  copilots_playtest: {
    id: "copilots_playtest",
    name: "Friends & Copilots VIP Playtest",
    badge: "🧪 VIP PLAYTESTER",
    forceSafeTitle: false,
    autoStartTutorial: false,
    isPlayableAd: false,
    ctaLabel: "NEXT TERMINAL ➔"
  }
};

export function detectInitialDeviceClass() {
  const ua = navigator.userAgent || "";
  const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  const hasFinePointer =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: fine) and (hover: hover)").matches;

  if (!isMobileUA && hasFinePointer) {
    return "desktop_computer"; // Automatically uses WASD / Arrow Keys & hides screen radials!
  }
  if (Math.min(window.innerWidth, window.innerHeight) >= 680) {
    return "tablet_touch";
  }
  return "mobile_phone";
}

export function createTenantClassifier() {
  const params = new URLSearchParams(window.location.search);
  const urlTenant = params.get("tenant") || (params.get("ad") === "1" ? "playable_ad" : null);

  let stored = {};
  try {
    const raw = localStorage.getItem(TELEMETRY_KEY);
    if (raw) stored = JSON.parse(raw) || {};
  } catch (_) {}

  const state = {
    sessionId: stored.sessionId || "usr_" + Math.random().toString(36).slice(2, 9),
    tenantId:
      urlTenant && TENANT_PROFILES[urlTenant]
        ? urlTenant
        : stored.tenantId && TENANT_PROFILES[stored.tenantId]
        ? stored.tenantId
        : "indie_web",
    deviceClass: detectInitialDeviceClass(), // "desktop_computer" | "mobile_phone" | "tablet_touch"
    userArchetype: stored.userArchetype || "onboarding_traveler",
    tutorialCompleted: !!stored.tutorialCompleted,
    starterBonusUnlocked: !!stored.starterBonusUnlocked,
    metrics: stored.metrics || {
      runsStarted: 0,
      runsWon: 0,
      tutorialsCompleted: 0,
      bribesUsed: 0,
      sabotagesUsed: 0,
      clenchesUsed: 0,
      pokerFacesUsed: 0,
      adCtaClicks: 0
    },
    funnelLog: []
  };

  function persist() {
    try {
      localStorage.setItem(
        TELEMETRY_KEY,
        JSON.stringify({
          sessionId: state.sessionId,
          tenantId: state.tenantId,
          userArchetype: state.userArchetype,
          tutorialCompleted: state.tutorialCompleted,
          starterBonusUnlocked: state.starterBonusUnlocked,
          metrics: state.metrics
        })
      );
    } catch (_) {}
  }

  function recomputeArchetype() {
    const m = state.metrics;
    if (!state.tutorialCompleted && m.runsWon === 0) {
      state.userArchetype = "onboarding_traveler";
    } else if (m.sabotagesUsed + m.bribesUsed >= 3 && m.pokerFacesUsed >= 2) {
      state.userArchetype = "stealth_saboteur";
    } else if (m.runsWon >= 2) {
      state.userArchetype = "terminal_speedrunner";
    } else {
      state.userArchetype = "casual_commuter";
    }
    persist();
  }

  function logEvent(eventName, payload = {}) {
    state.funnelLog.push({
      t: new Date().toISOString(),
      evt: eventName,
      tenant: state.tenantId,
      device: state.deviceClass,
      ...payload
    });
    if (state.funnelLog.length > 40) state.funnelLog.shift();

    // MRAID / Playable Ad network bridge hook if embedded in an external game webview
    if (window.mraid && eventName === "playable_ad_cta_click" && typeof window.mraid.open === "function") {
      window.mraid.open(window.location.origin + window.location.pathname);
    }
  }

  const ARCHETYPE_LABELS = {
    onboarding_traveler: "First-Time Traveler",
    stealth_saboteur: "Smooth Undercover Operative",
    terminal_speedrunner: "Panic Express Sprinter",
    casual_commuter: "Standard Terminal Commuter"
  };

  function setTenant(tenantId) {
    if (!TENANT_PROFILES[tenantId]) return getActiveTenantProfile();
    state.tenantId = tenantId;
    persist();
    logEvent("tenant_switched", { tenantId });
    return getActiveTenantProfile();
  }

  function getActiveTenantProfile() {
    const prof = TENANT_PROFILES[state.tenantId] || TENANT_PROFILES.indie_web;
    return {
      ...prof,
      defaultSafeTitle: prof.forceSafeTitle
    };
  }

  function getSnapshot() {
    recomputeArchetype();
    const prof = getActiveTenantProfile();
    return {
      sessionId: state.sessionId,
      tenantId: state.tenantId,
      tenantName: prof.name,
      tenantBadge: prof.badge,
      deviceClass: state.deviceClass,
      userSegment: {
        archetypeId: state.userArchetype,
        archetypeLabel: ARCHETYPE_LABELS[state.userArchetype] || "Terminal Traveler",
        skillTier: state.metrics.runsWon >= 2 ? "Veteran" : state.tutorialCompleted ? "Certified" : "Onboarding"
      }
    };
  }

  function recordAbilityUse(abilityName) {
    logEvent("ability_use", { ability: abilityName });
  }

  function recordInputMode(mode) {
    logEvent("input_mode_switched", { mode });
  }

  function triggerPlayableAdCta() {
    state.metrics.adCtaClicks += 1;
    persist();
    logEvent("playable_ad_cta_click", { tenant: state.tenantId });
  }

  function exportPlaytestReport() {
    recomputeArchetype();
    return JSON.stringify(
      {
        sessionId: state.sessionId,
        tenant: state.tenantId,
        deviceClass: state.deviceClass,
        userArchetype: state.userArchetype,
        tutorialCompleted: state.tutorialCompleted,
        starterBonusUnlocked: state.starterBonusUnlocked,
        metrics: state.metrics
      },
      null,
      2
    );
  }

  function exportSessionReport() {
    const jsonStr = exportPlaytestReport();
    try {
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `code_brown_telemetry_${state.sessionId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (_) {}
    return jsonStr;
  }

  return {
    state,
    setTenant,
    getActiveTenantProfile,
    getActiveTenant: getActiveTenantProfile,
    getSnapshot,
    recordAbilityUse,
    recordInputMode,
    triggerPlayableAdCta,
    recomputeArchetype,
    logEvent,
    persist,
    exportPlaytestReport,
    exportSessionReport
  };
}
