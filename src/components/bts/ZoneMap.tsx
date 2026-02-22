import { useEffect, useRef } from 'react';
import type { BtsLang } from './translations';
import { getT } from './translations';

interface Props {
  lang: BtsLang;
}

const CLIENT_ID = 'YLkaBhluuIKERSg15PlJN2aPYK67kQohmmAeOJds';

const WEST = 126.9748;
const EAST = 126.9790;

const ZONES_GEO = [
  { key: 'core', color: '#4A0080', north: 37.5768, south: 37.5743 },
  { key: 'hot', color: '#6A0DAD', north: 37.5743, south: 37.5722 },
  { key: 'warm', color: '#9B59B6', north: 37.5722, south: 37.5700 },
  { key: 'cold', color: '#C39BD3', north: 37.5700, south: 37.5670 },
] as const;

const ZONES_UI = [
  { key: 'core', color: '#4A0080', bg: 'bg-[#4A0080]' },
  { key: 'hot', color: '#6A0DAD', bg: 'bg-[#6A0DAD]' },
  { key: 'warm', color: '#9B59B6', bg: 'bg-[#9B59B6]' },
  { key: 'cold', color: '#C39BD3', bg: 'bg-[#C39BD3]' },
] as const;

const CLOSED_STATIONS = [
  { name: 'Gwanghwamun', lat: 37.5707, lng: 126.9780 },
  { name: 'Gyeongbokgung', lat: 37.5759, lng: 126.9738 },
  { name: 'City Hall', lat: 37.5660, lng: 126.9774 },
];

const ALT_STATIONS = [
  { name: 'Jongak', lat: 37.5701, lng: 126.9828 },
  { name: 'Anguk', lat: 37.5764, lng: 126.9870 },
  { name: 'Euljiro 1-ga', lat: 37.5660, lng: 126.9824 },
];

export default function ZoneMap({ lang }: Props) {
  const t = getT(lang);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !window.naver?.maps) return;
      if (mapInstance.current) return;

      const { maps } = window.naver;
      const map = new maps.Map(mapRef.current, {
        center: new maps.LatLng(37.5720, 126.9769),
        zoom: 15,
        mapTypeControl: false,
        scaleControl: false,
        logoControl: false,
        mapDataControl: false,
      });
      mapInstance.current = map;

      // Zone polygons
      ZONES_GEO.forEach((z) => {
        new maps.Polygon({
          map,
          paths: [
            new maps.LatLng(z.north, WEST),
            new maps.LatLng(z.north, EAST),
            new maps.LatLng(z.south, EAST),
            new maps.LatLng(z.south, WEST),
          ],
          fillColor: z.color,
          fillOpacity: 0.45,
          strokeColor: z.color,
          strokeWeight: 1,
          strokeOpacity: 0.7,
        });
      });

      // Stage marker
      new maps.Marker({
        position: new maps.LatLng(37.5768, 126.9769),
        map,
        icon: {
          content: '<div style="background:#111;color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:bold;white-space:nowrap">🎤 STAGE</div>',
          anchor: new maps.Point(30, 15),
        },
      });

      // Closed station markers
      CLOSED_STATIONS.forEach((s) => {
        new maps.Marker({
          position: new maps.LatLng(s.lat, s.lng),
          map,
          icon: {
            content: `<div style="background:#fee2e2;color:#dc2626;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:bold;border:1px solid #fca5a5;white-space:nowrap">❌ ${s.name}</div>`,
            anchor: new maps.Point(40, 12),
          },
        });
      });

      // Alternative station markers
      ALT_STATIONS.forEach((s) => {
        new maps.Marker({
          position: new maps.LatLng(s.lat, s.lng),
          map,
          icon: {
            content: `<div style="background:#dcfce7;color:#16a34a;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:bold;border:1px solid #86efac;white-space:nowrap">✅ ${s.name}</div>`,
            anchor: new maps.Point(40, 12),
          },
        });
      });
    };

    if (window.naver?.maps) {
      initMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${CLIENT_ID}`;
    script.onload = () => initMap();
    document.head.appendChild(script);
  }, []);

  return (
    <section id="zone-map" className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-2">{t('zone.title')}</h2>
      <p className="text-sm text-gray-500 mb-6">{t('zone.note')}</p>

      {/* Naver Map */}
      <div
        ref={mapRef}
        className="w-full rounded-2xl overflow-hidden border border-gray-200"
        style={{ height: 420 }}
      />

      {/* Zone legend cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {ZONES_UI.map((zone) => (
          <div
            key={zone.key}
            className={`${zone.bg} text-white rounded-xl p-3`}
          >
            <p className="text-sm font-bold">{t(`zone.${zone.key}`)}</p>
            <p className="text-xs text-white/70 mt-0.5">{t(`zone.${zone.key}.area`)}</p>
            <p className="text-xs text-white/50 mt-1">{t(`zone.${zone.key}.time`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
