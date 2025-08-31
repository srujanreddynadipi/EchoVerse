const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  
  // Admin
  ADMIN_LOGIN: `${API_BASE_URL}/admin/login`,
  RECENT_USERS: `${API_BASE_URL}/admin/recent-users`,
  
  // Text and Audio
  REWRITE: `${API_BASE_URL}/rewrite`,
  SYNTHESIZE: `${API_BASE_URL}/synthesize`,
  
  // History & Downloads
  HISTORY: `${API_BASE_URL}/history`,
  DOWNLOADS: `${API_BASE_URL}/downloads`,
  
  // Study Materials
  PROCESS_STUDY_MATERIAL: `${API_BASE_URL}/process-study-material`,
  GENERATE_TOPIC_AUDIO: `${API_BASE_URL}/generate-topic-audio`,
  
  // Story Narration
  STORY_NARRATION: `${API_BASE_URL}/story-narration`,
  STORY_NARRATION_AUDIO: `${API_BASE_URL}/story-narration-audio`,
  STORY_NARRATION_MERGED: `${API_BASE_URL}/story-narration-merged`,
  
  // Voices
  VOICES: `${API_BASE_URL}/voices`,
  TONES: `${API_BASE_URL}/tones`,
  
  // Debug
  DEBUG_VOICE_INFO: `${API_BASE_URL}/debug/voice-installation-info`,
  DEBUG_SYSTEM_VOICES: `${API_BASE_URL}/debug/system-voices`,
  DEBUG_TEST_VOICES: `${API_BASE_URL}/debug/test-all-voices`,
};

export const getAudioUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};
