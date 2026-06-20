import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

// Lazy initialize Gemini client to prevent crashes if key is initially empty
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route - Expand child story script using server-side Gemini 3.5 Flash
  app.post("/api/generate-story", async (req, res) => {
    try {
      const { userPrompt, style, focusType } = req.body;

      if (!userPrompt || userPrompt.trim() === "") {
        res.status(400).json({ error: "Vui lòng nhập một ý tưởng ban đầu." });
        return;
      }

      // Check if GEMINI_API_KEY is available
      if (!process.env.GEMINI_API_KEY) {
        // Safe mock fallback content when key is missing to keep UI live
        const generatedMockTitle = "Hành trình sáng tạo của bé";
        const generatedMockScript = `[Phôi cảnh 1] ${userPrompt} trong phong cách ${style || "3D hoạt họa"}. Bé Na xuất hiện và cười rạng rỡ, chỉ tay về phía trước. 
[Phôi cảnh 2] Nhân vật phiêu lưu qua đồi cỏ xanh ngát đầy hoa sắc màu dưới ánh nắng mật ong ấm áp.
[Phôi cảnh 3] Chú bọ cánh cam tí hon bay lượn vòng quanh, phát ra ánh sáng lung linh thần kỳ giúp kích hoạt hạt mầm tư duy.
[Phôi cảnh 4] Hạt mầm thông thái từ lòng đất vươn vai mọc thành cây cổ thụ lấp lánh ánh kim, nở hoa rực rỡ tượng trưng cho trí tưởng tượng bay xa của bé mầm non.`;

        res.json({
          title: generatedMockTitle,
          script: generatedMockScript,
          expanded: true,
          isMock: true,
          message: "Lưu ý: Đang sử dụng kịch bản mẫu do chưa thiết lập API Key."
        });
        return;
      }

      const client = getGeminiClient();

      const systemPrompt = `You are an expert preschool education tutor and creative children's animator. 
Your goal is to expand the user's short movie seed idea into an incredibly engaging, highly visual, educational 4-scene cartoon script (Kịch bản phân cảnh).
Write completely in Vietnamese language.
Format your output strictly as a JSON object with:
{
  "title": "A short beautiful kid-friendly title",
  "script": "A detailed script text broken down by [Cảnh 1], [Cảnh 2], [Cảnh 3], [Cảnh 4] detailing action, narrator vocal content, style descriptors, and educational focus.",
  "sceneIdeas": ["Detailed description of visuals for scene 1", "Detailed description of visuals for scene 2", "Detailed description of visuals for scene 3", "Detailed description of visuals for scene 4"]
}`;

      const userText = `Ý tưởng của bé: "${userPrompt}"
Phong cách hình ảnh: "${style || "3D Hoạt hình dễ thương"}"
Yêu cầu kịch bản cho độ tuổi mầm non (dưới 6 tuổi), từ ngữ ấm áp, dễ hiểu, nhịp điệu sinh động và có yếu tố kỳ ảo giáo dục.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userText,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          temperature: 0.9,
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response from Gemini API");
      }

      const parsedResult = JSON.parse(responseText.trim());
      res.json({
        title: parsedResult.title || "Câu chuyện kỳ diệu",
        script: parsedResult.script || "Kịch bản đang được ươm mầm...",
        sceneIdeas: parsedResult.sceneIdeas || [],
        expanded: true,
        isMock: false,
      });

    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({
        error: "Không thể lấy kịch bản từ trí tuệ nhân tạo.",
        details: error.message || error,
      });
    }
  });

  // Hotfix or telemetry check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
  });

  // Serve static application web app or Vite Development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Mount Vite middleware
    app.use(vite.middlewares);
  } else {
    // Production serving static files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start custom server:", err);
});
