import { useState, useCallback } from 'react';
import { searchImages } from './utils';

interface ImageSearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  accentColor: string;
}

interface SearchResult {
  id: string;
  url: string;
  thumbUrl: string;
  alt: string;
  photographer: string;
}

export default function ImageSearchModal({ open, onClose, onSelect, accentColor }: ImageSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const imgs = await searchImages(query.trim());
      setResults(imgs);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#1a1a1a', borderRadius: 16, padding: 24, width: 640, maxWidth: '90vw',
          maxHeight: '80vh', display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, color: '#fff', fontSize: 18 }}>이미지 검색</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', fontSize: 24, cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="검색어를 입력하세요 (예: business, technology, finance)"
            style={{ flex: 1, background: '#222', border: '1px solid #444', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14 }}
            autoFocus
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              background: accentColor, color: '#000', border: 'none', borderRadius: 8,
              padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 14, whiteSpace: 'nowrap',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? '검색중...' : '검색'}
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>검색 중...</div>
          )}
          {!loading && searched && results.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>결과가 없습니다. 다른 키워드로 검색해보세요.</div>
          )}
          {!loading && results.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {results.map((img) => (
                <div
                  key={img.id}
                  onClick={() => { onSelect(img.url); onClose(); }}
                  style={{
                    cursor: 'pointer', borderRadius: 8, overflow: 'hidden', position: 'relative',
                    aspectRatio: '1', background: '#222',
                  }}
                >
                  <img
                    src={img.thumbUrl}
                    alt={img.alt}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.2s' }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    padding: '16px 8px 6px', fontSize: 10, color: '#ccc',
                  }}>
                    {img.photographer}
                  </div>
                </div>
              ))}
            </div>
          )}
          {!searched && !loading && (
            <div style={{ textAlign: 'center', padding: 40, color: '#666', fontSize: 13 }}>
              카드 내용에 맞는 이미지를 검색하세요.<br />
              영어 키워드가 더 많은 결과를 보여줍니다.
            </div>
          )}
        </div>

        <div style={{ marginTop: 12, fontSize: 11, color: '#555', textAlign: 'center' }}>
          Powered by Unsplash
        </div>
      </div>
    </div>
  );
}
