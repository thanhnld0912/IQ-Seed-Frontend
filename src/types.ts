export interface VideoItem {
  id: string;
  title: string;
  date: string;
  duration: string; // e.g. "02:45"
  style: string; // e.g. "Anime", "3D Clay"
  prompt: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  status: 'queued' | 'rendering' | 'completed';
  progress: number; // 0 to 100
  voiceId: string;
  coverImage: string;
  category?: string;
  expirationDaysLeft?: number;
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
  type: 'scene' | 'voice' | 'music' | 'slide' | 'export';
  label: string;
  icon: string;
  colorClass: string;
  bgColorClass: string;
  borderColorClass: string;
  details: string;
  image?: string;
}
