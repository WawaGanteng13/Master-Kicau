import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, 
  Play, 
  Pause, 
  RotateCcw, 
  Repeat, 
  Plus, 
  Trash2, 
  Sparkles, 
  Sliders, 
  Volume2, 
  Clock, 
  Layers, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Radio,
  Timer,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Hand,
  Crown,
  Lock,
  Download,
  Star,
  ExternalLink,
  ShieldCheck,
  Disc3,
  Award
} from 'lucide-react';
import { MasteranPreset, MasteranSegment, BirdProfile, ChampionTrack, TierType } from '../types/kicau';
import { CHAMPION_TRACKS } from '../data/mockData';
import { stitchedMasteranPlayer, StitchedPlaybackState, birdAudioEngine } from '../utils/audioSynthesizer';
import { AudioVisualizer } from './AudioVisualizer';

interface MasteranStudioTabProps {
  currentBird: BirdProfile;
  tier?: TierType;
  onUpgradeClick?: () => void;
}

const DEFAULT_PRESETS: MasteranPreset[] = [
  {
    id: 'p1-kenari-cililin',
    title: 'Rol Kenari Sambung Cililin Panjang',
    description: 'Kombinasi terpopuler gantangan: roll Kenari cengkok halus merapatkan jeda ngetem, disusul tembakan Cililin melengking tajam.',
    category: 'Gantangan Nasional',
    pauseIntervalSec: 4,
    loop: true,
    alasanMastering: 'Kenari melatih burung terus bunyi tanpa jeda (anti-ngetem), lalu Cililin melatih senjata tembakan saat berhadapan dengan lawan.',
    segments: [
      { id: 's1', sound: 'kenari', name: 'Kenari Ngeroll Cengkok', durationSec: 4, type: 'ngeroll' },
      { id: 's2', sound: 'cililin', name: 'Cililin Tembak Panjang Rapat', durationSec: 5, type: 'tembakan' },
    ],
  },
  {
    id: 'p2-full-tembakan',
    title: 'Paket Tembakan Kasar (Cililin + Tengkek Buto)',
    description: 'Duet tembakan berbobot: Cililin nada tinggi tajam disambung Tengkek Buto nada tebal bergemuruh.',
    category: 'Full Tembakan',
    pauseIntervalSec: 5,
    loop: true,
    alasanMastering: 'Melatih variasi tembakan bertingkat dari frekuensi tinggi ke frekuensi tebal untuk memecah konsentrasi burung lawan.',
    segments: [
      { id: 's3', sound: 'cililin', name: 'Cililin Melengking Tajam', durationSec: 4.5, type: 'tembakan' },
      { id: 's4', sound: 'tengkek', name: 'Tengkek Buto Kasar Tebal', durationSec: 3.5, type: 'tembakan' },
    ],
  },
  {
    id: 'p3-trio-mewah',
    title: 'Kombinasi 3 Dimensi (Kenari + Kapas Tembak + Cililin)',
    description: 'Rangkaian lengkap: roll Kenari, crecetan Kapas Tembak pembongkar emosi, dan gong tembakan Cililin.',
    category: 'Kombinasi Komplit',
    pauseIntervalSec: 4,
    loop: true,
    alasanMastering: 'Memberikan materi komplit 3 karakter: ngeroll (jeda rapat), besetan (bongkar emosi), dan tembakan (senjata pukulan).',
    segments: [
      { id: 's5', sound: 'kenari', name: 'Kenari Cengkok Rol', durationSec: 3.5, type: 'ngeroll' },
      { id: 's6', sound: 'kapas', name: 'Kapas Tembak Crecetan', durationSec: 3, type: 'besetan' },
      { id: 's7', sound: 'cililin', name: 'Cililin Tembak Panjang', durationSec: 4.5, type: 'tembakan' },
    ],
  },
  {
    id: 'p4-besetan-tajam',
    title: 'Paket Besetan Rapat (Gereja Tarung + Kapas Tembak)',
    description: 'Besetan tajam crecetan rapat untuk mengunci emosi lawan di gantangan.',
    category: 'Besetan',
    pauseIntervalSec: 3,
    loop: true,
    alasanMastering: 'Bagus untuk variasi lagu di sela-sela rol agar burung tidak monoton dan memiliki daya kejut tajam.',
    segments: [
      { id: 's8', sound: 'gereja', name: 'Gereja Tarung Tajam', durationSec: 2.5, type: 'besetan' },
      { id: 's9', sound: 'kapas', name: 'Kapas Tembak Kasar', durationSec: 3.5, type: 'besetan' },
    ],
  },
];

