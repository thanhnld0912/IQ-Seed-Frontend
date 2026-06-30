import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Home,
  PlusCircle,
  GitFork,
  BookOpen,
  Mic,
  Film,
  User,
  LogOut,
  X,
  PlayCircle,
  Volume2
} from "lucide-react";

import { VideoItem } from "./types";
import { INITIAL_VIDEOS } from "./data";

// Sub-views imports
import HomeView from "./components/HomeView";
import CreativeWorkspaceView from "./components/CreativeWorkspaceView";
import EditWorkflowView from "./components/EditWorkflowView";
import TemplateLibraryView from "./components/TemplateLibraryView";
import VoiceOverView from "./components/VoiceOverView";
import DashboardView from "./components/DashboardView";
import LoginView from "./components/LoginView";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");

  // User States
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState<boolean>(false);

  // Video creations list (seeded from INITIAL_VIDEOS in localStorage if empty)
  const [videos, setVideos] = useState<VideoItem[]>([]);

  // Sample video playing modal state
  const [sampleVideoUrl, setSampleVideoUrl] = useState<string | null>(null);
  const [sampleVideoTitle, setSampleVideoTitle] = useState<string>("");

  // Populate from local storage initially
  useEffect(() => {
    const saved = localStorage.getItem("hat_giong_videos");
    if (saved) {
      try {
        setVideos(JSON.parse(saved));
      } catch (err) {
        setVideos(INITIAL_VIDEOS);
      }
    } else {
      setVideos(INITIAL_VIDEOS);
      localStorage.setItem("hat_giong_videos", JSON.stringify(INITIAL_VIDEOS));
    }

    // Persist login state
    const savedUser = localStorage.getItem("hat_giong_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setUserEmail(u.email);
        setIsPremium(u.isPremium);
      } catch (e) {
        // Safe to ignore
      }
    }
  }, []);

  // Save videos helper
  const handleVideoCreated = (newVideo: VideoItem) => {
    const updated = [newVideo, ...videos];
    setVideos(updated);
    localStorage.setItem("hat_giong_videos", JSON.stringify(updated));
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm("Ba mẹ có chắc muốn xóa tác phẩm này vĩnh viễn khỏi khu vườn của bé?")) {
      const updated = videos.filter(v => v.id !== id);
      setVideos(updated);
      localStorage.setItem("hat_giong_videos", JSON.stringify(updated));
    }
  };

  const handleLoginSuccess = (email: string, premium: boolean) => {
    setUserEmail(email);
    setIsPremium(premium);
    localStorage.setItem("hat_giong_user", JSON.stringify({ email, isPremium: premium }));
    setCurrentTab("workspace");
  };

  const handleLogout = () => {
    setUserEmail(null);
    setIsPremium(false);
    localStorage.removeItem("hat_giong_user");
    setCurrentTab("home");
  };

  const handlePlaySampleVideo = (url: string, title: string) => {
    setSampleVideoUrl(url);
    setSampleVideoTitle(title);
  };

  // Connected direct template config
  const [prepopulatedPrompt, setPrepopulatedPrompt] = useState("");
  const handleSelectTemplateAndGo = (prompt: string, title: string) => {
    if (!userEmail) {
      alert("Ba mẹ vui lòng đăng nhập để sử dụng mẫu kịch bản này nhé!");
      setCurrentTab("login");
      return;
    }
    // Prep prepopulated state
    setPrepopulatedPrompt(prompt);
    // Switch to workspace directly
    setCurrentTab("workspace");
    // Soft alert instruction
    alert(`Đã áp dụng mẫu "${title}" vào bảng gieo hạt giống câu chuyện!`);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] flex flex-col justify-between text-[#1b1c19] selection:bg-[#6bbf3a]/30">
      
      {/* HEADER / NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-surface-container py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <div
            onClick={() => setCurrentTab("home")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6bbf3a] to-[#2d6c00] flex items-center justify-center text-white text-xl font-bold group-hover:scale-105 transition-transform shadow-md">
              🌱
            </div>
            <div>
              <span className="text-xl font-black font-heading text-primary leading-none block">
                Hạt Giống IQ
              </span>
              <span className="text-[10px] uppercase font-black text-outline tracking-wider block">
                Preschool AI Lab
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab("home")}
              className={`px-4 py-2 rounded-full text-sm font-black transition-all flex items-center gap-1 cursor-pointer ${currentTab === 'home' ? 'bg-[#6bbf3a]/15 text-[#2d6c00]' : 'hover:bg-surface-container text-on-surface-variant'}`}
            >
              <Home className="w-4 h-4" /> Trang chủ
            </button>
            <button
              onClick={() => setCurrentTab("workspace")}
              className={`px-4 py-2 rounded-full text-sm font-black transition-all flex items-center gap-1 cursor-pointer ${currentTab === 'workspace' ? 'bg-[#6bbf3a]/15 text-[#2d6c00]' : 'hover:bg-surface-container text-on-surface-variant'}`}
            >
              <PlusCircle className="w-4 h-4" /> Gieo hạt giống (Tạo)
            </button>
            <button
              onClick={() => setCurrentTab("workflow")}
              className={`px-4 py-2 rounded-full text-sm font-black transition-all flex items-center gap-1 cursor-pointer ${currentTab === 'workflow' ? 'bg-[#6bbf3a]/15 text-[#2d6c00]' : 'hover:bg-surface-container text-on-surface-variant'}`}
            >
              <GitFork className="w-4 h-4" /> Workflow kịch bản
            </button>
            <button
              onClick={() => setCurrentTab("library")}
              className={`px-4 py-2 rounded-full text-sm font-black transition-all flex items-center gap-1 cursor-pointer ${currentTab === 'library' ? 'bg-[#6bbf3a]/15 text-[#2d6c00]' : 'hover:bg-surface-container text-on-surface-variant'}`}
            >
              <BookOpen className="w-4 h-4" /> Thư viện mẫu
            </button>
            <button
              onClick={() => setCurrentTab("dashboard")}
              className={`px-4 py-2 rounded-full text-sm font-black transition-all flex items-center gap-1 cursor-pointer ${currentTab === 'dashboard' ? 'bg-[#6bbf3a]/15 text-[#2d6c00]' : 'hover:bg-surface-container text-on-surface-variant'}`}
            >
              <Film className="w-4 h-4" /> Tác phẩm của bé
            </button>
          </nav>

          {/* User Sign State Action */}
          <div className="flex items-center gap-3">
            {userEmail ? (
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase text-white ${isPremium ? 'bg-gradient-to-r from-[#F5B82E] to-[#FF9F40]' : 'bg-[#2d6c00]'}`}>
                  {isPremium ? '👑 PH-Pro' : '🌱 Học sinh'}
                </span>
                <span className="hidden md:inline text-xs font-bold text-on-surface-variant max-w-[120px] truncate">
                  {userEmail}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors cursor-pointer"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentTab("login")}
                className="px-5 py-2.5 rounded-full bg-[#2d6c00] text-white font-extrabold text-xs squishy-button shadow-md cursor-pointer flex items-center gap-1"
              >
                <User className="w-3.5 h-3.5" /> Ba mẹ Đăng Nhập
              </button>
            )}
          </div>

        </div>
      </header>

      {/* RENDER CURRENT INTERACTIVE VIEW VIEWPORT */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {currentTab === "home" && (
              <HomeView
                onNavigate={setCurrentTab}
                onPlaySampleVideo={handlePlaySampleVideo}
              />
            )}
            
            {currentTab === "workspace" && (
              <CreativeWorkspaceView
                userEmail={userEmail}
                onVideoCreated={handleVideoCreated}
                onNavigate={setCurrentTab}
              />
            )}
            
            {currentTab === "workflow" && (
              <EditWorkflowView userEmail={userEmail} onNavigate={setCurrentTab} />
            )}
            
            {currentTab === "library" && (
              <TemplateLibraryView
                onSelectTemplate={handleSelectTemplateAndGo}
              />
            )}
            
            {currentTab === "voice" && (
              <VoiceOverView userEmail={userEmail} onNavigate={setCurrentTab} />
            )}
            
            {currentTab === "dashboard" && (
              <DashboardView
                videos={videos}
                onPlayVideo={handlePlaySampleVideo}
                onDeleteVideo={handleDeleteVideo}
                onNavigate={setCurrentTab}
              />
            )}
            
            {currentTab === "login" && (
              <LoginView
                onLoginSuccess={handleLoginSuccess}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* MOBILE CONTAINER BOTTOM FIXED NAVIGATION RAILS */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-surface-container p-2 flex justify-around items-center lg:hidden shadow-[0_-8px_24px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => setCurrentTab("home")}
          className={`flex flex-col items-center p-2 rounded-xl cursor-pointer ${currentTab === 'home' ? 'text-[#2d6c00] font-black' : 'text-outline font-bold'}`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Trang chủ</span>
        </button>
        <button
          onClick={() => setCurrentTab("workspace")}
          className={`flex flex-col items-center p-2 rounded-xl cursor-pointer ${currentTab === 'workspace' ? 'text-[#2d6c00] font-black' : 'text-outline font-bold'}`}
        >
          <PlusCircle className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Tạo video</span>
        </button>
        <button
          onClick={() => setCurrentTab("workflow")}
          className={`flex flex-col items-center p-2 rounded-xl cursor-pointer ${currentTab === 'workflow' ? 'text-[#2d6c00] font-black' : 'text-outline font-bold'}`}
        >
          <GitFork className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Workflow</span>
        </button>
        <button
          onClick={() => setCurrentTab("library")}
          className={`flex flex-col items-center p-2 rounded-xl cursor-pointer ${currentTab === 'library' ? 'text-[#2d6c00] font-black' : 'text-outline font-bold'}`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Thư viện</span>
        </button>
        <button
          onClick={() => setCurrentTab("dashboard")}
          className={`flex flex-col items-center p-2 rounded-xl cursor-pointer ${currentTab === 'dashboard' ? 'text-[#2d6c00] font-black' : 'text-outline font-bold'}`}
        >
          <Film className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Của bé</span>
        </button>
      </nav>

      {/* SAMPLE CARTOON MULTI-MEDIA VIDEO PLAYBACK MODAL FRAME */}
      {sampleVideoUrl && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 md:p-8 z-50">
          <div className="w-full max-w-3xl bg-white rounded-3xl overflow-hidden border-8 border-white shadow-2xl relative block">
            
            {/* Header titles */}
            <div className="bg-[#f5f3ee] py-3.5 px-6 flex items-center justify-between border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎬</span>
                <h3 className="font-heading text-base font-black text-on-surface">{sampleVideoTitle}</h3>
              </div>
              <button
                onClick={() => setSampleVideoUrl(null)}
                className="p-1 px-3 bg-white text-outline hover:text-black border border-outline-variant font-bold text-xs rounded-full cursor-pointer"
              >
                Đóng ✕
              </button>
            </div>

            {/* Video viewer frame */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <video
                src={sampleVideoUrl}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom educational tips of play modal */}
            <div className="p-4 bg-[#6bbf3a]/15 text-[#2d6c00] text-xs font-bold text-center flex items-center justify-center gap-2">
              <span>🌱</span>
              <span>Bộ phim đã tích hợp phụ đề rực rỡ và phôi thanh nhạc mầm non thông thái!</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
