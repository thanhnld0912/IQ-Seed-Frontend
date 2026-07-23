import { apiGet, apiPost } from './client';

export interface StoryScene {
  text: string;
  imagePrompt: string;
  /** Nhân vật có mặt trong cảnh (khớp StoryCharacter.name). */
  characters?: string[];
  /** Nhân vật đang thoại — quyết định giọng đọc của cảnh. */
  speaker?: string;
}

/** Nhân vật với ngoại hình BẤT BIẾN — nền tảng của tính nhất quán. */
export interface StoryCharacter {
  name: string;
  appearance: string;
}

export interface TemplateOption {
  value: string;
  label: string;
}

export interface TemplateOptions {
  genres: TemplateOption[];
  plots: TemplateOption[];
  ageRanges: TemplateOption[];
}

export interface TemplateInput {
  characterCount?: number;
  genre?: string;
  plotType?: string;
  ageRange?: string;
  style?: string;
  sceneCount?: number;
  mainCharacter?: string;
}

export const storyApi = {
  // AI tự động (WaveSpeed LLM)
  generate: (userPrompt: string, style?: string, sceneCount?: number) =>
    apiPost<{
      title: string;
      scenes: StoryScene[];
      characters: StoryCharacter[];
      styleBible: string;
      isMock: boolean;
    }>('/api/story/generate', { userPrompt, style, sceneCount }),
  // Prompt mẫu (thủ công)
  templateOptions: () => apiGet<TemplateOptions>('/api/story/template-options'),
  template: (input: TemplateInput) => apiPost<{ prompt: string }>('/api/story/template', input),
  parse: (text: string, style?: string) =>
    apiPost<{ scenes: StoryScene[] }>('/api/story/parse', { text, style }),
};
