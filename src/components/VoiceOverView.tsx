import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Mic, Square, Play, Volume2, Sparkles, Check, Trash2, Sliders, Music, Info } from "lucide-react";
import { VOICES } from "../data";

export default function VoiceOverView() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState("bena");
  const [pitch, setPitch] = useState(120); // Voice shift pitch percent
  const [isModulating, setIsModulating] = useState(false);
  const [modulatedAudioUrl, setModulatedAudioUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Simple record countdown simulation
  useEffect(() => {
    let timer: any = null;
    if (isRecording) {
      setRecordingSeconds(0);
      timer = setInterval(() => {
        setRecordingSeconds(prev => {
          if (prev >= 10) {
            setIsRecording(false);
            setAudioBlobUrl("simulated-blob");
            clearInterval(timer);
            return 10;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setAudioBlobUrl(null);
    setModulatedAudioUrl(null);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setAudioBlobUrl("simulated-blob-recorded");
  };

  const handleApplyModulation = () => {
    if (!audioBlobUrl) {
      alert("Ba mẹ hoặc bé vui lòng thử ghi âm giọng nói trước nhé!");
      return;
    }
    setIsModulating(true);
    setTimeout(() => {
      setIsModulating(false);
      setModulatedAudioUrl("simulated-modulated-blob");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] pb-24 md:pb-12 pt-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        
        {/* Banner with owls */}
        <div className="bg-[#cfe5ff]/30 border-2 border-[#4bafff]/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-md border-2 border-[#4bafff] animate-wiggle">
              🦉
            </div>
            <div>
              <h2 className="text-2xl font-black text-secondary font-heading">Phòng thay đổi & lồng giọng AI</h2>
              <p className="text-sm text-on-surface-variant font-medium">
                Ghi âm giọng mầm non thơ ngây của con hoặc ba mẹ, rồi dùng AI biến đổi thành ông tiên, thỏ ngọc, hay bé Na dí dỏm!
              </p>
            </div>
          </div>
          
          <div className="inline-flex items-center gap-1.5 bg-white border border-[#4bafff]/45 px-4 py-2 rounded-full shadow-sm text-xs text-secondary font-bold">
            <Sparkles className="w-4 h-4 text-secondary fill-secondary/20" />
            Vạn giọng đọc cổ tích kì ảo
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Recorder Panel */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border-2 border-surface-container shadow-sm space-y-6">
            <h3 className="font-heading text-lg font-black text-on-surface flex items-center gap-1">
              🎙️ Máy ghi âm lồng tiếng mầm non
            </h3>

            {/* Recorder Screen Box */}
            <div className="bg-black/95 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-48 relative overflow-hidden">
              <div className="absolute inset-0 bg-radial from-transparent to-black/80 z-0"></div>
              
              {/* Animated wave sound bars */}
              {isRecording ? (
                <div className="flex items-center gap-1.5 h-16 z-10 mb-2">
                  {[...Array(12)].map((_, i) => {
                    const h = [24, 48, 16, 64, 32, 56, 40, 20, 48, 12, 52, 28][i];
                    return (
                      <div
                        key={i}
                        className="w-1 bg-[#6bbf3a] rounded-full animate-bounce"
                        style={{
                          height: `${h}px`,
                          animationDuration: `${0.4 + (i % 3) * 0.2}s`
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-white/40 mb-2 z-10">
                  <Mic className="w-12 h-12 mx-auto animate-pulse" />
                </div>
              )}

              {/* Status captions */}
              <div className="space-y-1 z-10">
                <span className="font-mono text-white font-extrabold text-sm block">
                  {isRecording ? `Đang ghi âm chân thật... 00:0${recordingSeconds}` : '00:00'}
                </span>
                <p className="text-[10px] text-white/60 uppercase tracking-widest">
                  Tốc độ mẫu chuẩn mầm non: 48kHz
                </p>
              </div>
            </div>

            {/* Record buttons */}
            <div className="flex gap-4 justify-center">
              {!isRecording ? (
                <button
                  onClick={handleStartRecording}
                  className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full text-xs shadow-md flex items-center gap-1.5 uppercase tracking-wide cursor-pointer squishy-button"
                >
                  <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                  Chạm để thu giọng
                </button>
              ) : (
                <button
                  onClick={handleStopRecording}
                  className="px-8 py-3.5 bg-black hover:bg-black/80 text-white font-bold rounded-full text-xs shadow-md flex items-center gap-1.5 uppercase tracking-wide cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-white" />
                  Dừng ghi âm
                </button>
              )}

              {audioBlobUrl && (
                <button
                  onClick={() => alert("Đang phát lại đoạn ghi âm mầm non gốc của bé...")}
                  className="px-6 py-3 bg-surface-container hover:bg-surface-container-high rounded-full text-xs font-bold flex items-center gap-1 border border-outline-variant cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-on-surface" /> Nghe thử gốc
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-medium bg-[#f5f3ee] p-3 rounded-xl border border-surface-container">
              <Info className="w-4 h-4 text-secondary flex-shrink-0" />
              <span>Gợi ý: Cho bé tự kể thoại, ba mẹ giữ máy cách miệng con khoảng 20cm để thu âm ấm áp, trong trẻo nhất nha!</span>
            </div>
          </div>

          {/* AI Voice Changing settings */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border-2 border-surface-container shadow-sm space-y-6">
            <h3 className="font-heading text-lg font-black text-on-surface flex items-center gap-1">
              ✨ Bộ hóa dịch thay đổi giọng nói AI
            </h3>

            {/* Selection Grid */}
            <div className="grid grid-cols-2 gap-4">
              {VOICES.map((v) => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVoice(v.id)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 relative ${selectedVoice === v.id ? 'border-secondary bg-[#cfe5ff]/10 ring-2 ring-secondary/20' : 'border-surface-container-high hover:border-[#4bafff]'}`}
                >
                  <img src={v.avatarUrl} alt={v.name} className="w-12 h-12 rounded-full object-cover border border-outline-variant" />
                  <div>
                    <h4 className="text-xs font-black text-on-surface">{v.name}</h4>
                    <p className="text-[10px] text-outline font-bold">Giọng {v.gender} • {v.region}</p>
                  </div>
                  {selectedVoice === v.id && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-secondary rounded-full flex items-center justify-center text-white">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Slider pitch adjustments */}
            <div className="space-y-3 bg-[#f5f3ee] p-4 rounded-2xl border border-surface-container">
              <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
                <span className="flex items-center gap-1"><Sliders className="w-4 h-4 text-[#2d6c00]" /> Độ mảnh/độ trầm của giọng (Pitch)</span>
                <span className="text-[#2d6c00]">{pitch}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                value={pitch}
                onChange={(e) => setPitch(Number(e.target.value))}
                className="w-full h-2 bg-surface-container rounded-full appearance-none cursor-pointer accent-[#2d6c00]"
              />
              <div className="flex justify-between text-[10px] text-outline font-black uppercase">
                <span>Khàn ấm gấu con</span>
                <span>Thanh lảnh bé thỏ</span>
              </div>
            </div>

            {/* Transform Button */}
            <div className="space-y-3 text-center">
              <button
                onClick={handleApplyModulation}
                disabled={isModulating || !audioBlobUrl}
                className={`w-full py-4 rounded-full font-extrabold text-sm button-3d-yellow transition-all flex items-center justify-center gap-2 cursor-pointer ${!audioBlobUrl ? 'opacity-40 cursor-not-allowed bg-outline' : 'bg-gradient-to-r from-[#F5B82E] to-[#FF9F40] text-white'}`}
              >
                <Sliders className="w-4.5 h-4.5" />
                <span>{isModulating ? 'Đang chuyển đổi giọng nói...' : 'Áp dụng bộ thay đổi giọng thuyết minh'}</span>
              </button>

              {/* Success playback */}
              {modulatedAudioUrl && !isModulating && (
                <div className="bg-[#6bbf3a]/15 p-4 rounded-2xl border border-[#6bbf3a]/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-[#2d6c00] animate-bounce" />
                    <span className="text-xs font-extrabold text-[#2d6c00]">Giọng AI mầm non đã sẵn sàng!</span>
                  </div>
                  <button
                    onClick={() => alert(`Đang phát giọng đọc lồng tiếng đã áp dụng bộ lọc '${VOICES.find(v => v.id === selectedVoice)?.name}'`)}
                    className="px-4 py-1.5 bg-[#2d6c00] text-white font-bold rounded-full text-[10px] uppercase flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-white" /> Phát thử kết quả
                  </button>
                </div>
              )}
            </div>

          </div>
          
        </div>

      </div>
    </div>
  );
}
