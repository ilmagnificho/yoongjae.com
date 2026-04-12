export interface Theme {
  name: string;
  bg: string;
  accent: string;
  text: string;
  sub: string;
  muted: string;
  tagBg: string;
  tagText: string;
}

export const THEMES: Record<string, Theme> = {
  ianpark: {
    name: 'VC Morning',
    bg: '#0a0a0a',
    accent: '#F5C518',
    text: '#ffffff',
    sub: '#cccccc',
    muted: '#888888',
    tagBg: '#F5C518',
    tagText: '#000000',
  },
  midnight: {
    name: 'Midnight',
    bg: '#0f0f2e',
    accent: '#6c5ce7',
    text: '#ffffff',
    sub: '#b8b8d0',
    muted: '#6b6b8d',
    tagBg: '#6c5ce7',
    tagText: '#ffffff',
  },
  ember: {
    name: 'Ember',
    bg: '#1a0e0a',
    accent: '#ff6b35',
    text: '#ffffff',
    sub: '#c8a08a',
    muted: '#7a5a44',
    tagBg: '#ff6b35',
    tagText: '#ffffff',
  },
  forest: {
    name: 'Forest',
    bg: '#0a1a0e',
    accent: '#2ecc71',
    text: '#ffffff',
    sub: '#8ac8a0',
    muted: '#4a7a5a',
    tagBg: '#2ecc71',
    tagText: '#000000',
  },
  obsidian: {
    name: 'Obsidian',
    bg: '#0a0a0a',
    accent: '#e0e0e0',
    text: '#ffffff',
    sub: '#a0a0a0',
    muted: '#555555',
    tagBg: '#e0e0e0',
    tagText: '#000000',
  },
};

export const DEFAULT_THEME = 'ianpark';
