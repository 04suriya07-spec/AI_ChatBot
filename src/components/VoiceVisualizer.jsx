import React, { useEffect, useRef } from 'react';

export const VoiceVisualizer = ({ state = 'idle', onClick }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Base radius & pulsation amplitude depending on state
      let baseRadius = 68;
      let waveSpeed = 0.03;
      let waveAmplitude = 8;
      let particleCount = 18;
      let primaryColor = '59, 130, 246'; // blue (idle)

      if (state === 'listening') {
        baseRadius = 78;
        waveSpeed = 0.08;
        waveAmplitude = 18;
        primaryColor = '6, 182, 212'; // cyan (listening)
      } else if (state === 'thinking') {
        baseRadius = 72;
        waveSpeed = 0.12;
        waveAmplitude = 12;
        primaryColor = '168, 85, 247'; // purple (thinking)
      } else if (state === 'speaking') {
        baseRadius = 82;
        waveSpeed = 0.09;
        waveAmplitude = 24;
        primaryColor = '16, 185, 129'; // emerald (speaking)
      }

      phase += waveSpeed;

      // 1. Draw outer ambient radiant aura
      const gradientAura = ctx.createRadialGradient(
        centerX, centerY, baseRadius * 0.4,
        centerX, centerY, baseRadius * 2.2
      );
      gradientAura.addColorStop(0, `rgba(${primaryColor}, 0.28)`);
      gradientAura.addColorStop(0.5, `rgba(${primaryColor}, 0.1)`);
      gradientAura.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradientAura;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw animated concentric wave rings
      const ringCount = state === 'speaking' || state === 'listening' ? 4 : 2;
      for (let r = 0; r < ringCount; r++) {
        const ringOffset = (phase * 15 + r * 30) % (baseRadius * 1.6);
        const ringRadius = baseRadius + ringOffset;
        const ringAlpha = Math.max(0, 0.4 - (ringOffset / (baseRadius * 1.6)) * 0.4);

        ctx.strokeStyle = `rgba(${primaryColor}, ${ringAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 3. Draw morphing organic fluid waveform orb
      ctx.save();
      ctx.beginPath();
      const points = 36;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        // Multi-frequency sine distortion
        const distortion = 
          Math.sin(angle * 4 + phase) * (waveAmplitude * 0.6) +
          Math.cos(angle * 7 - phase * 1.5) * (waveAmplitude * 0.4);
        
        const r = baseRadius + distortion;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();

      // Core Orb Gradient
      const coreGradient = ctx.createRadialGradient(
        centerX - 15, centerY - 15, 10,
        centerX, centerY, baseRadius * 1.2
      );
      if (state === 'listening') {
        coreGradient.addColorStop(0, '#67e8f9');
        coreGradient.addColorStop(0.5, '#06b6d4');
        coreGradient.addColorStop(1, '#0e7490');
      } else if (state === 'speaking') {
        coreGradient.addColorStop(0, '#6ee7b7');
        coreGradient.addColorStop(0.5, '#10b981');
        coreGradient.addColorStop(1, '#047857');
      } else if (state === 'thinking') {
        coreGradient.addColorStop(0, '#d8b4fe');
        coreGradient.addColorStop(0.5, '#a855f7');
        coreGradient.addColorStop(1, '#7e22ce');
      } else {
        coreGradient.addColorStop(0, '#93c5fd');
        coreGradient.addColorStop(0.5, '#3b82f6');
        coreGradient.addColorStop(1, '#1d4ed8');
      }

      ctx.fillStyle = coreGradient;
      ctx.shadowColor = `rgba(${primaryColor}, 0.8)`;
      ctx.shadowBlur = 30;
      ctx.fill();
      ctx.restore();

      // 4. Draw orbiting glowing light sparks/particles
      for (let p = 0; p < particleCount; p++) {
        const pAngle = phase * 0.8 + (p * (Math.PI * 2 / particleCount));
        const pDistance = baseRadius * 1.1 + Math.sin(phase * 2 + p) * 14;
        const px = centerX + Math.cos(pAngle) * pDistance;
        const py = centerY + Math.sin(pAngle) * pDistance;
        const pSize = (Math.sin(phase * 3 + p) + 1.5) * 1.8;

        ctx.fillStyle = `rgba(255, 255, 255, 0.9)`;
        ctx.shadowColor = `rgba(${primaryColor}, 1)`;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state]);

  const getStateText = () => {
    switch (state) {
      case 'listening': return 'Listening to you...';
      case 'thinking': return 'Processing request...';
      case 'speaking': return 'Speaking...';
      default: return 'Aura is Ready';
    }
  };

  const getStateColor = () => {
    switch (state) {
      case 'listening': return 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40';
      case 'thinking': return 'text-purple-400 border-purple-500/30 bg-purple-950/40';
      case 'speaking': return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40';
      default: return 'text-blue-400 border-blue-500/30 bg-blue-950/40';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      {/* Interactive Orb Canvas Container */}
      <div 
        onClick={onClick}
        className="relative cursor-pointer group transition-transform active:scale-95"
        title="Click to toggle Voice Assistant"
      >
        <canvas
          ref={canvasRef}
          width={340}
          height={340}
          className="w-64 h-64 sm:w-80 sm:h-80 drop-shadow-[0_0_35px_rgba(59,130,246,0.3)] transition-all duration-300 group-hover:scale-105"
        />

        {/* Center Microphone / Voice Icon overlay when hovering */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            {state === 'listening' ? (
              <div className="flex gap-1 items-center justify-center">
                <span className="w-1 bg-cyan-400 h-4 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1 bg-cyan-400 h-6 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1 bg-cyan-400 h-4 rounded-full animate-bounce"></span>
              </div>
            ) : state === 'speaking' ? (
              <div className="flex gap-1 items-center justify-center">
                <span className="w-1 bg-emerald-400 h-5 rounded-full animate-pulse"></span>
                <span className="w-1 bg-emerald-400 h-7 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                <span className="w-1 bg-emerald-400 h-4 rounded-full animate-pulse [animation-delay:0.4s]"></span>
              </div>
            ) : state === 'thinking' ? (
              <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-6 h-6 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* State Status Badge */}
      <div className={`mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-md text-xs sm:text-sm font-medium tracking-wide shadow-lg transition-all duration-300 ${getStateColor()}`}>
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${state === 'listening' ? 'bg-cyan-400' : state === 'speaking' ? 'bg-emerald-400' : state === 'thinking' ? 'bg-purple-400' : 'bg-blue-400'}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${state === 'listening' ? 'bg-cyan-500' : state === 'speaking' ? 'bg-emerald-500' : state === 'thinking' ? 'bg-purple-500' : 'bg-blue-500'}`}></span>
        </span>
        {getStateText()}
      </div>
    </div>
  );
};
