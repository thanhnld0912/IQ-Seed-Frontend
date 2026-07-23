import React, { useEffect, useRef, useState } from "react";
import { Mic, Square, Play, Volume2, Sparkles, Check, Sliders, Info, Loader2, Wand2 } from "lucide-react";
import {
  voicesApi,
  EMOTIONS,
  PROVIDER_LABELS,
  type ProviderInfo,
  type TtsProvider,
  type VoiceItemDto,
} from "../api/voices";
import { videosApi, type CharacterDto, type VideoDto } from "../api/videos";

const DEFAULT_TEXT = "Xin chào các bé, hôm nay chúng ta cùng nghe kể chuyện nhé!";

export default function VoiceOverView() {
  // Provider + giọng (thật từ backend)
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [provider, setProvider] = useState<TtsProvider>('wavespeed');
  const [voices, setVoices] = useState<VoiceItemDto[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");

  // Tham số giọng
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(0);
  const [emotion, setEmotion] = useState("");

  // Preview
  const [text, setText] = useState(DEFAULT_TEXT);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gán giọng vào video đã tạo
  const [videos, setVideos] = useState<VideoDto[]>([]);
  const [targetVideo, setTargetVideo] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignMsg, setAssignMsg] = useState<string | null>(null);

  // Nhân vật của phim đang chọn → gán giọng riêng cho từng nhân vật.
  const [characters, setCharacters] = useState<CharacterDto[]>([]);

  // Ghi âm THẬT (MediaRecorder)
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    voicesApi
      .providers()
      .then((r) => {
        setProviders(r.providers);
        const firstEnabled = r.default ?? r.providers.find((p) => p.enabled)?.id;
        if (firstEnabled) setProvider(firstEnabled);
      })
      .catch((e) => setError(e.message));
    videosApi.list().then((r) => setVideos(r.videos)).catch(() => {});
  }, []);

  useEffect(() => {
    voicesApi
      .list(provider)
      .then((r) => {
        setVoices(r.voices);
        setSelectedVoice(r.voices[0]?.voiceId ?? "");
      })
      .catch((e) => setError(e.message));
  }, [provider]);

  // Đếm giây khi ghi âm
  useEffect(() => {
    if (!isRecording) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [isRecording]);

  const handlePreview = async () => {
    if (!selectedVoice) return;
    setPreviewing(true);
    setError(null);
    setPreviewUrl(null);
    try {
      const { audioUrl } = await voicesApi.preview({
        provider,
        voiceId: selectedVoice,
        text,
        speed,
        pitch,
        emotion: emotion || undefined,
      });
      setPreviewUrl(audioUrl);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPreviewing(false);
    }
  };

  // Tải nhân vật khi đổi phim.
  useEffect(() => {
    if (!targetVideo) { setCharacters([]); return; }
    videosApi.get(targetVideo).then((r) => setCharacters(r.characters ?? [])).catch(() => setCharacters([]));
  }, [targetVideo]);

  const handleCharacterVoice = async (charId: string, voiceId: string) => {
    setCharacters((cs) => cs.map((c) => (c.id === charId ? { ...c, voiceId } : c)));
    try {
      await videosApi.updateCharacter(targetVideo, charId, { voiceId, voiceProvider: provider });
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleAssign = async () => {
    if (!targetVideo || !selectedVoice) return;
    setAssigning(true);
    setAssignMsg(null);
    setError(null);
    try {
      const r = await voicesApi.assignToVideo(targetVideo, {
        provider,
        voiceId: selectedVoice,
        speed,
        pitch,
        emotion: emotion || undefined,
      });
      setAssignMsg(
        r.ok
          ? `Đã lồng giọng cho ${r.succeeded}/${r.total} cảnh!`
          : `Xong ${r.succeeded}/${r.total} cảnh. Lỗi: ${r.errors.join('; ')}`,
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setAssigning(false);
    }
  };

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' });
        setRecordedUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      recorderRef.current = rec;
      setSeconds(0);
      setRecordedUrl(null);
      setIsRecording(true);
    } catch (e) {
      setError('Không truy cập được micro: ' + (e as Error).message);
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setIsRecording(false);
  };

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-[#FFFDF7] pb-24 md:pb-12 pt-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">

        {/* Banner */}
        <div className="bg-[#cfe5ff]/30 border-2 border-[#4bafff]/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-md border-2 border-[#4bafff] animate-wiggle">🦉</div>
            <div>
              <h2 className="text-2xl font-black text-secondary font-heading">Phòng lồng giọng AI</h2>
              <p className="text-sm text-on-surface-variant font-medium">
                Chọn giọng, chỉnh tốc độ &amp; cảm xúc, nghe thử rồi lồng vào phim của bé.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-white border border-[#4bafff]/45 px-4 py-2 rounded-full shadow-sm text-xs text-secondary font-bold">
            <Sparkles className="w-4 h-4 text-secondary fill-secondary/20" /> Giọng đọc tiếng Việt tự nhiên
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-2xl text-xs font-bold">{error}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Chọn giọng + tham số */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border-2 border-surface-container shadow-sm space-y-5">
            <h3 className="font-heading text-lg font-black text-on-surface flex items-center gap-1">✨ Chọn giọng đọc</h3>

            {/* Provider */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-outline font-black uppercase tracking-wider block">Nhà cung cấp giọng</label>
              <div className="flex flex-wrap gap-2">
                {providers.map((p) => (
                  <button
                    key={p.id}
                    disabled={!p.enabled}
                    onClick={() => setProvider(p.id)}
                    title={p.enabled ? '' : 'Chưa cấu hình API key trên server'}
                    className={`px-4 py-2 rounded-full text-xs font-extrabold border transition-all ${
                      provider === p.id
                        ? 'border-secondary bg-[#cfe5ff]/40 text-secondary'
                        : p.enabled
                        ? 'border-outline hover:bg-surface-container'
                        : 'border-surface-container text-outline/40 cursor-not-allowed line-through'
                    }`}
                  >
                    {PROVIDER_LABELS[p.id]}
                  </button>
                ))}
              </div>
            </div>

            {/* Danh sách giọng */}
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto custom-scrollbar">
              {voices.map((v) => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVoice(v.voiceId)}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    selectedVoice === v.voiceId
                      ? 'border-secondary bg-[#cfe5ff]/10 ring-2 ring-secondary/20'
                      : 'border-surface-container-high hover:border-[#4bafff]'
                  }`}
                >
                  <h4 className="text-xs font-black text-on-surface pr-5">{v.name}</h4>
                  <p className="text-[10px] text-outline font-bold">
                    {v.gender ?? '—'} • {v.region ?? '—'}
                  </p>
                  {selectedVoice === v.voiceId && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-secondary rounded-full flex items-center justify-center text-white">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}
              {voices.length === 0 && (
                <p className="col-span-2 text-xs text-outline font-bold py-6 text-center">
                  Chưa có giọng nào cho nhà cung cấp này.
                </p>
              )}
            </div>

            {/* Tham số */}
            <div className="space-y-4 bg-[#f5f3ee] p-4 rounded-2xl border border-surface-container">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
                  <span className="flex items-center gap-1"><Sliders className="w-4 h-4 text-[#2d6c00]" /> Tốc độ đọc</span>
                  <span className="text-[#2d6c00]">{speed.toFixed(2)}×</span>
                </div>
                <input type="range" min={0.8} max={1.2} step={0.05} value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full h-2 bg-surface-container rounded-full appearance-none cursor-pointer accent-[#2d6c00]" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
                  <span className="flex items-center gap-1"><Sliders className="w-4 h-4 text-[#2d6c00]" /> Cao độ (pitch)</span>
                  <span className="text-[#2d6c00]">{pitch > 0 ? `+${pitch}` : pitch}</span>
                </div>
                <input type="range" min={-12} max={12} step={1} value={pitch}
                  onChange={(e) => setPitch(Number(e.target.value))}
                  className="w-full h-2 bg-surface-container rounded-full appearance-none cursor-pointer accent-[#2d6c00]" />
                <div className="flex justify-between text-[10px] text-outline font-black uppercase">
                  <span>Trầm ấm</span><span>Thanh cao</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-outline font-black uppercase tracking-wider block">Cảm xúc</span>
                <select value={emotion} onChange={(e) => setEmotion(e.target.value)}
                  className="w-full text-xs font-bold py-2 px-3 border border-outline rounded-xl bg-white">
                  {EMOTIONS.map((em) => <option key={em.value} value={em.value}>{em.label}</option>)}
                </select>
              </div>
            </div>

            {/* Nghe thử */}
            <div className="space-y-2">
              <label className="text-[10px] text-outline font-black uppercase tracking-wider block">Nội dung nghe thử</label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={500}
                className="w-full h-20 p-3 bg-[#FFFDF7] border-2 border-outline-variant focus:border-[#2d6c00] outline-none rounded-xl text-sm resize-none" />
              <button onClick={handlePreview} disabled={previewing || !selectedVoice}
                className="w-full py-3.5 bg-gradient-to-r from-[#F5B82E] to-[#FF9F40] text-white rounded-full font-extrabold text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50">
                {previewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                {previewing ? 'Đang tạo giọng...' : 'Nghe thử'}
              </button>
              {previewUrl && (
                <audio key={previewUrl} src={previewUrl} controls autoPlay className="w-full mt-2" />
              )}
            </div>
          </div>

          {/* Cột phải: gán vào video + ghi âm */}
          <div className="lg:col-span-5 space-y-6">

            {/* Lồng giọng vào video */}
            <div className="bg-white p-6 rounded-3xl border-2 border-surface-container shadow-sm space-y-4">
              <h3 className="font-heading text-lg font-black text-on-surface flex items-center gap-1">🎬 Lồng giọng vào phim</h3>
              <p className="text-xs text-outline font-medium">Chọn tác phẩm đã tạo — AI sẽ đọc lời thoại của từng cảnh bằng giọng bạn chọn.</p>
              <select value={targetVideo} onChange={(e) => setTargetVideo(e.target.value)}
                className="w-full text-xs font-bold py-2.5 px-3 border border-outline rounded-xl bg-white">
                <option value="">— Chọn tác phẩm —</option>
                {videos.map((v) => (
                  <option key={v.id} value={v.id}>{v.title || 'Chưa đặt tên'} ({v.style})</option>
                ))}
              </select>
              {/* Nhân vật: mỗi nhân vật 1 giọng riêng → giữ giọng nhất quán cả phim */}
              {characters.length > 0 && (
                <div className="space-y-2 bg-[#f5f3ee] p-3 rounded-2xl border border-surface-container">
                  <span className="text-[10px] text-outline font-black uppercase tracking-wider block">
                    Giọng riêng cho từng nhân vật
                  </span>
                  {characters.map((c) => (
                    <div key={c.id} className="flex items-center gap-2">
                      {c.refImageUrl ? (
                        <img src={c.refImageUrl} alt={c.name}
                          className="w-9 h-9 rounded-lg object-cover border border-outline-variant flex-shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-sm flex-shrink-0">
                          {c.status === 'rendering' ? '⏳' : '🧸'}
                        </div>
                      )}
                      <span className="text-xs font-black text-on-surface flex-1 truncate" title={c.appearance}>
                        {c.name}
                      </span>
                      <select
                        value={c.voiceId ?? ''}
                        onChange={(e) => handleCharacterVoice(c.id, e.target.value)}
                        className="text-[11px] font-bold py-1.5 px-2 border border-outline rounded-lg bg-white max-w-[46%]"
                      >
                        <option value="">Giọng dẫn chuyện</option>
                        {voices.map((v) => <option key={v.id} value={v.voiceId}>{v.name}</option>)}
                      </select>
                    </div>
                  ))}
                  <p className="text-[10px] text-outline font-medium">
                    Cảnh có nhân vật thoại sẽ dùng giọng của nhân vật đó; cảnh còn lại dùng giọng chọn ở trên.
                  </p>
                </div>
              )}

              <button onClick={handleAssign} disabled={assigning || !targetVideo || !selectedVoice}
                className="w-full py-3.5 bg-[#2d6c00] text-white rounded-full font-extrabold text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50">
                {assigning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                {assigning ? 'Đang lồng giọng...' : 'Lồng giọng cho tất cả cảnh'}
              </button>
              {assignMsg && (
                <div className="bg-[#6bbf3a]/15 p-3 rounded-xl border border-[#6bbf3a]/30 text-xs font-extrabold text-[#2d6c00]">
                  {assignMsg}
                </div>
              )}
            </div>

            {/* Ghi âm thật */}
            <div className="bg-white p-6 rounded-3xl border-2 border-surface-container shadow-sm space-y-4">
              <h3 className="font-heading text-lg font-black text-on-surface flex items-center gap-1">🎙️ Thu giọng của bé</h3>
              <div className="bg-black/95 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-32">
                {isRecording ? (
                  <div className="flex items-center gap-1.5 h-12 mb-2">
                    {[24, 40, 16, 48, 28, 44, 20, 36].map((h, i) => (
                      <div key={i} className="w-1 bg-[#6bbf3a] rounded-full animate-bounce"
                        style={{ height: `${h}px`, animationDuration: `${0.4 + (i % 3) * 0.2}s` }} />
                    ))}
                  </div>
                ) : (
                  <Mic className="w-10 h-10 text-white/40 mb-2" />
                )}
                <span className="font-mono text-white font-extrabold text-sm">{mmss}</span>
              </div>
              <div className="flex gap-3 justify-center">
                {!isRecording ? (
                  <button onClick={startRecording}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full text-xs shadow-md flex items-center gap-1.5 uppercase">
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping" /> Thu giọng
                  </button>
                ) : (
                  <button onClick={stopRecording}
                    className="px-6 py-3 bg-black hover:bg-black/80 text-white font-bold rounded-full text-xs shadow-md flex items-center gap-1.5 uppercase">
                    <Square className="w-4 h-4 fill-white" /> Dừng
                  </button>
                )}
              </div>
              {recordedUrl && <audio src={recordedUrl} controls className="w-full" />}
              <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-medium bg-[#f5f3ee] p-3 rounded-xl border border-surface-container">
                <Info className="w-4 h-4 text-secondary flex-shrink-0" />
                <span>Giữ máy cách miệng ~20cm để thu trong trẻo nhất. Bản thu lưu tạm trên máy.</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-outline font-bold flex items-center justify-center gap-1">
          <Play className="w-3 h-3" /> Sau khi lồng giọng, mở "Tác phẩm của bé" để xem lại phim kèm tiếng.
        </p>
      </div>
    </div>
  );
}
