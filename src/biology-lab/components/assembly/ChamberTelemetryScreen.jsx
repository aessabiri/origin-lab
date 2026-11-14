import React, { useEffect, useRef } from 'react';

/**
 * Confocal Microscopy, Live Histology & Physiological Oscilloscope Monitor.
 * Zero text walls: renders real-time organelle-level interactions, stage-aware
 * tissue histology (e.g. Haversian osteons, pulsing myocardium, alveoli, neural nets),
 * and an organ-specific 60 FPS physiological waveform.
 */
const ChamberTelemetryScreen = ({
  title = 'LIVE INTERACTION',
  organType = 'organ', // 'bone' | 'heart' | 'lungs' | 'brain' | 'liver' | 'kidneys' | 'intestines' | 'muscular_system'
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
  steps = [],
}) => {
  const scopeCanvasRef = useRef(null);
  const microCanvasRef = useRef(null);
  const stateRef = useRef({
    organType,
    isRunning,
    isComplete,
    progress,
    o2Level,
    morphogenLevel,
    tempC,
    phLevel,
    accentColor,
  });

  useEffect(() => {
    stateRef.current = {
      organType,
      isRunning,
      isComplete,
      progress,
      o2Level,
      morphogenLevel,
      tempC,
      phLevel,
      accentColor,
    };
  }, [organType, isRunning, isComplete, progress, o2Level, morphogenLevel, tempC, phLevel, accentColor]);

  // 1. 60 FPS Live Physiological Oscilloscope Strip
  useEffect(() => {
    const canvas = scopeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const samples = new Array(140).fill(0);
    let rafId;

    const sampleWaveform = (type, t, amp) => {
      if (type === 'heart') {
        const phase = (t * 1.2) % 1;
        // P-QRS-T ECG complex
        if (phase > 0.1 && phase < 0.18) return Math.sin(((phase - 0.1) / 0.08) * Math.PI) * 0.22 * amp;
        if (phase > 0.24 && phase < 0.27) return -0.18 * amp;
        if (phase >= 0.27 && phase < 0.31) return Math.sin(((phase - 0.27) / 0.04) * Math.PI) * 0.95 * amp;
        if (phase >= 0.31 && phase < 0.35) return -0.32 * amp;
        if (phase > 0.45 && phase < 0.62) return Math.sin(((phase - 0.45) / 0.17) * Math.PI) * 0.34 * amp;
        return (Math.random() - 0.5) * 0.03;
      }
      if (type === 'lungs') {
        return (Math.sin(t * 1.8) * 0.55 + Math.sin(t * 3.6) * 0.15) * amp;
      }
      if (type === 'brain' || type === 'nervous_system') {
        return (
          (Math.sin(t * 17) * 0.28 +
            Math.sin(t * 31) * 0.22 +
            (Math.sin(t * 5.3) > 0.92 ? 0.55 : 0)) *
          amp
        );
      }
      if (type === 'bone') {
        return (Math.sin(t * 4.5) * 0.35 + Math.cos(t * 9.2) * 0.18 + (Math.random() - 0.5) * 0.08) * amp;
      }
      return (Math.sin(t * 3.8) * 0.4 + Math.sin(t * 7.6) * 0.18) * amp;
    };

    const drawScope = () => {
      rafId = requestAnimationFrame(drawScope);
      const w = (canvas.width = canvas.clientWidth || 300);
      const h = (canvas.height = canvas.clientHeight || 42);
      const s = stateRef.current;
      const t = performance.now() * 0.001;
      const amp = s.isComplete ? 1.0 : s.isRunning ? 0.35 + (s.progress / 100) * 0.65 : 0.12;

      samples.shift();
      samples.push(sampleWaveform(s.organType, t, amp));

      ctx.fillStyle = '#030711';
      ctx.fillRect(0, 0, w, h);

      // Baseline
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.5);
      ctx.lineTo(w, h * 0.5);
      ctx.stroke();

      // Glowing Waveform
      ctx.beginPath();
      for (let i = 0; i < samples.length; i++) {
        const x = (i / (samples.length - 1)) * w;
        const y = h * 0.52 - samples[i] * (h * 0.4);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = s.isComplete ? '#10b981' : s.accentColor;
      ctx.lineWidth = 1.6;
      ctx.shadowColor = s.isComplete ? '#10b981' : s.accentColor;
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    drawScope();
    return () => cancelAnimationFrame(rafId);
  }, []);

  // 2. 60 FPS Confocal Microscopy & Stage-Aware Histology Canvas
  useEffect(() => {
    const canvas = microCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cells = Array.from({ length: 8 }, (_, i) => ({
      x: 0.2 + (i % 4) * 0.2,
      y: 0.28 + Math.floor(i / 4) * 0.42,
      vx: (Math.random() - 0.5) * 0.0022,
      vy: (Math.random() - 0.5) * 0.0022,
      r: 14 + (i % 3) * 2,
      rot: Math.random() * Math.PI * 2,
    }));

    const ligands = Array.from({ length: 14 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0045,
      vy: (Math.random() - 0.5) * 0.0045,
    }));

    const flashes = [];
    let rafId;

    const drawOrganelleCell = (cx, cy, r, rot, accent) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);

      // Translucent Plasma Membrane
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = `${accent}22`;
      ctx.fill();
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.3;
      ctx.stroke();

      // Rough ER arcs
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      for (let e = 0; e < 2; e++) {
        ctx.beginPath();
        ctx.arc(0, 0, r * (0.48 + e * 0.14), e * 1.4, e * 1.4 + Math.PI * 0.9);
        ctx.stroke();
      }

      // Mitochondria capsules
      ctx.fillStyle = '#fb923c';
      for (let m = 0; m < 3; m++) {
        const ma = (m / 3) * Math.PI * 2 + 0.5;
        ctx.beginPath();
        ctx.ellipse(Math.cos(ma) * r * 0.58, Math.sin(ma) * r * 0.58, 2.6, 1.3, ma, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nucleus + Nucleolus
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.34, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(129, 140, 248, 0.45)';
      ctx.fill();
      ctx.strokeStyle = '#a5b4fc';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(r * 0.08, -r * 0.06, r * 0.13, 0, Math.PI * 2);
      ctx.fillStyle = '#f8fafc';
      ctx.fill();

      ctx.restore();
    };

    const drawHistology = (w, h, t, s) => {
      const cx = w * 0.5;
      const cy = h * 0.5;
      const alpha = Math.min(1, Math.max(0, (s.progress - 55) / 40));
      ctx.save();
      ctx.globalAlpha = alpha;

      if (s.organType === 'bone') {
        // Concentric Haversian Osteons + Central Canal + Canaliculi
        const osteons = [
          [cx, cy, 38],
          [cx - 64, cy - 34, 26],
          [cx + 66, cy + 30, 28],
          [cx - 56, cy + 44, 22],
          [cx + 58, cy - 42, 23],
        ];
        osteons.forEach(([ox, oy, orad]) => {
          for (let ring = 1; ring <= 4; ring++) {
            ctx.beginPath();
            ctx.arc(ox, oy, (orad * ring) / 4, 0, Math.PI * 2);
            ctx.strokeStyle = ring === 4 ? '#f8fafc' : 'rgba(226, 232, 240, 0.42)';
            ctx.lineWidth = ring === 4 ? 1.5 : 1;
            ctx.stroke();
          }
          // Radiating Canaliculi
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.32)';
          ctx.lineWidth = 0.8;
          for (let c = 0; c < 12; c++) {
            const a = (c / 12) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(ox + Math.cos(a) * 5, oy + Math.sin(a) * 5);
            ctx.lineTo(ox + Math.cos(a) * orad, oy + Math.sin(a) * orad);
            ctx.stroke();
          }
          // Central Haversian Blood Vessel
          ctx.beginPath();
          ctx.arc(ox, oy, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ef4444';
          ctx.fill();
        });
      } else if (s.organType === 'heart') {
        // Pulsing Myocardial Syncytium + Intercalated Discs
        const pulse = 1 + Math.pow(Math.max(0, Math.sin(t * 3.8)), 6) * 0.08;
        ctx.translate(cx, cy);
        ctx.scale(pulse, pulse);
        ctx.translate(-cx, -cy);
        for (let row = -3; row <= 3; row++) {
          ctx.beginPath();
          ctx.strokeStyle = '#fb7185';
          ctx.lineWidth = 4;
          for (let x = w * 0.14; x <= w * 0.86; x += 8) {
            const y = cy + row * 19 + Math.sin(x * 0.04 + row) * 6;
            if (x === w * 0.14) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } else if (s.organType === 'lungs') {
        // Breathing Alveolar Cluster
        const breath = 1 + Math.sin(t * 1.8) * 0.08;
        for (let i = 0; i < 9; i++) {
          const a = (i / 9) * Math.PI * 2;
          const dist = i === 0 ? 0 : 34 * breath;
          const ax = cx + Math.cos(a) * dist;
          const ay = cy + Math.sin(a) * dist;
          ctx.beginPath();
          ctx.arc(ax, ay, 18 * breath, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(52, 211, 153, 0.14)';
          ctx.fill();
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }
      } else if (s.organType === 'brain' || s.organType === 'nervous_system') {
        // Pyramidal Neural Network + Firing Synapses
        const nodes = [
          [cx, cy],
          [cx - 58, cy - 35],
          [cx + 60, cy - 30],
          [cx - 50, cy + 40],
          [cx + 55, cy + 38],
        ];
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
        ctx.lineWidth = 1.3;
        nodes.forEach(([nx, ny], idx) => {
          nodes.slice(idx + 1).forEach(([mx, my]) => {
            ctx.beginPath();
            ctx.moveTo(nx, ny);
            ctx.lineTo(mx, my);
            ctx.stroke();
          });
          ctx.beginPath();
          ctx.arc(nx, ny, 7 + Math.sin(t * 6 + idx) * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = '#fbbf24';
          ctx.fill();
        });
      } else if (s.organType === 'intestines') {
        // Enteric Villi & Lacteal Capillaries
        const wave = Math.sin(t * 2.2) * 3;
        for (let v = -2; v <= 2; v++) {
          const vx = cx + v * 34;
          ctx.beginPath();
          ctx.moveTo(vx - 14, cy + 44);
          ctx.quadraticCurveTo(vx + wave, cy - 52, vx + 14, cy + 44);
          ctx.fillStyle = 'rgba(244, 114, 182, 0.14)';
          ctx.fill();
          ctx.strokeStyle = '#f472b6';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Central lacteal capillary
          ctx.beginPath();
          ctx.moveTo(vx, cy + 40);
          ctx.lineTo(vx + wave * 0.5, cy - 16);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      } else if (s.organType === 'kidneys') {
        // Renal Glomerulus & Bowman's Capsule
        ctx.beginPath();
        ctx.arc(cx, cy, 44, 0.35, Math.PI * 2 - 0.35);
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Capillary tuft
        for (let loop = 0; loop < 5; loop++) {
          const a = (loop / 5) * Math.PI * 2 + t * 0.4;
          ctx.beginPath();
          ctx.arc(cx + Math.cos(a) * 14, cy + Math.sin(a) * 14, 12, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.78)';
          ctx.lineWidth = 1.6;
          ctx.stroke();
        }
      } else if (s.organType === 'muscular_system') {
        // Striated Skeletal Muscle Sarcomeres (Z-discs + A/I bands)
        const contract = Math.sin(t * 3.0) * 3;
        for (let row = -2; row <= 2; row++) {
          const ry = cy + row * 22;
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(cx - 72, ry);
          ctx.lineTo(cx + 72, ry);
          ctx.stroke();
          // Z-discs
          ctx.strokeStyle = '#fda4af';
          ctx.lineWidth = 1.4;
          for (let z = -3; z <= 3; z++) {
            const zx = cx + z * (20 + contract);
            ctx.beginPath();
            ctx.moveTo(zx, ry - 6);
            ctx.lineTo(zx, ry + 6);
            ctx.stroke();
          }
        }
      } else {
        // Hepatic Lobule Hexagonal Tissue (Liver / Visceral)
        ctx.strokeStyle = s.accentColor;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const a = (k / 6) * Math.PI * 2;
          const hx = cx + Math.cos(a) * 48;
          const hy = cy + Math.sin(a) * 48;
          if (k === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
      }
      ctx.restore();
    };

    const renderMicro = () => {
      rafId = requestAnimationFrame(renderMicro);
      const w = (canvas.width = canvas.clientWidth || 300);
      const h = (canvas.height = canvas.clientHeight || 200);
      const s = stateRef.current;
      const t = performance.now() * 0.001;
      const prog = Math.max(0, Math.min(1, s.progress / 100));

      ctx.fillStyle = '#03060f';
      ctx.fillRect(0, 0, w, h);

      // Subtle confocal radial vignette
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, 10, w * 0.5, h * 0.5, Math.max(w, h) * 0.58);
      grad.addColorStop(0, 'rgba(14, 165, 233, 0.08)');
      grad.addColorStop(1, 'rgba(2, 6, 15, 0.92)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Stage-aware Histology Overlay (fades in smoothly from 55% -> 100%)
      if (s.progress >= 55) {
        drawHistology(w, h, t, s);
      }

      // Live Organelle-Detailed Cells + Ligands (fade slightly once mature histology forms)
      const cellAlpha = s.isComplete ? 0.35 : 1;
      ctx.save();
      ctx.globalAlpha = cellAlpha;

      const speedMult = s.isRunning ? 1 + (s.morphogenLevel / 100) * 0.6 : 0.25;
      cells.forEach((c) => {
        c.x += c.vx * speedMult + (0.5 - c.x) * prog * 0.001;
        c.y += c.vy * speedMult + (0.5 - c.y) * prog * 0.001;
        c.rot += 0.004;
        if (c.x < 0.12 || c.x > 0.88) c.vx *= -1;
        if (c.y < 0.14 || c.y > 0.86) c.vy *= -1;
        drawOrganelleCell(c.x * w, c.y * h, c.r, c.rot, s.accentColor);
      });

      ligands.forEach((l, idx) => {
        l.x += l.vx * speedMult;
        l.y += l.vy * speedMult;
        if (l.x < 0.08 || l.x > 0.92) l.vx *= -1;
        if (l.y < 0.08 || l.y > 0.92) l.vy *= -1;
        const lx = l.x * w;
        const ly = l.y * h;

        ctx.beginPath();
        ctx.arc(lx, ly, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = idx % 2 === 0 ? '#f43f5e' : '#fbbf24';
        ctx.fill();

        const target = cells[idx % cells.length];
        const tx = target.x * w;
        const ty = target.y * h;
        const d = Math.hypot(lx - tx, ly - ty);
        if (d < 46 && s.isRunning) {
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(tx, ty);
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.45)';
          ctx.lineWidth = 1;
          ctx.stroke();
          if (d < 18 && Math.random() < 0.05) {
            flashes.push({ x: tx, y: ty, r: 4, alpha: 0.9 });
          }
        }
      });
      ctx.restore();

      // Binding Shockwave Rings (clean, no overlapping text)
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        f.r += 0.85;
        f.alpha -= 0.035;
        if (f.alpha <= 0) {
          flashes.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(34, 211, 238, ${f.alpha})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      // Microscope Scale Bar (50 µm)
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(w - 58, h - 14);
      ctx.lineTo(w - 14, h - 14);
      ctx.stroke();
      ctx.font = 'bold 8px monospace';
      ctx.fillStyle = 'rgba(226, 232, 240, 0.85)';
      ctx.fillText('50 µm', w - 50, h - 18);
    };

    renderMicro();
    return () => cancelAnimationFrame(rafId);
  }, []);

  const mins = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
  const secs = String(Math.floor(elapsedSec % 60)).padStart(2, '0');

  const scopeLabel =
    organType === 'heart'
      ? 'ECG // 72 BPM'
      : organType === 'lungs'
      ? 'TIDAL FLOW'
      : organType === 'brain' || organType === 'nervous_system'
      ? 'EEG // 14 Hz'
      : organType === 'bone'
      ? 'Ca²⁺ FLUX // WOLFF'
      : 'PERFUSION WAVE';

  const gradeColors = {
    S: 'bg-emerald-500/20 border-emerald-400 text-emerald-300',
    A: 'bg-cyan-500/20 border-cyan-400 text-cyan-300',
    B: 'bg-amber-500/20 border-amber-400 text-amber-300',
  };

  return (
    <div className="flex flex-col h-full bg-[#050912] border-l border-slate-800/90 text-slate-200 font-mono select-none overflow-hidden">
      {/* Header */}
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

      {/* Numeric Vitals Strip */}
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

      {/* Live Physiological Oscilloscope */}
      <div className="h-11 relative border-b border-slate-800/80 shrink-0">
        <canvas ref={scopeCanvasRef} className="w-full h-full block" />
        <div className="absolute top-1 right-2 text-[7.5px] font-bold text-emerald-300/90 uppercase pointer-events-none">
          {scopeLabel}
        </div>
      </div>

      {/* Confocal Microscopy & Live Tissue Histology */}
      <div className="flex-1 min-h-[130px] relative border-b border-slate-800/80">
        <canvas ref={microCanvasRef} className="w-full h-full block" />
        <div className="absolute top-1.5 left-2 px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-[7.5px] text-cyan-300 uppercase tracking-wider pointer-events-none">
          {isComplete ? 'HISTOLOGY // MATURE TISSUE' : 'CONFOCAL // LIVE CELL'}
        </div>
      </div>

      {/* Compact Pathway Progress Grid */}
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
