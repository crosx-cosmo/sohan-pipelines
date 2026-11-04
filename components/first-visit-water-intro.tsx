'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

const INTRO_STORAGE_KEY = 'sohan_pipelines_water_intro_session_v5';
const LEGACY_KEYS = [
  'sohan_pipelines_water_intro_seen_v1',
  'sohan_pipelines_water_intro_session_v2',
  'sohan_pipelines_water_intro_session_v3',
  'sohan_pipelines_water_intro_session_v4',
];
const CART_STORAGE_KEY = 'sohan_pipelines_cart_v1';
const LOADING_SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours default loading session

// Module-level guard so internal SPA route navigation never replays the animation.
let hasPlayedInCurrentSession = false;

function isWithin24HourLoadingSession(): boolean {
  try {
    for (const key of LEGACY_KEYS) {
      window.localStorage.removeItem(key);
    }
    const raw = window.localStorage.getItem(INTRO_STORAGE_KEY);
    if (!raw) return false;
    const lastTimestamp = Number(raw);
    if (!Number.isFinite(lastTimestamp) || lastTimestamp <= 0) return false;
    const elapsed = Date.now() - lastTimestamp;
    return elapsed >= 0 && elapsed < LOADING_SESSION_TTL_MS;
  } catch {
    return false;
  }
}

function record24HourLoadingSession(): void {
  try {
    window.localStorage.setItem(INTRO_STORAGE_KEY, String(Date.now()));
  } catch {
    // Ignore storage restrictions
  }
}

/**
 * Safely triggers short, controlled hardware vibration via `navigator.vibrate()`
 * when supported and permitted by the browser/device. Never throws or assumes support.
 */
function triggerHardwareHaptic(pattern: number | number[]): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  try {
    if (typeof navigator.vibrate === 'function') {
      return Boolean(navigator.vibrate(pattern));
    }
  } catch {
    // Browser blocked vibration (e.g., lack of user gesture activation or unsupported OS)
  }
  return false;
}

/**
 * Provides a subtle, controlled 140ms visual impact micro-refraction pulse on the live
 * webpage at the exact moment the droplet lands, ensuring tactile visual feedback
 * even when hardware vibration is unavailable.
 */
function triggerVisualImpactFallback(): void {
  if (typeof document === 'undefined') return;
  const mainEl = document.querySelector('main');
  if (!mainEl || typeof mainEl.animate !== 'function') return;
  try {
    mainEl.animate(
      [
        { transform: 'translate3d(0, 0, 0)' },
        { transform: 'translate3d(0, 1.5px, 0)' },
        { transform: 'translate3d(0, -0.5px, 0)' },
        { transform: 'translate3d(0, 0, 0)' },
      ],
      {
        duration: 140,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }
    );
  } catch {
    // Ignore if Web Animations API is unavailable
  }
}

/**
 * Original Procedural Web Audio Synthesizer for Water Physics & Pixel-Inspired Wave Resonance.
 * Respects browser autoplay policies and falls back silently if blocked.
 */
class WaterAcousticEngine {
  private ctx: AudioContext | null = null;
  private isMuted = false;

