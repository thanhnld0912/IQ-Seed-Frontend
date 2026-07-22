export interface VideoItem {
  id: string;
  title: string;
  date: string;
  duration: string; // e.g. "02:45"
  style: string; // e.g. "Anime", "3D Clay"
  prompt: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  status: 'queued' | 'generating' | 'composing' | 'completed' | 'failed';
  progress: number; // 0 to 100
  voiceId?: string;
  coverImage: string;
  category?: string;
  expirationDaysLeft?: number;
  engine?: 'slideshow' | 't2v';
  finalUrl?: string | null;
}

const PLACEHOLDER_COVER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="100%" height="100%" fill="#e8f3dc"/><text x="50%" y="50%" font-size="48" text-anchor="middle" dominant-baseline="central">🌱</text></svg>',
  );

/** Số ngày còn lại tới expiresAt (làm tròn lên, min 0). */
export function daysLeft(expiresAt: string): number {
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

/** Map DTO backend → VideoItem cho UI dashboard hiện có. */
export function dtoToVideoItem(v: {
  id: string;
  title: string;
  prompt: string;
  style: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  durationSec: number;
  engine: 'slideshow' | 't2v';
  status: VideoItem['status'];
  progress: number;
  coverUrl: string | null;
  finalUrl: string | null;
  expiresAt: string;
  createdAt: string;
}): VideoItem {
  const mm = Math.floor(v.durationSec / 60);
  const ss = v.durationSec % 60;
  return {
    id: v.id,
    title: v.title || 'Chưa đặt tên',
    date: new Date(v.createdAt).toLocaleDateString('vi-VN'),
    duration: `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`,
    style: v.style,
    prompt: v.prompt,
    aspectRatio: v.aspectRatio,
    status: v.status,
    progress: v.progress,
    coverImage: v.coverUrl || PLACEHOLDER_COVER,
    expirationDaysLeft: daysLeft(v.expiresAt),
    engine: v.engine,
    finalUrl: v.finalUrl,
  };
}

export interface VideoTemplate {
  id: string;
  name: string;
  ageTag: string; // e.g. "3-5 Tuổi"
  durationTag: string; // e.g. "2 Phút"
  description: string;
  category: string; // e.g. "Cổ tích", "Khoa học", "Âm nhạc", "Bài học"
  coverImage: string;
  isPopular?: boolean;
  isNew?: boolean;
}

export interface VoiceItem {
  id: string;
  name: string;
  gender: 'Nam' | 'Nữ' | 'AI';
  region: 'Miền Bắc' | 'Miền Nam' | 'Miền Trung' | 'Toàn quốc';
  avatarUrl: string;
  audioSample?: string; // or simulated speech
}

export interface StyleItem {
  id: string;
  name: string;
  coverImage: string;
  promptDescription: string;
}

export interface WorkflowNode {
  id: string;
  type: 'script' | 'scene-character' | 'voice' | 'video' | 'export';
  label: string;
  icon: string;
  colorClass: string;
  bgColorClass: string;
  borderColorClass: string;
  details: string;
  image?: string;
}
