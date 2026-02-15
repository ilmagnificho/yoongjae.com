/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAFAF9',
        ink: '#171717',
        accent: {
          orange: '#FF6719',
          blue: '#2563EB',
        },
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'Pretendard', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
