'use client';
import { useEffect } from 'react';

export default function BlogEffects() {
  useEffect(() => {
    document.body.style.cursor = 'default';

    const ac = new AbortController();
    const { signal } = ac;
    const observers: IntersectionObserver[] = [];
    let oceanRunning = true;
    let bubbleRunning = true;

    // ─── OCEAN CANVAS ─────────────────────────────────────────
    (function initCanvas() {
      const canvas = document.getElementById('ocean-canvas') as HTMLCanvasElement | null;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      let W = 0, H = 0;
      const DPR = Math.min(window.devicePixelRatio || 1, 2);

      function resize() {
        W = window.innerWidth; H = window.innerHeight;
        canvas!.width = W * DPR; canvas!.height = H * DPR;
        canvas!.style.width = W + 'px'; canvas!.style.height = H + 'px';
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      }
      resize();
      window.addEventListener('resize', resize, { signal });

      const N = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 28000));
      const PARTICLES = Array.from({ length: N }, () => ({
        x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
        r: Math.random() * 1.3 + 0.3,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.05 - 0.02,
        phase: Math.random() * Math.PI * 2,
        hue: 195 + Math.random() * 30,
        alpha: 0.25 + Math.random() * 0.4,
      }));

      function getScrollP() {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        return Math.min(1, window.scrollY / max);
      }

      let t = 0;
      function frame() {
        if (!oceanRunning) return;
        t += 0.005;
        const p = getScrollP();

        const topL = 0.24 - p * 0.21;
        const botL = 0.14 - p * 0.13;
        const topC = 0.09 - p * 0.08;
        const botC = 0.07 - p * 0.065;
        const topH = 212 + p * 23;
        const botH = 218 + p * 27;

        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, `oklch(${Math.max(0.02, topL).toFixed(3)} ${Math.max(0.005, topC).toFixed(3)} ${topH.toFixed(0)})`);
        g.addColorStop(1, `oklch(${Math.max(0.01, botL).toFixed(3)} ${Math.max(0.005, botC).toFixed(3)} ${botH.toFixed(0)})`);
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

        const rayOpacity = Math.max(0, 1 - p * 3.5);
        if (rayOpacity > 0.02) {
          ctx.save(); ctx.globalCompositeOperation = 'lighter';
          for (let i = 0; i < 6; i++) {
            const rx = ((i + 0.5) / 6) * W + Math.sin(t * 0.25 + i * 1.8) * 70;
            const rg = ctx.createLinearGradient(rx, 0, rx, H * 0.55);
            const a = 0.06 * rayOpacity;
            rg.addColorStop(0, `oklch(0.60 0.11 205 / ${a * 1.6})`);
            rg.addColorStop(0.5, `oklch(0.35 0.07 210 / ${a * 0.6})`);
            rg.addColorStop(1, 'transparent');
            ctx.fillStyle = rg;
            const w = 45 + Math.sin(t * 0.35 + i) * 18;
            ctx.beginPath();
            ctx.moveTo(rx - w * 0.2, 0); ctx.lineTo(rx + w * 0.2, 0);
            ctx.lineTo(rx + w, H * 0.55); ctx.lineTo(rx - w, H * 0.55);
            ctx.closePath(); ctx.fill();
          }
          ctx.restore();
        }

        // Wave strata
        ctx.save(); ctx.globalCompositeOperation = 'screen';
        const waveCount = 3 + Math.floor(p * 3);
        const waveIntensity = Math.sin(p * Math.PI) * 0.6 + 0.15;
        for (let k = 0; k < waveCount; k++) {
          const yBase = H * (0.15 + k * (0.75 / waveCount));
          ctx.beginPath();
          for (let x = 0; x <= W; x += 8) {
            const y = yBase
              + Math.sin(x * 0.004 + t * (0.2 + k * 0.07) + k * 2.5) * (6 + p * 5)
              + Math.sin(x * 0.01 + t * 0.12) * (2 + p * 3);
            if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `oklch(0.28 0.04 ${215 + p * 20} / ${0.025 * waveIntensity * (1 - k / (waveCount + 2))})`;
          ctx.lineWidth = 1; ctx.stroke();
        }
        ctx.restore();

        const deepGlow = Math.max(0, (p - 0.5) * 2);
        if (deepGlow > 0.01) {
          ctx.save(); ctx.globalCompositeOperation = 'lighter';
          for (let i = 0; i < 2; i++) {
            const gx = W * (0.3 + i * 0.4) + Math.sin(t * (0.18 + i * 0.1)) * W * 0.2;
            const gy = H * (0.4 + i * 0.2) + Math.cos(t * (0.1 + i * 0.07)) * H * 0.15;
            const rg = ctx.createRadialGradient(gx, gy, 0, gx, gy, 180 + i * 80);
            rg.addColorStop(0, `oklch(0.40 0.13 ${200 + i * 15} / ${0.04 * deepGlow})`);
            rg.addColorStop(1, 'transparent');
            ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
          }
          ctx.restore();
        }

        for (const pt of PARTICLES) {
          pt.x += pt.vx; pt.y += pt.vy + Math.sin(t * 1.5 + pt.phase) * 0.1;
          if (pt.x < -10) pt.x = W + 10; if (pt.x > W + 10) pt.x = -10;
          if (pt.y < -10) pt.y = H + 10; if (pt.y > H + 10) pt.y = -10;
          const twinkle = 0.5 + 0.5 * Math.sin(t * 2 + pt.phase * 3);
          const depthVis = Math.sin(p * Math.PI) * 0.6 + 0.3;
          const a = pt.alpha * (0.2 + twinkle * 0.4) * depthVis;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.r * (0.8 + depthVis * 0.3), 0, Math.PI * 2);
          ctx.fillStyle = `oklch(0.80 0.12 ${pt.hue} / ${a})`;
          ctx.shadowColor = `oklch(0.80 0.12 ${pt.hue} / ${a * 0.6})`;
          ctx.shadowBlur = pt.r * 8; ctx.fill();
        }
        ctx.shadowBlur = 0;
        requestAnimationFrame(frame);
      }
      frame();
    })();

    // ─── BUBBLE TRAIL ─────────────────────────────────────────
    (function initBubbleTrail() {
      const canvas = document.getElementById('bubble-trail') as HTMLCanvasElement | null;
      if (!canvas || matchMedia('(pointer: coarse)').matches) return;
      const ctx = canvas.getContext('2d')!;
      let W = 0, H = 0;
      const DPR = Math.min(window.devicePixelRatio || 1, 2);

      function resize() {
        W = window.innerWidth; H = window.innerHeight;
        canvas!.width = W * DPR; canvas!.height = H * DPR;
        canvas!.style.width = W + 'px'; canvas!.style.height = H + 'px';
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      }
      resize();
      window.addEventListener('resize', resize, { signal });

      let mx = -100, my = -100, pmx = -100, pmy = -100;
      let lastSpawn = 0, lastMoveAt = 0;
      const bubbles: { x: number; y: number; r: number; vy: number; vx: number; life: number; decay: number; hue: number; wobblePhase: number; wobbleAmp: number }[] = [];

      window.addEventListener('mousemove', (e: MouseEvent) => {
        mx = e.clientX; my = e.clientY; lastMoveAt = performance.now();
      }, { signal });

      function frame(now: number) {
        if (!bubbleRunning) return;
        ctx.clearRect(0, 0, W, H);

        const dx = mx - pmx, dy = my - pmy;
        const v = Math.hypot(dx, dy);
        pmx = mx; pmy = my;

        const isMoving = (now - lastMoveAt) < 80 && v > 1.2;
        if (isMoving && mx > 0 && now - lastSpawn > 55) {
          lastSpawn = now;
          const count = v > 12 ? 2 : 1;
          for (let i = 0; i < count; i++) {
            bubbles.push({
              x: mx + (Math.random() - 0.5) * 14,
              y: my + (Math.random() - 0.5) * 8,
              r: 1.6 + Math.random() * 3.5,
              vy: -(0.45 + Math.random() * 1.1),
              vx: (Math.random() - 0.5) * 0.35,
              life: 1,
              decay: 0.010 + Math.random() * 0.013,
              hue: 192 + Math.random() * 22,
              wobblePhase: Math.random() * Math.PI * 2,
              wobbleAmp: 0.4 + Math.random() * 0.5,
            });
          }
        }

        for (let i = bubbles.length - 1; i >= 0; i--) {
          const b = bubbles[i];
          b.life -= b.decay;
          if (b.life <= 0) { bubbles.splice(i, 1); continue; }
          b.y += b.vy;
          b.x += b.vx + Math.sin(now * 0.003 + b.wobblePhase) * b.wobbleAmp * 0.4;
          b.vy *= 0.996;
          const a = b.life * 0.7;
          const r = b.r * (0.55 + b.life * 0.45);
          ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
          ctx.fillStyle = `oklch(0.55 0.08 ${b.hue} / ${a * 0.14})`; ctx.fill();
          ctx.strokeStyle = `oklch(0.82 0.10 ${b.hue} / ${a})`;
          ctx.lineWidth = 0.7; ctx.stroke();
          if (r > 1.8) {
            ctx.beginPath();
            ctx.arc(b.x - r * 0.3, b.y - r * 0.3, r * 0.2, 0, Math.PI * 2);
            ctx.fillStyle = `oklch(0.96 0.03 200 / ${a * 0.55})`; ctx.fill();
          }
        }

        if (bubbles.length > 100) bubbles.splice(0, bubbles.length - 100);
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    })();

    // ─── DEPTH COUNTER ────────────────────────────────────────
    (function() {
      const depthEl = document.querySelector('[data-depth]') as HTMLElement | null;
      const labelEl = document.querySelector('[data-depth-label]') as HTMLElement | null;
      if (!depthEl) return;
      const ZONES = [
        { max: 0.10, n: 'SURFACE' }, { max: 0.28, n: 'TWILIGHT' },
        { max: 0.55, n: 'MIDNIGHT' }, { max: 0.82, n: 'ABYSSAL' }, { max: 1.01, n: 'HADAL' },
      ];
      function onScroll() {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const p = Math.min(1, window.scrollY / max);
        depthEl!.textContent = String(Math.round(p * 4000)).padStart(4, '0') + 'm';
        const zone = ZONES.find(z => p <= z.max) || ZONES[ZONES.length - 1];
        if (labelEl) labelEl.textContent = zone.n;
      }
      window.addEventListener('scroll', onScroll, { passive: true, signal });
      onScroll();
    })();

    // ─── SCROLL REVEAL ────────────────────────────────────────
    (function() {
      const els = document.querySelectorAll('[data-reveal]');
      if (!els.length || !('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('in')); return;
      }
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.15 });
      els.forEach(el => io.observe(el));
      observers.push(io);
    })();

    // ─── CLICK RIPPLE ─────────────────────────────────────────
    window.addEventListener('click', (e: MouseEvent) => {
      const r = document.createElement('div');
      r.className = 'ripple';
      r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px';
      document.body.appendChild(r);
      setTimeout(() => r.remove(), 1500);
    }, { signal });

    return () => {
      oceanRunning = false;
      bubbleRunning = false;
      ac.abort();
      observers.forEach(io => io.disconnect());
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <>
      <canvas id="ocean-canvas" />
      <canvas id="bubble-trail" />
      <div className="overlay-vignette" />
      <div className="overlay-grain" />
      <div className="frame frame-blog">
        <div className="fr-logo">
          ⌁ Lee Sangho<br />
          <span style={{ color: 'var(--muted)' }}>/ Archive</span>
        </div>
        <nav className="fr-nav">
          <a href="/">← Home</a>
          <a href="https://github.com/whysocscs" target="_blank" rel="noopener">GitHub ↗</a>
        </nav>
        <div className="fr-coord">
          N 36° 21′ 22″<br />
          E 127° 23′ 46″<br />
          <span style={{ color: 'var(--muted)' }}>Archive vol. 01</span>
        </div>
        <div className="fr-depth">
          <span>Depth</span>
          <span className="n" data-depth="">0000m</span>
          <span data-depth-label="">SURFACE</span>
        </div>
      </div>
    </>
  );
}