  constructor() {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        if (this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {
            this.isMuted = true;
          });
        }
      }
    } catch {
      this.isMuted = true;
    }
  }

  public unlock() {
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx
        .resume()
        .then(() => {
          this.isMuted = false;
        })
        .catch(() => {
          this.isMuted = true;
        });
    }
  }

  private canPlay(): boolean {
    return Boolean(
      this.ctx && !this.isMuted && this.ctx.state === 'running'
    );
  }

  /** Soft crystalline water droplet condensation sound */
  public playDropletFormation() {
    if (!this.canPlay() || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(510, now);
      osc.frequency.exponentialRampToValueAtTime(760, now + 0.24);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.018, now + 0.07);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch {
      // Silent fallback
    }
  }

  /** Subtle laminar falling-water movement */
  public playDropletFall() {
    if (!this.canPlay() || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(285, now + 0.32);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.015, now + 0.07);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Silent fallback
    }
  }

  /**
   * Authentic Minnaert bubble-cavity water impact +
   * subtle low-frequency resonance + delicate Pixel-inspired upward wave shimmer.
   */
  public playWaterImpactAndResonance() {
    if (!this.canPlay() || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      // 1. Primary Minnaert Bubble Cavity Plip (upward exponential pitch sweep)
      const dropOsc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();
      dropOsc.type = 'sine';
      dropOsc.frequency.setValueAtTime(320, now);
      dropOsc.frequency.exponentialRampToValueAtTime(1180, now + 0.072);

      dropGain.gain.setValueAtTime(0.0001, now);
      dropGain.gain.linearRampToValueAtTime(0.09, now + 0.008);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.095);

      dropOsc.connect(dropGain);
      dropGain.connect(this.ctx.destination);
      dropOsc.start(now);
      dropOsc.stop(now + 0.1);

      // 2. Secondary Rebound Pearl Droplet Plip (135ms after primary impact)
      const pearlOsc = this.ctx.createOscillator();
      const pearlGain = this.ctx.createGain();
      pearlOsc.type = 'sine';
      pearlOsc.frequency.setValueAtTime(540, now + 0.135);
      pearlOsc.frequency.exponentialRampToValueAtTime(1480, now + 0.19);

      pearlGain.gain.setValueAtTime(0.0001, now + 0.135);
      pearlGain.gain.linearRampToValueAtTime(0.042, now + 0.143);
      pearlGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.21);

      pearlOsc.connect(pearlGain);
      pearlGain.connect(this.ctx.destination);
      pearlOsc.start(now + 0.135);
      pearlOsc.stop(now + 0.22);

      // 3. Subtle Low-Frequency Tactile Resonance (synchronized with bottom-up wave)
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(104, now);
      subOsc.frequency.exponentialRampToValueAtTime(54, now + 0.48);

      subGain.gain.setValueAtTime(0.0001, now);
      subGain.gain.linearRampToValueAtTime(0.068, now + 0.025);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.52);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.55);

      // 4. Delicate Luminous Bottom-Up Wave Shimmer
      const shimmerFreqs = [528, 792, 1056];
      shimmerFreqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const shimOsc = this.ctx.createOscillator();
        const shimGain = this.ctx.createGain();
        shimOsc.type = 'sine';
        shimOsc.frequency.setValueAtTime(freq, now + 0.03 + idx * 0.045);
        shimOsc.frequency.exponentialRampToValueAtTime(
          freq * 1.025,
          now + 1.05
        );

        const peak = idx === 0 ? 0.018 : idx === 1 ? 0.011 : 0.007;
        shimGain.gain.setValueAtTime(0.0001, now + 0.03 + idx * 0.045);
        shimGain.gain.linearRampToValueAtTime(peak, now + 0.18);
        shimGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.08);

        shimOsc.connect(shimGain);
        shimGain.connect(this.ctx.destination);
        shimOsc.start(now + 0.03 + idx * 0.045);
        shimOsc.stop(now + 1.1);
      });
    } catch {
      // Silent fallback
    }
  }

  public dispose() {
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}

