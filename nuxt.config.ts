// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt', '@vercel/analytics/nuxt'],

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
          content: 'Teknoloji, yaşam ve seyahat üzerine kişisel yazılar.'
        }
      ],
      link: [
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

  icon: {
    clientBundle: {
      // Dynamic :name bindings are not auto-scanned into the client bundle.
      icons: [
        'lucide:map-pin',
        'lucide:graduation-cap',
        'lucide:radar',
        'lucide:code-2',
        'lucide:plane'
      ]
    }
  },

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
