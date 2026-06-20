import React, { useState } from "react";
import { motion } from "motion/react";
import { TEMPLATES } from "../data";
import { VideoTemplate } from "../types";
import { Search, Sparkles, Filter, ChevronRight, Play, Star, BookOpen, Music, BrainCircuit } from "lucide-react";

interface TemplateLibraryViewProps {
  onSelectTemplate: (prompt: string, title: string) => void;
}

export default function TemplateLibraryView({ onSelectTemplate }: TemplateLibraryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["Tất cả", "Cổ tích", "Khoa học", "Âm nhạc", "Bài học"];

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    const matchesCategory = selectedCategory === "Tất cả" || tpl.category === selectedCategory;
    const matchesSearch = tpl.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tpl.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FFFDF7] pb-24 md:pb-12 pt-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        
        {/* Banner with Squirrel mascot */}
        <div className="bg-[#ffdea5]/30 border-2 border-[#dba110]/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-md border-2 border-[#dba110] animate-bounce">
              🐿️
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#7b5800] font-heading">Thư viện bài giảng & kịch bản thông thái</h2>
              <p className="text-sm text-on-surface-variant font-medium">
                Kho mẫu phim hoạt hình khoa học, cổ tích và kỹ năng sống sinh động dành riêng cho trẻ nhỏ mầm non.
              </p>
            </div>
          </div>
          
          {/* Sparkle Tag */}
          <div className="inline-flex items-center gap-1 bg-white border border-[#dba110]/40 px-4 py-2 rounded-full shadow-sm text-xs text-[#7b5800] font-bold">
            <Sparkles className="w-4 h-4 text-[#dba110] fill-[#dba110]" />
            Cập nhật hàng tuần
          </div>
        </div>

        {/* Filters Shelf */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-white p-4 rounded-3xl border border-surface-container shadow-sm">
          
          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0 custom-scrollbar scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer ${selectedCategory === cat ? 'bg-[#2d6c00] text-white shadow-sm' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm mẫu phim hoạt họa..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#FFFDF7] border-2 border-outline-variant focus:border-[#2d6c00] outline-none rounded-xl text-xs font-medium transition-all"
            />
          </div>

        </div>

        {/* Listing cards */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-surface-container space-y-2">
            <span className="text-5xl block">🔍</span>
            <h3 className="font-heading text-lg font-bold text-on-surface">Không tìm thấy phim mẫu phù hợp</h3>
            <p className="text-xs text-outline font-bold">Vui lòng thử tìm kiếm bằng một thuật ngữ khác.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl border-2 border-surface-container flex flex-col justify-between transition-all group"
              >
                
                {/* Thumb frame */}
                <div className="relative aspect-video overflow-hidden bg-surface-container-low group">
                  <img
                    src={tpl.coverImage}
                    alt={tpl.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10"></div>

                  {/* Left-top Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    <span className="px-3 py-1 bg-white border border-outline-variant text-[10px] font-black rounded-full shadow-sm text-primary">
                      {tpl.ageTag}
                    </span>
                    <span className="px-3 py-1 bg-black/60 text-white text-[10px] font-black rounded-full">
                      {tpl.durationTag}
                    </span>
                  </div>

                  {/* Badges for Hot/New */}
                  {tpl.isPopular && (
                    <span className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                      🔥 Nổi bật
                    </span>
                  )}
                  {tpl.isNew && (
                    <span className="absolute top-3 right-3 bg-blue-500 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                      ✨ Mới
                    </span>
                  )}
                </div>

                {/* Content info */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-black tracking-wider text-outline block">
                      Danh mục: {tpl.category}
                    </span>
                    <h3 className="font-heading text-base font-black text-on-surface hover:text-primary transition-colors">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant font-medium line-clamp-2">
                      {tpl.description}
                    </p>
                  </div>

                  {/* Card Actions connected directly back to Workspace */}
                  <div className="pt-3 border-t border-surface-container">
                    <button
                      onClick={() => onSelectTemplate(
                        `[Cảnh 1] ${tpl.name} bắt đầu ở ngôi làng thanh bình mầm non.
[Cảnh 2] Hành trình vượt qua khu vườn khám phá lý thuyết hoặc bài hát dễ thương.
[Cảnh 3] Giải đố thông thái tương tác giúp trẻ phát triển kỹ năng tư duy phản xạ.
[Cảnh 4] Điểm tổng kết kết thúc bài học ngọt ngào phát âm chuẩn xác.`,
                        tpl.name
                      )}
                      className="w-full py-2.5 bg-[#6bbf3a] text-white hover:bg-[#2d6c00] rounded-full text-xs font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Sử dụng kịch bản mầm này</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
