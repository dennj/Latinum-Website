module.exports = {
  content: [
    './pages/**/*.{vue,js}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js}',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
    './content/**/*.md',
    "./formkit.theme.ts"
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
        screens: {
          lg: '1200px',
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography')
  ],
  daisyui: {
    themes: [
      {
        'latinum': {
          'primary': '#143d5c', // Navy Blue - Primary color representing trust and professionalism
          'primary-focus': '#FF00FF', // Magenta - Focus color for primary elements (hover, active)
          'primary-content': '#ffffff', // White - Text color for primary elements

          'secondary': '#1d5e8a', // Light Navy
          'secondary-focus': '#00FF00', // Lime Green - Focus color for secondary elements
          'secondary-content': '#ffffff', // White - Text color for secondary elements

          'accent': '#37cdbe', // Teal - Accent color for highlighting interactive elements
          'accent-focus': '#2aa79b', // Darker Teal - Focus color for accent elements
          'accent-content': '#ffffff', // White - Text color for accent elements

          'neutral': '#3d4451', // Charcoal Gray - Neutral color for general backgrounds
          'neutral-focus': '#2a2e37', // Darker Charcoal Gray - Focus color for neutral elements
          'neutral-content': '#ffffff', // White - Text color for neutral elements

          'base-100': '#ffffff', // White - Default background color
          'base-200': '#f9fafb', // Light Gray - Subtle background for sections
          'base-300': '#d1d5db', // Medium Gray - Dividers or muted backgrounds
          'base-content': '#1f2937', // Dark Gray - Text color on light backgrounds

          'info': '#2094f3', // Bright Blue - Info color for alerts or informative elements
          'success': '#009485', // Green - Success color indicating positive actions
          'warning': '#ff9900', // Orange - Warning color for cautions or notices
          'error': '#ff5724', // Red - Error color indicating critical issues
        },
      }
    ],
  },
};
