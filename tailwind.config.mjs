/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        carbon: {
          DEFAULT: '#1f2421',
          50: '#f5f6f5',
          100: '#e8e9e8',
          200: '#d1d3d1',
          300: '#a8aba8',
          400: '#6d716d',
          500: '#1f2421',
          600: '#1b201d',
          700: '#171a18',
          800: '#131513',
          900: '#0f110f',
        },
        stormy: {
          DEFAULT: '#216869',
          50: '#f0f9f9',
          100: '#d9f0f0',
          200: '#b3e1e2',
          300: '#80cccf',
          400: '#4dadb2',
          500: '#216869',
          600: '#1d5a5b',
          700: '#184b4c',
          800: '#133c3d',
          900: '#0f2f30',
        },
        seaweed: {
          DEFAULT: '#49a078',
          50: '#f3f9f6',
          100: '#dff1e8',
          200: '#c0e3d1',
          300: '#91cfb2',
          400: '#6ab693',
          500: '#49a078',
          600: '#3c8560',
          700: '#316a4e',
          800: '#27543f',
          900: '#204435',
        },
        muted: {
          DEFAULT: '#9cc5a1',
          50: '#f7faf7',
          100: '#ecf4ed',
          200: '#d9e9db',
          300: '#bdd7c1',
          400: '#9cc5a1',
          500: '#7fb186',
          600: '#65976d',
          700: '#507a57',
          800: '#416147',
          900: '#36503b',
        },
        alabaster: {
          DEFAULT: '#dce1de',
          50: '#f9faf9',
          100: '#dce1de',
          200: '#c7cdc9',
          300: '#b2b9b5',
          400: '#9da5a0',
          500: '#88918b',
          600: '#6d7672',
          700: '#565d5a',
          800: '#404543',
          900: '#2f3432',
        },
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        112: '28rem',
        128: '32rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'strong': '0 8px 32px rgba(0, 0, 0, 0.16)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-in',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-10px)', opacity: '0' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionDuration: {
        '400': '400ms',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function ({ addBase, theme }) {
      addBase({
        // Focus states for accessibility
        ':focus-visible': {
          outline: 'none',
          '--tw-ring-offset-shadow': `var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)`,
          '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) ${theme('colors.stormy.DEFAULT')}`,
          'boxShadow': `var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)`,
        },
        // Typography improvements
        'h1, h2, h3, h4, h5, h6': {
          textWrap: 'balance',
        },
        // Smooth scrolling with proper offset for fixed header
        'html': {
          scrollBehavior: 'smooth',
          scrollPaddingTop: '5rem',
        },
        // Remove double-tap zoom delay on mobile
        'button, a': {
          touchAction: 'manipulation',
        },
      });
    },
  ],
}
