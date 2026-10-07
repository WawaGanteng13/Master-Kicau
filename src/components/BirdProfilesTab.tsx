import React, { useState } from 'react';
import { 
  Plus, 
  Flame, 
  Snowflake, 
  Award, 
  Trash2, 
  CheckCircle, 
  HelpCircle, 
  Info,
  Shield,
  Feather
} from 'lucide-react';
import { BirdProfile, KarakterDasar } from '../types/kicau';

interface BirdProfilesTabProps {
  birds: BirdProfile[];
  currentBird: BirdProfile;
  onSelectBird: (bird: BirdProfile) => void;
  onAddBird: (newBird: BirdProfile) => void;
  onDeleteBird: (birdId: string) => void;
}

export const BirdProfilesTab: React.FC<BirdProfilesTabProps> = ({
  birds,
  currentBird,
  onSelectBird,
  onAddBird,
  onDeleteBird,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInfoKarakter, setShowInfoKarakter] = useState(false);

  const [namaBurung, setNamaBurung] = useState('');
  const [jenisBurung, setJenisBurung] = useState('Murai Batu Medan');
  const [karakterDasar, setKarakterDasar] = useState<KarakterDasar>('Tipe Dingin');
  const [ringNumber, setRingNumber] = useState('');
  const [usiaBulan, setUsiaBulan] = useState(24);
  const [prestasi, setPrestasi] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaBurung.trim()) return;

    const newBird: BirdProfile = {
      bird_id: `b-${Date.now()}`,
      user_id: 'u1-kicau-master',
      nama_burung: namaBurung,
      jenis_burung: jenisBurung,
      karakter_dasar: karakterDasar,
      ring_number: ringNumber || `RING-${Math.floor(1000 + Math.random() * 9000)}`,
      usia_bulan: Number(usiaBulan) || 24,
      prestasi: prestasi || 'Burung Prospek Gantangan',
      avatar_url: jenisBurung.includes('Cucak') 
        ? 'https://images.unsplash.com/photo-1520808663317-647b476a81b9?w=400' 
        : 'https://images.unsplash.com/photo-1555169062-013468b47731?w=400',
    };

    onAddBird(newBird);
    setShowAddModal(false);
    setNamaBurung('');
    setRingNumber('');
    setPrestasi('');
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <span>Daftar Burung Anda</span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-800/40">
              Table: Bird_Profiles
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manajemen gacoan & profil karakter dasar
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tambah Burung</span>
        </button>
      </div>

      {/* Guide Banner: Tipe Panas vs Tipe Dingin */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold text-slate-200">
              Mengapa Karakter Dasar Sangat Menentukan?
            </span>
          </div>
          <button
            onClick={() => setShowInfoKarakter(!showInfoKarakter)}
            className="text-[11px] text-emerald-400 font-semibold hover:underline"
          >
            {showInfoKarakter ? 'Tutup' : 'Lihat Penjelasan'}
          </button>
        </div>

        {showInfoKarakter && (
          <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-cyan-950/40 border border-cyan-800/50 p-2.5 rounded-xl">
              <div className="flex items-center gap-1.5 font-bold text-cyan-300 mb-1">
                <Snowflake className="w-3.5 h-3.5" />
                <span>Tipe Dingin</span>
              </div>
              <p className="text-slate-300 text-[10px] leading-relaxed">
                Karakter kalem, emosi lambat naik tapi stabil. Butuh penjemuran lebih lama (atau sauna), mandi jarang/sore, dan asupan jangkrik lebih tinggi (7/7) untuk mendongkrak power tarung.
              </p>
            </div>

            <div className="bg-rose-950/40 border border-rose-800/50 p-2.5 rounded-xl">
              <div className="flex items-center gap-1.5 font-bold text-rose-300 mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span>Tipe Panas</span>
              </div>
              <p className="text-slate-300 text-[10px] leading-relaxed">
                Karakter gampang emosi & agresif. Rentan over-birahi jika dijemur lama atau diberi jangkrik terlalu banyak. Butuh mandi sering / mandi malam air sejuk dan jangkrik moderat (3/3 - 4/4).
              </p>
            </div>
          </div>
        )}
      </div>

      {/* List of Bird Profiles */}
      <div className="space-y-3">
        {birds.map((bird) => {
          const isSelected = bird.bird_id === currentBird.bird_id;
          return (
            <div
              key={bird.bird_id}
              onClick={() => onSelectBird(bird)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-r from-slate-900 via-emerald-950/50 to-slate-900 border-emerald-500/80 shadow-lg ring-1 ring-emerald-500/50'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={bird.avatar_url || 'https://images.unsplash.com/photo-1555169062-013468b47731?w=150'}
                      alt={bird.nama_burung}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-700"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 p-1 rounded-full text-[9px] font-bold ${
                        bird.karakter_dasar === 'Tipe Panas'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50'
                          : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                      }`}
                    >
                      {bird.karakter_dasar === 'Tipe Panas' ? (
                        <Flame className="w-3 h-3 text-rose-400" />
                      ) : (
                        <Snowflake className="w-3 h-3 text-cyan-400" />
                      )}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold text-white">
                        {bird.nama_burung}
                      </h3>
                      {isSelected && (
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800/60">
                          Aktif
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 font-medium">
                      {bird.jenis_burung}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span className="font-mono text-emerald-400/90">{bird.ring_number}</span>
                      <span>•</span>
                      <span className={bird.karakter_dasar === 'Tipe Panas' ? 'text-rose-400' : 'text-cyan-400'}>
                        {bird.karakter_dasar}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {bird.bird_id.substring(0, 8)}
                  </span>
                  {birds.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBird(bird.bird_id);
                      }}
                      className="text-slate-600 hover:text-rose-400 p-1"
                      title="Hapus Burung"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {bird.prestasi && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-slate-300">
                  <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{bird.prestasi}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Bird Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-3xl p-5 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h3 className="text-sm font-extrabold text-white">Tambah Gacoan Baru</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nama Burung</label>
                <input
                  type="text"
                  value={namaBurung}
                  onChange={(e) => setNamaBurung(e.target.value)}
                  placeholder="Misal: Si Badai / Panglima / Avatar Jr"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Jenis Burung</label>
                <select
                  value={jenisBurung}
                  onChange={(e) => setJenisBurung(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Murai Batu Medan">Murai Batu Medan</option>
                  <option value="Murai Batu Borneo">Murai Batu Borneo</option>
                  <option value="Cucak Ijo Banyuwangi">Cucak Ijo Banyuwangi</option>
                  <option value="Kacer Jawa / Hitam">Kacer Jawa / Hitam</option>
                  <option value="Cendet Madura">Cendet Madura</option>
                  <option value="Kenari F1 / Yorkshire">Kenari F1 / Yorkshire</option>
                  <option value="Anis Merah Bali">Anis Merah Bali</option>
                  <option value="Lovebird Konslet">Lovebird Konslet</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Karakter Dasar Burung
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setKarakterDasar('Tipe Dingin')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-semibold transition-all ${
                      karakterDasar === 'Tipe Dingin'
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Snowflake className="w-3.5 h-3.5" />
                    <span>Tipe Dingin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setKarakterDasar('Tipe Panas')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-semibold transition-all ${
                      karakterDasar === 'Tipe Panas'
                        ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Tipe Panas</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Nomor Ring (Opsional)</label>
                <input
                  type="text"
                  value={ringNumber}
                  onChange={(e) => setRingNumber(e.target.value)}
                  placeholder="Misal: RING-BNR-8821"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Catatan Prestasi / Gaya Tarung</label>
                <input
                  type="text"
                  value={prestasi}
                  onChange={(e) => setPrestasi(e.target.value)}
                  placeholder="Misal: Gaya sujud rol cililin panjang"
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
                  Simpan Burung
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
