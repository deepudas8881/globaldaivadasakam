export interface BroadcastStream {
  id: string;
  title: string;
  location: string;
  url: string;
  embedUrl: string;
  isPrimary: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'snf_broadcast_streams_v3';
const ACTIVE_STREAM_KEY = 'snf_active_stream_id_v3';
const BROADCAST_MODE_KEY = 'snf_broadcast_mode_v3';

export const MAX_STREAMS_LIMIT = Infinity;

// ONLY Sree Narayana Forum Germany Central Stage by default
// Other locations will only appear when created by the Admin in Admin Broadcast
export const DEFAULT_STREAMS: BroadcastStream[] = [
  {
    id: 'stream-germany-central',
    title: 'Sree Narayana Forum Germany Central Stage',
    location: 'Frankfurt / Cologne, Germany',
    url: 'https://www.youtube.com/watch?v=ddFv0lJKBqg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/ddFv0lJKBqg?autoplay=1&mute=0&enablejsapi=1&rel=0',
    isPrimary: true,
    createdAt: new Date().toISOString()
  }
];

export function extractVideoId(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (trimmed.includes('youtube.com/watch?v=')) {
    return trimmed.split('v=')[1]?.split('&')[0] || null;
  } else if (trimmed.includes('youtu.be/')) {
    return trimmed.split('youtu.be/')[1]?.split('?')[0] || null;
  } else if (trimmed.includes('youtube.com/live/')) {
    return trimmed.split('youtube.com/live/')[1]?.split('?')[0] || null;
  } else if (trimmed.includes('youtube.com/embed/')) {
    return trimmed.split('embed/')[1]?.split('?')[0] || null;
  }
  return null;
}

export function buildEmbedUrl(rawUrl: string, isMuted: boolean): string {
  const videoId = extractVideoId(rawUrl);
  if (videoId) {
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${isMuted ? '1' : '0'}&enablejsapi=1&rel=0`;
  }
  const clean = rawUrl.trim();
  if (clean.includes('?')) {
    return `${clean}&mute=${isMuted ? '1' : '0'}`;
  }
  return `${clean}?mute=${isMuted ? '1' : '0'}`;
}

export function toEmbedUrl(rawUrl: string, isMuted = true): string {
  return buildEmbedUrl(rawUrl, isMuted);
}

export function getStreams(): BroadcastStream[] {
  try {
    // Clear out old demo storage keys from earlier versions
    localStorage.removeItem('snf_broadcast_streams_v1');
    localStorage.removeItem('snf_broadcast_streams_v2');

    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STREAMS));
      return DEFAULT_STREAMS;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_STREAMS;
  }
}

export function addStream(
  title: string, 
  rawUrl: string, 
  location = 'Global Sanctuary'
): { success: boolean; message: string; stream?: BroadcastStream } {
  try {
    const streams = getStreams();
    if (streams.length >= MAX_STREAMS_LIMIT) {
      return { success: false, message: `Maximum limit of ${MAX_STREAMS_LIMIT} streams reached.` };
    }
    if (!rawUrl.trim()) {
      return { success: false, message: 'Stream URL is required.' };
    }

    const embedUrl = buildEmbedUrl(rawUrl, true);
    const newStream: BroadcastStream = {
      id: `stream-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim() || `Location Broadcast Feed #${streams.length + 1}`,
      location: location.trim() || 'Additional Live Center',
      url: rawUrl.trim(),
      embedUrl,
      isPrimary: streams.length === 0,
      createdAt: new Date().toISOString()
    };

    const updated = [...streams, newStream];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('snf-streams-updated'));
    return { success: true, message: 'Stream added successfully.', stream: newStream };
  } catch {
    return { success: false, message: 'Failed to save stream.' };
  }
}

export function deleteStream(id: string): boolean {
  try {
    console.log('Deleting stream with ID:', id);
    const streams = getStreams();
    const updated = streams.filter(s => s.id !== id);
    console.log('Streams after filter:', updated.length);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    const currentActiveId = getActiveStreamId();
    if (currentActiveId === id && updated.length > 0) {
      localStorage.setItem(ACTIVE_STREAM_KEY, updated[0].id);
    }
    
    // Dispatch event immediately
    window.dispatchEvent(new CustomEvent('snf-streams-updated'));
    console.log('Event snf-streams-updated dispatched');
    return true;
  } catch (err) {
    console.error('Failed to delete stream:', err);
    return false;
  }
}

export function resetToGermanyOnly(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STREAMS));
  localStorage.setItem(ACTIVE_STREAM_KEY, DEFAULT_STREAMS[0].id);
  window.dispatchEvent(new CustomEvent('snf-streams-updated'));
}

export function setActiveStreamId(id: string): void {
  localStorage.setItem(ACTIVE_STREAM_KEY, id);
  window.dispatchEvent(new CustomEvent('snf-streams-updated'));
}

export function getActiveStreamId(): string {
  const stored = localStorage.getItem(ACTIVE_STREAM_KEY);
  if (stored) return stored;
  const streams = getStreams();
  return streams[0]?.id || DEFAULT_STREAMS[0].id;
}

export function getActiveStream(): BroadcastStream | null {
  const activeId = getActiveStreamId();
  const streams = getStreams();
  return streams.find(s => s.id === activeId) || streams[0] || DEFAULT_STREAMS[0];
}

export function getBroadcastMode(): 'standby_song' | 'live_stream' {
  const mode = localStorage.getItem(BROADCAST_MODE_KEY);
  return mode === 'standby_song' ? 'standby_song' : 'live_stream';
}

export function setBroadcastMode(mode: 'standby_song' | 'live_stream'): void {
  localStorage.setItem(BROADCAST_MODE_KEY, mode);
  window.dispatchEvent(new CustomEvent('snf-streams-updated'));
}
