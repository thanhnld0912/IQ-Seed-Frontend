import { apiGet, apiPost } from './client';

export interface StoryScene {
  text: string;
  imagePrompt: string;
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
    apiPost<{ title: string; scenes: StoryScene[]; isMock: boolean }>('/api/story/generate', {
      userPrompt,
      style,
      sceneCount,
    }),
  // Prompt mẫu (thủ công)
  templateOptions: () => apiGet<TemplateOptions>('/api/story/template-options'),
  template: (input: TemplateInput) => apiPost<{ prompt: string }>('/api/story/template', input),
  parse: (text: string, style?: string) =>
    apiPost<{ scenes: StoryScene[] }>('/api/story/parse', { text, style }),
};
