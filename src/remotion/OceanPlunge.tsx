import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';

const W = 1600;
const H = 900;

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => Easing.inOut(Easing.cubic)(clamp(value));
const range = (from: number, to: number, frame: number) => ease((frame - from) / (to - from));
const fadeOut = (from: number, to: number, frame: number) => 1 - range(from, to, frame);

const rand = (seed: number) => {
  const x = Math.sin(seed * 999.137) * 43758.5453;
  return x - Math.floor(x);
};

const wavePath = (frame: number, row: number, amplitude: number, yBase: number, travel: number) => {
  const points: string[] = [];
  for (let x = -80; x <= W + 80; x += 80) {
    const y =
      yBase +
      Math.sin(x * 0.009 + frame * travel + row * 0.73) * amplitude +
      Math.sin(x * 0.017 - frame * travel * 0.62 + row) * amplitude * 0.38;
    points.push(`${x.toFixed(0)},${y.toFixed(1)}`);
  }
  return `M ${points.join(' L ')}`;
};

const SurfaceWaves = ({ frame, light, plunge }: { frame: number; light: number; plunge: number }) => {
  const rows = Array.from({ length: 30 }, (_, i) => i);

  return (
    <svg height={H} style={{ position: 'absolute', inset: 0 }} viewBox={`0 0 ${W} ${H}`} width={W}>
      <defs>
        <linearGradient id="waterBody" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={`rgba(135, 247, 244, ${0.82 * light})`} />
          <stop offset="45%" stopColor={`rgba(12, 139, 151, ${0.52 + light * 0.24})`} />
          <stop offset="100%" stopColor={`rgba(1, 14, 25, ${0.9})`} />
        </linearGradient>
        <radialGradient cx="50%" cy="20%" id="surfaceSun" r="48%">
          <stop offset="0%" stopColor={`rgba(246, 255, 247, ${0.34 * light})`} />
          <stop offset="45%" stopColor={`rgba(145, 246, 242, ${0.14 * light})`} />
          <stop offset="100%" stopColor="rgba(145, 246, 242, 0)" />
        </radialGradient>
      </defs>

      <rect fill="url(#waterBody)" height={H} width={W} />
      <rect fill="url(#surfaceSun)" height={H} width={W} />

      {rows.map((row) => {
        const y = 150 + row * 18 + plunge * row * 3.4;
        const opacity = (0.06 + (row / rows.length) * 0.08) * light;
        return (
          <path
            d={wavePath(frame, row, 5.5 + row * 0.12 + plunge * 11, y, 0.034)}
            fill="none"
            key={row}
            opacity={opacity}
            stroke="rgba(238, 255, 250, 0.8)"
            strokeWidth={row < 6 ? 1.2 : 1}
          />
        );
      })}

      <path
        d={`${wavePath(frame, 19, 18 + plunge * 26, 430 - plunge * 250, 0.055)} L ${W + 80},${H} L -80,${H} Z`}
        fill={`rgba(4, 84, 96, ${0.18 + plunge * 0.34})`}
      />
    </svg>
  );
};

const LightBeams = ({ frame, amount }: { frame: number; amount: number }) => {
  return (
    <svg height={H} style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen' }} viewBox={`0 0 ${W} ${H}`} width={W}>
      {Array.from({ length: 9 }, (_, i) => {
        const x = 390 + i * 95 + Math.sin(frame * 0.018 + i) * 28;
        const w = 42 + rand(i + 4) * 34;
        return (
          <polygon
            fill={`rgba(140, 246, 247, ${amount * (0.05 + rand(i + 10) * 0.05)})`}
            key={i}
            points={`${x - w},-40 ${x + w},-40 ${x + w * 5},${H * 0.9} ${x - w * 5},${H * 0.9}`}
          />
        );
      })}
    </svg>
  );
};

const Splash = ({ frame, amount, plunge }: { frame: number; amount: number; plunge: number }) => {
  const cx = W / 2;
  const cy = 430 - plunge * 165;
  const rx = interpolate(amount, [0, 1], [80, 560]);
  const ry = interpolate(amount, [0, 1], [10, 82]);

  return (
    <svg height={H} style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen' }} viewBox={`0 0 ${W} ${H}`} width={W}>
      <ellipse
        cx={cx}
        cy={cy}
        fill="none"
        opacity={amount * Math.max(0, 0.68 - amount * 0.32)}
        rx={rx}
        ry={ry}
        stroke="rgba(242,255,253,0.76)"
        strokeWidth={4}
      />
      {Array.from({ length: 54 }, (_, i) => {
        const a = (i / 54) * Math.PI * 2;
        const spread = 96 + rand(i + 91) * 96;
        const x = cx + Math.cos(a) * spread * amount * 3;
        const y = cy + Math.sin(a) * spread * amount * 0.42 - amount * 82;
        const r = 1.8 + rand(i + 9) * 5 * (1 - amount * 0.45);
        return (
          <circle
            cx={x}
            cy={y}
            fill="rgba(244,255,252,0.58)"
            key={i}
            opacity={amount * Math.max(0, 0.44 - amount * 0.2)}
            r={r}
          />
        );
      })}
      <rect fill={`rgba(245,255,255,${amount * 0.11})`} height={H} width={W} />
    </svg>
  );
};

