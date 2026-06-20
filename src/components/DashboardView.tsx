import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, Play, Trash2, Calendar, Film, Bell, Clock, RefreshCw, Star, PlayCircle } from "lucide-react";
import { VideoItem } from "../types";

interface DashboardViewProps {
  videos: VideoItem[];
  onPlayVideo: (videoUrl: string, title: string) => void;
  onDeleteVideo: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export default function DashboardView({ videos, onPlayVideo, onDeleteVideo, onNavigate }: DashboardViewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FFFDF7] pb-24 md:pb-12 pt-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        
        {/* Banner with Sprout cute mascot */}
        <div className="bg-[#6bbf3a]/10 border-2 border-[#6bbf3a]/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-md border-2 border-[#6bbf3a] animate-wiggle">
              🌱
            </div>
            <div>
              <h2 className="text-2xl font-black text-primary font-heading">Thư viện của bé hạt mầm</h2>
              <p className="text-sm text-on-surface-variant font-medium">
                Nơi lưu trữ những tác phẩm thông thái đã đơm hoa kết trái từ trí tưởng tượng tuyệt vời của con.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("workspace")}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#F5B82E] to-[#FF9F40] text-white font-extrabold text-sm squishy-button border-b-4 border-orange-600/20 shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Star className="w-4 h-4 fill-white" />
            Gieo hạt mới
          </button>
        </div>

        {/* Filters and search info */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-surface-container shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm tác phẩm của bé..."
              className="w-full pl-10 pr-4 py-2 bg-[#FFFDF7] border-2 border-outline-variant focus:border-[#2d6c00] outline-none rounded-xl text-sm font-medium transition-all"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
            <Film className="w-4 h-4 text-[#2d6c00]" />
            <span>Đang lưu trữ {filteredVideos.length} / 100 tác phẩm</span>
          </div>
        </div>

        {/* Listing of custom creations */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-outline-variant space-y-4">
            <span className="text-6xl block">🧑‍🚀</span>
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-bold text-on-surface">Khu vườn chưa có quả ngọt</h3>
              <p className="text-xs text-outline font-bold max-w-xs mx-auto">
                Bé chưa tạo video mầm non nào, hoặc tìm kiếm không khớp. Hãy cùng gieo hạt giống câu chuyện thú vị nào!
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
              const hasExpirationWarning = daysLeft <= 2;
              
              return (
                <motion.div
                  key={video.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl border-2 border-surface-container relative group flex flex-col justify-between"
                >
                  
                  {/* Thumbnail Cover with days left indicator badge */}
                  <div className="relative aspect-video bg-black overflow-hidden group">
                    <img
                      src={video.coverImage}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all"></div>
                    
                    {/* Floating Play Overlays */}
                    <button
                      onClick={() => onPlayVideo(
                        "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
                        video.title
                      )}
                      className="absolute inset-0 m-auto w-12 h-12 bg-white rounded-full text-[#2d6c00] flex items-center justify-center shadow-lg transform scale-90 opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                      <Play className="w-5 h-5 fill-[#2d6c00] translate-x-0.5" />
                    </button>

                    {/* Left corner days countdown stamp */}
                    <div className={`absolute top-3 left-3 px-3 py-1 bg-white border border-outline-variant text-[10px] font-extrabold rounded-full flex items-center gap-1 shadow-sm ${hasExpirationWarning ? 'text-red-600' : 'text-[#2d6c00]'}`}>
                      <Clock className="w-3 h-3" />
                      <span>{daysLeft} ngày còn lại</span>
                    </div>

                    {/* Right corner Aspect ratio */}
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/60 text-white rounded text-[10px] font-black">
                      {video.aspectRatio}
                    </div>

                    {/* Duration badge bottom-right */}
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/60 text-white rounded text-xs font-black">
                      {video.duration}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-heading text-lg font-bold text-on-surface line-clamp-1 mb-1">
                        {video.title}
                      </h3>
                      <p className="text-xs text-outline font-medium line-clamp-2">
                        {video.prompt}
                      </p>
                    </div>

                    {/* Info Rows */}
                    <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant bg-surface-container/60 px-3 py-1.5 rounded-xl border border-surface-container">
                      <span className="bg-[#6bbf3a]/15 text-[#2d6c00] px-2 py-0.5 rounded-full text-[10px]">
                        {video.style}
                      </span>
                      <span className="flex items-center gap-1 text-outline">
                        <Calendar className="w-3.5 h-3.5" />
                        {video.date}
                      </span>
                    </div>

                    {/* Actions Row */}
                    <div className="flex gap-2 pt-2 border-t border-surface-container justify-end">
                      <button
                        onClick={() => {
                          if (confirm(`Bạn muốn mở bảng điều khiển workflow của "${video.title}" để điều chỉnh từng slide kịch bản?`)) {
                            onNavigate("workflow");
                          }
                        }}
                        className="flex-grow py-2 border-2 border-dashed border-outline-variant hover:border-[#2d6c00] text-outline hover:text-[#2d6c00] transition-colors rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Sửa nét vẽ
                      </button>
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
    </div>
  );
}
