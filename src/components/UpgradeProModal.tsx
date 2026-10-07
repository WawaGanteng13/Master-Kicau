import React from 'react';
import { 
  Crown, 
  Check, 
  X, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Video, 
  FileAudio,
  Award,
  ArrowRight
} from 'lucide-react';
import { TierType } from '../types/kicau';

interface UpgradeProModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: TierType;
  onSelectTier: (tier: TierType) => void;
}

export const UpgradeProModal: React.FC<UpgradeProModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  onSelectTier,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-5 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/50 shadow-md shadow-amber-500/20 shrink-0 bg-slate-900 ring-1 ring-amber-400/30">
              <img
                src="/master-kicau-logo.jpg"
                alt="Master Kicau Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Paket Langganan Master Kicau
              </h3>
              <p className="text-[11px] text-slate-400">
                Spesifikasi Sistem Freemium & Multimodal AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>

        {/* Feature Comparison Table based strictly on PDF Page 2 */}
        <div className="my-4">
          <div className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
            Spesifikasi Output AI Berdasarkan Tier
          </div>

          <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60 text-xs">
            {/* Header row */}
            <div className="grid grid-cols-12 bg-slate-800/80 p-2.5 font-bold text-[11px] text-slate-300">
              <div className="col-span-6">Fitur Analisis</div>
              <div className="col-span-3 text-center text-emerald-400">Free Tier</div>
              <div className="col-span-3 text-center text-amber-400">Pro Tier</div>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-12 p-2.5 border-t border-slate-800/80 items-center">
              <div className="col-span-6 font-medium text-slate-300">Deteksi Isian Lagu</div>
              <div className="col-span-3 text-center text-slate-400 text-[10px]">Ya (Audio)</div>
              <div className="col-span-3 text-center text-amber-300 font-semibold text-[10px]">Akurasi Tinggi</div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-12 p-2.5 border-t border-slate-800/80 items-center bg-slate-900/30">
              <div className="col-span-6 font-medium text-slate-300">Kejernihan & Durasi Suara</div>
              <div className="col-span-3 text-center text-emerald-400 text-xs">Ya</div>
              <div className="col-span-3 text-center text-emerald-400 text-xs">Ya</div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-12 p-2.5 border-t border-slate-800/80 items-center">
              <div className="col-span-6 font-medium text-slate-300">
                Analisis Gaya Tarung
                <span className="block text-[9px] text-slate-500">Ngeplay, Sujud, Ngetem</span>
              </div>
              <div className="col-span-3 text-center text-rose-400 text-[10px]">Tidak (Diabaikan)</div>
              <div className="col-span-3 text-center text-amber-300 font-semibold text-[10px]">Ya (Visual Multimodal)</div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-12 p-2.5 border-t border-slate-800/80 items-center bg-slate-900/30">
              <div className="col-span-6 font-medium text-slate-300">
                Rekomendasi Pakan
                <span className="block text-[9px] text-slate-500">Persona Abah Sony</span>
              </div>
              <div className="col-span-3 text-center text-emerald-400 font-medium text-[10px]">Tips Dasar Ringkas</div>
              <div className="col-span-3 text-center text-amber-300 font-semibold text-[10px]">Resep Lengkap 3 Hari</div>
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-12 p-2.5 border-t border-slate-800/80 items-center">
              <div className="col-span-6 font-medium text-slate-300">Pemrosesan Media</div>
              <div className="col-span-3 text-center text-[10px] text-slate-400">Local MP4→MP3</div>
              <div className="col-span-3 text-center text-[10px] text-amber-300 font-medium">MP4 HD Langsung</div>
            </div>

            {/* Row 6: Lagu Eksklusif Burung Juara */}
            <div className="grid grid-cols-12 p-2.5 border-t border-slate-800/80 items-center bg-amber-950/20">
              <div className="col-span-6 font-medium text-amber-200">
                Lagu Eksklusif Burung Juara
                <span className="block text-[9px] text-slate-400">Suara Asli MB Avatar &amp; Jawara</span>
              </div>
              <div className="col-span-3 text-center text-slate-400 text-[10px]">Demo 15 Detik</div>
              <div className="col-span-3 text-center text-amber-300 font-bold text-[10px]">Akses Penuh &amp; Impor</div>
            </div>
          </div>
        </div>

        {/* Tier Action Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Free Card */}
          <div
            onClick={() => {
              onSelectTier('free');
              onClose();
            }}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              currentTier === 'free'
                ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/50'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-200">FREE TIER</span>
              {currentTier === 'free' && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </div>
            <div className="text-sm font-extrabold text-emerald-400 mb-1">Rp 0</div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Ekstrak audio lokal, analisis materi dasar, hemat kuota.
            </p>
          </div>

          {/* Pro Card */}
          <div
            onClick={() => {
              onSelectTier('pro');
              onClose();
            }}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              currentTier === 'pro'
                ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500/50'
                : 'bg-slate-950/60 border-slate-800 hover:border-amber-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-300">PRO VIP</span>
              {currentTier === 'pro' && (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </div>
            <div className="text-sm font-extrabold text-amber-300 mb-1">Rp 49.000<span className="text-[9px] text-slate-400 font-normal">/bln</span></div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Multimodal video MP4, Resep Abah Sony 3 hari, &amp; lagu eksklusif suara asli MB Avatar.
            </p>
          </div>
        </div>

        {/* Upgrade / Switch button */}
        <button
          onClick={() => {
            const nextTier = currentTier === 'free' ? 'pro' : 'free';
            onSelectTier(nextTier);
            onClose();
          }}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-105 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>
            {currentTier === 'free'
              ? 'Aktifkan PRO VIP (Mode Abah Sony)'
              : 'Kembali ke Free Tier (Mode Audio Dasar)'}
          </span>
        </button>

        <p className="text-center text-[10px] text-slate-500 mt-2">
          Dapat diubah kapan saja untuk menguji perbedaan arsitektur sistem.
        </p>
      </div>
    </div>
  );
};