const Bubbles = ({ frame, amount }: { frame: number; amount: number }) => {
  return (
    <svg height={H} style={{ position: 'absolute', inset: 0 }} viewBox={`0 0 ${W} ${H}`} width={W}>
      {Array.from({ length: 24 }, (_, i) => {
        const baseX = rand(i + 20) * W;
        const speed = 1.5 + rand(i + 30) * 3.2;
        const drift = Math.sin(frame * 0.028 + i) * (24 + rand(i) * 38);
        const y = ((rand(i + 40) * H + frame * speed) % (H + 180)) - 120;
        const r = 9 + rand(i + 50) * 34;
        return (
          <circle
            cx={baseX + drift}
            cy={y}
            fill={`rgba(155, 244, 246, ${amount * 0.035})`}
            key={i}
            opacity={amount * (0.45 + rand(i + 70) * 0.3)}
            r={r}
            stroke={`rgba(235, 255, 252, ${amount * 0.20})`}
            strokeWidth={1.2}
          />
        );
      })}
    </svg>
  );
};

const Grain = ({ amount }: { amount: number }) => {
  return (
    <svg height={H} style={{ position: 'absolute', inset: 0, mixBlendMode: 'soft-light' }} viewBox={`0 0 ${W} ${H}`} width={W}>
      {Array.from({ length: 260 }, (_, i) => (
        <circle
          cx={rand(i + 100) * W}
          cy={rand(i + 300) * H}
          fill="white"
          key={i}
          opacity={amount * (0.015 + rand(i) * 0.045)}
          r={0.5 + rand(i + 200) * 1.4}
        />
      ))}
    </svg>
  );
};

export const OceanPlunge = () => {
  const frame = useCurrentFrame();
  const plunge = range(52, 108, frame);
  const dive = range(70, 190, frame);
  const surfaceLight = fadeOut(92, 166, frame);
  const splash = range(45, 69, frame) * fadeOut(76, 122, frame);
  const beams = range(58, 112, frame) * fadeOut(178, 226, frame);
  const bubbleAmount = range(82, 142, frame) * fadeOut(198, 238, frame);
  const title = range(118, 142, frame) * fadeOut(218, 244, frame);

  return (
    <AbsoluteFill style={{ backgroundColor: '#020711', overflow: 'hidden' }}>
      <SurfaceWaves frame={frame} light={surfaceLight} plunge={plunge} />
      <Splash amount={splash} frame={frame} plunge={plunge} />
      <LightBeams amount={beams} frame={frame} />
      <Bubbles amount={bubbleAmount} frame={frame} />
      <Grain amount={0.55 + dive * 0.45} />

      <AbsoluteFill
        style={{
          background:
            `radial-gradient(ellipse at 50% 42%, rgba(18,80,92,${0.16 + surfaceLight * 0.1}), transparent 44%), ` +
            `linear-gradient(180deg, rgba(0,0,0,${dive * 0.04}) 0%, rgba(1,5,12,${0.04 + dive * 0.58}) 100%)`,
        }}
      />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          color: 'white',
          display: 'flex',
          fontFamily: 'Outfit, Pretendard, Arial, sans-serif',
          justifyContent: 'center',
          opacity: title,
          transform: `translateY(${interpolate(title, [0, 1], [18, 0])}px) scale(${1 + (1 - title) * 0.05})`,
        }}
      >
        <div
          style={{
            filter: `blur(${Math.max(0, (1 - title) * 10)}px) drop-shadow(0 36px 90px rgba(0,0,0,.5))`,
            fontSize: 112,
            fontWeight: 850,
            letterSpacing: '-0.055em',
            lineHeight: 0.92,
            textAlign: 'center',
          }}
        >
          Lee Sangho
          <div
            style={{
              color: 'rgba(205,235,238,.42)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: '0.32em',
              marginTop: 34,
              textTransform: 'uppercase',
            }}
          >
            Notes from the deep sea
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
