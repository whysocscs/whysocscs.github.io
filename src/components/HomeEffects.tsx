'use client';
import { useEffect } from 'react';

export default function HomeEffects() {
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--breathe-y',
      window.innerWidth < 768 ? '-2px' : '-5px',
    );

    const ac = new AbortController();
    const { signal } = ac;
    const observers: IntersectionObserver[] = [];
    let introRunning = true;
    let oceanRunning = true;
    let cursorRunning = true;
    let bubbleRunning = true;

    function showFrameUI() {
      document.querySelector('.fr-logo')?.classList.add('in');
      document.querySelector('.fr-nav')?.classList.add('in');
    }

    // ─── INTRO ───────────────────────────────────────────────
    (function initIntro() {
      const intro = document.getElementById('intro') as HTMLDivElement | null;
      const canvas = document.getElementById('intro-canvas') as HTMLCanvasElement | null;
      if (!intro || !canvas) return;
      const introEl = intro;
      const canvasEl = canvas;

      if (sessionStorage.getItem('introSeen') === '1') {
        introEl.style.display = 'none';
        showFrameUI();
        return;
      }

      document.body.style.overflow = 'hidden';
      const ctx = canvasEl.getContext('2d')!;
      const isMobile = window.innerWidth < 768;
      let W = 0, H = 0;
      const DPR = Math.min(window.devicePixelRatio || 1, 2);

      function resize() {
        W = window.innerWidth; H = window.innerHeight;
        canvasEl.width = W * DPR; canvasEl.height = H * DPR;
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      }
      resize();
      window.addEventListener('resize', resize, { signal });

      const SC = isMobile ? 30 : 72;
      const SNOW = Array.from({ length: SC }, () => ({
        x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
        r: 0.3 + Math.random() * 0.82,
        vy: -(0.07 + Math.random() * 0.18), vx: (Math.random() - 0.5) * 0.09,
        alpha: 0.05 + Math.random() * 0.15, phase: Math.random() * Math.PI * 2,
      }));

      const RAYS = Array.from({ length: isMobile ? 5 : 8 }, () => ({
        x: 0.30 + Math.random() * 0.40 + (Math.random() - 0.5) * 0.05,
        w: 0.013 + Math.random() * 0.020,
        speed: 0.05 + Math.random() * 0.09,
        phase: Math.random() * Math.PI * 2,
        b: 0.45 + Math.random() * 0.55,
      }));
      const INTRO_BUBBLES = Array.from({ length: isMobile ? 10 : 18 }, () => ({
        x: Math.random(), y: Math.random(), r: 6 + Math.random() * 22,
        speed: 0.18 + Math.random() * 0.42, phase: Math.random() * Math.PI * 2,
        alpha: 0.08 + Math.random() * 0.18,
      }));

      const oc = document.createElement('canvas');
      const TOTAL = 8200;
      let startTime = 0;
      let t = 0;
      let started = false;
      let idleRunning = true;
      let autoDiveTimer = 0;

      function ease(x: number) { return x < 0.5 ? 2*x*x : 1 - Math.pow(-2*x+2, 2)/2; }
      function ramp(s: number, e: number, el: number) { return Math.max(0, Math.min(1, (el-s)/(e-s))); }

      function drawIdle(now: number) {
        if (!introRunning || !idleRunning || started) return;
        const pulse = 0.5 + Math.sin(now * 0.0014) * 0.5;
        ctx.clearRect(0, 0, W, H);
        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, 'oklch(0.83 0.08 205)');
        bg.addColorStop(0.36, 'oklch(0.55 0.12 200)');
        bg.addColorStop(1, 'oklch(0.17 0.07 220)');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const horizonY = H * 0.34;
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const glow = ctx.createRadialGradient(W * 0.5, horizonY, 0, W * 0.5, horizonY, W * 0.56);
        glow.addColorStop(0, `oklch(0.96 0.04 190 / ${0.24 + pulse * 0.08})`);
        glow.addColorStop(0.45, 'oklch(0.72 0.12 195 / 0.16)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (let y = horizonY - 30; y < horizonY + 120; y += 22) {
          ctx.beginPath();
          for (let x = 0; x <= W; x += 16) {
            const yy = y + Math.sin(x * 0.012 + now * 0.002 + y * 0.03) * 7;
            if (x === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
          }
          ctx.strokeStyle = `oklch(0.92 0.06 190 / ${0.12 - Math.abs(y - horizonY) / 220})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();

        requestAnimationFrame(drawIdle);
      }

      function startDive() {
        if (started) return;
        started = true;
        idleRunning = false;
        startTime = performance.now();
        introEl.classList.add('intro-diving');
        requestAnimationFrame(frame);
      }

      requestAnimationFrame(drawIdle);
      autoDiveTimer = window.setTimeout(startDive, 260);
      signal.addEventListener('abort', () => window.clearTimeout(autoDiveTimer), { once: true });

      function frame(now: number) {
        if (!introRunning) return;
        t += 0.007;
        const el = now - startTime;
        const plunge = ease(ramp(1650, 3400, el));
        const dive = ease(ramp(1900, 6900, el));
        const surfaceLight = 1 - ease(ramp(2400, 5600, el));

        ctx.clearRect(0, 0, W, H);

        const fi = ease(ramp(0, 800, el));
        const sh = isMobile ? ease(ramp(300, 900, el)) * 0.036 : 0;
        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, `oklch(${Math.max(0.035, 0.80*surfaceLight + 0.16*fi - dive*0.08 + sh).toFixed(3)} ${Math.max(0.015, 0.07 + surfaceLight*0.06).toFixed(3)} 198)`);
        bg.addColorStop(0.38, `oklch(${Math.max(0.025, 0.58*surfaceLight + 0.12*fi - dive*0.08).toFixed(3)} ${Math.max(0.014, 0.05 + surfaceLight*0.05).toFixed(3)} ${205 + dive*12})`);
        bg.addColorStop(1, `oklch(${Math.max(0.008, 0.20*surfaceLight + 0.05*fi - dive*0.03).toFixed(3)} ${Math.max(0.008, 0.025 + surfaceLight*0.025).toFixed(3)} ${225 + dive*18})`);
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

        if (surfaceLight > 0.02) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          const sun = ctx.createRadialGradient(W * 0.5, H * 0.18, 0, W * 0.5, H * 0.18, W * 0.54);
          sun.addColorStop(0, `oklch(0.98 0.04 185 / ${surfaceLight * 0.34})`);
          sun.addColorStop(0.35, `oklch(0.78 0.11 195 / ${surfaceLight * 0.20})`);
          sun.addColorStop(1, 'transparent');
          ctx.fillStyle = sun;
          ctx.fillRect(0, 0, W, H);

          ctx.strokeStyle = `oklch(0.98 0.04 190 / ${surfaceLight * 0.16})`;
          ctx.lineWidth = 1;
          for (let y = H * 0.22; y < H * 0.68; y += 28) {
            ctx.beginPath();
            for (let x = -40; x <= W + 40; x += 24) {
              const yy = y + Math.sin(x * 0.013 + el * 0.0022 + y * 0.018) * 8;
              if (x === -40) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
            }
            ctx.stroke();
          }
          ctx.restore();
        }

        const surface = ease(ramp(0, 1200, el)) * (1 - ease(ramp(4400, 6700, el)));
        if (surface > 0.01) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          const horizonY = H * (0.52 - plunge * 0.38);
          const surfaceG = ctx.createLinearGradient(0, horizonY - 170, 0, horizonY + 150);
          surfaceG.addColorStop(0, `oklch(1 0.02 190 / ${surface * (0.38 - dive*0.08)})`);
          surfaceG.addColorStop(0.45, `oklch(0.82 0.13 192 / ${surface * 0.45})`);
          surfaceG.addColorStop(1, 'transparent');
          ctx.fillStyle = surfaceG;
          ctx.beginPath();
          ctx.moveTo(0, horizonY);
          for (let x = 0; x <= W; x += 18) {
            const y = horizonY + Math.sin(x * 0.010 + t * 17) * (12 + plunge * 18) + Math.sin(x * 0.027 - t * 11) * 7;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(W, horizonY + 190);
          ctx.lineTo(0, horizonY + 190);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        const ri = ease(ramp(1600, 3600, el)) * (1 - ease(ramp(6000, 7600, el)));
        if (ri > 0.01) {
          ctx.save(); ctx.globalCompositeOperation = 'lighter';
          for (const r of RAYS) {
            const rx = (r.x + Math.sin(t * r.speed + r.phase) * 0.055) * W;
            const w = r.w * W * (1.2 + plunge * 0.8), bW = w * 5, a = ri * r.b * 0.08;
            const g = ctx.createLinearGradient(rx, -H*0.05, rx, H*0.68);
            g.addColorStop(0, `oklch(0.68 0.10 202 / ${a*2})`);
            g.addColorStop(0.25, `oklch(0.48 0.08 208 / ${a})`);
            g.addColorStop(0.7, `oklch(0.28 0.05 218 / ${a*0.35})`);
            g.addColorStop(1, 'transparent');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.moveTo(rx-w, -H*0.05); ctx.lineTo(rx+w, -H*0.05);
            ctx.lineTo(rx+bW, H*0.68); ctx.lineTo(rx-bW, H*0.68);
            ctx.closePath(); ctx.fill();
          }
          ctx.restore();
        }

        const splash = ease(ramp(1450, 2100, el)) * (1 - ease(ramp(2450, 3900, el)));
        if (splash > 0.01) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          const cx = W * 0.5;
          const cy = H * (0.52 - plunge * 0.20);
          ctx.strokeStyle = `oklch(0.98 0.03 190 / ${(1 - splash * 0.45) * 0.52})`;
          ctx.lineWidth = Math.max(2, W * 0.0025);
          ctx.beginPath();
          ctx.ellipse(cx, cy, splash * W * 0.34, splash * H * 0.08, 0, 0, Math.PI * 2);
          ctx.stroke();
          for (let i = 0; i < 42; i += 1) {
            const a = (i / 42) * Math.PI * 2;
            const dist = splash * (90 + Math.sin(i * 12.9) * 26) * (isMobile ? 0.76 : 1);
            const x = cx + Math.cos(a) * dist * 2.7;
            const y = cy + Math.sin(a) * dist * 0.34 - splash * 62;
            ctx.beginPath();
            ctx.arc(x, y, 1.4 + (1 - splash) * 3.4, 0, Math.PI * 2);
            ctx.fillStyle = `oklch(0.98 0.04 190 / ${(1 - splash * 0.55) * 0.28})`;
            ctx.fill();
          }
          ctx.restore();
        }

        const si = ease(ramp(4200, 5600, el));
        if (si > 0.01) {
          for (const s of SNOW) {
            s.y += s.vy; s.x += s.vx + Math.sin(t*0.6 + s.phase)*0.11;
            if (s.y < -4) { s.y = H+4; s.x = Math.random()*W; }
            if (s.x < -4) s.x = W+4; if (s.x > W+4) s.x = -4;
            const a = s.alpha * si;
            if (a < 0.01) continue;
            ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
            ctx.fillStyle = `oklch(0.88 0.04 205 / ${a})`; ctx.fill();
          }
        }

        const bubbleIn = ease(ramp(2300, 6200, el)) * (1 - ease(ramp(6500, 7900, el)));
        if (bubbleIn > 0.01) {
          ctx.save();
          for (const b of INTRO_BUBBLES) {
            const drift = (el * 0.00012 * b.speed * H) % 1;
            const x = b.x * W + Math.sin(t * 1.6 + b.phase) * (30 + dive * 30);
            const y = ((b.y - drift + 1.15) % 1.25) * H;
            const rr = b.r * (0.6 + dive * 0.7) * (isMobile ? 0.72 : 1);
            const a = b.alpha * bubbleIn * (0.45 + dive * 0.45);
            ctx.beginPath();
            ctx.arc(x, y, rr, 0, Math.PI * 2);
            ctx.fillStyle = `oklch(0.88 0.08 195 / ${a * 0.07})`; ctx.fill();
            ctx.strokeStyle = `oklch(0.98 0.04 198 / ${a * 0.58})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          ctx.restore();
        }

        const whale = ease(ramp(4300, 6800, el)) * (1 - ease(ramp(7100, 8000, el)));
        if (whale > 0.01 && !isMobile) {
          ctx.save();
          ctx.translate(W * (0.12 + whale * 0.74), H * (0.64 - Math.sin(whale * Math.PI) * 0.12));
          ctx.scale(1.2 + whale * 0.3, 1.2 + whale * 0.3);
          ctx.globalAlpha = whale * 0.2;
          ctx.fillStyle = 'oklch(0.02 0.025 230)';
          ctx.beginPath();
          ctx.ellipse(0, 0, 88, 24, -0.06, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-82, -2); ctx.lineTo(-132, -24); ctx.lineTo(-116, 0); ctx.lineTo(-134, 22); ctx.closePath(); ctx.fill();
          ctx.beginPath();
          ctx.moveTo(26, 16); ctx.lineTo(76, 52); ctx.lineTo(48, 12); ctx.closePath(); ctx.fill();
          ctx.restore();
        }

        const tv = ease(ramp(3900, 4700, el));
        const tc = ease(ramp(4450, 6100, el));
        if (tv > 0.01) {
          const cx = W*0.5, cy = H*0.5 - 36;
          const fs = Math.min(W*0.11, 118);
          if (oc.width !== W*DPR) { oc.width = W*DPR; oc.height = H*DPR; }
          const ox = oc.getContext('2d')!;
          ox.clearRect(0, 0, oc.width, oc.height);
          ox.setTransform(DPR, 0, 0, DPR, 0, 0);
          ox.font = `800 ${fs}px 'Outfit', 'Pretendard', sans-serif`;
          ox.textAlign = 'center'; ox.textBaseline = 'middle';
          ox.fillStyle = `rgba(240,237,232,${tv})`;
          ox.fillText('Lee Sangho', cx, cy);

          const amp = (1 - tc) * 12;
          const tp = el * 0.0018;
          const sh = 3;
          for (let row = 0; row < Math.ceil(H/sh); row++) {
            const sy = row * sh, shh = Math.min(sh, H-sy);
            const dx = Math.sin(sy*0.03 + tp + row*0.38)*amp + Math.sin(sy*0.067 + tp*1.25)*amp*0.38;
            ctx.drawImage(oc, 0, sy*DPR, W*DPR, shh*DPR, dx, sy, W, shh);
          }
        }

        const sv = ease(ramp(5650, 6650, el));
        if (sv > 0.01) {
          const cx = W*0.5, cy = H*0.5 - 36, fs = Math.min(W*0.11, 118);
          ctx.font = `300 ${Math.min(W*0.021, 12)}px 'JetBrains Mono', monospace`;
          ctx.textAlign = 'center';
          ctx.fillStyle = `oklch(0.52 0.025 215 / ${sv})`;
          ctx.fillText('NOTES FROM THE DEEP SEA', cx, cy + fs*0.72 + 22);
        }

        const hv = ease(ramp(6800, 7600, el));
        if (hv > 0.01) {
          const cx = W*0.5, cy = H*0.5 - 36, fs = Math.min(W*0.11, 118);
          const hy = cy + fs*0.72 + 66;
          ctx.font = `300 9px 'JetBrains Mono', monospace`;
          ctx.fillStyle = `oklch(0.48 0.02 215 / ${hv*0.62})`;
          ctx.fillText('DESCEND', cx, hy);
          const lg = ctx.createLinearGradient(cx, hy+16, cx, hy+54);
          lg.addColorStop(0, `oklch(0.76 0.11 190 / ${hv*(0.5+0.5*Math.sin(el*0.004))})`);
          lg.addColorStop(1, 'transparent');
          ctx.strokeStyle = lg; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(cx, hy+16); ctx.lineTo(cx, hy+54); ctx.stroke();
        }

        const fo = ease(ramp(7400, 8200, el));
        if (fo > 0.01) introEl.style.opacity = (1-fo).toFixed(3);

        if (el >= TOTAL) {
          introEl.classList.add('done');
          document.body.style.overflow = '';
          sessionStorage.setItem('introSeen', '1');
          showFrameUI();
          setTimeout(() => introEl.remove(), 400);
          return;
        }
        requestAnimationFrame(frame);
      }
    })();

    // ─── OCEAN CANVAS ─────────────────────────────────────────
    (function initCanvas() {
      const canvas = document.getElementById('ocean-canvas') as HTMLCanvasElement | null;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      const isMobile = window.innerWidth < 768;
      let W = 0, H = 0;
      const DPR = Math.min(window.devicePixelRatio || 1, 2);

      function resize() {
        W = window.innerWidth; H = window.innerHeight;
        canvas!.width = W*DPR; canvas!.height = H*DPR;
        canvas!.style.width = W+'px'; canvas!.style.height = H+'px';
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      }
      resize();
      window.addEventListener('resize', resize, { signal });

      const N = isMobile ? 22 : 56;
      const PARTICLES = Array.from({ length: N }, () => ({
        x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight,
        r: 0.3+Math.random()*1.0, vx: (Math.random()-0.5)*0.07,
        vy: (Math.random()-0.5)*0.04-0.018, phase: Math.random()*Math.PI*2,
        hue: 195+Math.random()*25, alpha: 0.10+Math.random()*0.22,
      }));

      function getP() {
        return Math.min(1, window.scrollY/Math.max(1, document.documentElement.scrollHeight-window.innerHeight));
      }

      let t = 0;
      function frame() {
        if (!oceanRunning) return;
        t += 0.004;
        const p = getP();

        const topL = Math.max(0.015, 0.24-p*0.225);
        const botL = Math.max(0.010, 0.13-p*0.12);
        const topC = Math.max(0.004, 0.09-p*0.086);
        const botC = Math.max(0.003, 0.06-p*0.057);
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, `oklch(${topL.toFixed(3)} ${topC.toFixed(3)} ${(212+p*28).toFixed(0)})`);
        g.addColorStop(1, `oklch(${botL.toFixed(3)} ${botC.toFixed(3)} ${(220+p*28).toFixed(0)})`);
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

        const rf = Math.max(0, 1-p*4.2);
        if (rf > 0.02) {
          ctx.save(); ctx.globalCompositeOperation = 'lighter';
          for (let i = 0; i < 5; i++) {
            const rx = ((i+0.5)/5)*W + Math.sin(t*0.2+i*1.9)*60;
            const rg = ctx.createLinearGradient(rx, 0, rx, H*0.5);
            const a = 0.05*rf;
            rg.addColorStop(0, `oklch(0.58 0.10 205 / ${a*1.5})`);
            rg.addColorStop(0.5, `oklch(0.35 0.07 212 / ${a*0.5})`);
            rg.addColorStop(1, 'transparent');
            ctx.fillStyle = rg;
            const w = 38+Math.sin(t*0.3+i)*14;
            ctx.beginPath();
            ctx.moveTo(rx-w*0.15, 0); ctx.lineTo(rx+w*0.15, 0);
            ctx.lineTo(rx+w, H*0.5); ctx.lineTo(rx-w, H*0.5);
            ctx.closePath(); ctx.fill();
          }
          ctx.restore();
        }

        const dg = Math.max(0, (p-0.42)*1.7);
        if (dg > 0.01) {
          ctx.save(); ctx.globalCompositeOperation = 'lighter';
          for (let i = 0; i < 2; i++) {
            const gx = W*(0.25+i*0.5)+Math.sin(t*(0.15+i*0.08))*W*0.15;
            const gy = H*(0.38+i*0.24)+Math.cos(t*(0.09+i*0.05))*H*0.12;
            const rg = ctx.createRadialGradient(gx, gy, 0, gx, gy, 160+i*70);
            rg.addColorStop(0, `oklch(0.38 0.11 ${198+i*12} / ${0.035*dg})`);
            rg.addColorStop(1, 'transparent');
            ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
          }
          ctx.restore();
        }

        for (const pt of PARTICLES) {
          pt.x += pt.vx; pt.y += pt.vy + Math.sin(t*1.2+pt.phase)*0.08;
          if (pt.x<-5) pt.x=W+5; if (pt.x>W+5) pt.x=-5;
          if (pt.y<-5) pt.y=H+5; if (pt.y>H+5) pt.y=-5;
          const tw = 0.55+0.45*Math.sin(t*1.8+pt.phase*2.5);
          const dv = Math.sin(p*Math.PI)*0.55+0.28;
          const a = pt.alpha*(0.25+tw*0.35)*dv;
          if (a<0.018) continue;
          ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r*(0.7+dv*0.35), 0, Math.PI*2);
          ctx.fillStyle = `oklch(0.82 0.10 ${pt.hue} / ${a})`;
          ctx.shadowColor = `oklch(0.82 0.10 ${pt.hue} / ${a*0.45})`;
          ctx.shadowBlur = pt.r*7; ctx.fill();
        }
        ctx.shadowBlur = 0;
        requestAnimationFrame(frame);
      }
      frame();
    })();

    (function initBubbleTrail() {
      const canvas = document.getElementById('bubble-trail') as HTMLCanvasElement | null;
      if (!canvas || matchMedia('(pointer: coarse)').matches) return;
      const canvasEl = canvas;
      const ctx = canvasEl.getContext('2d')!;
      let W = 0, H = 0;
      const DPR = Math.min(window.devicePixelRatio || 1, 2);

      function resize() {
        W = window.innerWidth; H = window.innerHeight;
        canvasEl.width = W * DPR; canvasEl.height = H * DPR;
        canvasEl.style.width = W + 'px'; canvasEl.style.height = H + 'px';
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      }
      resize();
      window.addEventListener('resize', resize, { signal });

      let mx = -100, my = -100, pmx = -100, pmy = -100;
      let lastSpawn = 0, lastMoveAt = 0;
      const bubbles: { x: number; y: number; r: number; vy: number; vx: number; life: number; decay: number; hue: number; phase: number }[] = [];

      window.addEventListener('mousemove', (e: MouseEvent) => {
        mx = e.clientX; my = e.clientY; lastMoveAt = performance.now();
      }, { signal });

      function frame(now: number) {
        if (!bubbleRunning) return;
        ctx.clearRect(0, 0, W, H);
        const dx = mx - pmx, dy = my - pmy;
        const speed = Math.hypot(dx, dy);
        pmx = mx; pmy = my;

        if (mx > 0 && speed > 0.7 && now - lastMoveAt < 90 && now - lastSpawn > 34) {
          lastSpawn = now;
          const count = speed > 16 ? 3 : speed > 7 ? 2 : 1;
          for (let i = 0; i < count; i += 1) {
            bubbles.push({
              x: mx + (Math.random() - 0.5) * 18,
              y: my + (Math.random() - 0.5) * 12,
              r: 1.2 + Math.random() * 4.8,
              vy: -(0.7 + Math.random() * 1.5),
              vx: (Math.random() - 0.5) * 0.55,
              life: 1,
              decay: 0.008 + Math.random() * 0.012,
              hue: 188 + Math.random() * 28,
              phase: Math.random() * Math.PI * 2,
            });
          }
        }

        for (let i = bubbles.length - 1; i >= 0; i -= 1) {
          const b = bubbles[i];
          b.life -= b.decay;
          if (b.life <= 0) { bubbles.splice(i, 1); continue; }
          b.y += b.vy;
          b.x += b.vx + Math.sin(now * 0.004 + b.phase) * 0.35;
          const a = b.life * 0.78;
          const r = b.r * (0.5 + b.life * 0.6);
          ctx.beginPath();
          ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
          ctx.fillStyle = `oklch(0.64 0.09 ${b.hue} / ${a * 0.13})`; ctx.fill();
          ctx.strokeStyle = `oklch(0.9 0.06 ${b.hue} / ${a})`;
          ctx.lineWidth = 0.75; ctx.stroke();
        }
        if (bubbles.length > 140) bubbles.splice(0, bubbles.length - 140);
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    })();

    // ─── HERO SCROLL SUCK-IN ──────────────────────────────────
    (function() {
      const hero = document.getElementById('hero');
      if (!hero) return;
      function onScroll() {
        const p = Math.min(1, window.scrollY / hero!.offsetHeight);
        hero!.style.transform = `scale(${(1-p*0.03).toFixed(4)}) translateY(${(p*28).toFixed(1)}px)`;
        hero!.style.opacity = (1-p*0.35).toFixed(3);
      }
      window.addEventListener('scroll', onScroll, { passive: true, signal });
    })();

    // ─── DEPTH COUNTER + ZONE FLICKER ────────────────────────
    (function() {
      const depthEl = document.querySelector('[data-depth]') as HTMLElement | null;
      const labelEl = document.querySelector('[data-depth-label]') as HTMLElement | null;
      const lineEl = document.getElementById('descent-line');
      if (!depthEl) return;

      const ZONES = [
        { max: 0.08, label: 'SURFACE' }, { max: 0.28, label: 'TWILIGHT' },
        { max: 0.54, label: 'MIDNIGHT' }, { max: 0.82, label: 'ABYSSAL' }, { max: 1.01, label: 'HADAL' },
      ];
      let lastLabel = 'SURFACE';
      let flickerT: ReturnType<typeof setTimeout> | null = null;

      function flicker() {
        if (flickerT) return;
        depthEl!.classList.add('flicker');
        flickerT = setTimeout(() => { depthEl!.classList.remove('flicker'); flickerT = null; }, 210);
      }

      function onScroll() {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const p = Math.min(1, window.scrollY / max);
        document.documentElement.style.setProperty('--journey-progress', p.toFixed(3));
        depthEl!.textContent = String(Math.round(p*4000)).padStart(4,'0') + 'm';
        const z = ZONES.find(z => p <= z.max) || ZONES[ZONES.length-1];
        if (labelEl && z.label !== lastLabel) { lastLabel = z.label; labelEl.textContent = z.label; flicker(); }
        document.getElementById('cursor')?.setAttribute('data-zone', z.label.toLowerCase());
        if (lineEl) {
          if (p > 0.02) { lineEl.classList.add('visible'); lineEl.style.height = (p*100)+'%'; }
          else lineEl.classList.remove('visible');
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true, signal });
      onScroll();
    })();

    // ─── PROJECT HOVER ────────────────────────────────────────
    document.querySelectorAll<HTMLElement>('.log-entry').forEach(el => {
      el.addEventListener('mousemove', (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
      }, { signal });
    });

    // ─── PROJECT DEPTH COORDS ─────────────────────────────────
    (function() {
      const els = document.querySelectorAll<HTMLElement>('[data-le-depth]');
      if (!els.length) return;
      function update() {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const d = Math.round(Math.min(1, window.scrollY/max)*4000);
        els.forEach((el, i) => { el.textContent = '~'+(d+i*47)+'m'; });
      }
      window.addEventListener('scroll', update, { passive: true, signal });
      update();
    })();

    // ─── ARCHIVE BLUR-REVEAL + GLITCH-SCAN ───────────────────
    (function() {
      const cells = document.querySelectorAll<HTMLElement>('.archive-cell[data-reveal-blur]');
      if (!cells.length) return;

      cells.forEach((cell, i) => {
        const col = i % 3, row = Math.floor(i / 3);
        cell.style.transitionDelay = ((row*3+col)*0.12)+'s';
      });

      function runGlitch(cell: HTMLElement) {
        const target = parseInt(cell.dataset.count || '0', 10);
        const numEl = cell.querySelector<HTMLElement>('.rec-num');
        if (!numEl || target === 0) return;
        const safeNum = numEl;

        let gi = 0;
        function step() {
          if (gi < 2) {
            safeNum.textContent = String(Math.floor(Math.random()*89)+10);
            gi++;
            setTimeout(step, 55+Math.random()*45);
          } else {
            let start: number | null = null;
            const dur = 460;
            function up(ts: number) {
              if (!start) start = ts;
              const prog = Math.min((ts-start)/dur, 1);
              const e = prog<0.5 ? 2*prog*prog : 1-Math.pow(-2*prog+2, 2)/2;
              safeNum.textContent = String(Math.round(e*target)).padStart(2,'0');
              if (prog < 1) requestAnimationFrame(up);
            }
            requestAnimationFrame(up);
          }
        }
        step();
      }

      if (!('IntersectionObserver' in window)) {
        cells.forEach(c => { c.classList.add('in'); runGlitch(c); });
        return;
      }
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          e.target.classList.add('in');
          setTimeout(() => runGlitch(e.target as HTMLElement), 300);
          io.unobserve(e.target);
        });
      }, { threshold: 0.14 });
      cells.forEach(c => io.observe(c));
      observers.push(io);
    })();

    // ─── SCROLL REVEAL (vertical) ─────────────────────────────
    (function() {
      const els = document.querySelectorAll('[data-reveal]');
      if (!els.length || !('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('in')); return;
      }
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.1 });
      els.forEach(el => io.observe(el));
      observers.push(io);
    })();

    // ─── SCROLL REVEAL (horizontal) ───────────────────────────
    (function() {
      const els = document.querySelectorAll('[data-reveal-x]');
      if (!els.length || !('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('in')); return;
      }
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.08 });
      els.forEach(el => io.observe(el));
      observers.push(io);
    })();

    // ─── CUSTOM CURSOR ────────────────────────────────────────
    (function() {
      if (matchMedia('(pointer:coarse)').matches) {
        const c = document.getElementById('cursor');
        if (c) c.style.display = 'none';
        document.body.style.cursor = 'auto';
        return;
      }
      const cursor = document.getElementById('cursor');
      if (!cursor) return;
      let cx = -100, cy = -100, tx = -100, ty = -100;
      window.addEventListener('mousemove', (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; }, { signal });
      (function tick() {
        if (!cursorRunning) return;
        cx += (tx-cx)*0.82; cy += (ty-cy)*0.82;
        cursor.style.left = cx+'px'; cursor.style.top = cy+'px';
        requestAnimationFrame(tick);
      })();
      document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => cursor!.classList.add('link'), { signal });
        el.addEventListener('mouseleave', () => cursor!.classList.remove('link'), { signal });
      });
    })();

    // ─── EMAIL CURSOR BLINK ───────────────────────────────────
    (function() {
      const el = document.getElementById('email-cursor');
      if (!el || !('IntersectionObserver' in window)) return;
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            el.classList.add('visible');
            setTimeout(() => el.classList.remove('visible'), 4200);
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.5 });
      io.observe(el);
      observers.push(io);
    })();

    // ─── CLICK RIPPLE ─────────────────────────────────────────
    window.addEventListener('click', (e: MouseEvent) => {
      const r = document.createElement('div');
      r.className = 'ripple';
      r.style.left = e.clientX+'px'; r.style.top = e.clientY+'px';
      document.body.appendChild(r);
      setTimeout(() => r.remove(), 1700);
    }, { signal });

    return () => {
      introRunning = false;
      oceanRunning = false;
      cursorRunning = false;
      bubbleRunning = false;
      ac.abort();
      observers.forEach(io => io.disconnect());
    };
  }, []);

  return (
    <>
      <div id="intro">
        <canvas id="intro-canvas" />
        <div className="intro-panel" aria-hidden="false">
          <div className="intro-status">Connection Established</div>
          <div className="intro-brief">Auto descent into Lee Sangho&apos;s archive</div>
          <div className="intro-meter" aria-hidden="true"><span /></div>
        </div>
      </div>
      <div id="cursor" data-zone="surface" aria-hidden="true"><span className="cursor-glyph" /></div>
      <div id="descent-line" />
      <canvas id="ocean-canvas" />
      <canvas id="bubble-trail" />
      <div className="current-streams" aria-hidden="true" />
      <div className="overlay-vignette" />
      <div className="overlay-grain" />
      <div className="frame">
        <div className="fr-logo">
          ⌁ Lee Sangho<br />
          <span style={{ color: 'var(--muted)' }}>/ Deep Sea</span>
        </div>
        <nav className="fr-nav">
          <a href="#about">01 About</a>
          <a href="#projects">02 Projects</a>
          <a href="#topics">03 Archive</a>
          <a href="/blog">04 Blog ↗</a>
        </nav>
        <div className="fr-coord">
          N 36° 21′ 22″<br />
          E 127° 23′ 46″<br />
          <span style={{ color: 'var(--muted)' }}>Sangmyung · KR</span>
        </div>
        <div className="fr-depth">
          <span style={{ fontSize: '9px' }}>DEPTH</span>
          <span className="depth-num" data-depth="">0000m</span>
          <span data-depth-label="" style={{ fontSize: '9px' }}>SURFACE</span>
        </div>
      </div>
    </>
  );
}
