import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  LayoutGrid, 
  Clock, 
  ChevronDown, 
  Wand2, 
  Star, 
  Play, 
  CheckCircle, 
  Flame, 
  Download, 
  Mic, 
  GitFork, 
  Upload, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Copy, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Palette, 
  ChevronLeft, 
  ChevronUp 
} from "lucide-react";
import { STYLES } from "../data";
import { VideoItem } from "../types";
import { useAuth } from "../context/AuthContext";

interface CreativeWorkspaceViewProps {
  onVideoCreated: (newVideo: VideoItem) => void;
  onNavigate: (tab: string) => void;
}

interface Slide {
  id: string;
  title: string;
  content: string;
  backgroundColor: string;
  textColor: string;
  textAlign: 'left' | 'center' | 'right';
  isBold: boolean;
  isItalic: boolean;
  gradientPreset?: string;
}

export default function CreativeWorkspaceView({ onVideoCreated, onNavigate }: CreativeWorkspaceViewProps) {
  const { isAuthenticated } = useAuth();
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: "slide-1",
      title: "Cảnh 1: Hạt mầm bé nhỏ",
      content: "Một chú hạt giống nhỏ bé nằm ngoan dưới lòng đất ấm áp, đón nhận giọt sương lành.",
      backgroundColor: "#FFFDF7",
      textColor: "#1b1c19",
      textAlign: "center",
      isBold: true,
      isItalic: false,
      gradientPreset: "bg-gradient-to-tr from-[#ffecd2] to-[#fcb69f]"
    },
    {
      id: "slide-2",
      title: "Cảnh 2: Ánh dương chiếu rọi",
      content: "Ánh mặt trời vàng óng sưởi ấm giúp hạt giống vươn vai mọc mầm non xinh tươi.",
      backgroundColor: "#cfe5ff",
      textColor: "#004a77",
      textAlign: "center",
      isBold: false,
      isItalic: false,
      gradientPreset: "bg-gradient-to-tr from-[#a1c4fd] to-[#c2e9fb]"
    }
  ]);
  const [activeSlideId, setActiveSlideId] = useState<string>("slide-1");
  const [selectedStyle, setSelectedStyle] = useState("anime");
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [duration, setDuration] = useState(30);

  // API generation state
  const [isExpanding, setIsExpanding] = useState(false);
  const [storyTitle, setStoryTitle] = useState("");

  // Rendering state
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setProgress] = useState(0);
  const [renderStep, setRenderStep] = useState<'queued' | 'drawing' | 'completed'>('queued');
  const [renderedVideo, setRenderedVideo] = useState<VideoItem | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);

  const activeSlide = slides.find(s => s.id === activeSlideId) || slides[0];

  const handleImportNotebookLM = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAuthenticated) {
      onNavigate("login");
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      try {
        if (file.name.endsWith(".json")) {
          const data = JSON.parse(content);
          let rawSlides: Array<{ title?: string; content?: string }> = [];

          if (Array.isArray(data)) {
            rawSlides = data.map((item: any) => {
              if (typeof item === 'string') {
                return { content: item };
              } else if (item && typeof item === 'object') {
                return {
                  title: item.title || item.name || item.header || item.topic,
                  content: item.content || item.text || item.body || item.description
                };
              }
              return {};
            }).filter((item: any) => item.title || item.content);
          } else if (data && typeof data === 'object') {
            const possibleArray = data.slides || data.scenes || data.notes || data.items || data.data;
            if (Array.isArray(possibleArray)) {
              rawSlides = possibleArray.map((item: any) => {
                if (typeof item === 'string') {
                  return { content: item };
                } else if (item && typeof item === 'object') {
                  return {
                    title: item.title || item.name || item.header || item.topic,
                    content: item.content || item.text || item.body || item.description
                  };
                }
                return {};
              }).filter((item: any) => item.title || item.content);
            } else {
              rawSlides = Object.keys(data).map(key => ({
                title: key,
                content: typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key])
              }));
            }
          }

          if (rawSlides.length === 0) {
            alert("Tệp JSON không chứa danh sách slide hợp lệ!");
            return;
          }

          const parsed = rawSlides.map((s, idx) => ({
            id: `slide-${Date.now()}-${idx}`,
            title: s.title || `Cảnh ${idx + 1}`,
            content: s.content || "",
            backgroundColor: idx % 2 === 0 ? "#FFFDF7" : "#cfe5ff",
            textColor: idx % 2 === 0 ? "#1b1c19" : "#004a77",
            textAlign: "center" as const,
            isBold: false,
            isItalic: false,
            gradientPreset: idx % 2 === 0 ? "bg-gradient-to-tr from-[#ffecd2] to-[#fcb69f]" : "bg-gradient-to-tr from-[#a1c4fd] to-[#c2e9fb]"
          }));
          setSlides(parsed);
          setActiveSlideId(parsed[0].id);
          setStoryTitle(file.name.replace(/\.[^/.]+$/, ""));
          alert(`Đã nhập thành công ${parsed.length} slide từ tệp JSON!`);
        } else {
          const lines = content.split("\n");
          const parsedList: Array<{ title: string; bodyLines: string[] }> = [];
          let currentSlideTitle = "";
          let currentSlideBody: string[] = [];

          const slideMarkerRegex = /^(?:#+\s*|\[?Slide\s*|\[?Cảnh\s*|\[?Trang\s*)(\d+)?(?:[:\]\-]\s*|\s+)?(.*)$/i;

          lines.forEach((line) => {
            const trimmed = line.trim();
            if (!trimmed) return;

            const match = line.match(slideMarkerRegex);
            if (match) {
              if (currentSlideTitle || currentSlideBody.length > 0) {
                parsedList.push({
                  title: currentSlideTitle || `Cảnh ${parsedList.length + 1}`,
                  bodyLines: currentSlideBody
                });
              }
              const titlePart = match[2]?.trim();
              const numPart = match[1];
              currentSlideTitle = titlePart || (numPart ? `Cảnh ${numPart}` : "");
              currentSlideBody = [];
            } else {
              if (currentSlideTitle === "" && currentSlideBody.length === 0) {
                currentSlideTitle = trimmed;
              } else {
                currentSlideBody.push(trimmed);
              }
            }
          });

          if (currentSlideTitle || currentSlideBody.length > 0) {
            parsedList.push({
              title: currentSlideTitle || `Cảnh ${parsedList.length + 1}`,
              bodyLines: currentSlideBody
            });
          }

          if (parsedList.length === 0) {
            const paragraphs = content.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
            paragraphs.forEach((p) => {
              const linesOfP = p.split("\n").map(l => l.trim()).filter(Boolean);
              if (linesOfP.length > 0) {
                parsedList.push({
                  title: linesOfP[0],
                  bodyLines: linesOfP.slice(1)
                });
              }
            });
          }

          if (parsedList.length === 0) {
            alert("Tệp văn bản trống hoặc không thể phân tích nội dung!");
            return;
          }

          const parsed = parsedList.map((slide, idx) => ({
            id: `slide-${Date.now()}-${idx}`,
            title: slide.title || `Cảnh ${idx + 1}`,
            content: slide.bodyLines.join("\n"),
            backgroundColor: idx % 2 === 0 ? "#FFFDF7" : "#cfe5ff",
            textColor: idx % 2 === 0 ? "#1b1c19" : "#004a77",
            textAlign: "center" as const,
            isBold: false,
            isItalic: false,
            gradientPreset: idx % 2 === 0 ? "bg-gradient-to-tr from-[#ffecd2] to-[#fcb69f]" : "bg-gradient-to-tr from-[#a1c4fd] to-[#c2e9fb]"
          }));
          setSlides(parsed);
          setActiveSlideId(parsed[0].id);
          setStoryTitle(file.name.replace(/\.[^/.]+$/, ""));
          alert(`Đã nhập thành công ${parsed.length} cảnh từ tài liệu NotebookLM!`);
        }
      } catch (err) {
        console.error(err);
        alert("Đã xảy ra lỗi khi phân tích nội dung tệp. Vui lòng kiểm tra định dạng tệp!");
      }
    };

    reader.onerror = () => {
      alert("Không thể đọc tệp tin này!");
    };

    reader.readAsText(file);
    e.target.value = "";
  };

  const handleAIExpand = async () => {
    if (!isAuthenticated) {
      onNavigate("login");
      return;
    }
    if (!activeSlide.content.trim()) {
      alert("Vui lòng gõ một vài từ khóa hoặc ý tưởng vào slide trước nhé!");
      return;
    }
    setIsExpanding(true);
    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPrompt: activeSlide.content,
          style: STYLES.find(s => s.id === selectedStyle)?.name || "3D Clay"
        })
      });
      const data = await response.json();
      if (response.ok) {
        const updated = slides.map(s => {
          if (s.id === activeSlideId) {
            return { ...s, content: data.script || data.prompt };
          }
          return s;
        });
        setSlides(updated);
      } else {
        alert("Lỗi từ máy chủ: " + (data.error || "Không thể gọi AI"));
      }
    } catch (err) {
      console.error(err);
      const updated = slides.map(s => {
        if (s.id === activeSlideId) {
          return {
            ...s,
            content: `${s.content}\n\n[Ý tưởng mở rộng] Cảnh vẽ chi tiết bối cảnh xung quanh rực rỡ sắc màu, nhân vật vui vẻ hoạt náo.`
          };
        }
        return s;
      });
      setSlides(updated);
    } finally {
      setIsExpanding(false);
    }
  };

  const handleAddSlide = () => {
    if (!isAuthenticated) {
      onNavigate("login");
      return;
    }
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      title: `Cảnh ${slides.length + 1}: Tiêu đề mới`,
      content: "Nhập nội dung câu chuyện cho cảnh này...",
      backgroundColor: "#FFFDF7",
      textColor: "#1b1c19",
      textAlign: "center",
      isBold: false,
      isItalic: false,
      gradientPreset: "bg-gradient-to-tr from-[#ffecd2] to-[#fcb69f]"
    };
    setSlides([...slides, newSlide]);
    setActiveSlideId(newSlide.id);
  };

  const handleDeleteSlide = (id: string) => {
    if (!isAuthenticated) {
      onNavigate("login");
      return;
    }
    if (slides.length <= 1) {
      alert("Phải có ít nhất 1 slide trong kịch bản truyện!");
      return;
    }
    const idx = slides.findIndex(s => s.id === id);
    const updated = slides.filter(s => s.id !== id);
    setSlides(updated);
    if (activeSlideId === id) {
      const nextActive = updated[idx === 0 ? 0 : idx - 1];
      setActiveSlideId(nextActive.id);
    }
  };

  const handleDuplicateSlide = (slide: Slide) => {
    if (!isAuthenticated) {
      onNavigate("login");
      return;
    }
    const duplicated: Slide = {
      ...slide,
      id: `slide-${Date.now()}`,
      title: `${slide.title} (Nhân bản)`
    };
    const idx = slides.findIndex(s => s.id === slide.id);
    const updated = [...slides];
    updated.splice(idx + 1, 0, duplicated);
    setSlides(updated);
    setActiveSlideId(duplicated.id);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setSlides(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === slides.length - 1) return;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setSlides(updated);
  };

  const updateActiveSlide = (fields: Partial<Slide>) => {
    const updated = slides.map(s => {
      if (s.id === activeSlideId) {
        return { ...s, ...fields };
      }
      return s;
    });
    setSlides(updated);
  };

  const handleCreateVideo = () => {
    if (!isAuthenticated) {
      onNavigate("login");
      return;
    }
    setIsRendering(true);
    setProgress(0);
    setRenderStep('queued');
    setRenderedVideo(null);
    setIsPlaying(false);
  };

  useEffect(() => {
    let interval: any = null;
    if (isRendering) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setRenderStep('completed');
            setIsRendering(false);
            
            const finalTitle = storyTitle || "Cuộc phiêu lưu kỳ diệu " + new Date().toLocaleDateString('vi-VN');
            const styleName = STYLES.find(s => s.id === selectedStyle)?.name || "Anime";
            const coverImg = STYLES.find(s => s.id === selectedStyle)?.coverImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuAGRMABwkcsNkB6cazPtEcY1MX5dp...";
            
            const compiledPrompt = slides.map((s, idx) => `[Cảnh ${idx + 1}: ${s.title}]\n${s.content}`).join("\n\n");

            const newVideo: VideoItem = {
              id: "gen-" + Date.now(),
              title: finalTitle,
              date: new Date().toLocaleDateString('vi-VN'),
              duration: `00:${duration < 10 ? '0' + duration : duration}`,
              style: styleName,
              prompt: compiledPrompt,
              aspectRatio: aspectRatio,
              status: "completed",
              progress: 100,
              voiceId: "bena",
              coverImage: coverImg,
              expirationDaysLeft: 7
            };

            setRenderedVideo(newVideo);
            onVideoCreated(newVideo);
            return 100;
          }

          const nextProgress = prev + 5;
          if (nextProgress > 30 && nextProgress < 85) {
            setRenderStep('drawing');
          }
          return nextProgress;
        });
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isRendering, duration, selectedStyle, aspectRatio, slides, storyTitle]);

  return (
    <div className="min-h-screen bg-[#FFFDF7] pb-24 md:pb-12 pt-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        
        {/* Banner Title */}
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#2d6c00] font-heading flex items-center justify-center md:justify-start gap-2">
            🌱 Sân Chơi Thiết Kế Slide Câu Chuyện
          </h1>
          <p className="text-on-surface-variant font-medium text-sm md:text-base">
            Biên tập và chỉnh sửa slide từ Google NotebookLM để chuẩn bị câu chuyện mầm non hoàn chỉnh.
          </p>
        </div>

        {/* Top Uploader Bar */}
        <div className="bg-white p-5 rounded-3xl border border-surface-container flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-[#2d6c00] flex items-center gap-1.5 uppercase">
              📚 Nạp dữ liệu slide từ Google NotebookLM
            </h3>
            <p className="text-xs text-outline font-medium">
              Nhập tệp (.txt, .md, .json) xuất bản từ NotebookLM để nạp vào editor câu chuyện.
            </p>
          </div>
          <label className="cursor-pointer px-6 py-2.5 bg-[#4bafff]/10 hover:bg-[#4bafff]/25 text-[#00639c] text-xs font-black rounded-full transition-all border border-[#4bafff]/20 flex items-center gap-1.5 shadow-sm">
            <Upload className="w-4 h-4" />
            <span>Nhập tệp Slide NotebookLM</span>
            <input
              type="file"
              accept=".txt,.md,.json"
              onChange={handleImportNotebookLM}
              className="hidden"
            />
          </label>
        </div>

        {/* Canva-like workspace layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT PANEL: Slide thumb navigator */}
          <div className="lg:col-span-3 bg-white p-4 rounded-3xl border border-surface-container flex flex-col justify-between space-y-4 shadow-sm">
            <div className="space-y-3 flex-grow overflow-y-auto max-h-[500px] custom-scrollbar">
              <div className="flex items-center justify-between border-b border-surface-container pb-2 mb-2">
                <span className="text-xs font-black text-on-surface-variant uppercase tracking-wider">Danh sách slide</span>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{slides.length} Trang</span>
              </div>

              <div className="space-y-3">
                {slides.map((slide, idx) => {
                  const isActive = slide.id === activeSlideId;
                  return (
                    <div 
                      key={slide.id}
                      className={`p-3 rounded-2xl border-2 transition-all flex items-stretch gap-3 relative group cursor-pointer ${
                        isActive ? 'border-[#2d6c00] bg-[#6bbf3a]/5 shadow-sm' : 'border-surface-container-high hover:border-outline-variant bg-[#fcfbf9]'
                      }`}
                      onClick={() => setActiveSlideId(slide.id)}
                    >
                      {/* Left index and order tools */}
                      <div className="flex flex-col items-center justify-between text-outline text-xs">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleMoveUp(idx); }}
                          disabled={idx === 0}
                          className="hover:text-black disabled:opacity-30"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <span className="font-extrabold">{idx + 1}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleMoveDown(idx); }}
                          disabled={idx === slides.length - 1}
                          className="hover:text-black disabled:opacity-30"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Small slide style preview block */}
                      <div 
                        className={`w-16 h-12 rounded-lg flex items-center justify-center text-[10px] overflow-hidden border border-surface-container shadow-inner ${slide.gradientPreset || ''}`}
                        style={{ backgroundColor: slide.gradientPreset ? undefined : slide.backgroundColor }}
                      >
                        <span className="line-clamp-1 px-1 font-bold text-[8px]" style={{ color: slide.textColor }}>
                          {slide.title || "Trống"}
                        </span>
                      </div>

                      {/* Quick action badges overlay on hover */}
                      <div className="absolute right-2 top-2 hidden group-hover:flex items-center gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDuplicateSlide(slide); }}
                          className="p-1 bg-white hover:bg-surface-container rounded border border-surface-container shadow-sm"
                          title="Nhân bản slide"
                        >
                          <Copy className="w-3 h-3 text-outline" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteSlide(slide.id); }}
                          className="p-1 bg-white hover:bg-red-50 rounded border border-surface-container shadow-sm"
                          title="Xóa slide"
                        >
                          <Trash2 className="w-3 h-3 text-red-600" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleAddSlide}
              className="w-full py-3 bg-[#6bbf3a]/15 text-[#2d6c00] hover:bg-[#6bbf3a]/25 transition-colors border border-dashed border-[#6bbf3a]/50 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" /> Thêm trang slide mới
            </button>
          </div>

          {/* CENTER PANEL: Large Slide Canvas */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-[#fcfbf9] p-6 rounded-3xl border border-surface-container min-h-[500px] shadow-sm">
            
            {/* Editor Canvas Container inside center grid */}
            <div className="flex-grow flex items-center justify-center py-4">
              
              {!isRendering && !renderedVideo ? (
                <div 
                  className={`w-full max-w-xl aspect-video rounded-3xl shadow-lg border-2 border-surface-container p-8 flex flex-col justify-center relative overflow-hidden transition-all duration-300 ${activeSlide.gradientPreset || ''}`}
                  style={{ 
                    backgroundColor: activeSlide.gradientPreset ? undefined : activeSlide.backgroundColor,
                    borderColor: '#eae8e2'
                  }}
                >
                  {/* Canvas editable text fields */}
                  <div className={`space-y-4 w-full h-full flex flex-col justify-center`}>
                    <input 
                      type="text"
                      value={activeSlide.title}
                      onChange={(e) => updateActiveSlide({ title: e.target.value })}
                      placeholder="Tiêu đề slide..."
                      className="bg-transparent border-b border-transparent hover:border-outline-variant focus:border-[#2d6c00] outline-none text-lg font-black w-full text-center transition-all"
                      style={{ 
                        color: activeSlide.textColor,
                        textAlign: activeSlide.textAlign,
                        fontWeight: activeSlide.isBold ? "900" : "400",
                        fontStyle: activeSlide.isItalic ? "italic" : "normal"
                      }}
                    />
                    
                    <textarea
                      value={activeSlide.content}
                      onChange={(e) => updateActiveSlide({ content: e.target.value })}
                      placeholder="Nhập nội dung slide câu chuyện tại đây..."
                      className="bg-transparent border border-transparent hover:border-outline-variant focus:border-[#2d6c00] outline-none text-xs font-bold w-full h-24 p-2 transition-all resize-none overflow-hidden text-center leading-relaxed"
                      style={{ 
                        color: activeSlide.textColor,
                        textAlign: activeSlide.textAlign,
                        fontWeight: activeSlide.isBold ? "bold" : "normal",
                        fontStyle: activeSlide.isItalic ? "italic" : "normal"
                      }}
                    />
                  </div>
                </div>
              ) : isRendering ? (
                <div className="w-full max-w-xl aspect-video bg-white rounded-3xl border border-surface-container shadow-md p-8 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-[#6bbf3a]/10 rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-4xl">🌿</span>
                  </div>
                  <div className="space-y-3 w-full max-w-xs">
                    <h4 className="font-heading text-base font-black text-[#2d6c00]">Đang tạo slide kịch bản câu chuyện...</h4>
                    <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden shadow-inner border border-surface-container-high relative">
                      <div 
                        className="h-full bg-gradient-to-r from-[#6bbf3a] to-[#2d6c00] rounded-full transition-all duration-300"
                        style={{ width: `${renderProgress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-black text-outline">{renderProgress}% Hoàn tất</span>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-xl aspect-video rounded-3xl overflow-hidden shadow-lg bg-black relative group">
                  {isPlaying ? (
                    <video
                      src="https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4"
                      autoPlay
                      controls
                      className="w-full h-full object-cover"
                      onEnded={() => setIsPlaying(false)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col justify-center items-center">
                      <img
                        src={renderedVideo?.coverImage}
                        alt="cover"
                        className="absolute inset-0 w-full h-full object-cover filter brightness-70"
                      />
                      <button
                        onClick={() => setIsPlaying(true)}
                        className="bg-white/95 rounded-full p-4 text-[#2d6c00] shadow-xl hover:scale-110 transition-transform cursor-pointer relative z-10"
                      >
                        <Play className="w-10 h-10 fill-[#2d6c00] translate-x-0.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom quick control prompts */}
            <div className="border-t border-surface-container pt-3 flex items-center justify-between text-xs text-outline font-bold">
              <span>Đang chọn: <strong>{activeSlide.title || "Không có tiêu đề"}</strong></span>
              <button 
                onClick={handleAIExpand}
                disabled={isExpanding}
                className="px-3 py-1 bg-secondary-container hover:bg-secondary text-white rounded-full flex items-center gap-1 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>AI Tối ưu hóa văn bản slide</span>
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: Slide Properties */}
          <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-surface-container space-y-5 shadow-sm">
            <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-wider border-b border-surface-container pb-2">
              Bảng Thuộc Tính Slide
            </h3>

            {/* Wording configuration */}
            <div className="space-y-4 text-xs font-bold text-on-surface-variant">
              <div className="space-y-1.5">
                <label className="text-[10px] text-outline uppercase tracking-wider block">Tiêu đề Slide</label>
                <input 
                  type="text"
                  value={activeSlide.title}
                  onChange={(e) => updateActiveSlide({ title: e.target.value })}
                  className="w-full p-2.5 bg-[#FFFDF7] border-2 border-outline-variant focus:border-[#2d6c00] outline-none rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-outline uppercase tracking-wider block">Nội dung Slide</label>
                <textarea 
                  value={activeSlide.content}
                  onChange={(e) => updateActiveSlide({ content: e.target.value })}
                  className="w-full h-24 p-2.5 bg-[#FFFDF7] border-2 border-outline-variant focus:border-[#2d6c00] outline-none rounded-xl text-xs resize-none"
                />
              </div>
            </div>

            {/* Typography / Formatting */}
            <div className="space-y-2">
              <span className="text-[10px] text-outline font-black uppercase tracking-wider block">Định dạng chữ</span>
              <div className="flex gap-2">
                <button
                  onClick={() => updateActiveSlide({ isBold: !activeSlide.isBold })}
                  className={`p-2 rounded-xl border flex-grow flex items-center justify-center transition-all ${
                    activeSlide.isBold ? 'border-[#2d6c00] bg-[#6bbf3a]/15 text-[#2d6c00]' : 'border-outline hover:bg-surface-container'
                  }`}
                  title="Chữ đậm"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => updateActiveSlide({ isItalic: !activeSlide.isItalic })}
                  className={`p-2 rounded-xl border flex-grow flex items-center justify-center transition-all ${
                    activeSlide.isItalic ? 'border-[#2d6c00] bg-[#6bbf3a]/15 text-[#2d6c00]' : 'border-outline hover:bg-surface-container'
                  }`}
                  title="Chữ nghiêng"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <div className="h-8 w-[1px] bg-surface-container"></div>
                <button
                  onClick={() => updateActiveSlide({ textAlign: "left" })}
                  className={`p-2 rounded-xl border flex-grow flex items-center justify-center transition-all ${
                    activeSlide.textAlign === "left" ? 'border-[#2d6c00] bg-[#6bbf3a]/15 text-[#2d6c00]' : 'border-outline hover:bg-surface-container'
                  }`}
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => updateActiveSlide({ textAlign: "center" })}
                  className={`p-2 rounded-xl border flex-grow flex items-center justify-center transition-all ${
                    activeSlide.textAlign === "center" ? 'border-[#2d6c00] bg-[#6bbf3a]/15 text-[#2d6c00]' : 'border-outline hover:bg-surface-container'
                  }`}
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => updateActiveSlide({ textAlign: "right" })}
                  className={`p-2 rounded-xl border flex-grow flex items-center justify-center transition-all ${
                    activeSlide.textAlign === "right" ? 'border-[#2d6c00] bg-[#6bbf3a]/15 text-[#2d6c00]' : 'border-outline hover:bg-surface-container'
                  }`}
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Colors presets */}
            <div className="space-y-3">
              <span className="text-[10px] text-outline font-black uppercase tracking-wider block">Giao diện (Màu nền & Phông chữ)</span>
              
              {/* Pastel preset color nodes */}
              <div className="grid grid-cols-5 gap-2">
                {[
                  { bg: "#FFFDF7", text: "#1b1c19", label: "Kem" },
                  { bg: "#cfe5ff", text: "#004a77", label: "Xanh" },
                  { bg: "#d1e7dd", text: "#0f5132", label: "Lục" },
                  { bg: "#f8d7da", text: "#842029", label: "Hồng" },
                  { bg: "#fff3cd", text: "#664d03", label: "Vàng" }
                ].map((color, idx) => (
                  <div 
                    key={idx}
                    onClick={() => updateActiveSlide({ backgroundColor: color.bg, textColor: color.text, gradientPreset: undefined })}
                    className="w-8 h-8 rounded-full cursor-pointer border border-outline-variant shadow-sm hover:scale-110 transition-transform"
                    style={{ backgroundColor: color.bg }}
                    title={color.label}
                  />
                ))}
              </div>

              {/* Background gradient presets */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[9px] text-outline font-black uppercase tracking-wider block">Gợi ý Gradient</span>
                <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                  {[
                    { class: "bg-gradient-to-tr from-[#ffecd2] to-[#fcb69f]", label: "Soft Peach" },
                    { class: "bg-gradient-to-tr from-[#a1c4fd] to-[#c2e9fb]", label: "Soft Sky" },
                    { class: "bg-gradient-to-tr from-[#d4fc79] to-[#96e6a1]", label: "Soft Mint" },
                    { class: "bg-gradient-to-tr from-[#fbc2eb] to-[#a6c1ee]", label: "Soft Lavender" }
                  ].map((grad, idx) => (
                    <div 
                      key={idx}
                      onClick={() => updateActiveSlide({ gradientPreset: grad.class, textColor: "#1b1c19" })}
                      className={`w-10 h-7 rounded cursor-pointer border border-surface-container shadow-sm flex-shrink-0 ${grad.class}`}
                      title={grad.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Downstream compile parameters */}
            <div className="border-t border-surface-container pt-4 space-y-3">
              {/* Ratio Setting */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-outline font-black uppercase tracking-wider block">Tỷ lệ slide trình chiếu</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAspectRatio('16:9')}
                    className={`flex-grow py-2 border rounded-xl text-xs font-extrabold flex items-center justify-center transition-all ${
                      aspectRatio === '16:9' ? 'border-[#2d6c00] bg-[#6bbf3a]/15 text-[#2d6c00]' : 'border-outline hover:bg-surface-container'
                    }`}
                  >
                    16:9
                  </button>
                  <button
                    onClick={() => setAspectRatio('9:16')}
                    className={`flex-grow py-2 border rounded-xl text-xs font-extrabold flex items-center justify-center transition-all ${
                      aspectRatio === '9:16' ? 'border-[#2d6c00] bg-[#6bbf3a]/15 text-[#2d6c00]' : 'border-outline hover:bg-surface-container'
                    }`}
                  >
                    9:16
                  </button>
                  <button
                    onClick={() => setAspectRatio('1:1')}
                    className={`flex-grow py-2 border rounded-xl text-xs font-extrabold flex items-center justify-center transition-all ${
                      aspectRatio === '1:1' ? 'border-[#2d6c00] bg-[#6bbf3a]/15 text-[#2d6c00]' : 'border-outline hover:bg-surface-container'
                    }`}
                  >
                    1:1
                  </button>
                </div>
              </div>

              {/* Style picker */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-outline font-black uppercase tracking-wider block">Mỹ thuật video hoạt họa</label>
                <select 
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full text-xs font-bold py-2 px-3 border border-outline rounded-xl bg-white"
                >
                  {STYLES.map((style) => (
                    <option key={style.id} value={style.id}>{style.name}</option>
                  ))}
                </select>
              </div>

              {/* Submit CTA */}
              {!renderedVideo ? (
                <button
                  onClick={handleCreateVideo}
                  disabled={isRendering || isExpanding}
                  className="w-full py-4.5 bg-gradient-to-r from-[#F5B82E] to-[#FF9F40] text-white rounded-full font-extrabold text-xs shadow-md hover:scale-102 transition-transform cursor-pointer button-3d-yellow"
                >
                  <span>✨ Hoàn tất chuẩn bị slide & tiếp tục workflow</span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigate("workflow")}
                  className="w-full py-4.5 bg-[#2d6c00] text-white rounded-full font-extrabold text-xs shadow-md hover:scale-102 transition-transform cursor-pointer"
                >
                  <span>➜ Tiếp tục cấu hình Workflow</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
