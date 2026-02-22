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
        background: 'linear-gradient(135deg, #2D004F 0%, #4A0080 40%, #6A0DAD 100%)',
        padding: '56px 80px',
        fontFamily: 'Pretendard',
        color: 'white',
      },
      children: [
        // Top: site URL
        {
          type: 'div',
          props: {
            style: { display: 'flex', fontSize: 18, color: 'rgba(255,255,255,0.4)', fontWeight: 400 },
            children: 'yoongjae.com/bts',
          },
        },
        // Center: hero keywords
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
              gap: 0,
            },
            children: [
              // "BTS" — largest element
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 120,
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                  },
                  children: 'BTS',
                },
              },
              // "광화문" — second largest
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 88,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    letterSpacing: '-0.01em',
                    marginTop: 4,
                  },
                  children: '광화문',
                },
              },
              // Subtitle line
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginTop: 20,
                  },
                  children: [
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: 26,
                          fontWeight: 700,
                          color: 'rgba(255,255,255,0.85)',
                        },
                        children: '콘서트 2026',
                      },
                    },
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: 26,
                          fontWeight: 400,
                          color: 'rgba(255,255,255,0.5)',
                        },
                        children: '·',
                      },
                    },
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: 26,
                          fontWeight: 400,
                          color: 'rgba(255,255,255,0.6)',
                        },
                        children: '완전 생존 가이드',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        // Bottom: badges
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: 24 },
            children: [
              {
                type: 'span',
                props: {
                  style: { fontSize: 20, color: 'rgba(255,255,255,0.55)', fontWeight: 400 },
                  children: '📅 3월 21일',
                },
              },
              {
                type: 'span',
                props: {
                  style: { fontSize: 20, color: 'rgba(255,255,255,0.55)', fontWeight: 400 },
                  children: '📍 광화문광장',
                },
              },
              {
                type: 'span',
                props: {
                  style: { fontSize: 20, color: 'rgba(255,255,255,0.55)', fontWeight: 400 },
                  children: '🎟️ 무료',
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
