import { apiGet, apiPost, apiDelete } from './client';

export interface VideoDto {
  id: string;
  title: string;
  prompt: string;
  style: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  durationSec: number;
  engine: 'slideshow' | 't2v';
  status: 'queued' | 'generating' | 'composing' | 'completed' | 'failed';
  progress: number;
  coverUrl: string | null;
  finalUrl: string | null;
  error: string | null;
  /** Lỗi riêng của bước ghép MP4 (video/các cảnh vẫn còn nguyên). */
  exportError: string | null;
  expiresAt: string;
  createdAt: string;
}

export interface SceneDto {
  id: string;
  idx: number;
  role: string;
  title: string;
  text: string;
  imageUrl: string | null;
  clipUrl: string | null;
  audioUrl: string | null;
  transition: string;
  durationSec: number;
  voiceId: string | null;
  status: string;
}

export interface CreateVideoInput {
  prompt: string;
  style?: string;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  durationSec?: number;
  engine?: 'slideshow' | 't2v';
  sceneCount?: number;
  imageModel?: string;
  videoModel?: string;
  storyboard?: {
    title: string;
    slides: any[];
  };
  scenes?: {
    sceneIndex: number;
    title: string;
    description: string;
    transition: string;
    isIntro: boolean;
    isOutro: boolean;
    text: string;
    imagePrompt: string;
    role?: string;
    voiceId?: string;
    duration?: number;
  }[];
}

export interface ModelInfo {
  key: string;
  kind: string;
  label: string;
  hint: string | null;
  costUsd: number | null;
  maxDurationSec: number | null;
  default: boolean;
}

export const videosApi = {
  list: (params?: { style?: string; q?: string; from?: string; to?: string }) => {
    const qs = new URLSearchParams();
    if (params?.style) qs.set('style', params.style);
    if (params?.q) qs.set('q', params.q);
    if (params?.from) qs.set('from', params.from);
    if (params?.to) qs.set('to', params.to);
    const suffix = qs.toString() ? `?${qs}` : '';
    return apiGet<{ videos: VideoDto[] }>(`/api/videos${suffix}`);
  },
  get: (id: string) => apiGet<{ video: VideoDto; scenes: SceneDto[] }>(`/api/videos/${id}`),
  create: (input: CreateVideoInput) => apiPost<{ id: string }>('/api/videos', input),
  remove: (id: string) => apiDelete<{ ok: boolean }>(`/api/videos/${id}`),

  /** Xếp hàng ghép toàn bộ cảnh thành 1 file MP4 (worker FFmpeg xử lý). */
  exportMp4: (id: string) =>
    apiPost<{ jobId: string; status: string; reused?: boolean }>(`/api/videos/${id}/export`, {}),
  models: (kind?: string) =>
    apiGet<{ models: ModelInfo[] }>(`/api/models${kind ? `?kind=${kind}` : ''}`),
};