export function FirstVisitWaterIntro() {
  const pathname = usePathname();
  const [visible, setVisible] = React.useState(false);
  const [fadingOut, setFadingOut] = React.useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const refractionBandRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Do not replay on internal route navigation
    if (hasPlayedInCurrentSession) return;

    // 2. Respect prefers-reduced-motion accessibility preference
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      hasPlayedInCurrentSession = true;
      record24HourLoadingSession();
      return;
    }

    // 3. Do not interrupt an active booking or find-booking workflow
    if (
      pathname.startsWith('/book') ||
      pathname.startsWith('/find-booking')
    ) {
      hasPlayedInCurrentSession = true;
      return;
    }

    try {
      // Check if user is still within their 24-hour loading session
      if (isWithin24HourLoadingSession()) {
        hasPlayedInCurrentSession = true;
        return;
      }

      const activeCartRaw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (activeCartRaw) {
        const parsedCart = JSON.parse(activeCartRaw);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          hasPlayedInCurrentSession = true;
          record24HourLoadingSession();
          return;
        }
      }
    } catch {
      // Graceful fallback if localStorage is restricted
    }

    hasPlayedInCurrentSession = true;

    // Trigger once the initial page is painted and visible
    let rafId = 0;
    const startOverlay = () => {
      rafId = window.requestAnimationFrame(() => {
        setVisible(true);
      });
    };

    if (document.readyState === 'complete') {
      startOverlay();
    } else {
      window.addEventListener('load', startOverlay, { once: true });
      const fallbackTimer = window.setTimeout(startOverlay, 120);
      return () => {
        window.removeEventListener('load', startOverlay);
        window.clearTimeout(fallbackTimer);
        window.cancelAnimationFrame(rafId);
      };
    }

    return () => window.cancelAnimationFrame(rafId);
  }, [pathname]);

  React.useEffect(() => {
    if (!visible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    // CRITICAL: alpha: true ensures the canvas is 100% transparent over the live website
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const audio = new WaterAcousticEngine();
    const unlockInteraction = () => {
      audio.unlock();
    };
    window.addEventListener('pointerdown', unlockInteraction, {
      once: true,
      passive: true,
    });
    window.addEventListener('touchstart', unlockInteraction, {
      once: true,
      passive: true,
    });
    window.addEventListener('keydown', unlockInteraction, {
      once: true,
      passive: true,
    });

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Single Clean Droplet Timing & Parameters
    const FORM_START_TIME = 60;
    const FALL_START_TIME = 420;
    const IMPACT_TIME = 960;
    const WAVE_DURATION = 1720;
    const FADE_START_TIME = 2360;
    const TOTAL_DURATION = 2720;

    let playedFormSound = false;
    let playedFallSound = false;
    let playedImpact = false;
    let triggeredFadeOut = false;

    /**
     * Renders the original clean, transparent, refractive 3D water droplet
     * that blends naturally with the underlying live website.
     */
    const drawTransparentWaterDroplet = (
      x: number,
      y: number,
      rx: number,
      ry: number,
      pinchFactor: number,
      alpha: number
    ) => {
      if (alpha <= 0.01 || rx <= 0.5 || ry <= 0.5) return;

      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;

      // 1. Soft Aqua/Blue Refractive Halo
      const haloGrad = ctx.createRadialGradient(
        0,
        ry * 0.25,
        rx * 0.1,
        0,
        ry * 0.35,
        rx * 1.55
      );
      haloGrad.addColorStop(0, 'rgba(56, 189, 248, 0.20)');
      haloGrad.addColorStop(0.55, 'rgba(34, 211, 238, 0.09)');
      haloGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.ellipse(0, ry * 0.3, rx * 1.45, ry * 1.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Physical Teardrop Contour Path
      ctx.beginPath();
      const topTipY = -ry * (1 + pinchFactor * 0.38);
      ctx.moveTo(0, topTipY);
      ctx.bezierCurveTo(
        rx * (0.55 - pinchFactor * 0.18),
        -ry * 0.55,
        rx * 1.06,
        -ry * 0.05,
        rx,
        ry * 0.32
      );
      ctx.bezierCurveTo(rx * 0.94, ry * 0.82, rx * 0.48, ry, 0, ry);
      ctx.bezierCurveTo(
        -rx * 0.48,
        ry,
        -rx * 0.94,
        ry * 0.82,
        -rx,
        ry * 0.32
      );
      ctx.bezierCurveTo(
        -rx * 1.06,
        -ry * 0.05,
        -rx * (0.55 - pinchFactor * 0.18),
        -ry * 0.55,
        0,
        topTipY
      );
      ctx.closePath();

      // 3. Transparent Liquid Glass Body
      const bodyGrad = ctx.createLinearGradient(
        -rx * 0.5,
        topTipY,
        rx * 0.6,
        ry
      );
      bodyGrad.addColorStop(0, 'rgba(255, 255, 255, 0.14)');
      bodyGrad.addColorStop(0.32, 'rgba(224, 242, 254, 0.22)');
      bodyGrad.addColorStop(0.7, 'rgba(125, 211, 252, 0.30)');
      bodyGrad.addColorStop(1, 'rgba(34, 211, 238, 0.38)');
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // 4. Internal Caustic Lens Refraction
      ctx.save();
      ctx.clip();

      const causticGrad = ctx.createRadialGradient(
        rx * 0.18,
        ry * 0.48,
        rx * 0.04,
        rx * 0.1,
        ry * 0.38,
        rx * 0.85
      );
      causticGrad.addColorStop(0, 'rgba(255, 255, 255, 0.82)');
      causticGrad.addColorStop(0.38, 'rgba(186, 230, 253, 0.42)');
      causticGrad.addColorStop(0.75, 'rgba(56, 189, 248, 0.14)');
      causticGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.fillStyle = causticGrad;
      ctx.fillRect(-rx * 1.2, topTipY, rx * 2.4, ry * 2.4);
      ctx.restore();

      // 5. Crisp Luminous Aqua/Cyan Fresnel Rim Edge
      ctx.lineWidth = Math.max(1.1, rx * 0.085);
      const rimGrad = ctx.createLinearGradient(0, topTipY, 0, ry);
      rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0.52)');
      rimGrad.addColorStop(0.45, 'rgba(56, 189, 248, 0.68)');
      rimGrad.addColorStop(1, 'rgba(34, 211, 238, 0.88)');
      ctx.strokeStyle = rimGrad;
      ctx.stroke();

      // 6. Primary Curved Specular Window Highlight (Upper-Left)
      ctx.save();
      ctx.translate(-rx * 0.34, -ry * 0.08);
      ctx.rotate(-0.32);
      const specGrad = ctx.createLinearGradient(0, -ry * 0.36, 0, ry * 0.36);
      specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.94)');
      specGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.72)');
      specGrad.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
      ctx.fillStyle = specGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx * 0.15, ry * 0.34, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 7. Secondary Pinpoint Specular Glint
      ctx.fillStyle = 'rgba(255, 255, 255, 0.90)';
      ctx.beginPath();
      ctx.arc(
        -rx * 0.18,
        -ry * 0.45,
        Math.max(1.2, rx * 0.075),
        0,
        Math.PI * 2
      );
      ctx.fill();

      // 8. Bottom Rim Reflected Glint
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.84)';
      ctx.lineWidth = Math.max(1, rx * 0.075);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, ry * 0.26, rx * 0.64, Math.PI * 0.18, Math.PI * 0.82);
      ctx.stroke();

      ctx.restore();
    };

    /**
     * Renders a smooth, fluid, undulating Google Pixel-inspired charging wave band
     * rising from the bottom of the screen toward the top with glass-like light diffusion.
     */
    const drawPixelFluidWaveLayer = (
      baseY: number,
      amplitude: number,
      centerArchHeight: number,
      bandDepth: number,
      phase: number,
      frequency: number,
      layerAlpha: number,
      isLeadingBand: boolean,
      clampedScale: number
    ) => {
      if (layerAlpha <= 0.005) return;

      const steps = Math.max(48, Math.min(96, Math.floor(width / 16)));
      const stepX = width / steps;

      const points: Array<{ x: number; y: number }> = [];
      let minWaveY = height;
      let maxWaveY = 0;

      for (let i = 0; i <= steps; i++) {
        const x = i * stepX;
        const normX = x / width;
        const centeredX = (normX - 0.5) * 2;

        // Gentle center dome rise (characteristic of Google Pixel bottom-up charging wave)
        const domeOffset =
          Math.cos(centeredX * Math.PI * 0.5) * centerArchHeight;

        // Smooth dual-harmonic fluid undulation across the horizontal wave crest
        const wave1 =
          Math.sin(normX * Math.PI * 2 * frequency + phase) * amplitude;
        const wave2 =
          Math.cos(normX * Math.PI * 3.5 * frequency - phase * 0.75) *
          (amplitude * 0.38);

        const y = baseY - domeOffset + wave1 + wave2;
        if (y < minWaveY) minWaveY = y;
        if (y > maxWaveY) maxWaveY = y;
        points.push({ x, y });
      }

      const bottomEdgeY = Math.min(height + 40, maxWaveY + bandDepth);
      if (bottomEdgeY <= -40 || minWaveY >= height + 40) return;

      ctx.save();

      // 1. Semi-transparent glass-like luminous wave band fill
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const midX = (prev.x + curr.x) * 0.5;
        const midY = (prev.y + curr.y) * 0.5;
        ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
      }
      const lastPt = points[points.length - 1];
      ctx.lineTo(lastPt.x, lastPt.y);
      ctx.lineTo(width, bottomEdgeY);
      ctx.lineTo(0, bottomEdgeY);
      ctx.closePath();

      const fillGrad = ctx.createLinearGradient(
        0,
        minWaveY - 8 * clampedScale,
        0,
        bottomEdgeY
      );
      fillGrad.addColorStop(
        0,
        `rgba(186, 230, 253, ${(isLeadingBand ? 0.24 : 0.16) * layerAlpha})`
      );
      fillGrad.addColorStop(
        0.18,
        `rgba(56, 189, 248, ${(isLeadingBand ? 0.20 : 0.13) * layerAlpha})`
      );
      fillGrad.addColorStop(
        0.52,
        `rgba(14, 165, 233, ${(isLeadingBand ? 0.10 : 0.06) * layerAlpha})`
      );
      fillGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');

      ctx.fillStyle = fillGrad;
      ctx.fill();

      // 2. Soft diffused aqua/cyan light bloom along the wave crest
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const midX = (prev.x + curr.x) * 0.5;
        const midY = (prev.y + curr.y) * 0.5;
        ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
      }
      ctx.lineTo(lastPt.x, lastPt.y);

      ctx.strokeStyle = `rgba(34, 211, 238, ${(isLeadingBand ? 0.46 : 0.30) * layerAlpha})`;
      ctx.lineWidth = (isLeadingBand ? 4.2 : 2.8) * clampedScale;
      ctx.lineCap = 'round';
      ctx.stroke();

      // 3. Fine glass-like specular highlight along the upper edge of the wave
      ctx.strokeStyle = `rgba(240, 249, 255, ${(isLeadingBand ? 0.65 : 0.42) * layerAlpha})`;
      ctx.lineWidth = (isLeadingBand ? 1.4 : 1.0) * clampedScale;
      ctx.stroke();

      ctx.restore();
    };

    record24HourLoadingSession();

    // 60fps Frame-Delta Normalized Clock (prevents frame skips during mobile image decoding)
    let prevFrameTime = performance.now();
    let virtualElapsed = 0;
    let rafId = 0;

    const renderFrame = (now: number) => {
      const rawDt = now - prevFrameTime;
      prevFrameTime = now;
      // Clamp frame delta between 4ms and 28ms so any main-thread spike never causes a jump
      const dt = Math.min(28, Math.max(4, rawDt));
      virtualElapsed += dt;
      const elapsed = virtualElapsed;

      const scale = Math.min(width, height) / 780;
      const clampedScale = Math.max(0.76, Math.min(scale, 1.32));

      const dropX = width * 0.5;
      const startDropY = height * 0.08;
      const impactY = height * 0.90;
      const baseR = 15.5 * clampedScale;

      // Synchronized audio and haptic feedback for the single droplet
      if (elapsed >= FORM_START_TIME && !playedFormSound) {
        playedFormSound = true;
        audio.playDropletFormation();
      }
      if (elapsed >= FALL_START_TIME && !playedFallSound) {
        playedFallSound = true;
        audio.playDropletFall();
      }
      if (elapsed >= IMPACT_TIME && !playedImpact) {
        playedImpact = true;
        audio.playWaterImpactAndResonance();
        triggerHardwareHaptic([16, 28, 10]);
        triggerVisualImpactFallback();
      }

      if (elapsed >= FADE_START_TIME && !triggeredFadeOut) {
        triggeredFadeOut = true;
        setFadingOut(true);
      }

      if (elapsed >= TOTAL_DURATION) {
        setVisible(false);
        audio.dispose();
        return;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // CRITICAL: Clear canvas to 100% transparency so the live website remains visible
      ctx.clearRect(0, 0, width, height);

      // -----------------------------------------------------------------------
      // 1. SINGLE CLEAN DROPLET FORMATION & SMOOTH GRAVITATIONAL FALL
      // -----------------------------------------------------------------------
      if (elapsed >= FORM_START_TIME && elapsed < IMPACT_TIME) {
        if (refractionBandRef.current) {
          refractionBandRef.current.style.opacity = '0';
        }

        if (elapsed < FALL_START_TIME) {
          const formDuration = FALL_START_TIME - FORM_START_TIME;
          const formT = (elapsed - FORM_START_TIME) / formDuration;
          const easeOutBack =
            1 +
            1.7 * Math.pow(formT - 1, 3) +
            0.75 * Math.pow(formT - 1, 2);
          const scaleFactor = Math.max(0.08, Math.min(1.05, easeOutBack));

          const wobble =
            Math.sin(formT * Math.PI * 3) * 0.05 * (1 - formT * 0.5);
          const rx = baseR * scaleFactor * (1 - wobble);
          const ry = baseR * scaleFactor * (1 + wobble * 1.3);

          const sagY = startDropY + Math.pow(formT, 2.3) * 14 * clampedScale;
          const pinch = Math.pow(formT, 1.8) * 0.62;
          const alpha = Math.min(1, formT * 2.4);

          drawTransparentWaterDroplet(dropX, sagY, rx, ry, pinch, alpha);
        } else {
          const fallDuration = IMPACT_TIME - FALL_START_TIME;
          const fallT = (elapsed - FALL_START_TIME) / fallDuration;
          const fallEase = Math.pow(fallT, 2.12);

          const fallStartY = startDropY + 14 * clampedScale;
          const currentY = fallStartY + (impactY - fallStartY) * fallEase;

          const stretch = 1 + fallT * 0.3;
          const rx = baseR * (1 / Math.sqrt(stretch));
          const ry = baseR * stretch;
          const pinch = 0.62 + fallT * 0.36;

          drawTransparentWaterDroplet(dropX, currentY, rx, ry, pinch, 1);
        }
      }

      // -----------------------------------------------------------------------
      // 2. CLEAN DROPLET LANDING RIPPLE & GOOGLE PIXEL CHARGING WAVE
      // -----------------------------------------------------------------------
      if (elapsed >= IMPACT_TIME) {
        const waveElapsed = elapsed - IMPACT_TIME;

        // A. Subtle bottom-origin light diffusion where the droplet lands
        if (waveElapsed < 1100) {
          const bloomProg = waveElapsed / 1100;
          const bloomAlpha = Math.sin(bloomProg * Math.PI) * 0.22;
          const bottomBloom = ctx.createRadialGradient(
            dropX,
            height,
            12 * clampedScale,
            dropX,
            height,
            Math.max(width * 0.65, 380 * clampedScale)
          );
          bottomBloom.addColorStop(0, `rgba(56, 189, 248, ${bloomAlpha})`);
          bottomBloom.addColorStop(
            0.5,
            `rgba(34, 211, 238, ${bloomAlpha * 0.48})`
          );
          bottomBloom.addColorStop(1, 'rgba(56, 189, 248, 0)');
          ctx.fillStyle = bottomBloom;
          ctx.fillRect(0, height * 0.45, width, height * 0.55);
        }

        // B. Clean concentric impact rings at the droplet landing site
        const ringCount = 3;
        for (let r = 0; r < ringCount; r++) {
          const rDelay = r * 75;
          if (waveElapsed < rDelay) continue;

          const rDuration = 860 + r * 70;
          const rProg = Math.min(1, (waveElapsed - rDelay) / rDuration);
          const rEase = 1 - Math.pow(1 - rProg, 2.35);

          const maxRx = (155 + r * 42) * clampedScale;
          const currentRx = 10 * clampedScale + maxRx * rEase;
          const currentRy = currentRx * 0.25;
          const rAlpha = Math.pow(1 - rProg, 1.65) * (0.58 - r * 0.11);

          if (rAlpha <= 0.008) continue;

          ctx.save();
          ctx.translate(dropX, impactY);

          ctx.strokeStyle = `rgba(56, 189, 248, ${rAlpha * 0.76})`;
          ctx.lineWidth = Math.max(
            1,
            (2.6 - r * 0.35) * (1 - rProg * 0.4) * clampedScale
          );
          ctx.beginPath();
          ctx.ellipse(0, 0, currentRx, currentRy, 0, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = `rgba(240, 249, 255, ${rAlpha * 0.82})`;
          ctx.lineWidth = Math.max(0.8, (1.2 - r * 0.15) * clampedScale);
          ctx.beginPath();
          ctx.ellipse(
            0,
            -1 * clampedScale,
            currentRx * 0.985,
            currentRy * 0.985,
            0,
            Math.PI * 1.1,
            Math.PI * 1.9
          );
          ctx.stroke();

          ctx.restore();
        }

        // C. Clean rebounding pearl droplet right at impact
        if (waveElapsed >= 75 && waveElapsed <= 460) {
          const pearlT = (waveElapsed - 75) / 385;
          const arcY =
            impactY - Math.sin(pearlT * Math.PI) * 42 * clampedScale;
          const pearlRadius =
            (5.6 - Math.abs(pearlT - 0.5) * 1.8) * clampedScale;
          const pearlAlpha =
            pearlT > 0.82 ? (1 - pearlT) / 0.18 : Math.min(1, pearlT * 5);

          drawTransparentWaterDroplet(
            dropX,
            arcY,
            pearlRadius,
            pearlRadius * 1.05,
            0.12,
            pearlAlpha
          );
        }

        // D. Google Pixel-Inspired Layered Luminous Charging Waves Rising from Bottom to Top
        const waveBands = [
          {
            delay: 0,
            duration: WAVE_DURATION,
            amp: 14,
            arch: 54,
            depth: 220,
            freq: 1.25,
            speed: 0.0052,
            phaseOffset: 0,
            alphaScale: 0.92,
            leading: true,
          },
          {
            delay: 110,
            duration: WAVE_DURATION + 60,
            amp: 18,
            arch: 42,
            depth: 250,
            freq: 1.55,
            speed: -0.0046,
            phaseOffset: 1.35,
            alphaScale: 0.74,
            leading: false,
          },
          {
            delay: 230,
            duration: WAVE_DURATION + 120,
            amp: 12,
            arch: 32,
            depth: 270,
            freq: 1.15,
            speed: 0.004,
            phaseOffset: 2.7,
            alphaScale: 0.56,
            leading: false,
          },
          {
            delay: 350,
            duration: WAVE_DURATION + 160,
            amp: 10,
            arch: 22,
            depth: 290,
            freq: 1.4,
            speed: -0.0036,
            phaseOffset: 4.1,
            alphaScale: 0.4,
            leading: false,
          },
        ];

        for (let b = 0; b < waveBands.length; b++) {
          const band = waveBands[b];
          if (waveElapsed < band.delay) continue;

          const bProg = Math.min(
            1,
            (waveElapsed - band.delay) / band.duration
          );
          const riseEase = 1 - Math.pow(1 - bProg, 2.05);

          const startWaveY = height + 24 * clampedScale;
          const endWaveY = -height * 0.12;
          const currentBaseY =
            startWaveY - (startWaveY - endWaveY) * riseEase;

          const emergenceFade = Math.min(1, bProg * 6.5);
          const topDiffusionFade = Math.pow(1 - bProg, 1.32);
          const layerAlpha =
            emergenceFade * topDiffusionFade * band.alphaScale;

          // Sync the Refractive Glass Distortion Band to the leading rising wave crest
          if (b === 0 && refractionBandRef.current) {
            const bandCenterY =
              currentBaseY -
              band.arch * (1 - bProg * 0.45) * clampedScale * 0.5;
            refractionBandRef.current.style.transform = `translate3d(0, ${(
              bandCenterY - 64
            ).toFixed(1)}px, 0)`;
            refractionBandRef.current.style.opacity = String(
              Math.min(0.85, layerAlpha).toFixed(3)
            );
          }

          const phase = elapsed * band.speed + band.phaseOffset;

          drawPixelFluidWaveLayer(
            currentBaseY,
            band.amp * clampedScale,
            band.arch * (1 - bProg * 0.45) * clampedScale,
            band.depth * (0.8 + bProg * 0.45) * clampedScale,
            phase,
            band.freq,
            layerAlpha,
            band.leading,
            clampedScale
          );
        }
      }

      ctx.restore();
      rafId = window.requestAnimationFrame(renderFrame);
    };

    rafId = window.requestAnimationFrame(renderFrame);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', unlockInteraction);
      window.removeEventListener('touchstart', unlockInteraction);
      window.removeEventListener('keydown', unlockInteraction);
      audio.dispose();
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[90] bg-transparent pointer-events-none select-none overflow-hidden transition-opacity duration-400 ease-out ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Subtle Refractive Glass Distortion Band synced with the rising Pixel Wave Crest */}
      <div
        ref={refractionBandRef}
        className="fixed left-0 right-0 top-0 h-36 pointer-events-none opacity-0 will-change-transform pixel-wave-refraction"
      />
      <canvas
        ref={canvasRef}
        className="relative z-10 block w-full h-full bg-transparent pointer-events-none"
      />
    </div>
  );
}
