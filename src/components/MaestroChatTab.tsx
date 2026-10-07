import React, { useState } from 'react';
import { 
  Crown, 
  Send, 
  Sparkles, 
  Flame, 
  Snowflake, 
  Award, 
  ArrowUpRight, 
  ShieldCheck, 
  HelpCircle,
  MessageCircle,
  User,
  Coffee
} from 'lucide-react';
import { BirdProfile, DailyLog, TierType } from '../types/kicau';

interface MaestroChatTabProps {
  currentBird: BirdProfile;
  dailyLogs: DailyLog[];
  tier: TierType;
  onUpgradeClick: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'maestro';
  text: string;
  time: string;
}

export const MaestroChatTab: React.FC<MaestroChatTabProps> = ({
  currentBird,
  dailyLogs,
  tier,
  onUpgradeClick,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'maestro',
      text: `Halo Bosku! Salam kicau mania dari Abah Sony. MB "${currentBird.nama_burung}" ini karakter dasarnya "${currentBird.karakter_dasar}". Ada kendala apa di gantangan atau pola rawatan hariannya? Ceritakan, kita bedah bareng-bareng!`,
      time: '09:41',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    `Abah, MB ${currentBird.nama_burung} sering ngetem di menit ke-6, apa solusinya?`,
    `Gimana cara dongkrak emosi burung ${currentBird.karakter_dasar} H-2 lomba?`,
    `Burung suka turun tangkringan bawah pas lawan nembak Cililin rapat, kenapa ya?`,
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat-maestro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          birdProfile: currentBird,
          conversation: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          })),
        }),
      });

      const data = await response.json();
      if (data.success && data.reply) {
        const maestroMsg: ChatMessage = {
          id: `abah-${Date.now()}`,
          sender: 'maestro',
          text: data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, maestroMsg]);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error(err);
      const fallbackReply: ChatMessage = {
        id: `abah-${Date.now()}`,
        sender: 'maestro',
        text: `Om, untuk ${currentBird.nama_burung} (${currentBird.karakter_dasar}), kuncinya ada pada konsistensi Extra Fooding. Coba naikkan porsi jangkrik 2 ekor saat pagi hari dan berikan mandi keramba air sejuk. Seni kicau itu butuh ketenangan dan pengamatan harian, Bosku!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-3">
      {/* Abah Sony Profile Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/40 rounded-2xl p-3.5 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-yellow-600 flex items-center justify-center text-slate-950 font-extrabold text-lg shadow-md border-2 border-amber-400/50">
              AS
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-extrabold text-white">Abah Sony</h3>
              <span className="text-[9px] font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-600/50">
                Maestro MB Avatar
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Gacoan: <span className="text-amber-400 font-semibold">{currentBird.nama_burung}</span> ({currentBird.karakter_dasar})
            </p>
          </div>
        </div>

        {tier === 'pro' ? (
          <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-500/40">
            PRO VIP
          </span>
        ) : (
          <button
            onClick={onUpgradeClick}
            className="text-[10px] font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 px-2.5 py-1 rounded-full shadow hover:brightness-105"
          >
            Upgrade PRO
          </button>
        )}
      </div>

      {/* Free Tier Lock Screen / Notice */}
      {tier === 'free' && (
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 text-center space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider">
              Konsultasi Maestro Khusus Member PRO
            </h4>
            <p className="text-[11px] text-slate-300 mt-1 max-w-xs mx-auto leading-relaxed">
              Sesuai spesifikasi sistem, fitur saran settingan pakan dan konsultasi langsung persona Abah Sony hanya aktif di Pro Tier.
            </p>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-left text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-200">Manfaat Konsultasi Abah Sony PRO:</div>
            <div>✓ Rekomendasi pakan Extra Fooding sesuai karakter panas/dingin</div>
            <div>✓ Panduan jemur sauna vs jemur ablak untuk dongkrak tenaga</div>
            <div>✓ Trik mengunci emosi saat gantang di cuaca terik / hujan</div>
          </div>

          <button
            onClick={onUpgradeClick}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:brightness-105 transition-all"
          >
            Buka Akses Tanya Abah Sony (PRO)
          </button>
        </div>
      )}

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[300px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
              {msg.sender === 'maestro' ? (
                <>
                  <Award className="w-3 h-3 text-amber-400" />
                  <span className="font-bold text-amber-300">Abah Sony</span>
                </>
              ) : (
                <>
                  <User className="w-3 h-3 text-emerald-400" />
                  <span>Kicau Mania (Anda)</span>
                </>
              )}
              <span>• {msg.time}</span>
            </div>

            <div
              className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[88%] shadow-md ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-amber-300 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 w-fit">
            <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
            <span>Abah Sony sedang meracik resep & saran...</span>
          </div>
        )}
      </div>

      {/* Quick Prompt chips if Pro */}
      {tier === 'pro' && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">
            Pertanyaan Populer Gantangan:
          </span>
          <div className="flex flex-col gap-1.5">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="text-left text-[11px] p-2 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 text-slate-300 transition-all truncate"
              >
                💬 {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="pt-2">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 pl-3 shadow-lg focus-within:border-amber-500/60">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
            placeholder={
              tier === 'pro'
                ? 'Ketik pertanyaan rawatan ke Abah Sony...'
                : 'Upgrade ke PRO untuk chat interaktif...'
            }
            disabled={tier === 'free' || isLoading}
            className="flex-1 bg-transparent text-xs text-white focus:outline-none placeholder-slate-500 disabled:cursor-not-allowed"
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={tier === 'free' || !inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-3.5 h-3.5 fill-slate-950" />
          </button>
        </div>
      </div>
    </div>
  );
};
