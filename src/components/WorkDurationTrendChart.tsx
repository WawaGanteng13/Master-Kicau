import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { 
  TrendingUp, 
  Activity, 
  Award, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  Info, 
  CheckCircle2 
} from 'lucide-react';
import { BirdProfile } from '../types/kicau';

interface WorkDurationTrendChartProps {
  currentBird: BirdProfile;
  latestScore?: number;
}

interface DayData {
  day: string;
  date: string;
  durasiKerja: number; // percentage 0-100%
  vokalScore: number;  // 0-100
  settingan: string;
  status: string;
}

export const WorkDurationTrendChart: React.FC<WorkDurationTrendChartProps> = ({
  currentBird,
  latestScore,
}) => {
  const [viewMode, setViewMode] = useState<'durasi' | 'komparasi'>('durasi');

  // Realistic 7-day data tailored per bird character
  const getHistoricalData = (): DayData[] => {
    if (currentBird.karakter_dasar === 'Tipe Dingin') {
      // MB Avatar (Tipe Dingin - progres naik setelah dijemur sauna & jangkrik dinaikkan)
      return [
        { day: 'Sen', date: '01 Okt', durasiKerja: 72, vokalScore: 84, settingan: 'Jangkrik 5/5, Jemur 20m', status: 'Ada jeda di menit 5' },
        { day: 'Sel', date: '02 Okt', durasiKerja: 75, vokalScore: 85, settingan: 'Jangkrik 5/5, Jemur 25m', status: 'Ngetem berkurang' },
        { day: 'Rab', date: '03 Okt', durasiKerja: 79, vokalScore: 87, settingan: 'Jangkrik 6/6, Kroto 10g', status: 'Cililin mulai keluar' },
        { day: 'Kam', date: '04 Okt', durasiKerja: 82, vokalScore: 89, settingan: 'Jangkrik 7/7, Jemur Sauna 20m', status: 'Rol Kenari rapat' },
        { day: 'Jum', date: '05 Okt', durasiKerja: 86, vokalScore: 91, settingan: 'Jangkrik 7/7, Mandi Keramba', status: 'Gaya sujud aktif' },
        { day: 'Sab', date: '06 Okt', durasiKerja: 88, vokalScore: 93, settingan: 'Jangkrik 7/7 + UH 2', status: 'Stabil awal-akhir' },
        { day: 'Min', date: '07 Okt', durasiKerja: latestScore || 91, vokalScore: 94, settingan: 'Top Form (Siap Gantang)', status: 'Bongkar isian 91%' },
      ];
    } else if (currentBird.jenis_burung.includes('Cucak')) {
      // Cucak Ijo (Jamtrok)
      return [
        { day: 'Sen', date: '01 Okt', durasiKerja: 70, vokalScore: 82, settingan: 'Pisang Kepok, Jemur 15m', status: 'Kurang ngentrok' },
        { day: 'Sel', date: '02 Okt', durasiKerja: 74, vokalScore: 84, settingan: 'Jangkrik 3/3, Apel merah', status: 'Bulu sayap mulai getar' },
        { day: 'Rab', date: '03 Okt', durasiKerja: 78, vokalScore: 85, settingan: 'Jangkrik 4/4, Semprot halus', status: 'Kapas tembak keluar' },
        { day: 'Kam', date: '04 Okt', durasiKerja: 80, vokalScore: 88, settingan: 'Jangkrik 4/4, Madu', status: 'Ngentrok jambul tegak' },
        { day: 'Jum', date: '05 Okt', durasiKerja: 83, vokalScore: 89, settingan: 'Jangkrik 3/3, Mandi sore', status: 'Vokal kristal stabil' },
        { day: 'Sab', date: '06 Okt', durasiKerja: 85, vokalScore: 90, settingan: 'Jangkrik 4/4, Kroto 5g', status: 'Cucak jenggot rapat' },
        { day: 'Min', date: '07 Okt', durasiKerja: latestScore || 87, vokalScore: 92, settingan: 'Top Form Jamtrok', status: 'Gaya jamtrok maksimal' },
      ];
    } else {
      // MB Raja Rimba (Tipe Panas - perbaikan over birahi)
      return [
        { day: 'Sen', date: '01 Okt', durasiKerja: 65, vokalScore: 80, settingan: 'Jangkrik 7/7 (Over)', status: 'Nabrak jeruji sangkar' },
        { day: 'Sel', date: '02 Okt', durasiKerja: 68, vokalScore: 82, settingan: 'Jangkrik 5/5, Mandi malam', status: 'Mulai tenang' },
        { day: 'Rab', date: '03 Okt', durasiKerja: 74, vokalScore: 84, settingan: 'Jangkrik 4/4, Mandi malam', status: 'Emosi terkontrol' },
        { day: 'Kam', date: '04 Okt', durasiKerja: 79, vokalScore: 86, settingan: 'Jangkrik 4/4, Jemur 15m', status: 'Rol Kenari teratur' },
        { day: 'Jum', date: '05 Okt', durasiKerja: 82, vokalScore: 88, settingan: 'Jangkrik 5/5, Umbaran', status: 'Fisik membaik' },
        { day: 'Sab', date: '06 Okt', durasiKerja: 84, vokalScore: 89, settingan: 'Jangkrik 5/5, Cacing 1', status: 'Tembakan terarah' },
        { day: 'Min', date: '07 Okt', durasiKerja: latestScore || 86, vokalScore: 90, settingan: 'Stabil Siap Latpres', status: 'Kerja ngunci di tangkringan' },
      ];
    }
  };

  const data = getHistoricalData();

  // Stats calculations
  const avgWork = Math.round(data.reduce((acc, curr) => acc + curr.durasiKerja, 0) / data.length);
  const highestWork = Math.max(...data.map((d) => d.durasiKerja));
  const diffFirstLast = data[data.length - 1].durasiKerja - data[0].durasiKerja;

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item: DayData = payload[0].payload;
      return (
        <div className="bg-slate-950/95 border border-emerald-500/50 p-3 rounded-2xl shadow-2xl backdrop-blur-md text-xs z-50 min-w-[190px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
            <span className="font-bold text-slate-200">{item.day}, {item.date}</span>
            <span className="text-[10px] text-emerald-400 font-mono">Hari ke-{data.indexOf(item) + 1}</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">Durasi Kerja:</span>
              <span className="font-extrabold text-emerald-400 text-sm">{item.durasiKerja}%</span>
            </div>

            {viewMode === 'komparasi' && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Kualitas Vokal:</span>
                <span className="font-bold text-cyan-300 text-xs">{item.vokalScore}/100</span>
              </div>
            )}

            <div className="text-[10px] text-amber-300 bg-amber-950/40 p-1.5 rounded-lg border border-amber-900/40 mt-1">
              <span className="font-semibold block text-slate-400">EF: {item.settingan}</span>
              <span className="italic">"{item.status}"</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
              <span>Tren Durasi Kerja 7 Hari</span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800/60">
                Bunyi vs Ngetem
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">
              Progres performa {currentBird.nama_burung} ({currentBird.karakter_dasar})
            </p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-[10px] font-bold">
          <button
            onClick={() => setViewMode('durasi')}
            className={`px-2 py-1 rounded-lg transition-all ${
              viewMode === 'durasi'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Durasi
          </button>
          <button
            onClick={() => setViewMode('komparasi')}
            className={`px-2 py-1 rounded-lg transition-all ${
              viewMode === 'komparasi'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            + Vokal
          </button>
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Rata-Rata</span>
          <div className="text-base font-extrabold text-emerald-400 mt-0.5">{avgWork}%</div>
          <span className="text-[9px] text-slate-500">7 Hari Terakhir</span>
        </div>

        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Puncak (Max)</span>
          <div className="text-base font-extrabold text-amber-300 mt-0.5">{highestWork}%</div>
          <span className="text-[9px] text-amber-400/80 font-medium">Top Performance</span>
        </div>

        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Kenaikan</span>
          <div className="text-base font-extrabold text-cyan-300 mt-0.5">
            {diffFirstLast > 0 ? `+${diffFirstLast}%` : `${diffFirstLast}%`}
          </div>
          <span className="text-[9px] text-slate-500">Tren Positif</span>
        </div>
      </div>

      {/* Recharts Area Chart Container */}
      <div className="w-full h-44 pt-2 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 12, left: -22, bottom: 0 }}>
            <defs>
              {/* Emerald Gradient for Durasi Kerja */}
              <linearGradient id="colorDurasi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>

              {/* Cyan Gradient for Vokal Score */}
              <linearGradient id="colorVokal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
            />

            <YAxis
              domain={[50, 100]}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tick={{ fill: '#64748b', fontSize: 9 }}
              ticks={[60, 75, 85, 100]}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Benchmark line: 85% is National Champion Standard */}
            <ReferenceLine
              y={85}
              stroke="#eab308"
              strokeDasharray="4 4"
              label={{
                value: 'Standar Juara 85%',
                position: 'insideTopRight',
                fill: '#facc15',
                fontSize: 9,
                fontWeight: 700,
              }}
            />

            {/* Durasi Kerja Area */}
            <Area
              type="monotone"
              dataKey="durasiKerja"
              name="Durasi Kerja (%)"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorDurasi)"
              activeDot={{ r: 5, fill: '#34d399', stroke: '#064e3b', strokeWidth: 2 }}
            />

            {/* Optional Komparasi Vokal Area */}
            {viewMode === 'komparasi' && (
              <Area
                type="monotone"
                dataKey="vokalScore"
                name="Kualitas Vokal"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVokal)"
                activeDot={{ r: 4, fill: '#67e8f9', stroke: '#164e63', strokeWidth: 2 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Gantangan Benchmark Legend */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            <span className="text-slate-300 font-medium">Durasi Kerja (%)</span>
          </div>
          {viewMode === 'komparasi' && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
              <span className="text-slate-300 font-medium">Kualitas Vokal</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-amber-300">
          <Award className="w-3 h-3 text-amber-400" />
          <span className="font-semibold">Target &gt;85% (Koncer A)</span>
        </div>
      </div>
    </div>
  );
};
