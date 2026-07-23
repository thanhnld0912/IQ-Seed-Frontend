import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, Play, Trash2, Calendar, Film, Clock, Star, Download, Loader2, AlertTriangle } from "lucide-react";
import { VideoItem } from "../types";
import { videosApi, SceneDto } from "../api/videos";

interface DashboardViewProps {
  videos: VideoItem[];
  onPlayVideo: (videoUrl: string, title: string) => void;
  onDeleteVideo: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export default function DashboardView({ videos, onPlayVideo, onDeleteVideo, onNavigate }: DashboardViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [styleFilter, setStyleFilter] = useState("");

  // Slideshow preview modal (slideshow chưa export MP4 — Phase 3 sẽ có finalUrl).
  const [previewScenes, setPreviewScenes] = useState<SceneDto[] | null>(null);
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewIdx, setPreviewIdx] = useState(0);
  const [loadingPreview, setLoadingPreview] = useState<string | null>(null);

  // Xuất MP4: id video đang ghép → URL kết quả khi xong.
  const [exporting, setExporting] = useState<Record<string, boolean>>({});
  const [exported, setExported] = useState<Record<string, string>>({});
  const cancelledRef = React.useRef(false);
  React.useEffect(() => {
    cancelledRef.current = false;
    return () => { cancelledRef.current = true; };
  }, []);

  const handleExport = async (video: VideoItem) => {
    setExporting((m) => ({ ...m, [video.id]: true }));
    try {
      await videosApi.exportMp4(video.id);
      // Worker chạy nền → poll tới khi có finalUrl (tối đa ~10 phút).
      const MAX = 200;
      for (let i = 0; i < MAX; i++) {
        await new Promise((r) => setTimeout(r, 3000));
        if (cancelledRef.current) return;
        const { video: v } = await videosApi.get(video.id);
        if (v.finalUrl) {
          setExported((m) => ({ ...m, [video.id]: v.finalUrl! }));
          return;
        }
        // Export hỏng giữ status='completed' (cảnh vẫn nguyên) → bắt qua exportError.
        if (v.exportError) {
          alert('Ghép video thất bại: ' + v.exportError);
          return;
        }
        if (v.status === 'failed') {
          alert('Ghép video thất bại: ' + (v.error ?? 'không rõ nguyên nhân'));
          return;
        }
      }
      alert('Ghép video lâu hơn dự kiến. Kiểm tra lại sau — worker vẫn đang chạy.');
    } catch (e) {
      alert('Không xuất được video: ' + (e as Error).message);
    } finally {
      setExporting((m) => ({ ...m, [video.id]: false }));
    }
  };

  const styles = useMemo(
    () => Array.from(new Set(videos.map((v) => v.style).filter(Boolean))),
    [videos],
  );

  const filteredVideos = videos.filter((video) => {
    const q = searchTerm.toLowerCase();
    const matchQ = video.title.toLowerCase().includes(q) || video.prompt.toLowerCase().includes(q);
    const matchStyle = !styleFilter || video.style === styleFilter;
    return matchQ && matchStyle;
  });

  React.useEffect(() => {
    if (!previewScenes || previewScenes.length === 0) return;
    const t = setInterval(() => setPreviewIdx((i) => (i + 1) % previewScenes.length), 2500);
    return () => clearInterval(t);
  }, [previewScenes]);

  const handlePlay = async (video: VideoItem) => {
    if (video.finalUrl) {
      onPlayVideo(video.finalUrl, video.title);
      return;
    }
    // Chưa export MP4 → mở preview slideshow từ scenes.
    setLoadingPreview(video.id);
    try {
      const { scenes } = await videosApi.get(video.id);
      const playable = scenes.filter((s) => s.imageUrl || s.clipUrl);
      if (playable.length === 0) {
        alert("Video chưa có cảnh nào hoàn tất để xem trước.");
        return;
      }
      setPreviewScenes(playable);
      setPreviewTitle(video.title);
      setPreviewIdx(0);
    } catch (e) {
      alert("Không tải được video: " + (e as Error).message);
    } finally {
      setLoadingPreview(null);
    }
  };

