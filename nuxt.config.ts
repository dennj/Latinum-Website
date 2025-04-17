// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/content',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@vueuse/nuxt',
    '@nuxtjs/seo',
    '@nuxtjs/supabase',
  ],

  imports: {
    presets: [
      {
        from: 'vue-sonner',
        imports: ['toast'],
      },
    ],
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: 'latinum.ai',
    defaultLocale: 'en',
    indexable: true,
  },

  colorMode: {
    preference: 'dark',
    fallback: 'dark',
  },

  content: {
    renderer: {
      anchorLinks: false,
    }
  },

  routeRules: {
    // Needed to activate preview on Nuxt Studio
    '/': { prerender: false },
  },

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-11-27',

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false
  },

  nitro: {
    experimental: {
      websocket: true,
    },
    prerender: {
      autoSubfolderIndex: false,
      crawlLinks: true,
      routes: ['/'],
    },
  },
})