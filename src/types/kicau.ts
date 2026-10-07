export type TierType = 'free' | 'pro';

export type KarakterDasar = 'Tipe Dingin' | 'Tipe Panas';

export interface BirdProfile {
  bird_id: string;
  user_id: string;
  nama_burung: string;
  jenis_burung: string;
  karakter_dasar: KarakterDasar;
  ring_number?: string;
  avatar_url?: string;
  usia_bulan?: number;
  prestasi?: string;
}

export interface DailyLog {
  log_id: string;
  bird_id: string;
  tanggal: string; // YYYY-MM-DD
  porsi_jangkrik: string; // Misal: "5/5"
  kroto_gram: number;
  jemur_menit: number;
  mandi?: string; // "Keramba Pagi", "Keramba Sore", "Semprot Halus"
  ef_tambahan?: string; // "Ulat Hongkong 3", "Cacing 1", "Minyak Ikan"
  catatan?: string;
}

export interface AnalysisRecord {
  id: string;
  bird_id: string;
  bird_name: string;
  tier: TierType;
  timestamp: string;
  media_type: 'audio' | 'video';
  media_name: string;
  materi_isian: string[];
  vokal_score: number;
  durasi_kerja: number;
  gaya_tarung?: string;
  resep_maestro?: string;
  raw_report: string;
}

export interface PresetSample {
  id: string;
  title: string;
  bird_type: string;
  character: KarakterDasar;
  description: string;
  duration: string;
  media_type: 'video' | 'audio';
  thumbnail: string;
  audioFrequencyData: number[];
  sampleLog: DailyLog;
}

export interface MasteranSegment {
  id: string;
  sound: 'cililin' | 'tengkek' | 'kenari' | 'kapas' | 'gereja';
  name: string;
  durationSec: number;
  type: 'tembakan' | 'ngeroll' | 'besetan';
}

export interface MasteranPreset {
  id: string;
  title: string;
  description: string;
  category: string;
  segments: MasteranSegment[];
  pauseIntervalSec: number; // SOP Pemasteran jeda
  loop: boolean;
  alasanMastering: string;
}

export interface ChampionTrack {
  id: string;
  nama_burung: string;
  gelar: string;
  jenis_burung: string;
  karakter: KarakterDasar;
  ring_number: string;
  sound_type: 'avatar_full' | 'raja_rimba_full' | 'semar_mesem_full' | 'cucak_ijo_full' | 'kacer_full';
  materi_unggulan: string[];
  durasi: string;
  frekuensi_khz: string;
  deskripsi: string;
  alasan_kurasi: string;
  audio_quality: string;
  is_exclusive_pro: boolean;
  avatar_url: string;
  segments: MasteranSegment[];
}
