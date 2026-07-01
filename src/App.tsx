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
  Users,
} from "lucide-react";

import { VideoItem } from "./types";
import { INITIAL_VIDEOS } from "./data";
import { useAuth } from "./context/AuthContext";

import HomeView from "./components/HomeView";
import CreativeWorkspaceView from "./components/CreativeWorkspaceView";
import EditWorkflowView from "./components/EditWorkflowView";
import TemplateLibraryView from "./components/TemplateLibraryView";
import VoiceOverView from "./components/VoiceOverView";
import DashboardView from "./components/DashboardView";
import LoginView from "./components/LoginView";
import RegisterView from "./components/RegisterView";
import ManageUsersView from "./components/ManageUsersView";

const PROTECTED_TABS = ["voice", "manage-users"];

export default function App() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>("home");

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [sampleVideoUrl, setSampleVideoUrl] = useState<string | null>(null);
  const [sampleVideoTitle, setSampleVideoTitle] = useState<string>("");
  const [prepopulatedPrompt, setPrepopulatedPrompt] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("hat_giong_videos");
    if (saved) {
      try { setVideos(JSON.parse(saved)); } catch { setVideos(INITIAL_VIDEOS); }
    } else {
      setVideos(INITIAL_VIDEOS);
      localStorage.setItem("hat_giong_videos", JSON.stringify(INITIAL_VIDEOS));
    }
  }, []);

  // Redirect to login if trying to access protected tab while not authenticated
  const navigateTo = (tab: string) => {
    if (PROTECTED_TABS.includes(tab) && !isAuthenticated) {
      setCurrentTab("login");
      return;
    }
    setCurrentTab(tab);
  };

  const handleVideoCreated = (newVideo: VideoItem) => {
    const updated = [newVideo, ...videos];
    setVideos(updated);
    localStorage.setItem("hat_giong_videos", JSON.stringify(updated));
  };

  const handleDeleteVideo = (id: string) => {
    if (!isAuthenticated) {
      navigateTo("login");
      return;
    }
    if (confirm("Bạn có chắc muốn xóa tác phẩm này?")) {
      const updated = videos.filter((v) => v.id !== id);
      setVideos(updated);
      localStorage.setItem("hat_giong_videos", JSON.stringify(updated));
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentTab("home");
  };

  const handlePlaySampleVideo = (url: string, title: string) => {
    setSampleVideoUrl(url);
    setSampleVideoTitle(title);
  };

  const handleSelectTemplateAndGo = (prompt: string, title: string) => {
    setPrepopulatedPrompt(prompt);
    navigateTo("workspace");
    alert(`Đã áp dụng mẫu "${title}" vào bảng gieo hạt giống câu chuyện!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center">
        <span className="text-4xl animate-bounce">🌱</span>
      </div>
    );
  }

  const tabBtn = (tab: string, icon: React.ReactNode, label: string, hidden = false) => (
    <button
      onClick={() => navigateTo(tab)}
      className={`px-4 py-2 rounded-full text-sm font-black transition-all flex items-center gap-1 cursor-pointer
        ${hidden ? 'hidden' : ''}
        ${currentTab === tab ? "bg-[#6bbf3a]/15 text-[#2d6c00]" : "hover:bg-surface-container text-on-surface-variant"}`}
    >
      {icon} {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#FFFDF7] flex flex-col justify-between text-[#1b1c19] selection:bg-[#6bbf3a]/30">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-surface-container py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          <div onClick={() => setCurrentTab("home")} className="flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6bbf3a] to-[#2d6c00] flex items-center justify-center text-white text-xl font-bold group-hover:scale-105 transition-transform shadow-md">
              🌱
            </div>
            <div>
              <span className="text-xl font-black font-heading text-primary leading-none block">Hạt Giống IQ</span>
              <span className="text-[10px] uppercase font-black text-outline tracking-wider block">Preschool AI Lab</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {tabBtn("home", <Home className="w-4 h-4" />, "Trang chủ")}
            {tabBtn("workspace", <PlusCircle className="w-4 h-4" />, "Gieo Hạt Giống")}
            {tabBtn("workflow", <GitFork className="w-4 h-4" />, "Workflow Kịch Bản")}
            {tabBtn("library", <BookOpen className="w-4 h-4" />, "Thư viện mẫu")}
            {tabBtn("dashboard", <Film className="w-4 h-4" />, "Tác phẩm của bé")}
            {isAuthenticated && tabBtn("manage-users", <Users className="w-4 h-4" />, "Quản lý User")}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase text-white bg-[#2d6c00]">
                  🌱 {user?.displayName ?? user?.email?.split('@')[0]}
                </span>
                <span className="hidden md:inline text-xs font-bold text-on-surface-variant max-w-[120px] truncate">
                  {user?.email}
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
                className="px-5 py-2.5 rounded-full bg-[#2d6c00] text-white font-extrabold text-xs shadow-md cursor-pointer flex items-center gap-1"
              >
                <User className="w-3.5 h-3.5" /> Đăng nhập
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
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
              <HomeView onNavigate={navigateTo} onPlaySampleVideo={handlePlaySampleVideo} />
            )}

            {/* Protected tab guard */}
            {PROTECTED_TABS.includes(currentTab) && !isAuthenticated && (
              <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
                <span className="text-5xl">🔒</span>
                <h2 className="font-heading text-xl font-black text-on-surface">Bạn cần đăng nhập</h2>
                <p className="text-sm text-on-surface-variant">Vui lòng đăng nhập để sử dụng tính năng này</p>
                <button
                  onClick={() => setCurrentTab("login")}
                  className="px-6 py-3 rounded-full bg-[#2d6c00] text-white font-extrabold text-sm shadow-md"
                >
                  Đăng nhập ngay
                </button>
              </div>
            )}

            {currentTab === "workspace" && (
              <CreativeWorkspaceView onVideoCreated={handleVideoCreated} onNavigate={navigateTo} />
            )}
            {currentTab === "workflow" && (
              <EditWorkflowView onNavigate={navigateTo} />
            )}
            {currentTab === "library" && (
              <TemplateLibraryView onSelectTemplate={handleSelectTemplateAndGo} />
            )}
            {currentTab === "voice" && isAuthenticated && <VoiceOverView />}
            {currentTab === "dashboard" && (
              <DashboardView
                videos={videos}
                onPlayVideo={handlePlaySampleVideo}
                onDeleteVideo={handleDeleteVideo}
                onNavigate={navigateTo}
              />
            )}
            {currentTab === "manage-users" && isAuthenticated && <ManageUsersView />}

            {currentTab === "login" && (
              <LoginView
                onLoginSuccess={() => setCurrentTab("workspace")}
                onGoRegister={() => setCurrentTab("register")}
              />
            )}
            {currentTab === "register" && (
              <RegisterView
                onSuccess={() => setCurrentTab("workspace")}
                onGoLogin={() => setCurrentTab("login")}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* MOBILE NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-surface-container p-2 flex justify-around items-center lg:hidden shadow-[0_-8px_24px_rgba(0,0,0,0.05)]">
        {[
          { tab: "home", icon: <Home className="w-5 h-5 mb-0.5" />, label: "Trang chủ" },
          { tab: "workspace", icon: <PlusCircle className="w-5 h-5 mb-0.5" />, label: "Gieo Hạt Giống" },
          { tab: "workflow", icon: <GitFork className="w-5 h-5 mb-0.5" />, label: "Workflow Kịch Bản" },
          { tab: "library", icon: <BookOpen className="w-5 h-5 mb-0.5" />, label: "Thư viện" },
          { tab: "dashboard", icon: <Film className="w-5 h-5 mb-0.5" />, label: "Của bé" },
        ].map(({ tab, icon, label }) => (
          <button
            key={tab}
            onClick={() => navigateTo(tab)}
            className={`flex flex-col items-center p-2 rounded-xl cursor-pointer ${currentTab === tab ? "text-[#2d6c00] font-black" : "text-outline font-bold"}`}
          >
            {icon}
            <span className="text-[10px]">{label}</span>
          </button>
        ))}
      </nav>

      {/* VIDEO MODAL */}
      {sampleVideoUrl && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 md:p-8 z-50">
          <div className="w-full max-w-3xl bg-white rounded-3xl overflow-hidden border-8 border-white shadow-2xl relative block">
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
            <div className="relative aspect-video bg-black">
              <video src={sampleVideoUrl} controls autoPlay className="w-full h-full object-cover" />
            </div>
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
