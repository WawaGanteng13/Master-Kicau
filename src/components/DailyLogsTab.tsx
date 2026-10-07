import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Sun, 
  Droplet, 
  Utensils, 
  Flame, 
  Trash2, 
  Check, 
  Sparkles, 
  Clock, 
  ChevronDown, 
  TrendingUp, 
  Award,
  Sliders
} from 'lucide-react';
import { BirdProfile, DailyLog } from '../types/kicau';

interface DailyLogsTabProps {
  currentBird: BirdProfile;
  dailyLogs: DailyLog[];
  onAddLog: (newLog: DailyLog) => void;
  onDeleteLog: (logId: string) => void;
}

export const DailyLogsTab: React.FC<DailyLogsTabProps> = ({
  currentBird,
  dailyLogs,
  onAddLog,
  onDeleteLog,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [porsiJangkrik, setPorsiJangkrik] = useState('5/5');
  const [krotoGram, setKrotoGram] = useState(10);
  const [jemurMenit, setJemurMenit] = useState(25);
  const [mandi, setMandi] = useState('Keramba Sore (16.00)');
  const [efTambahan, setEfTambahan] = useState('Ulat Hongkong 2 ekor');
  const [catatan, setCatatan] = useState('');

  // Filter logs for the active bird
  const birdLogs = dailyLogs.filter((l) => l.bird_id === currentBird.bird_id);

  const applyPreset = (presetName: string) => {
    if (presetName === 'dingin_boost') {
      setPorsiJangkrik('7/7');
      setKrotoGram(15);
      setJemurMenit(35);
      setMandi('Keramba Pagi (09.00)');
      setEfTambahan('Ulat Hongkong 3 ekor');
      setCatatan('Settingan rekomendasi Abah Sony: dongkrak suhu tubuh & tenaga tipe dingin.');
    } else if (presetName === 'panas_redam') {
      setPorsiJangkrik('4/4');
      setKrotoGram(0);
      setJemurMenit(15);
      setMandi('Mandi Malam Air Sejuk (19.30)');
      setEfTambahan('Cacing Tanah 1 ekor');
      setCatatan('Meredam over birahi & emosi meledak-ledak pada burung tipe panas.');
    } else if (presetName === 'harian_stabil') {
      setPorsiJangkrik('5/5');
      setKrotoGram(5);
      setJemurMenit(25);
      setMandi('Keramba Sore (16.00)');
      setEfTambahan('-');
      setCatatan('Rawatan harian stabil untuk menjaga birahi dan stamina.');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: DailyLog = {
      log_id: `log-${Date.now()}`,
      bird_id: currentBird.bird_id,
      tanggal,
      porsi_jangkrik: porsiJangkrik,
      kroto_gram: Number(krotoGram) || 0,
      jemur_menit: Number(jemurMenit) || 0,
      mandi,
      ef_tambahan: efTambahan,
      catatan: catatan || 'Log harian rutin tercatat dengan baik.',
    };

    onAddLog(newLog);
    setShowAddModal(false);
    setCatatan('');
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <span>Buku Rawatan Harian</span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-800/40">
              Table: Daily_Logs
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Histori pakan EF & jemur untuk {currentBird.nama_burung}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tambah Log</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold uppercase">
            <Utensils className="w-3.5 h-3.5 text-emerald-400" />
            <span>Jangkrik Rata-rata</span>
          </div>
          <div className="text-base font-extrabold text-emerald-400 mt-1">
            {birdLogs[0]?.porsi_jangkrik || '5/5'}
          </div>
          <span className="text-[9px] text-slate-400">Porsi Pagi/Sore</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Kroto Bersih</span>
          </div>
          <div className="text-base font-extrabold text-amber-300 mt-1">
            {birdLogs[0]?.kroto_gram || 10}g
          </div>
          <span className="text-[9px] text-slate-400">Pemberian Terakhir</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold uppercase">
            <Sun className="w-3.5 h-3.5 text-yellow-400" />
            <span>Durasi Jemur</span>
          </div>
          <div className="text-base font-extrabold text-yellow-300 mt-1">
            {birdLogs[0]?.jemur_menit || 25} mnt
          </div>
          <span className="text-[9px] text-slate-400">Per Hari</span>
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
          <span>Riwayat 3 Hari Terakhir (Payload Gemini Pro)</span>
          <span className="text-[10px] text-slate-400 font-normal">
            Total {birdLogs.length} catatan
          </span>
        </div>

        {birdLogs.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 text-center text-slate-400">
            <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs">Belum ada catatan log harian untuk burung ini.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-3 text-xs text-emerald-400 font-semibold hover:underline"
            >
              + Buat Catatan Pertama
            </button>
          </div>
        ) : (
          birdLogs.map((log) => (
            <div
              key={log.log_id}
              className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3.5 shadow-md hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">{log.tanggal}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    Jangkrik {log.porsi_jangkrik}
                  </span>
                  <button
                    onClick={() => onDeleteLog(log.log_id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Hapus Log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-3 gap-2 my-2.5 text-[11px]">
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Kroto</span>
                  <span className="font-semibold text-amber-300">{log.kroto_gram} gram</span>
                </div>

                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Jemur</span>
                  <span className="font-semibold text-yellow-300">{log.jemur_menit} menit</span>
                </div>

                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Mandi</span>
                  <span className="font-semibold text-cyan-300 truncate block">{log.mandi || '-'}</span>
                </div>
              </div>

              {log.ef_tambahan && log.ef_tambahan !== '-' && (
                <div className="text-[11px] text-slate-300 bg-emerald-950/30 px-2.5 py-1 rounded-lg border border-emerald-900/40 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>EF Tambahan: {log.ef_tambahan}</span>
                </div>
              )}

              {log.catatan && (
                <p className="text-[11px] text-slate-400 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60 italic">
                  "{log.catatan}"
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal Add Daily Log */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-3xl p-5 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div>
                <h3 className="text-sm font-extrabold text-white">Catat Log Pakan Harian</h3>
                <p className="text-[11px] text-emerald-400">{currentBird.nama_burung} ({currentBird.karakter_dasar})</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {/* Quick Presets */}
            <div className="mb-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                Template Cepat Maestro:
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => applyPreset('dingin_boost')}
                  className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-semibold text-center hover:bg-cyan-900/60"
                >
                  Tipe Dingin (Power)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('panas_redam')}
                  className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 font-semibold text-center hover:bg-rose-900/60"
                >
                  Tipe Panas (Redam)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('harian_stabil')}
                  className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold text-center hover:bg-emerald-900/60"
                >
                  Rawatan Standar
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Tanggal</label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Porsi Jangkrik (P/S)</label>
                  <input
                    type="text"
                    value={porsiJangkrik}
                    onChange={(e) => setPorsiJangkrik(e.target.value)}
                    placeholder="Misal: 5/5 atau 7/7"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Kroto (Gram)</label>
                  <input
                    type="number"
                    value={krotoGram}
                    onChange={(e) => setKrotoGram(Number(e.target.value))}
                    placeholder="Gram"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Jemur (Menit)</label>
                  <input
                    type="number"
                    value={jemurMenit}
                    onChange={(e) => setJemurMenit(Number(e.target.value))}
                    placeholder="Menit"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Jadwal Mandi</label>
                  <select
                    value={mandi}
                    onChange={(e) => setMandi(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Keramba Pagi (08.00)">Keramba Pagi</option>
                    <option value="Keramba Sore (16.00)">Keramba Sore</option>
                    <option value="Mandi Malam (19.30)">Mandi Malam</option>
                    <option value="Semprot Halus">Semprot Halus</option>
                    <option value="Tanpa Mandi (Istirahat)">Tanpa Mandi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">EF Tambahan</label>
                <input
                  type="text"
                  value={efTambahan}
                  onChange={(e) => setEfTambahan(e.target.value)}
                  placeholder="Misal: Ulat Hongkong 2 ekor / Cacing"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Catatan Kondisi Burung</label>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Contoh: Burung mulai aktif bongkar isian cililin, ekor ngunci..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
                >
                  Simpan Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
