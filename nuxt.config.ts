// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt'],

  devtools: {
    enabled: true
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Yahya Baltacı',
      meta: [
        {
          name: 'description',
          content: 'Yazılım, mühendislik, yaşam ve seyahat üzerine kişisel notlar.'
        }
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600;6..72,700&family=Public+Sans:wght@400;500;600;700&display=swap'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png?v=2'
        },
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico?v=2'
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png?v=2'
        },
        {
          rel: 'preconnect',
          href: 'https://images.unsplash.com',
          crossorigin: ''
        },
        { rel: 'dns-prefetch', href: 'https://images.unsplash.com' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    backendOrigin: 'http://localhost:5000',

    public: {
      apiBase: 'http://localhost:5000/api'
    }
  },

  compatibilityDate: '2026-06-30',

  vite: {
    optimizeDeps: {
      include: [
        '@nuxt/ui > prosemirror-state',
        '@nuxt/ui > prosemirror-transform',
        '@nuxt/ui > prosemirror-model',
        '@nuxt/ui > prosemirror-view',
        '@nuxt/ui > prosemirror-gapcursor'
      ]
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
