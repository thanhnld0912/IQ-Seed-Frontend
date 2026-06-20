import React, { useState } from "react";
import { motion } from "motion/react";
import { KeyRound, ShieldAlert, Sparkles, Mail, Lock, CheckCircle, Smile, HelpCircle, Star } from "lucide-react";

interface LoginViewProps {
  onLoginSuccess: (email: string, isPremium: boolean) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignMode, setIsSignMode] = useState(true); // true = Logged in custom state placeholder

  // Parental Gate puzzle lock states
  const [showParentalGate, setShowParentalGate] = useState(false);
  const [mathAnswer, setMathAnswer] = useState("");
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);

  // Math puzzle: 8 * 7 or 9 + 8
  const mathQuestion = "9 + 8 = ?";
  const correctAnswer = "17";

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Vui lòng điện đầy đủ thông tin nha ba mẹ!");
      return;
    }
    // Success simulation
    onLoginSuccess(email, false);
  };

  const handleSolveParentalGate = () => {
    if (mathAnswer.trim() === correctAnswer) {
      alert("Đúng rồi! Ba mẹ đã mở khóa chế độ Sáng Tạo Chuyên Nghiệp Không Giới Hạn thành công!");
      onLoginSuccess("bame_pro@hatgiongiq.edu.vn", true);
    } else {
      setWrongAnswersCount(prev => prev + 1);
      alert("Kết quả chưa đúng rồi ba mẹ ơi! Con học giỏi toán lắm đó, ba mẹ thử lại xem sao nha!");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border-2 border-surface-container shadow-xl overflow-hidden relative">
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#6bbf3a]/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#4bafff]/10 rounded-full blur-xl"></div>

        {/* Heading Header */}
        <div className="bg-[#6bbf3a]/15 p-6 border-b border-surface-container text-center space-y-2 relative">
          <span className="text-4xl block animate-bounce">🎒</span>
          <h2 className="font-heading text-xl font-black text-primary">Cổng Thông Thái Hạt Giống IQ</h2>
          <p className="text-xs text-on-surface-variant font-medium">Ba mẹ đăng nhập để xem lịch sử gieo mầm của con nha!</p>
        </div>

        {/* Mode tabs standard login vs math gate bypass */}
        <div className="grid grid-cols-2 text-center text-xs font-black border-b border-surface-container">
          <button
            onClick={() => setShowParentalGate(false)}
            className={`py-3 ${!showParentalGate ? 'bg-white text-secondary border-b-2 border-secondary' : 'bg-[#f5f3ee] text-outline'}`}
          >
            Đăng nhập ba mẹ
          </button>
          <button
            onClick={() => setShowParentalGate(true)}
            className={`py-3 flex items-center justify-center gap-1.5 ${showParentalGate ? 'bg-white text-secondary border-b-2 border-secondary' : 'bg-[#f5f3ee] text-outline'}`}
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Khóa phụ huynh (Bypass)
          </button>
        </div>

        {/* MAIN BODY CONTENT */}
        <div className="p-8">
          
          {/* STANDARD AUTHENTICATION SIGN IN */}
          {!showParentalGate ? (
            <form onSubmit={handleStandardSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-[#404a39] uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#2d6c00]" /> Thư điện tử (Email) của ba mẹ
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="bame@viethoc.edu.vn"
                  className="w-full p-3 border-2 border-outline-variant focus:border-[#2d6c00] outline-none rounded-2xl text-sm font-medium transition-all bg-[#FFFDF7]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-[#404a39] uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#2d6c00]" /> Mật mật mã an toàn
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 border-2 border-outline-variant focus:border-[#2d6c00] outline-none rounded-2xl text-sm font-medium transition-all bg-[#FFFDF7]"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-gradient-to-r from-primary-container to-primary text-white font-extrabold text-sm shadow-md hover:scale-102 transition-transform cursor-pointer squishy-button"
                >
                  Tham gia gieo hạt giống sáng tạo
                </button>
              </div>

              {/* Quick bypass help */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setEmail("phuhuynh_vietnam@gmail.com");
                    setPassword("hatgiongiq123");
                  }}
                  className="text-[11px] text-[#2d6c00] font-bold hover:underline"
                >
                  * Nhấn vào đây để xem thử tài khoản demo tự động
                </button>
              </div>
            </form>
          ) : (
            
            /* PARENTAL MATHEMATICAL GATE FOR QUICK LEVEL EXEMPTION */
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-[#ffdea5]/50 rounded-full flex items-center justify-center mx-auto text-3xl border border-[#dba110]">
                🔐
              </div>
              <div className="space-y-1">
                <h3 className="font-heading text-base font-black text-on-surface">Cổng Tính Toán An Toàn</h3>
                <p className="text-xs text-on-surface-variant font-medium">
                  Để đề phòng học sinh tự động bấm cài đặt trả phí, ba mẹ hãy hoàn thành phép tính của học sinh tiểu học sau nhé:
                </p>
              </div>

              {/* Calculations Box */}
              <div className="bg-[#FFFDF7] p-5 rounded-2xl border-2 border-dashed border-[#dba110] text-center space-y-3">
                <span className="font-heading text-2xl font-black text-[#7b5800] tracking-wide">
                  {mathQuestion}
                </span>
                
                <input
                  type="number"
                  value={mathAnswer}
                  onChange={(e) => setMathAnswer(e.target.value)}
                  placeholder="Kết quả là mấy..."
                  className="w-full max-w-[160px] mx-auto p-2 bg-white border-2 border-outline-variant focus:border-[#dba110] outline-none rounded-xl text-center text-sm font-bold block"
                />
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleSolveParentalGate}
                  className="w-full py-3 bg-gradient-to-r from-[#F5B82E] to-[#FF9F40] text-white rounded-full font-extrabold text-sm shadow-md hover:scale-102 transition-transform cursor-pointer"
                >
                  Gửi câu trả lời
                </button>
                <p className="text-[10px] text-outline font-bold flex items-center justify-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Chỉ ba mẹ mới giải được
                </p>
              </div>
            </div>

          )}

        </div>
      </div>
    </div>
  );
}
