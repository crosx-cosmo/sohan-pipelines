'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

const INTRO_STORAGE_KEY = 'sohan_pipelines_water_intro_session_v3';
const LEGACY_KEYS = [
  'sohan_pipelines_water_intro_seen_v1',
  'sohan_pipelines_water_intro_session_v2',
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

interface DropletSpec {
  id: number;
  xRatio: number;
  startYRatio: number;
  impactYRatio: number;
  baseRadius: number;
  formStart: number;
  fallStart: number;
  impactTime: number;
  isPrimary: boolean;
  playedFormSound: boolean;
  playedFallSound: boolean;
  playedImpact: boolean;
}

interface SplashParticle {
  x: number;
  y: number;
  impactY: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  spawnTime: number;
  reentered: boolean;
}

interface MiniRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

interface CausticMote {
  angleOffset: number;
  radiusOffset: number;
  size: number;
  phase: number;
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
 * Provides a subtle, controlled 135ms visual impact micro-refraction pulse on the live
 * webpage at the exact moment a droplet impacts, ensuring tactile visual feedback
 * even when hardware vibration is unavailable.
 */
function triggerVisualImpactFallback(intensity: number): void {
  if (typeof document === 'undefined') return;
  const mainEl = document.querySelector('main');
  if (!mainEl || typeof mainEl.animate !== 'function') return;
  try {
    const shiftPx = (1.6 * intensity).toFixed(2);
    mainEl.animate(
      [
        { transform: 'translate3d(0, 0, 0)' },
        { transform: `translate3d(0, ${shiftPx}px, 0)` },
        { transform: `translate3d(0, -${(0.6 * intensity).toFixed(2)}px, 0)` },
        { transform: 'translate3d(0, 0, 0)' },
      ],
      {
        duration: 145,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }
    );
  } catch {
    // Ignore if Web Animations API is unavailable
  }
}

/**
 * Original Procedural Web Audio Synthesizer for Water Physics & Pixel-Inspired Resonance.
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
  public playDropletFormation(pitchMultiplier = 1) {
    if (!this.canPlay() || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(510 * pitchMultiplier, now);
      osc.frequency.exponentialRampToValueAtTime(
        760 * pitchMultiplier,
        now + 0.24
      );

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
  public playDropletFall(pitchMultiplier = 1) {
    if (!this.canPlay() || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600 * pitchMultiplier, now);
      osc.frequency.exponentialRampToValueAtTime(
        285 * pitchMultiplier,
        now + 0.32
      );

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
  public playWaterImpactAndResonance(isPrimary = true, pitchMultiplier = 1) {
    if (!this.canPlay() || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const volScale = isPrimary ? 1 : 0.62;

      // 1. Primary Minnaert Bubble Cavity Plip (upward exponential pitch sweep)
      const dropOsc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();
      dropOsc.type = 'sine';
      dropOsc.frequency.setValueAtTime(320 * pitchMultiplier, now);
      dropOsc.frequency.exponentialRampToValueAtTime(
        1180 * pitchMultiplier,
        now + 0.072
      );

      dropGain.gain.setValueAtTime(0.0001, now);
      dropGain.gain.linearRampToValueAtTime(0.09 * volScale, now + 0.008);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.095);

      dropOsc.connect(dropGain);
      dropGain.connect(this.ctx.destination);
      dropOsc.start(now);
      dropOsc.stop(now + 0.1);

      if (!isPrimary) return;

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

      // 3. Delicate Water Crown Splash Micro-Transient (bandpass filtered noise)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.14);
      const noiseBuffer = this.ctx.createBuffer(
        1,
        bufferSize,
        this.ctx.sampleRate
      );
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] =
          (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(2800, now);
      bandpass.Q.setValueAtTime(2.4, now);

      const splashGain = this.ctx.createGain();
      splashGain.gain.setValueAtTime(0.028, now);
      splashGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);

      whiteNoise.connect(bandpass);
      bandpass.connect(splashGain);
      splashGain.connect(this.ctx.destination);
      whiteNoise.start(now);

      // 4. Subtle Low-Frequency Tactile Resonance (synchronized with bottom-up wave)
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(104, now);
      subOsc.frequency.exponentialRampToValueAtTime(54, now + 0.48);

      subGain.gain.setValueAtTime(0.0001, now);
      subGain.gain.linearRampToValueAtTime(0.07, now + 0.025);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.52);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.55);

      // 5. Delicate Luminous Bottom-Up Wave Shimmer
      const shimmerFreqs = [528, 792, 1056];
      shimmerFreqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const shimOsc = this.ctx.createOscillator();
        const shimGain = this.ctx.createGain();
        shimOsc.type = 'sine';
        shimOsc.frequency.setValueAtTime(freq, now + 0.03 + idx * 0.04);
        shimOsc.frequency.exponentialRampToValueAtTime(
          freq * 1.025,
          now + 0.95
        );

        const peak = idx === 0 ? 0.02 : idx === 1 ? 0.012 : 0.008;
        shimGain.gain.setValueAtTime(0.0001, now + 0.03 + idx * 0.04);
        shimGain.gain.linearRampToValueAtTime(peak, now + 0.16);
        shimGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.98);

        shimOsc.connect(shimGain);
        shimGain.connect(this.ctx.destination);
        shimOsc.start(now + 0.03 + idx * 0.04);
        shimOsc.stop(now + 1.0);
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
      // Fallback in case 'load' takes longer on slow image assets — website DOM is already visible
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
    // Cap DPR at 1.75 for buttery 60fps performance on low-end Android devices
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

    // Staggered Multi-Droplet Choreography (falls from top over live website to bottom impact zone)
    const droplets: DropletSpec[] = [
      {
        id: 1,
        xRatio: 0.5,
        startYRatio: 0.08,
        impactYRatio: 0.91,
        baseRadius: 15.5,
        formStart: 60,
        fallStart: 420,
        impactTime: 980,
        isPrimary: true,
        playedFormSound: false,
        playedFallSound: false,
        playedImpact: false,
      },
      {
        id: 2,
        xRatio: 0.3,
        startYRatio: 0.06,
        impactYRatio: 0.93,
        baseRadius: 11.5,
        formStart: 230,
        fallStart: 560,
        impactTime: 1140,
        isPrimary: false,
        playedFormSound: false,
        playedFallSound: false,
        playedImpact: false,
      },
      {
        id: 3,
        xRatio: 0.7,
        startYRatio: 0.07,
        impactYRatio: 0.925,
        baseRadius: 12.5,
        formStart: 370,
        fallStart: 690,
        impactTime: 1280,
        isPrimary: false,
        playedFormSound: false,
        playedFallSound: false,
        playedImpact: false,
      },
    ];

    const PRIMARY_IMPACT_TIME = droplets[0].impactTime;
    const FADE_START_TIME = 2580;
    const TOTAL_DURATION = 2980;

    let triggeredFadeOut = false;

    const particles: SplashParticle[] = [];
    const miniRipples: MiniRipple[] = [];

    // Pre-seeded luminous caustic motes that ride along the Pixel bottom-up wave
    const causticMotes: CausticMote[] = Array.from({ length: 22 }, (_, i) => ({
      angleOffset: -Math.PI * 0.88 + (Math.PI * 0.76 * i) / 21,
      radiusOffset: (i % 3 - 1) * 14,
      size: 1.5 + (i % 3) * 0.9,
      phase: i * 0.7,
    }));

    const spawnImpactParticles = (
      cx: number,
      cy: number,
      scale: number,
      nowElapsed: number,
      count: number
    ) => {
      for (let i = 0; i < count; i++) {
        const angle =
          -Math.PI * 0.15 -
          (Math.PI * 0.7 * i) / Math.max(1, count - 1) +
          (Math.random() - 0.5) * 0.08;
        const speed = (2.8 + Math.random() * 3.1) * scale;
        particles.push({
          x: cx + Math.cos(angle) * 8 * scale,
          y: cy - 2 * scale,
          impactY: cy,
          vx: Math.cos(angle) * speed * (0.75 + Math.random() * 0.45),
          vy: Math.sin(angle) * speed * (0.85 + Math.random() * 0.35),
          radius: (1.5 + Math.random() * 2.1) * scale,
          alpha: 0.9,
          spawnTime: nowElapsed + Math.random() * 25,
          reentered: false,
        });
      }
    };

    /**
     * Renders a transparent, refractive 3D water droplet that blends with the
     * underlying live website while preserving realistic aqua rim highlights,
     * internal caustic glow, and curved white specular reflections.
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

      // 1. Soft Cyan/Aqua Refractive Halo so droplet stands out on both light & dark website sections
      const haloGrad = ctx.createRadialGradient(
        0,
        ry * 0.25,
        rx * 0.1,
        0,
        ry * 0.35,
        rx * 1.6
      );
      haloGrad.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
      haloGrad.addColorStop(0.55, 'rgba(34, 211, 238, 0.10)');
      haloGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.ellipse(0, ry * 0.3, rx * 1.5, ry * 1.25, 0, 0, Math.PI * 2);
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

      // 3. Ultra-Transparent Liquid Glass Body (website remains clearly visible through the droplet)
      const bodyGrad = ctx.createLinearGradient(
        -rx * 0.5,
        topTipY,
        rx * 0.6,
        ry
      );
      bodyGrad.addColorStop(0, 'rgba(255, 255, 255, 0.14)');
      bodyGrad.addColorStop(0.32, 'rgba(224, 242, 254, 0.22)');
      bodyGrad.addColorStop(0.7, 'rgba(125, 211, 252, 0.32)');
      bodyGrad.addColorStop(1, 'rgba(34, 211, 238, 0.42)');
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
      causticGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      causticGrad.addColorStop(0.38, 'rgba(186, 230, 253, 0.45)');
      causticGrad.addColorStop(0.75, 'rgba(56, 189, 248, 0.16)');
      causticGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.fillStyle = causticGrad;
      ctx.fillRect(-rx * 1.2, topTipY, rx * 2.4, ry * 2.4);
      ctx.restore();

      // 5. Crisp Luminous Aqua/Cyan Fresnel Rim Edge
      ctx.lineWidth = Math.max(1.1, rx * 0.085);
      const rimGrad = ctx.createLinearGradient(0, topTipY, 0, ry);
      rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
      rimGrad.addColorStop(0.45, 'rgba(56, 189, 248, 0.72)');
      rimGrad.addColorStop(1, 'rgba(34, 211, 238, 0.92)');
      ctx.strokeStyle = rimGrad;
      ctx.stroke();

      // 6. Primary Curved Specular Window Highlight (Upper-Left)
      ctx.save();
      ctx.translate(-rx * 0.34, -ry * 0.08);
      ctx.rotate(-0.32);
      const specGrad = ctx.createLinearGradient(0, -ry * 0.36, 0, ry * 0.36);
      specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      specGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.75)');
      specGrad.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
      ctx.fillStyle = specGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx * 0.15, ry * 0.34, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 7. Secondary Pinpoint Specular Glint
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
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
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.88)';
      ctx.lineWidth = Math.max(1, rx * 0.075);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, ry * 0.26, rx * 0.64, Math.PI * 0.18, Math.PI * 0.82);
      ctx.stroke();

      ctx.restore();
    };

    record24HourLoadingSession();

    const startTime = performance.now();
    let rafId = 0;

    const renderFrame = (now: number) => {
      const elapsed = now - startTime;
      const scale = Math.min(width, height) / 780;
      const clampedScale = Math.max(0.76, Math.min(scale, 1.32));

      // Process droplet audio & synchronized haptic/visual impact cues
      for (let i = 0; i < droplets.length; i++) {
        const d = droplets[i];
        const pitch = d.isPrimary ? 1 : d.id === 2 ? 1.18 : 1.09;

        if (elapsed >= d.formStart && !d.playedFormSound) {
          d.playedFormSound = true;
          audio.playDropletFormation(pitch);
        }
        if (elapsed >= d.fallStart && !d.playedFallSound) {
          d.playedFallSound = true;
          audio.playDropletFall(pitch);
        }
        if (elapsed >= d.impactTime && !d.playedImpact) {
          d.playedImpact = true;
          audio.playWaterImpactAndResonance(d.isPrimary, pitch);

          const dropX = width * d.xRatio;
          const dropImpactY = height * d.impactYRatio;
          spawnImpactParticles(
            dropX,
            dropImpactY,
            clampedScale * (d.isPrimary ? 1 : 0.78),
            elapsed,
            d.isPrimary ? 14 : 8
          );

          // Synchronized hardware vibration + automatic visual impact fallback
          if (d.isPrimary) {
            triggerHardwareHaptic([16, 28, 10]);
            triggerVisualImpactFallback(1);
          } else {
            triggerHardwareHaptic(10);
            triggerVisualImpactFallback(0.55);
          }
        }
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

      // CRITICAL: Clear canvas to 100% transparency so live website is always visible underneath
      ctx.clearRect(0, 0, width, height);

      // -----------------------------------------------------------------------
      // 1. GOOGLE PIXEL-INSPIRED BOTTOM-UP EXPANDING WAVE & RIPPLE EFFECT
      // -----------------------------------------------------------------------
      if (elapsed >= PRIMARY_IMPACT_TIME) {
        const waveElapsed = elapsed - PRIMARY_IMPACT_TIME;
        // Wave originates at the bottom center of the screen and sweeps Smoothly UPWARD to the top
        const waveOriginX = width * 0.5;
        const waveOriginY = height * 1.03;
        const maxBottomToTopRadius = Math.hypot(width * 0.65, height * 1.12);

        // Subtle bottom-edge luminous impact horizon glow right as droplets strike
        if (waveElapsed < 900) {
          const glowProg = waveElapsed / 900;
          const glowAlpha = Math.sin(glowProg * Math.PI) * 0.28;
          const bottomGlow = ctx.createRadialGradient(
            waveOriginX,
            height,
            10 * clampedScale,
            waveOriginX,
            height,
            Math.max(width * 0.7, 360 * clampedScale)
          );
          bottomGlow.addColorStop(0, `rgba(34, 211, 238, ${glowAlpha})`);
          bottomGlow.addColorStop(0.5, `rgba(56, 189, 248, ${glowAlpha * 0.55})`);
          bottomGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
          ctx.fillStyle = bottomGlow;
          ctx.fillRect(0, height * 0.55, width, height * 0.45);
        }

        // 5 Concentric Luminous Bottom-to-Top Wavefronts (Google Pixel Charging Wave style)
        const bottomUpWaveCount = 5;
        for (let w = 0; w < bottomUpWaveCount; w++) {
          const wDelay = w * 135;
          if (waveElapsed < wDelay) continue;

          const wDuration = 1480 + w * 90;
          const wProg = Math.min(1, (waveElapsed - wDelay) / wDuration);
          // Smooth fluid deceleration as wave sweeps from bottom to top of viewport
          const wEase = 1 - Math.pow(1 - wProg, 2.15);

          const currentRadius =
            24 * clampedScale + maxBottomToTopRadius * wEase;
          const fadeEnvelope =
            Math.min(1, wProg * 6) * Math.pow(1 - wProg, 1.35);
          const waveAlpha = fadeEnvelope * (w === 0 ? 0.85 : 0.68 - w * 0.1);

          if (waveAlpha <= 0.008) continue;

          // Translucent luminous trailing wave band
          const bandThickness =
            (w === 0 ? 95 : 58 - w * 6) * (0.7 + wProg * 0.5) * clampedScale;
          const innerR = Math.max(1, currentRadius - bandThickness);
          const outerR = currentRadius + 10 * clampedScale;

          const bandGrad = ctx.createRadialGradient(
            waveOriginX,
            waveOriginY,
            innerR,
            waveOriginX,
            waveOriginY,
            outerR
          );
          bandGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
          bandGrad.addColorStop(
            0.55,
            `rgba(186, 230, 253, ${0.12 * waveAlpha})`
          );
          bandGrad.addColorStop(
            0.84,
            `rgba(56, 189, 248, ${0.24 * waveAlpha})`
          );
          bandGrad.addColorStop(
            0.95,
            `rgba(34, 211, 238, ${0.34 * waveAlpha})`
          );
          bandGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = bandGrad;
          ctx.beginPath();
          ctx.arc(waveOriginX, waveOriginY, outerR, Math.PI, Math.PI * 2);
          ctx.fill();

          // Crisp luminous cyan/aqua outer wavefront ring
          ctx.strokeStyle = `rgba(34, 211, 238, ${0.58 * waveAlpha})`;
          ctx.lineWidth = Math.max(1.2, (2.8 - w * 0.38) * clampedScale);
          ctx.beginPath();
          ctx.arc(
            waveOriginX,
            waveOriginY,
            currentRadius,
            Math.PI,
            Math.PI * 2
          );
          ctx.stroke();

          // Fine specular white crest highlight along the leading edge of the upward wave
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.72 * waveAlpha})`;
          ctx.lineWidth = Math.max(0.9, (1.5 - w * 0.2) * clampedScale);
          ctx.beginPath();
          ctx.arc(
            waveOriginX,
            waveOriginY,
            currentRadius - 1.5 * clampedScale,
            Math.PI * 1.08,
            Math.PI * 1.92
          );
          ctx.stroke();

          // Pixel-inspired luminous micro-caustic sparkles riding the primary upward wave crest
          if (w === 0) {
            for (let m = 0; m < causticMotes.length; m++) {
              const mote = causticMotes[m];
              const mRadius =
                currentRadius +
                mote.radiusOffset * clampedScale -
                18 * clampedScale;
              if (mRadius <= 10) continue;
              const mx = waveOriginX + Math.sin(mote.angleOffset) * mRadius;
              const my = waveOriginY - Math.cos(mote.angleOffset) * mRadius;
              if (my < -20 || my > height + 10) continue;

              const twinkle =
                0.45 + 0.55 * Math.sin(elapsed * 0.012 + mote.phase);
              const moteAlpha = waveAlpha * twinkle * 0.78;

              ctx.fillStyle = `rgba(224, 242, 254, ${moteAlpha})`;
              ctx.beginPath();
              ctx.arc(
                mx,
                my,
                mote.size * clampedScale,
                0,
                Math.PI * 2
              );
              ctx.fill();
            }
          }
        }
      }

      // -----------------------------------------------------------------------
      // 2. LOCAL BOTTOM SURFACE IMPACT RIPPLES, CROWN SPLASH & REBOUND PEARLS
      // -----------------------------------------------------------------------
      for (let dIdx = 0; dIdx < droplets.length; dIdx++) {
        const d = droplets[dIdx];
        if (elapsed < d.impactTime) continue;

        const impactElapsed = elapsed - d.impactTime;
        const dropX = width * d.xRatio;
        const dropImpactY = height * d.impactYRatio;
        const dScale = clampedScale * (d.isPrimary ? 1 : 0.76);

        // Concentric perspective water ripples at each droplet's bottom impact site
        const ringCount = d.isPrimary ? 5 : 3;
        for (let r = 0; r < ringCount; r++) {
          const rDelay = r * 70;
          if (impactElapsed < rDelay) continue;

          const rDuration = 920 + r * 65;
          const rProg = Math.min(1, (impactElapsed - rDelay) / rDuration);
          const rEase = 1 - Math.pow(1 - rProg, 2.4);

          const maxRx = (175 + r * 44) * dScale;
          const currentRx = 10 * dScale + maxRx * rEase;
          const currentRy = currentRx * 0.28;
          const rAlpha = Math.pow(1 - rProg, 1.6) * (0.68 - r * 0.09);

          if (rAlpha <= 0.008) continue;

          ctx.save();
          ctx.translate(dropX, dropImpactY);

          // Luminous aqua ripple ring
          ctx.strokeStyle = `rgba(34, 211, 238, ${rAlpha * 0.78})`;
          ctx.lineWidth = Math.max(
            1,
            (3.2 - r * 0.4) * (1 - rProg * 0.45) * dScale
          );
          ctx.beginPath();
          ctx.ellipse(0, 0, currentRx, currentRy, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Crisp white specular crest arc
          ctx.strokeStyle = `rgba(255, 255, 255, ${rAlpha * 0.9})`;
          ctx.lineWidth = Math.max(0.8, (1.5 - r * 0.2) * dScale);
          ctx.beginPath();
          ctx.ellipse(
            0,
            -1 * dScale,
            currentRx * 0.985,
            currentRy * 0.985,
            0,
            Math.PI * 1.08,
            Math.PI * 1.92
          );
          ctx.stroke();

          ctx.restore();
        }

        // Worthington Rising Liquid Jet & Rebounding Pearl at Impact Point
        if (impactElapsed < 400) {
          const jetProg = impactElapsed / 400;
          const jetCurve = Math.sin(jetProg * Math.PI);
          const jetHeight = 40 * dScale * jetCurve;
          const jetWidth = (11 - jetProg * 5) * dScale;
          const jetAlpha = (1 - jetProg * 0.75) * 0.78;

          if (jetHeight > 2) {
            ctx.save();
            ctx.translate(dropX, dropImpactY);
            ctx.beginPath();
            ctx.moveTo(-jetWidth * 1.3, 2 * dScale);
            ctx.quadraticCurveTo(
              -jetWidth * 0.45,
              -jetHeight * 0.45,
              -jetWidth * 0.28,
              -jetHeight
            );
            ctx.arc(0, -jetHeight, jetWidth * 0.28, Math.PI, 0, false);
            ctx.quadraticCurveTo(
              jetWidth * 0.45,
              -jetHeight * 0.45,
              jetWidth * 1.3,
              2 * dScale
            );
            ctx.closePath();

            const colGrad = ctx.createLinearGradient(0, -jetHeight, 0, 4);
            colGrad.addColorStop(0, `rgba(224, 242, 254, ${jetAlpha})`);
            colGrad.addColorStop(0.5, `rgba(56, 189, 248, ${jetAlpha * 0.75})`);
            colGrad.addColorStop(1, 'rgba(56, 189, 248, 0.05)');
            ctx.fillStyle = colGrad;
            ctx.fill();
            ctx.restore();
          }
        }

        // Rebounding Pearl Droplet
        if (impactElapsed >= 90 && impactElapsed <= 520) {
          const pearlT = (impactElapsed - 90) / 430;
          const arcY =
            dropImpactY - Math.sin(pearlT * Math.PI) * 50 * dScale;
          const pearlRadius =
            (6.2 - Math.abs(pearlT - 0.5) * 2.0) * dScale;
          const pearlAlpha =
            pearlT > 0.85 ? (1 - pearlT) / 0.15 : Math.min(1, pearlT * 5);

          drawTransparentWaterDroplet(
            dropX,
            arcY,
            pearlRadius,
            pearlRadius * 1.05,
            0.12,
            pearlAlpha
          );
        }
      }

      // Fine Translucent Splash Particles & Micro Re-Entry Ripples
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (elapsed < p.spawnTime) continue;

        const pElapsed = (elapsed - p.spawnTime) / 16.67;
        const gravity = 0.24 * clampedScale;
        const px = p.x + p.vx * pElapsed;
        const py =
          p.y + p.vy * pElapsed + 0.5 * gravity * pElapsed * pElapsed;

        if (py >= p.impactY + 3 * clampedScale) {
          if (!p.reentered) {
            p.reentered = true;
            miniRipples.push({
              x: px,
              y: p.impactY,
              radius: 2 * clampedScale,
              maxRadius: (15 + Math.random() * 12) * clampedScale,
              alpha: 0.52,
            });
          }
          continue;
        }

        const fade = Math.max(0, 1 - pElapsed / 28);
        if (fade <= 0.02) continue;

        ctx.save();
        ctx.translate(px, py);
        const pGrad = ctx.createRadialGradient(
          -p.radius * 0.25,
          -p.radius * 0.25,
          p.radius * 0.1,
          0,
          0,
          p.radius
        );
        pGrad.addColorStop(0, `rgba(255, 255, 255, ${0.92 * fade})`);
        pGrad.addColorStop(0.55, `rgba(186, 230, 253, ${0.72 * fade})`);
        pGrad.addColorStop(1, `rgba(34, 211, 238, ${0.58 * fade})`);
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      for (let m = miniRipples.length - 1; m >= 0; m--) {
        const mr = miniRipples[m];
        mr.radius += 0.65 * clampedScale;
        mr.alpha *= 0.92;
        if (mr.alpha <= 0.02 || mr.radius >= mr.maxRadius) {
          miniRipples.splice(m, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(34, 211, 238, ${mr.alpha})`;
        ctx.lineWidth = 1 * clampedScale;
        ctx.beginPath();
        ctx.ellipse(
          mr.x,
          mr.y,
          mr.radius,
          mr.radius * 0.28,
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      // -----------------------------------------------------------------------
      // 3. STAGGERED MULTI-DROPLET FORMATION & SMOOTH GRAVITATIONAL FALL
      // -----------------------------------------------------------------------
      for (let dIdx = 0; dIdx < droplets.length; dIdx++) {
        const d = droplets[dIdx];
        if (elapsed < d.formStart || elapsed >= d.impactTime) continue;

        const dropX = width * d.xRatio;
        const startDropY = height * d.startYRatio;
        const impactY = height * d.impactYRatio;
        const baseR = d.baseRadius * clampedScale;

        if (elapsed < d.fallStart) {
          // Droplet Condensation & Surface-Tension Swell near Top of Screen
          const formDuration = d.fallStart - d.formStart;
          const formT = (elapsed - d.formStart) / formDuration;
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
          // Smooth Gravitational Acceleration Downward Over Live Website
          const fallDuration = d.impactTime - d.fallStart;
          const fallT = (elapsed - d.fallStart) / fallDuration;
          const fallEase = Math.pow(fallT, 2.12);

          const fallStartY = startDropY + 14 * clampedScale;
          const currentY = fallStartY + (impactY - fallStartY) * fallEase;

          const stretch = 1 + fallT * 0.3;
          const rx = baseR * (1 / Math.sqrt(stretch));
          const ry = baseR * stretch;
          const pinch = 0.62 + fallT * 0.36;

          // Subtle trailing micro-droplet pinched off behind falling droplet
          if (fallT < 0.78) {
            const trailProg = fallT / 0.78;
            const trailY =
              fallStartY +
              (currentY - fallStartY) * Math.pow(trailProg, 1.55) -
              ry * 1.6;
            const trailR = baseR * 0.25 * (1 - trailProg * 0.6);
            drawTransparentWaterDroplet(
              dropX,
              trailY,
              trailR,
              trailR * 1.15,
              0.2,
              (1 - trailProg) * 0.78
            );
          }

          drawTransparentWaterDroplet(dropX, currentY, rx, ry, pinch, 1);
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
      <canvas
        ref={canvasRef}
        className="block w-full h-full bg-transparent pointer-events-none"
      />
    </div>
  );
}
