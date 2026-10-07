import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, Sparkles, Radio } from 'lucide-react';
import { birdAudioEngine } from '../utils/audioSynthesizer';

interface AudioVisualizerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  soundType?: 'cililin' | 'murai' | 'kenari';
  birdName?: string;
  duration?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  onTogglePlay,
  soundType = 'murai',
  birdName = 'Suara Kicau',
  duration = '00:24',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background subtle grid
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.lineWidth = 1;
      for (let y = 10; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw frequency bars (simulating 2kHz - 8kHz songbird frequencies)
      const numBars = 36;
      const barWidth = width / numBars - 2;

      for (let i = 0; i < numBars; i++) {
        // High frequencies (Cililin whistle 4-6 kHz) have sharp peaks
        let barHeight = 8;
        if (isPlaying) {
          const wave1 = Math.sin(phase + i * 0.35) * 0.5 + 0.5;
          const wave2 = Math.cos(phase * 1.5 + i * 0.2) * 0.5 + 0.5;
          const peak = i > 12 && i < 26 ? 1.4 : 0.8; // Peak in bird whistle frequency zone
          barHeight = (wave1 * 35 + wave2 * 25) * peak + 6;
        } else {
          barHeight = 4 + Math.sin(i * 0.5) * 3;
        }

        const x = i * (barWidth + 2);
        const y = height - barHeight;

        // Gradient color: Emerald to Lime to Amber
        const grad = ctx.createLinearGradient(0, height, 0, 0);
        grad.addColorStop(0, '#059669'); // emerald-600
        grad.addColorStop(0.6, '#10b981'); // emerald-500
        grad.addColorStop(1, '#34d399'); // emerald-400

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
        ctx.fill();

        // Little peak cap
        if (isPlaying && barHeight > 25) {
          ctx.fillStyle = '#fde047';
          ctx.fillRect(x, y - 2, barWidth, 2);
        }
      }

      if (isPlaying) {
        phase += 0.12;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying]);

  // Audio timer simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => (prev >= 24 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `0${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-semibold text-emerald-300 tracking-wider uppercase flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            Spektrogram Audio Real-Time
          </span>
        </div>
        <span className="text-[11px] font-mono text-emerald-400/80 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
          Range: 2.2 kHz - 7.8 kHz
        </span>
      </div>

      {/* Canvas */}
      <div className="relative rounded-xl overflow-hidden bg-slate-950/80 border border-slate-800 mb-3">
        <canvas
          ref={canvasRef}
          width={360}
          height={80}
          className="w-full h-20 block"
        />

        {isPlaying && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded-full text-[10px] text-amber-300 border border-amber-500/30">
            <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
            <span>Mendeteksi Tembakan Isian...</span>
          </div>
        )}
      </div>

      {/* Playback bar & controls */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          onClick={onTogglePlay}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
          title={isPlaying ? 'Pause' : 'Putar Audio'}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
        </button>

        <div className="flex-1">
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span className="text-emerald-400 font-medium truncate max-w-[170px]">{birdName}</span>
            <span>{formatTime(currentTime)} / {duration}</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 rounded-full transition-all duration-300"
              style={{ width: `${(currentTime / 24) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400 pl-1">
          <Volume2 className="w-4 h-4 text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
