import React, { useEffect, useRef } from 'react';

/**
 * Visual-First Live Molecular Interaction & Pathway Monitor.
 * Zero text walls: renders a 60 FPS 2D molecular collision/binding canvas + compact node cascade.
 */
const ChamberTelemetryScreen = ({
  title = 'LIVE INTERACTION',
  accentColor = '#22d3ee',
  isRunning = false,
  isComplete = false,
  progress = 0,
  elapsedSec = 0,
  o2Level = 21,
  morphogenLevel = 65,
  tempC = 37.0,
  phLevel = 7.4,
  purityGrade = 'S',
  activeTags = [], // e.g. ['MSC', 'VEGF', 'Col-I', 'Ca²⁺', 'PO₄']
  steps = [],      // [{ id, label, progress: 0..100, active: bool, done: bool, color }]
}) => {
  const canvasRef = useRef(null);
  const stateRef = useRef({ isRunning, isComplete, progress, o2Level, morphogenLevel, tempC, phLevel, accentColor, activeTags });

  useEffect(() => {
    stateRef.current = { isRunning, isComplete, progress, o2Level, morphogenLevel, tempC, phLevel, accentColor, activeTags };
  }, [isRunning, isComplete, progress, o2Level, morphogenLevel, tempC, phLevel, accentColor, activeTags]);

  // 60 FPS Live Molecular Interaction Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles = Array.from({ length: 28 }, (_, i) => {
      const kind = i < 9 ? 'cell' : i < 16 ? 'morphogen' : i < 22 ? 'ion' : 'o2';
      return {
        kind,
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.004,
        vy: kind === 'o2' ? -0.004 - Math.random() * 0.004 : (Math.random() - 0.5) * 0.004,
        r: kind === 'cell' ? 9 : kind === 'morphogen' ? 4.5 : 3.2,
        phase: Math.random() * Math.PI * 2,
      };
    });

    const flashes = [];
    let rafId;

    const render = () => {
      rafId = requestAnimationFrame(render);
      const w = (canvas.width = canvas.clientWidth || 300);
      const h = (canvas.height = canvas.clientHeight || 200);
      const s = stateRef.current;
      const t = performance.now() * 0.001;
      const prog = Math.max(0, Math.min(1, s.progress / 100));

      ctx.fillStyle = '#040812';
      ctx.fillRect(0, 0, w, h);

      // Subtle bio-grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)';
      ctx.lineWidth = 1;
      for (let gx = 24; gx < w; gx += 28) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = 24; gy < h; gy += 28) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      const cx = w * 0.5;
      const cy = h * 0.5;

      // Collagen Triple Helix Strands weaving across center when progress > 12%
      if (prog > 0.12) {
        const strandCount = 3;
        const colors = ['#f59e0b', '#fbbf24', '#38bdf8'];
        for (let st = 0; st < strandCount; st++) {
          ctx.beginPath();
          ctx.strokeStyle = colors[st];
          ctx.globalAlpha = 0.25 + prog * 0.45;
          ctx.lineWidth = 1.8;
          for (let px = w * 0.15; px <= w * 0.85; px += 6) {
            const norm = (px - w * 0.15) / (w * 0.7);
            const py = cy + Math.sin(norm * Math.PI * 5 + t * 2 + (st * Math.PI * 2) / 3) * (16 - prog * 6);
            if (px === w * 0.15) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      // Angiogenic Capillary Sprouts when progress > 28%
      if (prog > 0.28) {
        const branches = 5;
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.6;
        for (let b = 0; b < branches; b++) {
          const ang = (b / branches) * Math.PI * 2 + 0.3;
          const len = Math.min(w, h) * 0.34 * Math.min(1, (prog - 0.25) / 0.55);
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(ang) * (w * 0.42), cy + Math.sin(ang) * (h * 0.42));
          ctx.quadraticCurveTo(
            cx + Math.cos(ang + 0.3) * len * 0.6,
            cy + Math.sin(ang + 0.3) * len * 0.6,
            cx + Math.cos(ang) * (w * 0.42 - len),
            cy + Math.sin(ang) * (h * 0.42 - len)
          );
          ctx.stroke();
        }
      }

      // Update & Draw Particles + Live Binding Interactions
      const speedMult = s.isRunning ? 1 + (s.morphogenLevel / 100) * 0.8 : 0.35;
      const attract = prog * 0.0018;

      particles.forEach((p, idx) => {
        if (p.kind === 'o2') {
          p.y += p.vy * (s.o2Level / 21);
          p.x += Math.sin(t * 3 + p.phase) * 0.001;
          if (p.y < 0.04) {
            p.y = 0.96;
            p.x = 0.15 + Math.random() * 0.7;
          }
        } else {
          p.x += p.vx * speedMult + (0.5 - p.x) * attract;
          p.y += p.vy * speedMult + (0.5 - p.y) * attract;
          if (p.x < 0.08 || p.x > 0.92) p.vx *= -1;
          if (p.y < 0.1 || p.y > 0.9) p.vy *= -1;
        }

        const px = p.x * w;
        const py = p.y * h;

        if (p.kind === 'cell') {
          ctx.beginPath();
          ctx.arc(px, py, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `${s.accentColor}30`;
          ctx.fill();
          ctx.strokeStyle = s.accentColor;
          ctx.lineWidth = 1.4;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(px, py, p.r * 0.42, 0, Math.PI * 2);
          ctx.fillStyle = '#f8fafc';
          ctx.fill();
        } else if (p.kind === 'morphogen') {
          ctx.beginPath();
          ctx.arc(px, py, p.r, 0, Math.PI * 2);
          ctx.fillStyle = '#f43f5e';
          ctx.fill();

          // Check proximity to a cell -> draw binding beam + spark!
          const targetCell = particles[idx % 9];
          const tx = targetCell.x * w;
          const ty = targetCell.y * h;
          const dist = Math.hypot(px - tx, py - ty);
          if (dist < 48 && s.isRunning) {
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(tx, ty);
            ctx.strokeStyle = 'rgba(244, 63, 94, 0.55)';
            ctx.lineWidth = 1.1;
            ctx.stroke();
            if (dist < 18 && Math.random() < 0.06) {
              const tag = s.activeTags[idx % Math.max(1, s.activeTags.length)] || 'BIND';
              flashes.push({ x: tx, y: ty, r: 4, alpha: 1, color: '#22d3ee', tag });
            }
          }
        } else if (p.kind === 'ion') {
          ctx.beginPath();
          ctx.arc(px, py, p.r, 0, Math.PI * 2);
          ctx.fillStyle = idx % 2 === 0 ? '#e2e8f0' : '#fb923c';
          ctx.fill();
          if (prog > 0.45 && Math.random() < 0.008) {
            flashes.push({ x: px, y: py, r: 3, alpha: 0.9, color: '#fbbf24', tag: 'Ca·P' });
          }
        } else if (s.o2Level > 3) {
          ctx.beginPath();
          ctx.arc(px, py, 2.4, 0, Math.PI * 2);
          ctx.strokeStyle = '#22d3ee';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Draw Binding Flashes & Micro-Tags
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        f.r += 0.9;
        f.alpha -= 0.035;
        if (f.alpha <= 0) {
          flashes.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.strokeStyle = f.color;
        ctx.globalAlpha = f.alpha;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(f.tag, f.x + 8, f.y - 6);
        ctx.globalAlpha = 1;
      }

      // Center Mature Organ Holo-Ring when complete
      if (s.isComplete) {
        ctx.beginPath();
        ctx.arc(cx, cy, 26 + Math.sin(t * 3) * 3, 0, Math.PI * 2);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    };

    render();
    return () => cancelAnimationFrame(rafId);
  }, []);

  const mins = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
  const secs = String(Math.floor(elapsedSec % 60)).padStart(2, '0');

  const gradeColors = {
    S: 'bg-emerald-500/20 border-emerald-400 text-emerald-300',
    A: 'bg-cyan-500/20 border-cyan-400 text-cyan-300',
    B: 'bg-amber-500/20 border-amber-400 text-amber-300',
  };

  return (
    <div className="flex flex-col h-full bg-[#050912] border-l border-slate-800/90 text-slate-200 font-mono select-none overflow-hidden">
      {/* Compact Header */}
      <div className="px-3 py-1.5 bg-[#070d1a] border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isComplete
                ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
                : isRunning
                ? 'bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]'
                : 'bg-slate-600'
            }`}
          />
          <span className="text-[9.5px] font-black tracking-wider text-white uppercase truncate">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`px-1.5 py-0.5 rounded border text-[8.5px] font-black ${gradeColors[purityGrade] || gradeColors.S}`}>
            GRADE {purityGrade}
          </span>
          <span className="text-[10px] font-black text-cyan-300 tabular-nums">
            {mins}:{secs}
          </span>
        </div>
      </div>

      {/* Compact Numeric Vitals Strip */}
      <div className="grid grid-cols-4 gap-1 px-2 py-1.5 bg-[#060b15] border-b border-slate-800/80 shrink-0 text-center">
        <div className="py-1 rounded bg-[#0a1222] border border-slate-800">
          <div className="text-[7px] text-slate-400">TEMP</div>
          <div className={`text-[10px] font-black tabular-nums ${tempC > 40 || tempC < 34 ? 'text-rose-400' : 'text-emerald-300'}`}>
            {tempC.toFixed(1)}°C
          </div>
        </div>
        <div className="py-1 rounded bg-[#0a1222] border border-slate-800">
          <div className="text-[7px] text-slate-400">pH</div>
          <div className={`text-[10px] font-black tabular-nums ${phLevel < 7.0 || phLevel > 7.7 ? 'text-rose-400' : 'text-cyan-300'}`}>
            {phLevel.toFixed(1)}
          </div>
        </div>
        <div className="py-1 rounded bg-[#0a1222] border border-slate-800">
          <div className="text-[7px] text-slate-400">pO₂</div>
          <div className={`text-[10px] font-black tabular-nums ${o2Level < 12 ? 'text-rose-400' : 'text-cyan-300'}`}>
            {o2Level}%
          </div>
        </div>
        <div className="py-1 rounded bg-[#0a1222] border border-slate-800">
          <div className="text-[7px] text-slate-400">GROWTH</div>
          <div className="text-[10px] font-black tabular-nums" style={{ color: accentColor }}>
            {Math.round(progress)}%
          </div>
        </div>
      </div>

      {/* 60 FPS Live Molecular Interaction Canvas */}
      <div className="flex-1 min-h-[140px] relative border-b border-slate-800/80">
        <canvas ref={canvasRef} className="w-full h-full block" />
        <div className="absolute top-1.5 left-2 px-1.5 py-0.5 rounded bg-black/55 border border-white/10 text-[7.5px] text-cyan-300 uppercase tracking-wider pointer-events-none">
          LIVE MOLECULAR INTERACTIONS
        </div>
      </div>

      {/* Compact Visual Pathway Nodes (Zero Text Walls) */}
      <div className="p-2 bg-[#060b15] shrink-0">
        <div className="grid grid-cols-2 gap-1.5">
          {steps.map((step, i) => {
            const pct = Math.max(0, Math.min(100, Math.round(step.progress || 0)));
            const col = step.done ? '#10b981' : step.color || accentColor;
            return (
              <div
                key={step.id || i}
                className={`px-2 py-1 rounded border ${
                  step.active
                    ? 'bg-[#0b162a] border-cyan-500/60'
                    : step.done
                    ? 'bg-emerald-950/25 border-emerald-500/35'
                    : 'bg-[#070c16] border-slate-800/80 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between gap-1 text-[8px]">
                  <span className="font-bold text-slate-100 truncate">{step.label}</span>
                  <span className="font-black tabular-nums shrink-0" style={{ color: col }}>
                    {pct}%
                  </span>
                </div>
                <div className="h-1 bg-slate-900 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full transition-all duration-300"
                    style={{ width: `${pct}%`, backgroundColor: col }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChamberTelemetryScreen;
