import React, { useState } from "react";
import { motion } from "motion/react";
import { INITIAL_NODES, VOICES } from "../data";
import { WorkflowNode } from "../types";
import { GitFork, Eye, Layers, Settings, ChevronRight, Mountain, Sparkles, User, Mic, Video } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface EditWorkflowViewProps {
  onNavigate: (tab: string) => void;
}

export default function EditWorkflowView({ onNavigate }: EditWorkflowViewProps) {
  const { isAuthenticated } = useAuth();
  const [nodes, setNodes] = useState<WorkflowNode[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("n-script");
  const [unlockedStepIndex, setUnlockedStepIndex] = useState<number>(0);
  
  // Customizable states for each node
  const [scriptText, setScriptText] = useState("Một chú sâu bông nhỏ bé muốn đi tìm đu quay gỗ mọc giữa trường cầu vồng rực rỡ.");
  const [scriptChapters, setScriptChapters] = useState("3");
  const [scenePrompt, setScenePrompt] = useState("Vương quốc đồi thông lấp lánh cỏ tiên thảo ban đêm, mọc cây nấm đỏ.");
  const [characterMascot, setCharacterMascot] = useState("saubong");
  const [characterEmotion, setCharacterEmotion] = useState("cheerful");
  const [selectedVoice, setSelectedVoice] = useState("bena");
  const [voiceSpeed, setVoiceSpeed] = useState(100);
  const [transitionEffect, setTransitionEffect] = useState("fade");

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const handleNextStep = (currentIndex: number) => {
    if (!isAuthenticated) {
      onNavigate("login");
      return;
    }
    const nextIndex = currentIndex + 1;
    if (nextIndex < nodes.length) {
      if (nextIndex > unlockedStepIndex) {
        setUnlockedStepIndex(nextIndex);
      }
      setSelectedNodeId(nodes[nextIndex].id);
    }
  };

  // Map icons
  const getNodeIcon = (type: string) => {
    switch (type) {
      case "script": return <Sparkles className="w-5 h-5 text-[#6bbf3a]" />;
      case "scene-character": return <Mountain className="w-5 h-5 text-secondary" />;
      case "voice": return <Mic className="w-5 h-5 text-[#C792E0]" />;
      case "video": return <Video className="w-5 h-5 text-[#FF9F40]" />;
      default: return <Settings className="w-5 h-5 text-[#dba110]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] pb-24 md:pb-12 pt-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        
        {/* Banner */}
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-[#2d6c00] font-heading flex items-center justify-center md:justify-start gap-2">
            <GitFork className="w-8 h-8 text-[#6bbf3a]" /> Sơ đồ gieo hạt giống (Workflow)
          </h1>
          <p className="text-on-surface-variant text-sm md:text-base font-medium">
            Kéo thả hoặc nhấn vào từng mắt xích để cấu hình chi tiết nét vẽ, âm điệu và mảnh ghép cho câu chuyện.
          </p>
        </div>

        {/* Workflow Diagram Area */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-surface-container relative overflow-hidden canvas-grid">
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 py-8">
            
            {/* Horizontal connection line indicator */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-[#6bbf3a] via-[#4bafff] via-[#C792E0] via-[#FF9F40] to-[#dba110] -translate-y-1/2 hidden md:block opacity-60 rounded-full"></div>
            
            {nodes.map((node, index) => {
              const isSelected = node.id === selectedNodeId;
              const isLocked = index > unlockedStepIndex;
              
              return (
                <div key={node.id} className="relative z-20 flex flex-col items-center">
                  <motion.button
                    whileHover={isLocked ? {} : { scale: 1.05 }}
                    whileTap={isLocked ? {} : { scale: 0.95 }}
                    onClick={() => {
                      if (isLocked) {
                        alert(`Ba mẹ vui lòng hoàn thành bước "${nodes[unlockedStepIndex].label}" trước nhé!`);
                        return;
                      }
                      setSelectedNodeId(node.id);
                    }}
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center border-4 shadow-md ${
                      isSelected 
                        ? 'border-[#2d6c00] bg-white ring-4 ring-[#6bbf3a]/30' 
                        : isLocked 
                          ? 'border-surface-container bg-surface-container-low opacity-60 cursor-not-allowed' 
                          : 'border-surface-container-high bg-white'
                    } transition-all cursor-pointer`}
                  >
                    <div className="flex flex-col items-center relative">
                      {isLocked && (
                        <div className="absolute -top-3 -right-3 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-sm font-bold z-30">
                          🔒
                        </div>
                      )}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 ${isLocked ? 'bg-surface-container-high' : node.bgColorClass}`}>
                        {getNodeIcon(node.type)}
                      </div>
                      <span className="text-[10px] font-black text-on-surface uppercase tracking-wider">{node.label}</span>
                    </div>
                  </motion.button>

                  {/* Flow sign step */}
                  {index < nodes.length - 1 && (
                    <div className="absolute left-[92px] top-7 text-[#6bbf3a] font-bold hidden md:block">
                      <ChevronRight className="w-5 h-5 animate-pulse" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Context Settings Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Detailed Editor Pane */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl shadow-md border border-surface-container space-y-6">
            <div className="flex items-center gap-3 border-b border-surface-container pb-4">
              <span className="text-3xl">⚙️</span>
              <div>
                <h3 className="font-heading text-lg font-black text-on-surface">Cấu hình {selectedNode.label}</h3>
                <p className="text-xs text-outline font-bold">Mã số nút kịch bản: {selectedNode.id}</p>
              </div>
            </div>

            {/* Dynamic editing content depending on selected Node */}
            
            {/* Step 1: Tạo Kịch Bản */}
            {selectedNode.type === 'script' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-on-surface-variant flex items-center gap-2 uppercase">
                    <Sparkles className="w-4 h-4 text-[#6bbf3a]" /> Nội dung kịch bản gốc
                  </label>
                  <textarea
                    value={scriptText}
                    onChange={(e) => {
                      if (!isAuthenticated) {
                        onNavigate("login");
                        return;
                      }
                      setScriptText(e.target.value);
                    }}
                    className="w-full h-32 p-4 bg-[#FFFDF7] border-2 border-outline-variant focus:border-[#2d6c00] outline-none rounded-xl text-sm font-medium transition-all resize-none"
                    placeholder="Nhập ý tưởng cốt truyện hoặc nội dung slide truyện..."
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          onNavigate("login");
                          return;
                        }
                        setScriptText("Một chú rùa nhỏ đi tìm ngọc trai thông thái dưới biển để làm quà sinh nhật cho mẹ.");
                      }}
                      className="px-3 py-1 bg-surface-container-low border border-outline-variant hover:border-[#2d6c00] rounded-full text-[11px] font-bold"
                    >
                      🐢 Kịch bản Rùa Con
                    </button>
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          onNavigate("login");
                          return;
                        }
                        setScriptText("Chú chim nhỏ dũng cảm tập bay qua thung lũng gió để đón bình minh cùng các bạn.");
                      }}
                      className="px-3 py-1 bg-surface-container-low border border-outline-variant hover:border-[#2d6c00] rounded-full text-[11px] font-bold"
                    >
                      🐦 Tập bay
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-on-surface-variant">Số lượng chương/slide câu chuyện</label>
                  <select
                    value={scriptChapters}
                    onChange={(e) => {
                      if (!isAuthenticated) {
                        onNavigate("login");
                        return;
                      }
                      setScriptChapters(e.target.value);
                    }}
                    className="w-full text-xs font-bold py-2 px-3 border border-outline rounded-xl"
                  >
                    <option value="3">3 Chương (Ngắn gọn, súc tích)</option>
                    <option value="4">4 Chương (Tiêu chuẩn mầm non)</option>
                    <option value="5">5 Chương (Chi tiết sinh động)</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-surface-container flex justify-end">
                  <button
                    onClick={() => handleNextStep(0)}
                    className="px-6 py-2.5 bg-[#6bbf3a] text-white hover:bg-[#2d6c00] rounded-full text-xs font-extrabold flex items-center gap-1 transition-colors"
                  >
                    <span>Lưu kịch bản & Tiếp theo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Tạo Cảnh và Nhân Vật */}
            {selectedNode.type === 'scene-character' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-on-surface-variant flex items-center gap-2 uppercase">
                    <Mountain className="w-4 h-4 text-secondary" /> Lệnh vẽ phác thảo bối cảnh
                  </label>
                  <textarea
                    value={scenePrompt}
                    onChange={(e) => {
                      if (!isAuthenticated) {
                        onNavigate("login");
                        return;
                      }
                      setScenePrompt(e.target.value);
                    }}
                    className="w-full h-24 p-3 bg-[#FFFDF7] border-2 border-outline-variant focus:border-secondary outline-none rounded-xl text-xs font-medium transition-all resize-none"
                    placeholder="Mô tả bối cảnh..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          onNavigate("login");
                          return;
                        }
                        setScenePrompt("Trường mầm non cầu vồng đầy hoa, bạn sâu bông bay trên đu quay gỗ rực rỡ.");
                      }}
                      className="px-3 py-1 bg-surface-container-low border border-outline-variant hover:border-secondary rounded-full text-[10px] font-bold"
                    >
                      🎪 Sân chơi gỗ
                    </button>
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          onNavigate("login");
                          return;
                        }
                        setScenePrompt("Ngôi nhà nấm tí hon ấm cúng cạnh lò sưởi bập bùng với ly sữa tươi.");
                      }}
                      className="px-3 py-1 bg-surface-container-low border border-outline-variant hover:border-secondary rounded-full text-[10px] font-bold"
                    >
                      🍄 Nhà nấm sưởi ấm
                    </button>
                  </div>
                </div>

                {/* Character Selection Card block inside Step 2 */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-on-surface-variant flex items-center gap-2 uppercase">
                    <User className="w-4 h-4 text-[#C792E0]" /> Lựa chọn nhân vật chính (Mascot)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "saubong", name: "Sâu Bông", emoji: "🐛", desc: "Tò mò, đáng yêu" },
                      { id: "gaubong", name: "Gấu Bông", emoji: "🐻", desc: "Dũng cảm, ngăn nắp" },
                      { id: "ruacon", name: "Rùa Con", emoji: "🐢", desc: "Thông thái, kiên trì" }
                    ].map((mascot) => (
                      <div
                        key={mascot.id}
                        onClick={() => {
                          if (!isAuthenticated) {
                            onNavigate("login");
                            return;
                          }
                          setCharacterMascot(mascot.id);
                        }}
                        className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-1 ${
                          characterMascot === mascot.id 
                            ? 'border-[#C792E0] bg-[#C792E0]/10' 
                            : 'border-surface-container-high hover:border-[#C792E0]/40'
                        }`}
                      >
                        <span className="text-2xl">{mascot.emoji}</span>
                        <div className="text-xs font-black">{mascot.name}</div>
                        <div className="text-[8px] text-outline font-bold">{mascot.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-on-surface-variant">Đổ bóng</label>
                    <select
                      className="w-full text-xs font-bold py-1.5 px-2.5 border border-outline rounded-xl"
                      onChange={() => {
                        if (!isAuthenticated) {
                          onNavigate("login");
                        }
                      }}
                    >
                      <option>Mềm mại ngọt ngào (Soft)</option>
                      <option>Sắc nét (Cell shadow)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-on-surface-variant">Khử nhiễu AI</label>
                    <select
                      className="w-full text-xs font-bold py-1.5 px-2.5 border border-outline rounded-xl"
                      onChange={() => {
                        if (!isAuthenticated) {
                          onNavigate("login");
                        }
                      }}
                    >
                      <option>Khử nâng cao (High Quality)</option>
                      <option>Nhanh (Speed Draft)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-surface-container flex justify-end">
                  <button
                    onClick={() => handleNextStep(1)}
                    className="px-6 py-2.5 bg-[#4bafff] text-white hover:bg-[#004a77] rounded-full text-xs font-extrabold flex items-center gap-1 transition-colors"
                  >
                    <span>Lưu bối cảnh & Tiếp theo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Tạo Voice */}
            {selectedNode.type === 'voice' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-on-surface-variant flex items-center gap-2 uppercase">
                    <Mic className="w-4 h-4 text-[#C792E0]" /> Diễn thuyết giọng kể truyện
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {VOICES.map((v) => (
                      <div
                        key={v.id}
                        onClick={() => {
                          if (!isAuthenticated) {
                            onNavigate("login");
                            return;
                          }
                          setSelectedVoice(v.id);
                        }}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${selectedVoice === v.id ? 'border-[#C792E0] bg-[#C792E0]/10' : 'border-surface-container-high'}`}
                      >
                        <img src={v.avatarUrl} alt={v.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <div className="text-xs font-black">{v.name}</div>
                          <div className="text-[9px] text-outline font-bold">{v.region}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-on-surface-variant">Tốc độ kể chuyện (Narration speed)</label>
                  <input
                    type="range"
                    min="80"
                    max="150"
                    value={voiceSpeed}
                    onChange={(e) => {
                      if (!isAuthenticated) {
                        onNavigate("login");
                        return;
                      }
                      setVoiceSpeed(Number(e.target.value));
                    }}
                    className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-[#C792E0]"
                  />
                  <div className="flex justify-between text-[10px] text-outline font-bold">
                    <span>Chậm (x0.8)</span>
                    <span className="text-[#C792E0] font-black">Hiện tại: x{(voiceSpeed / 100).toFixed(1)}</span>
                    <span>Nhanh (x1.5)</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-surface-container flex justify-end">
                  <button
                    onClick={() => handleNextStep(2)}
                    className="px-6 py-2.5 bg-[#C792E0] text-white hover:bg-[#7b1fa2] rounded-full text-xs font-extrabold flex items-center gap-1 transition-colors"
                  >
                    <span>Lưu giọng đọc & Tiếp theo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Tạo Video */}
            {selectedNode.type === 'video' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-on-surface-variant uppercase flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#FF9F40]" /> Ghép slide & Hiệu ứng chuyển động
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          onNavigate("login");
                          return;
                        }
                        setTransitionEffect("fade");
                      }}
                      className={`py-3 border-2 rounded-xl text-xs font-bold transition-all ${transitionEffect === 'fade' ? 'border-[#FF9F40] bg-[#FF9F40]/10' : 'border-surface-container-high'}`}
                    >
                      🎬 Làm mờ dần
                    </button>
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          onNavigate("login");
                          return;
                        }
                        setTransitionEffect("slide");
                      }}
                      className={`py-3 border-2 rounded-xl text-xs font-bold transition-all ${transitionEffect === 'slide' ? 'border-[#FF9F40] bg-[#FF9F40]/10' : 'border-surface-container-high'}`}
                    >
                      🎬 Sang trang
                    </button>
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          onNavigate("login");
                          return;
                        }
                        setTransitionEffect("zoom");
                      }}
                      className={`py-3 border-2 rounded-xl text-xs font-bold transition-all ${transitionEffect === 'zoom' ? 'border-[#FF9F40] bg-[#FF9F40]/10' : 'border-surface-container-high'}`}
                    >
                      🎬 Phóng lớn
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#ffdea5]/20 p-4 rounded-xl border border-[#ffdea5]/50">
                  <span className="text-xl">🎒</span>
                  <p className="text-xs text-[#7b5800] leading-relaxed">
                    <strong>Gợi ý:</strong> Giáo án mầm non hay thường dùng hiệu ứng <strong>Làm mờ dần</strong> để trẻ không bị mỏi mắt khi thay đổi bối cảnh kịch bản!
                  </p>
                </div>

                <div className="pt-4 border-t border-surface-container flex justify-end">
                  <button
                    onClick={() => handleNextStep(3)}
                    className="px-6 py-2.5 bg-[#FF9F40] text-white hover:bg-orange-600 rounded-full text-xs font-extrabold flex items-center gap-1 transition-colors"
                  >
                    <span>Hoàn tất ghép slide & Tiếp theo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Xuất Video */}
            {selectedNode.type === 'export' && (
              <div className="space-y-4 text-center py-6">
                <span className="text-5xl block animate-bounce">🥇</span>
                <h4 className="font-heading text-lg font-black text-on-surface">Xuất dữ liệu chất lượng cao</h4>
                <p className="text-xs text-outline font-medium max-w-sm mx-auto">
                  Tắt phụ đề, bật xử lý chống rung quang học, tự động nén kích thước tối ưu để chia sẻ nhanh lên Zalo group mầm non cho ba mẹ.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        onNavigate("login");
                        return;
                      }
                      alert("Đang chuẩn bị gói kết xuất nén chất lượng cao cho bé...");
                    }}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-primary-container to-primary text-white font-extrabold text-sm shadow-md hover:scale-105 transition-transform"
                  >
                    Kết xuất ngay kịch bản này
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Real-time preview feedback on the right */}
          <aside className="lg:col-span-5 bg-white p-6 rounded-3xl border border-surface-container space-y-4">
            <h4 className="text-xs font-black text-on-surface-variant uppercase tracking-wide flex items-center gap-1">
              <Eye className="w-4.5 h-4.5 text-[#2d6c00]" /> Khảo sát nét vẽ kịch bản
            </h4>

            {/* Simulated Frame Preview */}
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border-4 border-surface-container">
              {(() => {
                let imgUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuAGRMABwkcsNkB6cazPtEcY1MX0pbhEmErC97ndL66vIF_w8XhjN92ddO9pmQQy1Yjwg2vmPFnUuLAcGrSalN7sXtAGIElJ2IEq-sgt0GCdFg-fuZ1ge0gwHOo1ekNG0XpUkZIFV29AgYsK5GPpSta_0wzRKgyTn4Idr8yaj9nXTmgqRZ1NrrRh4RKK9-vSuSkNdc8k_DxtQVBNy4woQ2F38eLkTrZm4PE76wiYJjidBsh061GFgL7aneO73JddATNBuSoYpMqQrmyP";
                if (selectedNode.type === 'scene-character') imgUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuCGZlJx2lVUtaa3z0DQi2sa5kS_5M03Pzn7k5Tf-UPE0s8aceKN-XEbnwdVlQ-HadZttC6u8ZStkpQU-YVtHnNPvjBxOk6GJOahjkdd6978eDJKzI8SbB-HpxYwfDC5jSPKOriDcIjSCTMzA3f0sGN96x5ynCODqwh-owWQqpd7ru78D5rDRbr7BRKXqZHo2aozZMevL-jMg8GHkOUae7UP0tgQdz5A4t8tvs5VM8AmvGOOez7dEpAOXDfsA5Rc8Lv8D3i4QE6RYVoM";
                if (selectedNode.type === 'video') imgUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBYPQi1asxjJ7rGeYeaAzGIa8IhWoQzyKgj8f-cSN7q_4KI1PEcydiC806-YUoyvSECAb-oDCTW8fWMv3grjWY8Ql-vLu-pU65HrT3IstBa3ULRfh5KgHQJsqPKxlA2ctWTpw9wpI3mlG2vKR_LKwUI5KDpSmCj-z67rM4JdzByCrNDWLEND9PTUm3UcgAgj4T1K6K93SELDIpj7pjj2tg3WsbaZ_wTTVYS9ZqJqAlvVJrlf_WU6WeDTASAvfFQxSLtn9DxLtaJMu5l";

                return <img src={imgUrl} alt="Preview frame" className="absolute inset-0 w-full h-full object-cover" />;
              })()}
              
              {/* Overlapping slide metadata */}
              <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                Cảnh hiện tại
              </div>
            </div>

            {/* Settings display status */}
            <div className="space-y-3 bg-[#f5f3ee] p-4 rounded-2xl border border-surface-container">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌿</span>
                <span className="text-xs font-black text-on-surface">Tổng hợp thông số:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-on-surface-variant font-bold">
                <li>• Kịch bản: <span className="text-secondary line-clamp-1">{scriptText} ({scriptChapters} slide)</span></li>
                <li>• Bối cảnh: <span className="text-[#4bafff] line-clamp-1">{scenePrompt}</span></li>
                <li>• Mascot nhân vật: <span className="text-[#C792E0] uppercase">{characterMascot} ({characterEmotion})</span></li>
                <li>• Giọng kể: <span className="text-primary">{VOICES.find(v => v.id === selectedVoice)?.name} (Tốc độ: x{(voiceSpeed/100).toFixed(1)})</span></li>
                <li>• Hiệu ứng lật trang: <span className="text-[#FF9F40]">{transitionEffect}</span></li>
              </ul>
            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}
