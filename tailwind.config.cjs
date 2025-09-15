/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'custom-black': 'var(--black)',
        'custom-white': 'var(--white)',
        'off-black': 'var(--off-black)',
        'off-white': 'var(--off-white)',
        'custom-yellow': 'var(--yellow)',
        'custom-red': 'var(--red)',
        'custom-teal': 'var(--teal)',
        'trans-black': 'var(--trans-black)',
        'background-color': 'var(--background-color)',
        'text-color': 'var(--text-color)',
        'accent-color': 'var(--accent-color)',
        'accent-color-light': 'var(--accent-color-light)',
        'border-color': 'var(--border-color)',
      },
      borderWidth: {
        'custom': 'var(--border-width)',
        'custom-2': 'var(--border-width-2)',
      },
      maxWidth: {
        'container': 'var(--container-width)',
        'element-1': 'var(--element-width-1)',
        'element-2': 'var(--element-width-2)',
      },
      spacing: {
        'padding-1': 'var(--padding-1)',
        'padding-2': 'var(--padding-2)',
        'padding-3': 'var(--padding-3)',
        'ar-ui-1': 'var(--ar-ui-size-1)',
        'ar-ui-2': 'var(--ar-ui-size-2)',
      },
      boxShadow: {
        'custom': 'var(--shadow-1)',
      },
      screens: {
        'breakpoint-1': 'var(--breakpoint-1)',
        'breakpoint-2': 'var(--breakpoint-2)',
        'breakpoint-3': 'var(--breakpoint-3)',
      },
      fontFamily: {
        'kode-mono': ['Kode Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}