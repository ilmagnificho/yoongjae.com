import type { APIRoute } from 'astro';
import satori from 'satori';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

export const GET: APIRoute = async () => {
  const fontDir = path.resolve('src/assets/fonts');
  const fonts = [
    {
      name: 'Pretendard',
      data: fs.readFileSync(path.join(fontDir, 'Pretendard-Bold.woff')),
      weight: 700 as const,
      style: 'normal' as const,
    },
    {
      name: 'Pretendard',
      data: fs.readFileSync(path.join(fontDir, 'Pretendard-Regular.woff')),
      weight: 400 as const,
      style: 'normal' as const,
    },
  ];

  const element = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #4A0080 0%, #6A0DAD 100%)',
        padding: '72px 80px',
        fontFamily: 'Pretendard',
        color: 'white',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: 10 },
            children: [
              {
                type: 'span',
                props: {
                  style: { fontSize: 20, color: 'rgba(255,255,255,0.5)', fontWeight: 400 },
                  children: 'yoongjae.com/bts',
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
              gap: 16,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: { fontSize: 22, color: 'rgba(255,255,255,0.6)', fontWeight: 400 },
                  children: 'BTS Gwanghwamun Concert 2026',
                },
              },
              {
                type: 'div',
                props: {
                  style: { fontSize: 56, fontWeight: 700, lineHeight: 1.2 },
                  children: '💜 Complete Survival Guide',
                },
              },
              {
                type: 'div',
                props: {
                  style: { fontSize: 24, color: 'rgba(255,255,255,0.6)', fontWeight: 400, marginTop: 8 },
                  children: '📅 March 21  ·  📍 Gwanghwamun Square  ·  🎟️ FREE',
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
            children: [
              {
                type: 'span',
                props: {
                  style: { fontSize: 16, color: 'rgba(255,255,255,0.35)', fontWeight: 400 },
                  children: 'EN / 한국어 / 日本語',
                },
              },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', width: 48, height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 },
                },
              },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(element as any, { width: 1200, height: 630, fonts });
  const png = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