export const MasteranStudioTab: React.FC<MasteranStudioTabProps> = ({ 
  currentBird, 
  tier = 'free', 
  onUpgradeClick 
}) => {
  const [subTab, setSubTab] = useState<'stitcher' | 'champion_tracks'>('stitcher');
  const [activeChampionTrack, setActiveChampionTrack] = useState<ChampionTrack>(CHAMPION_TRACKS[0]);
  const [isPlayingChampion, setIsPlayingChampion] = useState<boolean>(false);
  const [championDemoTimer, setChampionDemoTimer] = useState<number>(0);
  const [cachedChampionIds, setCachedChampionIds] = useState<string[]>([]);
  const [championToast, setChampionToast] = useState<string | null>(null);

  const [activePreset, setActivePreset] = useState<MasteranPreset>(DEFAULT_PRESETS[0]);
  const [segments, setSegments] = useState<MasteranSegment[]>(DEFAULT_PRESETS[0].segments);
  const [pauseIntervalSec, setPauseIntervalSec] = useState<number>(DEFAULT_PRESETS[0].pauseIntervalSec);
  const [isLooping, setIsLooping] = useState<boolean>(true);

  // Playback state
  const [playbackState, setPlaybackState] = useState<StitchedPlaybackState>({
    currentSegmentIndex: -1,
    isPausedInterval: false,
    isPlaying: false,
    loopCount: 0,
  });

  // AI Stitcher Generator State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Timer Session
  const [timerMinutes, setTimerMinutes] = useState<number>(0); // 0 = nonstop
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(0);

  // Drag and drop / Hold-to-drag reordering state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Mobile Touch & Pointer Long-Press / Hold-to-drag state
  const [heldIndex, setHeldIndex] = useState<number | null>(null);
  const [targetDropIndex, setTargetDropIndex] = useState<number | null>(null);
  const [isTouchHolding, setIsTouchHolding] = useState<boolean>(false);
  const [previewingSegmentId, setPreviewingSegmentId] = useState<string | null>(null);

  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isHoldingActiveRef = useRef<boolean>(false);

  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= segments.length || toIndex >= segments.length) return;
    stitchedMasteranPlayer.stop();
    setSegments((prev) => {
      const updated = [...prev];
      const [movedItem] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedItem);
      return updated;
    });
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      handleReorder(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < segments.length - 1) {
      handleReorder(index, index + 1);
    }
  };

  // Preview individual sound segment without playing the full loop
  const handlePreviewSingleSound = (seg: MasteranSegment) => {
    if (playbackState.isPlaying) {
      stitchedMasteranPlayer.stop();
    }
    if (previewingSegmentId === seg.id) {
      birdAudioEngine.stop();
      setPreviewingSegmentId(null);
      return;
    }

    birdAudioEngine.stop();
    setPreviewingSegmentId(seg.id);
    const durMs = Math.max(1500, Math.min(4000, seg.durationSec * 1000));

    if (seg.sound === 'cililin') {
      birdAudioEngine.playCililinBurst(durMs);
    } else if (seg.sound === 'tengkek') {
      birdAudioEngine.playTengkekButo(durMs);
    } else if (seg.sound === 'kenari') {
      birdAudioEngine.playKenariTrill(durMs);
    } else if (seg.sound === 'kapas') {
      birdAudioEngine.playKapasTembak(durMs);
    } else if (seg.sound === 'gereja') {
      birdAudioEngine.playGerejaTarung(durMs);
    } else {
      birdAudioEngine.playMuraiBatuRol(durMs);
    }

    window.setTimeout(() => {
      setPreviewingSegmentId((prev) => (prev === seg.id ? null : prev));
    }, durMs);
  };

  // Hold gesture triggers (touch or pointer press)
  const clearHoldTimer = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const startHoldGesture = (index: number, clientX: number, clientY: number, immediate = false) => {
    clearHoldTimer();
    touchStartPosRef.current = { x: clientX, y: clientY };
    isHoldingActiveRef.current = true;

    if (immediate) {
      setHeldIndex(index);
      setTargetDropIndex(index);
      setIsTouchHolding(true);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(40);
      }
      return;
    }

    // 180ms hold threshold triggers drag mode
    holdTimerRef.current = setTimeout(() => {
      if (isHoldingActiveRef.current) {
        setHeldIndex(index);
        setTargetDropIndex(index);
        setIsTouchHolding(true);
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(40);
        }
      }
    }, 180);
  };

  const moveHoldGesture = (clientX: number, clientY: number) => {
    if (!isHoldingActiveRef.current) return;

    if (!isTouchHolding) {
      const dist = Math.hypot(
        clientX - touchStartPosRef.current.x,
        clientY - touchStartPosRef.current.y
      );
      if (dist > 12) {
        // Cancel hold timer if user moved finger before hold timer completed (normal scroll)
        clearHoldTimer();
      }
      return;
    }

    // Drag is active: find hover target segment element
    const elem = document.elementFromPoint(clientX, clientY);
    if (elem) {
      const card = elem.closest('[data-segment-index]');
      if (card) {
        const rawIdx = card.getAttribute('data-segment-index');
        if (rawIdx !== null) {
          const hoverIdx = parseInt(rawIdx, 10);
          if (!isNaN(hoverIdx) && hoverIdx >= 0 && hoverIdx < segments.length) {
            setTargetDropIndex(hoverIdx);
          }
        }
      }
    }
  };

  const endHoldGesture = () => {
    clearHoldTimer();
    isHoldingActiveRef.current = false;

    if (heldIndex !== null && targetDropIndex !== null && heldIndex !== targetDropIndex) {
      handleReorder(heldIndex, targetDropIndex);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([30, 30]);
      }
    }

    setHeldIndex(null);
    setTargetDropIndex(null);
    setIsTouchHolding(false);
  };

  // Global window listeners for pointerup / pointermove while dragging
  useEffect(() => {
    if (!isTouchHolding) return;

    const handleWindowPointerMove = (e: PointerEvent) => {
      moveHoldGesture(e.clientX, e.clientY);
    };

    const handleWindowPointerUp = () => {
      endHoldGesture();
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);
    window.addEventListener('pointercancel', handleWindowPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
      window.removeEventListener('pointercancel', handleWindowPointerUp);
    };
  }, [isTouchHolding, heldIndex, targetDropIndex, segments.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stitchedMasteranPlayer.stop();
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    let interval: any;
    if (playbackState.isPlaying && timeRemainingSeconds > 0) {
      interval = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            stitchedMasteranPlayer.stop();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playbackState.isPlaying, timeRemainingSeconds]);

  // Champion Track Handlers
  const handleTogglePlayChampion = (track: ChampionTrack) => {
    if (isPlayingChampion && activeChampionTrack.id === track.id) {
      birdAudioEngine.stop();
      setIsPlayingChampion(false);
      setChampionDemoTimer(0);
      return;
    }

    stitchedMasteranPlayer.stop();
    birdAudioEngine.stop();
    setActiveChampionTrack(track);
    setIsPlayingChampion(true);

    const isPro = tier === 'pro';
    const durMs = isPro ? 8000 : 15000;

    if (track.sound_type === 'avatar_full') {
      birdAudioEngine.playAvatarMasterRecording(durMs);
    } else if (track.sound_type === 'semar_mesem_full') {
      birdAudioEngine.playSemarMesemRecording(durMs);
    } else if (track.sound_type === 'raja_rimba_full') {
      birdAudioEngine.playRajaRimbaRecording(durMs);
    } else if (track.sound_type === 'cucak_ijo_full') {
      birdAudioEngine.playCucakIjoRecording(durMs);
    } else {
      birdAudioEngine.playKacerRecording(durMs);
    }

    if (!isPro) {
      setChampionDemoTimer(15);
      const interval = setInterval(() => {
        setChampionDemoTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            birdAudioEngine.stop();
            setIsPlayingChampion(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleImportChampionToStudio = (track: ChampionTrack) => {
    if (tier !== 'pro') {
      if (onUpgradeClick) onUpgradeClick();
      return;
    }

    stitchedMasteranPlayer.stop();
    birdAudioEngine.stop();
    setIsPlayingChampion(false);

    setSegments(track.segments);
    setActivePreset({
      id: `preset-${track.id}`,
      title: `Rangkaian ${track.nama_burung}`,
      description: `Diimpor dari rekaman masteran juara: ${track.gelar}`,
      category: 'Burung Juara VIP',
      pauseIntervalSec: 4,
      loop: true,
      alasanMastering: track.alasan_kurasi,
      segments: track.segments,
    });
    setSubTab('stitcher');

    setChampionToast(`Rangkaian lagu ${track.nama_burung} berhasil dimuat ke Studio Masteran!`);
    setTimeout(() => setChampionToast(null), 3500);
  };

  const handleCacheChampionOffline = (track: ChampionTrack) => {
    if (tier !== 'pro') {
      if (onUpgradeClick) onUpgradeClick();
      return;
    }

    setCachedChampionIds((prev) =>
      prev.includes(track.id) ? prev : [...prev, track.id]
    );
    setChampionToast(`✓ Audio master ${track.nama_burung} tersimpan ke cache offline HP!`);
    setTimeout(() => setChampionToast(null), 3000);
  };

  const selectPreset = (p: MasteranPreset) => {
    stitchedMasteranPlayer.stop();
    setActivePreset(p);
    setSegments(p.segments);
    setPauseIntervalSec(p.pauseIntervalSec);
    setIsLooping(p.loop);
  };

  const handleTogglePlay = () => {
    if (playbackState.isPlaying) {
      stitchedMasteranPlayer.stop();
    } else {
      if (timerMinutes > 0 && timeRemainingSeconds === 0) {
        setTimeRemainingSeconds(timerMinutes * 60);
      }
      stitchedMasteranPlayer.playSequence(
        segments,
        pauseIntervalSec,
        isLooping,
        (state) => {
          setPlaybackState(state);
        }
      );
    }
  };

  const handleAiStitch = async () => {
    if (!aiPrompt.trim() || isAiGenerating) return;
    setIsAiGenerating(true);
    stitchedMasteranPlayer.stop();

    try {
      const response = await fetch('/api/stitch-masteran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          birdProfile: currentBird,
        }),
      });

      const data = await response.json();
      if (data.success && data.preset) {
        setActivePreset(data.preset);
        setSegments(data.preset.segments || []);
        setPauseIntervalSec(data.preset.pauseIntervalSec || 4);
        setIsLooping(data.preset.loop !== false);
        setAiPrompt('');
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error(err);
      // Fallback custom arrangement
      const fallbackPreset: MasteranPreset = {
        id: `ai-${Date.now()}`,
        title: `Racikan AI: ${aiPrompt.slice(0, 24)}...`,
        description: `Kombinasi lagu masteran khusus untuk ${currentBird.nama_burung}.`,
        category: 'Kustom AI Stitcher',
        pauseIntervalSec: 4,
        loop: true,
        alasanMastering: 'Mengawali dengan ngeroll Kenari untuk merapatkan jeda ngetem, lalu tembakan Cililin melengking untuk daya gedor gantangan.',
        segments: [
          { id: `s-${Date.now()}-1`, sound: 'kenari', name: 'Kenari Ngeroll Cengkok', durationSec: 4, type: 'ngeroll' },
          { id: `s-${Date.now()}-2`, sound: 'cililin', name: 'Cililin Tembak Panjang Rapat', durationSec: 5, type: 'tembakan' },
        ],
      };
      setActivePreset(fallbackPreset);
      setSegments(fallbackPreset.segments);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleAddSegment = (sound: 'cililin' | 'tengkek' | 'kenari' | 'kapas' | 'gereja') => {
    stitchedMasteranPlayer.stop();
    const names = {
      cililin: { name: 'Cililin Tembak Panjang', dur: 4.5, type: 'tembakan' as const },
      tengkek: { name: 'Tengkek Buto Kasar Tebal', dur: 3.5, type: 'tembakan' as const },
      kenari: { name: 'Kenari Ngeroll Cengkok', dur: 4, type: 'ngeroll' as const },
      kapas: { name: 'Kapas Tembak Crecetan Kasar', dur: 3, type: 'besetan' as const },
      gereja: { name: 'Gereja Tarung Besetan Tajam', dur: 2.5, type: 'besetan' as const },
    };

    const info = names[sound];
    const newSeg: MasteranSegment = {
      id: `seg-${Date.now()}`,
      sound,
      name: info.name,
      durationSec: info.dur,
      type: info.type,
    };

    setSegments((prev) => [...prev, newSeg]);
  };

  const handleRemoveSegment = (index: number) => {
    if (segments.length <= 1) return;
    stitchedMasteranPlayer.stop();
    setSegments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDurationChange = (index: number, newDur: number) => {
    setSegments((prev) =>
      prev.map((s, i) => (i === index ? { ...s, durationSec: Math.max(1, newDur) } : s))
    );
  };

  const totalCycleSeconds =
    segments.reduce((acc, curr) => acc + curr.durationSec, 0) + pauseIntervalSec;

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/40 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Layers className="w-4 h-4" />
              </div>
              <h2 className="text-base font-extrabold text-white">
                Studio Masteran AI &amp; Audio Stitcher
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Rangkai potongan lagu spesifik, jahit otomatis dengan AI, dan putar berulang (Looping) sesuai SOP Pemasteran.
            </p>
          </div>
        </div>
      </div>

      {/* Toast Alert */}
      {championToast && (
        <div className="bg-emerald-950/90 border border-emerald-500/80 text-emerald-300 text-xs px-3.5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{championToast}</span>
        </div>
      )}

      {/* Mode Switcher: Stitcher vs Champion Tracks */}
      <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800 gap-1 shadow-inner">
        <button
          onClick={() => {
            setSubTab('stitcher');
            if (isPlayingChampion) {
              birdAudioEngine.stop();
              setIsPlayingChampion(false);
            }
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            subTab === 'stitcher'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Studio &amp; Stitcher</span>
        </button>

        <button
          onClick={() => {
            setSubTab('champion_tracks');
            stitchedMasteranPlayer.stop();
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative ${
            subTab === 'champion_tracks'
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-amber-300'
          }`}
        >
          <Crown className={`w-3.5 h-3.5 ${subTab === 'champion_tracks' ? 'text-slate-950 fill-slate-950' : 'text-amber-400'}`} />
          <span>Lagu Burung Juara</span>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full font-extrabold bg-amber-950 text-amber-300 border border-amber-500/50">
            VIP
          </span>
        </button>
      </div>

      {subTab === 'stitcher' ? (
        <>
          {/* AI Audio Stitcher Prompt Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-lg space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            AI Prompt Stitcher (Rangkai Otomatis)
          </span>
          <span className="text-[10px] text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800/60 font-mono">
            Smart Concatenator
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiStitch()}
            placeholder="Contoh: isian kenari tembak panjang disambung tembakan cililin rapat..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
          />
          <button
            onClick={handleAiStitch}
            disabled={isAiGenerating || !aiPrompt.trim()}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-xs flex items-center gap-1.5 hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all active:scale-95"
          >
            {isAiGenerating ? (
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5" />
            )}
            <span>{isAiGenerating ? 'Menjahit...' : 'Racik AI'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <Info className="w-3 h-3 text-indigo-400 shrink-0" />
          <span>AI akan menyusun urutan akustik terbaik &amp; menyisipkan jeda hening sesuai SOP pemasteran.</span>
        </div>
      </div>

      {/* Preset Masteran Populer Siap Pakai */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block px-1">
          Preset Kombinasi Juara (Siap Pakai):
        </span>
        <div className="grid grid-cols-2 gap-2">
          {DEFAULT_PRESETS.map((preset) => {
            const isSelected = activePreset.id === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => selectPreset(preset)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-950/60 to-slate-900 border-indigo-500/80 ring-1 ring-indigo-500/50 shadow-md'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-tight">
                      {preset.category}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white leading-tight">
                    {preset.title}
                  </h4>
                </div>

                <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span>{preset.segments.length} Potongan</span>
                  <span className="font-mono text-emerald-400">Looping</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIVE STITCHED TRACK PLAYER & TIMELINE */}
      <div className="bg-slate-900/95 border border-indigo-500/30 rounded-3xl p-4 shadow-2xl backdrop-blur-md space-y-4">
        {/* Track Title & Alasan Mastering */}
        <div className="border-b border-slate-800 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide block">
                Racikan Aktif:
              </span>
              <h3 className="text-sm font-extrabold text-white">
                {activePreset.title}
              </h3>
            </div>

            {/* Loop Counter Pill */}
            {playbackState.isPlaying && (
              <div className="flex items-center gap-1 text-[11px] font-mono text-indigo-300 bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-800/50">
                <Repeat className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                <span>Putaran #{playbackState.loopCount + 1}</span>
              </div>
            )}
          </div>

          {activePreset.alasanMastering && (
            <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 italic">
              "{activePreset.alasanMastering}"
            </p>
          )}
        </div>

        {/* Dynamic Multi-Segment Visual Timeline */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Rangkaian Potongan Lagu:</span>
            <span className="text-[10px] font-mono text-slate-400">
              Total 1 Siklus: ~{totalCycleSeconds.toFixed(1)}s
            </span>
          </div>

          {/* Interactive instruction banner */}
          <div className={`p-2.5 rounded-xl border text-[11px] transition-all flex items-center justify-between ${
            isTouchHolding
              ? 'bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 border-indigo-400 text-indigo-200 shadow-lg ring-1 ring-indigo-400 animate-pulse'
              : 'bg-slate-950/60 border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded-lg ${isTouchHolding ? 'bg-indigo-500 text-slate-950' : 'bg-slate-800 text-indigo-400'}`}>
                {isTouchHolding ? <Hand className="w-3.5 h-3.5 animate-bounce" /> : <GripVertical className="w-3.5 h-3.5" />}
              </div>
              <div>
                {isTouchHolding ? (
                  <span className="font-bold text-white">
                    ✊ Mode Hold Aktif: Lepaskan jari di posisi #{((targetDropIndex ?? heldIndex ?? 0) + 1)}!
                  </span>
                ) : (
                  <span>
                    <strong>Tahan (Hold)</strong> kartu atau ikon grip untuk Drag &amp; Drop urutan lagu, atau gunakan panah (▲/▼).
                  </span>
                )}
              </div>
            </div>
            {isTouchHolding && (
              <span className="text-[10px] font-mono font-bold bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-400/40">
                Pindah #{((targetDropIndex ?? heldIndex ?? 0) + 1)}
              </span>
            )}
          </div>

          {/* Timeline Track Segment Chips with Hold & Drag / Drop */}
          <div 
            className="space-y-2 select-none"
            onTouchMove={(e) => {
              if (isTouchHolding) {
                e.preventDefault();
                moveHoldGesture(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            onTouchEnd={endHoldGesture}
          >
            {segments.map((seg, idx) => {
              const isCurrent = playbackState.currentSegmentIndex === idx && !playbackState.isPausedInterval;
              const isBeingDragged = draggedIndex === idx;
              const isDraggedOver = dragOverIndex === idx && draggedIndex !== idx;
              const isHeld = heldIndex === idx;
              const isTargetDrop = targetDropIndex === idx && heldIndex !== null && heldIndex !== idx;
              const isPreviewing = previewingSegmentId === seg.id;

              return (
                <div key={seg.id} className="relative">
                  {/* Insertion drop target line if hovering above this item */}
                  {isTargetDrop && (
                    <div className="mb-1 py-1 px-3 rounded-lg bg-indigo-500/20 border border-indigo-400 text-indigo-300 text-[10px] font-bold flex items-center justify-between shadow-md animate-pulse">
                      <span>⬇ Pindahkan lagu ke posisi #{idx + 1} di sini</span>
                      <span className="font-mono">Drop</span>
                    </div>
                  )}

                  <div
                    data-segment-index={idx}
                    draggable={!isTouchHolding}
                    onDragStart={(e) => {
                      setDraggedIndex(idx);
                      e.dataTransfer.setData('text/plain', String(idx));
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                      if (dragOverIndex !== idx) setDragOverIndex(idx);
                    }}
                    onDragLeave={() => {
                      if (dragOverIndex === idx) setDragOverIndex(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedIndex !== null) {
                        handleReorder(draggedIndex, idx);
                      }
                      setDraggedIndex(null);
                      setDragOverIndex(null);
                    }}
                    onDragEnd={() => {
                      setDraggedIndex(null);
                      setDragOverIndex(null);
                    }}
                    onTouchStart={(e) => {
                      startHoldGesture(idx, e.touches[0].clientX, e.touches[0].clientY);
                    }}
                    onPointerDown={(e) => {
                      if (e.button === 0 && e.pointerType !== 'touch') {
                        startHoldGesture(idx, e.clientX, e.clientY);
                      }
                    }}
                    className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between cursor-grab active:cursor-grabbing select-none ${
                      isHeld
                        ? 'bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 border-indigo-400 shadow-2xl ring-2 ring-indigo-400 scale-[1.02] z-30'
                        : isTargetDrop
                        ? 'border-indigo-400 bg-indigo-950/70 ring-1 ring-indigo-400'
                        : isBeingDragged
                        ? 'opacity-40 border-dashed border-indigo-400 scale-[0.98] bg-slate-900'
                        : isDraggedOver
                        ? 'border-indigo-400 bg-indigo-950/80 ring-2 ring-indigo-400 shadow-xl'
                        : isCurrent
                        ? 'bg-gradient-to-r from-indigo-950 via-purple-950/80 to-slate-900 border-indigo-400 shadow-lg ring-2 ring-indigo-500/50 scale-[1.01]'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {/* Grip & Quick Reorder Shift Controls */}
                      <div className="flex items-center gap-1 text-slate-500">
                        <div 
                          className="cursor-grab active:cursor-grabbing p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-indigo-400 active:scale-95 transition-all touch-none" 
                          title="Tahan dan geser untuk ubah urutan"
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            startHoldGesture(idx, e.touches[0].clientX, e.touches[0].clientY, true);
                          }}
                          onPointerDown={(e) => {
                            if (e.button === 0) {
                              e.stopPropagation();
                              startHoldGesture(idx, e.clientX, e.clientY, true);
                            }
                          }}
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col -space-y-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveUp(idx);
                            }}
                            disabled={idx === 0}
                            className="text-slate-500 hover:text-indigo-300 disabled:opacity-20 disabled:cursor-not-allowed p-0.5"
                            title="Pindah ke atas"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveDown(idx);
                            }}
                            disabled={idx === segments.length - 1}
                            className="text-slate-500 hover:text-indigo-300 disabled:opacity-20 disabled:cursor-not-allowed p-0.5"
                            title="Pindah ke bawah"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Numbering Pill */}
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          isHeld
                            ? 'bg-indigo-400 text-slate-950 font-black ring-2 ring-indigo-300'
                            : isCurrent
                            ? 'bg-indigo-500 text-slate-950 font-black animate-pulse'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {idx + 1}
                      </div>

                      {/* Segment Name & Metadata */}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate max-w-[125px]">
                            {seg.name}
                          </span>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                              seg.type === 'tembakan'
                                ? 'bg-amber-500/20 text-amber-300'
                                : seg.type === 'ngeroll'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-cyan-500/20 text-cyan-300'
                            }`}
                          >
                            {seg.type}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <span>Durasi: {seg.durationSec}s</span>
                          <span>•</span>
                          <span className={isHeld ? 'text-indigo-300 font-bold' : isCurrent ? 'text-emerald-400 font-semibold' : ''}>
                            {isHeld ? 'Sedang Dihold' : isCurrent ? 'Sedang Berbunyi' : isPreviewing ? 'Preview Suara' : 'Siap'}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Audition Single Sound Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreviewSingleSound(seg);
                        }}
                        className={`p-1.5 rounded-lg border text-xs transition-all flex items-center gap-1 ${
                          isPreviewing
                            ? 'bg-indigo-500 text-slate-950 border-indigo-400 shadow-md font-bold animate-pulse'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-indigo-500/50'
                        }`}
                        title="Dengarkan cuplikan suara ini saja"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="text-[9px] hidden sm:inline">Tes</span>
                      </button>

                      {/* Duration adjust buttons */}
                      <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 text-xs">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDurationChange(idx, seg.durationSec - 0.5);
                          }}
                          className="px-2 py-0.5 text-slate-400 hover:text-white"
                          title="Kurangi durasi"
                        >
                          -
                        </button>
                        <span className="text-[10px] font-mono font-bold text-indigo-300 px-1">
                          {seg.durationSec}s
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDurationChange(idx, seg.durationSec + 0.5);
                          }}
                          className="px-2 py-0.5 text-slate-400 hover:text-white"
                          title="Tambah durasi"
                        >
                          +
                        </button>
                      </div>

                      {/* Delete Clip */}
                      {segments.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveSegment(idx);
                          }}
                          className="text-slate-600 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-900 transition-all"
                          title="Hapus klip ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* SOP Pause Segment Indicator */}
            <div
              className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between ${
                playbackState.isPausedInterval
                  ? 'bg-amber-950/60 border-amber-400 shadow-md ring-2 ring-amber-500/40 animate-pulse'
                  : 'bg-slate-950/40 border-dashed border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                    playbackState.isPausedInterval
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-900 text-slate-500'
                  }`}
                >
                  ⏸
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <span>Jeda Hening SOP Pemasteran</span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                      Wajib Jeda
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {playbackState.isPausedInterval
                      ? 'Burung sedang mencerna irama...'
                      : `Durasi Jeda: ${pauseIntervalSec}s (Bisa disesuaikan)`}
                  </span>
                </div>
              </div>

              {/* Pause Interval Selector */}
              <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setPauseIntervalSec(Math.max(1, pauseIntervalSec - 1))}
                  className="px-2 py-0.5 text-slate-400 hover:text-white"
                >
                  -
                </button>
                <span className="text-[10px] font-mono font-bold text-amber-300 px-1">
                  {pauseIntervalSec}s
                </span>
                <button
                  onClick={() => setPauseIntervalSec(pauseIntervalSec + 1)}
                  className="px-2 py-0.5 text-slate-400 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add Clip Quick Bar */}
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
            + Tambah Potongan Lagu Baru ke Rangkaian:
          </span>
          <div className="grid grid-cols-5 gap-1 text-[10px]">
            <button
              onClick={() => handleAddSegment('cililin')}
              className="p-1.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold hover:bg-amber-900/60 transition-all text-center"
            >
              + Cililin
            </button>
            <button
              onClick={() => handleAddSegment('kenari')}
              className="p-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold hover:bg-emerald-900/60 transition-all text-center"
            >
              + Kenari
            </button>
            <button
              onClick={() => handleAddSegment('kapas')}
              className="p-1.5 rounded-xl bg-teal-950/60 border border-teal-500/40 text-teal-300 font-bold hover:bg-teal-900/60 transition-all text-center"
            >
              + Kapas T.
            </button>
            <button
              onClick={() => handleAddSegment('tengkek')}
              className="p-1.5 rounded-xl bg-yellow-950/60 border border-yellow-500/40 text-yellow-300 font-bold hover:bg-yellow-900/60 transition-all text-center"
            >
              + Tengkek
            </button>
            <button
              onClick={() => handleAddSegment('gereja')}
              className="p-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold hover:bg-cyan-900/60 transition-all text-center"
            >
              + Gereja
            </button>
          </div>
        </div>

        {/* Master Controls: Play/Pause, Loop Toggle, Timer */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            {/* Loop Toggle */}
            <button
              onClick={() => {
                stitchedMasteranPlayer.stop();
                setIsLooping(!isLooping);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isLooping
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/60'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <Repeat className={`w-3.5 h-3.5 ${isLooping ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span>{isLooping ? 'Looping Berulang: ON' : 'Sekali Putar'}</span>
            </button>

            {/* Timer Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Timer className="w-3.5 h-3.5 text-indigo-400" />
              <select
                value={timerMinutes}
                onChange={(e) => {
                  const mins = Number(e.target.value);
                  setTimerMinutes(mins);
                  setTimeRemainingSeconds(mins * 60);
                }}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-[11px] focus:outline-none"
              >
                <option value={0}>Nonstop (Manual)</option>
                <option value={15}>Timer: 15 Menit</option>
                <option value={30}>Timer: 30 Menit</option>
                <option value={60}>Timer: 1 Jam</option>
              </select>
            </div>
          </div>

          {/* Big Play / Stop Button */}
          <button
            onClick={handleTogglePlay}
            className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              playbackState.isPlaying
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30'
                : 'bg-gradient-to-r from-indigo-500 via-indigo-400 to-purple-400 text-slate-950 shadow-indigo-500/30 hover:brightness-105'
            }`}
          >
            {playbackState.isPlaying ? (
              <>
                <Pause className="w-5 h-5 fill-white" />
                <span>Hentikan Putaran Masteran</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                <span>Putar Kombinasi Masteran (Loop Berulang)</span>
              </>
            )}
          </button>

          {/* Timer status badge if active */}
          {timeRemainingSeconds > 0 && playbackState.isPlaying && (
            <div className="text-center text-[11px] text-indigo-300 font-mono">
              ⏱ Sisa Waktu Sesi Pemasteran: {formatTimer(timeRemainingSeconds)}
            </div>
          )}
        </div>
      </div>
        </>
      ) : (
        /* REKAMAN BURUNG JUARA (EXCLUSIVE PRO VIP) VIEW */
        <div className="space-y-4">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/60 border border-amber-500/40 rounded-2xl p-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400">
                    <Crown className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm font-extrabold text-white">
                    Pustaka Rekaman Burung Juara Nasional
                  </h2>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Koleksi suara orisinal hasil rekaman studio 24-bit tanpa noise dari para gacoan legendaris Nusantara (MB Avatar, Semar Mesem, Raja Rimba, dll).
                </p>
              </div>
            </div>
          </div>

          {/* ACTIVE CHAMPION TRACK PLAYER CARD */}
          <div className="bg-slate-900/95 border border-amber-500/40 rounded-3xl p-4 shadow-2xl backdrop-blur-md space-y-3.5 relative">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={activeChampionTrack.avatar_url}
                    alt={activeChampionTrack.nama_burung}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/60 shadow-lg shadow-amber-500/20"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute -top-1.5 -left-1.5 p-1 rounded-full bg-amber-500 text-slate-950 font-black shadow-md">
                    <Crown className="w-3 h-3 fill-slate-950" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white">
                      {activeChampionTrack.nama_burung}
                    </h3>
                    <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-950/90 px-2 py-0.5 rounded-full border border-amber-600/40">
                      {activeChampionTrack.ring_number}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-200/90 font-medium line-clamp-1">
                    {activeChampionTrack.gelar}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400">
                    <span>{activeChampionTrack.jenis_burung}</span>
                    <span>•</span>
                    <span className="font-mono text-emerald-400">{activeChampionTrack.audio_quality}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-right shrink-0">
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  tier === 'pro'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {tier === 'pro' ? (
                    <>
                      <Crown className="w-2.5 h-2.5 text-amber-400" />
                      <span>PRO VIP</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-2.5 h-2.5 text-slate-400" />
                      <span>Demo 15s</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Audio Wave Visualizer */}
            <AudioVisualizer
              isPlaying={isPlayingChampion}
              onTogglePlay={() => handleTogglePlayChampion(activeChampionTrack)}
              birdName={`${activeChampionTrack.nama_burung} (${activeChampionTrack.audio_quality})`}
              duration={tier === 'pro' ? activeChampionTrack.durasi : '00:15 (Demo)'}
            />

            {/* Demo Timer Notice for Free Users */}
            {tier !== 'pro' && isPlayingChampion && (
              <div className="bg-amber-950/70 border border-amber-500/50 rounded-xl p-2.5 text-center text-xs text-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Disc3 className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>Pratinjau Demo Berjalan</span>
                </div>
                <span className="font-mono font-bold text-amber-300 bg-amber-900/80 px-2 py-0.5 rounded">
                  ⏱ {championDemoTimer}s tersisa
                </span>
              </div>
            )}

            {/* Big Play / Stop Button */}
            <button
              onClick={() => handleTogglePlayChampion(activeChampionTrack)}
              className={`w-full py-3 px-4 rounded-2xl font-black text-xs shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                isPlayingChampion
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30'
                  : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-amber-500/30 hover:brightness-105'
              }`}
            >
              {isPlayingChampion ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Hentikan Rekaman ({activeChampionTrack.nama_burung})</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                  <span>
                    {tier === 'pro'
                      ? `Putar Rekaman Master Penuh (${activeChampionTrack.durasi})`
                      : `Dengarkan Pratinjau Demo 15 Detik (${activeChampionTrack.nama_burung})`}
                  </span>
                </>
              )}
            </button>

            {/* Action Buttons: Import to Studio & Offline Cache */}
            <div className="flex gap-2 pt-1 border-t border-slate-800">
              <button
                onClick={() => handleImportChampionToStudio(activeChampionTrack)}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  tier === 'pro'
                    ? 'bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border-indigo-500/50'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
                }`}
                title="Muat potongan lagu burung juara ini ke timeline Studio Masteran"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Muat ke Studio Stitcher</span>
                {tier !== 'pro' && <Lock className="w-3 h-3 text-amber-400 ml-1" />}
              </button>

              <button
                onClick={() => handleCacheChampionOffline(activeChampionTrack)}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  cachedChampionIds.includes(activeChampionTrack.id)
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
                    : tier === 'pro'
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {cachedChampionIds.includes(activeChampionTrack.id)
                    ? 'Tersimpan Offline'
                    : 'Unduh Offline'}
                </span>
                {tier !== 'pro' && <Lock className="w-3 h-3 text-amber-400 ml-1" />}
              </button>
            </div>

            {/* Alasan Kurasi & Deskripsi Rekaman Box */}
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide block mb-0.5">
                  Materi Isian Utama:
                </span>
                <div className="flex flex-wrap gap-1">
                  {activeChampionTrack.materi_unggulan.map((m, i) => (
                    <span key={i} className="text-[10px] bg-slate-900 text-slate-200 px-2 py-0.5 rounded-lg border border-slate-700 font-medium">
                      ✓ {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-1.5 border-t border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-0.5">
                  Catatan Kurasi Maestro:
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed italic">
                  "{activeChampionTrack.alasan_kurasi}"
                </p>
              </div>
            </div>
          </div>

          {/* Upsell Banner if Free Tier */}
          {tier !== 'pro' && (
            <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/60 border-2 border-amber-500/60 rounded-3xl p-4 shadow-xl space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wide bg-amber-950 text-amber-300 px-2 py-0.5 rounded-full border border-amber-600/40">
                    Akses VIP Lengkap
                  </span>
                  <h4 className="text-xs font-extrabold text-amber-200 mt-1">
                    Buka Rekaman Full Durasi MB Avatar &amp; Burung Juara Lainnya
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                    Di <strong>PRO VIP</strong>, Anda mendapatkan akses tanpa batas ke master audio lossless 24-bit (5+ menit) untuk seluruh burung juara nasional, serta kebebasan memasukkan rekaman juara ke studio masteran loop.
                  </p>
                </div>
              </div>

              <button
                onClick={onUpgradeClick}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all hover:brightness-105 active:scale-95"
              >
                <span>Buka Akses Rekaman Juara (PRO VIP)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* CATALOG LIST OF ALL 5 CURATED CHAMPION TRACKS */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block px-1">
              Daftar Koleksi Rekaman Juara Terkurasi:
            </span>

            <div className="space-y-2">
              {CHAMPION_TRACKS.map((track) => {
                const isSelected = activeChampionTrack.id === track.id;
                const isCurrentPlaying = isPlayingChampion && isSelected;

                return (
                  <div
                    key={track.id}
                    onClick={() => {
                      if (activeChampionTrack.id !== track.id) {
                        birdAudioEngine.stop();
                        setIsPlayingChampion(false);
                        setActiveChampionTrack(track);
                      }
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border-amber-500/80 ring-1 ring-amber-500/50 shadow-lg'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-amber-500/40">
                        <img
                          src={track.avatar_url}
                          alt={track.nama_burung}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {isCurrentPlaying && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-extrabold text-white">
                            {track.nama_burung}
                          </h4>
                          <span className="text-[9px] font-mono text-amber-300 bg-amber-950 px-1.5 py-0.2 rounded border border-amber-700/50">
                            {track.ring_number}
                          </span>
                        </div>
                        <p className="text-[10px] text-amber-200/80 truncate max-w-[180px] mt-0.5">
                          {track.gelar}
                        </p>
                        <div className="flex items-center gap-1 text-[9px] text-slate-400 mt-0.5">
                          <span>{track.durasi}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-mono">{track.frekuensi_khz}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePlayChampion(track);
                        }}
                        className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                          isCurrentPlaying
                            ? 'bg-rose-500 text-white shadow-md'
                            : isSelected
                            ? 'bg-amber-500 text-slate-950 shadow-md font-black hover:brightness-105'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                        title="Putar rekaman juara ini"
                      >
                        {isCurrentPlaying ? (
                          <Pause className="w-4 h-4 fill-white" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