  const anyExpiringSoon = filteredVideos.some((v) => (v.expirationDaysLeft ?? 7) <= 2);

  return (
    <div className="min-h-screen bg-[#FFFDF7] pb-24 md:pb-12 pt-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">

        {/* Banner */}
        <div className="bg-[#6bbf3a]/10 border-2 border-[#6bbf3a]/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-md border-2 border-[#6bbf3a] animate-wiggle">🌱</div>
            <div>
              <h2 className="text-2xl font-black text-primary font-heading">Thư viện của bé hạt mầm</h2>
              <p className="text-sm text-on-surface-variant font-medium">
                Nơi lưu trữ những tác phẩm thông thái của con. Video tự động xóa sau 7 ngày — nhớ tải về máy nhé!
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("workspace")}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#F5B82E] to-[#FF9F40] text-white font-extrabold text-sm squishy-button border-b-4 border-orange-600/20 shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Star className="w-4 h-4 fill-white" /> Gieo hạt mới
          </button>
        </div>

        {/* Cảnh báo sắp hết hạn */}
        {anyExpiringSoon && (
          <div className="flex items-center gap-2 bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-2xl text-xs font-bold">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Có tác phẩm sắp hết hạn! Hãy tải về máy trước khi bị xóa vĩnh viễn.</span>
          </div>
        )}

