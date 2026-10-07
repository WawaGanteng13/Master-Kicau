import React from 'react';
import { Cpu, HardDriveDownload, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Zap, FileAudio, Video } from 'lucide-react';
import { TierType } from '../types/kicau';

interface LocalExtractPipelineProps {
  tier: TierType;
  isProcessing: boolean;
  progressStep: number; // 0 to 3
}

export const LocalExtractPipeline: React.FC<LocalExtractPipelineProps> = ({
  tier,
  isProcessing,
  progressStep,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <Cpu className={`w-4 h-4 ${tier === 'pro' ? 'text-amber-400' : 'text-emerald-400'}`} />
          <span className="text-xs font-bold text-slate-200 tracking-wide">
            Smart Routing & Edge Media Processing
          </span>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            tier === 'pro'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}
        >
          {tier === 'pro' ? 'PRO TIER: MULTIMODAL' : 'FREE TIER: EDGE CLIENT'}
        </span>
      </div>

      {tier === 'free' ? (
        <div>
          {/* Free Tier Flow Diagram from PDF Page 2 */}
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] mb-3">
            <div
              className={`p-2 rounded-xl border transition-all ${
                progressStep >= 1
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex justify-center mb-1">
                <Video className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="font-semibold text-[10px] leading-tight">1. Input Media</div>
              <div className="text-[9px] text-slate-400">Video MP4 / Mic</div>
            </div>

            <div
              className={`p-2 rounded-xl border transition-all relative ${
                progressStep >= 2
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex justify-center mb-1">
                <FileAudio className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>
              <div className="font-semibold text-[10px] leading-tight">2. Local Extract</div>
              <div className="text-[9px] text-emerald-400 font-mono">FFmpeg: MP4→MP3</div>
              {isProcessing && progressStep === 2 && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              )}
            </div>

            <div
              className={`p-2 rounded-xl border transition-all ${
                progressStep >= 3
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex justify-center mb-1">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="font-semibold text-[10px] leading-tight">3. Gemini Engine</div>
              <div className="text-[9px] text-slate-400">Audio Analyst</div>
            </div>
          </div>

          {/* Efficiency Metric Banner */}
          <div className="bg-emerald-950/40 border border-emerald-900/60 rounded-xl p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-emerald-300">
                  Efisiensi Token & Bandwidth: Hemat ~88%
                </div>
                <div className="text-[10px] text-slate-400">
                  Video 45 MB dikompres lokal jadi audio MP3 1.2 MB sebelum kirim
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-900/50 px-2 py-1 rounded">
              -88% Cost
            </span>
          </div>
        </div>
      ) : (
        <div>
          {/* Pro Tier Flow Diagram from PDF Page 2 */}
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] mb-3">
            <div
              className={`p-2 rounded-xl border transition-all ${
                progressStep >= 1
                  ? 'bg-amber-950/60 border-amber-500/50 text-amber-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex justify-center mb-1">
                <Video className="w-4 h-4 text-amber-400" />
              </div>
              <div className="font-semibold text-[10px] leading-tight">1. Upload Video MP4</div>
              <div className="text-[9px] text-slate-400">Resolusi Asli (HD)</div>
            </div>

            <div
              className={`p-2 rounded-xl border transition-all ${
                progressStep >= 2
                  ? 'bg-amber-950/60 border-amber-500/50 text-amber-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex justify-center mb-1">
                <HardDriveDownload className="w-4 h-4 text-amber-400" />
              </div>
              <div className="font-semibold text-[10px] leading-tight">2. Log Harian 3 Hari</div>
              <div className="text-[9px] text-amber-400/90">EF, Jemur, Karakter</div>
            </div>

            <div
              className={`p-2 rounded-xl border transition-all ${
                progressStep >= 3
                  ? 'bg-amber-950/60 border-amber-500/50 text-amber-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex justify-center mb-1">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              </div>
              <div className="font-semibold text-[10px] leading-tight">3. Abah Sony AI</div>
              <div className="text-[9px] text-slate-400">Multimodal Vision</div>
            </div>
          </div>

          {/* Pro Advantage Banner */}
          <div className="bg-amber-950/40 border border-amber-900/60 rounded-xl p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-amber-300">
                  Multimodal Tarung & Diagnosa Log Maestro
                </div>
                <div className="text-[10px] text-slate-400">
                  Menganalisa gerakan sujud/ngeplay + korelasi EF Jangkrik & Kroto
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-900/50 px-2 py-1 rounded">
              VIP PRO
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
