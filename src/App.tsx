/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Feather, 
  MessageSquare, 
  Cpu, 
  Crown, 
  ChevronDown, 
  Radio, 
  Layers, 
  Info,
  CheckCircle2,
  Zap,
  Flame,
  Snowflake
} from 'lucide-react';
import { AndroidFrame } from './components/AndroidFrame';
import { AnalysisTab } from './components/AnalysisTab';
import { DailyLogsTab } from './components/DailyLogsTab';
import { BirdProfilesTab } from './components/BirdProfilesTab';
import { MaestroChatTab } from './components/MaestroChatTab';
import { KnowledgeBaseTab } from './components/KnowledgeBaseTab';
import { MasteranStudioTab } from './components/MasteranStudioTab';
import { UpgradeProModal } from './components/UpgradeProModal';
import { BirdProfile, DailyLog, TierType } from './types/kicau';
import { INITIAL_BIRDS, INITIAL_DAILY_LOGS } from './data/mockData';
import { BookOpen, Music } from 'lucide-react';

export default function App() {
  // Application State with LocalStorage Persistence
  const [tier, setTier] = useState<TierType>(() => {
    const saved = localStorage.getItem('kicau_tier');
    return (saved as TierType) || 'free';
  });

  const [birds, setBirds] = useState<BirdProfile[]>(() => {
    const saved = localStorage.getItem('kicau_birds');
    return saved ? JSON.parse(saved) : INITIAL_BIRDS;
  });

  const [currentBirdId, setCurrentBirdId] = useState<string>(() => {
    const saved = localStorage.getItem('kicau_current_bird_id');
    return saved || INITIAL_BIRDS[0].bird_id;
  });

  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(() => {
    const saved = localStorage.getItem('kicau_daily_logs');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_LOGS;
  });

  const [activeTab, setActiveTab] = useState<'analisis' | 'rawatan' | 'masteran' | 'pustaka' | 'maestro' | 'profil' | 'arsitektur'>('analisis');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showBirdDropdown, setShowBirdDropdown] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('kicau_tier', tier);
  }, [tier]);

  useEffect(() => {
    localStorage.setItem('kicau_birds', JSON.stringify(birds));
  }, [birds]);

  useEffect(() => {
    localStorage.setItem('kicau_current_bird_id', currentBirdId);
  }, [currentBirdId]);

  useEffect(() => {
    localStorage.setItem('kicau_daily_logs', JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  const currentBird = birds.find((b) => b.bird_id === currentBirdId) || birds[0] || INITIAL_BIRDS[0];

  const handleAddLog = (newLog: DailyLog) => {
    setDailyLogs((prev) => [newLog, ...prev]);
  };

  const handleDeleteLog = (logId: string) => {
    setDailyLogs((prev) => prev.filter((l) => l.log_id !== logId));
  };

  const handleAddBird = (newBird: BirdProfile) => {
    setBirds((prev) => [...prev, newBird]);
    setCurrentBirdId(newBird.bird_id);
  };

  const handleDeleteBird = (birdId: string) => {
    if (birds.length <= 1) return;
    const remaining = birds.filter((b) => b.bird_id !== birdId);
    setBirds(remaining);
    if (currentBirdId === birdId) {
      setCurrentBirdId(remaining[0].bird_id);
    }
  };

  return (
    <AndroidFrame>
      {/* Top Application Bar */}
      <header className="bg-slate-950/95 border-b border-slate-800/80 px-4 py-3 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center justify-between">
          {/* Logo & Bird Selector */}
          <div className="flex items-center gap-2 relative">
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-amber-500/50 shadow-md shadow-amber-500/20 shrink-0 bg-slate-900 ring-1 ring-amber-400/30">
              <img
                src="/master-kicau-logo.jpg"
                alt="Master Kicau Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setShowBirdDropdown(!showBirdDropdown)}>
                <h1 className="text-xs font-black tracking-tight text-white uppercase">
                  Master Kicau
                </h1>
                <span className="text-slate-500">•</span>
                <span className="text-xs font-bold text-emerald-400 truncate max-w-[120px] flex items-center gap-1">
                  {currentBird.nama_burung}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </span>
              </div>
              <div className="text-[10px] text-slate-400 leading-none">
                {currentBird.jenis_burung} ({currentBird.karakter_dasar})
              </div>
            </div>

            {/* Bird Selector Dropdown */}
            {showBirdDropdown && (
              <div className="absolute top-10 left-0 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50">
                <span className="text-[10px] font-bold text-slate-400 px-2 py-1 block uppercase">
                  Pilih Gacoan Aktif:
                </span>
                {birds.map((b) => (
                  <button
                    key={b.bird_id}
                    onClick={() => {
                      setCurrentBirdId(b.bird_id);
                      setShowBirdDropdown(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl flex items-center justify-between text-xs transition-all ${
                      b.bird_id === currentBird.bird_id
                        ? 'bg-emerald-950/80 text-emerald-300 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{b.nama_burung}</span>
                    <span className="text-[9px] text-slate-400">{b.karakter_dasar}</span>
                  </button>
                ))}
                <div className="pt-1 border-t border-slate-800 mt-1">
                  <button
                    onClick={() => {
                      setShowBirdDropdown(false);
                      setActiveTab('profil');
                    }}
                    className="w-full text-left p-2 text-xs font-semibold text-emerald-400 hover:underline"
                  >
                    + Kelola / Tambah Burung
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tier Badge / Switcher & Architecture Info */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('arsitektur')}
              className={`p-1.5 rounded-full border transition-all ${
                activeTab === 'arsitektur'
                  ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Spesifikasi Arsitektur Sistem"
            >
              <Cpu className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setShowUpgradeModal(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all border shadow-sm ${
                tier === 'pro'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25'
              }`}
            >
              {tier === 'pro' ? (
                <>
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>PRO VIP</span>
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span>FREE TIER</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Tab View */}
      <main className="flex-1 pb-20">
        {activeTab === 'analisis' && (
          <AnalysisTab
            currentBird={currentBird}
            dailyLogs={dailyLogs}
            tier={tier}
            onUpgradeClick={() => setShowUpgradeModal(true)}
            onAddLogClick={() => setActiveTab('rawatan')}
            onNavigateToChat={() => setActiveTab('maestro')}
          />
        )}

        {activeTab === 'rawatan' && (
          <DailyLogsTab
            currentBird={currentBird}
            dailyLogs={dailyLogs}
            onAddLog={handleAddLog}
            onDeleteLog={handleDeleteLog}
          />
        )}

        {activeTab === 'masteran' && (
          <MasteranStudioTab
            currentBird={currentBird}
            tier={tier}
            onUpgradeClick={() => setShowUpgradeModal(true)}
          />
        )}

        {activeTab === 'pustaka' && (
          <KnowledgeBaseTab
            currentBird={currentBird}
            onApplyRecipeToLogs={handleAddLog}
            onNavigateToTab={(t) => setActiveTab(t)}
          />
        )}

        {activeTab === 'profil' && (
          <BirdProfilesTab
            birds={birds}
            currentBird={currentBird}
            onSelectBird={(b) => setCurrentBirdId(b.bird_id)}
            onAddBird={handleAddBird}
            onDeleteBird={handleDeleteBird}
          />
        )}

        {activeTab === 'maestro' && (
          <MaestroChatTab
            currentBird={currentBird}
            dailyLogs={dailyLogs}
            tier={tier}
            onUpgradeClick={() => setShowUpgradeModal(true)}
          />
        )}

        {activeTab === 'arsitektur' && (
          <div className="p-4 space-y-4">
            <div className="bg-gradient-to-r from-slate-900 to-emerald-950/60 border border-emerald-500/40 rounded-2xl p-4 flex items-center gap-3.5 shadow-xl">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-amber-500/60 shadow-lg shadow-amber-500/20 shrink-0 bg-slate-900 ring-2 ring-amber-400/40">
                <img
                  src="/master-kicau-logo.jpg"
                  alt="Master Kicau Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>Dokumen Arsitektur Sistem Master Kicau</span>
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Implementasi Teknis Versi 1.0 (Serverless &amp; Multimodal AI)
                </p>
              </div>
            </div>

            {/* Architecture breakdown based on PDF Page 1 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
              <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                1. Tiga Lapisan Arsitektur Sistem (PDF Hal 1)
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-emerald-400">1. Client-Side (Frontend App)</div>
                  <div className="text-[11px] text-slate-400">
                    UI/UX Android, Audio Player, Web Audio Synthesizer, FFmpeg Kit client-side extraction (Video to Audio).
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-teal-400">2. Middleware & Database</div>
                  <div className="text-[11px] text-slate-400">
                    Express + API Routing, schema <code className="text-emerald-300">Bird_Profiles</code> & <code className="text-emerald-300">Daily_Logs</code>, smart routing logic.
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-amber-400">3. AI Engine (Google AI Studio)</div>
                  <div className="text-[11px] text-slate-400">
                    Gemini Flash (Audio & Evaluasi Dasar) + Gemini Multimodal Vision (Abah Sony Persona & Gaya Tarung).
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt rules based on PDF Page 4 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs">
              <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                2. AI Prompt Engineering & System Instructions (PDF Hal 4)
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px]">
                <span className="font-bold text-emerald-400 block mb-1">Free Tier (Basic Audio Analyst + Tips Ringkas):</span>
                <p className="text-slate-400 italic">
                  Format: 1. Materi Lagu Terdeteksi, 2. Kualitas Vokal, 3. Durasi Kerja, 4. Tips Settingan Dasar (Ringkas).<br/>
                  Aturan: Berikan gambaran tips dasar secara umum (tanpa resep bertahap). Tetap akhiri dengan ajakan resmi upgrade ke PRO untuk resep lengkap Maestro.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px]">
                <span className="font-bold text-amber-400 block mb-1">Pro Tier (Abah Sony / Avatar Persona):</span>
                <p className="text-slate-400 italic">
                  Persona Abah Sony, pemilik MB Avatar. Istilah kicau mania: ngeplay, sujud, ngetem, bongkar isian, EF, settingan. 1. Evaluasi Kinerja, 2. Diagnosa Pakan & Karakter, 3. Resep Maestro 3 Hari, 4. Tone akrab "Om" / "Bosku".
                </p>
              </div>
            </div>

            {/* Tier Switch button */}
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-2"
            >
              <span>Ubah Status Berlangganan (Free / Pro)</span>
            </button>
          </div>
        )}
      </main>

      {/* Android Bottom Navigation Bar */}
      <nav className="fixed bottom-6 left-0 right-0 max-w-[420px] mx-auto z-40 px-3">
        <div className="bg-slate-900/95 border border-slate-800 rounded-2xl px-2 py-2 shadow-2xl backdrop-blur-lg flex items-center justify-around">
          <button
            onClick={() => setActiveTab('analisis')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
              activeTab === 'analisis'
                ? 'text-emerald-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span className="text-[10px]">Analisis</span>
          </button>

          <button
            onClick={() => setActiveTab('rawatan')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
              activeTab === 'rawatan'
                ? 'text-emerald-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-[10px]">Rawatan</span>
          </button>

          <button
            onClick={() => setActiveTab('masteran')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
              activeTab === 'masteran'
                ? 'text-indigo-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Music className="w-4 h-4" />
            <span className="text-[10px]">Studio Lagu</span>
          </button>

          <button
            onClick={() => setActiveTab('pustaka')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
              activeTab === 'pustaka'
                ? 'text-amber-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-[10px]">Pustaka</span>
          </button>

          <button
            onClick={() => setActiveTab('maestro')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all relative ${
              activeTab === 'maestro'
                ? 'text-amber-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-[10px]">Abah Sony</span>
            {tier === 'pro' && (
              <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>
        </div>
      </nav>

      {/* Upgrade Pro Modal */}
      <UpgradeProModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentTier={tier}
        onSelectTier={(newTier) => setTier(newTier)}
      />
    </AndroidFrame>
  );
}