        {/* Filters + search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-surface-container shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên hoặc nội dung..."
                className="w-full pl-10 pr-4 py-2 bg-[#FFFDF7] border-2 border-outline-variant focus:border-[#2d6c00] outline-none rounded-xl text-sm font-medium transition-all"
              />
            </div>
            <select
              value={styleFilter}
              onChange={(e) => setStyleFilter(e.target.value)}
              className="py-2 px-3 bg-[#FFFDF7] border-2 border-outline-variant focus:border-[#2d6c00] outline-none rounded-xl text-sm font-bold"
            >
              <option value="">Tất cả style</option>
              {styles.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
            <Film className="w-4 h-4 text-[#2d6c00]" />
            <span>{filteredVideos.length} tác phẩm</span>
          </div>
        </div>

        {/* Listing */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-outline-variant space-y-4">
            <span className="text-6xl block">🧑‍🚀</span>
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-bold text-on-surface">Khu vườn chưa có quả ngọt</h3>
              <p className="text-xs text-outline font-bold max-w-xs mx-auto">
                Bé chưa tạo video nào, hoặc tìm kiếm không khớp. Hãy cùng gieo hạt giống câu chuyện thú vị nào!
              </p>
            </div>
            <button
              onClick={() => onNavigate("workspace")}
              className="px-6 py-2 border-2 border-[#2d6c00] text-[#2d6c00] rounded-full text-xs font-extrabold hover:bg-[#6bbf3a]/10"
            >
              Gieo hạt ngay câu chuyện mới
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVideos.map((video) => {
              const daysLeft = video.expirationDaysLeft ?? 7;
              const warn = daysLeft <= 2;
              const isDone = video.status === "completed";
              const isFailed = video.status === "failed";
              const inProgress = !isDone && !isFailed;

              return (
                <motion.div
                  key={video.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl border-2 border-surface-container relative group flex flex-col justify-between"
                >
                  <div className="relative aspect-video bg-black overflow-hidden">
                    <img src={video.coverImage} alt={video.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all" />

                    {/* Play / progress / lỗi */}
                    {isDone && (
                      <button
                        onClick={() => handlePlay(video)}
                        disabled={loadingPreview === video.id}
                        className="absolute inset-0 m-auto w-12 h-12 bg-white rounded-full text-[#2d6c00] flex items-center justify-center shadow-lg transform scale-90 opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all cursor-pointer"
                      >
                        {loadingPreview === video.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-[#2d6c00] translate-x-0.5" />}
                      </button>
                    )}
                    {inProgress && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white gap-2">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-xs font-black">Đang tạo… {video.progress}%</span>
                      </div>
                    )}
                    {isFailed && (
                      <div className="absolute inset-0 flex items-center justify-center bg-red-900/50 text-white text-xs font-black">Tạo thất bại</div>
                    )}

                    <div className={`absolute top-3 left-3 px-3 py-1 bg-white border text-[10px] font-extrabold rounded-full flex items-center gap-1 shadow-sm ${warn ? 'text-red-600 border-red-300' : 'text-[#2d6c00] border-outline-variant'}`}>
                      <Clock className="w-3 h-3" /><span>{daysLeft} ngày còn lại</span>
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/60 text-white rounded text-[10px] font-black">{video.aspectRatio}</div>
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/60 text-white rounded text-xs font-black">{video.duration}</div>
                  </div>

                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-heading text-lg font-bold text-on-surface line-clamp-1 mb-1">{video.title}</h3>
                      <p className="text-xs text-outline font-medium line-clamp-2">{video.prompt}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant bg-surface-container/60 px-3 py-1.5 rounded-xl border border-surface-container">
                      <span className="bg-[#6bbf3a]/15 text-[#2d6c00] px-2 py-0.5 rounded-full text-[10px]">{video.style}</span>
                      <span className="flex items-center gap-1 text-outline"><Calendar className="w-3.5 h-3.5" />{video.date}</span>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-surface-container justify-end">
                      {(() => {
                        const finalUrl = exported[video.id] || video.finalUrl;
                        if (finalUrl) {
                          return (
                            <a
                              href={finalUrl}
                              download
                              target="_blank"
                              rel="noreferrer"
                              className="flex-grow py-2 bg-[#2d6c00] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 cursor-pointer"
                              title="Tải phim hoàn chỉnh (MP4)"
                            >
                              <Download className="w-3.5 h-3.5" /> Tải MP4
                            </a>
                          );
                        }
                        if (isDone) {
                          return (
                            <button
                              onClick={() => handleExport(video)}
                              disabled={exporting[video.id]}
                              className="flex-grow py-2 border-2 border-dashed border-outline-variant hover:border-[#2d6c00] text-outline hover:text-[#2d6c00] transition-colors rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-60"
                              title="Ghép tất cả cảnh thành 1 file MP4"
                            >
                              {exporting[video.id] ? (
                                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang ghép phim...</>
                              ) : (
                                <><Film className="w-3.5 h-3.5" /> Xuất MP4</>
                              )}
                            </button>
                          );
                        }
                        return (
                          <span className="flex-grow py-2 text-center text-[11px] font-bold text-outline">
                            Chờ tạo xong cảnh
                          </span>
                        );
                      })()}
                      <button
                        onClick={() => onDeleteVideo(video.id)}
                        className="p-2 border-2 border-red-100 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                        title="Xóa vĩnh viễn"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview slideshow modal */}
      {previewScenes && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setPreviewScenes(null)}>
          <div className="w-full max-w-3xl bg-white rounded-3xl overflow-hidden border-8 border-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#f5f3ee] py-3.5 px-6 flex items-center justify-between border-b border-surface-container">
              <div className="flex items-center gap-2"><span className="text-xl">🎬</span><h3 className="font-heading text-base font-black text-on-surface">{previewTitle}</h3></div>
              <button onClick={() => setPreviewScenes(null)} className="p-1 px-3 bg-white text-outline hover:text-black border border-outline-variant font-bold text-xs rounded-full cursor-pointer">Đóng ✕</button>
            </div>
            <div className="relative aspect-video bg-black">
              {(() => {
                const sc = previewScenes[previewIdx];
                if (sc.clipUrl) return <video src={sc.clipUrl} autoPlay muted loop controls className="w-full h-full object-cover" />;
                return (
                  <>
                    {sc.imageUrl && <img src={sc.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover animate-[kenburns_2.5s_ease-out]" />}
                    {sc.audioUrl && <audio src={sc.audioUrl} autoPlay />}
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-white text-xs font-bold">{sc.text}</p>
                    </div>
                    <div className="absolute top-3 left-3 flex gap-1">
                      {previewScenes.map((_, i) => (
                        <span key={i} className={`w-2 h-2 rounded-full ${i === previewIdx ? 'bg-white' : 'bg-white/40'}`} />
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
