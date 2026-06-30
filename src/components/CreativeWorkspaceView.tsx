import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, LayoutGrid, Clock, ChevronDown, Wand2, Star, Play, CheckCircle, Flame, Download, Mic, GitFork } from "lucide-react";
import { STYLES, VOICES } from "../data";
import { VideoItem } from "../types";

interface CreativeWorkspaceViewProps {
  userEmail: string | null;
  onVideoCreated: (newVideo: VideoItem) => void;
  onNavigate: (tab: string) => void;
}

export default function CreativeWorkspaceView({ userEmail, onVideoCreated, onNavigate }: CreativeWorkspaceViewProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("anime");
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [duration, setDuration] = useState(30);
  const [selectedVoice, setSelectedVoice] = useState("bena");
  
  // API generation state
  const [isExpanding, setIsExpanding] = useState(false);
  const [expandedText, setExpandedText] = useState("");
  const [storyTitle, setStoryTitle] = useState("");

  // Rendering state
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setProgress] = useState(0);
  const [renderStep, setRenderStep] = useState<'queued' | 'drawing' | 'completed'>('queued');
  const [renderedVideo, setRenderedVideo] = useState<VideoItem | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);

  // Magic API expand prompt callback
  const handleAIExpand = async () => {
    if (!userEmail) {
      alert("Ba mẹ vui lòng đăng nhập để sử dụng tính năng viết kịch bản thông minh bằng AI nhé!");
      onNavigate("login");
      return;
    }
    if (!prompt.trim()) {
      alert("Vui lòng gõ một vài từ khóa hoặc ý tưởng trước nhé!");
      return;
    }
    setIsExpanding(true);
    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPrompt: prompt,
          style: STYLES.find(s => s.id === selectedStyle)?.name || "3D Clay"
        })
      });
      const data = await response.json();
      if (response.ok) {
        setPrompt(data.script || data.prompt);
        setStoryTitle(data.title || "Câu chuyện kỳ diệu");
        if (data.isMock) {
          console.log("fallback mock expanded script triggered successfully.");
        }
      } else {
        alert("Lỗi từ máy chủ: " + (data.error || "Không thể gọi AI"));
      }
    } catch (err) {
      console.error(err);
      // Fallback locally
      setPrompt(`[Cảnh 1] Một chú hạt giống nhỏ ${prompt} trong khu rừng hạnh phúc. Chú gieo mình xuống lòng đất ẩm mát.
[Cảnh 2] Những giọt sương mai dịu dàng tí tách tưới mát cho hạt giống.
[Cảnh 3] Ánh mặt trời vàng óng như mật ong sưởi ấm, giúp hạt mầm tò mò lấp ló vươn vai mọc lên chiếc lá non xinh tươi đầu tiên.
[Cảnh 4] Cây non phát triển thành đóa hoa thông thái rực rỡ, tỏa hương thơm ngát giúp học tập muôn loài.`);
      setStoryTitle("Món quà của Hạt Giống nhỏ");
    } finally {
      setIsExpanding(false);
    }
  };

  // Pre-seed template suggestions
  const handleSelectSuggestion = (text: string) => {
    setPrompt(text);
  };

  const handleNotebookLMImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userEmail) {
      alert("Ba mẹ vui lòng đăng nhập để sử dụng tính năng nhập kịch bản slide nhé!");
      onNavigate("login");
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text !== "string") return;

      try {
        const result = parseNotebookLMContent(file.name, text);
        setPrompt(result.script);
        setStoryTitle(result.title);
        alert(`Nhập kịch bản "${result.title}" từ NotebookLM thành công!`);
      } catch (err: any) {
        alert("Không thể phân tích tệp NotebookLM: " + err.message);
      }
    };
    reader.onerror = () => {
      alert("Lỗi khi đọc tệp.");
    };
    reader.readAsText(file);
  };

  // Simulating video generation
  const handleCreateVideo = () => {
    if (!userEmail) {
      alert("Ba mẹ vui lòng đăng nhập để sử dụng tính năng tạo video AI nhé!");
      onNavigate("login");
      return;
    }
    if (!prompt.trim()) {
      alert("Hãy nhập kịch bản hoặc ý tưởng câu chuyện mầm non trước khi gieo hạt giống sáng tạo nhé!");
      return;
    }
    setIsRendering(true);
    setProgress(0);
    setRenderStep('queued');
    setRenderedVideo(null);
    setIsPlaying(false);
  };

  // Rendering ticks
  useEffect(() => {
    let interval: any = null;
    if (isRendering) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setRenderStep('completed');
            setIsRendering(false);
            
            // Build completed VideoItem
            const finalTitle = storyTitle || "Cuộc phiêu lưu kỳ diệu " + new Date().toLocaleDateString('vi-VN');
            const styleName = STYLES.find(s => s.id === selectedStyle)?.name || "Anime";
            const coverImg = STYLES.find(s => s.id === selectedStyle)?.coverImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuAGRMABwkcsNkB6cazPtEcY1MX5dp...";
            
            const newVideo: VideoItem = {
              id: "gen-" + Date.now(),
              title: finalTitle,
              date: new Date().toLocaleDateString('vi-VN'),
              duration: `00:${duration < 10 ? '0' + duration : duration}`,
              style: styleName,
              prompt: prompt,
              aspectRatio: aspectRatio,
              status: "completed",
              progress: 100,
              voiceId: selectedVoice,
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
  }, [isRendering, duration, selectedStyle, selectedVoice, aspectRatio, prompt, storyTitle]);

  return (
    <div className="min-h-screen bg-[#FFFDF7] pb-24 md:pb-12 pt-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        
        {/* Banner Title */}
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#2d6c00] font-heading flex items-center justify-center md:justify-start gap-2">
            🌱 Khu Vườn Sáng Tạo Video
          </h1>
          <p className="text-on-surface-variant font-medium text-sm md:text-base">
            Gieo hạt mầm ý tưởng, chờ đợi giây lát để nhận tác phẩm hoạt họa tuyệt vời của con!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: CONTROLS */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Prompt Input */}
            <div className="bg-white p-6 rounded-3xl shadow-[0_16px_32px_rgba(217,179,140,0.15)] border-2 border-surface-container relative group">
              <h2 className="font-heading text-xl text-primary font-black mb-3">
                Kể cho mình nghe câu chuyện của bé nhé!
              </h2>
              
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-44 p-4 bg-[#FFFDF7] border-2 border-outline-variant rounded-2xl focus:ring-4 focus:ring-primary-container/20 focus:border-primary outline-none transition-all resize-none font-sans text-base text-on-surface"
                  placeholder="Ví dụ: Một chú hạt giống nhỏ đi phiêu lưu khắp rừng già để tìm kiếm kho báu trí tuệ..."
                />
                
                <div className="absolute bottom-3 right-3 flex items-center gap-3">
                  <span className="text-xs text-outline font-black">
                    {prompt.length} / 2000
                  </span>
                  <button
                    onClick={handleAIExpand}
                    disabled={isExpanding}
                    className={`w-10 h-10 rounded-full ${isExpanding ? 'bg-outline animate-spin' : 'bg-secondary-container hover:scale-110'} text-white flex items-center justify-center transition-all shadow-md cursor-pointer`}
                    title="Văn bản thông minh bằng AI"
                  >
                    <Wand2 className="w-5 h-5 fill-white" />
                  </button>
                </div>
              </div>

              {/* Suggestions */}
              <div className="pt-4 flex flex-wrap gap-2 items-center">
                <span className="text-xs text-on-surface-variant font-extrabold uppercase">Gợi ý chủ đề:</span>
                <button
                  onClick={() => handleSelectSuggestion("Chú rùa già thông thái kể chuyện đại dương xanh bảo vệ san hô")}
                  className="px-3 py-1 bg-[#6bbf3a]/10 hover:bg-[#6bbf3a]/25 text-xs text-[#2d6c00] font-bold rounded-full transition-all border border-[#6bbf3a]/20"
                >
                  🐢 Đại dương
                </button>
                <button
                  onClick={() => handleSelectSuggestion("Bé gấu trúc dũng cảm tự học cách dọn dẹp đồ chơi sau khi chơi xong")}
                  className="px-3 py-1 bg-[#4bafff]/10 hover:bg-[#4bafff]/25 text-xs text-secondary font-bold rounded-full transition-all border border-[#4bafff]/20"
                >
                  🐼 Ngăn nắp
                </button>
                <button
                  onClick={() => handleSelectSuggestion("Một phi thuyền nhỏ bay thăm sáu hành tinh thân hữu rực rỡ ngoài không gian")}
                  className="px-3 py-1 bg-[#ffdea5]/40 hover:bg-[#ffdea5]/60 text-xs text-[#7b5800] font-bold rounded-full transition-all border border-[#ffdea5]/50"
                >
                  🚀 Vũ trụ
                </button>
              </div>

              {/* NotebookLM Import Option */}
              <div className="pt-3 border-t border-[#eae8e2] mt-4 flex items-center justify-between">
                <span className="text-xs text-[#404a39] font-black flex items-center gap-1">
                  📚 Nhập slide từ NotebookLM:
                </span>
                <label className="px-4 py-1.5 bg-[#4bafff]/10 hover:bg-[#4bafff]/25 text-xs text-[#00639c] font-black rounded-full transition-all border border-[#4bafff]/20 cursor-pointer flex items-center gap-1">
                  📥 Chọn tệp (.txt, .md, .json)
                  <input
                    type="file"
                    accept=".txt,.md,.json"
                    onChange={handleNotebookLMImport}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Style Picker */}
            <div className="bg-[#FFFDF7] p-6 rounded-3xl border-2 border-dashed border-outline-variant space-y-4">
              <h3 className="font-heading text-on-surface-variant uppercase tracking-wider text-xs font-black flex items-center gap-2">
                🎨 Chọn phong cách mỹ thuật
              </h3>
              
              <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                {STYLES.map((style) => (
                  <div
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className="flex-shrink-0 cursor-pointer text-center group"
                  >
                    <div className={`w-24 h-24 rounded-2xl overflow-hidden border-4 ${selectedStyle === style.id ? 'border-[#2d6c00] ring-4 ring-[#6bbf3a]/30' : 'border-transparent'} relative shadow-md transition-all group-hover:scale-105 duration-200`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                      <div className="absolute bottom-1 left-0 right-0 text-center text-white font-bold text-xs z-20">
                        {style.name}
                      </div>
                      <img
                        src={style.coverImage}
                        alt={style.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-on-surface-variant italic">
                * {STYLES.find(s => s.id === selectedStyle)?.promptDescription}
              </p>
            </div>

            {/* Layout Settings Rows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Ratio Setting */}
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-surface-container space-y-3">
                <label className="text-xs font-extrabold text-on-surface-variant flex items-center gap-2 uppercase tracking-wide">
                  <LayoutGrid className="w-4.5 h-4.5 text-[#2d6c00]" /> Tỷ lệ khung hình
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAspectRatio('16:9')}
                    className={`flex-1 py-3 border-2 ${aspectRatio === '16:9' ? 'border-[#2d6c00] bg-[#6bbf3a]/5' : 'border-surface-container-high hover:border-[#6bbf3a]'} rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer`}
                  >
                    <div className={`w-8 h-4 ${aspectRatio === '16:9' ? 'bg-[#6bbf3a]/30 border-[#2d6c00]' : 'bg-surface-container-high border-outline'} border-2 rounded-sm`}></div>
                    <span className="text-xs font-extrabold">16:9</span>
                  </button>
                  <button
                    onClick={() => setAspectRatio('9:16')}
                    className={`flex-1 py-3 border-2 ${aspectRatio === '9:16' ? 'border-[#2d6c00] bg-[#6bbf3a]/5' : 'border-surface-container-high hover:border-[#6bbf3a]'} rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer`}
                  >
                    <div className={`w-4 h-8 ${aspectRatio === '9:16' ? 'bg-[#6bbf3a]/30 border-[#2d6c00]' : 'bg-surface-container-high border-outline'} border-2 rounded-sm`}></div>
                    <span className="text-xs font-extrabold">9:16</span>
                  </button>
                  <button
                    onClick={() => setAspectRatio('1:1')}
                    className={`flex-1 py-3 border-2 ${aspectRatio === '1:1' ? 'border-[#2d6c00] bg-[#6bbf3a]/5' : 'border-surface-container-high hover:border-[#6bbf3a]'} rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer`}
                  >
                    <div className={`w-6 h-6 ${aspectRatio === '1:1' ? 'bg-[#6bbf3a]/30 border-[#2d6c00]' : 'bg-surface-container-high border-outline'} border-2 rounded-sm`}></div>
                    <span className="text-xs font-extrabold">1:1</span>
                  </button>
                </div>
              </div>

              {/* Duration Setting */}
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-surface-container space-y-3">
                <label className="text-xs font-extrabold text-on-surface-variant flex items-center gap-2 uppercase tracking-wide">
                  <Clock className="w-4.5 h-4.5 text-[#2d6c00]" /> Thời lượng video
                </label>
                <div className="pt-2">
                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="5"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full h-2 bg-surface-container rounded-full appearance-none cursor-pointer accent-[#2d6c00]"
                  />
                  <div className="flex justify-between items-center mt-2 text-xs text-outline font-bold">
                    <span>15 giây</span>
                    <span className="bg-[#6bbf3a]/15 text-[#2d6c00] px-2 py-0.5 rounded-full font-extrabold text-sm">{duration} giây</span>
                    <span>60 giây</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Narrator selector */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-low border border-outline-variant">
                  <img
                    src={VOICES.find(v => v.id === selectedVoice)?.avatarUrl}
                    alt="Voice avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold">Giọng đọc kể chuyện hủ hỉ</h4>
                  <p className="text-xs text-outline font-bold">
                    {VOICES.find(v => v.id === selectedVoice)?.name} - Tiếng Việt ({VOICES.find(v => v.id === selectedVoice)?.region})
                  </p>
                </div>
              </div>
              <div className="relative">
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="py-1 px-4 border border-outline rounded-full font-bold text-xs bg-white text-on-surface shadow-sm focus:ring-2 focus:ring-[#2d6c00] outline-none"
                >
                  {VOICES.map(voice => (
                    <option key={voice.id} value={voice.id}>{voice.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* CTA Generate Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCreateVideo}
                disabled={isRendering || isExpanding}
                className="w-full py-5 bg-gradient-to-r from-[#F5B82E] to-[#FF9F40] text-white rounded-full font-extrabold text-xl button-3d-yellow flex items-center justify-center gap-3 cursor-pointer shadow-lg hover:brightness-105"
              >
                <span>✨ Tạo video mầm non AI ngay</span>
              </button>
              <div className="flex items-center justify-center gap-2 text-on-surface-variant font-extrabold text-xs">
                <Star className="w-4.5 h-4.5 text-[#dba110] fill-[#dba110]" />
                <span>Bé còn 12 lượt gieo hạt giống miễn phí hôm nay</span>
              </div>
            </div>

          </div>

          {/* RIGHT: PREVIEW / PROGRESS */}
          <aside className="lg:col-span-5">
            <div className="sticky top-24 bg-white border-8 border-white rounded-3xl shadow-xl aspect-video lg:aspect-auto lg:h-[620px] flex flex-col items-stretch overflow-hidden relative">
              
              {/* Inner container */}
              <div className="flex-grow flex flex-col items-center justify-center p-8 bg-[#f5f3ee] text-center relative overflow-hidden">
                
                {/* IDLE state */}
                {!isRendering && !renderedVideo && (
                  <div className="space-y-6 flex flex-col items-center z-10">
                    <div className="w-48 h-48 bg-white rounded-full shadow-md flex items-center justify-center border-4 border-[#6bbf3a] animate-pulse">
                      <span className="text-7xl">🎬</span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-heading text-lg font-black text-[#2d6c00]">Phòng gieo hạt giống đã sẵn sàng</h3>
                      <p className="text-sm font-medium text-on-surface-variant max-w-xs mx-auto">
                        Nhấn nút màu cam để biến câu chuyện cổ tích mong ước của bé thành rạp chiếu phim mượt mà.
                      </p>
                    </div>
                  </div>
                )}

                {/* RENDERING / PROGRESS states */}
                {isRendering && (
                  <div className="space-y-8 w-full z-10">
                    <div className="w-44 h-44 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-[#6bbf3a] mx-auto relative animate-bounce">
                      <span className="text-6xl animate-pulse">🌿</span>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-heading text-lg font-black text-[#2d6c00]">Đang gieo hạt giống sáng tạo...</h3>
                      
                      {/* Workflow indicators */}
                      <div className="flex justify-between items-center w-full px-4 relative max-w-sm mx-auto">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-white -translate-y-1/2 z-0 rounded-full"></div>
                        <div
                          className="absolute top-1/2 left-0 h-1 bg-[#6bbf3a] -translate-y-1/2 z-0 rounded-full transition-all duration-300"
                          style={{ width: `${renderProgress}%` }}
                        ></div>
                        <div className={`z-10 px-3 py-1 rounded-full text-xs font-black border-2 ${renderStep === 'queued' ? 'bg-[#6bbf3a] text-white border-white' : 'bg-white text-[#2d6c00] border-[#6bbf3a]'}`}>
                          Xếp hàng
                        </div>
                        <div className={`z-10 px-3 py-1 rounded-full text-xs font-black border-2 ${renderStep === 'drawing' ? 'bg-[#6bbf3a] text-white border-white' : 'bg-white text-[#2d6c00] border-[#6bbf3a]'}`}>
                          Đang vẽ
                        </div>
                        <div className={`z-10 px-3 py-1 rounded-full text-xs font-black border-2 ${renderStep === 'completed' ? 'bg-[#6bbf3a] text-white border-white' : 'bg-white text-outline border-surface-container-high'}`}>
                          Hoàn tất
                        </div>
                      </div>

                      {/* Progress Bar background layout */}
                      <div className="w-full h-4 bg-white rounded-full overflow-hidden shadow-inner border border-surface-container-high max-w-sm mx-auto relative">
                        <div
                          className="h-full bg-gradient-to-r from-[#6bbf3a] to-[#2d6c00] rounded-full transition-all duration-300"
                          style={{ width: `${renderProgress}%` }}
                        ></div>
                      </div>

                      <p className="text-xs font-bold text-on-surface-variant italic">
                        &quot;Phép màu nuôi dưỡng mầm trí tuệ đang xuất hiện... {renderProgress}%&quot;
                      </p>
                    </div>
                  </div>
                )}

                {/* COMPLETED SUCCESS states */}
                {renderedVideo && !isRendering && (
                  <div className="space-y-6 w-full h-full flex flex-col justify-center items-center z-10">
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-black group-hover:scale-102 transition-transform">
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
                            src={renderedVideo.coverImage}
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

                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 bg-[#6bbf3a]/15 text-[#2d6c00] px-3 py-1 rounded-full text-xs font-bold">
                        <CheckCircle className="w-3.5 h-3.5 fill-[#2d6c00] text-white" />
                        Gieo hạt video thành công!
                      </div>
                      <h3 className="font-heading text-lg font-black text-on-surface">{renderedVideo.title}</h3>
                      <p className="text-xs text-outline">{renderedVideo.style} • {renderedVideo.duration}s • Giọng {VOICES.find(v => v.id === selectedVoice)?.name}</p>
                    </div>

                    {/* Actions Panel */}
                    <div className="w-full grid grid-cols-3 gap-2 mt-4">
                      <button
                        onClick={() => alert("Đã mở lệnh tải xuống file MP4 chất lượng cao cho bé!")}
                        className="flex flex-col items-center gap-1 text-xs font-bold text-[#2d6c00] bg-[#6bbf3a]/10 p-2.5 rounded-xl hover:bg-[#6bbf3a]/20"
                      >
                        <Download className="w-5 h-5" /> Tải về
                      </button>
                      <button
                        onClick={() => onNavigate("voice")}
                        className="flex flex-col items-center gap-1 text-xs font-bold text-secondary bg-[#cfe5ff]/40 p-2.5 rounded-xl hover:bg-[#cfe5ff]/60"
                      >
                        <Mic className="w-5 h-5" /> Lồng giọng
                      </button>
                      <button
                        onClick={() => onNavigate("workflow")}
                        className="flex flex-col items-center gap-1 text-xs font-bold text-[#7b5800] bg-[#ffdea5]/50 p-2.5 rounded-xl hover:bg-[#ffdea5]/70"
                      >
                        <GitFork className="w-5 h-5" /> Mở workflow
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
          
        </div>
      </div>
    </div>
  );
}

const parseNotebookLMContent = (fileName: string, rawText: string): { title: string; script: string } => {
  let parsedTitle = "";
  let scenes: string[] = [];

  // 1. Try to parse as JSON first
  try {
    const data = JSON.parse(rawText);
    
    // Handle array of slide objects
    if (Array.isArray(data)) {
      data.forEach((item, idx) => {
        if (typeof item === 'string') {
          scenes.push(item);
        } else if (item && typeof item === 'object') {
          const content = item.content || item.text || item.description || item.body || JSON.stringify(item);
          const title = item.title || item.name || `Cảnh ${idx + 1}`;
          scenes.push(`${title}: ${content}`);
        }
      });
    } else if (data && typeof data === 'object') {
      parsedTitle = data.title || data.name || "";
      const slides = data.slides || data.scenes || data.pages || data.content;
      if (Array.isArray(slides)) {
        slides.forEach((item, idx) => {
          if (typeof item === 'string') {
            scenes.push(item);
          } else if (item && typeof item === 'object') {
            const content = item.content || item.text || item.description || item.body || JSON.stringify(item);
            const title = item.title || item.name || `Cảnh ${idx + 1}`;
            scenes.push(`${title}: ${content}`);
          }
        });
      } else if (typeof slides === 'string') {
        scenes = slides.split(/\n\n+/);
      }
    }
  } catch (e) {
    // 2. Not a JSON. Parse as Text/Markdown
    // Split by Markdown headers like # Slide 1 or ## Scene 1 or just Slide 1:
    const lines = rawText.split(/\r?\n/);
    let currentSceneText = "";
    let currentSceneTitle = "";

    const commitScene = () => {
      if (currentSceneText.trim()) {
        const full = currentSceneTitle ? `${currentSceneTitle}: ${currentSceneText.trim()}` : currentSceneText.trim();
        scenes.push(full);
      }
      currentSceneText = "";
      currentSceneTitle = "";
    };

    lines.forEach(line => {
      const headerMatch = line.match(/^(?:#+\s*|Slide\s+\d+:?\s*|Cảnh\s+\d+:?\s*|Scene\s+\d+:?\s*)(.*)$/i);
      if (headerMatch) {
        commitScene();
        currentSceneTitle = headerMatch[1].trim();
      } else {
        // Accumulate text
        if (line.trim()) {
          currentSceneText += (currentSceneText ? " " : "") + line.trim();
        }
      }
    });
    commitScene();

    // If no headers were detected, split plain text by double newlines or paragraphs
    if (scenes.length === 0) {
      scenes = rawText.split(/\r?\n\r?\n+/).map(p => p.trim()).filter(Boolean);
    }
  }

  // Format into 4 scenes (as required by the existing flow)
  if (scenes.length === 0) {
    throw new Error("Không tìm thấy nội dung slide hợp lệ trong tệp.");
  }

  // If there are more/fewer than 4, let's distribute or map them
  let scriptParts: string[] = [];
  for (let i = 0; i < 4; i++) {
    if (i < scenes.length) {
      scriptParts.push(`[Cảnh ${i + 1}] ${scenes[i]}`);
    } else {
      scriptParts.push(`[Cảnh ${i + 1}] (Ba mẹ tự viết thêm nội dung cảnh này nha)`);
    }
  }

  if (scenes.length > 4) {
    const extraScenes = scenes.slice(4).map((s, idx) => `[Cảnh phụ ${idx + 5}] ${s}`).join("\n");
    scriptParts[3] += "\n" + extraScenes;
  }

  if (!parsedTitle) {
    parsedTitle = fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    parsedTitle = parsedTitle.charAt(0).toUpperCase() + parsedTitle.slice(1);
  }

  return {
    title: parsedTitle,
    script: scriptParts.join("\n\n")
  };
};
