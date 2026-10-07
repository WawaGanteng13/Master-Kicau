import React, { useState } from 'react';
import { 
  BookOpen, 
  Volume2, 
  Play, 
  Pause, 
  Clock, 
  Flame, 
  Snowflake, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  HelpCircle,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Feather
} from 'lucide-react';
import { birdAudioEngine } from '../utils/audioSynthesizer';
import { BirdProfile, DailyLog } from '../types/kicau';

interface KnowledgeBaseTabProps {
  currentBird: BirdProfile;
  onApplyRecipeToLogs: (newLog: DailyLog) => void;
  onNavigateToTab: (tabName: 'analisis' | 'rawatan' | 'maestro' | 'masteran') => void;
}

export const KnowledgeBaseTab: React.FC<KnowledgeBaseTabProps> = ({
  currentBird,
  onApplyRecipeToLogs,
  onNavigateToTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'isian' | 'pemasteran' | 'pakan'>('matrix');
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [selectedTrouble, setSelectedTrouble] = useState<'ngetem' | 'gembung' | 'over_birahi'>('ngetem');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const playMasteran = (type: string) => {
    if (playingSound === type) {
      birdAudioEngine.stop();
      setPlayingSound(null);
    } else {
      birdAudioEngine.stop();
      setPlayingSound(type);

      if (type === 'cililin') birdAudioEngine.playCililinBurst(4000);
      else if (type === 'tengkek') birdAudioEngine.playTengkekButo(3500);
      else if (type === 'kenari') birdAudioEngine.playKenariTrill(4000);
      else if (type === 'kapas') birdAudioEngine.playKapasTembak(3500);
      else if (type === 'gereja') birdAudioEngine.playGerejaTarung(3000);

      setTimeout(() => {
        setPlayingSound(null);
      }, 4000);
    }
  };

  const applyMatrixTroubleshoot = (troubleKey: 'ngetem' | 'gembung' | 'over_birahi') => {
    let porsi = '5/5';
    let kroto = 10;
    let jemur = 25;
    let mandi = 'Keramba Sore';
    let ef = '-';
    let catatan = '';

    if (troubleKey === 'ngetem') {
      porsi = '7/7';
      kroto = 15;
      jemur = 45;
      mandi = 'Keramba Pagi (09.00)';
      ef = 'Jangkrik 7/7 + Kandang Umbaran 2x Seminggu';
      catatan = 'Resep Matrix Diagnosa: Solusi ngetem/kehabisan tenaga. Maksimalkan jemur & stamina umbaran.';
    } else if (troubleKey === 'gembung') {
      porsi = '5/5';
      kroto = 20;
      jemur = 20;
      mandi = 'Tanpa Mandi (Full Kerodong)';
      ef = 'Kroto Segar 2 hari berturut-turut';
      catatan = 'Resep Matrix Diagnosa: Solusi mental drop / ngebatman. Jauhkan burung sejenis, tingkatkan kroto.';
    } else if (troubleKey === 'over_birahi') {
      porsi = '3/3';
      kroto = 0;
      jemur = 15;
      mandi = 'Mandi Malam Air Sejuk (19.30)';
      ef = 'Stop kroto & ulat hongkong';
      catatan = 'Resep Matrix Diagnosa: Solusi over birahi nabrak jeruji. Pangkas EF & perbanyak mandi malam.';
    }

    const newLog: DailyLog = {
      log_id: `log-matrix-${Date.now()}`,
      bird_id: currentBird.bird_id,
      tanggal: new Date().toISOString().split('T')[0],
      porsi_jangkrik: porsi,
      kroto_gram: kroto,
      jemur_menit: jemur,
      mandi,
      ef_tambahan: ef,
      catatan,
    };

    onApplyRecipeToLogs(newLog);
    setToastMessage(`✓ Resep Matrix berhasil dicatat ke Buku Rawatan ${currentBird.nama_burung}!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <h2 className="text-base font-extrabold text-white">
            Pustaka Pengetahuan Kicau Mania
          </h2>
        </div>
        <p className="text-xs text-slate-300">
          Knowledge Base rujukan sistem AI: Database Isian, SOP Pemasteran, Logika EF, & Matrix Diagnosa Gantangan.
        </p>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-500 text-slate-950 p-2.5 rounded-xl text-xs font-bold shadow-lg flex items-center justify-between animate-bounce">
          <span>{toastMessage}</span>
          <button onClick={() => onNavigateToTab('rawatan')} className="underline text-[11px] ml-2">
            Lihat Log
          </button>
        </div>
      )}

      {/* Sub Tabs Navigation */}
      <div className="grid grid-cols-4 gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-2xl text-[11px] font-bold">
        <button
          onClick={() => setActiveSubTab('matrix')}
          className={`py-2 rounded-xl transition-all text-center ${
            activeSubTab === 'matrix'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Diagnosa
        </button>

        <button
          onClick={() => setActiveSubTab('isian')}
          className={`py-2 rounded-xl transition-all text-center ${
            activeSubTab === 'isian'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Isian Lagu
        </button>

        <button
          onClick={() => setActiveSubTab('pemasteran')}
          className={`py-2 rounded-xl transition-all text-center ${
            activeSubTab === 'pemasteran'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          SOP Master
        </button>

        <button
          onClick={() => setActiveSubTab('pakan')}
          className={`py-2 rounded-xl transition-all text-center ${
            activeSubTab === 'pakan'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Logika EF
        </button>
      </div>

      {/* TAB 1: MATRIX DIAGNOSA GANTANGAN (If-This-Then-That) */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Matrix Diagnosa AI (Troubleshooting Gantangan)
            </span>
            <span className="text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40 font-mono">
              If-This-Then-That Logic
            </span>
          </div>

          {/* 3 Symptom Selector Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSelectedTrouble('ngetem')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedTrouble === 'ngetem'
                  ? 'bg-amber-950/60 border-amber-500 text-amber-200 ring-1 ring-amber-500'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-[10px] font-bold text-amber-400 uppercase">Kasus 1</div>
              <div className="text-xs font-bold mt-0.5 leading-tight">Ngetem / Turun</div>
              <div className="text-[9px] text-slate-400 mt-1">Kehabisan tenaga</div>
            </button>

            <button
              onClick={() => setSelectedTrouble('gembung')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedTrouble === 'gembung'
                  ? 'bg-amber-950/60 border-amber-500 text-amber-200 ring-1 ring-amber-500'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-[10px] font-bold text-amber-400 uppercase">Kasus 2</div>
              <div className="text-xs font-bold mt-0.5 leading-tight">Gembung / Batman</div>
              <div className="text-[9px] text-slate-400 mt-1">Mental drop</div>
            </button>

            <button
              onClick={() => setSelectedTrouble('over_birahi')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedTrouble === 'over_birahi'
                  ? 'bg-amber-950/60 border-amber-500 text-amber-200 ring-1 ring-amber-500'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-[10px] font-bold text-amber-400 uppercase">Kasus 3</div>
              <div className="text-xs font-bold mt-0.5 leading-tight">Over Birahi</div>
              <div className="text-[9px] text-slate-400 mt-1">Nabrak jeruji</div>
            </button>
          </div>

          {/* Detail Diagnosa Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
            {selectedTrouble === 'ngetem' && (
              <>
                <div className="border-b border-slate-800 pb-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Gejala di Lapangan:</div>
                  <h4 className="text-xs font-extrabold text-amber-300 mt-0.5">
                    Burung sering "Ngetem" (banyak diam/jeda di tengah lomba) atau sering turun tangkringan.
                  </h4>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-bold text-rose-400 uppercase">Analisa Sistem AI:</span>
                  <p className="text-xs text-slate-300">
                    Burung kehabisan tenaga stamina atau kurang fight di pertengahan hingga akhir penilaian.
                  </p>
                </div>

                <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-900/50 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">Saran Solusi Maestro:</span>
                  <p className="text-xs text-slate-200">
                    Tambah porsi jangkrik harian (dari 5/5 ke 7/7), maksimalkan penjemuran pagi (30-60 menit), dan gunakan kandang umbaran seminggu 2x untuk melatih fisik & pernapasan.
                  </p>
                </div>
              </>
            )}

            {selectedTrouble === 'gembung' && (
              <>
                <div className="border-b border-slate-800 pb-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Gejala di Lapangan:</div>
                  <h4 className="text-xs font-extrabold text-amber-300 mt-0.5">
                    Burung hanya pasang badan (gembung / ngebatman) tapi tidak keluar suara.
                  </h4>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-bold text-rose-400 uppercase">Analisa Sistem AI:</span>
                  <p className="text-xs text-slate-300">
                    Mental drop (kalah mental) akibat intimidasi suara lawan yang terlalu kencang atau burung kurang birahi bertarung.
                  </p>
                </div>

                <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-900/50 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">Saran Solusi Maestro:</span>
                  <p className="text-xs text-slate-200">
                    Jauhkan segera dari suara burung sejenis di rumah, tingkatkan porsi kroto bersih, dan full kerodong istirahat tanpa gangguan.
                  </p>
                </div>
              </>
            )}

            {selectedTrouble === 'over_birahi' && (
              <>
                <div className="border-b border-slate-800 pb-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Gejala di Lapangan:</div>
                  <h4 className="text-xs font-extrabold text-amber-300 mt-0.5">
                    Burung over birahi (sering menabrak jeruji kandang, turun ke dasar sangkar mencari musuh, suara pendek-pendek).
                  </h4>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-bold text-rose-400 uppercase">Analisa Sistem AI:</span>
                  <p className="text-xs text-slate-300">
                    Porsi Extra Fooding (EF) terlalu tinggi, tidak seimbang dengan pengeluaran tenaga atau durasi latihan fisik.
                  </p>
                </div>

                <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-900/50 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">Saran Solusi Maestro:</span>
                  <p className="text-xs text-slate-200">
                    Pangkas porsi kroto dan ulat hongkong, perbanyak intensitas mandi (terutama mandi malam air sejuk), dan kurangi durasi penjemuran.
                  </p>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => applyMatrixTroubleshoot(selectedTrouble)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>Terapkan Resep Ini ke {currentBird.nama_burung}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DATABASE KARAKTER SUARA & ISIAN (Tembakan, Ngeroll, Besetan) */}
      {activeSubTab === 'isian' && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            3 Tipe Karakter Suara Masteran (Literatur Hal 1)
          </div>

          {/* 1. Tembakan */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-xs font-extrabold text-amber-400 uppercase flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                1. Karakter Suara Tembakan
              </span>
              <span className="text-[10px] text-slate-400">Senjata Bongkar Emosi</span>
            </div>

            {/* Cililin */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-white flex items-center gap-1">
                  <span>Cililin</span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded">Isian Wajib</span>
                </h5>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                  Melengking tajam, sangat rapat, durasi panjang. Isian paling mewah di arena lomba Murai Batu.
                </p>
              </div>
              <button
                onClick={() => playMasteran('cililin')}
                className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 shrink-0 ml-2"
                title="Dengarkan Suara Cililin"
              >
                {playingSound === 'cililin' ? <Pause className="w-4 h-4 fill-amber-400" /> : <Play className="w-4 h-4 fill-amber-400" />}
              </button>
            </div>

            {/* Tengkek Buto */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-white">Tengkek Buto</h5>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                  Tembakan kasar tebal. Mirip Cililin tetapi lebih tebal dan berbobot bunyinya.
                </p>
              </div>
              <button
                onClick={() => playMasteran('tengkek')}
                className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 shrink-0 ml-2"
                title="Dengarkan Suara Tengkek Buto"
              >
                {playingSound === 'tengkek' ? <Pause className="w-4 h-4 fill-amber-400" /> : <Play className="w-4 h-4 fill-amber-400" />}
              </button>
            </div>
          </div>

          {/* 2. Ngeroll */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-xs font-extrabold text-emerald-400 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                2. Karakter Suara Ngeroll
              </span>
              <span className="text-[10px] text-slate-400">Peredam Jeda / Ngetem</span>
            </div>

            {/* Kenari */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-white flex items-center gap-1">
                  <span>Kenari</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded">Cengkok Rol</span>
                </h5>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                  Melodi panjang bervariasi dengan cengkok naik-turun. Merapatkan jeda kicauan agar burung tidak tampak ngetem.
                </p>
              </div>
              <button
                onClick={() => playMasteran('kenari')}
                className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 shrink-0 ml-2"
                title="Dengarkan Suara Kenari"
              >
                {playingSound === 'kenari' ? <Pause className="w-4 h-4 fill-emerald-400" /> : <Play className="w-4 h-4 fill-emerald-400" />}
              </button>
            </div>
          </div>

          {/* 3. Besetan */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-xs font-extrabold text-teal-400 uppercase flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5" />
                3. Karakter Suara Besetan
              </span>
              <span className="text-[10px] text-slate-400">Variasi Tengah Lagu</span>
            </div>

            {/* Kapas Tembak */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-white">Kapas Tembak</h5>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                  Tembakan & Besetan kasar, rapat (crecetan tajam). Sangat bagus untuk membongkar emosi lawan.
                </p>
              </div>
              <button
                onClick={() => playMasteran('kapas')}
                className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 shrink-0 ml-2"
                title="Dengarkan Suara Kapas Tembak"
              >
                {playingSound === 'kapas' ? <Pause className="w-4 h-4 fill-teal-400" /> : <Play className="w-4 h-4 fill-teal-400" />}
              </button>
            </div>

            {/* Cucak Jenggot & Gereja Tarung */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-white">Cucak Jenggot & Gereja Tarung</h5>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                  Besetan kasar, pendek tapi sangat tajam. Menawan dibawakan di sela-sela lagu ngeroll.
                </p>
              </div>
              <button
                onClick={() => playMasteran('gereja')}
                className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 shrink-0 ml-2"
                title="Dengarkan Suara Gereja Tarung"
              >
                {playingSound === 'gereja' ? <Pause className="w-4 h-4 fill-teal-400" /> : <Play className="w-4 h-4 fill-teal-400" />}
              </button>
            </div>
          </div>

          {/* CTA to Audio Stitcher Studio */}
          <div className="bg-gradient-to-r from-indigo-950/70 via-purple-950/40 to-slate-900 border border-indigo-500/40 p-3.5 rounded-2xl flex items-center justify-between shadow-lg">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Rangkai &amp; Jahit Lagu Kustom (Audio Stitcher)
              </span>
              <p className="text-[11px] text-slate-300">
                Gabungkan isian Kenari, Cililin, Kapas Tembak lalu putar berulang (Looping).
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('masteran')}
              className="py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:brightness-105 text-white font-bold text-xs shrink-0 flex items-center gap-1 shadow-md ml-2"
            >
              <span>Buka Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: STANDAR OPERASIONAL PEMASTERAN (SOP AI) */}
      {activeSubTab === 'pemasteran' && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Standar Operasional Pemasteran (Metode AI)
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
            {/* 1. Waktu Efektif */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Clock className="w-4 h-4" />
                <span>1. Waktu Efektif Pemasteran</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pemasteran paling masuk saat burung sedang istirahat penuh (dikerodong) pada <strong>siang hari</strong>, <strong>sore menjelang magrib</strong>, dan <strong>malam hari hingga pagi</strong>.
              </p>
              <div className="text-[11px] text-amber-300 bg-amber-950/40 p-2 rounded-lg border border-amber-900/40 mt-1">
                ★ <strong>Masa Mabung (Ganti Bulu)</strong> adalah masa emas/terbaik burung untuk menyerap materi isian baru secara permanen!
              </div>
            </div>

            {/* 2. Volume Suara */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                <Volume2 className="w-4 h-4" />
                <span>2. Aturan Volume Suara</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Suara mastering digital (MP3) <strong>TIDAK BOLEH</strong> disetel terlalu keras. Volume harus sedang atau samar-samar (seperti suara burung di kejauhan) agar burung master tidak merasa terintimidasi atau stres.
              </p>
            </div>

            {/* 3. Ritme Pemutaran */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                <Sliders className="w-4 h-4" />
                <span>3. Ritme Pemutaran Berjeda</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Audio mastering wajib memiliki <strong>jeda diam</strong> (tidak boleh berbunyi nonstop 24 jam) agar burung punya waktu mencerna dan mengingat irama lagu.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LOGIKA SETTINGAN PAKAN & RAWATAN HARIAN (EF) */}
      {activeSubTab === 'pakan' && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Logika Settingan Pakan & EF (Extra Fooding)
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
            {/* Jangkrik */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-emerald-400">Jangkrik (Power & Stamina)</h5>
                <span className="text-[10px] text-slate-400 font-mono">Normal: 3-5 P/S</span>
              </div>
              <p className="text-xs text-slate-300">
                Pakan utama penentu tenaga dan stamina harian. Porsi normal rata-rata adalah 3-5 ekor di pagi hari dan 3-5 ekor di sore hari. Naikkan ke 7/7 untuk mendongkrak power saat lomba.
              </p>
            </div>

            {/* Kroto */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-amber-400">Kroto (Birahi & Emosi)</h5>
                <span className="text-[10px] text-slate-400 font-mono">1-2x Seminggu</span>
              </div>
              <p className="text-xs text-slate-300">
                Pakan pendongkrak birahi dan emosi. Untuk harian, cukup diberikan 1-2 kali seminggu (misal 1 sendok teh). Untuk settingan lomba, kroto biasanya dinaikkan pada H-2 atau H-1 agar burung lebih ngotot.
              </p>
            </div>

            {/* Ulat Hongkong */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-rose-400">Ulat Hongkong (Daya Gedor Instan)</h5>
                <span className="text-[10px] text-slate-400 font-mono">Sifat: Panas</span>
              </div>
              <p className="text-xs text-slate-300">
                Bersifat panas. Diberikan sedikit saja (2-3 ekor) saat cuaca dingin atau tepat sebelum naik gantangan lomba untuk memancing emosi dan daya gedor secara instan.
              </p>
            </div>

            {/* Mandi & Jemur */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-2.5 bg-yellow-950/30 border border-yellow-800/40 rounded-xl">
                <div className="font-bold text-yellow-300 mb-0.5">Penjemuran</div>
                <div className="text-[11px] text-slate-300">
                  Untuk menaikkan emosi dan fisik (normalnya 30 - 60 menit di pagi hari).
                </div>
              </div>

              <div className="p-2.5 bg-cyan-950/30 border border-cyan-800/40 rounded-xl">
                <div className="font-bold text-cyan-300 mb-0.5">Pemandian</div>
                <div className="text-[11px] text-slate-300">
                  Untuk meredam birahi dan menstabilkan suhu tubuh (normalnya sore hari atau 2 hari sekali).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
