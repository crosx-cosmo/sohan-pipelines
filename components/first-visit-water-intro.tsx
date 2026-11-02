'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

const INTRO_STORAGE_KEY = 'sohan_pipelines_water_intro_session_v2';
const LEGACY_INTRO_STORAGE_KEY = 'sohan_pipelines_water_intro_seen_v1';
const CART_STORAGE_KEY = 'sohan_pipelines_cart_v1';
const LOADING_SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours default loading session

// Module-level guard so even if localStorage is blocked (e.g. strict private mode),
// the intro never replays during internal SPA route navigation.
let hasPlayedInCurrentSession = false;

function isWithin24HourLoadingSession(): boolean {
  try {
    window.localStorage.removeItem(LEGACY_INTRO_STORAGE_KEY);
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

interface SplashParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  delay: number;
  reentered: boolean;
}

interface MiniRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
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

  /** Stage 2: Soft, crystalline water droplet condensation sound */
  public playDropletFormation() {
    if (!this.canPlay() || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.28);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.024, now + 0.09);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.32);
    } catch {
      // Silent fallback
    }
  }

  /** Stage 3: Subtle laminar falling-water movement */
  public playDropletFall() {
    if (!this.canPlay() || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(610, now);
      osc.frequency.exponentialRampToValueAtTime(290, now + 0.34);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.018, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Silent fallback
    }
  }

  /**
   * Stage 4 & 5: Authentic Minnaert bubble-cavity water impact +
   * subtle low-frequency resonance + delicate aquatic ripple shimmer fade-out.
   */
  public playWaterImpactAndResonance() {
    if (!this.canPlay() || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      // 1. Primary Minnaert Bubble Cavity Plip (upward exponential pitch sweep)
      const dropOsc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();
      dropOsc.type = 'sine';
      dropOsc.frequency.setValueAtTime(310, now);
      dropOsc.frequency.exponentialRampToValueAtTime(1140, now + 0.072);

      dropGain.gain.setValueAtTime(0.0001, now);
      dropGain.gain.linearRampToValueAtTime(0.095, now + 0.008);
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
      pearlGain.gain.linearRampToValueAtTime(0.045, now + 0.143);
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
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(2800, now);
      bandpass.Q.setValueAtTime(2.4, now);

      const splashGain = this.ctx.createGain();
      splashGain.gain.setValueAtTime(0.032, now);
      splashGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);

      whiteNoise.connect(bandpass);
      bandpass.connect(splashGain);
      splashGain.connect(this.ctx.destination);
      whiteNoise.start(now);

      // 4. Subtle Low-Frequency Tactile Resonance (synchronized with screen ripple)
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(104, now);
      subOsc.frequency.exponentialRampToValueAtTime(54, now + 0.48);

      subGain.gain.setValueAtTime(0.0001, now);
      subGain.gain.linearRampToValueAtTime(0.075, now + 0.025);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.52);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.55);

      // 5. Delicate Luminous Ripple Shimmer Fade-Out
      const shimmerFreqs = [528, 792];
      shimmerFreqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const shimOsc = this.ctx.createOscillator();
        const shimGain = this.ctx.createGain();
        shimOsc.type = 'sine';
        shimOsc.frequency.setValueAtTime(freq, now + 0.03);
        shimOsc.frequency.exponentialRampToValueAtTime(
          freq * 1.015,
          now + 0.78
        );

        const peak = idx === 0 ? 0.022 : 0.012;
        shimGain.gain.setValueAtTime(0.0001, now + 0.03);
        shimGain.gain.linearRampToValueAtTime(peak, now + 0.14);
        shimGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.82);

        shimOsc.connect(shimGain);
        shimGain.connect(this.ctx.destination);
        shimOsc.start(now + 0.03);
        shimOsc.stop(now + 0.85);
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

    // 1. Do not replay on internal route navigation or non-home entry if already seen
    if (hasPlayedInCurrentSession) return;

    // 2. Respect prefers-reduced-motion
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      hasPlayedInCurrentSession = true;
      record24HourLoadingSession();
      return;
    }

    // 3. Do not interrupt an active booking or shopping-cart session
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
    const frameId = window.requestAnimationFrame(() => {
      setVisible(true);
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [pathname]);

  React.useEffect(() => {
    if (!visible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const audio = new WaterAcousticEngine();
    const unlockAudio = () => audio.unlock();
    window.addEventListener('pointerdown', unlockAudio, {
      once: true,
      passive: true,
    });
    window.addEventListener('touchstart', unlockAudio, {
      once: true,
      passive: true,
    });

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Animation Timeline Constants (in milliseconds)
    // Stage 1: 0 - 380ms (Calm water surface appears in lower-middle area)
    // Stage 2: 280 - 880ms (Realistic transparent water droplet forms near upper portion)
    // Stage 3: 880 - 1280ms (Smooth physical gravitational fall)
    // Stage 4: 1280 - 2050ms (Water splash crown, rebound pearl, circular ripples)
    // Stage 5: 1285 - 2250ms (Brief controlled Pixel-inspired vibration + full-screen luminous aqua wave)
    // Stage 6: 2100 - 2550ms (Ripples naturally fade, smooth reveal of homepage)
    const IMPACT_TIME = 1280;
    const FADE_START_TIME = 2120;
    const TOTAL_DURATION = 2560;

    let playedFormationAudio = false;
    let playedFallAudio = false;
    let playedImpactAudio = false;
    let triggeredFadeOut = false;

    const particles: SplashParticle[] = [];
    const miniRipples: MiniRipple[] = [];

    const spawnImpactParticles = (cx: number, cy: number, scale: number) => {
      const count = 16;
      for (let i = 0; i < count; i++) {
        const angle =
          -Math.PI * 0.15 -
          (Math.PI * 0.7 * i) / (count - 1) +
          (Math.random() - 0.5) * 0.08;
        const speed = (3.1 + Math.random() * 3.4) * scale;
        particles.push({
          x: cx + Math.cos(angle) * 10 * scale,
          y: cy - 2 * scale,
          vx: Math.cos(angle) * speed * (0.75 + Math.random() * 0.45),
          vy: Math.sin(angle) * speed * (0.85 + Math.random() * 0.35),
          radius: (1.6 + Math.random() * 2.3) * scale,
          alpha: 0.92,
          delay: Math.random() * 35,
          reentered: false,
        });
      }
    };

    /**
     * Renders a photorealistic transparent 3D water droplet with internal caustic
     * refraction, Fresnel rim lighting, and dual curved specular highlights.
     */
    const drawRealisticWaterDroplet = (
      x: number,
      y: number,
      rx: number,
      ry: number,
      pinchFactor: number, // 0 = sphere, 1 = classic teardrop
      alpha: number
    ) => {
      if (alpha <= 0.01 || rx <= 0.5 || ry <= 0.5) return;

      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;

      // 1. Subtle Refractive Contact Shadow / Caustic Projection behind droplet
      const shadowGrad = ctx.createRadialGradient(
        0,
        ry * 0.35,
        rx * 0.1,
        0,
        ry * 0.55,
        rx * 1.45
      );
      shadowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.18)');
      shadowGrad.addColorStop(0.55, 'rgba(186, 230, 253, 0.09)');
      shadowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(0, ry * 0.45, rx * 1.35, ry * 1.1, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Define Physical Teardrop / Pendant Contour Path
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

      // 3. Base Transparent Liquid Body Gradient (Crystal clear water on white)
      const bodyGrad = ctx.createLinearGradient(
        -rx * 0.5,
        topTipY,
        rx * 0.6,
        ry
      );
      bodyGrad.addColorStop(0, 'rgba(203, 213, 225, 0.38)');
      bodyGrad.addColorStop(0.28, 'rgba(224, 242, 254, 0.52)');
      bodyGrad.addColorStop(0.68, 'rgba(186, 230, 253, 0.65)');
      bodyGrad.addColorStop(0.9, 'rgba(125, 211, 252, 0.72)');
      bodyGrad.addColorStop(1, 'rgba(56, 189, 248, 0.58)');
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // 4. Internal Caustic Focal Lens Glow (bottom-right internal refraction)
      ctx.save();
      ctx.clip();

      const causticGrad = ctx.createRadialGradient(
        rx * 0.18,
        ry * 0.48,
        rx * 0.05,
        rx * 0.1,
        ry * 0.38,
        rx * 0.85
      );
      causticGrad.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
      causticGrad.addColorStop(0.35, 'rgba(224, 242, 254, 0.75)');
      causticGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.22)');
      causticGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.fillStyle = causticGrad;
      ctx.fillRect(-rx * 1.2, topTipY, rx * 2.4, ry * 2.4);

      // Subtle upper-left refractive edge darkening for realistic 3D liquid volume
      const depthGrad = ctx.createRadialGradient(
        -rx * 0.25,
        -ry * 0.15,
        rx * 0.1,
        0,
        0,
        rx * 1.1
      );
      depthGrad.addColorStop(0, 'rgba(148, 163, 184, 0.22)');
      depthGrad.addColorStop(0.6, 'rgba(148, 163, 184, 0.04)');
      depthGrad.addColorStop(1, 'rgba(14, 165, 233, 0.28)');
      ctx.fillStyle = depthGrad;
      ctx.fillRect(-rx * 1.2, topTipY, rx * 2.4, ry * 2.4);

      ctx.restore();

      // 5. Crisp Fresnel Rim Highlight
      ctx.lineWidth = Math.max(1, rx * 0.065);
      const rimGrad = ctx.createLinearGradient(0, topTipY, 0, ry);
      rimGrad.addColorStop(0, 'rgba(148, 163, 184, 0.35)');
      rimGrad.addColorStop(0.45, 'rgba(56, 189, 248, 0.55)');
      rimGrad.addColorStop(1, 'rgba(14, 165, 233, 0.78)');
      ctx.strokeStyle = rimGrad;
      ctx.stroke();

      // 6. Primary Curved Specular Window Highlight (Upper-Left)
      ctx.save();
      ctx.translate(-rx * 0.34, -ry * 0.08);
      ctx.rotate(-0.32);
      const specGrad = ctx.createLinearGradient(0, -ry * 0.36, 0, ry * 0.36);
      specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
      specGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.82)');
      specGrad.addColorStop(1, 'rgba(255, 255, 255, 0.15)');
      ctx.fillStyle = specGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx * 0.15, ry * 0.34, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 7. Secondary Pinpoint Specular Dot
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.beginPath();
      ctx.arc(-rx * 0.18, -ry * 0.45, Math.max(1.2, rx * 0.075), 0, Math.PI * 2);
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
      const clampedScale = Math.max(0.78, Math.min(scale, 1.35));

      const centerX = width * 0.5;
      const startDropY = height * 0.17;
      const waterSurfaceY = height * 0.62;

      // Audio cues synchronized to stages
      if (elapsed >= 280 && !playedFormationAudio) {
        playedFormationAudio = true;
        audio.playDropletFormation();
      }
      if (elapsed >= 880 && !playedFallAudio) {
        playedFallAudio = true;
        audio.playDropletFall();
      }
      if (elapsed >= IMPACT_TIME && !playedImpactAudio) {
        playedImpactAudio = true;
        audio.playWaterImpactAndResonance();
        spawnImpactParticles(centerX, waterSurfaceY, clampedScale);
        // Subtle tactile haptic pulse on supported Android devices
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
            navigator.vibrate([7, 24, 4]);
          } catch {
            // Ignore if vibration blocked
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

      // 1. Pure White Canvas Background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      // Stage 5: Controlled, brief Pixel-inspired full-screen micro-vibration right at impact
      let shakeX = 0;
      let shakeY = 0;
      if (elapsed >= IMPACT_TIME && elapsed < IMPACT_TIME + 175) {
        const vibProgress = (elapsed - IMPACT_TIME) / 175;
        const damping = Math.pow(1 - vibProgress, 2.2);
        const amplitude = 2.1 * clampedScale * damping;
        shakeX = Math.sin(vibProgress * Math.PI * 7) * amplitude * 0.45;
        shakeY = Math.cos(vibProgress * Math.PI * 9) * amplitude;
      }
      ctx.translate(shakeX, shakeY);

      // -----------------------------------------------------------------------
      // STAGE 1: Calm Water Atmosphere (Lower-Middle Water Surface & Reflection)
      // -----------------------------------------------------------------------
      const surfaceAppear = Math.min(1, elapsed / 380);
      const surfaceFadeOut =
        elapsed > 1950 ? Math.max(0, 1 - (elapsed - 1950) / 550) : 1;
      const calmAlpha = surfaceAppear * surfaceFadeOut;

      if (calmAlpha > 0.01) {
        const poolRx = (155 + Math.sin(elapsed * 0.003) * 4) * clampedScale;

        // Soft ambient aqua-grey reflection pool
        const poolGrad = ctx.createRadialGradient(
          centerX,
          waterSurfaceY,
          poolRx * 0.04,
          centerX,
          waterSurfaceY,
          poolRx * 1.25
        );
        poolGrad.addColorStop(
          0,
          `rgba(186, 230, 253, ${0.36 * calmAlpha})`
        );
        poolGrad.addColorStop(
          0.45,
          `rgba(224, 242, 254, ${0.26 * calmAlpha})`
        );
        poolGrad.addColorStop(
          0.78,
          `rgba(241, 245, 249, ${0.18 * calmAlpha})`
        );
        poolGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.save();
        ctx.translate(centerX, waterSurfaceY);
        ctx.scale(1, 0.29);
        ctx.fillStyle = poolGrad;
        ctx.beginPath();
        ctx.arc(0, 0, poolRx * 1.25, 0, Math.PI * 2);
        ctx.fill();

        // Delicate calm circular water surface rings
        for (let i = 0; i < 2; i++) {
          const breathe =
            ((elapsed * 0.00055 + i * 0.5) % 1) * poolRx * 0.85;
          const ringAlpha =
            Math.sin(((elapsed * 0.00055 + i * 0.5) % 1) * Math.PI) *
            0.28 *
            calmAlpha;
          ctx.strokeStyle = `rgba(56, 189, 248, ${ringAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(0, 0, poolRx * 0.2 + breathe, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // -----------------------------------------------------------------------
      // STAGE 5: Pixel-Inspired Full-Screen Concentric Luminous Aqua Waves
      // -----------------------------------------------------------------------
      if (elapsed >= IMPACT_TIME) {
        const impactElapsed = elapsed - IMPACT_TIME;
        const maxDiag = Math.hypot(width, height) * 0.72;

        // Primary Full-Screen Pixel-Style Luminous Aqua Wave
        const wave1Progress = Math.min(1, impactElapsed / 1050);
        const wave1Ease = 1 - Math.pow(1 - wave1Progress, 2.35);
        const wave1Radius = 18 * clampedScale + maxDiag * wave1Ease;
        const wave1Alpha = Math.pow(1 - wave1Progress, 1.55);

        if (wave1Alpha > 0.01) {
          const bandThickness = (68 + wave1Progress * 95) * clampedScale;
          const innerR = Math.max(0, wave1Radius - bandThickness);
          const waveGrad = ctx.createRadialGradient(
            centerX,
            waterSurfaceY,
            innerR,
            centerX,
            waterSurfaceY,
            wave1Radius + 16 * clampedScale
          );
          waveGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          waveGrad.addColorStop(
            0.45,
            `rgba(224, 242, 254, ${0.32 * wave1Alpha})`
          );
          waveGrad.addColorStop(
            0.78,
            `rgba(56, 189, 248, ${0.22 * wave1Alpha})`
          );
          waveGrad.addColorStop(
            0.92,
            `rgba(34, 211, 238, ${0.28 * wave1Alpha})`
          );
          waveGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = waveGrad;
          ctx.beginPath();
          ctx.arc(
            centerX,
            waterSurfaceY,
            wave1Radius + 16 * clampedScale,
            0,
            Math.PI * 2
          );
          ctx.fill();

          // Crisp specular glass wavefront ring
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.34 * wave1Alpha})`;
          ctx.lineWidth = 1.6 * clampedScale;
          ctx.beginPath();
          ctx.arc(centerX, waterSurfaceY, wave1Radius * 0.94, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Secondary & Tertiary Concentric Full-Screen Harmonic Waves
        for (let w = 1; w <= 2; w++) {
          const delay = w * 145;
          if (impactElapsed > delay) {
            const subProgress = Math.min(
              1,
              (impactElapsed - delay) / (980 + w * 80)
            );
            const subEase = 1 - Math.pow(1 - subProgress, 2.4);
            const subRadius = 14 * clampedScale + maxDiag * 0.85 * subEase;
            const subAlpha = Math.pow(1 - subProgress, 1.8) * (0.28 / w);

            ctx.strokeStyle = `rgba(34, 211, 238, ${subAlpha})`;
            ctx.lineWidth = (2.2 - w * 0.5) * clampedScale;
            ctx.beginPath();
            ctx.arc(centerX, waterSurfaceY, subRadius, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }

      // -----------------------------------------------------------------------
      // STAGE 4: Water Surface Impact Ripples, Crown Splash & Rebound Pearl
      // -----------------------------------------------------------------------
      if (elapsed >= IMPACT_TIME) {
        const impactElapsed = elapsed - IMPACT_TIME;

        // 1. Expanding Perspective Surface Ripples (6 layered wave crests)
        const rippleCount = 6;
        for (let i = 0; i < rippleCount; i++) {
          const rDelay = i * 75;
          if (impactElapsed < rDelay) continue;

          const rTime = impactElapsed - rDelay;
          const rDuration = 980 + i * 70;
          const rProg = Math.min(1, rTime / rDuration);
          const rEase = 1 - Math.pow(1 - rProg, 2.5);

          const maxRx = (195 + i * 48) * clampedScale;
          const currentRx = 12 * clampedScale + maxRx * rEase;
          const currentRy = currentRx * 0.31;
          const alpha = Math.pow(1 - rProg, 1.65) * (0.72 - i * 0.08);

          if (alpha <= 0.005) continue;

          ctx.save();
          ctx.translate(centerX, waterSurfaceY);

          // Aqua wave trough glow
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.68})`;
          ctx.lineWidth = Math.max(1, (3.6 - i * 0.42) * (1 - rProg * 0.5) * clampedScale);
          ctx.beginPath();
          ctx.ellipse(0, 0, currentRx, currentRy, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Specular white crest reflection on the front & back arc
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
          ctx.lineWidth = Math.max(0.8, (1.8 - i * 0.2) * clampedScale);
          ctx.beginPath();
          ctx.ellipse(
            0,
            -1.2 * clampedScale,
            currentRx * 0.985,
            currentRy * 0.985,
            0,
            Math.PI * 0.08,
            Math.PI * 0.92
          );
          ctx.stroke();

          // Subtle light-grey/slate refraction shadow under the front crest
          ctx.strokeStyle = `rgba(148, 163, 184, ${alpha * 0.28})`;
          ctx.lineWidth = 1.1 * clampedScale;
          ctx.beginPath();
          ctx.ellipse(
            0,
            2 * clampedScale,
            currentRx * 1.01,
            currentRy * 1.01,
            0,
            Math.PI * 0.12,
            Math.PI * 0.88
          );
          ctx.stroke();

          ctx.restore();
        }

        // 2. Central Luminous Impact Flash & Worthington Jet Column
        if (impactElapsed < 420) {
          const jetProg = impactElapsed / 420;
          // Jet rises rapidly then subsides back into the pool
          const jetCurve = Math.sin(jetProg * Math.PI);
          const jetHeight = 46 * clampedScale * jetCurve;
          const jetWidth = (13 - jetProg * 6) * clampedScale;
          const jetAlpha = (1 - jetProg * 0.75) * 0.85;

          ctx.save();
          ctx.translate(centerX, waterSurfaceY);

          // Base crater ring
          const craterRx = (18 + jetProg * 28) * clampedScale;
          const craterRy = craterRx * 0.3;
          const craterGrad = ctx.createRadialGradient(
            0,
            0,
            2,
            0,
            0,
            craterRx
          );
          craterGrad.addColorStop(
            0,
            `rgba(125, 211, 252, ${0.55 * (1 - jetProg)})`
          );
          craterGrad.addColorStop(
            0.65,
            `rgba(224, 242, 254, ${0.35 * (1 - jetProg)})`
          );
          craterGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = craterGrad;
          ctx.beginPath();
          ctx.ellipse(0, 0, craterRx, craterRy, 0, 0, Math.PI * 2);
          ctx.fill();

          // Rising liquid column (Worthington jet)
          if (jetHeight > 2) {
            ctx.beginPath();
            ctx.moveTo(-jetWidth * 1.35, 2 * clampedScale);
            ctx.quadraticCurveTo(
              -jetWidth * 0.45,
              -jetHeight * 0.45,
              -jetWidth * 0.28,
              -jetHeight
            );
            ctx.arc(
              0,
              -jetHeight,
              jetWidth * 0.28,
              Math.PI,
              0,
              false
            );
            ctx.quadraticCurveTo(
              jetWidth * 0.45,
              -jetHeight * 0.45,
              jetWidth * 1.35,
              2 * clampedScale
            );
            ctx.closePath();

            const colGrad = ctx.createLinearGradient(0, -jetHeight, 0, 4);
            colGrad.addColorStop(0, `rgba(186, 230, 253, ${jetAlpha})`);
            colGrad.addColorStop(0.5, `rgba(125, 211, 252, ${jetAlpha * 0.85})`);
            colGrad.addColorStop(1, 'rgba(224, 242, 254, 0.1)');
            ctx.fillStyle = colGrad;
            ctx.fill();

            ctx.strokeStyle = `rgba(56, 189, 248, ${jetAlpha * 0.65})`;
            ctx.lineWidth = 1.1 * clampedScale;
            ctx.stroke();
          }
          ctx.restore();
        }

        // 3. Rebounding Secondary Pearl Droplet (Pinches off top of Worthington jet)
        if (impactElapsed >= 95 && impactElapsed <= 560) {
          const pearlT = (impactElapsed - 95) / 465;
          // Parabolic arc up and back down into the water surface
          const arcY =
            waterSurfaceY -
            Math.sin(pearlT * Math.PI) * 58 * clampedScale;
          const pearlRadius =
            (6.8 - Math.abs(pearlT - 0.5) * 2.2) * clampedScale;
          const pearlAlpha =
            pearlT > 0.85 ? (1 - pearlT) / 0.15 : Math.min(1, pearlT * 5);

          drawRealisticWaterDroplet(
            centerX,
            arcY,
            pearlRadius,
            pearlRadius * 1.05,
            0.12,
            pearlAlpha
          );
        }

        // 4. Fine Translucent Splash Particles & Micro Re-Entry Ripples
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (impactElapsed < p.delay) continue;

          const pElapsed = (impactElapsed - p.delay) / 16.67;
          const gravity = 0.24 * clampedScale;
          const px = p.x + p.vx * pElapsed;
          const py =
            p.y + p.vy * pElapsed + 0.5 * gravity * pElapsed * pElapsed;

          if (py >= waterSurfaceY + 4 * clampedScale) {
            if (!p.reentered) {
              p.reentered = true;
              miniRipples.push({
                x: px,
                y: py,
                radius: 2 * clampedScale,
                maxRadius: (16 + Math.random() * 14) * clampedScale,
                alpha: 0.48,
              });
            }
            continue;
          }

          const fade = Math.max(0, 1 - pElapsed / 28);
          if (fade <= 0.02) continue;

          ctx.save();
          ctx.translate(px, py);

          // Tiny droplet body
          const pGrad = ctx.createRadialGradient(
            -p.radius * 0.25,
            -p.radius * 0.25,
            p.radius * 0.1,
            0,
            0,
            p.radius
          );
          pGrad.addColorStop(0, `rgba(255, 255, 255, ${0.95 * fade})`);
          pGrad.addColorStop(0.55, `rgba(186, 230, 253, ${0.8 * fade})`);
          pGrad.addColorStop(1, `rgba(56, 189, 248, ${0.65 * fade})`);
          ctx.fillStyle = pGrad;
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }

        // Render Secondary Micro Re-Entry Ripples
        for (let m = miniRipples.length - 1; m >= 0; m--) {
          const mr = miniRipples[m];
          mr.radius += 0.65 * clampedScale;
          mr.alpha *= 0.93;
          if (mr.alpha <= 0.02 || mr.radius >= mr.maxRadius) {
            miniRipples.splice(m, 1);
            continue;
          }
          ctx.strokeStyle = `rgba(56, 189, 248, ${mr.alpha})`;
          ctx.lineWidth = 1 * clampedScale;
          ctx.beginPath();
          ctx.ellipse(
            mr.x,
            mr.y,
            mr.radius,
            mr.radius * 0.3,
            0,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }
      }

      // -----------------------------------------------------------------------
      // STAGE 2 & STAGE 3: Droplet Formation & Smooth Gravitational Fall
      // -----------------------------------------------------------------------
      if (elapsed >= 220 && elapsed < IMPACT_TIME) {
        const baseRadius = 17.5 * clampedScale;

        if (elapsed < 880) {
          // Stage 2: Droplet Formation (220ms - 880ms)
          const formT = (elapsed - 220) / 660;
          // Smooth elastic condensation curve
          const easeOutBack =
            1 +
            1.8 * Math.pow(formT - 1, 3) +
            0.8 * Math.pow(formT - 1, 2);
          const scaleFactor = Math.max(0.05, Math.min(1.06, easeOutBack));

          // Natural surface-tension oscillation as the pendant droplet swells
          const wobble =
            Math.sin(formT * Math.PI * 3.5) * 0.055 * (1 - formT * 0.5);
          const rx = baseRadius * scaleFactor * (1 - wobble);
          const ry = baseRadius * scaleFactor * (1 + wobble * 1.35);

          // Slight downward sag under its own weight right before detachment
          const sagY = startDropY + Math.pow(formT, 2.4) * 16 * clampedScale;
          const pinch = Math.pow(formT, 1.8) * 0.65;
          const alpha = Math.min(1, formT * 2.2);

          drawRealisticWaterDroplet(centerX, sagY, rx, ry, pinch, alpha);
        } else {
          // Stage 3: Smooth Droplet Fall (880ms - 1280ms)
          const fallT = (elapsed - 880) / (IMPACT_TIME - 880);
          // Natural gravitational acceleration curve
          const fallEase = Math.pow(fallT, 2.12);

          const fallStartY = startDropY + 16 * clampedScale;
          const currentY =
            fallStartY + (waterSurfaceY - fallStartY) * fallEase;

          // Volume-conserving aerodynamic teardrop elongation
          const stretch = 1 + fallT * 0.32;
          const rx = baseRadius * (1 / Math.sqrt(stretch));
          const ry = baseRadius * stretch;
          const pinch = 0.65 + fallT * 0.35;

          // Subtle trailing micro-satellite droplet left behind at detachment
          if (fallT < 0.72) {
            const trailProgress = fallT / 0.72;
            const trailY =
              fallStartY +
              (currentY - fallStartY) * Math.pow(trailProgress, 1.55) -
              ry * 1.65;
            const trailR =
              baseRadius * 0.24 * (1 - trailProgress * 0.65);
            drawRealisticWaterDroplet(
              centerX,
              trailY,
              trailR,
              trailR * 1.15,
              0.2,
              (1 - trailProgress) * 0.75
            );
          }

          drawRealisticWaterDroplet(centerX, currentY, rx, ry, pinch, 1);
        }
      }

      ctx.restore();
      rafId = window.requestAnimationFrame(renderFrame);
    };

    rafId = window.requestAnimationFrame(renderFrame);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      audio.dispose();
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] bg-white select-none overflow-hidden transition-opacity duration-450 ease-out ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full bg-white"
      />
    </div>
  );
}
