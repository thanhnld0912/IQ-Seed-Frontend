import React from "react";
import { motion } from "motion/react";
import { Sparkles, Play, Search, Star, Award, Layers, ArrowRight, MessageSquare, Flame } from "lucide-react";
import { VIDEO_SHOWCASES } from "../data";

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  onPlaySampleVideo: (videoUrl: string, title: string) => void;
}

export default function HomeView({ onNavigate, onPlaySampleVideo }: HomeViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF7] to-[#e8f5e9]/60 pb-16 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 max-w-7xl mx-auto md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-[#cfe5ff] text-[#004a77] px-4 py-1.5 rounded-full text-xs font-bold font-heading tracking-wide shadow-sm animate-bounce">
              <Sparkles className="w-3.5 h-3.5" />
              Ứng dụng trí tuệ nhân tạo hàng đầu cho trẻ em
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1b1c19] leading-tight tracking-tight">
              Biến ý tưởng thành <span className="text-[#2d6c00] underline decoration-[#6bbf3a] decoration-wavy">video hoạt hình</span> AI cho bé chỉ trong vài phút
            </h1>
            <p className="text-lg md:text-xl text-[#404a39] max-w-xl mx-auto lg:mx-0 font-medium">
              Nền tảng sáng tạo nội dung giáo dục an toàn, sinh động dành riêng cho ba mẹ, thầy cô và các bé mầm non.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              <button
                onClick={() => onNavigate("workspace")}
                className="w-full sm:w-auto px-10 py-5 rounded-full bg-gradient-to-r from-[#F5B82E] to-[#FF9F40] text-white font-extrabold text-lg squishy-button border-b-4 border-orange-600/30 flex items-center justify-center gap-2 shadow-lg hover:brightness-105 transition-all cursor-pointer"
              >
                <Sparkles className="w-5 h-5 fill-white" />
                Tạo video ngay
              </button>
              <button
                onClick={() => onPlaySampleVideo(
                  "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
                  "Mẫu hoạt hình vương quốc thần tiên"
                )}
                className="w-full sm:w-auto px-10 py-5 rounded-full border-2 border-dashed border-[#2d6c00] text-[#2d6c00] font-extrabold text-lg hover:bg-[#6bbf3a]/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-[#2d6c00]" />
                Xem video mẫu
              </button>
            </div>
          </motion.div>

          {/* Hero Mascot Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center items-center"
          >
            <div className="absolute w-[360px] h-[360px] bg-[#6bbf3a]/10 rounded-full blur-3xl animate-pulse"></div>
            {/* Mascot */}
            <div className="relative z-10 w-full max-w-sm aspect-square flex items-center justify-center">
              <div className="w-64 h-80 bg-[#D9B38C] rounded-full relative shadow-2xl border-8 border-white flex flex-col justify-between overflow-visible">
                {/* Leaves */}
                <div className="absolute -top-12 left-1/4 w-20 h-24 bg-[#2d6c00] rounded-full origin-bottom -rotate-12 animate-wiggle"></div>
                <div className="absolute -top-12 right-1/4 w-20 h-24 bg-[#6bbf3a] rounded-full origin-bottom rotate-12 animate-wiggle" style={{ animationDelay: "0.5s" }}></div>
                
                {/* Face */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                  <div className="flex gap-10 mb-4">
                    <div className="w-6 h-6 bg-[#1b1c19] rounded-full"></div>
                    <div className="w-6 h-6 bg-on-surface rounded-full"></div>
                  </div>
                  <div class="w-14 h-4 bg-transparent border-b-4 border-[#1b1c19] rounded-full"></div>
                </div>

                {/* Magnifying Glass badge */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white rounded-full border-4 border-[#2d6c00] flex items-center justify-center shadow-xl transform rotate-12 hover:scale-110 transition-transform">
                  <Search className="w-10 h-10 text-[#2d6c00]" />
                </div>
              </div>

              {/* Floaters */}
              <div className="absolute bottom-6 left-2 w-16 h-16 bg-[#ffdea5] rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-bounce">
                <Star className="w-6 h-6 text-[#7b5800] fill-[#7b5800]" />
              </div>
              <div className="absolute top-10 right-4 w-14 h-14 bg-[#cfe5ff] rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-pulse">
                <Award className="w-6 h-6 text-[#00639c]" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-20 px-4 md:px-8 border-y border-[#eae8e2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1b1c19]">Phòng thí nghiệm sáng tạo</h2>
            <p className="text-[#404a39] text-base max-w-xl mx-auto font-medium">
              Mọi công cụ bạn cần để tạo ra những câu chuyện cổ tích và bài giảng sinh động nhất cho bé.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#fbf9f3] p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border-t-8 border-[#2d6c00] group flex flex-col justify-between">
              <div>
                <div class="w-14 h-14 bg-[#2d6c00]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-primary font-bold">
                  🎭
                </div>
                <h3 class="font-heading text-lg font-bold text-on-surface mb-2">Tạo video AI</h3>
                <p class="text-sm text-on-surface-variant font-medium">Chỉ cần nhập kịch bản, AI sẽ tự động tạo hình ảnh và chuyển động mượt mà.</p>
              </div>
            </div>

            <div class="bg-white p-8 rounded-lg shadow-sm hover:shadow-xl transition-all border-t-8 border-secondary group">
              <div class="w-16 h-16 bg-[#cfe5ff] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-secondary">
                🎙️
              </div>
              <h3 class="font-heading text-lg font-bold text-on-surface mb-2">Ghép giọng tự nhiên</h3>
              <p class="text-sm text-on-surface-variant font-medium">Thư viện giọng đọc truyền cảm, ấm áp, phù hợp với tâm lý trẻ em Việt Nam.</p>
            </div>

            <div class="bg-white p-8 rounded-lg shadow-sm hover:shadow-xl transition-all border-t-8 border-[#dba110] group">
              <div class="w-16 h-16 bg-[#ffdea5] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-[#dba110]">
                🌿
              </div>
              <h3 class="font-heading text-lg font-bold text-on-surface mb-2">Kéo-thả workflow</h3>
              <p class="text-sm text-on-surface-variant font-medium">Giao diện đơn giản đến mức các bé cũng có thể tham gia sáng tạo cùng ba mẹ.</p>
            </div>

            <div class="bg-white p-8 rounded-lg shadow-sm hover:shadow-xl transition-all border-t-8 border-[#6bbf3a] group">
              <div class="w-16 h-16 bg-[#6bbf3a]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-[#6bbf3a]">
                📐
              </div>
              <h3 class="font-heading text-lg font-bold text-on-surface mb-2">Tạo slide bài học</h3>
              <p class="text-sm text-on-surface-variant font-medium">Xuất video thành các slide tương tác tiện lợi cho giáo án điện tử mầm non.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <section className="py-24 px-4 md:px-8 bg-[#f5f3ee]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 text-center sm:text-left gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-[#1b1c19] mb-2 font-heading">Thư viện mầm xanh</h2>
              <p className="text-on-surface-variant font-medium">Những tác phẩm được tạo ra từ trí tưởng tượng bay bổng học đường.</p>
            </div>
            <button
              onClick={() => onNavigate("library")}
              className="flex items-center gap-2 text-[#2d6c00] font-extrabold text-base hover:underline cursor-pointer"
            >
              Xem tất cả <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {VIDEO_SHOWCASES.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-3xl overflow-hidden shadow-lg aspect-video cursor-pointer hover:shadow-xl transition-all"
                onClick={() => onPlaySampleVideo(
                  "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
                  item.title
                )}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${item.image}')` }}
                ></div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center text-[#2d6c00] group-hover:scale-110 transition-transform shadow-md">
                    <Play className="w-6 h-6 fill-[#2d6c00] translate-x-0.5" />
                  </button>
                </div>
                <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <span className={`inline-block px-3 py-0.5 ${item.tagColor} text-white rounded-full text-xs font-bold mb-2`}>
                    {item.category}
                  </span>
                  <h4 className="text-white font-extrabold text-lg">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works simple section */}
      <section className="py-24 bg-white px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <h2 className="text-3xl font-extrabold font-heading text-on-surface">3 Bước đơn giản để có video hay</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-[#6bbf3a]/15 rounded-full flex items-center justify-center mb-6 border-4 border-[#6bbf3a] text-[#2d6c00]">
                💡
              </div>
              <div className="bg-[#6bbf3a]/5 p-6 rounded-2xl w-full border border-[#6bbf3a]/10">
                <span className="text-[#2d6c00] font-extrabold text-lg block mb-1">1. Nhập ý tưởng</span>
                <p className="text-sm font-medium text-on-surface-variant">Viết một vài câu kể về câu chuyện cổ tích bé mong ước.</p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-[#4bafff]/15 rounded-full flex items-center justify-center mb-6 border-4 border-[#4bafff] text-secondary">
                🎨
              </div>
              <div className="bg-[#cfe5ff]/20 p-6 rounded-2xl w-full border border-[#cfe5ff]/35">
                <span className="text-[#00639c] font-extrabold text-lg block mb-1">2. Chọn phong cách</span>
                <p className="text-sm font-medium text-on-surface-variant">Chọn nhân vật mầm non dễ thương, bối cảnh và giọng đọc ấm áp.</p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-[#dba110]/15 rounded-full flex items-center justify-center mb-6 border-4 border-[#dba110] text-[#dba110]">
                🎬
              </div>
              <div className="bg-[#ffdea5]/25 p-6 rounded-2xl w-full border border-[#ffdea5]/40">
                <span className="text-[#7b5800] font-extrabold text-lg block mb-1">3. Nhận video</span>
                <p className="text-sm font-medium text-on-surface-variant">Trí tuệ nhân tạo gieo hạt, tải video sẵn sàng sau giây lát.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#C792E0]/15 text-center px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <MessageSquare className="w-12 h-12 text-[#C792E0] mx-auto fill-[#C792E0]/20" />
          <p className="text-xl md:text-2xl font-extrabold text-[#1b1c19] italic leading-relaxed">
            "Hạt Giống IQ đã giúp tiết học của mình trở nên hào hứng hơn bao giờ hết. Các con mê mẩn những nhân vật hoạt hình xinh xắn do trí tuệ nhân tạo tạo ra chỉ trong 5 phút!"
          </p>
          <div className="flex items-center justify-center gap-4 text-left">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXl9tKvJ-BDlV6yaBF6sW9QyQxd5PH-Wn64E8SrN3Uu4joj49mbkJOzd_j714ppgXjSDOUwWaYQUGXUel6c-xpTBDLiuNB_rsY15gtXm-3Q490ZefDt6oAlGynJkfd0FxoOJJ8f_EBUBrNlpVgkVjV46CqGCtuNcor254-npCEcvC_nzfjZS9F_s2V5NLEkePWneqYYBje49bFf9MpdiV3KNDA9OuC_S7VoGEwekoU6BcSJ_tbxQkiH7Yp8lpZCSTI1_jM57nhetf3"
              alt="Preschool teacher Minh Thư"
              className="w-14 h-14 rounded-full border-2 border-white shadow-md object-cover"
            />
            <div>
              <div className="font-bold text-on-surface text-base">Cô Minh Thư</div>
              <div className="text-sm text-on-surface-variant font-medium">Giáo viên Mầm non Hoa Sen</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="bg-[#6bbf3a] rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-xl space-y-6">
          <div className="absolute -top-10 -left-10 w-44 h-44 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-[#98cbff]/20 rounded-full blur-2xl"></div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-heading">Bắt đầu gieo hạt sáng tạo hôm nay!</h2>
          <p className="max-w-2xl mx-auto text-lg text-white/95 font-medium">
            Hàng ngàn video giáo dục tuyệt vời đã được thiết kế thành công. Bạn đã sẵn sàng khám phá chân trời trí tưởng tượng bay bổng của các con?
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-4">
            <button
              onClick={() => onNavigate("workspace")}
              className="px-12 py-5 rounded-full bg-gradient-to-r from-[#F5B82E] to-[#FF9F40] text-white font-extrabold text-xl squishy-button border-b-4 border-orange-600/30"
            >
              Dùng thử miễn phí
            </button>
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/20">
              <span className="text-lg">🌱</span>
              <span className="font-bold text-white text-sm">Chào các bé và ba mẹ thân mến!</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2d6c00] text-white pt-16 pb-24 md:pb-12 rounded-t-3xl overflow-hidden mt-12 relative px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="text-2xl font-extrabold font-heading tracking-tight flex items-center gap-2">
              <span class="material-icons text-primary-fixed">eco</span> Hạt Giống IQ
            </div>
            <p class="text-white/80 max-w-sm text-sm">
              Ươm mầm sáng tạo và trí tưởng tượng cho thế hệ tương lai thông qua sức mạnh cách mạng của trí tuệ nhân tạo và tình cảm bao la.
            </p>
          </div>
          <div>
            <h4 class="font-bold font-heading text-sm mb-4 uppercase tracking-wider">Khám phá</h4>
            <ul class="space-y-2 text-sm text-white/80">
              <li><a href="#" className="hover:text-white hover:underline">Về chúng tôi</a></li>
              <li><a class="hover:text-on-primary-container hover:underline" href="#" onClick={(e) => { e.preventDefault(); onNavigate('voice'); }}>Chơi thử lồng tiếng</a></li>
              <li><a class="text-white/80 hover:text-white" href="#" onClick={(e) => { e.preventDefault(); alert("Hạt Giống IQ đã tích hợp trực tiếp!"); }}>Hướng dẫn mầm non</a></li>
              <li><a class="text-white/80 hover:text-on-primary-container hover:underline" href="#">Bảng học phí</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold font-label-lg mb-4 uppercase tracking-wider">Hỗ trợ</h4>
            <ul class="space-y-4 text-sm">
              <li><a class="text-white/80 hover:text-white hover:underline" href="#">Điều khoản sử dụng</a></li>
              <li><a class="text-on-primary-container/80 hover:text-on-primary-container hover:underline" href="#">Chính sách bảo mật</a></li>
              <li><a class="text-on-primary-container/80 hover:text-on-primary-container hover:underline" href="#">Góp ý / Liên hệ</a></li>
            </ul>
          </div>
        </div>
        <div class="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-sm text-white/60">
          <p>© 2026 Hạt Giống IQ - Ươm mầm sáng tạo mầm non Việt</p>
        </div>
      </footer>
    </div>
  );
}
