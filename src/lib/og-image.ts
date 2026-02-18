import satori from 'satori';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

// Font loading (cached)
let fontsLoaded: { name: string; data: ArrayBuffer; weight: 700 | 400; style: 'normal' }[] | null = null;

function loadFonts() {
  if (fontsLoaded) return fontsLoaded;

  const fontDir = path.resolve('src/assets/fonts');

  fontsLoaded = [
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

  return fontsLoaded;
}

interface OgImageOptions {
  title: string;
  description?: string;
  label?: string;
}

export async function generateOgImage({ title, description, label }: OgImageOptions): Promise<Buffer> {
  const fonts = loadFonts();

  const fontSize = title.length > 30 ? 48 : 56;

  // Build children for the middle content section
  const middleChildren: any[] = [];

  if (label) {
    middleChildren.push({
      type: 'div',
      props: {
        style: {
          fontSize: 18,
          color: 'rgba(26,26,26,0.4)',
          fontWeight: 400,
          letterSpacing: 2,
        },
        children: label,
      },
    });
  }

  middleChildren.push({
    type: 'div',
    props: {
      style: {
        fontSize,
        fontWeight: 700,
        color: '#1A1A1A',
        lineHeight: 1.25,
      },
      children: title,
    },
  });

  if (description) {
    middleChildren.push({
      type: 'div',
      props: {
        style: {
          fontSize: 24,
          color: 'rgba(26,26,26,0.5)',
          lineHeight: 1.5,
          fontWeight: 400,
        },
        children: description,
      },
    });
  }

  const element = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#F5F0EB',
        padding: '72px 80px',
        fontFamily: 'Pretendard',
      },
      children: [
        // Top: brand
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: 10 },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 32,
                    height: 32,
                    backgroundColor: '#1A1A1A',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#F5F0EB',
                    fontSize: 16,
                    fontWeight: 700,
                  },
                  children: 'Y',
                },
              },
              {
                type: 'span',
                props: {
                  style: { fontSize: 20, color: 'rgba(26,26,26,0.45)', fontWeight: 400 },
                  children: 'yoongjae.com',
                },
              },
            ],
          },
        },
        // Middle: content
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
            children: middleChildren,
          },
        },
        // Bottom: tagline + accent bar
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
            children: [
              {
                type: 'span',
                props: {
                  style: { fontSize: 16, color: 'rgba(26,26,26,0.3)', fontWeight: 400 },
                  children: 'Investor & Builder',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    width: 48,
                    height: 4,
                    backgroundColor: '#FF6719',
                    borderRadius: 2,
                  },
                },
              },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(element as any, {
    width: 1200,
    height: 630,
    fonts,
  });

  const png = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer();
  return png;
}
