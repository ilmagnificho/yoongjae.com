export interface CardSettings {
  seriesName: string;
  date: string;
  brandName: string;
  categoryTag: string;
  accentColor: string;
  bgOverlayOpacity: number;
}

export interface TextBlock {
  id: string;
  content: string; // supports \n for line breaks
  fontSize: number;
  fontWeight: number;
  color: string;
  isAccent: boolean;
  lineHeight: number;
  letterSpacing: number;
  textAlign: 'left' | 'center' | 'right';
}

export interface CardData {
  id: string;
  bgImage: string;
  bgScale: number;
  bgPositionX: number;
  bgPositionY: number;
  bgBrightness: number;
  bgContrast: number;
  overlayOpacity: number;
  textBlocks: TextBlock[];
  verticalAlign: 'top' | 'center' | 'bottom';
}

export interface ProjectData {
  settings: CardSettings;
  cards: CardData[];
  cardCount: number;
}

export interface ImageSearchResult {
  id: string;
  url: string;
  thumbUrl: string;
  alt: string;
  photographer: string;
  source: string;
}
