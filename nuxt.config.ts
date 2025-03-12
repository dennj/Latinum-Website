import type { ModuleOptions as SitemapModuleOptions } from '@nuxtjs/sitemap';

export default defineNuxtConfig({
  app: {
    head: {
      title: 'LAtinum AI',
      meta: [
        { name: 'description', content: 'Latinum.ai enables seamless agent-to-agent (A2A) and business-to-agent (B2A) payments, fully compatible with MCP servers for secure and efficient financial transactions.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon-32x32.svg' }
      ]
    }
  },

  nitro: {
    compatibilityDate: '2025-01-19',
    compressPublicAssets: true,
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: [
    '@nuxtjs/sitemap',
    '@nuxt/image',
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    'nuxt-gtag',
    '@formkit/nuxt',
    'nuxt-resend',
    '@nuxtjs/robots',
    '@nuxt/content',
    '@vueuse/nuxt',
  ],

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false
  },

  site: {
    url: 'https://latinum.ai',
    name: 'Latinum',
    gzip: true,
    autoLastmod: true,
  },

  image: {
    formats: ['avif', 'webp'],
  },

  gtag: {
    //id: 'G-ZDXSPVM1D8'
  },

  compatibilityDate: '2025-03-09',
});