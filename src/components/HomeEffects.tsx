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
      const oceanCanvas = document.getElementById('ocean-canvas') as HTMLCanvasElement | null;
      if (!intro || !canvas) return;
      const introEl = intro;
      const canvasEl = canvas;

      if (sessionStorage.getItem('introSeen') === '1') {
        introEl.style.display = 'none';
        if (oceanCanvas) oceanCanvas.style.opacity = '1';
        showFrameUI();
        return;
      }

      document.body.style.overflow = 'hidden';
      if (oceanCanvas) oceanCanvas.style.opacity = '0';
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

      const SC = isMobile ? 18 : 34;
      const PLANKTON = Array.from({ length: SC }, () => ({
        x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
        r: 0.3 + Math.random() * 0.82,
        vy: -(0.07 + Math.random() * 0.18), vx: (Math.random() - 0.5) * 0.09,
        alpha: 0.05 + Math.random() * 0.15, phase: Math.random() * Math.PI * 2,
      }));

      const INTRO_BUBBLES = Array.from({ length: isMobile ? 8 : 14 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: 6 + Math.random() * 18,
        speed: 0.06 + Math.random() * 0.16,
        drift: (Math.random() - 0.5) * 0.45,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.10 + Math.random() * 0.18,
      }));

      const TOTAL = 4200;
      const t0 = performance.now();
      let t = 0;

      function ease(x: number) { return x < 0.5 ? 2*x*x : 1 - Math.pow(-2*x+2, 2)/2; }
      function ramp(s: number, e: number, el: number) { return Math.max(0, Math.min(1, (el-s)/(e-s))); }

      function frame(now: number) {
        if (!introRunning) return;
        t += 0.007;
        const el = now - t0;
        const dive = ease(ramp(300, 3200, el));

        ctx.clearRect(0, 0, W, H);

        const fi = ease(ramp(0, 700, el));
        const plunge = ease(ramp(820, 1900, el));
        const diveDark = ease(ramp(1250, 3400, el));
        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, `oklch(${(0.09 + fi * 0.26 - diveDark * 0.18).toFixed(3)} ${(0.02 + fi * 0.06).toFixed(3)} ${198 + diveDark * 16})`);
        bg.addColorStop(0.38, `oklch(${(0.055 + fi * 0.16 - diveDark * 0.14).toFixed(3)} ${(0.018 + fi * 0.05).toFixed(3)} ${205 + diveDark * 16})`);
        bg.addColorStop(1, `oklch(${(0.016 + fi * 0.07 - diveDark * 0.05).toFixed(3)} ${(0.01 + fi * 0.025).toFixed(3)} ${228 + diveDark * 18})`);
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

        const surface = ease(ramp(0, 1400, el)) * (1 - ease(ramp(1350, 2400, el)));
        if (surface > 0.01) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          const horizonY = H * (0.24 - plunge * 0.12);
          const surfaceG = ctx.createLinearGradient(0, horizonY - 140, 0, horizonY + 120);
          surfaceG.addColorStop(0, `oklch(0.98 0.02 195 / ${surface * 0.18})`);
          surfaceG.addColorStop(0.42, `oklch(0.88 0.07 192 / ${surface * 0.28})`);
          surfaceG.addColorStop(1, 'transparent');
          ctx.fillStyle = surfaceG;
          ctx.beginPath();
          ctx.moveTo(0, horizonY);
          for (let x = 0; x <= W; x += 18) {
            const y = horizonY + Math.sin(x * 0.011 + t * 7.5) * 7 + Math.sin(x * 0.024 - t * 4.6) * 3;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(W, horizonY + 130);
          ctx.lineTo(0, horizonY + 130);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = `oklch(0.96 0.02 194 / ${surface * 0.38})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, horizonY + 2);
          for (let x = 0; x <= W; x += 22) {
            const y = horizonY + Math.sin(x * 0.013 + t * 8.2) * 5;
            ctx.lineTo(x, y);
          }
          ctx.stroke();
          ctx.restore();
        }

        if (plunge > 0.01) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          const bandY = H * (0.18 + plunge * 0.68);
          const band = ctx.createLinearGradient(0, bandY - H * 0.12, 0, bandY + H * 0.18);
          band.addColorStop(0, `oklch(0.96 0.02 194 / ${plunge * 0.02})`);
          band.addColorStop(0.42, `oklch(0.92 0.05 192 / ${plunge * 0.18})`);
          band.addColorStop(0.75, `oklch(0.78 0.08 196 / ${plunge * 0.06})`);
          band.addColorStop(1, 'transparent');
          ctx.fillStyle = band;
          ctx.beginPath();
          ctx.moveTo(0, bandY - H * 0.12);
          for (let x = 0; x <= W; x += 20) {
            const y = bandY + Math.sin(x * 0.014 + t * 12) * (10 + plunge * 10);
            ctx.lineTo(x, y);
          }
          ctx.lineTo(W, H);
          ctx.lineTo(0, H);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        const si = ease(ramp(1800, 3600, el));
        if (si > 0.01) {
          for (const s of PLANKTON) {
            s.y += s.vy; s.x += s.vx + Math.sin(t*0.6 + s.phase)*0.11;
            if (s.y < -4) { s.y = H+4; s.x = Math.random()*W; }
            if (s.x < -4) s.x = W+4; if (s.x > W+4) s.x = -4;
            const a = s.alpha * si;
            if (a < 0.01) continue;
            ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
            ctx.fillStyle = `oklch(0.88 0.04 205 / ${a})`; ctx.fill();
          }
        }

        const bubbleIn = ease(ramp(1550, 3400, el));
        if (bubbleIn > 0.01) {
          ctx.save();
          for (const b of INTRO_BUBBLES) {
            const drift = (el * 0.00004 * b.speed * H) % 1;
            const x = b.x * W + Math.sin(t * 1.6 + b.phase) * (12 + b.r * 0.35) + b.drift * 24;
            const y = ((b.y - drift + 1) % 1) * H;
            const rr = b.r * (0.86 + diveDark * 0.38);
            const a = b.alpha * bubbleIn * (0.28 + diveDark * 0.72);
            ctx.beginPath();
            ctx.arc(x, y, rr, 0, Math.PI * 2);
            ctx.fillStyle = `oklch(0.78 0.10 195 / ${a * 0.14})`; ctx.fill();
            ctx.strokeStyle = `oklch(0.92 0.05 198 / ${a})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
          ctx.restore();
        }

        const depthShade = ctx.createLinearGradient(0, 0, 0, H);
        depthShade.addColorStop(0, `oklch(0.02 0.01 230 / ${0.02 + diveDark * 0.02})`);
        depthShade.addColorStop(0.58, `oklch(0.02 0.01 230 / ${0.05 + diveDark * 0.08})`);
        depthShade.addColorStop(1, `oklch(0.02 0.01 230 / ${0.16 + diveDark * 0.18})`);
        ctx.fillStyle = depthShade;
        ctx.fillRect(0, 0, W, H);

        const fo = ease(ramp(3500, 4200, el));
        if (fo > 0.01) introEl.style.opacity = (1-fo).toFixed(3);

        if (el >= TOTAL) {
          introEl.classList.add('done');
          document.body.style.overflow = '';
          if (oceanCanvas) oceanCanvas.style.opacity = '1';
          sessionStorage.setItem('introSeen', '1');
          showFrameUI();
          setTimeout(() => introEl.remove(), 400);
          return;
        }
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
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
      <div id="intro"><canvas id="intro-canvas" /></div>
      <div id="cursor" data-zone="surface" aria-hidden="true"><span className="cursor-glyph" /></div>
      <div id="descent-line" />
      <canvas id="ocean-canvas" />
      <canvas id="bubble-trail" />
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
