import { apiGet, apiPost } from './client';

export type TtsProvider = 'wavespeed' | 'elevenlabs' | 'vbee' | 'vivibe';

export interface VoiceItemDto {
  id: string;
  provider: TtsProvider;
  voiceId: string;
  name: string;
  gender: string | null;
  region: string | null;
  sampleUrl: string | null;
}

export interface ProviderInfo {
  id: TtsProvider;
  enabled: boolean;
}

export interface TtsParams {
  speed?: number;
  pitch?: number;
  emotion?: string;
}

/** Nhãn hiển thị cho provider. */
export const PROVIDER_LABELS: Record<TtsProvider, string> = {
  wavespeed: 'Giọng AI (mặc định)',
  elevenlabs: 'ElevenLabs',
  vbee: 'Vbee',
  vivibe: 'Vivibe',
};

export const EMOTIONS = [
  { value: '', label: 'Tự nhiên' },
  { value: 'happy', label: 'Vui vẻ' },
  { value: 'sad', label: 'Buồn' },
  { value: 'surprised', label: 'Ngạc nhiên' },
  { value: 'fearful', label: 'Sợ hãi' },
  { value: 'angry', label: 'Tức giận' },
];

export const voicesApi = {
  list: (provider?: TtsProvider) =>
    apiGet<{ voices: VoiceItemDto[] }>(`/api/voices${provider ? `?provider=${provider}` : ''}`),

  providers: () =>
    apiGet<{ providers: ProviderInfo[]; default: TtsProvider | null }>('/api/tts/providers'),

  preview: (input: { provider?: TtsProvider; voiceId: string; text: string } & TtsParams) =>
    apiPost<{ audioUrl: string; durationSec?: number }>('/api/tts/preview', input),

  /** Sinh giọng cho từng cảnh của 1 video. */
  assignToVideo: (
    videoId: string,
    input: { provider?: TtsProvider; voiceId: string; sceneIds?: string[] } & TtsParams,
  ) =>
    apiPost<{ ok: boolean; total: number; succeeded: number; errors: string[] }>(
      `/api/videos/${videoId}/voice`,
      input,
    ),
};
