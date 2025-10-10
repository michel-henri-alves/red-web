export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }, // move todo o conteúdo
        },
      },
      animation: {
        marquee: 'marquee 20s linear infinite', // duração padrão
      },
    },
  },
  plugins: [],
}
