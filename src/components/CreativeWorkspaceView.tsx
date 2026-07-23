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
  ChevronUp,
  Maximize2,
  Minimize2,
  ArrowLeft,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ZoomIn,
  ZoomOut,
  Maximize
} from "lucide-react";
import { STYLES } from "../data";
import { useAuth } from "../context/AuthContext";
import { videosApi, SceneDto } from "../api/videos";
import { storyApi, TemplateOptions } from "../api/story";

interface CreativeWorkspaceViewProps {
  onVideoCreated: () => void;
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
  imagePrompt?: string;
  transition: 'none' | 'fade' | 'dissolve' | 'slide-left' | 'slide-right' | 'zoom-in' | 'zoom-out' | 'pan' | 'blur';
  isIntro: boolean;
  isOutro: boolean;
  voiceId?: string;
  images?: string[];
  duration?: number;
  notes?: string;
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
      gradientPreset: "bg-gradient-to-tr from-[#ffecd2] to-[#fcb69f]",
      transition: "fade",
      isIntro: true,
      isOutro: false,
      duration: 5,
      notes: "Cảnh giới thiệu hạt giống nhỏ."
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
      gradientPreset: "bg-gradient-to-tr from-[#a1c4fd] to-[#c2e9fb]",
      transition: "fade",
      isIntro: false,
      isOutro: true,
      duration: 5,
      notes: "Cảnh kết thúc tươi sáng."
    }
  ]);
  const [activeSlideId, setActiveSlideId] = useState<string>("slide-1");
  const [selectedStyle, setSelectedStyle] = useState("anime");
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [duration, setDuration] = useState(30);
  const [engine, setEngine] = useState<'slideshow' | 't2v'>('slideshow');

  // API generation state
  const [isExpanding, setIsExpanding] = useState(false);
  const [storyTitle, setStoryTitle] = useState("");

  // Rendering state (thật — poll từ backend)
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setProgress] = useState(0);
  const [renderStep, setRenderStep] = useState<'queued' | 'drawing' | 'completed'>('queued');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [resultScenes, setResultScenes] = useState<SceneDto[] | null>(null);

  // Playback state (preview slideshow sau khi có kết quả render từ backend)
  const [previewIdx, setPreviewIdx] = useState(0);

  // Script builder (AI tự động / Prompt mẫu)
  const [scriptTab, setScriptTab] = useState<'ai' | 'template'>('ai');
  const [aiIdea, setAiIdea] = useState("");
  const [aiSceneCount, setAiSceneCount] = useState(4);
  const [aiLoading, setAiLoading] = useState(false);
  const [tmplOptions, setTmplOptions] = useState<TemplateOptions | null>(null);
  const [tmplForm, setTmplForm] = useState({ characterCount: 2, genre: '', plotType: '', ageRange: '', sceneCount: 4, mainCharacter: '' });
  const [samplePrompt, setSamplePrompt] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [copied, setCopied] = useState(false);

  // Preview Mode states
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  
  // Expanded Focus Mode state (only applicable in Edit Mode)
  const [isExpandedMode, setIsExpandedMode] = useState(false);

  const activeSlideIndex = slides.findIndex(s => s.id === activeSlideId);
  const activeSlide = slides[activeSlideIndex >= 0 ? activeSlideIndex : 0];

  useEffect(() => {
    if (!isAuthenticated) return;
    storyApi.templateOptions().then(setTmplOptions).catch(() => {});
  }, [isAuthenticated]);

  // Đổ danh sách cảnh (AI/parse) vào slide editor.
  const loadScenesIntoSlides = (scenes: { text: string; imagePrompt: string }[]) => {
    if (scenes.length === 0) return;
    const mapped: Slide[] = scenes.map((s, idx) => ({
      id: `slide-${Date.now()}-${idx}`,
      title: `Cảnh ${idx + 1}`,
      content: s.text,
      imagePrompt: s.imagePrompt,
      backgroundColor: idx % 2 === 0 ? "#FFFDF7" : "#cfe5ff",
      textColor: idx % 2 === 0 ? "#1b1c19" : "#004a77",
      textAlign: "center" as const,
      isBold: false,
      isItalic: false,
      gradientPreset: idx % 2 === 0 ? "bg-gradient-to-tr from-[#ffecd2] to-[#fcb69f]" : "bg-gradient-to-tr from-[#a1c4fd] to-[#c2e9fb]",
      transition: "none",
      isIntro: idx === 0,
      isOutro: idx === scenes.length - 1,
      duration: 5,
      notes: ""
    }));
    setSlides(mapped);
    setActiveSlideId(mapped[0].id);
  };

  const handleAIGenerate = async () => {
    if (!isAuthenticated) { onNavigate("login"); return; }
    if (!aiIdea.trim()) { alert("Nhập ý tưởng câu chuyện trước nhé!"); return; }
    setAiLoading(true);
    try {
      const styleName = STYLES.find(s => s.id === selectedStyle)?.name || "Anime";
      const { title, scenes } = await storyApi.generate(aiIdea, styleName, aiSceneCount);
      if (title) setStoryTitle(title);
      loadScenesIntoSlides(scenes);
    } catch (e) {
      alert("Lỗi tạo kịch bản: " + (e as Error).message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleBuildTemplate = async () => {
    if (!isAuthenticated) { onNavigate("login"); return; }
    try {
      const styleName = STYLES.find(s => s.id === selectedStyle)?.name || "Anime";
      const { prompt } = await storyApi.template({ ...tmplForm, style: styleName });
      setSamplePrompt(prompt);
    } catch (e) {
      alert("Lỗi tạo prompt mẫu: " + (e as Error).message);
    }
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(samplePrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert("Không copy được, hãy bôi đen và copy thủ công.");
    }
  };

  const handleLoadPastedScript = async () => {
    if (!pasteText.trim()) { alert("Dán kịch bản (từ AI của bạn) vào ô trước nhé!"); return; }
    try {
      const styleName = STYLES.find(s => s.id === selectedStyle)?.name || "Anime";
      const { scenes } = await storyApi.parse(pasteText, styleName);
      if (scenes.length === 0) { alert("Không tách được cảnh nào. Kiểm tra định dạng [Cảnh 1]..."); return; }
      loadScenesIntoSlides(scenes);
      alert(`Đã nạp ${scenes.length} cảnh vào slide!`);
    } catch (e) {
      alert("Lỗi nạp kịch bản: " + (e as Error).message);
    }
  };

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
            gradientPreset: idx % 2 === 0 ? "bg-gradient-to-tr from-[#ffecd2] to-[#fcb69f]" : "bg-gradient-to-tr from-[#a1c4fd] to-[#c2e9fb]",
            transition: "none" as const,
            isIntro: idx === 0,
            isOutro: idx === rawSlides.length - 1,
            duration: 5,
            notes: ""
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
            gradientPreset: idx % 2 === 0 ? "bg-gradient-to-tr from-[#ffecd2] to-[#fcb69f]" : "bg-gradient-to-tr from-[#a1c4fd] to-[#c2e9fb]",
            transition: "none" as const,
            isIntro: idx === 0,
            isOutro: idx === parsedList.length - 1,
            duration: 5,
            notes: ""
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
      const styleName = STYLES.find(s => s.id === selectedStyle)?.name || "3D Clay";
      const { scenes } = await storyApi.generate(activeSlide.content, styleName, 1);
      const expanded = scenes[0]?.text;
      if (expanded) {
        setSlides(slides.map(s =>
          s.id === activeSlideId ? { ...s, content: expanded, imagePrompt: scenes[0].imagePrompt } : s
        ));
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
      gradientPreset: "bg-gradient-to-tr from-[#ffecd2] to-[#fcb69f]",
      transition: "none",
      isIntro: false,
      isOutro: false,
      duration: 5,
      notes: ""
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
        if (fields.isIntro === true) {
          return { ...s, ...fields, isIntro: true, isOutro: false };
        }
        if (fields.isOutro === true) {
          return { ...s, ...fields, isOutro: true, isIntro: false };
        }
        return { ...s, ...fields };
      } else {
        let otherFields: Partial<Slide> = {};
        if (fields.isIntro === true) otherFields.isIntro = false;
        if (fields.isOutro === true) otherFields.isOutro = false;
        return { ...s, ...otherFields };
      }
    });
    setSlides(updated);
  };

  const handlePrevSlide = () => {
    if (activeSlideIndex > 0) {
      setActiveSlideId(slides[activeSlideIndex - 1].id);
    }
  };

  const handleNextSlide = () => {
    if (activeSlideIndex < slides.length - 1) {
      setActiveSlideId(slides[activeSlideIndex + 1].id);
    }
  };

  const handleCreateVideo = async () => {
    if (!isAuthenticated) {
      onNavigate("login");
      return;
    }
    setIsRendering(true);
    setProgress(0);
    setRenderStep('queued');
    setRenderError(null);
    setResultScenes(null);
    setPreviewIdx(0);

    const styleName = STYLES.find(s => s.id === selectedStyle)?.name || "Anime";
    
    // Map slide to storyboard scene input structure (POST /api/videos)
    const storyboardInput = {
      title: storyTitle || "Câu chuyện của bé",
      slides: slides.map((s, idx) => ({
        id: s.id,
        title: s.title,
        content: s.content,
        backgroundColor: s.backgroundColor,
        textColor: s.textColor,
        textAlign: s.textAlign,
        isBold: s.isBold,
        isItalic: s.isItalic,
        gradientPreset: s.gradientPreset,
        imagePrompt: s.imagePrompt,
        transition: s.transition || "none",
        isIntro: s.isIntro || false,
        isOutro: s.isOutro || false,
        voiceId: s.voiceId || "bena",
        images: s.images || [],
        duration: s.duration || 5,
        notes: s.notes || ""
      }))
    };

    const scenesInput = slides.map((s, idx) => ({
      sceneIndex: idx + 1,
      title: s.title,
      description: s.content,
      transition: s.transition || "none",
      isIntro: s.isIntro || false,
      isOutro: s.isOutro || false,
      text: s.content,
      imagePrompt: s.imagePrompt || `${styleName} style, children storybook illustration. ${s.title}. ${s.content}`,
      voiceId: s.voiceId || "bena"
    }));

    try {
      const { id } = await videosApi.create({
        prompt: storyTitle || slides[0]?.content || "Câu chuyện của bé",
        style: styleName,
        aspectRatio,
        durationSec: duration,
        engine,
        storyboard: storyboardInput,
        scenes: scenesInput,
      });

      // Poll tới khi completed | failed.
      setRenderStep('drawing');
      let done = false;
      while (!done) {
        await new Promise((r) => setTimeout(r, 2000));
        const { video, scenes: sc } = await videosApi.get(id);
        setProgress(video.progress);
        if (video.status === 'completed') {
          setRenderStep('completed');
          setResultScenes(sc);
          setProgress(100);
          done = true;
        } else if (video.status === 'failed') {
          setRenderError(video.error || "Tạo video thất bại. Vui lòng thử lại.");
          done = true;
        }
      }
    } catch (e) {
      setRenderError((e as Error).message);
    } finally {
      setIsRendering(false);
      onVideoCreated();
    }
  };

  // Slideshow preview auto progression (polling completion player)
  useEffect(() => {
    if (!resultScenes || resultScenes.length === 0) return;
    const t = setInterval(() => {
      setPreviewIdx((i) => (i + 1) % resultScenes.length);
    }, 2500);
    return () => clearInterval(t);
  }, [resultScenes]);

  return (
    <div className="min-h-screen bg-[#FFFDF7] pb-24 md:pb-12 pt-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        
        {/* Banner Title */}
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#2d6c00] font-heading flex items-center justify-center md:justify-start gap-2">
            🌱 Sân Chơi Thiết Kế Slide Câu Chuyện
          </h1>
          <p className="text-on-surface-variant font-medium text-sm md:text-base">
            Biên tập, thiết lập màu sắc và phông nền cho từng phân cảnh kịch bản slide hoạt hình mầm non.
          </p>
        </div>

        {/* Slide Workspace Toolbar */}
        <div className="bg-white p-4 rounded-3xl border border-surface-container flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎬</span>
            <span className="text-sm font-black text-on-surface uppercase tracking-wider">
              {isPreviewMode ? 'Slide Preview Mode' : 'Bảng Điều Khiển Slide'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`px-5 py-2.5 text-xs font-black rounded-full transition-all border flex items-center gap-1.5 shadow-sm cursor-pointer ${
                isPreviewMode 
                  ? 'bg-[#2d6c00] text-white border-[#2d6c00]' 
                  : 'bg-[#4bafff]/10 hover:bg-[#4bafff]/25 text-[#00639c] border-[#4bafff]/20'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>{isPreviewMode ? 'Chế độ chỉnh sửa' : 'Xem Slide'}</span>
            </button>
            <button
              onClick={handleCreateVideo}
              disabled={isRendering || isExpanding}
              className="px-6 py-2.5 bg-gradient-to-r from-[#F5B82E] to-[#FF9F40] text-white text-xs font-black rounded-full transition-all flex items-center gap-1.5 shadow-sm cursor-pointer hover:scale-102"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isRendering ? 'Đang tạo...' : 'Tạo Video'}</span>
            </button>
          </div>
        </div>

        {/* Top Uploader Bar */}
        {!isPreviewMode && (
          <div className="bg-white p-5 rounded-3xl border border-surface-container flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-[fadeIn_0.3s_ease-out]">
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
        )}

        {/* AI script generation block */}
        {!isExpandedMode && !isPreviewMode && (
          <div className="bg-white rounded-3xl border border-surface-container shadow-sm overflow-hidden animate-[fadeIn_0.3s_ease-out]">
            <div className="flex border-b border-surface-container">
              <button
                onClick={() => setScriptTab('ai')}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-colors ${scriptTab === 'ai' ? 'bg-[#6bbf3a]/10 text-[#2d6c00]' : 'text-outline hover:bg-surface-container'}`}
              >
                🧠 AI tự động viết
              </button>
              <button
                onClick={() => setScriptTab('template')}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-colors ${scriptTab === 'template' ? 'bg-[#6bbf3a]/10 text-[#2d6c00]' : 'text-outline hover:bg-surface-container'}`}
              >
                📝 Prompt mẫu (tự dán)
              </button>
            </div>

            <div className="p-5">
              {scriptTab === 'ai' ? (
                <div className="space-y-3">
                  <p className="text-xs text-outline font-medium">Nhập ý tưởng, AI (WaveSpeed) sẽ viết kịch bản phân cảnh và nạp thẳng vào slide.</p>
                  <textarea
                    value={aiIdea}
                    onChange={(e) => setAiIdea(e.target.value)}
                    placeholder="Vd: Chú thỏ con học cách chia sẻ với bạn trong khu rừng..."
                    className="w-full h-20 p-3 bg-[#FFFDF7] border-2 border-outline-variant focus:border-[#2d6c00] outline-none rounded-xl text-sm resize-none"
                  />
                  <div className="flex items-center gap-3 flex-wrap">
                    <label className="text-xs font-bold text-outline flex items-center gap-1">
                      Số cảnh:
                      <input type="number" min={1} max={20} value={aiSceneCount}
                        onChange={(e) => setAiSceneCount(Math.max(1, Math.min(20, Number(e.target.value))))}
                        className="w-16 p-1.5 border border-outline rounded-lg text-center" />
                    </label>
                    <button
                      onClick={handleAIGenerate}
                      disabled={aiLoading}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#6bbf3a] to-[#2d6c00] text-white rounded-full text-xs font-extrabold shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Wand2 className="w-4 h-4" /> {aiLoading ? 'Đang viết...' : 'AI viết kịch bản'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-outline font-medium">Chọn tuỳ chọn → nhận prompt mẫu → copy đưa cho AI của bạn (ChatGPT/Gemini...) → dán kịch bản trả về vào ô dưới.</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-bold">
                    <label className="space-y-1">
                      <span className="text-[10px] text-outline uppercase block">Số nhân vật</span>
                      <input type="number" min={1} max={8} value={tmplForm.characterCount}
                        onChange={(e) => setTmplForm({ ...tmplForm, characterCount: Number(e.target.value) })}
                        className="w-full p-2 border border-outline rounded-lg" />
                    </label>
                    <label className="space-y-1">
                      <span className="text-[10px] text-outline uppercase block">Thể loại</span>
                      <select value={tmplForm.genre} onChange={(e) => setTmplForm({ ...tmplForm, genre: e.target.value })}
                        className="w-full p-2 border border-outline rounded-lg bg-white">
                        <option value="">— Chọn —</option>
                        {tmplOptions?.genres.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </label>
                    <label className="space-y-1">
                      <span className="text-[10px] text-outline uppercase block">Cốt truyện</span>
                      <select value={tmplForm.plotType} onChange={(e) => setTmplForm({ ...tmplForm, plotType: e.target.value })}
                        className="w-full p-2 border border-outline rounded-lg bg-white">
                        <option value="">— Chọn —</option>
                        {tmplOptions?.plots.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </label>
                    <label className="space-y-1">
                      <span className="text-[10px] text-outline uppercase block">Độ tuổi</span>
                      <select value={tmplForm.ageRange} onChange={(e) => setTmplForm({ ...tmplForm, ageRange: e.target.value })}
                        className="w-full p-2 border border-outline rounded-lg bg-white">
                        <option value="">— Chọn —</option>
                        {tmplOptions?.ageRanges.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </label>
                    <label className="space-y-1">
                      <span className="text-[10px] text-outline uppercase block">Số cảnh</span>
                      <input type="number" min={1} max={20} value={tmplForm.sceneCount}
                        onChange={(e) => setTmplForm({ ...tmplForm, sceneCount: Number(e.target.value) })}
                        className="w-full p-2 border border-outline rounded-lg" />
                    </label>
                    <label className="space-y-1">
                      <span className="text-[10px] text-outline uppercase block">Nhân vật chính (tuỳ chọn)</span>
                      <input type="text" value={tmplForm.mainCharacter}
                        onChange={(e) => setTmplForm({ ...tmplForm, mainCharacter: e.target.value })}
                        placeholder="Vd: Thỏ Bông"
                        className="w-full p-2 border border-outline rounded-lg" />
                    </label>
                  </div>
                  <button onClick={handleBuildTemplate}
                    className="px-5 py-2.5 bg-[#4bafff]/15 text-[#00639c] border border-[#4bafff]/30 rounded-full text-xs font-extrabold">
                    ✨ Tạo prompt mẫu
                  </button>

                  {samplePrompt && (
                    <div className="space-y-2">
                      <div className="relative">
                        <textarea readOnly value={samplePrompt}
                          className="w-full h-32 p-3 bg-[#f5f3ee] border border-surface-container rounded-xl text-xs font-mono resize-none" />
                        <button onClick={handleCopyPrompt}
                          className="absolute top-2 right-2 px-3 py-1 bg-[#2d6c00] text-white rounded-full text-[10px] font-bold">
                          {copied ? '✓ Đã copy' : 'Copy'}
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-outline uppercase font-black block">Dán kịch bản AI trả về</span>
                        <textarea value={pasteText} onChange={(e) => setPasteText(e.target.value)}
                          placeholder="Dán kịch bản (có [Cảnh 1], [Cảnh 2]...) vào đây rồi bấm Nạp vào slide"
                          className="w-full h-28 p-3 bg-[#FFFDF7] border-2 border-outline-variant focus:border-[#2d6c00] outline-none rounded-xl text-xs resize-none" />
                        <button onClick={handleLoadPastedScript}
                          className="px-5 py-2.5 bg-gradient-to-r from-[#6bbf3a] to-[#2d6c00] text-white rounded-full text-xs font-extrabold">
                          ⬇ Nạp vào slide
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Canva-like workspace layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT PANEL: Slide thumb navigator */}
          {(!isExpandedMode || isPreviewMode) && (
            <div className="lg:col-span-3 bg-white p-4 rounded-3xl border border-surface-container flex flex-col justify-between space-y-4 shadow-sm animate-[fadeIn_0.3s_ease-out]">
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
                            disabled={idx === 0 || isPreviewMode}
                            className="hover:text-black disabled:opacity-30"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <span className="font-extrabold">{idx + 1}</span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleMoveDown(idx); }}
                            disabled={idx === slides.length - 1 || isPreviewMode}
                            className="hover:text-black disabled:opacity-30"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Small slide style preview block */}
                        <div 
                          className={`w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] overflow-hidden border border-surface-container shadow-inner ${slide.gradientPreset || ''}`}
                          style={{ backgroundColor: slide.gradientPreset ? undefined : slide.backgroundColor }}
                        >
                          <span className="text-[12px]">🖼️</span>
                        </div>

                        {/* Details Area */}
                        <div className="flex-grow flex flex-col justify-between py-0.5">
                          <span className="line-clamp-1 font-black text-xs text-on-surface">
                            {slide.title || "Trống"}
                          </span>
                          
                          <div className="flex flex-wrap gap-1">
                            {slide.isIntro && (
                              <span className="text-[7px] bg-[#6bbf3a]/15 text-[#2d6c00] px-1.5 py-0.5 rounded font-black uppercase">
                                Intro
                              </span>
                            )}
                            {slide.isOutro && (
                              <span className="text-[7px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-black uppercase">
                                Outro
                              </span>
                            )}
                            {slide.transition && slide.transition !== 'none' && (
                              <span className="text-[7px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-black uppercase">
                                ⚡ {slide.transition}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quick action badges overlay on hover */}
                        {!isPreviewMode && (
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
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {!isPreviewMode && (
                <button
                  onClick={handleAddSlide}
                  className="w-full py-3 bg-[#6bbf3a]/15 text-[#2d6c00] hover:bg-[#6bbf3a]/25 transition-colors border border-dashed border-[#6bbf3a]/50 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Thêm trang slide mới
                </button>
              )}
            </div>
          )}

          {/* CENTER PANEL: Large Slide Canvas (can toggle to Preview Mode) */}
          <div className={`${(isExpandedMode && !isPreviewMode) ? 'lg:col-span-12' : (isPreviewMode ? 'lg:col-span-9' : 'lg:col-span-6')} flex flex-col justify-between bg-[#fcfbf9] p-6 rounded-3xl border border-surface-container min-h-[500px] shadow-sm transition-all duration-300`}>
            
            {/* Header: Dynamic Toolbar depending on Preview mode */}
            {isPreviewMode ? (
              <div className="flex flex-wrap justify-between items-center border-b border-surface-container pb-3 mb-2 gap-3">
                <button
                  onClick={() => setIsPreviewMode(false)}
                  className="flex items-center gap-1 px-3 py-1.5 border border-outline hover:bg-surface-container rounded-full text-xs font-extrabold transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Quay lại</span>
                </button>

                {/* Slides navigation */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevSlide}
                    disabled={activeSlideIndex <= 0}
                    className="p-1.5 border border-outline rounded-full hover:bg-surface-container disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-black">
                    Trang {activeSlideIndex + 1} / {slides.length}
                  </span>
                  <button
                    onClick={handleNextSlide}
                    disabled={activeSlideIndex >= slides.length - 1}
                    className="p-1.5 border border-outline rounded-full hover:bg-surface-container disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Scaling & fitting tool */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                    className="p-1.5 border border-outline rounded-full hover:bg-surface-container"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono font-bold w-10 text-center">
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
                    className="p-1.5 border border-outline rounded-full hover:bg-surface-container"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(100)}
                    className="text-[10px] font-bold px-2 py-1 border border-outline rounded hover:bg-surface-container"
                  >
                    Fit (100%)
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center border-b border-surface-container pb-3 mb-2">
                <span className="text-xs font-black text-on-surface-variant uppercase tracking-wider">Slide Canvas Trực Quan</span>
                <button
                  onClick={() => setIsExpandedMode(!isExpandedMode)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-outline hover:bg-surface-container rounded-full text-xs font-extrabold transition-all"
                  title={isExpandedMode ? "Trở về chế độ thường" : "Chế độ tập trung (Expanded)"}
                >
                  {isExpandedMode ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5 text-[#2d6c00]" />
                      <span>Thu nhỏ</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5 text-[#2d6c00]" />
                      <span>Chế độ tập trung</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Editor & Preview Canvas Container */}
            <div className="flex-grow flex items-center justify-center py-4 overflow-hidden">
              
              {isPreviewMode ? (
                <div className="w-full flex items-center justify-center overflow-auto min-h-[400px]">
                  <div 
                    style={{ 
                      transform: `scale(${zoomLevel / 100})`, 
                      transformOrigin: 'center', 
                      transition: 'transform 0.15s ease',
                      backgroundColor: activeSlide.gradientPreset ? undefined : activeSlide.backgroundColor 
                    }}
                    className={`w-full aspect-video rounded-3xl shadow-xl border border-surface-container-high p-10 flex flex-col justify-center relative overflow-hidden max-w-xl ${activeSlide.gradientPreset || ''}`}
                  >
                    {/* Render high-fidelity static presentation display */}
                    <div className="space-y-4 text-center">
                      <h2 
                        className="text-2xl font-black"
                        style={{ 
                          color: activeSlide.textColor,
                          textAlign: activeSlide.textAlign,
                          fontWeight: activeSlide.isBold ? "900" : "400",
                          fontStyle: activeSlide.isItalic ? "italic" : "normal"
                        }}
                      >
                        {activeSlide.title || "(Chưa có tiêu đề)"}
                      </h2>
                      <p 
                        className="text-sm font-bold leading-relaxed"
                        style={{ 
                          color: activeSlide.textColor,
                          textAlign: activeSlide.textAlign,
                          fontWeight: activeSlide.isBold ? "bold" : "normal",
                          fontStyle: activeSlide.isItalic ? "italic" : "normal"
                        }}
                      >
                        {activeSlide.content || "(Chưa nhập nội dung)"}
                      </p>
                    </div>

                    {/* Metadata overlays in preview canvas */}
                    <div className="absolute bottom-3 left-4 text-[9px] font-black text-black/40">
                      Slide {activeSlideIndex + 1}
                    </div>
                    <div className="absolute bottom-3 right-4 flex gap-1.5">
                      {activeSlide.isIntro && <span className="text-[8px] bg-black/10 px-1.5 py-0.5 rounded font-black uppercase">Intro</span>}
                      {activeSlide.isOutro && <span className="text-[8px] bg-black/10 px-1.5 py-0.5 rounded font-black uppercase">Outro</span>}
                      {activeSlide.transition !== 'none' && <span className="text-[8px] bg-black/10 px-1.5 py-0.5 rounded font-black uppercase">⚡ {activeSlide.transition}</span>}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {!isRendering && !resultScenes && !renderError ? (
                    <div
                      className={`w-full aspect-video rounded-3xl shadow-lg border-2 border-surface-container p-8 flex flex-col justify-center relative overflow-hidden transition-all duration-300 ${isExpandedMode ? 'max-w-3xl' : 'max-w-xl'} ${activeSlide.gradientPreset || ''}`}
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
                        <h4 className="font-heading text-base font-black text-[#2d6c00]">
                          {renderStep === 'queued' ? 'Đang xếp hàng...' : 'AI đang vẽ từng cảnh câu chuyện...'}
                        </h4>
                        <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden shadow-inner border border-surface-container-high relative">
                          <div
                            className="h-full bg-gradient-to-r from-[#6bbf3a] to-[#2d6c00] rounded-full transition-all duration-300"
                            style={{ width: `${renderProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-black text-outline">{renderProgress}% Hoàn tất</span>
                      </div>
                    </div>
                  ) : renderError ? (
                    <div className="w-full max-w-xl aspect-video bg-red-50 rounded-3xl border-2 border-red-200 shadow-md p-8 flex flex-col items-center justify-center text-center space-y-3">
                      <span className="text-4xl">😿</span>
                      <h4 className="font-heading text-base font-black text-red-600">Tạo video chưa thành công</h4>
                      <p className="text-xs text-red-500 font-bold max-w-sm">{renderError}</p>
                    </div>
                  ) : (
                    <div className="w-full max-w-xl aspect-video rounded-3xl overflow-hidden shadow-lg bg-black relative group">
                      {/* Preview slideshow từ ảnh/clip AI thật của từng cảnh */}
                      {(() => {
                        const scene = resultScenes?.[previewIdx];
                        if (!scene) return null;
                        if (scene.clipUrl) {
                          return (
                            <video src={scene.clipUrl} autoPlay muted loop controls className="w-full h-full object-cover" />
                          );
                        }
                        return (
                          <div className="absolute inset-0">
                            {scene.imageUrl ? (
                              <img src={scene.imageUrl} alt={`Cảnh ${previewIdx + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-[#0d0d0d] text-white/50 text-xs">Cảnh chưa có ảnh</div>
                            )}
                            {scene.audioUrl && <audio src={scene.audioUrl} autoPlay />}
                            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                              <p className="text-white text-[11px] font-bold line-clamp-2">{scene.text}</p>
                            </div>
                            <div className="absolute top-3 left-3 flex gap-1">
                              {resultScenes!.map((_, i) => (
                                <span key={i} className={`w-2 h-2 rounded-full ${i === previewIdx ? 'bg-white' : 'bg-white/40'}`} />
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Bottom quick control prompts */}
            {!isPreviewMode && (
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
            )}
          </div>

          {/* RIGHT PANEL: Slide Properties */}
          {!isExpandedMode && !isPreviewMode && (
            <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-surface-container space-y-5 shadow-sm animate-[fadeIn_0.3s_ease-out]">
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

              {/* Slide Settings block in Properties */}
              <div className="bg-[#FFFDF7] p-4 rounded-2xl border border-surface-container space-y-3">
                <span className="text-[10px] text-outline font-black uppercase tracking-wider block">Thiết Lập Slide Cảnh</span>
                
                {/* Scene Type Intro/Outro checkboxes */}
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-extrabold text-on-surface-variant cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeSlide.isIntro || false}
                      onChange={(e) => updateActiveSlide({ isIntro: e.target.checked })}
                      className="w-4 h-4 rounded border-outline text-primary accent-[#2d6c00]"
                    />
                    <span>🌟 Cảnh Intro</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-extrabold text-on-surface-variant cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeSlide.isOutro || false}
                      onChange={(e) => updateActiveSlide({ isOutro: e.target.checked })}
                      className="w-4 h-4 rounded border-outline text-primary accent-[#2d6c00]"
                    />
                    <span>🎬 Cảnh Outro</span>
                  </label>
                </div>

                {/* Transition Selection */}
                <div className="space-y-1">
                  <label className="text-[9px] text-outline uppercase block">Hiệu Ứng Chuyển Cảnh</label>
                  <select
                    value={activeSlide.transition || 'none'}
                    onChange={(e) => updateActiveSlide({ transition: e.target.value as any })}
                    className="w-full text-xs font-bold py-2 px-3 border border-outline rounded-xl bg-white focus:outline-none"
                  >
                    <option value="none">Không hiệu ứng</option>
                    <option value="fade">Mờ dần (Fade)</option>
                    <option value="dissolve">Hòa tan (Dissolve)</option>
                    <option value="slide-left">Trượt trái (Slide Left)</option>
                    <option value="slide-right">Trượt phải (Slide Right)</option>
                    <option value="zoom-in">Thu nhỏ ➜ Phóng to (Zoom In)</option>
                    <option value="zoom-out">Phóng to ➜ Thu nhỏ (Zoom Out)</option>
                    <option value="pan">Lướt hình (Pan)</option>
                    <option value="blur">Mờ ảo (Blur)</option>
                  </select>
                </div>

                {/* Slide Duration Input */}
                <div className="space-y-1">
                  <label className="text-[9px] text-outline uppercase block">Thời Lượng (giây)</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={activeSlide.duration || 5}
                    onChange={(e) => updateActiveSlide({ duration: Math.max(1, Number(e.target.value)) })}
                    className="w-full p-2 bg-white border border-outline rounded-xl text-xs font-bold"
                  />
                </div>

                {/* Ghi chú cảnh (notes) */}
                <div className="space-y-1">
                  <label className="text-[9px] text-outline uppercase block">Ghi chú Cảnh</label>
                  <input
                    type="text"
                    value={activeSlide.notes || ''}
                    onChange={(e) => updateActiveSlide({ notes: e.target.value })}
                    placeholder="Ghi chú cho bối cảnh..."
                    className="w-full p-2 bg-white border border-outline rounded-xl text-xs font-bold"
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

                {/* Engine picker: slideshow ảnh (rẻ) hoặc video AI thật (t2v) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-outline font-black uppercase tracking-wider block">Kiểu tạo video</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEngine('slideshow')}
                      className={`flex-grow py-2 border rounded-xl text-[11px] font-extrabold flex items-center justify-center transition-all ${
                        engine === 'slideshow' ? 'border-[#2d6c00] bg-[#6bbf3a]/15 text-[#2d6c00]' : 'border-outline hover:bg-surface-container'
                      }`}
                    >
                      🖼️ Slideshow (rẻ)
                    </button>
                    <button
                      onClick={() => setEngine('t2v')}
                      className={`flex-grow py-2 border rounded-xl text-[11px] font-extrabold flex items-center justify-center transition-all ${
                        engine === 't2v' ? 'border-[#2d6c00] bg-[#6bbf3a]/15 text-[#2d6c00]' : 'border-outline hover:bg-surface-container'
                      }`}
                    >
                      🎬 Video AI (cao cấp)
                    </button>
                  </div>
                </div>

                {/* Submit CTA */}
                {!resultScenes ? (
                  <button
                    onClick={handleCreateVideo}
                    disabled={isRendering || isExpanding}
                    className="w-full py-4.5 bg-gradient-to-r from-[#F5B82E] to-[#FF9F40] text-white rounded-full font-extrabold text-xs shadow-md hover:scale-102 transition-transform cursor-pointer button-3d-yellow disabled:opacity-50"
                  >
                    <span>{isRendering ? '⏳ Đang tạo video...' : '✨ Tạo video hoạt hình'}</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => onNavigate("dashboard")}
                      className="w-full py-4.5 bg-[#2d6c00] text-white rounded-full font-extrabold text-xs shadow-md hover:scale-102 transition-transform cursor-pointer"
                    >
                      <span>🎉 Xem trong Tác phẩm của bé</span>
                    </button>
                    <button
                      onClick={() => { setResultScenes(null); setProgress(0); }}
                      className="w-full py-2.5 border border-outline text-outline rounded-full font-bold text-[11px] hover:bg-surface-container"
                    >
                      Tạo video mới
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
