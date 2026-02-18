/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        paper: '#F5F0EB',
        ink: '#1A1A1A',
        accent: {
          orange: '#FF6719',
          blue: '#2563EB',
        },
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['NanumSquareNeo', 'Inter', 'Pretendard', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
