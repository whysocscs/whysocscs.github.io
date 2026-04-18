'use client';
import { useEffect } from 'react';

export default function HomeEffects() {
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--breathe-y',
      window.innerWidth < 768 ? '-2px' : '-5px',
    );
    sessionStorage.removeItem('introSeen');

    const ac = new AbortController();
    const { signal } = ac;
    const observers: IntersectionObserver[] = [];
    let introRunning = true;
    let oceanRunning = true;
    let cursorRunning = true;

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

      const SC = isMobile ? 20 : 50;
      const SNOW = Array.from({ length: SC }, () => ({
        x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
        r: 0.3 + Math.random() * 0.82,
        vy: -(0.07 + Math.random() * 0.18), vx: (Math.random() - 0.5) * 0.09,
        alpha: 0.05 + Math.random() * 0.15, phase: Math.random() * Math.PI * 2,
      }));

      const RAYS = Array.from({ length: 5 }, () => ({
        x: 0.30 + Math.random() * 0.40 + (Math.random() - 0.5) * 0.05,
        w: 0.013 + Math.random() * 0.020,
        speed: 0.05 + Math.random() * 0.09,
        phase: Math.random() * Math.PI * 2,
        b: 0.45 + Math.random() * 0.55,
      }));

      const oc = document.createElement('canvas');
      const TOTAL = 5800;
      const t0 = performance.now();
      let t = 0;

      function ease(x: number) { return x < 0.5 ? 2*x*x : 1 - Math.pow(-2*x+2, 2)/2; }
      function ramp(s: number, e: number, el: number) { return Math.max(0, Math.min(1, (el-s)/(e-s))); }

      function frame(now: number) {
        if (!introRunning) return;
        t += 0.007;
        const el = now - t0;

        ctx.clearRect(0, 0, W, H);

        const fi = ease(ramp(0, 950, el));
        const sh = isMobile ? ease(ramp(300, 900, el)) * 0.036 : 0;
        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, `oklch(${(0.001 + fi*0.145 + sh).toFixed(3)} ${(fi*0.072).toFixed(3)} 210)`);
        bg.addColorStop(1, `oklch(${(0.001 + fi*0.048).toFixed(3)} ${(fi*0.028).toFixed(3)} 228)`);
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

        const ri = ease(ramp(800, 2300, el));
        if (ri > 0.01) {
          ctx.save(); ctx.globalCompositeOperation = 'lighter';
          for (const r of RAYS) {
            const rx = (r.x + Math.sin(t * r.speed + r.phase) * 0.055) * W;
            const w = r.w * W, bW = w * 5, a = ri * r.b * 0.052;
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

        const si = ease(ramp(3000, 4500, el));
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

        const tv = ease(ramp(2000, 2650, el));
        const tc = ease(ramp(2250, 3500, el));
        if (tv > 0.01) {
          const cx = W*0.5, cy = H*0.5 - 36;
          const fs = Math.min(W*0.11, 118);
          if (oc.width !== W*DPR) { oc.width = W*DPR; oc.height = H*DPR; }
          const ox = oc.getContext('2d')!;
          ox.clearRect(0, 0, oc.width, oc.height);
          ox.setTransform(DPR, 0, 0, DPR, 0, 0);
          ox.font = `300 italic ${fs}px 'Fraunces', Georgia, serif`;
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

        const sv = ease(ramp(3500, 4500, el));
        if (sv > 0.01) {
          const cx = W*0.5, cy = H*0.5 - 36, fs = Math.min(W*0.11, 118);
          ctx.font = `300 ${Math.min(W*0.021, 12)}px 'JetBrains Mono', monospace`;
          ctx.textAlign = 'center';
          ctx.fillStyle = `oklch(0.52 0.025 215 / ${sv})`;
          ctx.fillText('NOTES FROM THE DEEP SEA', cx, cy + fs*0.72 + 22);
        }

        const hv = ease(ramp(4600, 5200, el));
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

        const fo = ease(ramp(5000, 5800, el));
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
        cx += (tx-cx)*0.22; cy += (ty-cy)*0.22;
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
      ac.abort();
      observers.forEach(io => io.disconnect());
    };
  }, []);

  return (
    <>
      <div id="intro"><canvas id="intro-canvas" /></div>
      <div id="cursor" />
      <div id="descent-line" />
      <canvas id="ocean-canvas" />
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
